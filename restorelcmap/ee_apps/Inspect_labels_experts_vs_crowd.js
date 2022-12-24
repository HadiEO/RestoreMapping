/////////////////////////////////////////////////////////////////////
///// Note this script has not been cleaned completely ////////////////////////////////////
///// Some assets cannot be made public, only shared through the apps ///////////
////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////
// Some global constants
////////////////////////////////////////////////////////////
var horizontalStyle = {stretch: 'horizontal', width: '100%'}
var verticalStyle = {stretch: 'vertical', width: '100%'}


var visLabels = {
  fontWeight: 'bold', 
  fontSize: '14px', 
  padding: '4px 4px 4px 4px',
  border: '1px solid black',
  color: 'black',
  backgroundColor: 'orange',
  textAlign: 'left',
  stretch: 'horizontal'
  }


// General setting for UI
var generalUIParams = {
  instructionsFontSize: '12px'
}



// Style for text in panel to control layer display
var dataDescriptionStyle = {
    //margin: '0px 0px 0px 0px',
    margin: '0px 0px 0px 16px',
    position: 'bottom-left',
    padding: '0px',
    color: 'grey',
    fontSize: '11px',
    width: '350px'
  }






// Parameters for Sentinel-2 cloud masking

var START_DATE = '2018-01-01'      // So 2020 looks good, likely scenes of earlier years are not available in SR collection
var END_DATE = '2018-12-31'
var CLOUD_FILTER = 100              // change 60 to 100 to use all available scenes
var CLD_PRB_THRESH = 50
var NIR_DRK_THRESH = 0.15
var CLD_PRJ_DIST = 1
var BUFFER = 50


var params = {
  's2_product': "toa",             // "toa" or "sr"         // ****************************************
  'more_aggresive': false,
  'projectShadow': false,
  'morphologyFilter': false,
  'sr_useJRCwater': true     // only in effect if 's2_product': "sr", whether to use JRC yearly water instead of scene classification (SCL) that comes with the s2 sr product
}



if(params.more_aggresive){
  CLD_PRB_THRESH = 40
  CLD_PRJ_DIST = 2
  BUFFER = 100
}



// Parameters for feedback panel

var config = {
  userName: '',
  userComment: '',
  digitizedFeatureLabel: '',   // feature(s) ?
  digitizedImage: ['NA']
  //feedbackPanelBgColor: '#ffeda0'
}






////////////////////////////////////////////////////////////
// For AOI
////////////////////////////////////////////////////////////

var IndoRegions = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/classification_regions")


////////////////////////////////////////






//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// I. Data
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

/////////////////////////////////////////////////////////////////////////////////////////////
// 1. PRIVATE DATASETS
/////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////
// a) Selected chip locations (feature collection)
/////////////////////////////////////////////////////////////////////////////////////////////

var crowdVsExperts_points = ee.FeatureCollection("users/hadicu06/IIASA/chips/df_maxLabel_rmNegUsers_ORD_notSmooth_confAdjusted_GEOW_moreInfo_factors_quad_detailCls")
// this is described in Scientific Data manuscript


////////////////////////////// Need to remove samples with only 1 crowd annotation

crowdVsExperts_points = crowdVsExperts_points.filter(ee.Filter.neq('numAnnotationsAllLabelsAdjusted', 1))



/////////////////////////////////////////////////////////////////////////////////////////////
// b) VHR chips
/////////////////////////////////////////////////////////////////////////////////////////////

var crowdVsExperts_chips = ee.ImageCollection("users/hadicu06/IIASA/chips/crowdVsExperts")   // !!! THIS CANNOT BE PUBLIC !!! 


/////////////////////////////////////////////////////////////////////////////////////////////
// c) Pre-exported time series data
/////////////////////////////////////////////////////////////////////////////////////////////

// Feb workshop
var ts1 = ee.FeatureCollection("users/restoreplus62/IIASA/timeseries/landsatTS_exp_ws_Feb_part1_28c2a100867e98221d81d68bda31294b")
var ts2 = ee.FeatureCollection("users/hadicu06/IIASA/timeseries/landsatTS_exp_ws_Feb_part2_df9469f3ad1eedb86e56ac8850fd601b")
var ts3 = ee.FeatureCollection("users/linabun08/IIASA/timeseries/landsatTS_exp_ws_Feb_part3_8849a5785e8fe2adebb2e56634f16dfb")
var ts4 = ee.FeatureCollection("users/restoreplus62/IIASA/timeseries/landsatTS_exp_ws_Feb_newForBadJpgs_d980abc070b63a7cf59ba5563857bcf5")

    
// June workshop  
var ts5  = ee.FeatureCollection("users/restoreplus62/IIASA/timeseries/landsatTS_exp_ws_Mar_part1_a6f99d886b91a67e3ff4fddc7cb90179")
var ts6 = ee.FeatureCollection("users/restoreplus62/IIASA/timeseries/landsatTS_exp_ws_Mar_part2_f5c8b9ca9129235a6933832e8432fdea")
var ts7 = ee.FeatureCollection("users/hadicu06/IIASA/timeseries/landsatTS_exp_ws_Mar_part3_3e11a1911cdda5e77cfae5df0a44aad8")
var ts8 = ee.FeatureCollection("users/hadicu06/IIASA/timeseries/landsatTS_exp_ws_Mar_part4_6e7c87e91c52c3338c0d31516ef81f0a")  
var ts9 = ee.FeatureCollection("users/hadicu06/IIASA/timeseries/landsatTS_exp_ws_Mar_part5_98c5c1a8b0209fa79f63a52a8be8a1be")
var ts10 = ee.FeatureCollection("users/restoreplus62/IIASA/timeseries/landsatTS_exp_ws_Mar_part6_3428f7397daa8096996a990a16d88608")
var ts11 = ee.FeatureCollection("users/hadicu06/IIASA/timeseries/landsatTS_exp_ws_Mar_part7_0870f530cff4bb8066fddbc3df45c81f")



// Extra June samples
var ts12 = ee.FeatureCollection("users/restoreplus62/IIASA/timeseries/landsatTS_exp_ws_online_extraSamples_692f407ea109fa6b24a1824387abf7de")
var ts13 = ee.FeatureCollection("users/restoreplus62/IIASA/timeseries/landsatTS_exp_ws_online_extraSamples_set2_ca69a67c591c265cf614d63bfec0483b")




// Merge all
var ts_merged = ts1.merge(ts2).merge(ts3).merge(ts4).merge(ts5).merge(ts6).merge(ts7).merge(ts8)
                .merge(ts9).merge(ts10).merge(ts11).merge(ts12).merge(ts13)
                



/////////////////////////////////////////////////////////////////////////////////////////////
// d) Planet quads (noRelax i.e. only include geowiki samples with full experts' consensus)
/////////////////////////////////////////////////////////////////////////////////////////////


var planetQuads = ee.ImageCollection("users/hadicu06/fun/planet/crowd_vs_experts_2018_noRelax")  // !!! THIS CANNOT BE PUBLIC !!!


var planetQuadsMosaic = planetQuads.mosaic()



// Filter planet image collection based on id_no e.g. L15-1566E-1057N matched to selected point pointIdSeq





////////////////////////////////////////////////
// e) Landsat annual composite 2018
////////////////////////////////////////////////

var landsat_2018_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/ls_composite_2018_byRegion").mosaic()





/////////////////////////////////////////////////////////////////////////////////////////////
// f) Non-forest predicted in R+ automated map (2018)
/////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////
// g) OSM + RBI roads
/////////////////////////////////////////////////////////////////////////////////////////////
var roads_osm = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/road_osm");
var roads_rbi = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/road_rbi")

roads_osm = roads_osm.remap(
["bridleway", "cycleway", "footway", "living_street", "motorway", 
"motorway_link", "path", "pedestrian", "primary", "primary_link", 
"residential", "secondary", "secondary_link", 
"service", 
"steps", 
"tertiary", "tertiary_link", 
"track", "track_grade1", "track_grade2", "track_grade3", "track_grade4", "track_grade5", 
"trunk", "trunk_link",
"unclassified", 
"unknown"],
[3,3,3,2,0,0,3,3,0,0,2,1,1,7,3,4,4,5,5,5,5,5,5,6,6,8,8],
"fclass")


// Merge OSM and RBI
var roads_osm_rbi = roads_osm.merge(roads_rbi)






/////////////////////////////////////////////////////////////////////////////////////////////
// h) Facebook high res settlement layer
// Facebook Connectivity Lab and Center for International Earth Science Information Network - CIESIN - Columbia University. 2016. High Resolution Settlement Layer (HRSL). Source imagery for HRSL Copyright 2016 DigitalGlobe. Accessed DAY MONTH YEAR. Data shared under: Creative Commons Attribution International.
/////////////////////////////////////////////////////////////////////////////////////////////
var HRSL = ee.ImageCollection("projects/sat-io/open-datasets/hrsl/hrslpop") // projects/sat-io/open-datasets/hrsl/hrslpop
           .filterBounds(IndoRegions.geometry());


