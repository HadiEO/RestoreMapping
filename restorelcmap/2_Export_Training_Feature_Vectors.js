
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
TRAINING SAMPLES
Note: here class allocation already balanced by sampling with replacement (which were found to have effects on large-scale spatial distribution of land cover), and so
to obtain distinct locations, use .distinct('.geo').

Design choice: Training data for each class can be substituted with other sources/versions of training data 

For generic example scripts to sample training points see:
https://code.earthengine.google.com/?scriptPath=users%2Fhadicu06%2FexpertWorkshopJune_rev%3A2.%20Classification%2F01%20-%20Training%20Samples%20Manually%20Collected
https://code.earthengine.google.com/?scriptPath=users%2Fhadicu06%2FexpertWorkshopJune_rev%3A2.%20Classification%2F02%20-%20Training%20Samples%20from%20Reference%20Map
*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////==============================================================================================
// Sampled from reference map 2010
////==============================================================================================


var samples_detailed_JawaBali_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/01_undisturbedDrylandForest");  
var samples_detailed_JawaBali_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/02_loggedOverDrylandForest");
var samples_detailed_JawaBali_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/03_undisturbedMangroveForest");
var samples_detailed_JawaBali_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/04_loggedOverMangroveForest");
var samples_detailed_JawaBali_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/07_agroforestry");
var samples_detailed_JawaBali_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/08_plantationForest");
var samples_detailed_JawaBali_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/09_rubberMonoculture");
var samples_detailed_JawaBali_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/10_oilPalmMonoculture");
var samples_detailed_JawaBali_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/11_otherMonoculture");
var samples_detailed_JawaBali_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/12_grassAndSavanna");
var samples_detailed_JawaBali_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/13_shrub");
var samples_detailed_JawaBali_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/14_cropland");
var samples_detailed_JawaBali_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/15_settlement");
var samples_detailed_JawaBali_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/16_clearedLand");
var samples_detailed_JawaBali_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/JawaBali/17_waterbody");


var samples_detailed_Kalimantan_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/01_undisturbedDrylandForest"); 
var samples_detailed_Kalimantan_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/02_loggedOverDrylandForest");
var samples_detailed_Kalimantan_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/03_undisturbedMangroveForest");
var samples_detailed_Kalimantan_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/04_loggedOverMangroveForest");
var samples_detailed_Kalimantan_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/05_undisturbedSwampForest");
var samples_detailed_Kalimantan_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/06_loggedOverSwampForest");
var samples_detailed_Kalimantan_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/07_agroforestry");
var samples_detailed_Kalimantan_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/08_plantationForest");
var samples_detailed_Kalimantan_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/09_rubberMonoculture");
var samples_detailed_Kalimantan_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/10_oilPalmMonoculture");
var samples_detailed_Kalimantan_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/11_otherMonoculture");
var samples_detailed_Kalimantan_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/13_shrub");
var samples_detailed_Kalimantan_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/14_cropland");
var samples_detailed_Kalimantan_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/15_settlement");
var samples_detailed_Kalimantan_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/16_clearedLand");
var samples_detailed_Kalimantan_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Kalimantan/17_waterbody");


var samples_detailed_Maluku_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/01_undisturbedDrylandForest");  
var samples_detailed_Maluku_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/02_loggedOverDrylandForest");
var samples_detailed_Maluku_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/03_undisturbedMangroveForest");
var samples_detailed_Maluku_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/04_loggedOverMangroveForest");
var samples_detailed_Maluku_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/05_undisturbedSwampForest");
var samples_detailed_Maluku_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/06_loggedOverSwampForest");
var samples_detailed_Maluku_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/07_agroforestry");
var samples_detailed_Maluku_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/08_plantationForest");
var samples_detailed_Maluku_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/09_rubberMonoculture");
var samples_detailed_Maluku_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/10_oilPalmMonoculture");
var samples_detailed_Maluku_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/11_otherMonoculture");
var samples_detailed_Maluku_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/12_grassAndSavanna");
var samples_detailed_Maluku_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/13_shrub");
var samples_detailed_Maluku_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/14_cropland");
var samples_detailed_Maluku_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/15_settlement");
var samples_detailed_Maluku_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/16_clearedLand");
var samples_detailed_Maluku_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Maluku/17_waterbody");


