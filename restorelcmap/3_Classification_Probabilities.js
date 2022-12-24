

/*///////////////////////////////////////////////////////////////
VECTOR MAP
*//////////////////////////////////////////////////////////////

var classification_regions = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/classification_regions")


print("classification_regions", classification_regions)


var Sumatera_geom = classification_regions.filter(ee.Filter.eq('region_name', 'Sumatera')).geometry()
var Kalimantan_geom = classification_regions.filter(ee.Filter.eq('region_name', 'Kalimantan')).geometry()
var JawaBali_geom = classification_regions.filter(ee.Filter.eq('region_name', 'JawaBali')).geometry()
var Sulawesi_geom = classification_regions.filter(ee.Filter.eq('region_name', 'Sulawesi')).geometry()
var Nusa_geom = classification_regions.filter(ee.Filter.eq('region_name', 'Nusa')).geometry()
var Maluku_geom = classification_regions.filter(ee.Filter.eq('region_name', 'Maluku')).geometry()
var Papua_geom = classification_regions.filter(ee.Filter.eq('region_name', 'Papua')).geometry()





/*///////////////////////////////////////////////////////////////
MAP RASTER TEMPLATE COMPATIBLE WITH REFERENCE MAP
*//////////////////////////////////////////////////////////////

var land_mask = ee.Image("users/hadicu06/IIASA/RESTORE/miscellaneous/land_mask"); 



/*///////////////////////////////////////////////////////////////
TRAINING SAMPLES, WITH COVARIATES
Note training data with features, for each class can be substituted with other sources/versions of training data (with same features)
*//////////////////////////////////////////////////////////////


////==============================================================================================
// Sampled from reference map 2010
////==============================================================================================


var samples_detailed_JawaBali_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/01_undisturbedDrylandForest");  
var samples_detailed_JawaBali_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/02_loggedOverDrylandForest");
var samples_detailed_JawaBali_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/03_undisturbedMangroveForest");
var samples_detailed_JawaBali_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/04_loggedOverMangroveForest");
var samples_detailed_JawaBali_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/07_agroforestry");
var samples_detailed_JawaBali_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/08_plantationForest");
var samples_detailed_JawaBali_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/09_rubberMonoculture");
var samples_detailed_JawaBali_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/10_oilPalmMonoculture");
var samples_detailed_JawaBali_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/11_otherMonoculture");
var samples_detailed_JawaBali_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/12_grassAndSavanna");
var samples_detailed_JawaBali_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/13_shrub");
var samples_detailed_JawaBali_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/14_cropland");
var samples_detailed_JawaBali_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/15_settlement");
var samples_detailed_JawaBali_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/16_clearedLand");
var samples_detailed_JawaBali_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/JawaBali/17_waterbody");


var samples_detailed_Kalimantan_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/01_undisturbedDrylandForest");
var samples_detailed_Kalimantan_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/02_loggedOverDrylandForest");
var samples_detailed_Kalimantan_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/03_undisturbedMangroveForest");
var samples_detailed_Kalimantan_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/04_loggedOverMangroveForest");
var samples_detailed_Kalimantan_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/05_undisturbedSwampForest");
var samples_detailed_Kalimantan_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/06_loggedOverSwampForest");
var samples_detailed_Kalimantan_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/07_agroforestry");
var samples_detailed_Kalimantan_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/08_plantationForest");
var samples_detailed_Kalimantan_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/09_rubberMonoculture");
var samples_detailed_Kalimantan_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/10_oilPalmMonoculture");
var samples_detailed_Kalimantan_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/11_otherMonoculture");
var samples_detailed_Kalimantan_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/13_shrub");
var samples_detailed_Kalimantan_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/14_cropland");
var samples_detailed_Kalimantan_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/15_settlement");
var samples_detailed_Kalimantan_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/16_clearedLand");
var samples_detailed_Kalimantan_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Kalimantan/17_waterbody");