//Create a spatial mosaic so image collection becomes a single image
HRSL = HRSL.median()
       .clip(IndoRegions.geometry())


//Make a constant image
HRSL = HRSL.mask().updateMask(HRSL.mask().eq(1))







/////////////////////////////////////////////////////////////////////////////////////////////
// i) Water JRC and Water R+ automated map
/////////////////////////////////////////////////////////////////////////////////////////////
// Annual water map 


var water_jrc = ee.ImageCollection("JRC/GSW1_2/YearlyHistory")
                  .filterDate('2018-01-01', '2018-12-31')
                  .first()

water_jrc = water_jrc.updateMask(water_jrc.neq(1))





////////////////////////////////////////////////
// j) WRI Tree Plantation
////////////////////////////////////////////////

var treePlantation = ee.FeatureCollection("users/hadicu06/IIASA/vector/Tree_plantations_INA_20210212")

// see script 99_vis_final_maps.js if want to be able to select the species



//////////////////////////////////////////////////////////////////
// k) Concessions
//////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////
// l) Intact Forest Landscape
//////////////////////////////////////////////////////////////////
var intactForest = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/miscellaneous/intactForestLandscape2016_clipped")

// Convert to image
intactForest = intactForest.map(function(ft){ return ft.set('isIntactForestLandscape', 1) })

var intactForestImg = intactForest.reduceToImage(["isIntactForestLandscape"], ee.Reducer.first()).rename('isIntactForestLandscape')



//////////////////////////////////////////////////////////////////
// m) Protected Area (WDPA)
//////////////////////////////////////////////////////////////////

var protectedArea = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/miscellaneous/WorldDatabaseProtectedArea_clipped_selected")

// Convert to image
protectedArea = protectedArea.map(function(ft){ return ft.set('isProtectedArea', 1) })

var protectedAreaImg = protectedArea.reduceToImage(["isProtectedArea"], ee.Reducer.first()).rename('isProtectedArea')









/////////////////////////////////////////////////////////////////////////////////////////////
// 2. EE CATALOG DATASETS
/////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////
// b) Sentinel-2: TOA & SR (cause SR scenes might be limited for early years)
/////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////
// c) GFC loss
/////////////////////////////////////////////////////////////////////////////////////////////

var GFCLoss = ee.Image("UMD/hansen/global_forest_change_2019_v1_7")

var GFCLossYear = GFCLoss.select('lossyear')

var GFCLossYear_2001_to_2018 = GFCLossYear.remap(
  ee.List.sequence(1,18,1),
  ee.List.repeat(1,18)
)



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// II. UI elements
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



///////////////////////////
// Sample id navigation

var PROPS = {}

PROPS.selectedIndex = -1


//////////////////////////////////////// Widgets creation inside initApp()

var app = {}