var samples_detailed_Nusa_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/01_undisturbedDrylandForest");  
var samples_detailed_Nusa_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/02_loggedOverDrylandForest");
var samples_detailed_Nusa_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/03_undisturbedMangroveForest");
var samples_detailed_Nusa_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/04_loggedOverMangroveForest");
var samples_detailed_Nusa_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/06_loggedOverSwampForest");
var samples_detailed_Nusa_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/07_agroforestry");
var samples_detailed_Nusa_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/08_plantationForest");
var samples_detailed_Nusa_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/09_rubberMonoculture");
var samples_detailed_Nusa_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/11_otherMonoculture");
var samples_detailed_Nusa_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/12_grassAndSavanna");
var samples_detailed_Nusa_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/13_shrub");
var samples_detailed_Nusa_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/14_cropland");
var samples_detailed_Nusa_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/15_settlement");
var samples_detailed_Nusa_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/16_clearedLand");
var samples_detailed_Nusa_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Nusa/17_waterbody");


var samples_detailed_Papua_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/01_undisturbedDrylandForest");  
var samples_detailed_Papua_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/02_loggedOverDrylandForest");
var samples_detailed_Papua_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/03_undisturbedMangroveForest");
var samples_detailed_Papua_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/04_loggedOverMangroveForest");
var samples_detailed_Papua_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/05_undisturbedSwampForest");
var samples_detailed_Papua_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/06_loggedOverSwampForest");
var samples_detailed_Papua_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/07_agroforestry");
var samples_detailed_Papua_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/08_plantationForest");
var samples_detailed_Papua_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/09_rubberMonoculture");
var samples_detailed_Papua_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/10_oilPalmMonoculture");
var samples_detailed_Papua_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/11_otherMonoculture");
var samples_detailed_Papua_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/12_grassAndSavanna");
var samples_detailed_Papua_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/13_shrub");
var samples_detailed_Papua_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/14_cropland");
var samples_detailed_Papua_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/15_settlement");
var samples_detailed_Papua_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/16_clearedLand");
var samples_detailed_Papua_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Papua/17_waterbody");



var samples_detailed_Sulawesi_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/01_undisturbedDrylandForest");
var samples_detailed_Sulawesi_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/02_loggedOverDrylandForest");
var samples_detailed_Sulawesi_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/03_undisturbedMangroveForest");
var samples_detailed_Sulawesi_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/04_loggedOverMangroveForest");
var samples_detailed_Sulawesi_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/05_undisturbedSwampForest");
var samples_detailed_Sulawesi_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/06_loggedOverSwampForest");
var samples_detailed_Sulawesi_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/07_agroforestry");
var samples_detailed_Sulawesi_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/08_plantationForest");
var samples_detailed_Sulawesi_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/09_rubberMonoculture");
var samples_detailed_Sulawesi_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/10_oilPalmMonoculture");
var samples_detailed_Sulawesi_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/11_otherMonoculture");
var samples_detailed_Sulawesi_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/12_grassAndSavanna");
var samples_detailed_Sulawesi_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/13_shrub");
var samples_detailed_Sulawesi_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/14_cropland");
var samples_detailed_Sulawesi_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/15_settlement");
var samples_detailed_Sulawesi_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/16_clearedLand");
var samples_detailed_Sulawesi_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sulawesi/17_waterbody");




var samples_detailed_Sumatera_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/01_undisturbedDrylandForest");  
var samples_detailed_Sumatera_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/02_loggedOverDrylandForest");
var samples_detailed_Sumatera_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/03_undisturbedMangroveForest");
var samples_detailed_Sumatera_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/04_loggedOverMangroveForest");
var samples_detailed_Sumatera_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/05_undisturbedSwampForest");
var samples_detailed_Sumatera_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/06_loggedOverSwampForest");
var samples_detailed_Sumatera_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/07_agroforestry");
var samples_detailed_Sumatera_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/08_plantationForest");
var samples_detailed_Sumatera_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/09_rubberMonoculture");
var samples_detailed_Sumatera_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/10_oilPalmMonoculture");
var samples_detailed_Sumatera_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/11_otherMonoculture");
var samples_detailed_Sumatera_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/12_grassAndSavanna");
var samples_detailed_Sumatera_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/13_shrub");
var samples_detailed_Sumatera_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/14_cropland");
var samples_detailed_Sumatera_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/15_settlement");
var samples_detailed_Sumatera_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/16_clearedLand");
var samples_detailed_Sumatera_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/Sumatera/17_waterbody");




