/*******************************************************
 * Project: Urban Heat Island Analysis - Kathmandu Valley
 * Platform: Google Earth Engine (GEE)
 * Author: Pawan Thapa
 * Description:
 * This script computes Land Surface Temperature (LST),
 * NDVI, NDBI, and Urban Heat Island (UHI) intensity
 * using Landsat 8 imagery.
 *******************************************************/

/***************************************
 * 1. STUDY AREA
 ***************************************/
var roi = ee.Geometry.Rectangle([85.1, 27.55, 85.6, 27.85]);
Map.centerObject(roi, 10);

/***************************************
 * 2. LOAD LANDSAT 8 DATA
 ***************************************/
function loadLandsat(start, end) {
  return ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
    .filterBounds(roi)
    .filterDate(start, end)
    .filter(ee.Filter.lt('CLOUD_COVER', 20));
}

/***************************************
 * 3. PREPROCESSING
 ***************************************/
function preprocess(image) {
  var optical = image.select('SR_B.*')
    .multiply(0.0000275).add(-0.2);

  var thermal = image.select('ST_B10')
    .multiply(0.00341802).add(149.0)
    .rename('BT');

  return image.addBands(optical, null, true)
              .addBands(thermal);
}

/***************************************
 * 4. COMPUTE NDVI & NDBI
 ***************************************/
function addIndices(image) {
  var ndvi = image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI');
  var ndbi = image.normalizedDifference(['SR_B6', 'SR_B5']).rename('NDBI');

  return image.addBands([ndvi, ndbi]);
}

/***************************************
 * 5. LAND SURFACE TEMPERATURE (LST)
 ***************************************/
function computeLST(image) {

  var ndvi = image.select('NDVI');

  var stats = ndvi.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: roi,
    scale: 30,
    bestEffort: true
  });

  var ndvi_min = ee.Number(stats.get('NDVI_min'));
  var ndvi_max = ee.Number(stats.get('NDVI_max'));

  var pv = ndvi.subtract(ndvi_min)
               .divide(ndvi_max.subtract(ndvi_min))
               .pow(2);

  var emissivity = pv.multiply(0.004).add(0.986);

  var lst = image.select('BT')
    .divide(
      ee.Image(1).add(
        image.select('BT')
          .multiply(0.00115)
          .divide(1.438)
          .multiply(emissivity.log())
      )
    )
    .rename('LST_K');

  return image.addBands(lst);
}

/***************************************
 * 6. GENERATE DATASET (SUMMER 2019)
 ***************************************/
var dataset = loadLandsat('2019-05-01', '2019-08-30')
  .map(preprocess)
  .map(addIndices)
  .map(computeLST)
  .median()
  .clip(roi);

/***************************************
 * 7. CONVERT TO CELSIUS
 ***************************************/
var datasetC = dataset.addBands(
  dataset.select('LST_K').subtract(273.15).rename('LST')
);

/***************************************
 * 8. TOPOGRAPHIC MASK
 ***************************************/
var dem = ee.Image('USGS/SRTMGL1_003');
var lowlandMask = dem.lt(1800);

datasetC = datasetC.updateMask(lowlandMask);

/***************************************
 * 9. URBAN MASK
 ***************************************/
var urbanMask = datasetC.select('NDBI').gt(0);

/***************************************
 * 10. UHI (Z-SCORE)
 ***************************************/
var stats = datasetC.select('LST').reduceRegion({
  reducer: ee.Reducer.mean().combine({
    reducer2: ee.Reducer.stdDev(),
    sharedInputs: true
  }),
  geometry: roi,
  scale: 30,
  bestEffort: true
});

var mean = ee.Number(stats.get('LST_mean'));
var std = ee.Number(stats.get('LST_stdDev'));

var uhi = datasetC.select('LST')
  .subtract(mean)
  .divide(std)
  .rename('UHI');

datasetC = datasetC.addBands(uhi);

/***************************************
 * 11. VISUALIZATION
 ***************************************/
Map.addLayer(datasetC.select('NDVI'),
  {min:-1, max:1, palette:['blue','white','green']},
  'NDVI');

Map.addLayer(datasetC.select('LST'),
  {min:15, max:40, palette:['blue','yellow','red']},
  'LST (°C)');

Map.addLayer(uhi,
  {min:-2, max:2, palette:['blue','white','red']},
  'UHI');

/***************************************
 * 12. EXPORT DATA
 ***************************************/
Export.image.toDrive({
  image: datasetC.select('LST'),
  description: 'LST_Map',
  region: roi,
  scale: 30,
  maxPixels: 1e13
});