var initApp = function() { 
  
  
  ///////////////////////////////// Instantiate the panels
  ui.root.clear()
  
  app.main = []
  app.controls = []
  app.feedback = []
 
  app.mapPanel = ui.Map()
  //app.mapPanel = ui.Map({style: {cursor: 'crosshair'}})                                      // These panels to be put in init() function
  app.mapPanel.setOptions('TERRAIN')
  app.mapPanel.setControlVisibility({zoomControl:true, layerList:false})
  app.mapPanel.centerObject(crowdVsExperts_points)



  
  app.mapPanelWidgetsPanel = ui.Panel({layout: ui.Panel.Layout.Flow('vertical'), style:{position:'bottom-center', margin: '0 0 0 0', padding: '0px', fontSize: '6px', textAlign: 'left', width:'400px'}})

  app.tsPanel = ui.Panel()
  
  app.latlonPanel = ui.Panel({layout: ui.Panel.Layout.Flow('vertical'), style:{position:'bottom-center', margin: '0 0 0 0', padding: '0px', fontSize: '6px', textAlign: 'left'}})
  
  app.expertsCommentsPanel = ui.Panel({layout: ui.Panel.Layout.Flow('vertical'), style:{position:'bottom-center', margin: '0 0 0 0', padding: '0px', fontSize: '6px', textAlign: 'left'}})
  
  app.expertsClassesPanel = ui.Panel({layout: ui.Panel.Layout.Flow('vertical'), style:{position:'bottom-center', margin: '0 0 0 0', padding: '0px', fontSize: '6px', textAlign: 'left'}})

  
  
  //************************************************************************* app.main
  //app.main.mainPanel = ui.Panel(ui.SplitPanel(app.mapPanel.add(app.latlonPanel), app.tsPanel, 'vertical'))  
  
  //app.mapPanel.add(app.latlonPanel)
  //app.mapPanel.add(app.expertsClassesPanel)
  //app.mapPanel.add(app.expertsCommentsPanel)
  
  app.mapPanelWidgetsPanel.add(app.latlonPanel).add(app.expertsClassesPanel).add(app.expertsCommentsPanel)

  app.main.mainPanel = ui.Panel(ui.SplitPanel(app.mapPanel.add(app.mapPanelWidgetsPanel), app.tsPanel, 'vertical'))  
  //************************************************************************* 
  
  
    ////////////////////////////////////////////// Chip filters 
  
  // Widgets to filter the chips here. <- Q: BUT, THE FILTERED CHIPS WILL NOT HAVE SEQUENTIAL pointIdSeq, SO NEED TO INDEX THE pointIdSeq.
  
  var LC_QUESTION = ee.Dictionary(crowdVsExperts_points.distinct(['pileClassEng']).reduceColumns(ee.Reducer.toList(), ['pileClassEng'])).get('list')
  LC_QUESTION = ee.List(["All"]).cat(LC_QUESTION)
  
  var CROWD_ANSWER = ["All", "Yes", "No", "Maybe"]
  
  var EXPERTS_ANSWER = ["All", "Yes", "No", "Maybe"]
  
  var EXPERTS_CONSENSUS = ee.Dictionary(crowdVsExperts_points.distinct(['consensus']).sort('consensus').reduceColumns(ee.Reducer.toList(), ['consensus'])).get('list')
  EXPERTS_CONSENSUS = ee.List(["All"]).cat(EXPERTS_CONSENSUS)
  
  
  var uiChipFilterLC = new ui.Select({items: LC_QUESTION.getInfo(), placeholder: 'Undisturbed Forest', value: 'Undisturbed Forest', style: {stretch: 'horizontal', fontSize: generalUIParams.instructionsFontSize}})
 
  var uiChipFilterCrowdNumAnn = new ui.Select({items: ['2','3','4','5','6','7','8','9','10','11','12','13','14','15'], placeholder: '2', value: '2',  style: {stretch: 'horizontal', fontSize: generalUIParams.instructionsFontSize}})

  
  var uiChipFilterCrowdAns = new ui.Select({items: CROWD_ANSWER, placeholder: 'Yes', value: 'Yes',  style: {stretch: 'horizontal', fontSize: generalUIParams.instructionsFontSize}})
  var uiChipFilterExpertsAns = new ui.Select({items: EXPERTS_ANSWER, placeholder: 'No', value: 'No',  style: {stretch: 'horizontal', fontSize: generalUIParams.instructionsFontSize}})
  var uiChipFilterExpertsCons = new ui.Select({items: EXPERTS_CONSENSUS.getInfo(), placeholder: 'All', value: 'All',  style: {stretch: 'horizontal', fontSize: generalUIParams.instructionsFontSize}})
  var uiChipFilterExpertsComment = new ui.Select({items: ["All", "Yes", "No"], placeholder: 'All', value: 'All', style: {stretch: 'horizontal', fontSize: generalUIParams.instructionsFontSize}})
  
  PROPS.chipFilterLC = uiChipFilterLC.getValue()
  
  PROPS.chipFilterCrowdNumAnn = uiChipFilterCrowdNumAnn.getValue()
  
  PROPS.chipFilterCrowdAns = uiChipFilterCrowdAns.getValue()
  PROPS.chipFilterExpertsAns = uiChipFilterExpertsAns.getValue()
  PROPS.chipFilterExpertsCons = uiChipFilterExpertsCons.getValue()
  PROPS.chipFilterExpertsComment = uiChipFilterExpertsComment.getValue()
  
  
  uiChipFilterLC.onChange(function(value){ PROPS.chipFilterLC = value })
  
  uiChipFilterCrowdNumAnn.onChange(function(value){ PROPS.chipFilterCrowdNumAnn = value })
  
  uiChipFilterCrowdAns.onChange(function(value){ PROPS.chipFilterCrowdAns = value })
  uiChipFilterExpertsAns.onChange(function(value){ PROPS.chipFilterExpertsAns = value })
  uiChipFilterExpertsCons.onChange(function(value){ PROPS.chipFilterExpertsCons = value })
  uiChipFilterExpertsComment.onChange(function(value){ PROPS.chipFilterExpertsComment = value })
  
  
  
  // Button to apply chips filters
  app.controls.applyFilters = ui.Button({
    label: 'Filter samples', 
    onClick: applyChipFiltersFunction,                    // need to define applyFiltersFunction() to combine and apply the chips filters
    style: {stretch: 'horizontal', width: '200px', fontSize: generalUIParams.instructionsFontSize}
  })  
    
  
  // Info box 
  app.controls.infoBox = ui.Panel(
    [
      ui.Label({value:'Number of samples: ', style: {stretch: 'both', fontSize: generalUIParams.instructionsFontSize}}),
    ],
    ui.Panel.Layout.Flow('vertical'),
    horizontalStyle
  )
  
  
  


  
  // Put together the input control widgets (chip filters)
  app.controls.chipFilters = ui.Panel({
    style: {width: '100%', border: '1px solid black', margin: '0px 0px 0px 0px', padding: '0px'},
    widgets: [//ui.Label('Input and Outputs', visLabels), 
              ui.Label({value: 'Step 1. Filter samples', style: visLabels}),  // "Filter chips"
              ui.Panel([ui.Label({value: 'Land cover in question:',  style:{stretch: 'vertical', width:'50%', color:'black', fontSize: generalUIParams.instructionsFontSize}}), uiChipFilterLC], 
                      ui.Panel.Layout.Flow('horizontal'), horizontalStyle),
                      
              ui.Panel([ui.Label({value: 'Number of crowd annotations at least:',  style:{stretch: 'vertical', width:'50%', color:'black', fontSize: generalUIParams.instructionsFontSize}}), uiChipFilterCrowdNumAnn], 
                      ui.Panel.Layout.Flow('horizontal'), horizontalStyle),        
                      
              ui.Panel([ui.Label({value: 'Crowd answer:',  style:{stretch: 'vertical', width:'50%', color:'black', fontSize: generalUIParams.instructionsFontSize}}), uiChipFilterCrowdAns], 
                      ui.Panel.Layout.Flow('horizontal'), horizontalStyle),
              ui.Panel([ui.Label({value: 'Experts answer:',  style:{stretch: 'vertical', width:'50%', color:'black', fontSize: generalUIParams.instructionsFontSize}}), uiChipFilterExpertsAns], 
                      ui.Panel.Layout.Flow('horizontal'), horizontalStyle),
              ui.Panel([ui.Label({value: 'Experts consensus:',  style:{stretch: 'vertical', width:'50%', color:'black', fontSize: generalUIParams.instructionsFontSize}}), uiChipFilterExpertsCons], 
                      ui.Panel.Layout.Flow('horizontal'), horizontalStyle),
              ui.Panel([ui.Label({value: 'Experts provided comments:',  style:{stretch: 'vertical', width:'50%', color:'black', fontSize: generalUIParams.instructionsFontSize}}), uiChipFilterExpertsComment], 
                      ui.Panel.Layout.Flow('horizontal'), horizontalStyle),
             app.controls.applyFilters,
              app.controls.infoBox,
              ],
    
  })
    
  
  ///////////////////////////////// Sample navigation
  // Previous next and search pannel
  app.controls.textIn = new ui.Textbox('Search ID', "");
  app.controls.textIn.style().set({width: '80px', margin: '2px', fontSize: generalUIParams.instructionsFontSize});
  app.controls.textIn.onChange(textInCB)
  
  // Sets up next and previous buttons used to navigate through points
  app.controls.prevButton = new ui.Button('Previous', null, false, {width: '20%', margin: '0 0 0 0', fontSize: generalUIParams.instructionsFontSize});  // margin: '0 auto 0 0'
  app.controls.prevButton.onClick(prevButtonCB)
  
  app.controls.nextButton = new ui.Button('Next', null, false, {width: '20%', margin: '0 0 0 0', fontSize: generalUIParams.instructionsFontSize});  // margin: '0 0 0 auto'
  app.controls.nextButton.onClick(nextButtonCB)
  
  // Recenter to point
  app.controls.recenterButton = new ui.Button({                                // a stand-alone button?
    label: 'Re-center point',
    style:{stretch: 'horizontal', width:'30%', margin: '0px 0px 0px 8px',  fontSize: generalUIParams.instructionsFontSize},  // margin: '0 auto 0 0'
    onClick: function() {
      app.mapPanel.centerObject(PROPS.currentPoint, 18); 
    }
  })
  
  
   
  ////////////////////////////////////////////////////////////////////////////////
  // NEW: Panel to control display of map layers and providing data description
  
  function makeLayerPanel (name, fontWeight) {
    
    return ui.Panel([
      ui.Label(name, { fontSize: generalUIParams.instructionsFontSize, position: 'top-left', margin: '0px', padding: '0px', border: '0px', fontWeight: fontWeight })
    ], ui.Panel.Layout.absolute(), { height: '30px', margin: '6px 0px 0px 6px' })
      
  }
  
  var filteredPointsLayerPanel = makeLayerPanel("Filtered Sample Locations", 'bold')
  var landsatLayerPanel = makeLayerPanel("Landsat BOA Annual Composite (2018)", null)
  var planetLayerPanel = makeLayerPanel("PlanetScope SR Mosaic (2018; selected quads)", null)
  var sentinelTwoLayerPanel = makeLayerPanel("Sentinel-2 TOA Annual Composite (2018)", null)
  var treePlantationLayerPanel = makeLayerPanel("Tree Plantations (WRI)", null)
  var intactForestLayerPanel = makeLayerPanel("Intact Forest Landscape (2016)", null)
  var protectedAreaLayerPanel = makeLayerPanel("Protected Areas (WDPA)", null)
  var hansenLossLayerPanel = makeLayerPanel("Hansen GFC Forest Loss (2001-2018)", null)
  var fbSettlementLayerPanel = makeLayerPanel("Facebook's High-Resolution Settlement (Mask)", null)
  var roadLayerPanel = makeLayerPanel("Road (Open Street Map and National Topographic Database)", null)
  var waterLayerPanel = makeLayerPanel("JRC Yearly Water Classification (2018)", null)
  var chipLayerPanel = makeLayerPanel("VHR Chip", 'bold')
  var chipBboxLayerPanel = makeLayerPanel("LC Sample Bounding Box", 'bold')
  
  // https://code.earthengine.google.com/52aed28dcdbfde071bc5aba6745a5873
  
  

  
  addLayerControls(filteredPointsLayerPanel, true, 1, function() { return app.filteredPointsLayer })
  addLayerControls(landsatLayerPanel, false, 1, function() { return app.landsatLayer }, "https://developers.google.com/earth-engine/datasets/catalog/landsat")
  addLayerControls(planetLayerPanel, false, 1, function() { return app.planetLayer }, "https://www.planet.com/nicfi/")
  addLayerControls(sentinelTwoLayerPanel, false, 1, function() { return app.sentinelTwoLayer }, "https://developers.google.com/earth-engine/datasets/catalog/sentinel-2")
  addLayerControls(treePlantationLayerPanel, false, 1, function() { return app.treePlantationLayer }, "https://data.globalforestwatch.org/datasets/baae47df61ed4a73a6f54f00cb4207e0_5")
  addLayerControls(intactForestLayerPanel, false, 1, function() { return app.intactForestLayer }, "http://www.intactforests.org/data.ifl.html")
  addLayerControls(protectedAreaLayerPanel, false, 1, function() { return app.protectedAreaLayer }, "https://www.protectedplanet.net/en/thematic-areas/wdpa?tab=WDPA")
  addLayerControls(hansenLossLayerPanel, false, 0.8, function() { return app.hansenLossLayer }, "https://developers.google.com/earth-engine/datasets/catalog/UMD_hansen_global_forest_change_2019_v1_7?hl=en")
  addLayerControls(fbSettlementLayerPanel, false, 1, function() { return app.fbSettlementLayer }, "https://github.com/samapriya/awesome-gee-community-datasets#high-resolution-settlement-layer")
  addLayerControls(roadLayerPanel, false, 1, function() { return app.roadLayer }, "http://download.geofabrik.de/asia/indonesia.html")
  addLayerControls(waterLayerPanel, false, 1, function() { return app.waterLayer }, "https://developers.google.com/earth-engine/datasets/catalog/JRC_GSW1_2_YearlyHistory?hl=en")
  addLayerControls(chipLayerPanel, true, 1, function() { return app.chipLayer })
  addLayerControls(chipBboxLayerPanel, true, 1, function() { return app.chipBboxLayer })

  
  
  
  

  
  //********************************************* app.controls
  
  app.controls.buttonPanel = new ui.Panel({
    style: {width: '100%', border: '1px solid black', margin: '0px 0px 0px 0px', padding: '0px 0px 6px 0px'}, // T R B L
    widgets: [
      ui.Label({value: 'Step 2. Sample navigation', style: visLabels}),
      ui.Label({value: 'Start by clicking "Next". Changing samples and displaying the VHR chip may take a few seconds.', style: {fontSize: generalUIParams.instructionsFontSize}}),
      ui.Panel([app.controls.prevButton, app.controls.textIn, app.controls.nextButton, app.controls.recenterButton], ui.Panel.Layout.Flow('horizontal'), {width:'100%'}), // {width:'250px'}
      filteredPointsLayerPanel,
      landsatLayerPanel,
      planetLayerPanel,
      ui.Label("Available in this app for selected areas (quads).", dataDescriptionStyle),
      sentinelTwoLayerPanel,
      ui.Label("Generated on-the-fly for 5-km radius around sample location.", dataDescriptionStyle),
      treePlantationLayerPanel,
      intactForestLayerPanel,
      protectedAreaLayerPanel,
      hansenLossLayerPanel,
      fbSettlementLayerPanel,
      ui.Label("Facebook Connectivity Lab and Center for International Earth Science Information Network - CIESIN - Columbia University. 2016. High Resolution Settlement Layer (HRSL). Source imagery for HRSL Copyright 2016 DigitalGlobe. Accessed 11 04 2021. Data shared under: Creative Commons Attribution International.", dataDescriptionStyle),
      roadLayerPanel,
      ui.Label("National topographic database", dataDescriptionStyle).setUrl("https://tanahair.indonesia.go.id/portal-web"),
      waterLayerPanel,
      chipLayerPanel,
      ui.Label("Larger background image ©Esri's World Imagery", dataDescriptionStyle),
      // Outer background image is 
      chipBboxLayerPanel
    ]
  });
  
  
  //*************************************************    

  

    
  //////////////////////////////////////////////////////////////////////////////  
  /////////////////////////////////////////////////// Feedback panel here...?  
    
    
  app.drawingTools = app.mapPanel.drawingTools()
  app.drawingTools.setShown(true)
  app.drawingTools.setDrawModes(['polygon']); 
  
  
  // Add widgets to draw and download polygon of area with erroneous crowd data
  app.feedback.uiUserName = makeUiUserName(); 
  app.feedback.uiUserComment = makeUiUserComment();
  app.feedback.uiDigitizedFeatureLabel = makeUiDigitizedFeatureLabel();
  app.feedback.uiDigitizedImageLayers = makeUiDigitizedImageLayers();

  
  app.feedback.urlLabel = new ui.Label({
    value:'Download data', 
    style: {position: 'top-left', fontSize: generalUIParams.instructionsFontSize}
  });
  
  var updateLink = function(url){
    app.feedback.urlLabel.setValue('Download data').setUrl(url);
    app.feedback.downloadTablePanel.widgets().reset([app.feedback.urlLabel]);
  };

    
    
    
  // update table link after every change of the geometry layers
  var updateTable = function() {
    
      app.feedback.urlLabel.style().set("shown", true);
      app.feedback.urlLabel.setValue("Loading...");
      
      // reset config values?
      
      
      var currentPointIdSeq = PROPS.currentPoint.get('pointIdSeq').getInfo()
      var currentPointId = PROPS.currentPoint.get('pointId').getInfo()
      
      
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'-'+today.getHours()+'-'+today.getMinutes()+'-'+today.getSeconds();
      var filename = config.userName + '_' + currentPointIdSeq + '_' + date;
      
      
      
      // Here if no features digitized on the map? Alternatively, always have the sample unit bounding box feature?
      // But consider users who would not digitize feature and just write comments for that sample
      // Wait, geojson can have null geometry
      
      
      
      var onlyCommentFc = ee.FeatureCollection(PROPS.currentPoint).select(['pointIdSeq', 'pointId'])
              .map(
                function(ft){
                  return ft.set({
                            'userName': config.userName,
                            'userComment': config.userComment,
                            'digitizedObjectType': '',
                            'digitizedImage': ''           
                          })
               }
          )
      
      
      
      
      // Get features drawn on map
      //print('filename', filename);
      var newfc = getMergedFC(filename);                      // *** here newfc needs to be associated with sample point id
      //print('newfc', newfc)
      
      
      /* should we make heterogeneous collection? if not, then add sample point information as properties to each drawn polygon of newfc <- yes let's just do this, add properties:
      
      // Makes more senses just these two as the drawn polygons do not reflect the original sample unit area interpreted
      - pointId
      - pointIdSeq
      
      */ 
      
      
      /* Need to check if 
      
      - textbox (a,b,c) not filled
      - selector (d) not selected
      - no drawn geometry
      
      */
      
      
      //////////////////////////////////////////////// Get the selected image layers from the checkboxes
      
  
      var checkboxWidgets = app.feedback.uiDigitizedImageLayers.widgets();
      
       var checkboxName = ee.List(checkboxWidgets.map(function(i) {
        return i.get('label')
      })).getInfo()
      
  
      
      var checkboxValue = ee.List(checkboxWidgets.map(function(i) {
        return i.get('value')
      })).getInfo()
      
      
     
      // Make a fake feature collection  (maybe alternatively could have been done by filtering list based on the index in another list)
      var checkboxFC = []
      
      for (var i = 0; i < checkboxName.length; i++) {
        var fc_i = ee.Feature(null, {'name': checkboxName[i], 'selected': checkboxValue[i]})
        checkboxFC.push(fc_i)
      }
     
      checkboxFC = ee.FeatureCollection(checkboxFC)
  
      var selImageLayers = checkboxFC.filter(ee.Filter.eq('selected', true))     // ** HERE GET THE CHECKBOX LABELS THAT ARE TICKED **
                 .toList(10)
                 .map(function(i) {
                   return ee.Feature(i).get('name')
                 })
      
      
      // we just need a list of names here....
   
      //print("selImageLayers", selImageLayers)
      //print("selImageLayers.size()", selImageLayers.size())
      //print("config.digitizedImage", config.digitizedImage)
      
      if ( selImageLayers.size().getInfo() !== 0 ) {   
        
        config.digitizedImage.length = 0
        config.digitizedImage.push(selImageLayers)  
        
      } 
      
      
     //print("config.digitizedImage", config.digitizedImage)

      
      //////////////////////////////////////////////////////////////////////////////////////////////////
      
      
      newfc = newfc.map(function(ft){
        return ft.set({
          'pointIdSeq': currentPointIdSeq,
          'pointId': currentPointId,
          'userName': config.userName,
          'userComment': config.userComment,
          'digitizedObjectType': config.digitizedFeatureLabel,
          'digitizedImage': config.digitizedImage[0]
        })
      })
  
     
     
     //********************************************* Merge fc (Q: is it ok if no feature is drawn on the map?)
     var outFc = onlyCommentFc.merge(newfc)
     //*********************************************
     
      outFc.getDownloadURL({
        format:"json", 
        selectors: [".geo", "pointIdSeq", "pointId", "userName", "digitizedObjectType", "digitizedImage"], 
        filename: filename,
        callback: updateLink
      });
      
  };

    
    
  app.mapPanel.drawingTools().onDraw(updateTable);   // why not drawingTools.onDraw() ?
  app.mapPanel.drawingTools().onEdit(updateTable);
  app.mapPanel.drawingTools().onErase(updateTable);
  
    
    
  // Function to read drawn geometries
  function getMergedFC(filename) {
    var numGeomLayers = ee.Number(app.drawingTools.layers().length()).getInfo()   // evaluate()
    var fc_merged = ee.FeatureCollection(ee.Feature(null, {'dummy': 1, 'name': 'dummy'}))  // {'dummy': 1, "name":0}
    var result = numGeomLayers;
    for (var i = 0; i <= result-1; i++) {
       var layer = app.drawingTools.layers().get(i)
       
       //var name = layer.get("name")
       var fc = ee.FeatureCollection(layer.getEeObject()).map(function(ft){
         return ft.set("name", ee.String(filename))
       })
      
      /* If not ft.set()
      var fc = ee.FeatureCollection(layer.getEeObject())
      */
       
       fc_merged = fc_merged.merge(fc)
    }
     fc_merged = fc_merged.filter(ee.Filter.neq('dummy', 1))
     return fc_merged;
   }  
    
    
  app.feedback.urlLabel = ui.Label({value:"Link to data", style: {position: 'top-left', fontSize: generalUIParams.instructionsFontSize}})
  app.feedback.downloadTablePanel = ui.Panel({widgets:[app.feedback.urlLabel], style: {position: 'top-left'}})
  
  
  
  //************************************* Also make "Update link" as updateTable() is now only triggered if changes in drawing tools were made
  
  app.feedback.uiUpdateLink = new ui.Button({
    label: 'Update link', 
    onClick: updateTable,
    style: {fontSize: generalUIParams.instructionsFontSize}
  })
  
  
  
  
  //********************************************* app.controls.feedbackPanel
  app.controls.feedbackPanel = ui.Panel({
    widgets: [
      ui.Label({value: '(Optional) Step 3. Give comments or mark features', style: visLabels}),
      ui.Label({value: '(a) Your name/alias.', style: {fontSize: generalUIParams.instructionsFontSize}}),
      app.feedback.uiUserName, 
      ui.Label({value: '(b) Your comments on this sample.', style: {fontSize: generalUIParams.instructionsFontSize}}),
      app.feedback.uiUserComment,   
      ui.Label({value: '(c) If there is an object you would like to digitize associated with this sample, specify what is the object (e.g. road, clearing, logging etc.). Please note that currently only one object type is allowed per record. To digitize object of another type, simply click "Next" and "Previous" in Step 2 to revisit the sample.', style: {fontSize: generalUIParams.instructionsFontSize}}),
      app.feedback.uiDigitizedFeatureLabel,  // selector...if others, specify...
      ui.Label({value: '(d) If there is an object you would like to digitize associated with this sample, specify in which image layer(s) the object can be clearly identified. (note: the Planet imagery here available for not all samples).', style: {fontSize: generalUIParams.instructionsFontSize}}),
      app.feedback.uiDigitizedImageLayers, // checkbox (Landsat, Sentinel-2, Planet, Google VHR), in which image (can select multiple) the digitized features were identified
      //uiUpdateLink,
      //uiDownloadLink
      // Replaced with:
      ui.Label({value: '(e) After making sure (a)-(d) above have been specified, digitize the object.', style: {fontSize: generalUIParams.instructionsFontSize}}),           // Q: object or object(s) ? "only one object is allowed per sample"
      ui.Label({value: '(f) Download the above feedback data. Please download it before visiting another sample.', style: {fontSize: generalUIParams.instructionsFontSize}}),
      app.feedback.uiUpdateLink,
      app.feedback.downloadTablePanel,
      ui.Label({value: '(g) Link to a shared folder to upload the feedback data.', style: {fontSize: generalUIParams.instructionsFontSize}}),
      ui.Label({value: 'shared drive', style: {fontSize: generalUIParams.instructionsFontSize}}).setUrl('https://drive.google.com/drive/folders/1rxRW5Dn7Hv24UILKGz4PLUudqhBQ3UDk?usp=sharing')
      ], 
    style: {position: 'top-right', shown: true, border: '1px solid black', margin: '0px 0px 0px 0px', padding: '0px'} // shown: false 
  })
  
  
  
  
  
  
  
  
  
  // Toggle show or hide the feedback panel
  /*
  var hide_panel = {
    position: 'bottom-right',
    shown: false
  };
  
  var show_panel = {
               position: 'bottom-right',
               //width: '400px',
              // height: '200px',
               shown: true
  };
  
  
  
  app.controls.toggleFeedbackPanel = ui.Checkbox({
    label: 'Feedback (tick to expand)', 
    onChange: function(value){
      app.controls.feedbackPanel.style().set('shown', value)
    }, 
    style: {position: 'top-right', backgroundColor: '#feb24c', color: 'black'}
  })
    //********************************************* app.controls.feedbackPanel
  */ 
  
 
  //************************************************************************* app.main
  // Merge into whole control panel
  app.main.controlPanel = ui.Panel({
    style: {width: '30%'},
    widgets: [
              app.controls.chipFilters, 
              app.controls.buttonPanel,
              app.controls.feedbackPanel
    ], 
    layout: ui.Panel.Layout.Flow('vertical')           
    
  })
  //************************************************************************* 
    
    
  
 /////////////////////////////////////////////////////////////////////////////////////////////
 // Data sources acknowledgement
 
   var acknowledgement = ui.Label({
    value: 'Contains modified Copernicus Sentinel data [2018];\nImagery ©2018 Planet Labs Inc. All use subject to the Participant License Agreement;\nLandsat imagery courtesy of NASA Goddard Space Flight Center and U.S. Geological Survey',   //  ©2021

    style: {
      'backgroundColor': '#00000066',
      'color': 'white',
      'fontSize': '12px',
      // 'fontWeight': 'bold',
      padding: '0px 0px 0px 0px',
      margin: '0px 0px 0px 0px' //0px 0px 12px 0px
    }
  })

  app.mapPanel.add(ui.Panel({ widgets: [acknowledgement], style: { padding: '0px 0px 0px 0px', margin: '0px 0px 0px 0px',  position: 'bottom-left', 'backgroundColor': '#00000000', width: '20%' } }))   
  
    
    
  
  
  ////////////////////////////////////////////////////// Final top-level UI wrapper
  var fullUI = ui.SplitPanel(app.main.controlPanel, app.main.mainPanel, 'horizontal')
  

  ui.root.add(fullUI)
  
  
}





