/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
FOR MAP VISUALIZATION 
*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////// Detailed legend classification 


var LEGEND_DET = {
    '1: Undisturbed dry-land forest': '#a6cee3', 
    '2: Logged-over dry-land forest': '#1f78b4',
    '3: Undisturbed mangrove': '#b2df8a',
    '4: Logged-over mangrove': '#33a02c',
    '5: Undisturbed swamp forest': '#fb9a99', 
    '6: Logged-over swamp forest': '#e31a1c',
    '7: Agroforestry': '#fdbf6f',
    '8: Plantation forest': '#ff7f00',
    '9: Rubber monoculture': '#cab2d6',
    '10: Oil palm monoculture': '#6a3d9a',
    '11: Other monoculture': '#c51b8a',
    '12: Grass/savanna': '#b15928',
    '13: Shrub': '#8dd3c7',
    '14: Cropland': '#ffffb3',
    '15: Settlement': '#67001f',
    '16: Cleared land': '#fb8072',
    '17: Waterbody': '#252525'
  };
  
  
  var lcPaletteDet = Object.keys(LEGEND_DET).map(function(key){
    return LEGEND_DET[key];
  });
  
  
  
  var legend_det = makeLegend(LEGEND_DET, 'top-right');
  
  
  Map.add(legend_det);
  
  
  
  ///////////////////////// Simplified legend classification, incorporating crowdsourced data
  
  
  var clsNameIdnumDictSimpl = ee.Dictionary({
    'undisturbedForest': 1,
    'loggedOverForest': 2, 
    'oilPalmMonoculture': 3,
    'treeBasedNotOilPalm': 4,
    'cropland': 5,
    'shrub': 6,
    'grassAndSavanna': 7,
    'waterbody': 8,
    'settlement': 9,
    'clearedLand': 10
  });
  
  
  
  var LEGEND_SIMPL = {
    '1: Undisturbed Forest': '#115420', 
    '2: Logged Over Forest': '#7db087',
    '3: Oil Palm Monoculture': '#c3aa69',
    '4: Tree Based Not Oil Palm': '#c51b8a',
    '5: Cropland': '#8dc33b',
    '6: Shrub': '#800080',
    '7: Grass And Savanna': '#f4a460',
    '8: Waterbody': '#aec3d4',
    '9: Settlement': '#67001f',
    '10: Cleared Land': '#674c06',
  };
  
  
  
  
  var lcPaletteSimpl = Object.keys(LEGEND_SIMPL).map(function(key){
    return LEGEND_SIMPL[key];
  });
  
  var legend_simpl = makeLegend(LEGEND_SIMPL, 'top-left');
  
  
  Map.add(legend_simpl);
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  SOME DATASETS FOR MASKS
  *//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  var classification_regions = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/classification_regions");
  
  var land_mask = ee.Image("users/hadicu06/IIASA/RESTORE/miscellaneous/land_mask");
  
  var landsat_2018_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/ls_composite_2018_byRegion").mosaic();
  
  
  
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  GLOBAL PARAMETERS
  *//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  var params = {
                           
    showAllLayers: false,                        
    
  };
  
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////// CLASS PROBABILITIES: DETAILED LEGEND CLASSIFICATION ///////////////////////////////
  *//////////////////////////////////////////////////////////////////////////////////////////////////
  
  /**
   * Design choice: binary probability maps for each class so can improve the final map in a modularized way by improving selected classes
   * (e.g. better training data for those classes are available, better mask is available to superimpose, etc.)
   * following
   * Saah, D., Tenneson, K., Poortinga, A., Nguyen, Q., Chishtie, F., San Aung, K., ... & Ganz, D. (2020). Primitives as building blocks for constructing land cover maps. International Journal of Applied Earth Observation and Geoinformation, 85, 101979.
  */ 
  
  // Trained with reference map 2010
  var prob_det_01_undisturbedDrylandForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/01_undisturbedDrylandForest_2018_trainRef2010");
  var prob_det_02_loggedOverDrylandForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/02_loggedOverDrylandForest_2018_trainRef2010");
  var prob_det_03_undisturbedMangroveForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/03_undisturbedMangroveForest_2018_trainRef2010");
  var prob_det_04_loggedOverMangroveForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/04_loggedOverMangroveForest_2018_trainRef2010");
  var prob_det_05_undisturbedSwampForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/05_undisturbedSwampForest_2018_trainRef2010");
  var prob_det_06_loggedOverSwampForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/06_loggedOverSwampForest_2018_trainRef2010");
  var prob_det_07_agroforestry = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/07_agroforestry_2018_trainRef2010");
  var prob_det_08_plantationForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/08_plantationForest_2018_trainRef2010");
  var prob_det_09_rubberMonoculture = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/09_rubberMonoculture_2018_trainRef2010");
  var prob_det_10_oilPalmMonoculture = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/10_oilPalmMonoculture_2018_trainRef2010");
  var prob_det_11_otherMonoculture = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/11_otherMonoculture_2018_trainRef2010");
  var prob_det_12_grassAndSavanna = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/12_grassAndSavanna_2018_trainRef2010");
  var prob_det_13_shrub = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/13_shrub_2018_trainRef2010");
  var prob_det_14_cropland = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/14_cropland_2018_trainRef2010");
  var prob_det_15_settlement = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/15_settlement_2018_trainRef2010");
  var prob_det_16_clearedLand = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/16_clearedLand_2018_trainRef2010");
  var prob_det_17_waterbody = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/17_waterbody_2018_trainRef2010");
  
  
  
  // Trained with alternative reference map i.e. WRI Tree Plantation for "Rubber monoculture" class
  var prob_det_09_rubberMonoculture_alt = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/09_rubberMonoculture_2018_trainWRITreePlantation");
  
  
  // Make into a multiband image
  var prob_det_multiband = ee.Image.cat([
    prob_det_01_undisturbedDrylandForest.rename('undisturbedDrylandForest'),
    prob_det_02_loggedOverDrylandForest.rename('loggedOverDrylandForest'),
    prob_det_03_undisturbedMangroveForest.rename('undisturbedMangroveForest'),
    prob_det_04_loggedOverMangroveForest.rename('loggedOverMangroveForest'),
    prob_det_05_undisturbedSwampForest.rename('undisturbedSwampForest'),
    prob_det_06_loggedOverSwampForest.rename('loggedOverSwampForest'),
    prob_det_07_agroforestry.rename('agroforestry'),
    prob_det_08_plantationForest.rename('plantationForest'),
    prob_det_09_rubberMonoculture_alt.rename('rubberMonoculture'),    // Trained with WRI Tree Plantation
    prob_det_10_oilPalmMonoculture.rename('oilPalmMonoculture'),
    prob_det_11_otherMonoculture.rename('otherMonoculture'),
    prob_det_12_grassAndSavanna.rename('grassAndSavanna'),
    prob_det_13_shrub.rename('shrub'),
    prob_det_14_cropland.rename('cropland'),
    prob_det_15_settlement.rename('settlement'),
    prob_det_16_clearedLand.rename('clearedLand'),
    prob_det_17_waterbody.rename('waterbody')
  ]);
  
  
  
  
  
  // Make into an image collection
  var prob_det_col = ee.ImageCollection.fromImages([
    prob_det_01_undisturbedDrylandForest.set('class_name', 'undisturbedDrylandForest'),
    prob_det_02_loggedOverDrylandForest.set('class_name', 'loggedOverDrylandForest'),
    prob_det_03_undisturbedMangroveForest.set('class_name', 'undisturbedMangroveForest'),
    prob_det_04_loggedOverMangroveForest.set('class_name', 'loggedOverMangroveForest'),
    prob_det_05_undisturbedSwampForest.set('class_name', 'undisturbedSwampForest'),
    prob_det_06_loggedOverSwampForest.set('class_name', 'loggedOverSwampForest'),
    prob_det_07_agroforestry.set('class_name', 'agroforestry'),
    prob_det_08_plantationForest.set('class_name', 'plantationForest'),
    prob_det_09_rubberMonoculture_alt.set('class_name', 'rubberMonoculture'),    // Trained with WRI Tree Plantation
    prob_det_10_oilPalmMonoculture.set('class_name', 'oilPalmMonoculture'),
    prob_det_11_otherMonoculture.set('class_name', 'otherMonoculture'),
    prob_det_12_grassAndSavanna.set('class_name', 'grassAndSavanna'),
    prob_det_13_shrub.set('class_name', 'shrub'),
    prob_det_14_cropland.set('class_name', 'cropland'),
    prob_det_15_settlement.set('class_name', 'settlement'),
    prob_det_16_clearedLand.set('class_name', 'clearedLand'),
    prob_det_17_waterbody.set('class_name', 'waterbody')
  ]);
  
  
  
  
  // Make sure no data is masked out (not filled)
  prob_det_col = prob_det_col.map(mask_nodata_prob);
  
  
  
  function mask_nodata_prob(img){
    
    return img
              .updateMask(landsat_2018_mosaic.select('red_median'))
              .updateMask(land_mask)
              .updateMask(img.neq(255))
              .copyProperties(img)
    
  }
  
  
  
  
  /*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////// CLASS PROBABILITIES: SIMPLIFIED LEGEND CLASSIFICATION INCLUDING CROWDSOURCED TRAINING DATA ///////////////////////////////
  *///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  /**
   * Design choice: binary probability maps for each class so can improve the final map in a modularized way by improving selected classes
   * (e.g. better training data for those classes are available, better mask is available to superimpose, etc.)
   * following
   * Saah, D., Tenneson, K., Poortinga, A., Nguyen, Q., Chishtie, F., San Aung, K., ... & Ganz, D. (2020). Primitives as building blocks for constructing land cover maps. International Journal of Applied Earth Observation and Geoinformation, 85, 101979.
  */ 
  
  var prob_simpl_c1 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/01_undisturbedForest_2018_trainInclCrowd");
  var prob_simpl_c2 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/02_loggedOverForest_2018_trainInclCrowd");
  var prob_simpl_c3 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/03_oilPalmMonoculture_2018_trainInclCrowd");
  var prob_simpl_c4 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/04_treeBasedNotOilPalm_2018_trainInclCrowd");
  var prob_simpl_c5 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/05_cropland_2018_trainInclCrowd");
  var prob_simpl_c6 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/06_shrub_2018_trainInclCrowd");
  var prob_simpl_c7 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/07_grassAndSavanna_2018_trainInclCrowd");
  var prob_simpl_c8 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/08_water_2018_trainInclCrowd");
  var prob_simpl_c9 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/09_settlement_2018_trainInclCrowd");
  var prob_simpl_c10 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/10_clearedLand_2018_trainInclCrowd");
  
  
  
  // Make into a multiband image
  var prob_simpl_multiband = ee.Image.cat([
    prob_simpl_c1.rename('undisturbedForest'),
    prob_simpl_c2.rename('loggedOverForest'),
    prob_simpl_c3.rename('oilPalmMonoculture'),
    prob_simpl_c4.rename('treeBasedNotOilPalm'),
    prob_simpl_c5.rename('cropland'),
    prob_simpl_c6.rename('shrub'),
    prob_simpl_c7.rename('grassAndSavanna'),
    prob_simpl_c8.rename('waterbody'),
    prob_simpl_c9.rename('settlement'),    
    prob_simpl_c10.rename('clearedLand'),
  ]);
  
  
  
  // Make into an image collection
  var prob_simpl_col = ee.ImageCollection.fromImages([
    prob_simpl_c1.set('class_name', 'undisturbedForest'),
    prob_simpl_c2.set('class_name', 'loggedOverForest'),
    prob_simpl_c3.set('class_name', 'oilPalmMonoculture'),
    prob_simpl_c4.set('class_name', 'treeBasedNotOilPalm'),
    prob_simpl_c5.set('class_name', 'cropland'),
    prob_simpl_c6.set('class_name', 'shrub'),
    prob_simpl_c7.set('class_name', 'grassAndSavanna'),
    prob_simpl_c8.set('class_name', 'waterbody'),
    prob_simpl_c9.set('class_name', 'settlement'),    
    prob_simpl_c10.set('class_name', 'clearedLand'),
  ]);
  
  
  
  // Make sure no data is masked out (not filled)
  prob_simpl_col = prob_simpl_col.map(mask_nodata_prob);
  
  
  
  
  
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////// COMBINING CLASS PROBABILITIES INTO CLASS ASSIGNMENT ////////////////////////////////
  *//////////////////////////////////////////////////////////////////////////////////////////////////
  
  var clsNameIdnumDictDet = ee.Dictionary({
    'undisturbedDrylandForest': 1,               
    'loggedOverDrylandForest': 2, 
    'undisturbedMangroveForest': 3,
    'loggedOverMangroveForest': 4,
    'undisturbedSwampForest': 5,
    'loggedOverSwampForest': 6,
    'agroforestry': 7, 
    'plantationForest': 8,
    'rubberMonoculture': 9,
    'oilPalmMonoculture': 10,
    'otherMonoculture': 11,
    'grassAndSavanna': 12,
    'shrub': 13,
    'cropland': 14,
    'settlement': 15, 
    'clearedLand': 16, 
    'waterbody': 17
  }); 
  
  
  
  var clsNameIdnumDictSimpl = ee.Dictionary({
    'undisturbedForest': 1,
    'loggedOverForest': 2, 
    'oilPalmMonoculture': 3,
    'treeBasedNotOilPalm': 4,
    'cropland': 5,
    'shrub': 6,
    'grassAndSavanna': 7,
    'waterbody': 8,
    'settlement': 9,
    'clearedLand': 10
  });
  
  
  
  /*//////////////////////////////////////////////////////////////////////////
  Add constant value band of the class id (numeric)
  */////////////////////////////////////////////////////////////////////////
  
  
  var prob_det_col_const = prob_det_col.map(function(img){
                 return img
                        .addBands(ee.Image(ee.Number(clsNameIdnumDictDet.get(img.getString('class_name')))).uint8())
  });
  
  
  var prob_simpl_col_const = prob_simpl_col.map(function(img){
                 return img
                       .addBands(ee.Image(ee.Number(clsNameIdnumDictSimpl.get(img.getString('class_name')))).uint8())
  });
  
  
  
  print("prob_det_col_const", prob_det_col_const);
  
  print("prob_simpl_col_const", prob_simpl_col_const);
  
  
  
  /*/////////////////////////////////////////////////////////////////////////////////////////////////////
  Get most likely (maximum probability) class, and second most likely (second maximum probability) class, 
  for the classification with simplified legend incorporating crowdsourced data
  */////////////////////////////////////////////////////////////////////////////////////////////////////
  
  var maxProbClsSimpl = getSelHighProbCls(prob_simpl_col_const, "first");
  
  var secondMaxProbClsSimpl = getSelHighProbCls(prob_simpl_col_const, "second");
  
  
  var maxProbClsSimpl_cls = maxProbClsSimpl.select('classId');
  // var secondMaxProbClsSimpl_cls = secondMaxProbClsSimpl.select('classId'); // not used in expert rules
  
  var maxProbClsSimpl_prob = maxProbClsSimpl.select('classProb');
  // var secondMaxProbClsSimpl_prob = secondMaxProbClsSimpl.select('classProb'); // not used in expert rules
  
  Map.addLayer(maxProbClsSimpl_cls, {palette:lcPaletteSimpl, min:1, max:10}, 'maxProbClsSimpl_cls', params.showAllLayers);
  // Map.addLayer(secondMaxProbClsSimpl_cls, {palette:lcPaletteSimpl, min:1, max:10}, 'secondMaxProbClsSimpl_cls', params.showAllLayers);  // not used in expert rules
  
  
  
  /*/////////////////////////////////////////////////////////////////////////////////////////////////////
  Get most likely (maximum probability) class, and second most likely (second maximum probability) class, 
  for the classification with detailed legend 
  */////////////////////////////////////////////////////////////////////////////////////////////////////
  
  var maxProbClsDet = getSelHighProbCls(prob_det_col_const, "first");
  
  var secondMaxProbClsDet = getSelHighProbCls(prob_det_col_const, "second");
  
  
  var maxProbClsDet_cls = maxProbClsDet.select('classId');
  var secondMaxProbClsDet_cls = secondMaxProbClsDet.select('classId');
  
  var maxProbClsDet_prob = maxProbClsDet.select('classProb');
  var secondMaxProbClsDet_prob = secondMaxProbClsDet.select('classProb');
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////// "Primary" classification and "secondary" classification *before* applying expert rules incorporating crowdsourcing-aided map /////
  *//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  var primary_classification_beforeRules = maxProbClsDet_cls;
  var secondary_classification_beforeRules = secondMaxProbClsDet_cls;
  
  var primary_classification_prob_beforeRules = maxProbClsDet_prob;
  var secondary_classification_prob_beforeRules = secondMaxProbClsDet_prob;
  
  Map.addLayer(primary_classification_beforeRules, {palette:lcPaletteDet, min:1, max:17}, 'primary_classification_beforeRules', true);
  Map.addLayer(secondary_classification_beforeRules, {palette:lcPaletteDet, min:1, max:17}, 'secondary_classification_beforeRules', true, 0);
  
  
  
  
  /*/////////////////////////////////////////////////////////////////////////////////////////////////////
  Classification uncertainty of the map version *before* applying expert rules
  */////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  ////////////////// Least confidence //////////////////////////
  
  var uncertainty_least_beforeRules = ee.Image(1).subtract(maxProbClsDet_prob.divide(100)).rename('conf_least');
  
  Map.addLayer(uncertainty_least_beforeRules, {min:0, max:1, palette:['black','white']}, "uncertainty_least_beforeRules", true, 0);  // high value = low confidence = high uncertainty
  
  
  var perc_uncertainty_least_beforeRules = uncertainty_least_beforeRules.multiply(100).round().byte().rename('perc_conf_least')
  
  
  
  ///////////////// Margin of confidence /////////////////////////
  
  var uncertainty_margin_beforeRules = (maxProbClsDet_prob.divide(100)).subtract(secondMaxProbClsDet_prob.divide(100)).rename('conf_margin');
  
  Map.addLayer(uncertainty_margin_beforeRules, {min:0, max:1, palette:['white','black']}, "uncertainty_margin_beforeRules", true, 0); // high value = high margin = high confidence = low uncertainty
  
  
  
  var perc_uncertainty_margin_beforeRules = uncertainty_margin_beforeRules.multiply(100).round().byte().rename('perc_conf_margin')
  
  
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////
  ******************************** EXPERT RULES ********************************************************
  *////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  var expertRulesResults = {};
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////
  1. Expert rule for "Forests"
  *////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  function apply_rule_01_forest() {
    
    var umdPrimFor2001 = ee.ImageCollection("UMD/GLAD/PRIMARY_HUMID_TROPICAL_FORESTS/v1")
          .first();  // there's only one band e.g. 2001
    // Value 1 = primary forest; Value 0 = other land/water
    
    
    var umdPrimFor2001_agree_maxProbClsSimplFor = (umdPrimFor2001.eq(1).and(maxProbClsSimpl_cls.eq(1))).or(
                                                   umdPrimFor2001.eq(1).and(maxProbClsSimpl_cls.eq(2)));
    
    
    var nonForest_det_1st =  maxProbClsDet_cls.remap(ee.List.sequence(7,17,1), ee.List.repeat(1,11)); // Non-forest in maxProbClsDet, assigned values 1 (i.e. is erroneous)  
    
    var nonForest_det_2nd =  secondMaxProbClsDet_cls.remap(ee.List.sequence(7,17,1), ee.List.repeat(1,11)); // Non-forest in secondMaxProbClsDet, assigned values 1 (i.e. is erroneous)   
  
    
    var forest_simpl_umd = (maxProbClsSimpl_cls.remap(ee.List([1,2]), ee.List([1,1]))).updateMask(umdPrimFor2001_agree_maxProbClsSimplFor); // Forest in maxProbClsSimpl AND is umdPrimFor2001, assigned values 1 (i.e. is erroneous)           
                   
                                    
    var errorShouldBeForest_1st = (nonForest_det_1st.and(forest_simpl_umd))
                             .rename('classId');
                             
    var errorShouldBeForest_2nd = (nonForest_det_2nd.and(forest_simpl_umd))
                             .rename('classId'); 
    
    
    // var superimposed_forest = forest_simpl_umd.mask().rename('classId') // superimposed pixels
    
      
    
    var errorShouldBeForest_1st_replacementClasses = BandsToCollection(
      prob_det_multiband.updateMask(errorShouldBeForest_1st)         // errorShouldBeForest has value 1 and otherwise masked   // !!!
        .select([
          'undisturbedDrylandForest', 'loggedOverDrylandForest',
          'undisturbedMangroveForest', 'loggedOverMangroveForest',
          'undisturbedSwampForest', 'loggedOverSwampForest'
          ])
      );
    
    
    var errorShouldBeForest_2nd_replacementClasses = BandsToCollection(
      prob_det_multiband.updateMask(errorShouldBeForest_2nd)         // errorShouldBeForest has value 1 and otherwise masked   // !!!
        .select([
          'undisturbedDrylandForest', 'loggedOverDrylandForest',
          'undisturbedMangroveForest', 'loggedOverMangroveForest',
          'undisturbedSwampForest', 'loggedOverSwampForest'
          ])
    );
    
    
    
    var errorShouldBeForest_1st_1stForest = getSelHighProbCls(errorShouldBeForest_1st_replacementClasses, "first");
    
    var errorShouldBeForest_2nd_2ndForest = getSelHighProbCls(errorShouldBeForest_2nd_replacementClasses, "second");
    
    
    var errorShouldBeForest_1st_1stForest_cls = errorShouldBeForest_1st_1stForest.select('classId');
    var errorShouldBeForest_2nd_2ndForest_cls = errorShouldBeForest_2nd_2ndForest.select('classId');
    
    var errorShouldBeForest_1st_1stForest_prob = errorShouldBeForest_1st_1stForest.select('classProb');
    var errorShouldBeForest_2nd_2ndForest_prob = errorShouldBeForest_2nd_2ndForest.select('classProb');
    
    
    var res_rule1_1st_cls = ee.ImageCollection.fromImages(
      [maxProbClsDet_cls.updateMask(errorShouldBeForest_1st.mask().eq(0)),  // areas NOT changed
      errorShouldBeForest_1st_1stForest_cls]
    ).mosaic();
    
    var res_rule1_2nd_cls = ee.ImageCollection.fromImages(
      [secondMaxProbClsDet_cls.updateMask(errorShouldBeForest_2nd.mask().eq(0)),  // areas NOT changed
      errorShouldBeForest_2nd_2ndForest_cls]
    ).mosaic();
    
    
    
    var res_rule1_1st_prob = ee.ImageCollection.fromImages(
      [maxProbClsDet_prob.updateMask(errorShouldBeForest_1st.mask().eq(0)),  // areas NOT changed
      errorShouldBeForest_1st_1stForest_prob]
    ).mosaic();
    
    
    var res_rule1_2nd_prob = ee.ImageCollection.fromImages(
      [maxProbClsDet_prob.updateMask(errorShouldBeForest_2nd.mask().eq(0)),  // areas NOT changed
      errorShouldBeForest_2nd_2ndForest_prob]
    ).mosaic();
    
  
    
    
    ///////// Save results needed for next / later steps
    
    // Input to the subsequent expert rule
    expertRulesResults.res_rule1_1st_cls = res_rule1_1st_cls;
    expertRulesResults.res_rule1_2nd_cls = res_rule1_2nd_cls;
    expertRulesResults.res_rule1_1st_prob = res_rule1_1st_prob;
    expertRulesResults.res_rule1_2nd_prob = res_rule1_2nd_prob;
    
    // To record the pixels where expert rule is applied
    expertRulesResults.errorShouldBeForest_1st = errorShouldBeForest_1st.mask().updateMask(land_mask);
    expertRulesResults.errorShouldBeForest_2nd = errorShouldBeForest_2nd.mask().updateMask(land_mask);
  
  
  }
  
  
  
  // Apply rule 1
  apply_rule_01_forest();
  
  
  // Visually inspect the results
  Map.addLayer(ee.Image(expertRulesResults.errorShouldBeForest_1st), {}, 'errorShouldBeForest_1st', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.errorShouldBeForest_2nd), {}, 'errorShouldBeForest_2nd', params.showAllLayers);
  
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_1st_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_1st_cls', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_2nd_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_2nd_cls', params.showAllLayers);
  
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////
  2. Expert rule for "Oil palm monoculture"
  *////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  function apply_rule_02_oilPalmMonoculture() {
    
    
    ///////////////// 2a. Superimpose "Oil Palm Monoculture" predicted with crowdsourced training data ///////////////////////
  
    
    var maxProbClsSimpl_cls_oilPalm_masked =  maxProbClsSimpl_cls.updateMask(maxProbClsSimpl_cls.eq(3));
    var maxProbClsSimpl_cls_notOilPalm_mask = maxProbClsSimpl_cls.neq(3);
    var maxProbClsSimpl_cls_oilPalm_mask = maxProbClsSimpl_cls.eq(3);
  
    
    var superimposed_oilPalm = maxProbClsSimpl_cls.eq(3).rename('classId');
    
    
    var res_rule1_1st_rule2a_cls = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_1st_cls).updateMask(maxProbClsSimpl_cls_notOilPalm_mask).rename('classId'), // area NOT "Oil Palm Monoculture" in crowdsourcing-aided map are NOT changed
        maxProbClsSimpl_cls_oilPalm_masked.remap([3], [10]).rename('classId')]  // "Oil Palm Monoculture" is class 10 in detailed-legend scheme
      ).mosaic();
    
    
    var res_rule1_2nd_rule2a_cls = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_2nd_cls).updateMask(maxProbClsSimpl_cls_notOilPalm_mask).rename('classId'), // area NOT "Oil Palm Monoculture" in crowdsourcing-aided map are NOT changed
        maxProbClsSimpl_cls_oilPalm_masked.remap([3], [10]).rename('classId')]  // "Oil Palm Monoculture" is class 10 in detailed-legend scheme
      ).mosaic();
  
  
  
    var res_rule1_1st_rule2a_prob = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_1st_prob).updateMask(maxProbClsSimpl_cls_notOilPalm_mask).rename('classProb'), // area NOT "Oil Palm Monoculture" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_prob.updateMask(maxProbClsSimpl_cls_oilPalm_mask).rename('classProb')] // probability of the superimposed "Oil Palm Monoculture" from simplified-legend classification incorporating crowdsourced data  
      ).mosaic();
    
    
    var res_rule1_2nd_rule2a_prob = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_2nd_prob).updateMask(maxProbClsSimpl_cls_notOilPalm_mask).rename('classProb'), // area NOT "Oil Palm Monoculture" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_prob.updateMask(maxProbClsSimpl_cls_oilPalm_mask).rename('classProb')]  // probability of the superimposed "Oil Palm Monoculture" from simplified-legend classification incorporating crowdsourced data 
      ).mosaic();
  
  
  
    
    ////////// 2b. Update areas which should NOT be "Oil Palm Monoculture", with the next most likely class ///////////////////////////////
  
    
    var errorShouldNotBeOilPalm_prevRes1st = 
      res_rule1_1st_rule2a_cls.eq(10)  // is "Oil Palm Monoculture" in the source maxProbClsDet_cls
      .and(
      maxProbClsSimpl_cls_notOilPalm_mask)  
      .rename('classId');
      
    var errorShouldNotBeOilPalm_prevRes2nd = 
      res_rule1_2nd_rule2a_cls.eq(10)   // is "Oil Palm Monoculture" in the source secondMaxProbClsDet_cls
      .and(
      maxProbClsSimpl_cls_notOilPalm_mask)  
      .rename('classId');
    
    
    
    var errorShouldNotBeOilPalm_prevRes1st_replacementClasses = BandsToCollection(
        prob_det_multiband.updateMask(errorShouldNotBeOilPalm_prevRes1st)
        .select(clsNameIdnumDictDet.keys().removeAll(['oilPalmMonoculture', // disallow some classes which are superimposed with the crowdsourced-aided map judged to be of better quality
        'undisturbedDrylandForest', 'loggedOverDrylandForest',
        'undisturbedMangroveForest', 'loggedOverMangroveForest',
        'undisturbedSwampForest', 'loggedOverSwampForest',
        'cropland',
        'settlement', 'waterbody' 
    ])));                     
    
    
    var errorShouldNotBeOilPalm_prevRes2nd_replacementClasses = BandsToCollection(
      prob_det_multiband.updateMask(errorShouldNotBeOilPalm_prevRes2nd)
      .select(clsNameIdnumDictDet.keys().removeAll(['oilPalmMonoculture', // disallow some classes which are superimposed with the crowdsourced-aided map judged to be of better quality
      'undisturbedDrylandForest', 'loggedOverDrylandForest',
      'undisturbedMangroveForest', 'loggedOverMangroveForest',
      'undisturbedSwampForest', 'loggedOverSwampForest',
      'cropland',
      'settlement', 'waterbody' 
    ])));                   
    
    
    
    
    
    
    var errorShouldNotBeOilPalm_prevRes1st_1st = getSelHighProbCls(errorShouldNotBeOilPalm_prevRes1st_replacementClasses, "first");
    
    var errorShouldNotBeOilPalm_prevRes2nd_2nd = getSelHighProbCls(errorShouldNotBeOilPalm_prevRes2nd_replacementClasses, "second");
    
    
    var errorShouldNotBeOilPalm_prevRes1st_1st_cls = errorShouldNotBeOilPalm_prevRes1st_1st.select('classId');
    var errorShouldNotBeOilPalm_prevRes2nd_2nd_cls = errorShouldNotBeOilPalm_prevRes2nd_2nd.select('classId');
    
    
    var errorShouldNotBeOilPalm_prevRes1st_1st_prob = errorShouldNotBeOilPalm_prevRes1st_1st.select('classProb');
    var errorShouldNotBeOilPalm_prevRes2nd_2nd_prob = errorShouldNotBeOilPalm_prevRes2nd_2nd.select('classProb');
    
    
    
    var res_rule1_1st_rule2a_rule2b_1st_cls = ee.ImageCollection.fromImages(
        [res_rule1_1st_rule2a_cls.updateMask(errorShouldNotBeOilPalm_prevRes1st_1st_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeOilPalm_prevRes1st_1st_cls]
      ).mosaic();
    
    var res_rule1_2nd_rule2a_rule2b_2nd_cls = ee.ImageCollection.fromImages(
        [res_rule1_2nd_rule2a_cls.updateMask(errorShouldNotBeOilPalm_prevRes2nd_2nd_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeOilPalm_prevRes2nd_2nd_cls]
      ).mosaic();
      
    
      
      
    var res_rule1_1st_rule2a_rule2b_1st_prob = ee.ImageCollection.fromImages(
        [res_rule1_1st_rule2a_prob.updateMask(errorShouldNotBeOilPalm_prevRes1st_1st_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeOilPalm_prevRes1st_1st_prob]
      ).mosaic();
    
    var res_rule1_2nd_rule2a_rule2b_2nd_prob = ee.ImageCollection.fromImages(
        [res_rule1_2nd_rule2a_prob.updateMask(errorShouldNotBeOilPalm_prevRes2nd_2nd_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeOilPalm_prevRes2nd_2nd_prob]
      ).mosaic();
  
  
  
  
  
    ///////// Save results needed for next / later steps
    
    // Input to the subsequent expert rule
    expertRulesResults.res_rule1_rule2_1st_cls = res_rule1_1st_rule2a_rule2b_1st_cls;
    expertRulesResults.res_rule1_rule2_2nd_cls = res_rule1_2nd_rule2a_rule2b_2nd_cls;
    expertRulesResults.res_rule1_rule2_1st_prob = res_rule1_1st_rule2a_rule2b_1st_prob;
    expertRulesResults.res_rule1_rule2_2nd_prob = res_rule1_2nd_rule2a_rule2b_2nd_prob;
    
    // To record the pixels where expert rule is applied
    expertRulesResults.superimposed_oilPalm = superimposed_oilPalm;
    expertRulesResults.errorShouldNotBeOilPalm_prevRes1st = errorShouldNotBeOilPalm_prevRes1st;
    expertRulesResults.errorShouldNotBeOilPalm_prevRes2nd = errorShouldNotBeOilPalm_prevRes2nd;
  
  }
  
  
  // Apply rule 2
  apply_rule_02_oilPalmMonoculture();
  
  
  
  // Visually inspect the results
  Map.addLayer(ee.Image(expertRulesResults.superimposed_oilPalm), {}, 'superimposed_oilPalm', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.errorShouldNotBeOilPalm_prevRes1st), {}, 'errorShouldNotBeOilPalm_prevRes1st', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.errorShouldNotBeOilPalm_prevRes2nd), {}, 'errorShouldNotBeOilPalm_prevRes2nd', params.showAllLayers);
  
  
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_rule2_1st_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_rule2_1st_cls', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_rule2_2nd_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_rule2_2nd_cls', params.showAllLayers);
  
  
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////
  3. Expert rule for "Cropland"
  *////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  function apply_rule_03_cropland() {
    
    ///////////////// 3a. Superimpose "Cropland" predicted with crowdsourced training data ///////////////////////
    
    var maxProbClsSimpl_cls_cropland_masked =  maxProbClsSimpl_cls.updateMask(maxProbClsSimpl_cls.eq(5));
    var maxProbClsSimpl_cls_notCropland_mask = maxProbClsSimpl_cls.neq(5);
    var maxProbClsSimpl_cls_cropland_mask = maxProbClsSimpl_cls.eq(5);
    
    var superimposed_cropland = maxProbClsSimpl_cls.eq(5).rename('classId');
    
    
    var res_rule1_rule2_1st_rule3a_cls = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_1st_cls).updateMask(maxProbClsSimpl_cls_notCropland_mask).rename('classId'), // area NOT "Cropland" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_cls_cropland_masked.remap([5], [14]).rename('classId')]  // "Cropland" is class 14 in detailed-legend scheme
      ).mosaic();
    
    
    var res_rule1_rule2_2nd_rule3a_cls = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_2nd_cls).updateMask(maxProbClsSimpl_cls_notCropland_mask).rename('classId'), // area NOT "Cropland" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_cls_cropland_masked.remap([5], [14]).rename('classId')]  // "Cropland" is class 14 in detailed-legend scheme
      ).mosaic();
      
  
    var res_rule1_rule2_1st_rule3a_prob = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_1st_prob).updateMask(maxProbClsSimpl_cls_notCropland_mask).rename('classProb'), // area NOT "Cropland" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_prob.updateMask(maxProbClsSimpl_cls_cropland_mask).rename('classProb')] // probability of the superimposed "Cropland" from simplified-legend classification incorporating crowdsourced data 
      ).mosaic();
    
    
    
    var res_rule1_rule2_2nd_rule3a_prob = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_2nd_prob).updateMask(maxProbClsSimpl_cls_notCropland_mask).rename('classProb'), // area NOT "Cropland" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_prob.updateMask(maxProbClsSimpl_cls_cropland_mask).rename('classProb')]  // probability of the superimposed "Cropland" from simplified-legend classification incorporating crowdsourced data 
      ).mosaic();
       
      
      
      ////////// 3b. Update areas which should NOT be "Cropland", with the next most likely class ///////////////////////////////
  
    var errorShouldNotBeCropland_prevRes1st = 
      res_rule1_rule2_1st_rule3a_cls.eq(14)  // is "Cropland" in the source maxProbClsDet_cls
      .and(
      maxProbClsSimpl_cls_notCropland_mask)  
      .rename('classId');
      
    var errorShouldNotBeCropland_prevRes2nd = 
      res_rule1_rule2_2nd_rule3a_cls.eq(14)   // is "Cropland" in the source secondMaxProbClsDet_cls
      .and(
      maxProbClsSimpl_cls_notCropland_mask)  
      .rename('classId');
    
    
    
    var errorShouldNotBeCropland_prevRes1st_replacementClasses = BandsToCollection(
        prob_det_multiband.updateMask(errorShouldNotBeCropland_prevRes1st)
        .select(clsNameIdnumDictDet.keys().removeAll(['oilPalmMonoculture', // disallow some classes which are superimposed with the crowdsourced-aided map judged to be of better quality
        'undisturbedDrylandForest', 'loggedOverDrylandForest',
        'undisturbedMangroveForest', 'loggedOverMangroveForest',
        'undisturbedSwampForest', 'loggedOverSwampForest',
        'cropland',
        'settlement', 'waterbody' 
    ])));                     
    
    
    var errorShouldNotBeCropland_prevRes2nd_replacementClasses = BandsToCollection(
      prob_det_multiband.updateMask(errorShouldNotBeCropland_prevRes2nd)
      .select(clsNameIdnumDictDet.keys().removeAll(['oilPalmMonoculture', // disallow some classes which are superimposed with the crowdsourced-aided map judged to be of better quality
      'undisturbedDrylandForest', 'loggedOverDrylandForest',
      'undisturbedMangroveForest', 'loggedOverMangroveForest',
      'undisturbedSwampForest', 'loggedOverSwampForest',
      'cropland',
      'settlement', 'waterbody' 
    ])));                   
    
    
    
    var errorShouldNotBeCropland_prevRes1st_1st = getSelHighProbCls(errorShouldNotBeCropland_prevRes1st_replacementClasses, "first");
    
    var errorShouldNotBeCropland_prevRes2nd_2nd = getSelHighProbCls(errorShouldNotBeCropland_prevRes2nd_replacementClasses, "second");
    
    
    var errorShouldNotBeCropland_prevRes1st_1st_cls = errorShouldNotBeCropland_prevRes1st_1st.select('classId');
    var errorShouldNotBeCropland_prevRes2nd_2nd_cls = errorShouldNotBeCropland_prevRes2nd_2nd.select('classId');
    
    
    var errorShouldNotBeCropland_prevRes1st_1st_prob = errorShouldNotBeCropland_prevRes1st_1st.select('classProb');
    var errorShouldNotBeCropland_prevRes2nd_2nd_prob = errorShouldNotBeCropland_prevRes2nd_2nd.select('classProb');
    
    
    
    var res_rule1_rule2_1st_rule3a_rule3b_1st_cls = ee.ImageCollection.fromImages(
        [res_rule1_rule2_1st_rule3a_cls.updateMask(errorShouldNotBeCropland_prevRes1st_1st_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeCropland_prevRes1st_1st_cls]
      ).mosaic();
    
    var res_rule1_rule2_2nd_rule3a_rule3b_2nd_cls = ee.ImageCollection.fromImages(
        [res_rule1_rule2_2nd_rule3a_cls.updateMask(errorShouldNotBeCropland_prevRes2nd_2nd_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeCropland_prevRes2nd_2nd_cls]
      ).mosaic();
      
      
    
    var res_rule1_rule2_1st_rule3a_rule3b_1st_prob = ee.ImageCollection.fromImages(
        [res_rule1_rule2_1st_rule3a_prob.updateMask(errorShouldNotBeCropland_prevRes1st_1st_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeCropland_prevRes1st_1st_prob]
      ).mosaic();
    
    var res_rule1_rule2_2nd_rule3a_rule3b_2nd_prob = ee.ImageCollection.fromImages(
        [res_rule1_rule2_2nd_rule3a_prob.updateMask(errorShouldNotBeCropland_prevRes2nd_2nd_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeCropland_prevRes2nd_2nd_prob]
      ).mosaic();
       
      
      
  
   ///////// Save results needed for next / later steps
    
    // Input to the subsequent expert rule
    expertRulesResults.res_rule1_rule2_rule3_1st_cls = res_rule1_rule2_1st_rule3a_rule3b_1st_cls;
    expertRulesResults.res_rule1_rule2_rule3_2nd_cls = res_rule1_rule2_2nd_rule3a_rule3b_2nd_cls;
    expertRulesResults.res_rule1_rule2_rule3_1st_prob = res_rule1_rule2_1st_rule3a_rule3b_1st_prob;
    expertRulesResults.res_rule1_rule2_rule3_2nd_prob = res_rule1_rule2_2nd_rule3a_rule3b_2nd_prob;
    
    
    // To record the pixels where expert rule is applied
    expertRulesResults.superimposed_cropland = superimposed_cropland;
    expertRulesResults.errorShouldNotBeCropland_prevRes1st = errorShouldNotBeCropland_prevRes1st;
    expertRulesResults.errorShouldNotBeCropland_prevRes2nd = errorShouldNotBeCropland_prevRes2nd;
  
  }
  
  
  
  // Apply rule 3
  apply_rule_03_cropland();
  
  
  // Visually inspect the results
  Map.addLayer(ee.Image(expertRulesResults.superimposed_cropland), {}, 'superimposed_cropland', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.errorShouldNotBeCropland_prevRes1st), {}, 'errorShouldNotBeCropland_prevRes1st', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.errorShouldNotBeCropland_prevRes2nd), {}, 'errorShouldNotBeCropland_prevRes2nd', params.showAllLayers);
  
  
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_rule2_rule3_1st_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_rule2_rule3_1st_cls', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_rule2_rule3_2nd_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_rule2_rule3_2nd_cls', params.showAllLayers);
  
  
  
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////
  4. Expert rule for "Wetland Forests"
  *////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  
  function apply_rule_04_wetlandForests() {
    
    ////////// Wetland forests (mangrove forest, swamp forest) cannot occur outside wetland landform; ///////////////
    ////////// We update those assumed erroneously predicted wetland forest areas with next most likely (next highest probability) class ////////
    
    var landform = ee.Image("users/hadicu06/IIASA/RESTORE/miscellaneous/landform") 
    /*
    Classes:
    0 – out of area study; 1 - Lowlands; 2 - Wetlands;  3 - Upland;  4 - Montane
    */
    var wetland_masked = landform.updateMask(landform.eq(2))
    var notWetland_mask = landform.neq(2).updateMask(land_mask)
    
    
    var errorShouldNotBeWetlandForest_prevRes1st = 
      expertRulesResults.res_rule1_rule2_rule3_1st_cls.remap([3,4,5,6], [1,1,1,1])  // are wetland forest classes in the source maxProbClsDet_cls
      .and(
      notWetland_mask)                                     // NOT wetland landform 
      .rename('classId');
      
    var errorShouldNotBeWetlandForest_prevRes2nd = 
      expertRulesResults.res_rule1_rule2_rule3_2nd_cls.remap([3,4,5,6], [1,1,1,1])   // are wetland forest classes in the source secondMaxProbClsDet_cls
      .and(
      notWetland_mask)                                      // NOT wetland landform
      .rename('classId');
    
    
    
    var errorShouldNotBeWetlandForest_prevRes1st_replacementClasses = BandsToCollection(
        prob_det_multiband.updateMask(errorShouldNotBeWetlandForest_prevRes1st)
        .select(clsNameIdnumDictDet.keys().removeAll(['oilPalmMonoculture', // disallow some classes which are superimposed with the crowdsourced-aided map judged to be of better quality; allow dry-land forest
        'undisturbedMangroveForest', 'loggedOverMangroveForest',
        'undisturbedSwampForest', 'loggedOverSwampForest',
        'cropland',
        'settlement', 'waterbody' 
    ])));                     
    
    
    var errorShouldNotBeWetlandForest_prevRes2nd_replacementClasses = BandsToCollection(
      prob_det_multiband.updateMask(errorShouldNotBeWetlandForest_prevRes2nd)
      .select(clsNameIdnumDictDet.keys().removeAll(['oilPalmMonoculture', // disallow some classes which are superimposed with the crowdsourced-aided map judged to be of better quality; allow dry-land forest
      'undisturbedMangroveForest', 'loggedOverMangroveForest',
      'undisturbedSwampForest', 'loggedOverSwampForest',
      'cropland',
      'settlement', 'waterbody' 
    ])));                   
    
    
    
    var errorShouldNotBeWetlandForest_prevRes1st_1st = getSelHighProbCls(errorShouldNotBeWetlandForest_prevRes1st_replacementClasses, "first");
    
    var errorShouldNotBeWetlandForest_prevRes2nd_2nd = getSelHighProbCls(errorShouldNotBeWetlandForest_prevRes2nd_replacementClasses, "second");
    
    
    var errorShouldNotBeWetlandForest_prevRes1st_1st_cls = errorShouldNotBeWetlandForest_prevRes1st_1st.select('classId');
    var errorShouldNotBeWetlandForest_prevRes2nd_2nd_cls = errorShouldNotBeWetlandForest_prevRes2nd_2nd.select('classId');
    
    
    var errorShouldNotBeWetlandForest_prevRes1st_1st_prob = errorShouldNotBeWetlandForest_prevRes1st_1st.select('classProb');
    var errorShouldNotBeWetlandForest_prevRes2nd_2nd_prob = errorShouldNotBeWetlandForest_prevRes2nd_2nd.select('classProb');
    
    
    
    var res_rule1_rule2_rule3_1st_rule4_1st_cls = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_1st_cls).updateMask(errorShouldNotBeWetlandForest_prevRes1st_1st_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeWetlandForest_prevRes1st_1st_cls]
      ).mosaic();
    
    var res_rule1_rule2_rule3_2nd_rule4_2nd_cls = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_2nd_cls).updateMask(errorShouldNotBeWetlandForest_prevRes2nd_2nd_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeWetlandForest_prevRes2nd_2nd_cls]
      ).mosaic();
  
    
    
    var res_rule1_rule2_rule3_1st_rule4_1st_prob = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_1st_prob).updateMask(errorShouldNotBeWetlandForest_prevRes1st_1st_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeWetlandForest_prevRes1st_1st_prob]
      ).mosaic();
    
    var res_rule1_rule2_rule3_2nd_rule4_2nd_prob = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_2nd_prob).updateMask(errorShouldNotBeWetlandForest_prevRes2nd_2nd_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeWetlandForest_prevRes2nd_2nd_prob]
      ).mosaic();
  
    
    
    
    
     ///////// Save results needed for next / later steps
    
    // Input to the subsequent expert rule
    expertRulesResults.res_rule1_rule2_rule3_rule4_1st_cls = res_rule1_rule2_rule3_1st_rule4_1st_cls;
    expertRulesResults.res_rule1_rule2_rule3_rule4_2nd_cls = res_rule1_rule2_rule3_2nd_rule4_2nd_cls;
    expertRulesResults.res_rule1_rule2_rule3_rule4_1st_prob = res_rule1_rule2_rule3_1st_rule4_1st_prob;
    expertRulesResults.res_rule1_rule2_rule3_rule4_2nd_prob = res_rule1_rule2_rule3_2nd_rule4_2nd_prob;
    
    
    // To record the pixels where expert rule is applied
    expertRulesResults.errorShouldNotBeWetlandForest_prevRes1st = errorShouldNotBeWetlandForest_prevRes1st.selfMask().mask().updateMask(land_mask);
    expertRulesResults.errorShouldNotBeWetlandForest_prevRes2nd = errorShouldNotBeWetlandForest_prevRes2nd.selfMask().mask().updateMask(land_mask);
  
    
  }
  
  
  
  
  // Apply rule 4
  apply_rule_04_wetlandForests();
  
  
  // Display the wetland landform
  var landform = ee.Image("users/hadicu06/IIASA/RESTORE/miscellaneous/landform"); 
  var wetland_masked = landform.updateMask(landform.eq(2));
  Map.addLayer(wetland_masked, {}, "wetland_masked", false);
  
  
  
  // Visually inspect the results
  Map.addLayer(ee.Image(expertRulesResults.errorShouldNotBeWetlandForest_prevRes1st), {}, 'errorShouldNotBeWetlandForest_prevRes1st', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.errorShouldNotBeWetlandForest_prevRes2nd), {}, 'errorShouldNotBeWetlandForest_prevRes2nd', params.showAllLayers);
  
  
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_1st_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_rule2_rule3_rule4_1st_cls', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_2nd_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_rule2_rule3_rule4_2nd_cls', params.showAllLayers);
  
  
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////
  5. Expert rule for "Waterbody"
  *////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
   
  function apply_rule_05_waterbody() {
    
     ///////////////// 5a. Superimpose "Waterbody" predicted with crowdsourced training data ///////////////////////
    
    var maxProbClsSimpl_cls_water_masked =  maxProbClsSimpl_cls.updateMask(maxProbClsSimpl_cls.eq(8));
    var maxProbClsSimpl_cls_notWater_mask = maxProbClsSimpl_cls.neq(8);
    var maxProbClsSimpl_cls_water_mask = maxProbClsSimpl_cls.eq(8);
    
    var superimposed_water = maxProbClsSimpl_cls.eq(8).rename('classId');
    
    
    var res_rule1_rule2_rule3_rule4_1st_rule5a_cls = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_1st_cls).updateMask(maxProbClsSimpl_cls_notWater_mask).rename('classId'), // area NOT "Waterbody" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_cls_water_masked.remap([8], [17]).rename('classId')]  // "Waterbody" is class 17 in detailed-legend scheme
      ).mosaic();
    
    
    var res_rule1_rule2_rule3_rule4_2nd_rule5a_cls = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_2nd_cls).updateMask(maxProbClsSimpl_cls_notWater_mask).rename('classId'), // area NOT "Waterbody" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_cls_water_masked.remap([8], [17]).rename('classId')]  // "Waterbody" is class 17 in detailed-legend scheme
      ).mosaic();
      
    
    
    var res_rule1_rule2_rule3_rule4_1st_rule5a_prob = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_1st_prob).updateMask(maxProbClsSimpl_cls_notWater_mask).rename('classProb'), // area NOT "Waterbody" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_prob.updateMask(maxProbClsSimpl_cls_water_mask).rename('classProb')] // probability of the superimposed "Waterbody" from simplified-legend classification incorporating crowdsourced data 
      ).mosaic();
    
    
    var res_rule1_rule2_rule3_rule4_2nd_rule5a_prob = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_2nd_prob).updateMask(maxProbClsSimpl_cls_notWater_mask).rename('classProb'), // area NOT "Waterbody" in crowdsourced-aided map are NOT changed
         maxProbClsSimpl_prob.updateMask(maxProbClsSimpl_cls_water_mask).rename('classProb')] // probability of the superimposed "Waterbody" from simplified-legend classification incorporating crowdsourced data 
      ).mosaic();
      
      
  
    
      
    /////////// 5b. Update areas which should NOT be "Waterbody", with the next most likely class ///////////////////////////////
  
    
    var errorShouldNotBeWater_prevRes1st = 
      res_rule1_rule2_rule3_rule4_1st_rule5a_cls.eq(17)  // is "Waterbody" in the source maxProbClsDet_cls
      .and(
      maxProbClsSimpl_cls_notWater_mask)  
      .rename('classId');
      
    var errorShouldNotBeWater_prevRes2nd = 
      res_rule1_rule2_rule3_rule4_2nd_rule5a_cls.eq(17)   // is "Waterbody" in the source secondMaxProbClsDet_cls
      .and(
      maxProbClsSimpl_cls_notWater_mask)  
      .rename('classId');
    
    
    
    var errorShouldNotBeWater_prevRes1st_replacementClasses = BandsToCollection(
        prob_det_multiband.updateMask(errorShouldNotBeWater_prevRes1st)
        .select(clsNameIdnumDictDet.keys().removeAll(['oilPalmMonoculture', // disallow some classes which are superimposed with the crowdsourced-aided map judged to be of better quality
        'undisturbedDrylandForest', 'loggedOverDrylandForest',
        'undisturbedMangroveForest', 'loggedOverMangroveForest',
        'undisturbedSwampForest', 'loggedOverSwampForest',
        'cropland',
        'settlement', 'waterbody' 
    ])));                     
    
    
    var errorShouldNotBeWater_prevRes2nd_replacementClasses = BandsToCollection(
      prob_det_multiband.updateMask(errorShouldNotBeWater_prevRes2nd)
      .select(clsNameIdnumDictDet.keys().removeAll(['oilPalmMonoculture', // disallow some classes which are superimposed with the crowdsourced-aided map judged to be of better quality
      'undisturbedDrylandForest', 'loggedOverDrylandForest',
      'undisturbedMangroveForest', 'loggedOverMangroveForest',
      'undisturbedSwampForest', 'loggedOverSwampForest',
      'cropland',
      'settlement', 'waterbody' 
    ])));                   
    
    
    
    
    var errorShouldNotBeWater_prevRes1st_1st = getSelHighProbCls(errorShouldNotBeWater_prevRes1st_replacementClasses, "first");
    
    var errorShouldNotBeWater_prevRes2nd_2nd = getSelHighProbCls(errorShouldNotBeWater_prevRes2nd_replacementClasses, "second");
    
    
    var errorShouldNotBeWater_prevRes1st_1st_cls = errorShouldNotBeWater_prevRes1st_1st.select('classId');
    var errorShouldNotBeWater_prevRes2nd_2nd_cls = errorShouldNotBeWater_prevRes2nd_2nd.select('classId');
    
    
    var errorShouldNotBeWater_prevRes1st_1st_prob = errorShouldNotBeWater_prevRes1st_1st.select('classProb');
    var errorShouldNotBeWater_prevRes2nd_2nd_prob = errorShouldNotBeWater_prevRes2nd_2nd.select('classProb');
    
    
    
    var res_rule1_rule2_rule3_rule4_1st_rule5a_rule5b_1st_cls = ee.ImageCollection.fromImages(
        [res_rule1_rule2_rule3_rule4_1st_rule5a_cls.updateMask(errorShouldNotBeWater_prevRes1st_1st_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeWater_prevRes1st_1st_cls]
      ).mosaic();
    
    var res_rule1_rule2_rule3_rule4_2nd_rule5a_rule5b_2nd_cls = ee.ImageCollection.fromImages(
        [res_rule1_rule2_rule3_rule4_2nd_rule5a_cls.updateMask(errorShouldNotBeWater_prevRes2nd_2nd_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeWater_prevRes2nd_2nd_cls]
      ).mosaic(); 
      
      
      
      
    var res_rule1_rule2_rule3_rule4_1st_rule5a_rule5b_1st_prob = ee.ImageCollection.fromImages(
        [res_rule1_rule2_rule3_rule4_1st_rule5a_prob.updateMask(errorShouldNotBeWater_prevRes1st_1st_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeWater_prevRes1st_1st_prob]
      ).mosaic();
    
    var res_rule1_rule2_rule3_rule4_2nd_rule5a_rule5b_2nd_prob = ee.ImageCollection.fromImages(
        [res_rule1_rule2_rule3_rule4_2nd_rule5a_prob.updateMask(errorShouldNotBeWater_prevRes2nd_2nd_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeWater_prevRes2nd_2nd_prob]
      ).mosaic(); 
        
      
      
    ///////// Save results needed for next / later steps
    
    // Input to the subsequent expert rule
    expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_1st_cls = res_rule1_rule2_rule3_rule4_1st_rule5a_rule5b_1st_cls;
    expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_2nd_cls = res_rule1_rule2_rule3_rule4_2nd_rule5a_rule5b_2nd_cls;
    expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_1st_prob = res_rule1_rule2_rule3_rule4_1st_rule5a_rule5b_1st_prob;
    expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_2nd_prob = res_rule1_rule2_rule3_rule4_2nd_rule5a_rule5b_2nd_prob;
    
    // To record the pixels where expert rule is applied
    expertRulesResults.superimposed_water = superimposed_water;
    expertRulesResults.errorShouldNotBeWater_prevRes1st = errorShouldNotBeWater_prevRes1st;
    expertRulesResults.errorShouldNotBeWater_prevRes2nd = errorShouldNotBeWater_prevRes2nd;
    
  
  
  }
  
  
  
  
  // Apply rule 5
  apply_rule_05_waterbody();
  
  
  // Visually inspect the results
  Map.addLayer(ee.Image(expertRulesResults.superimposed_water), {}, 'superimposed_water', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.errorShouldNotBeWater_prevRes1st), {}, 'errorShouldNotBeWater_prevRes1st', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.errorShouldNotBeWater_prevRes2nd), {}, 'errorShouldNotBeWater_prevRes2nd', params.showAllLayers);
  
  
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_1st_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_rule2_rule3_rule4_rule5_1st_cls', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_2nd_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_rule2_rule3_rule4_rule5_2nd_cls', params.showAllLayers);
  
  
  
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////
  6. Expert rule for "Settlement"
  *////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
   
  function apply_rule_06_settlement() {
    
      ///////////////// 6a. Superimpose "Settlement" predicted with crowdsourced training data ///////////////////////
    
    var maxProbClsSimpl_cls_settlement_masked =  maxProbClsSimpl_cls.updateMask(maxProbClsSimpl_cls.eq(9));
    var maxProbClsSimpl_cls_notSettlement_mask = maxProbClsSimpl_cls.neq(9);
    var maxProbClsSimpl_cls_settlement_mask =  maxProbClsSimpl_cls.eq(9);
    
    var superimposed_settlement = maxProbClsSimpl_cls.eq(9).rename('classId');
    
    
    var res_rule1_rule2_rule3_rule4_rule5_1st_rule6a_cls = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_1st_cls).updateMask(maxProbClsSimpl_cls_notSettlement_mask).rename('classId'), // area NOT "Settlement" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_cls_settlement_masked.remap([9], [15]).rename('classId')]  // "Settlement" is class 15 in detailed-legend scheme
      ).mosaic();
    
    
    var res_rule1_rule2_rule3_rule4_rule5_2nd_rule6a_cls = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_2nd_cls).updateMask(maxProbClsSimpl_cls_notSettlement_mask).rename('classId'), // area NOT "Settlement" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_cls_settlement_masked.remap([9], [15]).rename('classId')]  // "Settlement" is class 15 in detailed-legend scheme
      ).mosaic();
      
      
    
    var res_rule1_rule2_rule3_rule4_rule5_1st_rule6a_prob = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_1st_prob).updateMask(maxProbClsSimpl_cls_notSettlement_mask).rename('classProb'), // area NOT "Settlement" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_prob.updateMask(maxProbClsSimpl_cls_settlement_mask).rename('classProb')]  // probability of the superimposed "Settlement" from simplified-legend classification incorporating crowdsourced data
      ).mosaic();
    
    
    var res_rule1_rule2_rule3_rule4_rule5_2nd_rule6a_prob = ee.ImageCollection.fromImages(
        [ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_2nd_prob).updateMask(maxProbClsSimpl_cls_notSettlement_mask).rename('classProb'), // area NOT "Settlement" in crowdsourced-aided map are NOT changed
        maxProbClsSimpl_prob.updateMask(maxProbClsSimpl_cls_settlement_mask).rename('classProb')]  // probability of the superimposed "Settlement" from simplified-legend classification incorporating crowdsourced data
      ).mosaic();
      
      
      
       
  
    /////////// 6b. Update areas which should NOT be "Settlement", with the next most likely class ///////////////////////////////
  
    
    var errorShouldNotBeSettlement_prevRes1st = 
      res_rule1_rule2_rule3_rule4_rule5_1st_rule6a_cls.eq(15)  // is "Settlement" in the source maxProbClsDet_cls
      .and(
      maxProbClsSimpl_cls_notSettlement_mask)  
      .rename('classId');
      
    var errorShouldNotBeSettlement_prevRes2nd = 
      res_rule1_rule2_rule3_rule4_rule5_2nd_rule6a_cls.eq(15)   // is "Settlement" in the source secondMaxProbClsDet_cls
      .and(
      maxProbClsSimpl_cls_notSettlement_mask)  
      .rename('classId');
    
    
    
    var errorShouldNotBeSettlement_prevRes1st_replacementClasses = BandsToCollection(
        prob_det_multiband.updateMask(errorShouldNotBeSettlement_prevRes1st)
        .select(clsNameIdnumDictDet.keys().removeAll(['oilPalmMonoculture', // disallow some classes which are superimposed with the crowdsourced-aided map judged to be of better quality
        'undisturbedDrylandForest', 'loggedOverDrylandForest',
        'undisturbedMangroveForest', 'loggedOverMangroveForest',
        'undisturbedSwampForest', 'loggedOverSwampForest',
        'cropland',
        'settlement', 'waterbody' 
    ])));                     
    
    
    var errorShouldNotBeSettlement_prevRes2nd_replacementClasses = BandsToCollection(
      prob_det_multiband.updateMask(errorShouldNotBeSettlement_prevRes2nd)
      .select(clsNameIdnumDictDet.keys().removeAll(['oilPalmMonoculture', // disallow some classes which are superimposed with the crowdsourced-aided map judged to be of better quality
      'undisturbedDrylandForest', 'loggedOverDrylandForest',
      'undisturbedMangroveForest', 'loggedOverMangroveForest',
      'undisturbedSwampForest', 'loggedOverSwampForest',
      'cropland',
      'settlement', 'waterbody' 
    ])));                   
    
    
    var errorShouldNotBeSettlement_prevRes1st_1st = getSelHighProbCls(errorShouldNotBeSettlement_prevRes1st_replacementClasses, "first");
    
    var errorShouldNotBeSettlement_prevRes2nd_2nd = getSelHighProbCls(errorShouldNotBeSettlement_prevRes2nd_replacementClasses, "second");
    
    
    var errorShouldNotBeSettlement_prevRes1st_1st_cls = errorShouldNotBeSettlement_prevRes1st_1st.select('classId');
    var errorShouldNotBeSettlement_prevRes2nd_2nd_cls = errorShouldNotBeSettlement_prevRes2nd_2nd.select('classId');
    
    
    var errorShouldNotBeSettlement_prevRes1st_1st_prob = errorShouldNotBeSettlement_prevRes1st_1st.select('classProb');
    var errorShouldNotBeSettlement_prevRes2nd_2nd_prob = errorShouldNotBeSettlement_prevRes2nd_2nd.select('classProb');
    
    
    
    var res_rule1_rule2_rule3_rule4_rule5_1st_rule6a_rule6b_1st_cls = ee.ImageCollection.fromImages(
        [res_rule1_rule2_rule3_rule4_rule5_1st_rule6a_cls.updateMask(errorShouldNotBeSettlement_prevRes1st_1st_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeSettlement_prevRes1st_1st_cls]
      ).mosaic();
    
    var res_rule1_rule2_rule3_rule4_rule5_2nd_rule6a_rule6b_2nd_cls = ee.ImageCollection.fromImages(
        [res_rule1_rule2_rule3_rule4_rule5_2nd_rule6a_cls.updateMask(errorShouldNotBeSettlement_prevRes2nd_2nd_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeSettlement_prevRes2nd_2nd_cls]
      ).mosaic(); 
        
    
    var res_rule1_rule2_rule3_rule4_rule5_1st_rule6a_rule6b_1st_prob = ee.ImageCollection.fromImages(
        [res_rule1_rule2_rule3_rule4_rule5_1st_rule6a_prob.updateMask(errorShouldNotBeSettlement_prevRes1st_1st_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeSettlement_prevRes1st_1st_prob]
      ).mosaic();
    
    var res_rule1_rule2_rule3_rule4_rule5_2nd_rule6a_rule6b_2nd_prob = ee.ImageCollection.fromImages(
        [res_rule1_rule2_rule3_rule4_rule5_2nd_rule6a_prob.updateMask(errorShouldNotBeSettlement_prevRes2nd_2nd_cls.mask().eq(0)),  // areas NOT changed
        errorShouldNotBeSettlement_prevRes2nd_2nd_prob]
      ).mosaic();   
    
    
    ///////// Save results needed for next / later steps
    
    // Input to the subsequent expert rule
    expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_rule6_1st_cls = res_rule1_rule2_rule3_rule4_rule5_1st_rule6a_rule6b_1st_cls;
    expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_rule6_2nd_cls = res_rule1_rule2_rule3_rule4_rule5_2nd_rule6a_rule6b_2nd_cls;
    expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_rule6_1st_prob = res_rule1_rule2_rule3_rule4_rule5_1st_rule6a_rule6b_1st_prob;
    expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_rule6_2nd_prob = res_rule1_rule2_rule3_rule4_rule5_2nd_rule6a_rule6b_2nd_prob;
    
    // To record the pixels where expert rule is applied
    expertRulesResults.superimposed_settlement = superimposed_settlement;
    expertRulesResults.errorShouldNotBeSettlement_prevRes1st = errorShouldNotBeSettlement_prevRes1st;
    expertRulesResults.errorShouldNotBeSettlement_prevRes2nd = errorShouldNotBeSettlement_prevRes2nd;
    
  
      
  }
  
  
  
  
  // Apply rule 6
  apply_rule_06_settlement();
  
  
  // Visually inspect the results
  Map.addLayer(ee.Image(expertRulesResults.superimposed_settlement), {}, 'superimposed_settlement', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.errorShouldNotBeSettlement_prevRes1st), {}, 'errorShouldNotBeSettlement_prevRes1st', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.errorShouldNotBeSettlement_prevRes2nd), {}, 'errorShouldNotBeSettlement_prevRes2nd', params.showAllLayers);
  
  
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_rule6_1st_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_rule2_rule3_rule4_rule5_rule6_1st_cls', params.showAllLayers);
  Map.addLayer(ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_rule6_2nd_cls), {palette:lcPaletteDet, min:1, max:17}, 'res_rule1_rule2_rule3_rule4_rule5_rule6_2nd_cls', params.showAllLayers);
  
  
  
  
  
  
  /*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// "Primary" classification and "secondary" classification *after* applying expert rules incorporating crowdsourcing-aided map  ///////////////////////////////
  *//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  var primary_classification_afterRules = ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_rule6_1st_cls);
  
  
  // For areas superimposed with most likely (maximum probability) class in the simplified-legend classification incorporating crowdsourced training data,
  // no "secondary" classification is determined
  
  var secondary_classification_afterRules = ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_rule6_2nd_cls);
  
  var areasSuperimposed = ee.ImageCollection.fromImages([
    expertRulesResults.superimposed_oilPalm,
    expertRulesResults.superimposed_cropland,
    expertRulesResults.superimposed_water,
    expertRulesResults.superimposed_settlement
  ]).max();
  
  Map.addLayer(areasSuperimposed, {}, "areasSuperimposed", false)
  
  var secondary_classification_afterRules_superimposeFilledPrimary = secondary_classification_afterRules;
  
  secondary_classification_afterRules = secondary_classification_afterRules.updateMask(areasSuperimposed.eq(0))
  
  Map.addLayer(primary_classification_afterRules, {palette:lcPaletteDet, min:1, max:17}, 'primary_classification_afterRules', true);
  // Map.addLayer(secondary_classification_afterRules_superimposeFilledPrimary, {palette:lcPaletteDet, min:1, max:17}, 'secondary_classification_afterRules_superimposeFilledPrimary', params.showAllLayers);
  Map.addLayer(secondary_classification_afterRules, {palette:lcPaletteDet, min:1, max:17}, 'secondary_classification_afterRules', params.showAllLayers);
  
  
  
  /*///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////// Classification uncertainty in the map after expert rules are applied ////////////////////
  *////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  // Note: predicted probability for areas superimposed with most likely (maximum probability) class in the simplified-legend classification incorporating crowdsourced training data;
  // Thus, probability from the simplified-legend classification is used, not the probabilty from the detailed-legend classification
  
  
  var primary_classification_prob_afterRules = ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_rule6_1st_prob);
  
  var secondary_classification_prob_afterRules = ee.Image(expertRulesResults.res_rule1_rule2_rule3_rule4_rule5_rule6_2nd_prob);
  
  var secondary_classification_prob_afterRules_superimposeFilledPrimary = secondary_classification_prob_afterRules;
  
  secondary_classification_prob_afterRules = secondary_classification_prob_afterRules.updateMask(areasSuperimposed.eq(0))
  
  Map.addLayer(primary_classification_prob_afterRules, {min:0, max:100}, "primary_classification_prob_afterRules", true, 0);
  Map.addLayer(secondary_classification_prob_afterRules_superimposeFilledPrimary, {min:0, max:100}, "secondary_classification_prob_afterRules_superimposeFilledPrimary", params.showAllLayers);
  Map.addLayer(secondary_classification_prob_afterRules, {min:0, max:100}, "secondary_classification_prob_afterRules", true, 0);
  
  
  
  /*///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///// For superimposed areas (no secondary classification), assign flag value 253 
  *////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  var secondary_classification_afterRules_superimposeFilledFlag = ee.ImageCollection.fromImages([
    secondary_classification_afterRules.selfMask().byte().rename('classId'),
    areasSuperimposed.selfMask().multiply(253).byte().rename('classId')
    ]).mosaic()
  
  
  
  var secondary_classification_prob_afterRules_superimposeFilledFlag = ee.ImageCollection.fromImages([
    secondary_classification_prob_afterRules.selfMask().byte().rename('classProb'),
    areasSuperimposed.selfMask().multiply(253).byte().rename('classProb')
    ]).mosaic()
  
  
  Map.addLayer(secondary_classification_afterRules_superimposeFilledFlag.randomVisualizer(), {}, "secondary_classification_afterRules_superimposeFilledFlag", params.showAllLayers);
  Map.addLayer(secondary_classification_prob_afterRules_superimposeFilledFlag, {min:0, max:100}, "secondary_classification_prob_afterRules_superimposeFilledFlag", params.showAllLayers);
  
  
  
  
  
  
  /*/////////////////////////////////////////////////////////////////////////////////////////////////////
  Classification uncertainty of the map version *after* applying expert rules
  */////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  ////////////////// Least confidence //////////////////////////
  
  var uncertainty_least_afterRules = ee.Image(1).subtract(primary_classification_prob_afterRules.divide(100)).rename('conf_least');
  
  Map.addLayer(uncertainty_least_afterRules, {min:0, max:1, palette:['black','white']}, "uncertainty_least_afterRules", true, 0);  // high value = low confidence = high uncertainty
  
  var perc_uncertainty_least_afterRules = uncertainty_least_afterRules.multiply(100).round().byte().rename('perc_conf_least')
  
  
  ///////////////// Margin of confidence /////////////////////////
  
  var uncertainty_margin_afterRules = (primary_classification_prob_afterRules.divide(100)).subtract(secondary_classification_prob_afterRules.divide(100)).rename('conf_margin');
  
  Map.addLayer(uncertainty_margin_afterRules, {min:0, max:1, palette:['white','black']}, "uncertainty_margin_afterRules", true, 0); // high value = high margin = high confidence = low uncertainty
  
  var perc_uncertainty_margin_afterRules_superimposeFilledFlag = ee.ImageCollection.fromImages([
    uncertainty_margin_afterRules.multiply(100).round().byte().rename('perc_conf_margin'),
    areasSuperimposed.selfMask().multiply(253).round().byte().rename('perc_conf_margin')
    ]).mosaic()
  
  
  // Map.addLayer(perc_uncertainty_margin_afterRules_superimposeFilledFlag, {min:0, max:100, palette:['white','black']}, "perc_uncertainty_margin_afterRules_superimposeFilledFlag", true, 0); // high value = high margin = high confidence = low uncertainty
  
  
  
  
  
  /*///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///// Simple spatial postprocessing with 3-by-3 moving window majority class //////////////////////////////
  *////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  /**
   * Note: alternatively, more aggresive spatial filter can be defined in terms of minimum patch size per class and per classification region e.g. based on the reference map 2010 below:
   * var fc_minPatchSizeByClsByReg = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/miscellaneous/refMap2010_classPatchSizePixels_5thPercentile")
   * var fc_minPatchSizeByClsByReg = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/miscellaneous/refMap2010_classPatchSizePixels_10thPercentile")
  */
  
  var primary_classification_beforeRules_post = primary_classification_beforeRules.focal_mode({radius: 1.5, kernelType: 'square', units: 'pixels'});
  var secondary_classification_beforeRules_post = secondary_classification_beforeRules.focal_mode({radius: 1.5, kernelType: 'square', units: 'pixels'}); 
  
  
  var primary_classification_afterRules_post = primary_classification_afterRules.focal_mode({radius: 1.5, kernelType: 'square', units: 'pixels'});
  var secondary_classification_afterRules_superimposeFilledPrimary_post = secondary_classification_afterRules_superimposeFilledPrimary.focal_mode({radius: 1.5, kernelType: 'square', units: 'pixels'}); 
  var secondary_classification_afterRules_superimposeFilledFlag_post = secondary_classification_afterRules_superimposeFilledFlag.focal_mode({radius: 1.5, kernelType: 'square', units: 'pixels'}); 
  
  
  
  
  
  /*///////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///// EXPORT TO ASSET //////////////////////////////
  *////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  /**
   * *****************
   * Class assignment:
   * *****************
   * // Before expert rules
   * primary_classification_beforeRules_post
   * secondary_classification_beforeRules_post
   * 
   * // After expert rules
   * primary_classification_afterRules_post
   * secondary_classification_afterRules_superimposeFilledPrimary_post
   * secondary_classification_afterRules_superimposeFilledFlag_post (flag = 253)
   * 
   * 
   * 
   * *****************************
   * Class assignment uncertainty:
   * *****************************
   * 
   * // Before expert rules
   * primary_classification_prob_beforeRules
   * secondary_classification_prob_beforeRules
   * perc_uncertainty_least_beforeRules
   * perc_uncertainty_margin_beforeRules 
   * 
   * // After expert rules
   * primary_classification_prob_afterRules 
   * secondary_classification_prob_afterRules_superimposeFilledPrimary
   * secondary_classification_prob_afterRules_superimposeFilledFlag (flag = 253)
   * perc_uncertainty_least_afterRules
   * perc_uncertainty_margin_afterRules_superimposeFilledFlag (flag = 253)
   * 
  */
  
  
  
  
  
  function exportImageToAssetWrapper(this_image, metadata, this_description, this_assetId, this_pyramidingPolicy){
    
    Export.image.toAsset({
      image: this_image.set(metadata),
      description: this_description, 
      assetId: this_assetId, 
      pyramidingPolicy: {'.default': this_pyramidingPolicy}, 
      region: classification_regions.geometry().bounds(), 
      scale: land_mask.projection().nominalScale().getInfo(), 
      crs: land_mask.projection().crs(), 
      maxPixels: 1e13
    })
    
  }
  
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////// BEFORE EXPERT RULES AND INCLUDING CROWDSOURCED DATA ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  // Class assignment
  
  
  exportImageToAssetWrapper(
    primary_classification_beforeRules_post.byte().rename('classification'), 
    {'year': '2018',
      'legend': '1=Undisturbed dry-land forest, 2=Logged-over dry-land forest, 3=Undisturbed mangrove forest, 4=Logged-over mangrove forest, 5=Undisturbed swamp forest, ' + 
                '6=Logged-over swamp forest, 7=Agroforestry, 8=Plantation forest, 9=Rubber monoculture, 10=Oil palm monoculture, 11=Other monoculture, 12=Grass and savanna, 13=Shrub, ' +
                '14=Cropland, 15=Settlement, 16=Cleared land, 17=Waterbody'
    }, 
    "without_crowdsourced_data__primary_classification", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/primary_classification',
    'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/classification_without_crowdsourced_data/primary_classification',
    "mode"
  )
  
  
  
  
  exportImageToAssetWrapper(
    secondary_classification_beforeRules_post.byte().rename('classification'), 
    {'year': '2018',
    'legend': '1=Undisturbed dry-land forest, 2=Logged-over dry-land forest, 3=Undisturbed mangrove forest, 4=Logged-over mangrove forest, 5=Undisturbed swamp forest, ' + 
          '6=Logged-over swamp forest, 7=Agroforestry, 8=Plantation forest, 9=Rubber monoculture, 10=Oil palm monoculture, 11=Other monoculture, 12=Grass and savanna, 13=Shrub, ' +
          '14=Cropland, 15=Settlement, 16=Cleared land, 17=Waterbody'
    }, 
    "without_crowdsourced_data__secondary_classification", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/secondary_classification',
    'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/classification_without_crowdsourced_data/secondary_classification',
    "mode"
  )
  
  
  
  // Class probability 
  
  exportImageToAssetWrapper(
    primary_classification_prob_beforeRules.byte().rename('percent_probability'), 
    {'year': '2018'}, 
    "without_crowdsourced_data__primary_classification_probability", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/primary_classification_probability',
    'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/classification_without_crowdsourced_data/primary_classification_probability',
    "mean"
  )
  
  
  exportImageToAssetWrapper(
    secondary_classification_prob_beforeRules.byte().rename('percent_probability'), 
    {'year': '2018'}, 
    "without_crowdsourced_data__secondary_classification_probability", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/secondary_classification_probability'  
    'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/classification_without_crowdsourced_data/secondary_classification_probability',
    "mean"
  )
  
  
  // Class uncertainty
  
  exportImageToAssetWrapper(
    perc_uncertainty_least_beforeRules.byte().rename('percent_probability'), 
    {'year': '2018',
      'definition': '100 * (1 - (primary_classification_probability / 100))',
    }, 
    "without_crowdsourced_data__classification_uncertainty_least", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/classification_uncertainty_least',
    'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/classification_without_crowdsourced_data/classification_uncertainty_least',
    "mean"
  )
  
  
  exportImageToAssetWrapper(
    perc_uncertainty_margin_beforeRules.byte().rename('percent_probability'), 
    {'year': '2018',
      'definition': '100 * ((primary_classification_probability / 100) - (secondary_classification_probability / 100))',
    }, 
    "without_crowdsourced_data__classification_uncertainty_margin", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/classification_uncertainty_margin',
    'IIASA/RESTORE/classified_maps/class_hardened/without_crowdsourced_data/classification_without_crowdsourced_data/classification_uncertainty_margin',
    "mean"
  )
  
  
  
  
  ////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////// AFTER EXPERT RULES AND INCLUDING CROWDSOURCED DATA ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  // Class assignment
  
  exportImageToAssetWrapper(
    primary_classification_afterRules_post.byte().rename('classification'), 
    {'year': '2018',
      'legend': '1=Undisturbed dry-land forest, 2=Logged-over dry-land forest, 3=Undisturbed mangrove forest, 4=Logged-over mangrove forest, 5=Undisturbed swamp forest, ' + 
                '6=Logged-over swamp forest, 7=Agroforestry, 8=Plantation forest, 9=Rubber monoculture, 10=Oil palm monoculture, 11=Other monoculture, 12=Grass and savanna, 13=Shrub, ' +
                '14=Cropland, 15=Settlement, 16=Cleared land, 17=Waterbody'
    }, 
    "with_crowdsourced_data__primary_classification", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/primary_classification',
      'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/classification_with_crowdsourced_data/primary_classification',
    "mode"
  )
  
  
  
  exportImageToAssetWrapper(
    secondary_classification_afterRules_superimposeFilledPrimary_post.byte().rename('classification'), 
    {'year': '2018',
    'legend': '1=Undisturbed dry-land forest, 2=Logged-over dry-land forest, 3=Undisturbed mangrove forest, 4=Logged-over mangrove forest, 5=Undisturbed swamp forest, ' + 
          '6=Logged-over swamp forest, 7=Agroforestry, 8=Plantation forest, 9=Rubber monoculture, 10=Oil palm monoculture, 11=Other monoculture, 12=Grass and savanna, 13=Shrub, ' +
          '14=Cropland, 15=Settlement, 16=Cleared land, 17=Waterbody',
    'note': 'Some areas have the same final class assignment in the primary classification and secondary classification, which are the areas superimposed with the single most confident class as predicted by the supervised classification incorporating the crowdsourced training data.'
    }, 
    "with_crowdsourced_data__secondary_classification_superimposeFilledPrimary", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/secondary_classification_superimposeFilledPrimary',
      'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/classification_with_crowdsourced_data/secondary_classification_superimposeFilledPrimary',
    "mode"
  )
  
  
  exportImageToAssetWrapper(
    secondary_classification_afterRules_superimposeFilledFlag_post.byte().rename('classification'), 
    {'year': '2018',
    'legend': '1=Undisturbed dry-land forest, 2=Logged-over dry-land forest, 3=Undisturbed mangrove forest, 4=Logged-over mangrove forest, 5=Undisturbed swamp forest, ' + 
          '6=Logged-over swamp forest, 7=Agroforestry, 8=Plantation forest, 9=Rubber monoculture, 10=Oil palm monoculture, 11=Other monoculture, 12=Grass and savanna, 13=Shrub, ' +
          '14=Cropland, 15=Settlement, 16=Cleared land, 17=Waterbody',
    'note': 'Areas which have the same final class assignment in the primary classification and secondary classification, which are the areas superimposed with the single most confident class as predicted by the supervised classification incorporating the crowdsourced training data, are assigned a flag value of 253.'
    }, 
    "with_crowdsourced_data__secondary_classification_superimposeFilledFlag", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/secondary_classification_superimposeFilledFlag',
      'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/classification_with_crowdsourced_data/secondary_classification_superimposeFilledFlag',
    "mode"
  )
  
  
  // Class probability 
  
  exportImageToAssetWrapper(
    primary_classification_prob_afterRules.byte().rename('percent_probability'), 
    {'year': '2018'}, 
    "with_crowdsourced_data__primary_classification_probability", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/primary_classification_probability',
      'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/classification_with_crowdsourced_data/primary_classification_probability',
    "mean"
  )
  
  
  exportImageToAssetWrapper(
    secondary_classification_prob_afterRules_superimposeFilledPrimary.byte().rename('percent_probability'), 
    {'year': '2018',
    'note': 'Some areas have the same final class assignment (and thus class probability) in the primary classification and secondary classification, which are the areas superimposed with the single most confident class as predicted by the supervised classification incorporating the crowdsourced training data.'
    }, 
    "with_crowdsourced_data__secondary_classification_probability_superimposeFilledPrimary", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/secondary_classification_probability_superimposeFilledPrimary',
      'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/classification_with_crowdsourced_data/secondary_classification_probability_superimposeFilledPrimary',
    "mean"
  )
  
  
  exportImageToAssetWrapper(
    secondary_classification_prob_afterRules_superimposeFilledFlag.byte().rename('percent_probability'), 
    {'year': '2018',
    'note': 'Areas which have the same final class assignment in the primary classification and secondary classification, which are the areas superimposed with the single most confident class as predicted by the supervised classification incorporating the crowdsourced training data, are assigned a flag value of 253.'
    }, 
    "with_crowdsourced_data__secondary_classification_probability_superimposeFilledFlag", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/secondary_classification_probability_superimposeFilledFlag',
      'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/classification_with_crowdsourced_data/secondary_classification_probability_superimposeFilledFlag',
    "mean"
  )
  
  
  // Class uncertainty
  
  exportImageToAssetWrapper(
    perc_uncertainty_least_afterRules.byte().rename('percent_probability'), 
    {'year': '2018',
      'definition': '100 * (1 - (primary_classification_probability / 100))',
    }, 
    "with_crowdsourced_data__classification_uncertainty_least", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/classification_uncertainty_least',
    'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/classification_with_crowdsourced_data/classification_uncertainty_least',
    "mean"
  )
  
  
  exportImageToAssetWrapper(
    perc_uncertainty_margin_afterRules_superimposeFilledFlag.byte().rename('percent_probability'), 
    {'year': '2018',
      'definition': '100 * ((primary_classification_probability / 100) - (secondary_classification_probability / 100))',
      'note': 'Areas which have the same final class assignment in the primary classification and secondary classification, which are the areas superimposed with the single most confident class as predicted by the supervised classification incorporating the crowdsourced training data, are assigned a flag value of 253.'
    }, 
    "with_crowdsourced_data__classification_uncertainty_margin_superimposeFilledFlag", 
    // 'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/classification_uncertainty_margin_superimposeFilledFlag',
      'IIASA/RESTORE/classified_maps/class_hardened/with_crowdsourced_data/classification_with_crowdsourced_data/classification_uncertainty_margin_superimposeFilledFlag',
    "mean"
  )
  
  
  
  
  //***************************************************************************************************
  //**************************** End of expert rules application ***************************************
  //***************************************************************************************************
  
  
  
  //############################################################################################
  //############################# Some functions #############################################
  //############################################################################################
  
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Function to get most likely (maximum probability) class and second most likely (second maximum probability) class
  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  var selProb, selProbSliceStart, selProbSliceEnd;
  
  function getSelHighProbCls(col, selProb){
    
    if(selProb == "first"){
      
      selProbSliceStart = -1
      selProbSliceEnd = null
      
    } else if(selProb == "second"){
      
      selProbSliceStart = -2
      selProbSliceEnd = -1
  
    } else {
      
      print('Please specify selProb as "first" or "second"')
      
    }
    
    var imageAxis = 0;
    var bandAxis = 1;
    var col_arr = col.toArray()
    var col_arr_prob = col_arr.arraySlice(bandAxis, 0, 1)
    var col_arr_sorted = col_arr.arraySort(col_arr_prob)
    var selHighProb = col_arr_sorted.arraySlice(imageAxis, selProbSliceStart, selProbSliceEnd)
    var selHighProb_img = selHighProb.arrayProject([bandAxis]).arrayFlatten([["classProb","classId"]])  
    
    return selHighProb_img.cast({
      'classProb': 'uint8',
      'classId': 'uint8'
    });  
    
  }
  
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Function to convert a multiband image into an image collection with each band becoming an image
  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  function BandsToCollection(image){
    var collection = ee.ImageCollection.fromImages(
      image.bandNames().map(function(bandName){
      return image.select(ee.String(bandName))
             .rename('classProb')   // Corresponding bands to reduce in the image collection need to have same band names
             //Give each image a second band containing a number identifying it (1, 2, 3), 
             .addBands(ee.Image(ee.Number(clsNameIdnumDictDet.get(ee.String(bandName)))).uint8());
    }));
    return collection;
  }
  
  
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Functions to make map legend
  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  // Make land cover legend
  function makeLegendEntry(color, label) {
    label = ui.Label(label, {
      margin: '0 0 4px 6px',    //'auto 0',
      //fontWeight: '100',
      //color: '#555'
    });
    return makeRow([makeColorBox(color), label]);
  }
  
  function makeColorBox(color) {
    return ui.Label('', {
      backgroundColor: color,  
      padding: '8px',
      margin: '0 0 4px 0',
      //border: '1px solid gray',
    })
  }
  
  function makeRow(widgets){
    return ui.Panel({
      widgets: widgets,
      layout: ui.Panel.Layout.flow('horizontal'),
      style: {
        padding: '0px 5px',
      }
    })
  }
  
  
  function makeLegend(data, pos) {
    // Start with a ui.Panel:
    var legend = ui.Panel({
      style: {
        width: '250px',
        position: pos,
        //border: '1px solid lightgray',
      }
    });
    // Add a title to the legend:
    legend.add(ui.Label("RESTORE+", {
      fontWeight: 'bold', 
      fontSize: '18px'
      //fontWeight: '100',
      //color: 'gray',
    }));
    Object.keys(data).map(function(label){
      legend.add(makeLegendEntry(data[label], label));
    });
    return legend;
  }
  
  
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  
  
  
  //##############################################################################################################################
  //############# Other layers potentially useful for designing additional expert rules #############################################
  // Example script which might be helpful in applying custom rules: https://code.earthengine.google.com/f423e369d71037d86b04e2f0f9d76836
  //##############################################################################################################################
  
  
  var ifl = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/miscellaneous/intactForestLandscape2016_clipped");
  
  var protected_area = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/miscellaneous/WorldDatabaseProtectedArea_clipped_selected");
  
  var peatland = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/miscellaneous/Indonesia_peat_lands");
  
  var ecoregion = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/miscellaneous/Indonesia_ecoregion");
  
  
  
  
  
  
  
  