//////////////////////////////////////////////////////////////////////////////////////////////
// "rubberMonoculture" training samples from WRI Tree Plantation database
// Note training data for other tree crops may be obtained from the Tree Plantation layer

// var WRI_tree_plantation = ee.FeatureCollection("users/hadicu06/IIASA/vector/Tree_plantations_INA_20210212")
// var WRI_tree_plantation_rubber = WRI_tree_plantation.filter(ee.Filter.eq('spec_simp', 'Rubber'))



var samples_detailed_alt_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/detailed_class/alternative/country/09_rubberMonoculture_alt")







////==============================================================================================
// Crowdsourced with 2018 VHR
////==============================================================================================

/**
 * Classes 01 to 07 training data are from crowdsourcing campaign;
 * Class 08 is based on JRC Global Surface Water Mapping Layers, v1.0: 
 *    var jrc_water = ee.Image("JRC/GSW1_0/GlobalSurfaceWater")
 *    var is_water  = jrc_water.select('seasonality').eq(12).selfMask()
 * Class 09 is based on 
 *    var HRSL = ee.ImageCollection("projects/sat-io/open-datasets/hrsl/hrslpop")
 *    var is_settlement = HRSL.mosaic().mask().selfMask()
 * Class 10 is based on reference map 2010 by country partner
*/ 



var samples_simplified_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/simplified_class_crowdsourced/country/01_undisturbedForest");
var samples_simplified_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/simplified_class_crowdsourced/country/02_loggedOverForest");  
var samples_simplified_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/simplified_class_crowdsourced/country/03_oilPalmMonoculture"); 
var samples_simplified_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/simplified_class_crowdsourced/country/04_treeBasedNotOilPalm");  
var samples_simplified_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/simplified_class_crowdsourced/country/05_cropland");  
var samples_simplified_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/simplified_class_crowdsourced/country/06_shrub"); 
var samples_simplified_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/simplified_class_crowdsourced/country/07_grassAndSavanna");  
var samples_simplified_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/simplified_class_crowdsourced/country/08_waterbody");  
var samples_simplified_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/simplified_class_crowdsourced/country/09_settlement");  
var samples_simplified_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples/simplified_class_crowdsourced/country/10_clearedLand");








/*///////////////////////////////////////////////////////////////
VECTOR MAP
*//////////////////////////////////////////////////////////////

var IndoRegions = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/classification_regions")


/*///////////////////////////////////////////////////////////////
MAP RASTER TEMPLATE COMPATIBLE WITH REFERENCE MAP
*//////////////////////////////////////////////////////////////

var land_mask = ee.Image("users/hadicu06/IIASA/RESTORE/miscellaneous/land_mask"); 






/*///////////////////////////////////////////////////////////////
IMPORT INPUTS TO CLASSIFIER FROM PREPARED ASSET
*//////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
// Year invariant *
/////////////////////////////////////////////////////////////////////


var nationalSlope = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/slope_srtm30_country");
nationalSlope = nationalSlope.multiply(100).round().toInt16()           
var nationalAspect = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/aspect_srtm30_country");



var distToRoad = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/distance_road_rbi_main_country").rename('dist_road');             
var distToRiver = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/distance_river_rbi_country").rename('dist_river');
var distToSettlement = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/distance_settlement_rbi_country").rename('dist_settlement');




var distToFbSettlement = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/distance_settlement_fb_country")
                            .rename('dist_FbSettlement');


var SRTM = ee.Image("USGS/SRTMGL1_003") // 30-m
        .clipToCollection(IndoRegions);               
var nationalElev = SRTM;


var distToAllRoadRBIandOSM = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/distance_road_rbi_osm_country").rename("dist_road_all_rbiNosm")

