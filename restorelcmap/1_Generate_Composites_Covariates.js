var composites_functions = require("users/hadicu06/RESTORE_cleaned:1_Generate_Composites_Covariates_Functions.js")

// Big thanks to Arga! (pejabat)
var classification_regions = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/classification_regions");

print("classification_regions", classification_regions)

var Sumatera = classification_regions.filterMetadata("region_name", "equals", "Sumatera").first();
var Kalimantan = classification_regions.filterMetadata("region_name", "equals", "Kalimantan").first();
var JawaBali = classification_regions.filterMetadata("region_name", "equals", "JawaBali").first();
var Sulawesi = classification_regions.filterMetadata("region_name", "equals", "Sulawesi").first();
var Nusa = classification_regions.filterMetadata("region_name", "equals", "Nusa").first();
var Maluku = classification_regions.filterMetadata("region_name", "equals", "Maluku").first();
var Papua = classification_regions.filterMetadata("region_name", "equals", "Papua").first();


// Reference map grid and country's land mask
var land_mask = ee.Image("users/hadicu06/IIASA/RESTORE/miscellaneous/land_mask");


// Landsat grid
var ls_img = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/ls_composite_2018_byRegion").first();

var landsat_scale = ls_img.projection().nominalScale();
var landsat_crs = ls_img.projection().crs();

print("landsat_scale", landsat_scale);
print("landsat_crs", landsat_crs);




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// I. GENERATE LANDSAT COMPOSITE, SPECTRAL FEATURES, AND TEMPORAL FEATURES ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Function signature: makeLandsatComposite(aoiGeom, startDateStr, endDateStr, sceneMaxCloudPercNum, sensorsStr)
 * Example call: composites_functions.makeLandsatComposite(Nusa.geometry(), "2018-01-01", "2018-12-31", 100, "L7,L8")
 * Note 'sensorsStr' is either "L5", "L7", "L8", "L5,L7", or "L7,L8"
*/



// (example for one region, exports for all regions already done)

print("Nusa", Nusa);

var ls_2010_nusa_L5 = composites_functions.makeLandsatComposite(
  Nusa.geometry(), "2010-01-01", "2010-12-31", 100, "L5");

var ls_2010_nusa_L57 = composites_functions.makeLandsatComposite(
  Nusa.geometry(), "2010-01-01", "2010-12-31", 100, "L5,L7");
  
var ls_2018_nusa_L8 = composites_functions.makeLandsatComposite(
  Nusa.geometry(), "2018-01-01", "2018-12-31", 100, "L8");

var ls_2018_nusa_L78 = composites_functions.makeLandsatComposite(
  Nusa.geometry(), "2018-01-01", "2018-12-31", 100, "L7,L8");
  
  
print("ls_2018_nusa_L78", ls_2018_nusa_L78)


  
Map.centerObject(Nusa);
Map.setOptions('SATELLITE')

Map.addLayer(ls_2010_nusa_L5, {bands:['red_median', 'green_median', 'blue_median'], min:0, max:1500}, 'ls_2010_nusa_L5');
Map.addLayer(ls_2010_nusa_L57, {bands:['red_median', 'green_median', 'blue_median'], min:0, max:1500}, 'ls_2010_nusa_L57');
Map.addLayer(ls_2018_nusa_L8, {bands:['red_median', 'green_median', 'blue_median'], min:0, max:1500}, 'ls_2018_nusa_L8');
Map.addLayer(ls_2018_nusa_L78, {bands:['red_median', 'green_median', 'blue_median'], min:0, max:1500}, 'ls_2018_nusa_L78');




// // Export to Asset 

// Export.image.toAsset({  
//   image: ls_2010_nusa_L57, // composites_functions.makeLandsatCompositeByFeature(nusa, "2010-01-01", "2010-12-31", 100, "L5,L7") used in the study
//   description: 'ls_composite_2010_byRegion__' + 'Nusa',    
//   assetId:  'IIASA/RESTORE/covariates_images/ls_composite_2010_byRegion/' + 'Nusa',
//   maxPixels: 1e12,
//   scale: 30,
//   region: Nusa.geometry(),
//   pyramidingPolicy: {'.default':'mean'}
// });


// Export.image.toAsset({  
//   image: ls_2018_nusa_L78,   // composites_functions.makeLandsatCompositeByFeature(nusa, "2018-01-01", "2018-12-31", 100, "L7,L8") used in the study
//   description: 'ls_composite_2018_byRegion__' + 'Nusa',    
//   assetId:  'IIASA/RESTORE/covariates_images/ls_composite_2018_byRegion/' + 'Nusa',
//   maxPixels: 1e12,
//   scale: 30,
//   region: Nusa.geometry(),
//   pyramidingPolicy: {'.default':'mean'}
// });




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// I.b. GENERATE LANDSAT COMPOSITE (MULTI-YEAR WINDOW) (not included in the study due to computational reasons) /////////////////////////////////// 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *Function signature: makeLandsatCompositeWeightYears(aoiGeom, startYearNum, endYearNum, yearWeightsList, sceneMaxCloudPercNum, sensorsStr)
 * Example call: composites_functions.makeLandsatCompositeWeightYears(Nusa.geometry(), 2017, 2019, [1,2,1] , 100, "L7,L8")
 * Note 'sensorsStr' is either "L5", "L7", "L8", "L5,L7", or "L7,L8"