var samples_detailed_Maluku_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/01_undisturbedDrylandForest");  
var samples_detailed_Maluku_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/02_loggedOverDrylandForest");
var samples_detailed_Maluku_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/03_undisturbedMangroveForest");
var samples_detailed_Maluku_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/04_loggedOverMangroveForest");
var samples_detailed_Maluku_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/05_undisturbedSwampForest");
var samples_detailed_Maluku_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/06_loggedOverSwampForest");
var samples_detailed_Maluku_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/07_agroforestry");
var samples_detailed_Maluku_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/08_plantationForest");
var samples_detailed_Maluku_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/09_rubberMonoculture");
var samples_detailed_Maluku_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/10_oilPalmMonoculture");
var samples_detailed_Maluku_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/11_otherMonoculture");
var samples_detailed_Maluku_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/12_grassAndSavanna");
var samples_detailed_Maluku_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/13_shrub");
var samples_detailed_Maluku_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/14_cropland");
var samples_detailed_Maluku_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/15_settlement");
var samples_detailed_Maluku_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/16_clearedLand");
var samples_detailed_Maluku_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Maluku/17_waterbody");


var samples_detailed_Nusa_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/01_undisturbedDrylandForest");  
var samples_detailed_Nusa_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/02_loggedOverDrylandForest");
var samples_detailed_Nusa_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/03_undisturbedMangroveForest");
var samples_detailed_Nusa_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/04_loggedOverMangroveForest");
var samples_detailed_Nusa_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/06_loggedOverSwampForest");
var samples_detailed_Nusa_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/07_agroforestry");
var samples_detailed_Nusa_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/08_plantationForest");
var samples_detailed_Nusa_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/09_rubberMonoculture");
var samples_detailed_Nusa_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/11_otherMonoculture");
var samples_detailed_Nusa_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/12_grassAndSavanna");
var samples_detailed_Nusa_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/13_shrub");
var samples_detailed_Nusa_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/14_cropland");
var samples_detailed_Nusa_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/15_settlement");
var samples_detailed_Nusa_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/16_clearedLand");
var samples_detailed_Nusa_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Nusa/17_waterbody");


var samples_detailed_Papua_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/01_undisturbedDrylandForest");
var samples_detailed_Papua_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/02_loggedOverDrylandForest");
var samples_detailed_Papua_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/03_undisturbedMangroveForest");
var samples_detailed_Papua_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/04_loggedOverMangroveForest");
var samples_detailed_Papua_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/05_undisturbedSwampForest");
var samples_detailed_Papua_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/06_loggedOverSwampForest");
var samples_detailed_Papua_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/07_agroforestry");
var samples_detailed_Papua_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/08_plantationForest");
var samples_detailed_Papua_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/09_rubberMonoculture");
var samples_detailed_Papua_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/10_oilPalmMonoculture");
var samples_detailed_Papua_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/11_otherMonoculture");
var samples_detailed_Papua_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/12_grassAndSavanna");
var samples_detailed_Papua_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/13_shrub");
var samples_detailed_Papua_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/14_cropland");
var samples_detailed_Papua_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/15_settlement");
var samples_detailed_Papua_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/16_clearedLand");
var samples_detailed_Papua_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Papua/17_waterbody");



var samples_detailed_Sulawesi_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/01_undisturbedDrylandForest");
var samples_detailed_Sulawesi_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/02_loggedOverDrylandForest");
var samples_detailed_Sulawesi_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/03_undisturbedMangroveForest");
var samples_detailed_Sulawesi_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/04_loggedOverMangroveForest");
var samples_detailed_Sulawesi_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/05_undisturbedSwampForest");
var samples_detailed_Sulawesi_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/06_loggedOverSwampForest");
var samples_detailed_Sulawesi_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/07_agroforestry");
var samples_detailed_Sulawesi_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/08_plantationForest");
var samples_detailed_Sulawesi_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/09_rubberMonoculture");
var samples_detailed_Sulawesi_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/10_oilPalmMonoculture");
var samples_detailed_Sulawesi_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/11_otherMonoculture");
var samples_detailed_Sulawesi_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/12_grassAndSavanna");
var samples_detailed_Sulawesi_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/13_shrub");
var samples_detailed_Sulawesi_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/14_cropland");
var samples_detailed_Sulawesi_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/15_settlement");
var samples_detailed_Sulawesi_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/16_clearedLand");
var samples_detailed_Sulawesi_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sulawesi/17_waterbody");