var distToCoast = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/distance_coast_country").rename('dist_coast')




/////////////////////////////////////////////////////////////////////
// 2010
/////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////
// Landsat *
////////////////////////////////////////////////

var landsat_2010_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/ls_composite_2010_byRegion").mosaic()

landsat_2010_mosaic = landsat_2010_mosaic.select(landsat_2010_mosaic.bandNames().removeAll(['red_count']))



////////////////////////////////////////////////
// ALOS PALSAR *
////////////////////////////////////////////////
var palsar_2010 = ee.ImageCollection('JAXA/ALOS/PALSAR/YEARLY/SAR')
                     .filterMetadata('system:index', 'equals', '2010')
                     .filterBounds(IndoRegions.geometry())
                     .first();                        // only 1 image in a year
                     
palsar_2010 = palsar_2010
             .updateMask(palsar_2010.select('qa').neq(ee.Image(0)))
             .updateMask(palsar_2010.select('qa').neq(ee.Image(100)))
             .updateMask(palsar_2010.select('qa').neq(ee.Image(150))) // just keep land & ocean/water
             .select(['HH', 'HV'], ['HH', 'HV'])
             .clipToCollection(IndoRegions);
                   
// Add ratio band = HH/HV
palsar_2010 = palsar_2010.addBands( 
  palsar_2010.select('HH').divide(palsar_2010.select('HV')).rename('HH_div_HV'))   // ratio band .multiply(1000).toUint16() needed?




////////////////////////////////////////////////
// ALOS PALSAR: texture *
////////////////////////////////////////////////

var palsar_texture_2010 = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/palsar_composite_2010_texture_country")



////////////////////////////////////////////////////////////////////////
// 2018
/////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////
// Landsat *
////////////////////////////////////////////////
var landsat_2018_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/ls_composite_2018_byRegion").mosaic()

landsat_2018_mosaic = landsat_2018_mosaic.select(landsat_2018_mosaic.bandNames().removeAll(['red_count']))




////////////////////////////////////////////////
// ALOS PALSAR *
////////////////////////////////////////////////
var palsar_2017 = ee.ImageCollection('JAXA/ALOS/PALSAR/YEARLY/SAR')
                     .filterMetadata('system:index', 'equals', '2017')
                     .filterBounds(IndoRegions.geometry())
                     .first();                        // only 1 image in a year
                     
palsar_2017 = palsar_2017
             .updateMask(palsar_2017.select('qa').neq(ee.Image(0)))
             .updateMask(palsar_2017.select('qa').neq(ee.Image(100)))
             .updateMask(palsar_2017.select('qa').neq(ee.Image(150))) // just keep land & ocean/water
             .select(['HH', 'HV'], ['HH', 'HV'])
             .clipToCollection(IndoRegions);
                   
// Add ratio band = HH/HV
palsar_2017 = palsar_2017.addBands( 
  palsar_2017.select('HH').divide(palsar_2017.select('HV')).rename('HH_div_HV'))   // // ratio band .multiply(1000).toUint16() needed?



////////////////////////////////////////////////
// ALOS PALSAR: texture *
////////////////////////////////////////////////

var palsar_texture_2017 = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/palsar_composite_2017_texture_country")




////////////////////////////////////////////////
// Sentinel-1: two season composite *
////////////////////////////////////////////////

var S1_season_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/s1_rainy_dry_composites_2018_byRegion").mosaic()




////////////////////////////////////////////////
// Sentinel-1: annual composite *
////////////////////////////////////////////////

var S1_annual_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/s1_annual_composite_2018_byRegion").mosaic()




////////////////////////////////////////////////
// Sentinel-1: texture *
////////////////////////////////////////////////

var S1_texture = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/s1_composite_2018_texture_country")





// ////////////////////////////////////////////////////////////////////////////////////
// // Add some other covariates    
// ////////////////////////////////////////////////////////////////////////////////////


// var oxfordAccessibility = ee.Image("Oxford/MAP/accessibility_to_cities_2015_v1_0")
//                         .clipToCollection(IndoRegions);