*/


var smallArea = ee.Feature(
            ee.Geometry.Polygon(
                [[[115.72362695261268, 2.503980198535118],
                  [115.9392336420658, 2.4988352642567637],
                  [115.94060693308143, 2.612362053688684],
                  [115.72397027536658, 2.612019087682991]]]),
            {
              "system:index": "0"
            });

Map.addLayer(smallArea, {color:'red'}, "smallArea")            

var ls_2010_test_L5_3y = composites_functions.makeLandsatCompositeWeightYears(
  smallArea.geometry(), 2009, 2011, [1,2,1], 100, "L5");

var ls_2010_test_L57_3y = composites_functions.makeLandsatCompositeWeightYears(
  smallArea.geometry(), 2009, 2011, [1,2,1], 100, "L5,L7");
  
var ls_2018_test_L8_3y = composites_functions.makeLandsatCompositeWeightYears(
  smallArea.geometry(), 2017, 2019, [1,2,1], 100, "L8");

var ls_2018_test_L78_3y = composites_functions.makeLandsatCompositeWeightYears(
  smallArea.geometry(), 2017, 2019, [1,2,1], 100, "L7,L8");


  
// Map.centerObject(smallArea);

Map.addLayer(ls_2010_test_L5_3y, {bands:['red_median', 'green_median', 'blue_median'], min:0, max:1500}, 'ls_2010_test_L5_3y', true);
Map.addLayer(ls_2010_test_L57_3y, {bands:['red_median', 'green_median', 'blue_median'], min:0, max:1500}, 'ls_2010_test_L57_3y', true);
Map.addLayer(ls_2018_test_L8_3y, {bands:['red_median', 'green_median', 'blue_median'], min:0, max:1500}, 'ls_2018_test_L8_3y', true);
Map.addLayer(ls_2018_test_L78_3y, {bands:['red_median', 'green_median', 'blue_median'], min:0, max:1500}, 'ls_2018_test_L78_3y', true);





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// II. GENERATE SENTINEL-1 COMPOSITE, SPECTRAL FEATURES, AND TEMPORAL FEATURES ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////
/// - Annual composite

/**
 * Function signature: makeSentOneComposite(aoiGeom, startDateStr, endDateStr, reducers)
 * Example call: composites_functions.makeSentOneComposite(Nusa.geometry(), '2018-01-01', '2018-12-31', ee.Reducer.mean())
*/


// Generate composites
// (example for one region, exports for all regions already done)


// Select useful reducers i.e. temporal distributional/summary statistics (metrics) to minimize data size
// In the study, the aim was to characterize the dense temporal profile which would be useful for cropland,
// monthly composites result in incomplete nationwide coverage,
// 50th percentile not included as separately seasonal median composites were generated
var s1_reducers = ee.Reducer.percentile([10,20,30,40,60,70,80,90]);  

var s1_2018_Nusa = composites_functions.makeSentOneComposite(Nusa.geometry(), '2018-01-01', '2018-12-31', s1_reducers);

print("s1_2018_Nusa", s1_2018_Nusa);

Map.addLayer(s1_2018_Nusa.select('VV_p40'), {min: -2400, max: 300}, "VV_p40");
Map.addLayer(s1_2018_Nusa.select('VH_p40'), {min: -2800, max: -300}, "VH_p40");


/**
 * Design choice: speckle filtering was not applied, as multitemporal averaging was done i.e. temporal composites;
 * If desired, speckle filtering (e.g. refined lee filter) can be done on the composites.
*/


// // Export to Asset 

// Export.image.toAsset({  
//   image: s1_2018_Nusa, // composites_functions.makeSentOneComposite(Nusa.geometry(), '2018-01-01', '2018-12-31', ee.Reducer.percentile([10,20,30,40,60,70,80,90])) used in the study
//   description: 's1_annual_composite_2018_byRegion__' + 'Nusa',    
//   assetId:  'IIASA/RESTORE/covariates_images/s1_annual_composite_2018_byRegion/' + 'Nusa',
//   maxPixels: 1e12,
//   scale: landsat_scale.getInfo(),
//   crs: landsat_crs,
//   region: Nusa.geometry(),
//   pyramidingPolicy: {'.default':'mean'}
// });



////////////////////////////////////////////////////////////////////////////////////
/// - Seasonal composites

