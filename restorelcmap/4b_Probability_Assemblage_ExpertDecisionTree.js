/*/////////////////////////////////////////////////////////////////////////////
Based on:


SERVIR-MEKONG 2016
EXERCISE: Assemblage
CONTACT INFORMATION: Karis Tenneson, rsac_gee@fs.fed.us
Date: 24-July-2017

SNIPPETS USED:
-exportAsset

LINK TO REPORT(S):

DESCRIPTION:
This script accomplishes several tasks:
 1) Users define decision tree structure, class structure, and class standard
    deviations
 2) Load primitive layers
 3) Uses a Monte Carlo approach to randomly sample the primitives from random
    normal distributions and then classifies the primitives according to the
    decision tree.
 4) Returns the mode of the stack of predictions as well as class probabilities
    for visualization and export

*//////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////
// INPUT DATA
///////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// Some datasets
////////////////////////////////////////////////////////////////


var classification_regions = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/classification_regions")

var land_mask = ee.Image("users/hadicu06/IIASA/RESTORE/miscellaneous/land_mask")

var landsat_2018_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/ls_composite_2018_byRegion").mosaic()



////////////////////////////////////////////////////////////////
// AOI
////////////////////////////////////////////////////////////////

//// RBI (geometry too complex may cause error)
// var provinces = ee.FeatureCollection("users/hadicu06/IIASA/vector/RBI/Admin_Provinsi_simpl15m");

// provinces = provinces.map(function(ft){
//   return ft.set('WA_noSpace', ft.getString('WA').replace(" ", "", "g"))
// })

// print("List of provinces", provinces.distinct('WA_noSpace').reduceColumns(ee.Reducer.toList(), ['WA_noSpace']))



//// Caution global administrative boundary map may not be the same as national (RBI) map
var gaul = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level1")
var provinces = gaul.filter(ee.Filter.eq('ADM0_NAME', 'Indonesia'))
print("List of provinces", provinces.distinct('ADM1_NAME').reduceColumns(ee.Reducer.toList(), ['ADM1_NAME']))

var studyArea = provinces.filter(ee.Filter.eq('ADM1_NAME', 'Sumatera Selatan')).geometry()
print("studyArea", studyArea)

Map.addLayer(ee.Image().byte().paint(studyArea, 1, 'red'), {palette:'red'}, 'Study Area', true);




////////////////////////////////////////////////////////////////
// Load class probabilities
////////////////////////////////////////////////////////////////


/*//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////// CLASS PROBABILITIES: DETAILED LEGEND CLASSIFICATION ///////////////////////////////
*//////////////////////////////////////////////////////////////////////////////////////////////////


// Trained with reference map 2010
var prob_det_01_undisturbedDrylandForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/01_undisturbedDrylandForest_2018_trainRef2010")
var prob_det_02_loggedOverDrylandForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/02_loggedOverDrylandForest_2018_trainRef2010")
var prob_det_03_undisturbedMangroveForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/03_undisturbedMangroveForest_2018_trainRef2010")
var prob_det_04_loggedOverMangroveForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/04_loggedOverMangroveForest_2018_trainRef2010")
var prob_det_05_undisturbedSwampForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/05_undisturbedSwampForest_2018_trainRef2010")
var prob_det_06_loggedOverSwampForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/06_loggedOverSwampForest_2018_trainRef2010")
var prob_det_07_agroforestry = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/07_agroforestry_2018_trainRef2010")
var prob_det_08_plantationForest = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/08_plantationForest_2018_trainRef2010")
var prob_det_09_rubberMonoculture = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/09_rubberMonoculture_2018_trainRef2010")
var prob_det_10_oilPalmMonoculture = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/10_oilPalmMonoculture_2018_trainRef2010")
var prob_det_11_otherMonoculture = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/11_otherMonoculture_2018_trainRef2010")
var prob_det_12_grassAndSavanna = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/12_grassAndSavanna_2018_trainRef2010")
var prob_det_13_shrub = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/13_shrub_2018_trainRef2010")
var prob_det_14_cropland = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/14_cropland_2018_trainRef2010")
var prob_det_15_settlement = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/15_settlement_2018_trainRef2010")
var prob_det_16_clearedLand = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/16_clearedLand_2018_trainRef2010")
var prob_det_17_waterbody = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/17_waterbody_2018_trainRef2010")