// // MODIS percent tree cover
// var VCF = ee.ImageCollection("MODIS/006/MOD44B")
//                     .filterBounds(IndoRegions.geometry())
//                     .filterDate('2018-01-01', '2018-12-31')
//                     .first()


// // Tandem-X
// var tandemx90 = ee.Image('users/hadicu06/IIASA/composite/tandemx_Indo_mosaic_clipGADM')
//                 .rename('tandemx90');


// TandemX
// tandemx90 = tandemx90.round().toInt16()



////////////////////////////////////////////////////////////////////////////////////
// Add climate variables

// var prec = ee.Image("OpenLandMap/CLM/CLM_PRECIPITATION_SM2RAIN_M/v01")
//           .clipToCollection(IndoRegions);
          
// var prec_newNames = prec.bandNames().map(function(name){return ee.String('prec_').cat(name)})          

// prec = prec.rename(prec_newNames)


// var temperature = ee.Image("OpenLandMap/CLM/CLM_LST_MOD11A2-DAY_M/v01")
//                   .clipToCollection(IndoRegions);

// var temperature_newNames = temperature.bandNames().map(function(name){return ee.String('temp_').cat(name)})          

// temperature = temperature.rename(temperature_newNames)



/////////////////////////////////////////////////////////////////////////////////
// Add lat-lon as predictors

// var pixelLonLat = ee.Image.pixelLonLat().resample(params.continuousResample)




////////////////////////////////////////////////////////////////////////////////////
// Add soil predictors


// var texture = ee.Image("OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02").clipToCollection(IndoRegions);

// var clay = ee.Image("OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02").clipToCollection(IndoRegions);

// var sand = ee.Image("OpenLandMap/SOL/SOL_SAND-WFRACTION_USDA-3A1A1A_M/v02").clipToCollection(IndoRegions);

// var bulkDensity = ee.Image("OpenLandMap/SOL/SOL_BULKDENS-FINEEARTH_USDA-4A1H_M/v02").clipToCollection(IndoRegions);

// var organicCarbon = ee.Image("OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02").clipToCollection(IndoRegions);

// var ph = ee.Image("OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1A2A_M/v02").clipToCollection(IndoRegions);

// var water = ee.Image("OpenLandMap/SOL/SOL_WATERCONTENT-33KPA_USDA-4B1C_M/v01").clipToCollection(IndoRegions);


// // Rename bands
// var texture_newNames = texture.bandNames().map(function(item){return ee.String('textureClass_').cat(item)})
// texture = texture.rename(texture_newNames)

// var clay_newNames = clay.bandNames().map(function(item){return ee.String('clayContent_').cat(item)})
// clay = clay.rename(clay_newNames)

// var sand_newNames = sand.bandNames().map(function(item){return ee.String('sandContent_').cat(item)})
// sand = sand.rename(sand_newNames)

// var bulkDensity_newNames = bulkDensity.bandNames().map(function(item){return ee.String('bulkDensity_').cat(item)})
// bulkDensity = bulkDensity.rename(bulkDensity_newNames)

// var organicCarbon_newNames = organicCarbon.bandNames().map(function(item){return ee.String('organicCarbonContent_').cat(item)})
// organicCarbon = organicCarbon.rename(organicCarbon_newNames)

// var ph_newNames = ph.bandNames().map(function(item){return ee.String('ph_').cat(item)})
// ph = ph.rename(ph_newNames)

// var water_newNames = water.bandNames().map(function(item){return ee.String('waterContent_').cat(item)})
// water = water.rename(water_newNames)


// var soilVars = ee.Image.cat([texture, clay, sand, bulkDensity, organicCarbon, ph, water])




///////////////////////////////////////////////////////////////////////////////
/**
 * High carbon stock mapping at large scale with optical satellite imagery and spaceborne LIDAR
 * Nico Lang, Konrad Schindler, Jan Dirk Wegner
 * https://arxiv.org/abs/2107.07431
*/

// var canopy_top_height = ee.ImageCollection('users/nlang/canopy_top_height_2020_ID_PH_MY’);



////////////////////////////////////////////////////////////////////////
// Merged covariates 2018
////////////////////////////////////////////////////////////////////////