/**
 * Function signature: makeSentOneCompositeTwoSeasons(aoiGeom, startDateStr, endDateStr, startMonthRainyNum, endMonthRainyNum, startMonthDryNum, endMonthDryNum, reducers)
 * Example call: composites_functions.makeSentOneCompositeTwoSeasons(Nusa.geometry(), '2018-01-01', '2018-12-31', 1, 3, 6, 10, ee.Reducer.mean())
*/


// Select a few useful reducers i.e. temporal distributional/summary statistics (metrics) to minimize data size
// Add standard deviation or other temporal distributional/summary statistics (metrics) if desired
var s1_reducers_seasons = ee.Reducer.mean()                               
                 .combine(ee.Reducer.median(), '', true)                
                 //.combine(ee.Reducer.stdDev(), '', true);    


// Generate composites
// (example for one region, exports for all regions already done)

var s1_2018_twoSeasons_Nusa = composites_functions.makeSentOneCompositeTwoSeasons(
  Nusa.geometry(), '2018-01-01', '2018-12-31', 1, 3, 6, 10, s1_reducers_seasons); // Note season starting and ending months can be varied for different regions if desired

print("s1_2018_twoSeasons_Nusa", s1_2018_twoSeasons_Nusa);


Map.addLayer(s1_2018_twoSeasons_Nusa.select('VV_median_dry'), {min: -2400, max: 300}, "VV_median_dry");
Map.addLayer(s1_2018_twoSeasons_Nusa.select('VH_median_dry'), {min: -2800, max: -300}, "VH_median_dry");


/**
 * Design choice: speckle filtering was not applied, as multitemporal averaging was done i.e. temporal composites;
 * If desired, speckle filtering (e.g. refined lee filter) can be done on the composites.
*/



// // Export to Asset 

// Export.image.toAsset({  
//   image: s1_2018_twoSeasons_Nusa, // composites_functions.makeSentOneCompositeTwoSeasons(Nusa.geometry(), '2018-01-01', '2018-12-31', 1, 3, 6, 10, ee.Reducer.mean().combine(ee.Reducer.median(), '', true)) used in the study
//   description: 's1_rainy_dry_composites_2018_byRegion__' + 'Nusa',    
//   assetId:  'IIASA/RESTORE/covariates_images/s1_rainy_dry_composites_2018_byRegion/' + 'Nusa',
//   maxPixels: 1e12,
//   scale: landsat_scale.getInfo(),
//   crs: landsat_crs,
//   region: Nusa.geometry(),
//   pyramidingPolicy: {'.default':'mean'}
// });




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////// II.b. GENERATE SENTINEL-1 COMPOSITES WITH SPECKLE FILTER AND TERRAIN CORRECTION  (not included in the study as it was recently available) /////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/* File: s1_ard.js
Version: v1.2
Date: 2021-03-10
Authors: Mullissa A., Vollrath A., Braun, C., Slagter B., Balling J., Gou Y., Gorelick N.,  Reiche J.
Description: This script creates an analysis ready S1 image collection.
License: This code is distributed under the MIT License.

    Parameter:
        START_DATE: The earliest date to include images for (inclusive).
        END_DATE: The latest date to include images for (exclusive).
        POLARIZATION: The Sentinel-1 image polarization to select for processing.
            'VV' - selects the VV polarization.
            'VH' - selects the VH polarization.
            "VVVH' - selects both the VV and VH polarization for processing.
        ORBIT:  The orbits to include. (string: BOTH, ASCENDING or DESCENDING)
        GEOMETRY: The region to include imagery within.
                  The user can interactively draw a bounding box within the map window or define the edge coordinates.
        APPLY_BORDER_NOISE_CORRECTION: (Optional) true or false options to apply additional Border noise correction:
        APPLY_SPECKLE_FILTERING: (Optional) true or false options to apply speckle filter
        SPECKLE_FILTER: Type of speckle filtering to apply (String). If the APPLY_SPECKLE_FILTERING parameter is true then the selected speckle filter type will be used.
            'BOXCAR' - Applies a boxcar filter on each individual image in the collection
            'LEE' - Applies a Lee filter on each individual image in the collection based on [1]
            'GAMMA MAP' - Applies a Gamma maximum a-posterior speckle filter on each individual image in the collection based on [2] & [3]
            'REFINED LEE' - Applies the Refined Lee speckle filter on each individual image in the collection
                                  based on [4]
            'LEE SIGMA' - Applies the improved Lee sigma speckle filter on each individual image in the collection
                                  based on [5]
        SPECKLE_FILTER_FRAMEWORK: is the framework where filtering is applied (String). It can be 'MONO' or 'MULTI'. In the MONO case
                                  the filtering is applied to each image in the collection individually. Whereas, in the MULTI case,
                                  the Multitemporal Speckle filter is applied based on  [6] with any of the above mentioned speckle filters.
        SPECKLE_FILTER_KERNEL_SIZE: is the size of the filter spatial window applied in speckle filtering. It must be a positive odd integer.
        SPECKLE_FILTER_NR_OF_IMAGES: is the number of images to use in the multi-temporal speckle filter framework. All images are selected before the date of image to be filtered.
                                    However, if there are not enough images before it then images after the date are selected.
        TERRAIN_FLATTENING : (Optional) true or false option to apply Terrain correction based on [7] & [8]. 
        TERRAIN_FLATTENING_MODEL : model to use for radiometric terrain normalization (DIRECT, or VOLUME)
        DEM : digital elevation model (DEM) to use (as EE asset)
        TERRAIN_FLATTENING_ADDITIONAL_LAYOVER_SHADOW_BUFFER : additional buffer parameter for passive layover/shadow mask in meters
        FORMAT : the output format for the processed collection. this can be 'LINEAR' or 'DB'.
        CLIP_TO_ROI: (Optional) Clip the processed image to the region of interest.
        SAVE_ASSETS : (Optional) Exports the processed collection to an asset.
        
    Returns:
        An ee.ImageCollection with an analysis ready Sentinel 1 imagery with the specified polarization images and angle band.
        