var samples_detailed_Sumatera_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/01_undisturbedDrylandForest");  
var samples_detailed_Sumatera_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/02_loggedOverDrylandForest");
var samples_detailed_Sumatera_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/03_undisturbedMangroveForest");
var samples_detailed_Sumatera_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/04_loggedOverMangroveForest");
var samples_detailed_Sumatera_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/05_undisturbedSwampForest");
var samples_detailed_Sumatera_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/06_loggedOverSwampForest");
var samples_detailed_Sumatera_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/07_agroforestry");
var samples_detailed_Sumatera_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/08_plantationForest");
var samples_detailed_Sumatera_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/09_rubberMonoculture");
var samples_detailed_Sumatera_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/10_oilPalmMonoculture");
var samples_detailed_Sumatera_c11 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/11_otherMonoculture");
var samples_detailed_Sumatera_c12 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/12_grassAndSavanna");
var samples_detailed_Sumatera_c13 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/13_shrub");
var samples_detailed_Sumatera_c14 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/14_cropland");
var samples_detailed_Sumatera_c15 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/15_settlement");
var samples_detailed_Sumatera_c16 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/16_clearedLand");
var samples_detailed_Sumatera_c17 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/Sumatera/17_waterbody");




//////////////// "rubberMonoculture" training samples from WRI Tree Plantation database /////////////////////

var samples_detailed_alt_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/detailed_class/alternative/country/09_rubberMonoculture_alt");









////==============================================================================================
// Crowdsourced with 2018 VHR
////==============================================================================================

var samples_simplified_c1 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/simplified_class_crowdsourced/country/01_undisturbedForest"); 
var samples_simplified_c2 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/simplified_class_crowdsourced/country/02_loggedOverForest");
var samples_simplified_c3 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/simplified_class_crowdsourced/country/03_oilPalmMonoculture"); 
var samples_simplified_c4 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/simplified_class_crowdsourced/country/04_treeBasedNotOilPalm");  
var samples_simplified_c5 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/simplified_class_crowdsourced/country/05_cropland");  
var samples_simplified_c6 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/simplified_class_crowdsourced/country/06_shrub"); 
var samples_simplified_c7 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/simplified_class_crowdsourced/country/07_grassAndSavanna");  
var samples_simplified_c8 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/simplified_class_crowdsourced/country/08_waterbody");  
var samples_simplified_c9 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/simplified_class_crowdsourced/country/09_settlement");  
var samples_simplified_c10 = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/training_samples_features/simplified_class_crowdsourced/country/10_clearedLand");










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


var SRTM = ee.Image("USGS/SRTMGL1_003") 
        .clipToCollection(classification_regions);               
var nationalElev = SRTM;


var distToAllRoadRBIandOSM = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/distance_road_rbi_osm_country").rename("dist_road_all_rbiNosm")

var distToCoast = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/distance_coast_country").rename('dist_coast')




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
                     .filterBounds(classification_regions.geometry())
                     .first();                        // only 1 image in a year
                     