// Trained with alternative reference map i.e. WRI Tree Plantation for "Rubber monoculture" class
var prob_det_09_rubberMonoculture_alt = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/detailed_class/09_rubberMonoculture_2018_trainWRITreePlantation")



/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////// CLASS PROBABILITIES: SIMPLIFIED LEGEND CLASSIFICATION INCLUDING CROWDSOURCED TRAINING DATA ///////////////////////////////
*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var prob_simpl_c1 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/01_undisturbedForest_2018_trainInclCrowd")
var prob_simpl_c2 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/02_loggedOverForest_2018_trainInclCrowd")
var prob_simpl_c3 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/03_oilPalmMonoculture_2018_trainInclCrowd")
var prob_simpl_c4 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/04_treeBasedNotOilPalm_2018_trainInclCrowd")
var prob_simpl_c5 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/05_cropland_2018_trainInclCrowd")
var prob_simpl_c6 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/06_shrub_2018_trainInclCrowd")
var prob_simpl_c7 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/07_grassAndSavanna_2018_trainInclCrowd")
var prob_simpl_c8 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/08_water_2018_trainInclCrowd")
var prob_simpl_c9 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/09_settlement_2018_trainInclCrowd")
var prob_simpl_c10 = ee.Image("users/hadicu06/IIASA/RESTORE/classified_maps/class_probabilities/simplified_class_crowdsourced/10_clearedLand_2018_trainInclCrowd")





/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////// MAKE MULTIBAND IMAGE ///////////////////////////////
*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Use simplified c1+c2 (combined as forests), c3, c5, c8, c9, c10
// Note ideally with enough reference data, each primitive is to be evaluated for their accuracy, and thus the best version can be chosen, and the ones with expected higher
// accuracy are given higher importance in the decision tree.



// var prob_multiband = ee.Image.cat([
//   prob_det_01_undisturbedDrylandForest.rename('undisturbedDrylandForest'),
//   prob_det_02_loggedOverDrylandForest.rename('loggedOverDrylandForest'),
//   prob_det_03_undisturbedMangroveForest.rename('undisturbedMangroveForest'),
//   prob_det_04_loggedOverMangroveForest.rename('loggedOverMangroveForest'),
//   prob_det_05_undisturbedSwampForest.rename('undisturbedSwampForest'),
//   prob_det_06_loggedOverSwampForest.rename('loggedOverSwampForest'),
//   prob_det_07_agroforestry.rename('agroforestry'),
//   prob_det_08_plantationForest.rename('plantationForest'),
//   prob_det_09_rubberMonoculture_alt.rename('rubberMonoculture'),    // Trained with WRI Tree Plantation
//   prob_det_10_oilPalmMonoculture.rename('oilPalmMonoculture'),
//   prob_det_11_otherMonoculture.rename('otherMonoculture'),
//   prob_det_12_grassAndSavanna.rename('grassAndSavanna'),
//   prob_det_13_shrub.rename('shrub'),
//   prob_det_14_cropland.rename('cropland'),
//   prob_det_15_settlement.rename('settlement'),
//   prob_det_16_clearedLand.rename('clearedLand'),
//   prob_det_17_waterbody.rename('waterbody')
// ])