References
  [1]  J. S. Lee, “Digital image enhancement and noise filtering by use of local statistics,” 
    IEEE Pattern Anal. Machine Intell., vol. PAMI-2, pp. 165–168, Mar. 1980. 
  [2]  A. Lopes, R. Touzi, and E. Nezry, “Adaptative speckle filters and scene heterogeneity,
    IEEE Trans. Geosci. Remote Sensing, vol. 28, pp. 992–1000, Nov. 1990 
  [3]  Lopes, A.; Nezry, E.; Touzi, R.; Laur, H.  Maximum a posteriori speckle filtering and first204order texture models in SAR images.  
    10th annual international symposium on geoscience205and remote sensing. Ieee, 1990, pp. 2409–2412.
  [4] J.-S. Lee, M.R. Grunes, G. De Grandi. Polarimetric SAR speckle filtering and its implication for classification
    IEEE Trans. Geosci. Remote Sens., 37 (5) (1999), pp. 2363-2373.
  [5] Lee, J.-S.; Wen, J.-H.; Ainsworth, T.L.; Chen, K.-S.; Chen, A.J. Improved sigma filter for speckle filtering of SAR imagery. 
    IEEE Trans. Geosci. Remote Sens. 2009, 47, 202–213.
  [6] S. Quegan and J. J. Yu, “Filtering of multichannel SAR images, IEEE Trans Geosci. Remote Sensing, vol. 39, Nov. 2001.
  [7] Vollrath, A., Mullissa, A., & Reiche, J. (2020). Angular-Based Radiometric Slope Correction for Sentinel-1 on Google Earth Engine. 
    Remote Sensing, 12(11), [1867]. https://doi.org/10.3390/rs12111867
  [8] Hoekman, D.H.;  Reiche, J.   Multi-model radiometric slope correction of SAR images of complex terrain using a two-stage semi-empirical approach.
    Remote Sensing of Environment2222015,156, 1–10.
**/

var wrapper = require('users/adugnagirma/gee_s1_ard:wrapper');
var helper = require('users/adugnagirma/gee_s1_ard:utilities');

//---------------------------------------------------------------------------//
// DEFINE PARAMETERS
//---------------------------------------------------------------------------//
var parameter = {//1. Data Selection
              START_DATE: "2018-06-01",     // H: dry season
              STOP_DATE: "2018-10-31",
              POLARIZATION:'VVVH',
              ORBIT : 'DESCENDING',
              GEOMETRY: Nusa.geometry(),    // H: change as necessary                       
              //2. Additional Border noise correction
              APPLY_ADDITIONAL_BORDER_NOISE_CORRECTION: true,
              //3.Speckle filter
              APPLY_SPECKLE_FILTERING: true,
              SPECKLE_FILTER_FRAMEWORK: 'MULTI',
              SPECKLE_FILTER: 'BOXCAR',
              SPECKLE_FILTER_KERNEL_SIZE: 15,
              SPECKLE_FILTER_NR_OF_IMAGES: 10,
              //4. Radiometric terrain normalization
              APPLY_TERRAIN_FLATTENING: true,
              DEM: ee.Image('USGS/SRTMGL1_003'),
              TERRAIN_FLATTENING_MODEL: 'VOLUME',
              TERRAIN_FLATTENING_ADDITIONAL_LAYOVER_SHADOW_BUFFER: 0,
              //5. Output
              FORMAT : 'DB',
              CLIP_TO_ROI: true,
              SAVE_ASSETS: true
}

//---------------------------------------------------------------------------//
// DO THE JOB
//---------------------------------------------------------------------------//
      
//Preprocess the S1 collection
var s1_preprocces = wrapper.s1_preproc(parameter);

var s1 = s1_preprocces[0]
s1_preprocces = s1_preprocces[1]