var covariates_2018_withoutS1 = ee.Image.cat(
                landsat_2018_mosaic, 
                palsar_2017,
                palsar_texture_2017,
                nationalElev, nationalSlope, nationalAspect,
                distToRoad, distToRiver, distToSettlement,
                distToFbSettlement,           
                distToAllRoadRBIandOSM,       
                distToCoast
            )

var covariates_2018_withS1 = ee.Image.cat(
                landsat_2018_mosaic, 
                palsar_2017,
                palsar_texture_2017,
                nationalElev, nationalSlope, nationalAspect,
                distToRoad, distToRiver, distToSettlement,
                distToFbSettlement,           
                distToAllRoadRBIandOSM,       
                distToCoast,
                S1_season_mosaic,
                S1_annual_mosaic,
                S1_texture
            )
            
            
            
print('covariates_2018_withoutS1', covariates_2018_withoutS1);
print('covariates_2018_withS1', covariates_2018_withS1);


// 2010
var covariates_2010_withoutS1 = ee.Image.cat(
                landsat_2010_mosaic, 
                palsar_2010,
                palsar_texture_2010,
                nationalElev, nationalSlope, nationalAspect,
                distToRoad, distToRiver, distToSettlement,
                distToFbSettlement,           
                distToAllRoadRBIandOSM,          
                distToCoast
          )
          

var covariates_2010_withS1 = ee.Image.cat(
                landsat_2010_mosaic, 
                palsar_2010,
                palsar_texture_2010,
                nationalElev, nationalSlope, nationalAspect,
                distToRoad, distToRiver, distToSettlement,
                distToFbSettlement,           
                distToAllRoadRBIandOSM,          
                distToCoast,
                S1_season_mosaic,             
                S1_annual_mosaic, 
                S1_texture
          )
        
                
print('covariates_2010_withoutS1', covariates_2010_withoutS1);
print('covariates_2010_withS1', covariates_2010_withS1);







/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
EXPORT FEATURES AT TRAINING SAMPLES
*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





function extract_covariates_at_points(covariates_image, sample_points) {
  
  var res = sample_points
            .map(function(feature) {
              return ee.Feature(feature.geometry(),
                  covariates_image.reduceRegion({
                    reducer: ee.Reducer.mean(),
                    geometry: feature.geometry(),
                    scale: land_mask.projection().nominalScale(),
                    crs: land_mask.projection(),
                    maxPixels: 1e13,
                    tileScale: 4
                  }))
                  .copyProperties(feature);
            })
  
  
  res = res.filter(ee.Filter.neq('blue_median', null))
  
  return res;
  
}




////============================================================================================================
// 2010 covariates for training samples from reference map 2010
////============================================================================================================


var features_detailed_JawaBali_c1 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c1);
var features_detailed_JawaBali_c2 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c2);
var features_detailed_JawaBali_c3 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c3);
var features_detailed_JawaBali_c4 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c4);
var features_detailed_JawaBali_c7 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c7);
var features_detailed_JawaBali_c8 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c8);
var features_detailed_JawaBali_c9 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c9);
var features_detailed_JawaBali_c10 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c10);
var features_detailed_JawaBali_c11 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c11);
var features_detailed_JawaBali_c12 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c12);
var features_detailed_JawaBali_c13 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c13);
var features_detailed_JawaBali_c14 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c14);
var features_detailed_JawaBali_c15 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c15);
var features_detailed_JawaBali_c16 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c16);
var features_detailed_JawaBali_c17 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_JawaBali_c17);





var features_detailed_Kalimantan_c1 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c2 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c3 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c4 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c5 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c6 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c7 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c8 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c9 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c10 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c11 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c13 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c14 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c15 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c16 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);
var features_detailed_Kalimantan_c17 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Kalimantan_c1);