var prob_multiband = ee.Image.cat([
  prob_det_01_undisturbedDrylandForest.rename('undisturbedDrylandForest'),
  prob_det_02_loggedOverDrylandForest.rename('loggedOverDrylandForest'),
  prob_det_03_undisturbedMangroveForest.rename('undisturbedMangroveForest'),
  prob_det_04_loggedOverMangroveForest.rename('loggedOverMangroveForest'),
  prob_det_05_undisturbedSwampForest.rename('undisturbedSwampForest'),
  prob_det_06_loggedOverSwampForest.rename('loggedOverSwampForest'),
  prob_det_07_agroforestry.rename('agroforestry'),
  prob_det_08_plantationForest.rename('plantationForest'),
  prob_det_09_rubberMonoculture_alt.rename('rubberMonoculture'),    // Trained with WRI Tree Plantation
  prob_simpl_c3.rename('oilPalmMonoculture'),                       // Trained with crowdsourced data
  prob_det_11_otherMonoculture.rename('otherMonoculture'),
  prob_det_12_grassAndSavanna.rename('grassAndSavanna'),
  prob_det_13_shrub.rename('shrub'),
  prob_simpl_c5.rename('cropland'),                                 // Trained with crowdsourced data
  prob_simpl_c9.rename('settlement'),                               // Trained with global dedicated map for that class
  prob_det_16_clearedLand.rename('clearedLand'),
  prob_simpl_c8.rename('waterbody')                                 // Trained with global dedicated map for that class
])


//// Consider using these two layers, if assessed better than prob_det_01_undisturbedDrylandForest and prob_det_02_loggedOverDrylandForest
// prob_simpl_c1.rename('undisturbedForest')
// prob_simpl_c2.rename('loggedOverForest')


// Make sure no data is masked out (not filled)
prob_multiband = mask_nodata_prob(prob_multiband)


function mask_nodata_prob(img){
  
  return img
            .updateMask(landsat_2018_mosaic.select('red_median'))
            .updateMask(land_mask)
            .updateMask(img.neq(255))
            .copyProperties(img)
  
}





///////////////////////////////////////////////////////////////////////////////
// USER INPUTS
///////////////////////////////////////////////////////////////////////////////


// Define the structure of classes (order matters!):
// Each key is a unique class name
// Each value is a dictionary of class parameters, and contains the following
// key/value pairs:
// 'number': class number (integer, start at 0 and go to number of classes minus one)
// 'color': hex color for map (see http://htmlcolorcodes.com/ , don't include '#')


var classStruct = 
{ 'Other': {number: 0, color: '6f6f6f'},
  'Undisturbed dry-land forest': {number: 1, color: 'a6cee3'},
  'Logged-over dry-land forest': {number: 2, color: '1f78b4'},
  'Undisturbed mangrove forest': {number: 3, color: 'b2df8a'},
  'Logged-over mangrove forest': {number: 4, color: '33a02c'},
  'Undisturbed swamp forest': {number: 5, color: 'fb9a99'},
  'Logged-over swamp forest': {number: 6, color: 'e31a1c'},
  'Agroforestry': {number: 7, color: 'fdbf6f'},
  'Plantation forest': {number: 8, color: 'ff7f00'},
  'Rubber monoculture': {number: 9, color: 'cab2d6'},
  'Oil palm monoculture': {number: 10, color: '6a3d9a'},
  'Other monoculture': {number: 11, color: 'c51b8a'},
  'Grass/savanna': {number: 12, color: 'b15928'},
  'Shrub': {number: 13, color: '8dd3c7'},
  'Cropland': {number: 14, color: 'ffffb3'},
  'Settlement': {number: 15, color: '67001f'},
  'Cleared land': {number: 16, color: 'fb8072'},
  'Waterbody': {number: 17, color: '252525'}
};





//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4

// Define the structure of nodes (order doesn't matter):
// Each key is a unique node id (doesn't have to match a band)
// Each value is a dictionary to describe a node, and contains the following 
// key/value pairs:
// 'band': band used in decision
// 'threshold': threshold value
// 'left': Either 'terminal' or node id for the [band >= threshold] result
// 'right': Either or node id for the [band < threshold] result
// 'leftName': If the left node is 'terminal', the class name from classStruct
// 'rightName': If the right node is 'terminal', the class name from classStruct