//---------------------------------------------------------------------------//
// VISUALIZE
//---------------------------------------------------------------------------//

//Visulaization of the first image in the collection in RGB for VV, VH, images
var visparam = {}
if (parameter.POLARIZATION=='VVVH'){
     if (parameter.FORMAT=='DB'){
    var s1_preprocces_view = s1_preprocces.map(helper.add_ratio_lin).map(helper.lin_to_db2);
    var s1_view = s1.map(helper.add_ratio_lin).map(helper.lin_to_db2);
    visparam = {bands:['VV','VH','VVVH_ratio'],min: [-20, -25, 1],max: [0, -5, 15]}
    }
    else {
    var s1_preprocces_view = s1_preprocces.map(helper.add_ratio_lin);
    var s1_view = s1.map(helper.add_ratio_lin);
    visparam = {bands:['VV','VH','VVVH_ratio'], min: [0.01, 0.0032, 1.25],max: [1, 0.31, 31.62]}
    }
}
else {
    if (parameter.FORMAT=='DB') {
    s1_preprocces_view = s1_preprocces.map(helper.lin_to_db);
    s1_view = s1.map(helper.lin_to_db);
    visparam = {bands:[parameter.POLARIZATION],min: -25,max: 0}   
    }
    else {
    s1_preprocces_view = s1_preprocces;
    s1_view = s1;
    visparam = {bands:[parameter.POLARIZATION],min: 0,max: 0.2}
    }
}


//---------------------------------------------------------------------------//
// EXPORT
//---------------------------------------------------------------------------//

//Convert format for export
if (parameter.FORMAT=='DB'){
  s1_preprocces = s1_preprocces.map(helper.lin_to_db);
}


///////////////////////////////////////////////////////////////////////////////////////
// H: Make a median composite, export the composite

var reducers = ee.Reducer.median();

var s1_preprocces_median = s1_preprocces.reduce(reducers, 8);

print("s1_preprocces_median", s1_preprocces_median)



// // Export to Asset 

// Export.image.toAsset({  
//   image: s1_preprocces_median, 
//   description: 's1_extraProc_dry_composites_2018_byRegion__' + 'Nusa',    
//   assetId:  'IIASA/RESTORE/covariates_images/s1_extraProc_dry_composites_2018_byRegion/' + 'Nusa',
//   maxPixels: 1e12,
//   scale: landsat_scale.getInfo(),
//   crs: landsat_crs,
//   region: Nusa.geometry(),
//   pyramidingPolicy: {'.default':'mean'}
// });







///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// III. GENERATE PALSAR TEXTURAL FEATURES //////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Function signature: makePALSARtexture(aoiGeom, compositeYearStr, neighbourhoodSizeNum)
 * Example call: composites_functions.makePALSARtexture(classification_regions.geometry(), '2017', 5)
 * Note check if PALSAR composite is available for the year: ee.ImageCollection('JAXA/ALOS/PALSAR/YEARLY/SAR')
*/


var smallAreaOilPalm = 
     ee.Geometry.Polygon(
        [[[104.07097174116102, -2.777305061404995],
          [104.07097174116102, -2.9017781788215524],
          [104.32691885419813, -2.9017781788215524],
          [104.32691885419813, -2.777305061404995]]], null, false);
          

var palsar_texture_2017_test = composites_functions.makePALSARtexture(smallAreaOilPalm, '2017', 5); 
// neighbourhoodSizeNum = 5 means 11-by-11 pixels kernel; note different neighbourhood sizes can be experimented with for a given use case

print("palsar_texture_2017_test", palsar_texture_2017_test);

// Map.centerObject(smallAreaOilPalm);

Map.addLayer(palsar_texture_2017_test.select('HH_div_HV_savg'), {min: 23529, max: 24438}, "palsar_texture_2017_test", true);


// // Export to Asset 

// var palsar_texture_2017_country = composites_functions.makePALSARtexture(classification_regions.geometry(), '2017', 5); // used in the study

// var palsar_texture_2010_country = composites_functions.makePALSARtexture(classification_regions.geometry(), '2010', 5); // used in the study


// Export.image.toAsset({  
//   image: palsar_texture_2017_country, 
//   description: 'palsar_composite_2017_texture_country',    
//   assetId:  'IIASA/RESTORE/covariates_images/palsar_composite_2017_texture_country',
//   maxPixels: 1e12,
//   scale: 24.73766462072746, // the PALSAR composite native resolution
//   region: classification_regions.geometry(),
//   pyramidingPolicy: {'.default':'mean'}
// });