var features_detailed_Maluku_c1 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c1);
var features_detailed_Maluku_c2 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c2);
var features_detailed_Maluku_c3 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c3);
var features_detailed_Maluku_c4 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c4);
var features_detailed_Maluku_c5 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c5);
var features_detailed_Maluku_c6 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c6);
var features_detailed_Maluku_c7 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c7);
var features_detailed_Maluku_c8 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c8);
var features_detailed_Maluku_c9 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c9);
var features_detailed_Maluku_c10 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c10);
var features_detailed_Maluku_c11 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c11);
var features_detailed_Maluku_c12 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c12);
var features_detailed_Maluku_c13 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c13);
var features_detailed_Maluku_c14 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c14);
var features_detailed_Maluku_c15 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c15);
var features_detailed_Maluku_c16 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c16);
var features_detailed_Maluku_c17 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Maluku_c17);





var features_detailed_Nusa_c1 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c1);
var features_detailed_Nusa_c2 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c2);
var features_detailed_Nusa_c3 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c3);
var features_detailed_Nusa_c4 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c4);
var features_detailed_Nusa_c6 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c6);
var features_detailed_Nusa_c7 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c7);
var features_detailed_Nusa_c8 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c8);
var features_detailed_Nusa_c9 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c9);
var features_detailed_Nusa_c11 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c11);
var features_detailed_Nusa_c12 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c12);
var features_detailed_Nusa_c13 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c13);
var features_detailed_Nusa_c14 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c14);
var features_detailed_Nusa_c15 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c15);
var features_detailed_Nusa_c16 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c16);
var features_detailed_Nusa_c17 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Nusa_c17);



var features_detailed_Papua_c1 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c1);
var features_detailed_Papua_c2 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c2);
var features_detailed_Papua_c3 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c3);
var features_detailed_Papua_c4 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c4);
var features_detailed_Papua_c5 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c5);
var features_detailed_Papua_c6 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c6);
var features_detailed_Papua_c7 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c7);
var features_detailed_Papua_c8 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c8);
var features_detailed_Papua_c9 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c9);
var features_detailed_Papua_c10 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c10);
var features_detailed_Papua_c11 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c11);
var features_detailed_Papua_c12 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c12);
var features_detailed_Papua_c13 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c13);
var features_detailed_Papua_c14 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c14);
var features_detailed_Papua_c15 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c15);
var features_detailed_Papua_c16 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c16);
var features_detailed_Papua_c17 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Papua_c17);




var features_detailed_Sulawesi_c1 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c1);
var features_detailed_Sulawesi_c2 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c2);
var features_detailed_Sulawesi_c3 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c3);
var features_detailed_Sulawesi_c4 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c4);
var features_detailed_Sulawesi_c5 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c5);
var features_detailed_Sulawesi_c6 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c6);
var features_detailed_Sulawesi_c7 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c7);
var features_detailed_Sulawesi_c8 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c8);
var features_detailed_Sulawesi_c9 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c9);
var features_detailed_Sulawesi_c10 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c10);
var features_detailed_Sulawesi_c11 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c11);
var features_detailed_Sulawesi_c12 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c12);
var features_detailed_Sulawesi_c13 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c13);
var features_detailed_Sulawesi_c14 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c14);
var features_detailed_Sulawesi_c15 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c15);
var features_detailed_Sulawesi_c16 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c16);
var features_detailed_Sulawesi_c17 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sulawesi_c17);




var features_detailed_Sumatera_c1 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c1);
var features_detailed_Sumatera_c2 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c2);
var features_detailed_Sumatera_c3 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c3);
var features_detailed_Sumatera_c4 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c4);
var features_detailed_Sumatera_c5 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c5);
var features_detailed_Sumatera_c6 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c6);
var features_detailed_Sumatera_c7 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c7);
var features_detailed_Sumatera_c8 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c8);
var features_detailed_Sumatera_c9 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c9);
var features_detailed_Sumatera_c10 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c10);
var features_detailed_Sumatera_c11 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c11);
var features_detailed_Sumatera_c12 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c12);
var features_detailed_Sumatera_c13 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c13);
var features_detailed_Sumatera_c14 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c14);
var features_detailed_Sumatera_c15 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c15);
var features_detailed_Sumatera_c16 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c16);
var features_detailed_Sumatera_c17 = extract_covariates_at_points(covariates_2010_withS1, samples_detailed_Sumatera_c17);