// Note: If the left/right value is not 'terminal', it must correspond to a node 
// id in the nodeStruct

// TROUBLESHOOTING: 
// - If you receive a 'Maximum call stack size exceeded' error, then you have 
// created an invalid decision tree that does not terminate either do to loops 
// or an incomplete definition.
//  - If you receive a "Cannot read property 'band' of undefined" error, then 
// you have a left/right value that does not match an existing node id.




var prob_multiband = ee.Image.cat([
  prob_det_01_undisturbedDrylandForest.rename('undisturbedDrylandForest'),
  prob_det_02_loggedOverDrylandForest.rename('loggedOverDrylandForest'),
  prob_det_03_undisturbedMangroveForest.rename('undisturbedMangroveForest'),
  prob_det_04_loggedOverMangroveForest.rename('loggedOverMangroveForest'),
  prob_det_05_undisturbedSwampForest.rename('undisturbedSwampForest'),
  prob_det_06_loggedOverSwampForest.rename('loggedOverSwampForest'),
  prob_det_07_agroforestry.rename('agroforestry'),
  prob_det_08_plantationForest.rename('plantationForest'),
  prob_det_09_rubberMonoculture_alt.rename('rubberMonoculture'),    // Trained with WRI Tree Plantation
  prob_simpl_c3.rename('oilPalmMonoculture'),                       // Trained with crowdsourced data
  prob_det_11_otherMonoculture.rename('otherMonoculture'),
  prob_det_12_grassAndSavanna.rename('grassAndSavanna'),
  prob_det_13_shrub.rename('shrub'),
  prob_simpl_c5.rename('cropland'),                                 // Trained with crowdsourced data
  prob_simpl_c9.rename('settlement'),                               // Trained with global dedicated map for that class
  prob_det_16_clearedLand.rename('clearedLand'),
  prob_simpl_c8.rename('waterbody')                                 // Trained with global dedicated map for that class
])


print("prob_multiband", prob_multiband)



// Clip to study area
prob_multiband = prob_multiband.clip(studyArea)



////////////////////////////////////////////////////////////////////////
// Interactively inspect optimal class probability thresholds


var config = {};

var band_names = prob_multiband.bandNames().getInfo()

config.selBand = band_names[0];
config.selThres = '50'


var uiSelBand = ui.Select({
  items: band_names, 
  value: config.selBand, 
  onChange: function(value){
    config.selBand = value;
  } 
})



var uiSpecifyThres = ui.Textbox({
  value: config.selThres,
  onChange: function(value){
    config.selThres = value;
  }
})


// style: {'position':'top-center', 'width':'100px'}


var uiApplyThres = ui.Button({
  label: 'Apply threshold', 
  onClick: function(value){
    var selBandImage = prob_multiband.select(config.selBand)
    var thresholded = selBandImage.updateMask(selBandImage.gt(ee.Number.parse(config.selThres)))
    Map.layers().set(2, ui.Map.Layer(thresholded, {palette:['orange']}, 'thresholded', true))
  }
})



var uiInspectThresPanel = ui.Panel({
  widgets: [uiSelBand, uiSpecifyThres, uiApplyThres], 
  layout: ui.Panel.Layout.flow('horizontal'), 
  style: {position: 'top-center'}
})


Map.add(uiInspectThresPanel)


/**
 * Probability thresholds can alternatively be calibrated empirically 
 * with available good quality reference data that are adequately representative of the target area, 
 * by reference class area (e.g. official statistics), or by matching mapped class area (pixel-counting) with
 * unbiased sample-based area estimates.
*/






////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Design the decision tree ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * https://drive.google.com/file/d/1tWHULu8nVxv1e9-uw_5i1S7IvMcgYy08/view?usp=sharing
*/