// Export.image.toAsset({  
//   image: palsar_texture_2010_country, 
//   description: 'palsar_composite_2010_texture_country',    
//   assetId:  'IIASA/RESTORE/covariates_images/palsar_composite_2010_texture_country',
//   maxPixels: 1e12,
//   scale: 24.73766462072746, // the PALSAR composite native resolution
//   region: classification_regions.geometry(),
//   pyramidingPolicy: {'.default':'mean'}
// });





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// IV. GENERATE SENTINEL-1 TEXTURAL FEATURES //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Note currently only tested with 10-m Sentinel-1 composites during dry season period (months 6 to 10) in the country
 * Function signature: makeSentOneTextureFrom10m(VV_dry_10m_mosaic, VH_dry_10m_mosaic, aoiGeom, neighbourhoodSizeNum)
 * Example call: composites_functions.makeSentOneTextureFrom10m(VV_dry_10m_mosaic, VH_dry_10m_mosaic, smallAreaOilPalm, 5)
*/


// Note, in the study Sentinel-1 texture covariates were calculated from 10-m composites. 
// These 10-m composites (only VH_median_dry and VV_median_dry bands as data storage allows) can be useful to test mapping at 10-m resolution.


// VH
var VH_dry_10m_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/s1_10m_dry_composite_VH_2018_byRegion")
                        .mosaic();

// VV
var VV_dry_10m_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/s1_10m_dry_composite_VV_2018_byRegion")
                        .mosaic();


var smallAreaOilPalm = 
     ee.Geometry.Polygon(
        [[[104.07097174116102, -2.777305061404995],
          [104.07097174116102, -2.9017781788215524],
          [104.32691885419813, -2.9017781788215524],
          [104.32691885419813, -2.777305061404995]]], null, false);
          

var s1_texture_2018_test = composites_functions.makeSentOneTextureFrom10m(VV_dry_10m_mosaic, VH_dry_10m_mosaic, smallAreaOilPalm, 5);
// neighbourhoodSizeNum = 5 means 11-by-11 pixels kernel; note different neighbourhood sizes can be experimented with for a given use case

print("s1_texture_2018_test", s1_texture_2018_test);

// Map.centerObject(smallAreaOilPalm);

Map.addLayer(s1_texture_2018_test.select('VV_div_VH_median_dry_savg'), {min: 23529, max: 24438}, "VV_div_VH_median_dry_savg", true);


// // Export to Asset 

// var s1_texture_2018_country = composites_functions.makeSentOneTextureFrom10m(VV_dry_10m_mosaic, VH_dry_10m_mosaic, classification_regions.geometry(), 5); // used in the study


// Export.image.toAsset({  
//   image: s1_texture_2018_country.select(['VH_median','VV_median']), 
//   description: 's1_composite_2018_texture_country',    
//   assetId:  'IIASA/RESTORE/covariates_images/s1_composite_2018_texture_country',
//   maxPixels: 1e12,
//   scale: 10, // 10-m texture!
//   region: classification_regions.geometry(),
//   pyramidingPolicy: {'.default':'mean'}
// });




// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////// V. GENERATE DISTANCE TO ROAD, SETTLEMENT, COAST ////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Coastline
var neCoastline = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/coastline_ne_10m");

// Roads
var road_osm = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/road_osm");
var road_rbi = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/road_rbi");


// Settlement
var HRSL = ee.ImageCollection("projects/sat-io/open-datasets/hrsl/hrslpop")
          .mosaic();


// Make source image

// Coastline
neCoastline = neCoastline.map(function(ft) { return ft.set('constant', ee.Number(1).uint8()) });
var neCoastlineImg = neCoastline.reduceToImage(['constant'], ee.Reducer.first());

// Roads
var roads_osm_rbi = road_osm.merge(road_rbi)
roads_osm_rbi = roads_osm_rbi.map(function(ft) { return ft.set('constant', ee.Number(1).uint8()) });
var roads_osm_rbi_img = roads_osm_rbi.reduceToImage(['constant'], ee.Reducer.max());

// Settlement
var HRSL_connected = HRSL.int().connectedPixelCount({maxSize: 100, eightConnected: true});
var HRSL_connected_masked = HRSL_connected.unmask().gt(3);



// Function to calculate cumulative distance in number of pixels
function makeDistanceImage(sourceImage){

  var costImage = ee.Image(1);  // distance in pixel unit, to minimize data size
  
  var distImage = costImage.cumulativeCost(sourceImage, 500000);  
  
  var distImageInteger = distImage.round().uint16();
  
  return distImageInteger;
  
}


var dist_road_rbi_osm = makeDistanceImage(roads_osm_rbi_img.mask());


var dist_coast = makeDistanceImage(neCoastlineImg.mask());


var dist_settlement_fb = makeDistanceImage(HRSL_connected_masked);


// Export by region, than mosaicked


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// VI. GENERATE TERRAIN INDICES //////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var SRTM30 = ee.Image('USGS/SRTMGL1_003')   // 30-m                         
        .clipToCollection(classification_regions);

var terrain = ee.Algorithms.Terrain(SRTM30);

var slope = terrain.select('slope').int8();                              
var aspect = terrain.select('aspect').int16();