palsar_2017 = palsar_2017
             .updateMask(palsar_2017.select('qa').neq(ee.Image(0)))
             .updateMask(palsar_2017.select('qa').neq(ee.Image(100)))
             .updateMask(palsar_2017.select('qa').neq(ee.Image(150))) // just keep land & ocean/water
             .select(['HH', 'HV'], ['HH', 'HV'])
             .clipToCollection(classification_regions);
                   
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
// // Note: additional covariates need to be added to the training samples (e.g. exported in script XXXX)
// ////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////
// var oxfordAccessibility = ee.Image("Oxford/MAP/accessibility_to_cities_2015_v1_0")
//                         .clipToCollection(classification_regions);



////////////////////////////////////////////////////////////////////////////////////
// // MODIS percent tree cover
// var VCF = ee.ImageCollection("MODIS/006/MOD44B")
//                     .filterBounds(classification_regions.geometry())
//                     .filterDate('2018-01-01', '2018-12-31')
//                     .first()



////////////////////////////////////////////////////////////////////////////////////
// // Tandem-X
// var tandemx90 = ee.Image('users/hadicu06/IIASA/composite/tandemx_Indo_mosaic_clipGADM')
//                 .rename('tandemx90');


// TandemX
// tandemx90 = tandemx90.round().toInt16()



////////////////////////////////////////////////////////////////////////////////////
// Add climate variables

// var prec = ee.Image("OpenLandMap/CLM/CLM_PRECIPITATION_SM2RAIN_M/v01")
//           .clipToCollection(classification_regions);
          
// var prec_newNames = prec.bandNames().map(function(name){return ee.String('prec_').cat(name)})          

// prec = prec.rename(prec_newNames)


// var temperature = ee.Image("OpenLandMap/CLM/CLM_LST_MOD11A2-DAY_M/v01")
//                   .clipToCollection(classification_regions);

// var temperature_newNames = temperature.bandNames().map(function(name){return ee.String('temp_').cat(name)})          

// temperature = temperature.rename(temperature_newNames)



/////////////////////////////////////////////////////////////////////////////////
// Add lat-lon as predictors

// var pixelLonLat = ee.Image.pixelLonLat().resample(params.continuousResample)




////////////////////////////////////////////////////////////////////////////////////
// Add soil predictors


// var texture = ee.Image("OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02").clipToCollection(classification_regions);

// var clay = ee.Image("OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02").clipToCollection(classification_regions);

// var sand = ee.Image("OpenLandMap/SOL/SOL_SAND-WFRACTION_USDA-3A1A1A_M/v02").clipToCollection(classification_regions);

// var bulkDensity = ee.Image("OpenLandMap/SOL/SOL_BULKDENS-FINEEARTH_USDA-4A1H_M/v02").clipToCollection(classification_regions);

// var organicCarbon = ee.Image("OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02").clipToCollection(classification_regions);

// var ph = ee.Image("OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1A2A_M/v02").clipToCollection(classification_regions);

// var water = ee.Image("OpenLandMap/SOL/SOL_WATERCONTENT-33KPA_USDA-4B1C_M/v01").clipToCollection(classification_regions);


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




print("covariates_2018_withoutS1", covariates_2018_withoutS1)





/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 DO THE CLASSIFICATION (TRAIN & CLASSIFY) BY CLASSIFICATION REGION
*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var params = {
  includeS1Features: false,  // NOTE: As including S1 features was not found to benefit overall in balance for all classes, and due to time difference between when dense S1 data started to be available and the reference map, all results were based on not including S1 features. 
  numTrees: 100,  
  minLeaf: 5,             
  seed: 42,                                    
  outScale: land_mask.projection().nominalScale().getInfo(),                  
  outProjection: land_mask.projection(),                              
  outCrs: land_mask.projection().crs(),
};


var covariates_2018;

if (params.includeS1Features) {
  
  covariates_2018 = covariates_2018_withS1;
  
} else {
  
  covariates_2018 = covariates_2018_withoutS1;
  
}