var nodeStruct = 
{ 'WAT':  {band: 'waterbody', threshold: 50, left: 'terminal', leftName: 'Waterbody', right: 'STL'},
  'STL':  {band: 'settlement', threshold: 50, left: 'terminal', leftName: 'Settlement', right: 'UDF'},
  'UDF':  {band: 'undisturbedDrylandForest', threshold: 50, left: 'terminal', leftName: 'Undisturbed dry-land forest', right: 'LDF'},
  'LDF':  {band: 'loggedOverDrylandForest', threshold: 50, left: 'terminal', leftName: 'Logged-over dry-land forest', right: 'UMF'},
  'UMF':  {band: 'undisturbedMangroveForest', threshold: 50, left: 'terminal', leftName: 'Undisturbed mangrove forest', right: 'LMF'},
  'LMF':  {band: 'loggedOverMangroveForest', threshold: 50, left: 'terminal', leftName: 'Logged-over mangrove forest', right: 'USF'},
  'USF':  {band: 'undisturbedSwampForest', threshold: 50, left: 'terminal', leftName: 'Undisturbed swamp forest', right: 'LSF'},
  'LSF':  {band: 'loggedOverSwampForest', threshold: 50, left: 'terminal', leftName: 'Logged-over swamp forest', right: 'CRP'},
  'CRP':  {band: 'cropland', threshold: 50, left: 'terminal', leftName: 'Cropland', right: 'OPM'},
  'OPM':  {band: 'oilPalmMonoculture', threshold: 50, left: 'terminal', leftName: 'Oil palm monoculture', right: 'AGFR'},
  'AGFR':  {band: 'agroforestry', threshold: 50, left: 'terminal', leftName: 'Agroforestry', right: 'PLTF'},
  'PLTF':  {band: 'plantationForest', threshold: 50, left: 'terminal', leftName: 'Plantation forest', right: 'RUBM'},
  'RUBM':  {band: 'rubberMonoculture', threshold: 50, left: 'terminal', leftName: 'Rubber monoculture', right: 'OTHM'},
  'OTHM':  {band: 'otherMonoculture', threshold: 50, left: 'terminal', leftName: 'Other monoculture', right: 'GRS'},
  'GRS':  {band: 'grassAndSavanna', threshold: 50, left: 'terminal', leftName: 'Grass/savanna', right: 'CLR'},
  'CLR':  {band: 'clearedLand', threshold: 50, left: 'terminal', leftName: 'Cleared land', right: 'SHB'},
  'SHB':  {band: 'shrub', threshold: 50, left: 'terminal', leftName: 'Shrub', right: 'terminal', rightName: 'Other'}
};




// The starting id, i.e. the first decision
var startId = 'WAT';



////////////////////////////////////////////////////////////////////////////////
// ASSEMBLAGE CODE (USE CAUTION WHEN EDITING BELOW HERE)
////////////////////////////////////////////////////////////////////////////////

// Get list of class names, probability layer names, and palette colors
var classNamesList = getIds(classStruct);
var probNames = cleanList(classNamesList);
var classNames = ee.List(classNamesList);
var classNumbers = getList(classStruct,'number');
var PALETTE_list = getList(classStruct,'color');


// The initial decision tree string (DO NOT CHANGE)
var DTstring = ['1) root 9999 9999 9999'];

// Call the function to construct the decision tree string (DO NOT CHANGE)
DTstring = decision(nodeStruct,classStruct,startId,1,DTstring).join("\n");

print("DTstring", DTstring);





//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// Run decision tree
var classifier = ee.Classifier.decisionTree(DTstring);

var assemblage = prob_multiband.classify(classifier)
                 .rename('classification')



//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// Visualize the assemblage map

var PALETTE = PALETTE_list.join(',');

Map.layers().set(1, ui.Map.Layer(assemblage,{bands:'classification',palette:PALETTE,min:0,max:classNamesList.length-1},'Assemblage',false))
Map.centerObject(studyArea)
Map.setOptions('SATELLITE')


//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// Add legend