// Export.image.toAsset({  
//   image: slope,
//   description: 'slope_srtm30_country',     
//   assetId:  'IIASA/RESTORE/covariates_images/slope_srtm30_country',
//   maxPixels: 1e12,
//   scale: landsat_scale.getInfo(),
//   crs: landsat_crs,
//   region: classification_regions.geometry(),
//   pyramidingPolicy: {'.default':'mean'}
// });


// Export.image.toAsset({  
//   image: aspect,
//   description: 'aspect_srtm30_country',     
//   assetId:  'IIASA/RESTORE/covariates_images/aspect_srtm30_country',
//   maxPixels: 1e12,
//   scale: landsat_scale.getInfo(),
//   crs: landsat_crs,
//   region: classification_regions.geometry(),
//   pyramidingPolicy: {'.default':'mode'}
// });


//************************************** END ****************************************************************

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// Appendix. GENERATE SENTINEL-2 COMPOSITE //////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Based on 
// Sentinel-2 Cloud Masking with s2cloudless
// Author(s): jdbcode
// https://developers.google.com/earth-engine/tutorials/community/sentinel-2-s2cloudless

////////////////////////////////////////////////////////
// Settings

var START_DATE = '2018-01-01';     
var END_DATE = '2018-12-31';
var CLOUD_FILTER = 100;          
var CLD_PRB_THRESH = 50;
var NIR_DRK_THRESH = 0.15;
var CLD_PRJ_DIST = 1;
var BUFFER = 50;


var s2_composite_params = {
  's2_product': "toa",             // "toa" or "sr"         
  'projectShadow': true,           
  'morphologyFilter': true, 
  'sr_useJRCwater': false          // only in effect if 's2_product': "sr", whether to use JRC yearly water instead of scene classification (SCL) that comes with the s2 sr product
};


var GEOMETRY = smallArea.geometry();


////////////////////////////////////////////////////////
// Retrieve Sentinel-2 image collection

var s2_cld_col = get_s2_cld_col(GEOMETRY, START_DATE, END_DATE);
print("s2_cld_col", s2_cld_col);

////////////////////////////////////////////////////////
// Get alternative water mask required in shadow masking from JRC Global Surface Water product

var jrc_year = ee.Date(START_DATE).get('year').getInfo()

var not_water_jrc_mask = get_JRC_water(jrc_year)


////////////////////////////////////////////////////////
// Make composite

var s2_median = s2_cld_col.map(add_cld_shdw_mask)
                          .map(apply_cld_shdw_mask)
                          .median()
                          .clip(GEOMETRY)
print("s2_median", s2_median)

// Rename bands
s2_median = s2_median.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12'],
                            ['blue', 'green', 'red', 'redEdge1', 'redEdge2', 'redEdge3', 'nirNarrow', 'nir', 'swir1', 'swir2']);


////////////////////////////////////////////////////////
// Display

Map.addLayer(s2_median,
          {'bands': ['red', 'green', 'blue'], 'min': 0, 'max': 1500, 'gamma': 1.1},
          'S2 median - RGB', true, 1) 



//********************************************************************************************************************
//******************************* Helper functions to build Sentinel-2 collection *************************************

////////////////////////////////////////////////////////////////////////////////
// Function to apply the cloud mask to each image in the collection

function apply_cld_shdw_mask(img){
  // Subset the cloudmask band and invert it so clouds/shadow are 0, else 1.
  var not_cld_shdw = img.select('cloudmask').not()

  // Subset reflectance bands and update their masks, return the result.
  return img.select('B.*').updateMask(not_cld_shdw)
}

function get_s2_cld_col(aoi, start_date, end_date) {
  
  // Import and filter S2 SR. Now also implement if TOA.
  if(s2_composite_params.s2_product === "sr") {
    
     var s2_col = ee.ImageCollection('COPERNICUS/S2_SR')  // TOA collection 'COPERNICUS/S2' doesn't come with 'SCL' band to get water, so in this case need to rely on external water mask
                  .filterBounds(aoi)
                  .filterDate(start_date, end_date)
                  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', CLOUD_FILTER))
    
  } else if(s2_composite_params.s2_product === "toa") {
    
     var s2_col = ee.ImageCollection('COPERNICUS/S2')  // TOA collection 'COPERNICUS/S2' doesn't come with 'SCL' band to get water, so in this case need to rely on external water mask
              .filterBounds(aoi)
              .filterDate(start_date, end_date)
              .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', CLOUD_FILTER))
    
  }
              
                   
  // Import and filter s2cloudless.
  var s2_cloudless_col = ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY')
                         .filterBounds(aoi)
                         .filterDate(start_date, end_date)
  
  
  // Join the two collections, by the 'system:index' property
  var joined = ee.ImageCollection(ee.Join.saveFirst('s2cloudless').apply({
    'primary': s2_col,
    'secondary': s2_cloudless_col,
    'condition': ee.Filter.equals({
      'leftField': 'system:index',
      'rightField': 'system:index'
    })
  }))
  
  return joined
  
}