function train_classify_prob(training_samples_features, class_property_name, covariates_list, image_to_classify) {
  
  
  // Instantiate classifier
  var probClassifier = ee.Classifier.smileRandomForest({   
                          numberOfTrees: params.numTrees, 
                          minLeafPopulation: params.minLeaf,                
                          seed: params.seed,                                                   
                          variablesPerSplit: ee.List(covariates_list).size().divide(3).round().int().getInfo()  // ouch
                        }).setOutputMode('PROBABILITY');          


   // Train the classifier for classId primitive
   var trainedClassifier = probClassifier.train({
     features: training_samples_features, 
     classProperty: class_property_name, 
     inputProperties: covariates_list
   })
   
   
   
   // Apply the trained classifier to all pixels
   var classified = image_to_classify
                    .classify(trainedClassifier)
                    
                    
   // Scale the value to integer (percent probability) for efficient storage
   classified = classified.multiply(100).round().byte()  
                
   return ee.Image(classified).rename('percent_probability');
  
  
}


function make_class_property_num(ft){
  return ft.set('class_binary_num', ee.Number.parse(ft.getString('class_binary_str')))
}







/*///////////////////////////////////////////////////////////////////////////////////////
///////////// DETAILED CLASSIFICATION SCHEME //////////////////////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////

var covariates_2018_Sumatera = covariates_2018.clip(Sumatera_geom)
var covariates_2018_Kalimantan = covariates_2018.clip(Kalimantan_geom)
var covariates_2018_JawaBali = covariates_2018.clip(JawaBali_geom)
var covariates_2018_Sulawesi = covariates_2018.clip(Sulawesi_geom)
var covariates_2018_Nusa = covariates_2018.clip(Nusa_geom)
var covariates_2018_Maluku = covariates_2018.clip(Maluku_geom)
var covariates_2018_Papua = covariates_2018.clip(Papua_geom)





/**
 * Design decision: 
 * - make explicit (despite repetition) each binary classification for stakeholders understanding
 * - training samples were balanced for each binary classification case i.e. for a land cover class within a classification region
 */