// Create the panel for the legend items.
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});

// Create and add the legend title.
var legendTitle = ui.Label({
  value: 'Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
  }
});

legend.add(legendTitle);


for (var i = 0; i < classNamesList.length; i++){
  legend.add(makeRow(PALETTE_list[i],classNamesList[i]));
}

Map.add(legend);





//////////////////////////////// END OF MAIN PART ////////////////////////////////////////////////


//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////////////////////////
// Function to convert a dictionary of nodes into a decision tree string
function decision(nodeStruct,classStruct,id,node,DTstring){  // DTstring = decision(nodeStruct,classStruct,startId,1,DTstring)
  // Extract parameters
  var lnode = 2*node; // left child node number
  var rnode = lnode + 1; // right child node number
  var dict = nodeStruct[id]; // current dictionary
  var band = dict.band; // decision band
  var threshold = dict.threshold; // decision threshold
  var left = dict.left; // left result (either 'terminal' or new id)
  var right = dict.right; // right result (either 'terminal' or new id)
  var leftName = dict.leftName; // left class name (if 'terminal')
  var rightName = dict.rightName; // right class name (if 'terminal')
  var leftLine = '';
  var rightLine = '';
  var leftNumber = 0;
  var rightNumber = 0;

  // Add the left condition and right condition strings to the current decision 
  // tree string. If either condition is non-terminal, recursively call the 
  // function.
  if (left == 'terminal') { // left terminal condition
    leftNumber = classStruct[leftName]['number'];
    leftLine = lnode + ') ' + band + '>=' + threshold + ' 9999 9999 ' + leftNumber + ' *';
    DTstring.push(leftLine);
    if (right == 'terminal') { // right terminal condition
      rightNumber = classStruct[rightName]['number'];
      rightLine = rnode + ') ' + band + '<' + threshold + ' 9999 9999 ' + rightNumber + ' *';
      DTstring.push(rightLine);
      return DTstring;
    } else { // right non-terminal condition
      rightLine = rnode + ') ' + band + '<' + threshold + ' 9999 9999 9999';
      DTstring.push(rightLine);
      return decision(nodeStruct,classStruct,right,rnode,DTstring);
    }
  } else { // left non-terminal condition
    leftLine = lnode + ') ' + band + '>=' + threshold + ' 9999 9999 9999';
    DTstring.push(leftLine);
    DTstring = decision(nodeStruct,classStruct,left,lnode,DTstring);
    if (right == 'terminal') { // right terminal condition
      rightNumber = classStruct[rightName]['number'];
      rightLine = rnode + ') ' + band + '<' + threshold + ' 9999 9999 ' + rightNumber + ' *';
      DTstring.push(rightLine);
      return DTstring;
    } else { // right non-terminal
      rightLine = rnode + ') ' + band + '<' + threshold + ' 9999 9999 9999';
      DTstring.push(rightLine);
      return decision(nodeStruct,classStruct,right,rnode,DTstring);
    }
  }
  return DTstring;
}



///////////////////////////////////////////////////////////////////////////////
// Function to get a list of column values from a structure
function getList(struct,column){
  return Object.keys(struct).map(function(k){
    var value = struct[k][column];
    return value;
  });
}

///////////////////////////////////////////////////////////////////////////////
// Function to get a list of ids (keys) from a structure
function getIds(struct){
  return Object.keys(struct);
}

///////////////////////////////////////////////////////////////////////////////
// Function to replace spaces with underscores in a list of strings
function cleanList(list){
  return list.map(function(name){
    return name.replace(/\s+/g,'_'); 
  });
}



///////////////////////////////////////////////////////////////////////////////
// Function to create and styles 1 row of the legend.
function makeRow(color, name) {
  // Create the label that is actually the colored box.
  var colorBox = ui.Label({
    style: {
      backgroundColor: '#' + color,
      // Use padding to give the box height and width.
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });

  // Create the label filled with the description text.
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 6px'}
  });

  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};