/////////////// "rubberMonoculture" training samples from WRI Tree Plantation database ////////////////////
/**
 * As the Tree Plantation polygons, and thus the training samples, are not distributed wall-to-wall, only radiometric covariates are used for more confident generalization of the trained model
*/


var covariates_2018_rad_withoutS1 = ee.Image.cat(
                landsat_2018_mosaic, 
                palsar_2017,
                palsar_texture_2017
               )


var covariates_2018_rad_withS1 = ee.Image.cat(
                landsat_2018_mosaic, 
                palsar_2017,
                palsar_texture_2017,
                S1_season_mosaic,              
                S1_annual_mosaic, 
                S1_texture
               )


var features_detailed_alt_c9 = extract_covariates_at_points(covariates_2018_rad_withS1, samples_detailed_alt_c9)






// var detailed_classes = ee.Dictionary({
//   'undisturbedDrylandForest': 1,              
//   'loggedOverDrylandForest': 2, 
//   'undisturbedMangroveForest': 3,
//   'loggedOverMangroveForest': 4,
//   'undisturbedSwampForest': 5,
//   'loggedOverSwampForest': 6,
//   'agroforestry': 7, 
//   'plantationForest': 8,
//   'rubberMonoculture': 9,
//   'oilPalmMonoculture': 10,
//   'otherMonoculture': 11,
//   'grassAndSavanna': 12,
//   'shrub': 13,
//   'cropland': 14,
//   'settlement': 15, 
//   'clearedLand': 16, 
//   'waterbody': 17
// }) 


print("features_detailed_JawaBali_c1.limit(3)", features_detailed_JawaBali_c1.limit(3))

print("features_detailed_alt_c9.limit(3)", features_detailed_alt_c9.limit(3))



// // Example export for one region, one class (exports for all regions, all classes already run)
// Export.table.toAsset({
//   collection: features_detailed_JawaBali_c1, 
//   description: "detailed_JawaBali_01", 
//   assetId: "IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/01_undisturbedDrylandForest"
// })


// Export.table.toAsset({
//   collection: features_detailed_alt_c9, 
//   description: "detailed_country_alt_09", 
//   assetId: "IIASA/RESTORE/training_samples_features/detailed_class/alternative/country/09_rubberMonoculture_alt"
// })







////============================================================================================================
// 2018 covariates for crowdsourced training samples
////============================================================================================================



var features_simplified_c1 = extract_covariates_at_points(covariates_2018_withS1, samples_simplified_c1);
var features_simplified_c2 = extract_covariates_at_points(covariates_2018_withS1, samples_simplified_c2);
var features_simplified_c3 = extract_covariates_at_points(covariates_2018_withS1, samples_simplified_c3);
var features_simplified_c4 = extract_covariates_at_points(covariates_2018_withS1, samples_simplified_c4);
var features_simplified_c5 = extract_covariates_at_points(covariates_2018_withS1, samples_simplified_c5);
var features_simplified_c6 = extract_covariates_at_points(covariates_2018_withS1, samples_simplified_c6);
var features_simplified_c7 = extract_covariates_at_points(covariates_2018_withS1, samples_simplified_c7);
var features_simplified_c8 = extract_covariates_at_points(covariates_2018_withS1, samples_simplified_c8);
var features_simplified_c9 = extract_covariates_at_points(covariates_2018_withS1, samples_simplified_c9);
var features_simplified_c10 = extract_covariates_at_points(covariates_2018_withS1, samples_simplified_c10);



print("features_simplified_c1.limit(3)", features_simplified_c1.limit(3))




// var simplified_classes  = ee.Dictionary({
//   'undisturbedForest': 1,
//   'loggedOverForest': 2, 
//   'oilPalmMonoculture': 3,
//   'treeBasedNotOilPalm': 4,
//   'cropland': 5,
//   'shrub': 6,
//   'grassAndSavanna': 7,
//   'water': 8,
//   'settlement': 9,
//   'clearedLand': 10
// }) 



// // Example export for one region, one class (exports for all regions, all classes already run)
// Export.table.toAsset({
//   collection: features_simplified_c1, 
//   description: "simplified_01", 
//   assetId: "IIASA/RESTORE/training_samples_features/simplified_class_crowdsourced/country/01_undisturbedForest"
// })