////////////////////////////////////////////////////////////////////////////////
// Cloud components

function add_cloud_bands(img){
  
  var cld_prb = ee.Image(img.get('s2cloudless')).select('probability')
  
  var is_cloud = cld_prb.gt(CLD_PRB_THRESH).rename('clouds')
  
  return img.addBands(ee.Image([cld_prb, is_cloud]))
  
}


////////////////////////////////////////////////////////////////////////////////
// Cloud shadow components
// Define a function to add dark pixels, cloud projection, and identified shadows
// Input is output of add_cloud_bands()

// Use yearly JRC water, especially for early years when s2 sr is not available

function get_JRC_water(jrc_year){
  
  if(jrc_year > 2018){
    jrc_year = 2018
  } else if(jrc_year < 1984){
    jrc_year = 1984
  }
  
  var jrc_start_date = jrc_year + '-01' + '-01'
  
  var jrc_end_date = jrc_year + '-12' + '-31'
  
  var water_jrc = ee.ImageCollection("JRC/GSW1_2/YearlyHistory")
                  .filterDate(jrc_start_date, jrc_end_date)
                  .first()
                  
  // a. Masked (0) area in the JRC product is NOT WATER
  var water_jrc_fromMask = water_jrc.mask()     // 0 is "not water"
                          .not()                // 1 is "not water"
  
  water_jrc_fromMask = water_jrc_fromMask.selfMask()
  
  // b. doc says value 1 Not water, 2 Seasonal water, 3 Permanent water, but they seem less than ideal, thus also use the mask (a)  
  var water_jrc_val_1 = water_jrc.eq(1)     // 1 is "not water"
  
  water_jrc_val_1 = water_jrc_val_1.selfMask()
  
  // Mosaic a & b
  var not_water_jrc = ee.ImageCollection.fromImages([water_jrc_fromMask, water_jrc_val_1])
                      .mosaic()
    
    
  var not_water_jrc_mask = not_water_jrc.mask()   
  
  return not_water_jrc_mask
  
}




function add_shadow_bands(img){
  
  
  if(s2_composite_params.s2_product === "sr"){
    
    if(s2_composite_params.sr_useJRCwater){ // use JRC yearly water
    
      var not_water = not_water_jrc_mask
      
    } else { // use SCL
      
      var not_water = img.select('SCL').neq(6)

    }
    
  } else if(s2_composite_params.s2_product === "toa"){   // if sr toa i.e. early years no s2 sr available, thus no scl layer, hence use JRC water
    
    var not_water = not_water_jrc_mask

  }
  
  
 
  // Dark NIR pixels that are not water (potential cloud shadow pixels)
  var R_BAND_SCALE = 1e4
  
  var dark_pixels = img.select('B8').lt(NIR_DRK_THRESH * R_BAND_SCALE).multiply(not_water).rename('dark_pixels')
  
  
  if(s2_composite_params.projectShadow) {
    
    // Direction to project cloud shadow from clouds (assumes UTM projection)
    var shadow_azimuth = ee.Number(90).subtract(ee.Number(img.get('MEAN_SOLAR_AZIMUTH_ANGLE')))
    
    var cld_proj = img.select('clouds').directionalDistanceTransform(shadow_azimuth, CLD_PRJ_DIST * 10)
          .reproject({
            'crs': img.select(0).projection(),
            'scale': 100
          })
          .select('distance')
          .mask()
          .rename('cloud_transform')
          
      
    // Intersection of dark pixels with cloud shadow projection
    var shadows = cld_proj.multiply(dark_pixels).rename('shadows')
 
    
  } else {
    
    var shadows = dark_pixels.rename('shadows')
    
  }
  
  
  return img.addBands(ee.Image([dark_pixels, cld_proj, shadows]))
  
}



// Assemble the final cloud-shadow mask

function add_cld_shdw_mask(img){
  
  var img_cloud = add_cloud_bands(img)
  
  var img_cloud_shadow = add_shadow_bands(img_cloud)
  
  // Set cloud and shadow as value 1
  var is_cld_shdw = img_cloud_shadow.select('clouds').add(img_cloud_shadow.select('shadows')).gt(0)
  
  
  if(s2_composite_params.morphologyFilter){
    
    // Remove small cloud-shadow patches and dilate remaining pixels by BUFFER input.
    // 20 m scale is for speed, and assumes clouds don't require 10 m precision.
    is_cld_shdw = is_cld_shdw.focal_min(2).focal_max(BUFFER * 2 / 20)
        .reproject({'crs': img.select([0]).projection(), 'scale': 20})
        .rename('cloudmask')

  } else {
    
    is_cld_shdw = is_cld_shdw.rename('cloudmask')
    
  }
       
  return img_cloud_shadow.addBands(is_cld_shdw)
}
          