var prob_detailed_JawaBali_c1 = train_classify_prob(samples_detailed_JawaBali_c1.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c2 = train_classify_prob(samples_detailed_JawaBali_c2.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c3 = train_classify_prob(samples_detailed_JawaBali_c3.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c4 = train_classify_prob(samples_detailed_JawaBali_c4.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c7 = train_classify_prob(samples_detailed_JawaBali_c7.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c8 = train_classify_prob(samples_detailed_JawaBali_c8.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
var prob_detailed_JawaBali_c9 = train_classify_prob(samples_detailed_JawaBali_c9.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c10 = train_classify_prob(samples_detailed_JawaBali_c10.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c11 = train_classify_prob(samples_detailed_JawaBali_c11.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c12 = train_classify_prob(samples_detailed_JawaBali_c12.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c13 = train_classify_prob(samples_detailed_JawaBali_c13.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
var prob_detailed_JawaBali_c14 = train_classify_prob(samples_detailed_JawaBali_c14.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c15 = train_classify_prob(samples_detailed_JawaBali_c15.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c16 = train_classify_prob(samples_detailed_JawaBali_c16.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)
// var prob_detailed_JawaBali_c17 = train_classify_prob(samples_detailed_JawaBali_c17.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_JawaBali)



// var prob_detailed_Kalimantan_c1 = train_classify_prob(samples_detailed_Kalimantan_c1.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c2 = train_classify_prob(samples_detailed_Kalimantan_c2.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c3 = train_classify_prob(samples_detailed_Kalimantan_c3.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c4 = train_classify_prob(samples_detailed_Kalimantan_c4.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c5 = train_classify_prob(samples_detailed_Kalimantan_c5.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c6 = train_classify_prob(samples_detailed_Kalimantan_c6.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c7 = train_classify_prob(samples_detailed_Kalimantan_c7.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c8 = train_classify_prob(samples_detailed_Kalimantan_c8.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
var prob_detailed_Kalimantan_c9 = train_classify_prob(samples_detailed_Kalimantan_c9.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c10 = train_classify_prob(samples_detailed_Kalimantan_c10.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c11 = train_classify_prob(samples_detailed_Kalimantan_c11.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c13 = train_classify_prob(samples_detailed_Kalimantan_c13.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c14 = train_classify_prob(samples_detailed_Kalimantan_c14.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c15 = train_classify_prob(samples_detailed_Kalimantan_c15.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c16 = train_classify_prob(samples_detailed_Kalimantan_c16.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)
// var prob_detailed_Kalimantan_c17 = train_classify_prob(samples_detailed_Kalimantan_c17.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Kalimantan)



// var prob_detailed_Maluku_c1 = train_classify_prob(samples_detailed_Maluku_c1.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c2 = train_classify_prob(samples_detailed_Maluku_c2.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c3 = train_classify_prob(samples_detailed_Maluku_c3.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c4 = train_classify_prob(samples_detailed_Maluku_c4.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c5 = train_classify_prob(samples_detailed_Maluku_c5.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c6 = train_classify_prob(samples_detailed_Maluku_c6.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c7 = train_classify_prob(samples_detailed_Maluku_c7.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c8 = train_classify_prob(samples_detailed_Maluku_c8.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
var prob_detailed_Maluku_c9 = train_classify_prob(samples_detailed_Maluku_c9.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c10 = train_classify_prob(samples_detailed_Maluku_c10.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c11 = train_classify_prob(samples_detailed_Maluku_c11.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c12 = train_classify_prob(samples_detailed_Maluku_c12.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c13 = train_classify_prob(samples_detailed_Maluku_c13.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c14 = train_classify_prob(samples_detailed_Maluku_c14.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c15 = train_classify_prob(samples_detailed_Maluku_c15.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c16 = train_classify_prob(samples_detailed_Maluku_c16.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)
// var prob_detailed_Maluku_c17 = train_classify_prob(samples_detailed_Maluku_c17.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Maluku)



// var prob_detailed_Nusa_c1 = train_classify_prob(samples_detailed_Nusa_c1.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c2 = train_classify_prob(samples_detailed_Nusa_c2.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c3 = train_classify_prob(samples_detailed_Nusa_c3.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c4 = train_classify_prob(samples_detailed_Nusa_c4.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c6 = train_classify_prob(samples_detailed_Nusa_c6.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c7 = train_classify_prob(samples_detailed_Nusa_c7.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c8 = train_classify_prob(samples_detailed_Nusa_c8.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
var prob_detailed_Nusa_c9 = train_classify_prob(samples_detailed_Nusa_c9.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c11 = train_classify_prob(samples_detailed_Nusa_c11.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c12 = train_classify_prob(samples_detailed_Nusa_c12.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c13 = train_classify_prob(samples_detailed_Nusa_c13.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c14 = train_classify_prob(samples_detailed_Nusa_c14.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c15 = train_classify_prob(samples_detailed_Nusa_c15.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c16 = train_classify_prob(samples_detailed_Nusa_c16.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)
// var prob_detailed_Nusa_c17 = train_classify_prob(samples_detailed_Nusa_c17.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Nusa)




// var prob_detailed_Papua_c1 = train_classify_prob(samples_detailed_Papua_c1.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c2 = train_classify_prob(samples_detailed_Papua_c2.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c3 = train_classify_prob(samples_detailed_Papua_c3.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c4 = train_classify_prob(samples_detailed_Papua_c4.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c5 = train_classify_prob(samples_detailed_Papua_c5.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c6 = train_classify_prob(samples_detailed_Papua_c6.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c7 = train_classify_prob(samples_detailed_Papua_c7.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c8 = train_classify_prob(samples_detailed_Papua_c8.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
var prob_detailed_Papua_c9 = train_classify_prob(samples_detailed_Papua_c9.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c10 = train_classify_prob(samples_detailed_Papua_c10.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c11 = train_classify_prob(samples_detailed_Papua_c11.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c12 = train_classify_prob(samples_detailed_Papua_c12.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c13 = train_classify_prob(samples_detailed_Papua_c13.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c14 = train_classify_prob(samples_detailed_Papua_c14.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c15 = train_classify_prob(samples_detailed_Papua_c15.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c16 = train_classify_prob(samples_detailed_Papua_c16.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)
// var prob_detailed_Papua_c17 = train_classify_prob(samples_detailed_Papua_c17.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Papua)



// var prob_detailed_Sulawesi_c1 = train_classify_prob(samples_detailed_Sulawesi_c1.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c2 = train_classify_prob(samples_detailed_Sulawesi_c2.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c3 = train_classify_prob(samples_detailed_Sulawesi_c3.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c4 = train_classify_prob(samples_detailed_Sulawesi_c4.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c5 = train_classify_prob(samples_detailed_Sulawesi_c5.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c6 = train_classify_prob(samples_detailed_Sulawesi_c6.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c7 = train_classify_prob(samples_detailed_Sulawesi_c7.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c8 = train_classify_prob(samples_detailed_Sulawesi_c8.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
var prob_detailed_Sulawesi_c9 = train_classify_prob(samples_detailed_Sulawesi_c9.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c10 = train_classify_prob(samples_detailed_Sulawesi_c10.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c11 = train_classify_prob(samples_detailed_Sulawesi_c11.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c12 = train_classify_prob(samples_detailed_Sulawesi_c12.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c13 = train_classify_prob(samples_detailed_Sulawesi_c13.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c14 = train_classify_prob(samples_detailed_Sulawesi_c14.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c15 = train_classify_prob(samples_detailed_Sulawesi_c15.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c16 = train_classify_prob(samples_detailed_Sulawesi_c16.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)
// var prob_detailed_Sulawesi_c17 = train_classify_prob(samples_detailed_Sulawesi_c17.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sulawesi)



// var prob_detailed_Sumatera_c1 = train_classify_prob(samples_detailed_Sumatera_c1.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c2 = train_classify_prob(samples_detailed_Sumatera_c2.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c3 = train_classify_prob(samples_detailed_Sumatera_c3.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c4 = train_classify_prob(samples_detailed_Sumatera_c4.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c5 = train_classify_prob(samples_detailed_Sumatera_c5.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c6 = train_classify_prob(samples_detailed_Sumatera_c6.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c7 = train_classify_prob(samples_detailed_Sumatera_c7.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c8 = train_classify_prob(samples_detailed_Sumatera_c8.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
var prob_detailed_Sumatera_c9 = train_classify_prob(samples_detailed_Sumatera_c9.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c10 = train_classify_prob(samples_detailed_Sumatera_c10.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c11 = train_classify_prob(samples_detailed_Sumatera_c11.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c12 = train_classify_prob(samples_detailed_Sumatera_c12.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c13 = train_classify_prob(samples_detailed_Sumatera_c13.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c14 = train_classify_prob(samples_detailed_Sumatera_c14.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c15 = train_classify_prob(samples_detailed_Sumatera_c15.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c16 = train_classify_prob(samples_detailed_Sumatera_c16.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)
// var prob_detailed_Sumatera_c17 = train_classify_prob(samples_detailed_Sumatera_c17.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018_Sumatera)





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


var prob_detailed_alt_c9 = train_classify_prob(samples_detailed_alt_c9.map(make_class_property_num), 'class_binary_num', covariates_2018_rad_withoutS1.bandNames(), covariates_2018_rad_withoutS1)






// Inspect example result
print("prob_detailed_JawaBali_c1", prob_detailed_JawaBali_c1)
print("prob_detailed_JawaBali_c14", prob_detailed_JawaBali_c14)
print("prob_detailed_JawaBali_c9", prob_detailed_JawaBali_c9)
print("prob_detailed_alt_c9", prob_detailed_alt_c9)

Map.addLayer(prob_detailed_JawaBali_c1, {min: 0, max: 100}, "prob_detailed_JawaBali_c1")
Map.addLayer(prob_detailed_JawaBali_c14, {min: 0, max: 100}, "prob_detailed_JawaBali_c14")
Map.addLayer(prob_detailed_JawaBali_c9, {min: 0, max: 100}, "prob_detailed_JawaBali_c9")
Map.addLayer(prob_detailed_alt_c9, {min: 0, max: 100}, "prob_detailed_alt_c9")


Map.centerObject(JawaBali_geom)
Map.setOptions('SATELLITE')





///////////// Example export of result for one class, one region. Results for all classes and all regions already exported to the shared Asset. ////////////


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


var prob_detailed_c9_mosaic = ee.ImageCollection.fromImages([
   prob_detailed_JawaBali_c9, prob_detailed_Kalimantan_c9, prob_detailed_Maluku_c9, prob_detailed_Nusa_c9, 
   prob_detailed_Papua_c9, prob_detailed_Sulawesi_c9, prob_detailed_Sumatera_c9
  ]).mosaic();


print("prob_detailed_c9_mosaic", prob_detailed_c9_mosaic)
Map.addLayer(prob_detailed_c9_mosaic, {min: 0, max: 100}, "prob_detailed_c9_mosaic")




// Export.image.toAsset({
//   image: prob_detailed_c9_mosaic, 
//   description: "09_rubberMonoculture_2018_trainRef2010", 
//   assetId: "IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/09_rubberMonoculture_2018_trainRef2010", 
//   pyramidingPolicy: {".default": "mean"}, 
//   region: classification_regions.geometry(), 
//   scale: params.outScale,
//   crs: params.outCrs,
//   maxPixels: 1e13
// })









//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


/*///////////////////////////////////////////////////////////////////////////////////////
///////////// SIMPLIFIED SCHEME WITH CROWDSOURCED TRAINING DATA /////////////////////////
*/////////////////////////////////////////////////////////////////////////////////////////

/**
 * Given available training sample size and geographical distribution, train and apply a single countrywide model
*/
  
// var prob_simplified_c1 = train_classify_prob(samples_simplified_c1.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018)
// var prob_simplified_c2 = train_classify_prob(samples_simplified_c2.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018)
// var prob_simplified_c3 = train_classify_prob(samples_simplified_c3.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018)
// var prob_simplified_c4 = train_classify_prob(samples_simplified_c4.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018)
var prob_simplified_c5 = train_classify_prob(samples_simplified_c5.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018)
// var prob_simplified_c6 = train_classify_prob(samples_simplified_c6.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018)
// var prob_simplified_c7 = train_classify_prob(samples_simplified_c7.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018)
// var prob_simplified_c8 = train_classify_prob(samples_simplified_c8.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018)
// var prob_simplified_c9 = train_classify_prob(samples_simplified_c9.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018)
// var prob_simplified_c10 = train_classify_prob(samples_simplified_c10.map(make_class_property_num), 'class_binary_num', covariates_2018.bandNames(), covariates_2018)





// Inspect example result
print("prob_simplified_c5", prob_simplified_c5)
Map.addLayer(prob_simplified_c5, {mn:0, max:100}, "prob_simplified_c5")



////////// Example export of result for one class, one region. Results for all classes and all regions already exported to the shared Asset. ////////////


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


// Export.image.toAsset({
//   image: prob_simplified_c5, 
//   description: "05_cropland_2018_trainInclCrowd", 
//   assetId: "IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/05_cropland_2018_trainInclCrowd", 
//   pyramidingPolicy: {".default": "mean"}, 
//   region: classification_regions.geometry(), 
//   scale: params.outScale,
//   crs: params.outCrs,
//   maxPixels: 1e13
// })