//////////////////////////////////////// End of initApp()




//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% execute initApp()
initApp()
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



//////////////////////////////////////////////////////////////////////////////////////
//********************************** MAIN FUNCTION TRIGGERED WHEN CHANGING SAMPLE ID


function resetMainPanel () {
  
  app.mapPanel.layers().reset()
  app.latlonPanel.clear()
  app.expertsClassesPanel.clear()
  app.expertsCommentsPanel.clear()
  
  //app.mapPanel.addLayer(PROPS.filtered_points, {color:"red"}, "Filtered Sample Locations")  // "filtered_points"
  
  var filteredPointsLayer = ui.Map.Layer(PROPS.filtered_points, {color:"red"}, "Filtered Sample Locations")
  
  app.mapPanel.layers().add(filteredPointsLayer)
  
  app.filteredPointsLayer = filteredPointsLayer
  
  var selPointId = PROPS.currentPoint.get("pointId").getInfo()
  
  
  
  ///////////////////////////////////////////////
  // (-i) Make Sentinel-2 composite

  var s2_buffer = PROPS.currentPoint.buffer(5000, 1)
  
  //print("buffer_r2km", buffer_r2km)
  
  var s2_cld_col = get_s2_cld_col(s2_buffer.geometry(), START_DATE, END_DATE)
  
  var jrc_year = ee.Date(START_DATE).get('year').getInfo()
  
  var not_water_jrc_mask = get_JRC_water(jrc_year)
  
  //print("s2_cld_col", s2_cld_col)
  //print("not_water_jrc_mask", not_water_jrc_mask)
  
  
  // Function to apply the cloud mask to each image in the collection
  function apply_cld_shdw_mask(img){
    // Subset the cloudmask band and invert it so clouds/shadow are 0, else 1.
    var not_cld_shdw = img.select('cloudmask').not()
  
    // Subset reflectance bands and update their masks, return the result.
    return img.select('B.*').updateMask(not_cld_shdw)
  }
  
  
  // Process the collection
  var s2_median = s2_cld_col.map(add_cld_shdw_mask)
                               .map(apply_cld_shdw_mask)
                               .median()
                               .clip(s2_buffer)
                               
     /////////////////////////////////////////////////////////
  //******************************* Functions to build Sentinel-2 collection
  
  function get_s2_cld_col(aoi, start_date, end_date) {
    
    // Import and filter S2 SR. Now also implement if TOA.
    if(params.s2_product === "sr") {
      
       var s2_col = ee.ImageCollection('COPERNICUS/S2_SR')  // TOA collection 'COPERNICUS/S2' doesn't come with 'SCL' band to get water, so in this case need to rely on external water mask
                    .filterBounds(aoi)
                    .filterDate(start_date, end_date)
                    .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', CLOUD_FILTER))
      
    } else if(params.s2_product === "toa") {
      
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
  
  
  
  
  // Cloud components
  
  function add_cloud_bands(img){
    
    var cld_prb = ee.Image(img.get('s2cloudless')).select('probability')
    
    var is_cloud = cld_prb.gt(CLD_PRB_THRESH).rename('clouds')
    
    return img.addBands(ee.Image([cld_prb, is_cloud]))
    
  }
  
  
  
  // Cloud shadow components
  // Define a function to add dark pixels, cloud projection, and identified shadows
  // Input is output of add_cloud_bands()
  
  
  
  //==============================================================                 
  // Use yearly JRC water, especially for early years when s2 sr is not available
  // Yearly JRC adapts to START_DATE: https://code.earthengine.google.com/1a5301429333f39f5d675753c00f3da4
  
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
    var water_jrc_fromMask = water_jrc.mask()  // 0 is "not water"
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
  
  
  
  //==============================================================                 
  
  
  
  function add_shadow_bands(img){
    
    
    if(params.s2_product === "sr"){
      
      if(params.sr_useJRCwater){ // use JRC yearly water
      
        var not_water = not_water_jrc_mask
        
      } else { // use SCL
        
        var not_water = img.select('SCL').neq(6)
  
      }
      
      
    } else if(params.s2_product === "toa"){   // if sr toa i.e. early years no s2 sr available, thus no scl layer, hence use JRC water
      
      var not_water = not_water_jrc_mask
  
    }
    
    
   
    // Dark NIR pixels that are not water (potential cloud shadow pixels)
    var R_BAND_SCALE = 1e4
    
    var dark_pixels = img.select('B8').lt(NIR_DRK_THRESH * R_BAND_SCALE).multiply(not_water).rename('dark_pixels')
    
    
     // print('not_water', not_water)
    
    if(params.projectShadow) {
      
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
    
    
    if(params.morphologyFilter){
      
      // Remove small cloud-shadow patches and dilate remaining pixels by BUFFER input.
      // 20 m scale is for speed, and assumes clouds don't require 10 m precision.
      is_cld_shdw = is_cld_shdw.focal_min(2).focal_max(BUFFER * 2 / 20)
          .reproject({'crs': img.select([0]).projection(), 'scale': 20})
          .rename('cloudmask')
  
    } else {
      
      is_cld_shdw = is_cld_shdw.rename('cloudmask')
      
    }
         
    return img_cloud_shadow.addBands(is_cld_shdw)
    // return img.addBands(is_cld_shdw) // if only the final cloud/cloud shadow mask along with the original image bands
    
  }
                            
                               
                               
  
  ///////////////////////////////////
  // (i) Get planet quad
  
  //print("PROPS.currentPoint", PROPS.currentPoint)
  var selQuadImageName = PROPS.currentPoint.get("quadImageName").getInfo()
  
  // print("selQuadImageName", selQuadImageName)
  // If NOT DOWNLOADED:

  if (selQuadImageName === "NOT DOWNLOADED") {
    
    var selQuadImage = ee.Image([])
    
  } else {
    
    var selQuadImage = planetQuads.filterMetadata("id_no", "equals", selQuadImageName).first()
    
  }
  
  
  // Clip ?
  
  
  
 

  ////////////////////////////////////////////////////
  // (ii) Get VHR chips
  
  var selVHRChip = crowdVsExperts_chips.filterMetadata("pointId", "equals", selPointId) // this has zoom in and zoom out
  
  var selVHRChip_mos = selVHRChip.reduce(ee.Reducer.firstNonNull()) // mosaic zoom in and zoom out images
  
  ////////////////////////////////////////////////////
  // (iii) Get time series data and make a chart
  // Need to filter TS data by pointId or filenam
  // https://code.earthengine.google.com/4b1e3b1f7c0dc2b99a34fed9e832678d
  
  
  // selPointId
  var selPointFilenam = PROPS.currentPoint.get("imageName").getInfo()

  
  var selTSData = ts_merged.filter(ee.Filter.notNull(['NDMI']))                                  // time series data....
                                  .filterMetadata('pointId', 'equals', selPointId)
                                  //.sort('time')
  

  if (selTSData.size().getInfo() === 0) {
    
     var selTSData = ts_merged.filter(ee.Filter.notNull(['NDMI']))                                  // time series data....
                                  .filterMetadata('filenam', 'equals', selPointFilenam)
                                  //.sort('time')
  }
  
  
  //print("selTSData", selTSData)
  
  // Make TS plots
  var selTSPlot_ndmi = makeTsPlot(selTSData, "NDMI", -0.5, 1)
  var selTSPlot_ndvi = makeTsPlot(selTSData, "NDVI", 0, 1)
  var selTSPlot_nbr = makeTsPlot(selTSData, "NBR", -0.5, 1)
 
  app.tsPanel.clear()
  app.tsPanel.add(selTSPlot_ndmi).add(selTSPlot_ndvi).add(selTSPlot_nbr)

  
  
  
  ////////////////////////////////////////////////////////////
  // (iv) Show latlon coodinates, also print in a textbox experts classes and experts comments, also (new) number of crowd annotations
  
  PROPS.currentLat = PROPS.currentPoint.geometry().coordinates().get(1).getInfo()
  PROPS.currentLon = PROPS.currentPoint.geometry().coordinates().get(0).getInfo()
  
  var latlon = ui.Label({
    value: 'Lat, Lon: ' + parseFloat(PROPS.currentLon).toFixed(5) + ', ' + parseFloat(PROPS.currentLat).toFixed(5), 
    style:{textAlign: 'left', fontSize:'12px'}
  })
  
  //app.latlonPanel.clear()
  app.latlonPanel.add(latlon)
  
  
  app.expertsClassesPanel.add(ui.Label({
    value:"Number of crowd annotations: " + PROPS.currentPoint.get('numAnnotationsAllLabelsAdjusted').getInfo(),   // new: crowd number of annotations
    style:{textAlign: 'left', fontSize:'12px'}
  }))                  
  
  
  app.expertsClassesPanel.add(ui.Label({
    value:"Crowd consensus score (0-1): " + ee.Number(1.00).subtract(PROPS.currentPoint.getNumber('uncertaintyLeast')).format('%.2f').getInfo(),   // new: crowd number of annotations
    style:{textAlign: 'left', fontSize:'12px'}
  })) 
  
  
  
  
  //app.expertsClassesPanel.clear()
  app.expertsClassesPanel.add(ui.Label({
    value:"Experts' classes: " + PROPS.currentPoint.get('detailedClassesCat').getInfo(), 
    style:{textAlign: 'left', fontSize:'12px'}
  }))                  // crowd data points does not yet have detailed classes concatenated..
  
  
  //app.expertsCommentsPanel.clear()
  app.expertsCommentsPanel.add(ui.Label({
    value:"Experts' comments: " + PROPS.currentPoint.get('commentTransCat').getInfo(), 
    style:{textAlign: 'left', fontSize:'12px'}
  }))
  
  
  
  
  
  
  /////////////////////////////////////////////////////////////////
   // bbox = boundary of VHR chip zoom in
   
  var selVHRChip_zoomIn = selVHRChip.filterMetadata("zoom", "equals", "ZOOM IN")
  var currentBbox = selVHRChip_zoomIn.geometry()

  var currentBboxRst = ee.Image().toByte()
                .paint(currentBbox, 2, 4);    
  

  
  
  ///////////////////////////////////////////////////////////////////
  //******************* Map layers ordering
  ///////////////////////////////////////////////////////////////////
  
  ////////////////////////////// Landsat (should we clip?)
  //app.mapPanel.addLayer(landsat_2018_mosaic, {min:[0,0,0], max:[1500,1500,1500], bands: ['red_median', 'green_median', 'blue_median']}, 'Landsat 2018 median - RGB', false)

  //app.mapPanel.addLayer(landsat_2018_mosaic, {min:[0,0,0], max:[3000,6000,1500], bands: ['swir1_median', 'nir_median', 'red_median']}, 'Landsat BOA Annual Composite (2018)', false)


  var landsatLayer = ui.Map.Layer(landsat_2018_mosaic, {min:[0,0,0], max:[3000,6000,1500], bands: ['swir1_median', 'nir_median', 'red_median']}, 'Landsat BOA Annual Composite (2018)', false)
  
  app.mapPanel.layers().add(landsatLayer)
  
  app.landsatLayer = landsatLayer
  
  
  /////////////////////////////////////// Planet
  var planetRgbVis = {bands:['b3', 'b2', 'b1'], min:0, max:1500}
  
  var planetFccVis = {bands:['b4', 'b3', 'b2'], min:[0,0,0], max:[4000,1500,1500]}
  
  
  // Q: which one is faster, display planet quad mosaic vs selected planet quad?
  // Feels quite the same actually. So, just to avoid distraction of other quads, do the display by selected quad.
  
  // Display selected planet quad
  
  //print("selQuadImageName", selQuadImageName)
  //print("selQuadImage", selQuadImage)
  
  
  
  if (selQuadImageName === "NOT DOWNLOADED") {
    //app.mapPanel.addLayer(selQuadImage, {}, "PlanetScope SR Mosaic (2018; selected quads)", false)   // "selPlanetQuad - RGB"
    // Map.addLayer(selQuadImage, {}, "selPlanetQuad - FCC", false)  
    
    var planetLayer = ui.Map.Layer(selQuadImage, {}, "PlanetScope SR Mosaic (2018; selected quads)", false)
    app.mapPanel.layers().add(planetLayer)
    app.planetLayer = planetLayer
    
    
  } else {
    //app.mapPanel.addLayer(selQuadImage, planetRgbVis, "PlanetScope SR Mosaic (2018; selected quads)", false) // "selPlanetQuad - RGB"
    // Map.addLayer(selQuadImage, planetFccVis, "selPlanetQuad - FCC", false)    
    
    var planetLayer = ui.Map.Layer(selQuadImage, planetRgbVis, "PlanetScope SR Mosaic (2018; selected quads)", false)
    app.mapPanel.layers().add(planetLayer)
    app.planetLayer = planetLayer
  }
  
  
  
  /////////////////////////////////////// Sentinel-2
  //app.mapPanel.addLayer(s2_median,
  //          {'bands': ['B4', 'B3', 'B2'], 'min': 0, 'max': 1500, 'gamma': 1.1},
  //          'S2 ' + params.s2_product + ' 2018 median - RGB', false, 1) 
  
 
  //app.mapPanel.addLayer(s2_median,
  //        {'bands': ['B11', 'B8', 'B5'], 'min': [0, 0, 0], 'max': [2500, 4000, 2000], 'gamma': 1.1},
  //      'Sentinel-2 TOA Annual Composite (2018)', false, 1)  // 'S2 ' + params.s2_product + ' 2018 median - FCC'
  
  
  var sentinelTwoLayer = ui.Map.Layer(s2_median,
          {'bands': ['B11', 'B8', 'B5'], 'min': [0, 0, 0], 'max': [2500, 4000, 2000], 'gamma': 1.1},
          'Sentinel-2 TOA Annual Composite (2018)', false, 1)
  
  
  app.mapPanel.layers().add(sentinelTwoLayer)
  
  app.sentinelTwoLayer = sentinelTwoLayer
  
  
  //////////////////////////// Other fixed layers
  //app.mapPanel.addLayer(treePlantation, {color:'green'}, "Tree Plantations (WRI)", false)
  //app.mapPanel.addLayer(intactForest, {color:'cyan'}, "Intact Forest Landscape (2016)", false)
  //app.mapPanel.addLayer(protectedArea, {color:'brown'}, "Protected Areas (WDPA)", false)

  //app.mapPanel.addLayer(GFCLossYear, {'palette':'orange'}, "Hansen GFC Forest Loss (2001-2019)", false)
  //app.mapPanel.addLayer(HRSL, {palette:'gray'}, "Facebook's High-Resolution Population (Mask)", false)
  //app.mapPanel.addLayer(roads_osm_rbi, {color:'yellow'}, "Road (Open Street Map and National Topographic Database)", false)
  //app.mapPanel.addLayer(water_jrc, {palette:'blue'}, "JRC Yearly Water Classification (2018)", false)

  
  
  
  var treePlantationLayer = ui.Map.Layer(treePlantation, {color:'green'}, "Tree Plantations (WRI)", false)
  var intactForestLayer = ui.Map.Layer(intactForest, {color:'cyan'}, "Intact Forest Landscape (2016)", false)
  var protectedAreaLayer = ui.Map.Layer(protectedArea, {color:'brown'}, "Protected Areas (WDPA)", false)
  
  var hansenLossLayer = ui.Map.Layer(GFCLossYear_2001_to_2018, {'palette':'orange'}, "Hansen GFC Forest Loss (2001-2018)", false)
  var fbSettlementLayer = ui.Map.Layer(HRSL, {palette:'#67001f'}, "Facebook's High-Resolution Population (Mask)", false)
  var roadLayer = ui.Map.Layer(roads_osm_rbi, {color:'yellow'}, "Road (Open Street Map and National Topographic Database)", false)
  var waterLayer = ui.Map.Layer(water_jrc, {palette:'blue'}, "JRC Yearly Water Classification (2018)", false)
  
  
  
  
  app.mapPanel.layers().add(treePlantationLayer)
  app.mapPanel.layers().add(intactForestLayer)
  app.mapPanel.layers().add(protectedAreaLayer)
  app.mapPanel.layers().add(hansenLossLayer)
  app.mapPanel.layers().add(fbSettlementLayer)
  app.mapPanel.layers().add(roadLayer)
  app.mapPanel.layers().add(waterLayer)
  
  
  app.treePlantationLayer = treePlantationLayer
  app.intactForestLayer = intactForestLayer
  app.protectedAreaLayer = protectedAreaLayer
  app.hansenLossLayer = hansenLossLayer
  app.fbSettlementLayer = fbSettlementLayer
  app.roadLayer = roadLayer
  app.waterLayer = waterLayer
  
  
  
  
  
  /////////////////////////// VHR chip
  //app.mapPanel.addLayer(selVHRChip_mos, {}, "VHR Chip", true)
  
  //app.mapPanel.addLayer(currentBboxRst, {opacity: 0.9, palette:'red'}, 'LC Sample Area')
  
  // app.mapPanel.addLayer(PROPS.currentPoint, {color:'red'}, "currentPoint")
  app.mapPanel.centerObject(PROPS.currentPoint, 18)
  
  
  
  var chipLayer = ui.Map.Layer(selVHRChip_mos, {}, "VHR Chip", true)
  var chipBboxLayer = ui.Map.Layer(currentBboxRst, {opacity: 0.9, palette:'red'}, 'LC Sample Bounding Box')
  
  app.mapPanel.layers().add(chipLayer)
  app.mapPanel.layers().add(chipBboxLayer)
  
  app.chipLayer = chipLayer
  app.chipBboxLayer = chipBboxLayer
  
  
  
  
  ////////////////////////////////////////////////////////
  // Set basemap
  //app.mapPanel.setOptions('TERRAIN')
  
  
  
  ///////////////////////////////////////////////
  // Attribution text (add as text in control panel)
  //var attribution = ui.Label("Imagery ©2018 Planet Labs Inc. All use subject to the Participant License Agreement.", {'position': 'bottom-left'})
  //attribution.setUrl("https://assets.planet.com/docs/Planet_ParticipantLicenseAgreement_NICFI.pdf")
  //app.mapPanel.add(attribution)



} 

//********************************** END OF MAIN FUNCTION TRIGGERED WHEN CHANGING SAMPLE ID






//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Functions 
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


////////////////////////////////////////////////////////////////////
//****************************************** Navigate points


function addSubtractID(button, increment) {
  // Zooms to the current point based on next and previous buttons

  PROPS.selectedIndex = PROPS.selectedIndex + increment                             // ** selectedIndex must be incremental 0,1,2,...

  // if (selectedIndex == 0) selectedIndex = pointTotal;
  // if (selectedIndex > (pointTotal)) selectedIndex = 1;

  
  PROPS.currentPointIdSeq = ee.List(PROPS.filtered_points_idSeqList).get(PROPS.selectedIndex).getInfo()
  
  //PROPS.currentPoint = ee.Feature(                                                                      // ** PROPS.currentPoint is updated each time text_in textbox changes values
  //  ee.FeatureCollection(crowdVsExperts_points.filterMetadata("pointIdSeq", "equals", PROPS.currentPointIdSeq)).first() // crowdVsExperts_points OR  PROPS.filtered_points?
  //  )
  
  
  // Q: How to make loading... here?
 
  app.controls.textIn.setValue(PROPS.currentPointIdSeq)
  
  
  
}



//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

function setZoom(cur_val) {    //** THIS IS WHERE PROPS.currentPoint UPDATES ITSELF

  // Set new current value
  PROPS.currentPointIdSeq = parseInt(cur_val)
  PROPS.currentPoint = ee.Feature(                                             // ** PROPS.currentPoint is updated each time text_in textbox changes values
                ee.FeatureCollection(crowdVsExperts_points.filterMetadata('pointIdSeq', 'equals', PROPS.currentPointIdSeq)).first()   // crowdVsExperts_points OR  PROPS.filtered_points?
              )
  
  
  resetMainPanel()                                                 // *** resetMainPanel() ***
  app.mapPanel.centerObject(PROPS.currentPoint, 18);
  
  /////////////////////////// Reset some of the feedback panel widgets and data
  app.mapPanel.drawingTools().clear() // or app.drawingTools.clear()
  config.digitizedImage = ['NA']  
  
  
  /*
  app.feedback.urlLabel = new ui.Label({
    value:'Download data', 
    style: {position: 'top-left'}
  });
  
  app.feedback.downloadTablePanel.widgets().reset([app.feedback.urlLabel])
  */
  
  
  
  //////////////////////////// Also refresh feedback panel:
  //resetFeedbackPanel()   // this will not take effect cause the feedback panel is constructed inside initApp()

}



//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


/*
function resetFeedbackPanel(){
  app.mapPanel.drawingTools().clear() // or app.drawingTools.clear()
  app.feedback.uiUserName.setValue(null)
  app.feedback.uiUserComment.setValue(null)
  app.feedback.uiDigitizedFeatureLabel.setValue(null)
  app.feedback.uiDigitizedImageLayers.setValue(null)
  app.feedback.urlLabel.setValue('Download table')
}
*/


function prevButtonCB(button){
  addSubtractID(button, -1)
  // print("PROPS.currentPoint", PROPS.currentPoint)
  //app.mapPanel.centerObject(PROPS.currentPoint, 18)
}



function nextButtonCB(button){
  addSubtractID(button, 1)
  // print("PROPS.currentPoint", PROPS.currentPoint)
  //app.mapPanel.centerObject(PROPS.currentPoint, 18)
}



function textInCB(val){
  setZoom(val)
  // print("PROPS.currentPoint", PROPS.currentPoint)
}



/////////////////////////////////////////////////////////////////////
//********************************************* Filter chips

function applyChipFiltersFunction () {

  // - set value (count of points after filters) to infoBox
  // - update show the points on the map
  
  // old code with uiChip...getValue()   https://code.earthengine.google.com/7aa3a8653b758a9d9af7f5d5d56f34d6


  PROPS.selectedIndex = -1
  
  
  // i. chipFilterLC
  if (PROPS.chipFilterLC === "All") {
    
    var chipFilterLC =  ee.Filter.notNull(["pileClassEng"])
    
  } else {
    
    var chipFilterLC =  ee.Filter.eq("pileClassEng", PROPS.chipFilterLC)
    
  }
  
  
  
  // new: chipFilterCrowdNumAnn
  var chipFilterCrowdNumAnn = ee.Filter.gte('numAnnotationsAllLabelsAdjusted', Number(PROPS.chipFilterCrowdNumAnn))
  
  
  
  // ii. chipFilterCrowdAns
  if (PROPS.chipFilterCrowdAns === "All") {
    
    var chipFilterCrowdAns = ee.Filter.notNull(["crowdAnnotation"])
    
  } else {
    
    var chipFilterCrowdAns = ee.Filter.eq("crowdAnnotation", PROPS.chipFilterCrowdAns)
    
  }
  
  
  
  // iii. chipFilterExpertsAns
  // // Yes -> true ; No -> false cause when ingested in EE converted to boolean somehow
  if ( PROPS.chipFilterExpertsAns === "Yes" ) {
    
    var chipFilterExpertsAns = ee.Filter.eq("expertsAnnotation", true)
    
  } else if ( PROPS.chipFilterExpertsAns === "No" ) {
    
    var chipFilterExpertsAns = ee.Filter.eq("expertsAnnotation", false)
    
  } else if ( PROPS.chipFilterExpertsAns === "All" ) {
    
    var chipFilterExpertsAns = ee.Filter.notNull(["expertsAnnotation"])
    
  }
  
  
  // iv. chipFilterExpertsCons
  if ( PROPS.chipFilterExpertsCons === "All" ) {
    
    var chipFilterExpertsCons = ee.Filter.notNull(["consensus"])
    
  } else {
    
    var chipFilterExpertsCons = ee.Filter.eq("consensus", PROPS.chipFilterExpertsCons)
    
  }
  
  
  
  // v. chipFilterExpertsComment
  // Is there experts comment?
  if ( PROPS.chipFilterExpertsComment === "Yes" ) {
    
    var chipFilterExpertsComment = ee.Filter.and(ee.Filter.neq("numComments", 0), ee.Filter.neq("commentTransCat", "NO COMMENTS PROVIDED"))
     
  } else if ( PROPS.chipFilterExpertsComment === "No" ) {
    
    var chipFilterExpertsComment = ee.Filter.eq("numComments", 0)
    
  } else if ( PROPS.chipFilterExpertsComment === "All" ) {
    
    var chipFilterExpertsComment = ee.Filter.notNull(["numComments"])
    
  }
  
  
  // Combine filters
  var filters_combined = ee.Filter.and(
    chipFilterLC,
    
    chipFilterCrowdNumAnn,
    
    chipFilterCrowdAns,
    chipFilterExpertsAns,  
    chipFilterExpertsCons,
    chipFilterExpertsComment)
      
      
  PROPS.filtered_points = crowdVsExperts_points.filter(filters_combined)  
  PROPS.filtered_points_idSeqList = PROPS.filtered_points.sort('pointIdSeq').reduceColumns(ee.Reducer.toList(), ['pointIdSeq']).get('list')

      
  app.mapPanel.layers().reset()
  
  //app.mapPanel.addLayer(PROPS.filtered_points, {color:"red"}, "filtered_points")
  
  var filteredPointsLayer = ui.Map.Layer(PROPS.filtered_points, {color:"red"}, "Filtered Sample Locations")
  
  app.mapPanel.layers().add(filteredPointsLayer)
  
  app.filteredPointsLayer = filteredPointsLayer

  
  

  app.controls.infoBox.widgets().get(0).setValue('Number of samples: loading...')
  PROPS.filtered_points.size().evaluate(function(size){
    app.controls.infoBox.widgets().get(0).setValue('Number of samples: ' + size)
  })  
  
}




//////////////////////////////////////////////////////
//************************* Make time series chart

function makeTsPlot(pointData, bandName, ymin, ymax){

    var chart = ui.Chart.feature.byFeature(pointData, 'Date', bandName)
                      .setChartType('ScatterChart')
                      .setSeriesNames([bandName])
                      .setOptions({
                        title: bandName,
                        //hAxis: {'title': 'Date', 'viewWindow': {'min':786171600000, 'max':1575090000000}},
                        hAxis: {'title': 'Date'},
                        //vAxis: {'title': 'SR'},
                        vAxis: {'title': bandName, viewWindow: {min: ymin, max: ymax}},
                        explorer: {} , // EXPERIMENTAL
                        pointSize: 4,
                        lineWidth: 0}) 
  
  
  // Clicking a date loads the image
  // // TODO: create a message if no stretch has been selected, because nothing will be added to
  // // the map if no stretch has been selected.
  // chart.onClick(function(date) {
  //   uiUtils.getImageRegion(app.main.mapPanel, ee.Feature(PROPS.currentPoint).geometry(), 
  //                         date, PROPS.visParams, ee.Projection("EPSG:4326"))
  // })
  
  //app.main.tsPanel.add(chart)
  return(chart)
  
}




///////////////////////////////////////////////////////////////////////////
//*************************************************** Widgets for feedback panel

function makeUiUserName(){
  var uiUserName = ui.Textbox({
    placeholder: 'Write your name', 
    onChange: function(value){
      config.userName = value;
    }, 
    style: {position: 'top-right', fontSize: generalUIParams.instructionsFontSize}
  })
  return uiUserName;
}


function makeUiUserComment(){
  var uiUserComment = ui.Textbox({
    placeholder: 'Write your comments', 
    onChange: function(value){
      config.userComment = value;
    }, 
    style: {position: 'top-right', width: "450px", fontSize: generalUIParams.instructionsFontSize}
  })
  return uiUserComment;
}



function makeUiDigitizedFeatureLabel() {
  
  //As selectable options? For now just free text, as not sure what labels to list
  // var featureLabels = ['Roads', 'Clearings', 'Others (specify)']   // can be made into function argument
  
  // var uiDigitizedFeatureLabel = ui.Select({
  //   items: featureLabels,
  //   placeholder: "Type of feature",
  //   style: {stretch: 'horizontal'}
  // })
  
  var uiDigitizedFeatureLabel = ui.Textbox({
    placeholder: 'Write the type of feature', 
    onChange: function(value){
      config.digitizedFeatureLabel = value;
    }, 
    style: {position: 'top-right', width: "450px", fontSize: generalUIParams.instructionsFontSize}
  })
  
  
  return uiDigitizedFeatureLabel;
  
}





function makeUiDigitizedImageLayers() {
  
  /*
  var imageLayers = ['Sample VHR chip', 'Google VHR', 'Planet', 'Sentinel-2', 'Landsat']  
  
  var uiDigitizedImageLayer = ui.Select({                                                        // THIS SHOULD BE A MULTIPLE ANSWERS ALLOWED CHECKBOX
    items: imageLayers,
    placeholder: "Select image layer",
    style: {stretch: 'horizontal', width: '180px'}
  })
  
  return uiDigitizedImageLayer;
  */
  
  var IMAGELAYERSSEL = []

  var imageLayers = ['Sample VHR chip', 'Google VHR', 'Planet', 'Sentinel-2', 'Landsat'] 
  
  var uiDigitizedImageLayers = ui.Panel()
  
  for (var i = 0; i < imageLayers.length; i++){
      var imageLayer_i = imageLayers[i];
      
      var checkbox_i = ui.Checkbox({
        label: imageLayer_i, 
        value: false,
        style: {fontSize: generalUIParams.instructionsFontSize}
      });
      
      uiDigitizedImageLayers.add(checkbox_i);
  }
  
  
  return uiDigitizedImageLayers;

  
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for displaying map layers

function addLayerControls(layerPanel, shown, opacity, getLayer, url) {
  var layerShownCheckbox = ui.Checkbox('', shown, function(s) {
    getLayer().setShown(s)
  })

  var layerOpacitySlider = ui.Slider(0, 1, opacity, 0.05)

  // layerShownCheckbox.style().set({ position: 'top-right' })
  // layerOpacitySlider.style().set({ position: 'top-right' })

  layerOpacitySlider.onSlide(function(v) {
    getLayer().setOpacity(v)
  })

  layerShownCheckbox.style().set({ margin: '2px', padding: '0px', border: '0px' })
  layerOpacitySlider.style().set({ margin: '0px', padding: '0px', border: '0px', width: '50px' })

  var layerControls = ui.Panel([layerShownCheckbox, layerOpacitySlider], ui.Panel.Layout.flow('horizontal'))
  layerControls.style().set({ position: 'top-right', margin: '0px 0px 0px 0px', padding: '0px' })

  if(url) {
    var infoBox = ui.Label('ℹ️', { margin: '0px', padding: '0px 4px 0px 0px' }, url)
    layerControls.widgets().insert(0, infoBox)
  }

  layerPanel.widgets().add(layerControls)

  layerPanel.controls = [layerShownCheckbox, layerOpacitySlider]
}




///////////////////////////////////////////////////////////////////////////////////////////////////////////
/*

  // Acknowledgement text
  var labelAcknowledgement = ui.Label({
    value: 'Wageningen University, Laboratory of Geo-Information Science and Remote Sensing ©2021',

    style: {
      'backgroundColor': '#00000066',
      'color': 'white',
      'fontSize': '12px',
      // 'fontWeight': 'bold',
      padding: '0px 0px 0px 0px',
      margin: '0px 0px 12px 0px'
    }
  })

  Map.add(ui.Panel({ widgets: [labelAcknowledgement], style: { padding: '0px 0px 0px 0px', margin: '0px 0px 0px 0px',  position: 'bottom-center', 'backgroundColor': '#00000000' } }))


*/
