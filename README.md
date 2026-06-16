# Thermal Urbanization and Urban Heat Island Analysis in Kathmandu Valley

## 📍 Overview
This repository presents a multi-variable analysis of Urban Heat Island (UHI) dynamics in Kathmandu Valley, Nepal, using Landsat 8 satellite data and Google Earth Engine (GEE). The study investigates the relationships between Land Surface Temperature (LST), vegetation (NDVI), and built-up surfaces (NDBI), incorporating statistical modeling and machine learning approaches.

---
![Study Area](https://github.com/thapawan/Urban-Heat-Island-Kathmandu-Landsat-GEE/blob/main/Data/Figure_Study_Area_Final.png)

## 🎯 Objectives
- Derive Land Surface Temperature (LST) using Landsat 8 thermal data
- Analyze vegetation and built-up patterns using NDVI and NDBI
- Quantify Urban Heat Island (UHI) intensity using Z-score normalization
- Examine statistical relationships (NDVI–LST, NDBI–LST)
- Apply multivariate regression to assess combined effects
- Implement Random Forest classification for urban mapping

---

## 🛰️ Data Sources
- Landsat 8 OLI/TIRS (USGS)
- SRTM DEM (NASA)
- Processed using Google Earth Engine (GEE)

---

## ⚙️ Methodology

### 1. Preprocessing
- Cloud filtering (<20% cloud cover)
- Radiometric scaling
- Thermal band conversion

### 2. Index Calculation
- NDVI (Vegetation Index)
- NDBI (Built-up Index)
- LST (Emissivity-corrected)

### 3. UHI Estimation
- Standardized Z-score method

### 4. Statistical Analysis
- Pearson correlation:
  - NDVI–LST
  - NDBI–LST
- Multivariate regression

### 5. Machine Learning
- Random Forest classification (urban vs non-urban)

---

## 📊 Key Results

| Relationship | R² | Interpretation |
|------------|----|----------------|
| NDVI–LST | 0.03 | Weak cooling influence |
| NDBI–LST | 0.12 | Moderate heating influence |
| NDVI + NDBI → LST | Improved | Multi-factor control |

✔ Built-up areas show stronger control on temperature  
✔ Vegetation provides localized cooling  
✔ Urban heat is controlled by multiple interacting factors  

---

## 🗺️ Figures

### 🌡️ Land Surface Temperature (LST)
![LST Map](https://github.com/thapawan/Urban-Heat-Island-Kathmandu-Landsat-GEE/blob/main/Results/fig_lst_map_final.png)

### 🌿 Vegetation (NDVI)
![NDVI Map](https://github.com/thapawan/Urban-Heat-Island-Kathmandu-Landsat-GEE/blob/main/Results/fig_ndvi_map_final.png)

### 📉 NDVI vs LST
![NDVI Scatter](https://github.com/thapawan/Urban-Heat-Island-Kathmandu-Landsat-GEE/blob/main/Results/fig_ndvi_lst_reg.png)

### 📈 Urban Heat Island
![UHI Map](https://github.com/thapawan/Urban-Heat-Island-Kathmandu-Landsat-GEE/blob/main/Results/fig_uhi_map_final.png)

### 🌐 Multivariate Relationship
![3D Plot](https://github.com/thapawan/Urban-Heat-Island-Kathmandu-Landsat-GEE/blob/main/Results/fig_3d_relationship.png)

---

## 📦 Repository Structure

├── gee_scripts/
│   ├── lst_ndvi_ndbi.js
│   ├── uhi_analysis.js
│
├── python_analysis/
│   ├── regression_plots.py
│   ├── map_plotting.py
│
├── data/
│   ├── Kathmandu_UHI_Sample.csv
│
├── figures/
│   ├── fig_lst_map_final.png
│   ├── fig_ndvi_map_final.png
│   ├── fig_uhi_map_final.png
│   ├── fig_ndbi_lst_reg.png
│
└── README.md

---

## 🌍 Significance

This study demonstrates that:
- Urban heat in Kathmandu is dominated by built-up expansion
- Vegetation alone cannot fully mitigate thermal stress
- Multi-variable approaches are essential for urban climate analysis
- Google Earth Engine provides scalable solutions for climate monitoring

---

## 📚 Citation

If you use this repository, please cite:

> Thapa, P. (2026). Thermal Urbanization and Vegetation Dynamics in Kathmandu Valley. [Chapter Preparation]

---

## 💡 Tools & Technologies
- Google Earth Engine (GEE)
- Python (Pandas, Matplotlib, Seaborn)
- Landsat 8
- Remote sensing & GIS

---

## 📌 License
MIT License
