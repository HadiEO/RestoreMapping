
/////////////////////////////////////////////////////////////////////
///// Note this script has not been cleaned completely ////////////////////////////////////
////////////////////////////////////////////////////////////////////



////////////// INITIALIZE VALUES ////////////////////////
var AOI1 = ee.Geometry.Point([108.94255240886832,  -6.845394023614906])
var AOI2 = ee.Geometry.Point([139.5476, -7.83459])


//////////////////// MAP PANEL ////////////////////////////
var map1 = ui.Map();
map1.style().set('cursor', 'crosshair');
map1.add(ui.Label('Median Composite | N-th Percentile Composite',   // cloud score
  {'fontWeight':'bold', 'backgroundColor': '#ff7f00', 'fontSize':'20px', 'color':'black', 'margin':0}));


var map2 = ui.Map();
map2.style().set('cursor', 'crosshair');
map2.add(ui.Label('Greenest Pixel (Max. NDVI) Composite | Medoid Composite',
  {'fontWeight':'bold', 'backgroundColor': '#bc80bd', 'fontSize':'20px', 'color':'black', 'margin':0}));

// Link the two maps.
var linker = ui.Map.Linker([map1, map2]);

// Make a split map.
var splitMap = ui.SplitPanel({
  firstPanel: map1,  
  secondPanel: map2, 
  wipe: true});


var mapPanel = splitMap;                                    // ********************* Map Panel ******************************




// Initialize maps
map1.setCenter(110.03068019254445, -7.277571657313411, 16)
map1.setOptions('TERRAIN');
map2.setOptions('TERRAIN')



//////////////// INPUT PANEL ///////////////////////////////////////
var uiStartDate = ui.Textbox({
  value: '2018-01-01',
  onChange: function(text) {
    var filledStartDate = text
  },
  style: {
    'position': 'top-left'
  }
})

var uiEndDate = ui.Textbox({
  value: '2018-12-31',
  onChange: function(text) {
     var filledEndDate = text
  },
  style: {
    'position': 'top-left'
  }
})



var uiSceneMaxCloud = ui.Textbox({value:'100'});


// Visualization inputs
var uiMaxRGB = ui.Textbox({value:'2000'});

var uiFCCBands = ui.Textbox({value:'swir1;nir;red'});

var uiMaxFCC = ui.Textbox({value:'3000;5000;2000'});


// Cloud and shadow masking inputs
var uiPercentile = ui.Textbox({value:'25'});




///////////////////////////////////////
// Cloud score & TDOM 

var uiCloudScoreThresh = ui.Textbox({value:'10'});
var uiCloudScorePctl = ui.Textbox({value:'0'});
var uiZScoreThresh = ui.Textbox({value:'-0.8'});
var uiShadowSumThresh = ui.Textbox({value:'0.35'});
var uiContractPixels = ui.Textbox({value:'0'});
var uiDilatePixels = ui.Textbox({value:'0'});


var uiCustomMaskPanel = ui.Panel()
uiCustomMaskPanel.add(ui.Label('Cloud score + TDOM parameters:').setUrl('https://code.earthengine.google.com/?scriptPath=users%2FUSFS_GTAC%2Fmodules%3Awrappers%2FgetLandsatWrapper.js'))
  .add(ui.Label('cloudScoreThresh (e.g. 10):'))
  .add(uiCloudScoreThresh)
  .add(ui.Label('cloudScorePctl (e.g. 0):'))
  .add(uiCloudScorePctl)
  .add(ui.Label('zScoreThresh (e.g. -0.8):'))
  .add(uiZScoreThresh)
  .add(ui.Label('shadowSumThresh (e.g. 0.35):'))
  .add(uiShadowSumThresh)
  .add(ui.Label('contractPixels (e.g. 0):'))
  .add(uiContractPixels)
  .add(ui.Label('dilatePixels (e.g. 0):'))
  .add(uiDilatePixels)
  .add(ui.Label(""))

uiCustomMaskPanel.style().set('shown', false)


// Masking procedure selector

var uiCloudShadowMask = ui.Select({
  items: ['Fmask (default)', 'Cloud score + TDOM (experimental)', 'Not applied'],
  value: 'Fmask (default)',
  onChange: function(value){
    if(value === "Cloud score + TDOM (experimental)"){
      uiCustomMaskPanel.style().set('shown', true)
    } else {
      uiCustomMaskPanel.style().set('shown', false)
    }
  }
})





// NEW: Sentinel-2 cloud and shadow masking configurations

var ui_PROC_LVL = ui.Select({
  items: ['TOA', 'SR'],   // "toa" or "sr"
  value: 'TOA'
})         



var ui_CLD_PRB_THRESH = ui.Textbox({value:'50'})
var ui_NIR_DRK_THRESH = ui.Textbox({value:'0.15'})

var ui_CLD_PRJ_DIST = ui.Textbox({value:'1'})

var ui_PROJECT_SHADOW = ui.Checkbox({label: 'project shadow', value: true, 
  onChange: function(value){                     
   ui_CLD_PRJ_DIST.setDisabled(!value)
  }
})




var ui_BUFFER = ui.Textbox({value:'50'})

var ui_DILATE_CLOUD = ui.Checkbox({label: 'dilate cloud', value: true, 
  onChange: function(value){
   ui_BUFFER.setDisabled(!value)
  }
})
 


var ui_WATER_LYR = ui.Select({
  items: ['SCL (only SR)', 'JRC yearly'],
  value: "JRC yearly"
}) 




// Put together into a panel
var uiSentinel2MaskPanel = ui.Panel()
uiSentinel2MaskPanel.add(ui.Label('Sentinel-2 cloud & shadow masking parameters:').setUrl('https://developers.google.com/earth-engine/tutorials/community/sentinel-2-s2cloudless'))
  .add(ui.Label('image processing level:'))
  .add(ui_PROC_LVL)
  .add(ui.Label('cloud probability in % (e.g. 50):'))
  .add(ui_CLD_PRB_THRESH)
  .add(ui.Label('NIR threshold for potential shadow (e.g. 0.15):'))
  .add(ui_NIR_DRK_THRESH)
  .add(ui.Label('project shadow? (disable for large-area run inspection)'))
  .add(ui_PROJECT_SHADOW)
  .add(ui.Label("shadow's max distance in km (e.g. 1):"))
  .add(ui_CLD_PRJ_DIST)
  .add(ui.Label('dilate cloud? (disable for large-area run inspection)'))
  .add(ui_DILATE_CLOUD)
  .add(ui.Label('cloud dilation buffer in m (e.g. 50):'))
  .add(ui_BUFFER)
  .add(ui.Label('water layer:'))
  .add(ui_WATER_LYR)
  .add(ui.Label(""))

uiSentinel2MaskPanel.style().set('shown', false)


// Sensor selection inputs
var uiSensor = ui.Select({
  items: ['All Landsat (default)', 'L5 (TM)', 'L7 (ETM+)', 'L8 (OLI)', 'S2A & S2B (MSI)'],    // *** continue here
  value: 'All Landsat (default)',
  onChange: function(value){
    if (value === "S2A & S2B (MSI)") {
      uiCloudShadowMask.style().set('shown', false)
      uiSentinel2MaskPanel.style().set('shown', true)
    } else {
      uiCloudShadowMask.style().set('shown', true)
      uiSentinel2MaskPanel.style().set('shown', false)
    }
  }
})








///////////////////////////////////////
// Checkboxes to display which composites


var uiShowMedianComp = ui.Checkbox('Median composite', true)
var uiShowPercentileComp = ui.Checkbox('N-th Percentile composite', false)
var uiShowMedoidComp = ui.Checkbox('Medoid composite', false)
var uiShowGreenestComp = ui.Checkbox('Greenest pixel composite', false)







//////////////////////////////////////////////
// Submit button

var uiSubmit = ui.Button({
  label: 'Generate composite(s)', 
  onClick: function() {
    submit()
  },
  style: {'fontSize':'24px'}
})


////////////////////////////////////////////////
// Placeholder to print info about composite by the user
var uiLL = ui.Label();
var uiUR = ui.Label();
var uiWeights = ui.Label();
var uiReturnInfo = ui.Panel().add(uiLL).add(uiUR)//.add(uiWeights)





//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



////////////////////////////////////////////////////////////////////////////
// Put into a panel

var inputPanel = ui.Panel({                                              // ********************* Input Panel ******************************
  widgets: [
            ui.Label('User inputs', {'fontWeight':'bold', 'fontSize':'18px'}),
            ui.Label('Start date (yyyy-mm-dd):'),
            uiStartDate,
            ui.Label('End date (yyyy-mm-dd):'),
            uiEndDate,
            ui.Label('Sensor:'),
            uiSensor,
            ui.Label('Scene-level max cloud (%):'),
            uiSceneMaxCloud,
            ui.Label('Cloud and shadow masking:'),
            uiCloudShadowMask,
            uiCustomMaskPanel,
            uiSentinel2MaskPanel,                       // Sentinel-2
            ui.Label('Percentile (%) composite:'),            // **
            uiPercentile,                       // **

            ui.Label('Visualization parameters'),
            ui.Label('Max. stretch values for R,G,B bands (e.g. 2000):'),
            uiMaxRGB,
            ui.Label('FCC vis bands (e.g. swir1;nir;red):'),
            uiFCCBands,
            ui.Label('Max. stretch values for FCC bands (e.g. for swir1;nir;red is 3000;5000;2000):'),
            uiMaxFCC,
            
            ui.Label('Show composites:'),
            uiShowMedianComp,
            uiShowPercentileComp,
            uiShowMedoidComp,
            uiShowGreenestComp,
            
            
            uiSubmit,
            ui.Label('Bounding Box AOI:'),
            uiReturnInfo,
            
            // ui.Label('To share your findings, please fill the spreadsheet below:'),
            // ui.Label('spreadsheet').setUrl('https://docs.google.com/spreadsheets/d/1HLtyk1An8FLWbc1sy-pW_XXTP0GLYq2kt9KV3FEiyX4/edit?usp=sharing')
            
            ui.Label('hadicu06@gmail.com')
            ],
  layout: ui.Panel.Layout.flow('vertical'),
  style: {
    height: '100%',
    width: '20%'
  }
})




  
///////////////// SET UI.ROOT ////////////////////



ui.root.clear()
ui.root.add(inputPanel)
ui.root.add(mapPanel)



///////////////////////// Make collection ////////////////////////
function submit() {

  var FCCBands = ee.List(uiFCCBands.getValue().split(';')).getInfo()
  var maxFCC = ee.List(uiMaxFCC.getValue().split(';'))
              .map(function(item){ return ee.Number.parse(item) })
              .getInfo()
  var maxRGB = ee.Number.parse(uiMaxRGB.getValue()).getInfo()

  
  var RGB_VIS = {min: 0, max: maxRGB, gamma: 1.5, bands: ['red', 'green', 'blue']}
  var FCC_VIS = {min: [0,0,0], max: maxFCC, gamma: [1.5,1.5,1.5], bands: FCCBands}
  
     
     
  ////////////////////////////////////////////////////
  // Dates
  
  var filledStartDate = uiStartDate.getValue()

  var filledEndDate = uiEndDate.getValue()


  ////////////////////////////////////////////////////
  // Filter scene-level cloud
  var sceneMaxCloud = ee.Number.parse(uiSceneMaxCloud.getValue())
  
 
  
  
  //////////////////////////////////////////////////////////////
  // Other composites
  
  
 if ( uiSensor.getValue() === "S2A & S2B (MSI)" ) {    // if Sentinel-2
   

    var CLD_PRB_THRESH = ee.Number.parse(ui_CLD_PRB_THRESH.getValue())
    var NIR_DRK_THRESH = ee.Number.parse(ui_NIR_DRK_THRESH.getValue())
    var CLD_PRJ_DIST = ee.Number.parse(ui_CLD_PRJ_DIST.getValue())
    var BUFFER = ee.Number.parse(ui_BUFFER.getValue())
    var PROC_LEVEL = ui_PROC_LVL.getValue()      // string
    var WATER_LYR = ui_WATER_LYR.getValue()      // string
    var PROJECT_SHADOW = ui_PROJECT_SHADOW.getValue()             // true or false
    var DILATE_CLOUD = ui_DILATE_CLOUD.getValue()                 // true or false

    
    
    // 1. get image collection
    var collection = getSentinel2Data({                    // **************** here here ****************************
        startDate: filledStartDate, 
        endDate: filledEndDate,
        sceneMaxCloud: sceneMaxCloud,
        procLevel: PROC_LEVEL
    })
   


    // 2. apply cloud & shadow masking to each image
    var jrc_year = ee.Date(filledStartDate).get('year').getInfo()

    var not_water_jrc_mask = get_JRC_water(jrc_year)   
   
    // also show composite without cloud & shadow masking
    var raw_collection = collection.select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12'], ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'])  

   
    collection = collection.map(add_cld_shdw_mask).map(apply_cld_shdw_mask)    // comment out to debug
    
    
    
     //////// **** FUNCTIONS TO DO CLOUD & SHADOW MASKING FOR SENTINEL-2 *******
     
    ///////////////////////////
    // Cloud components
    
    function add_cloud_bands(img){
      
      var cld_prb = ee.Image(img.get('s2cloudless')).select('probability')
      
      var is_cloud = cld_prb.gt(CLD_PRB_THRESH).rename('clouds')                                                     // CLD_PRB_THRESH
      
      return img.addBands(ee.Image([cld_prb, is_cloud]))
      
    }
    
    
    
    // Water layer
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
    
    
  
    // Shadow (needs to be here cause needs PROC_LEVEL, WATER_LYR, NIR_DRK_THRESH, PROJECT_SHADOW, and CLD_PRJ_DIST)
    function add_shadow_bands(img){
      
      
      if(PROC_LEVEL === "SR"){                                                                    // PROC_LEVEL
        
        if(WATER_LYR === "JRC yearly"){ // use JRC yearly water                                   // WATER_LYR
        
          var not_water = not_water_jrc_mask    // not_water_jrc_mask is computed before calling this function, cause this function needs to be mapped over image collection thus accepting only one argument i.e. image
          
        } else { // use SCL
          
          var not_water = img.select('SCL').neq(6)
    
        }
        
        
      } else if(PROC_LEVEL === "TOA"){   // if sr toa i.e. early years no s2 sr available, thus no scl layer, hence use JRC water
        
        var not_water = not_water_jrc_mask
    
      }
      

     
      // Dark NIR pixels that are not water (potential cloud shadow pixels)
      var R_BAND_SCALE = 1e4
      

      var dark_pixels = img.select('B8').lt(ee.Number(NIR_DRK_THRESH).multiply(R_BAND_SCALE)).multiply(not_water).rename('dark_pixels')         // NIR_DRK_THRESH
      
      
     
      
      if(PROJECT_SHADOW === true) {                                                                                               // PROJECT_SHADOW
        
        // Direction to project cloud shadow from clouds (assumes UTM projection)
        var shadow_azimuth = ee.Number(90).subtract(ee.Number(img.get('MEAN_SOLAR_AZIMUTH_ANGLE')))
        
        var cld_proj = img.select('clouds').directionalDistanceTransform(shadow_azimuth, ee.Number(CLD_PRJ_DIST).multiply(10))
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
        
        var cld_proj = null;
        
      }
      

      return img.addBands(ee.Image([dark_pixels, shadows]))
      
    }
  
     
     
     // Assemble the final cloud-shadow mask (this function needs to be here cause it needs DILATE_CLOUD and BUFFER)
    function add_cld_shdw_mask(img){
      
      var img_cloud = add_cloud_bands(img)
      
      var img_cloud_shadow = add_shadow_bands(img_cloud)
      
      // Set cloud and shadow as value 1
      var is_cld_shdw = img_cloud_shadow.select('clouds').add(img_cloud_shadow.select('shadows')).gt(0)
      
      
      if(DILATE_CLOUD === true){
        
        // Remove small cloud-shadow patches and dilate remaining pixels by BUFFER input.
        // 20 m scale is for speed, and assumes clouds don't require 10 m precision.
        is_cld_shdw = is_cld_shdw.focal_min(2).focal_max(ee.Number(BUFFER).multiply(2).divide(20))
            .reproject({'crs': img.select([0]).projection(), 'scale': 20})
            .rename('cloudmask')
    
      } else {
        
        is_cld_shdw = is_cld_shdw.rename('cloudmask')
        
      }
           
      // return img_cloud_shadow.addBands(is_cld_shdw)
      return img.addBands(is_cld_shdw) // if only the final cloud/cloud shadow mask along with the original image bands
      
    }
       
     
     
     // Function to apply the cloud mask to each image in the collection
    function apply_cld_shdw_mask(img){
      // Subset the cloudmask band and invert it so clouds/shadow are 0, else 1.
      var not_cld_shdw = img.select('cloudmask').not()
    
      // Subset reflectance bands and update their masks, return the result.
      return img.select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12'], ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'])                       // select only some bands, and rename
             .updateMask(not_cld_shdw)
             
    } 
    
    
     
   //////////////////////////// ** END OF IF SENTINEL-2 ** ///////////////////////////  
   
  
   
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
 } else {           // else Landsat
   
   
   
    var raw_collection = getLandsatData({
      startDate: filledStartDate, 
      endDate: filledEndDate,
      applyFmask: false,
      sceneMaxCloud: sceneMaxCloud
    })
   
   

   if(uiCloudShadowMask.getValue() === "Fmask (default)"){
     
      var collection = getLandsatData({
        startDate: filledStartDate, 
        endDate: filledEndDate,
        applyFmask: true,
        sceneMaxCloud: sceneMaxCloud
      })
       
   } else if(uiCloudShadowMask.getValue() === "Cloud score + TDOM (experimental)"){
     
     var cloudScoreThresh = ee.Number.parse(uiCloudScoreThresh.getValue())
     var cloudScorePctl = ee.Number.parse(uiCloudScorePctl.getValue())
     var zScoreThresh = ee.Number.parse(uiZScoreThresh.getValue())
     var shadowSumThresh = ee.Number.parse(uiShadowSumThresh.getValue())
     var contractPixels = ee.Number.parse(uiContractPixels.getValue())
     var dilatePixels = ee.Number.parse(uiDilatePixels.getValue())
     
     
     var collection = getLandsatData({
        startDate: filledStartDate, 
        endDate: filledEndDate,
        applyFmask: false,
        sceneMaxCloud: sceneMaxCloud
      })
     
     
     collection = applyCloudScoreAlgorithm(collection,landsatCloudScore,cloudScoreThresh,cloudScorePctl,contractPixels,dilatePixels,false); 

     collection = simpleTDOM2(collection,zScoreThresh,shadowSumThresh,contractPixels,dilatePixels);

   } else if(uiCloudShadowMask.getValue() === "Not applied") {
     
      var collection = getLandsatData({
        startDate: filledStartDate, 
        endDate: filledEndDate,
        applyFmask: false,
        sceneMaxCloud: sceneMaxCloud
      })
     
   }
   
   
  // print("collection", collection)    // !!! debug
  
  
   // Whether use all sensors or only one select sensor?
   
   if(uiSensor.getValue() == "All Landsat (default)"){
     collection = collection
   } else if(uiSensor.getValue() == "L5 (TM)"){
     collection = collection.filterMetadata("SATELLITE", "equals", "LANDSAT_5") 
   } else if(uiSensor.getValue() == "L7 (ETM+)"){
     collection = collection.filterMetadata("SATELLITE", "equals", "LANDSAT_7") 
   } else if(uiSensor.getValue() == "L8 (OLI)"){
     collection = collection.filterMetadata("SATELLITE", "equals", "LANDSAT_8") 
   }

   
   
 }

  
  print("collection", collection)
  
  var with_ndvi =  collection.map(addNdvi) 

  var median_comp_raw = raw_collection.median()

  
  var median_comp = with_ndvi.median()
  var greenest_comp = with_ndvi.qualityMosaic('ndvi');
  

  // Add percentiles composite
  

  var percentile = ee.List([ee.Number.parse(uiPercentile.getValue())])
  
  var percentile_comp = with_ndvi.reduce(ee.Reducer.percentile(percentile))
                        .rename(greenest_comp.bandNames())
  
  
  // Medoid
  
  var medoid_comp = medoidMosaicMSD(with_ndvi, ['green','red','nir','swir1','swir2'])
  // print("medoid_comp", medoid_comp)
  
  
  ///////////////// Add composite image to map /////////////////

  

  map1.layers().set(0, ui.Map.Layer(median_comp, RGB_VIS, 'Median composite (RGB)', uiShowMedianComp.getValue()));   
  map1.layers().set(1, ui.Map.Layer(median_comp, FCC_VIS, 'Median composite (FCC)', false));   
  map1.layers().set(2, ui.Map.Layer(percentile_comp, RGB_VIS, 'Percentile composite (RGB)', uiShowPercentileComp.getValue()));
  map1.layers().set(3, ui.Map.Layer(percentile_comp, FCC_VIS, 'Percentile composite (FCC)', false));
  map1.layers().set(4, ui.Map.Layer(median_comp_raw, RGB_VIS, 'Median composite (RGB) NO MASKING', false));   // 0

  map2.layers().set(0, ui.Map.Layer(greenest_comp, RGB_VIS, 'Greenest composite (RGB)', uiShowGreenestComp.getValue()));
  map2.layers().set(1, ui.Map.Layer(greenest_comp, FCC_VIS, 'Greenest composite (FCC)', false));
  map2.layers().set(2, ui.Map.Layer(medoid_comp, RGB_VIS, 'Medoid composite (RGB)', uiShowMedoidComp.getValue()));
  map2.layers().set(3, ui.Map.Layer(medoid_comp, FCC_VIS, 'Medoid composite (FCC)', false));


  /////////////////////////////////////////////////////////////////////////////
  // Return info to share with others
  /////////////////////////////////////////////////////////////////////////////
  
   // a) Observed area bounding box
   var bound = map1.getBounds(true)
   var ll = ee.List(ee.List(ee.Dictionary(bound).get('coordinates')).get(0)).get(1)
   var ur = ee.List(ee.List(ee.Dictionary(bound).get('coordinates')).get(0)).get(3)

   uiLL.setValue('LL: ' + ll.getInfo())
   uiUR.setValue('UR: ' + ur.getInfo())

   
   
}




////////////////// FUNCTIONS FOR THE APP /////////////////////////////////////

var getLandsatData = function(params) {          
  var defaultParams = {
    region: map1.getBounds(true),
  }
  
  params = mergeObjects([defaultParams, params])
  
  
  var collection4 = ee.ImageCollection('LANDSAT/LT04/C01/T1_SR')
      .filterBounds(params.region)
      .filterDate(params.startDate, params.endDate)
      .filterMetadata("CLOUD_COVER", "less_than", params.sceneMaxCloud)
      
      
  var collection5 = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
      .filterBounds(params.region)
       .filterDate(params.startDate, params.endDate)
       .filterMetadata("CLOUD_COVER", "less_than", params.sceneMaxCloud)
       
       
  var collection7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
      .filterBounds(params.region)
      .filterDate(params.startDate, params.endDate)
      .filterMetadata("CLOUD_COVER", "less_than", params.sceneMaxCloud)
      
      
      
  var collection8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
      .filterBounds(params.region)
      .filterDate(params.startDate, params.endDate)
      .filterMetadata("CLOUD_COVER", "less_than", params.sceneMaxCloud)
      

  if(params.applyFmask){
    
    var col4NoClouds = collection4.map(cloudMaskingL457)           
    var col5NoClouds = collection5.map(cloudMaskingL457)
    var col7NoClouds = collection7.map(cloudMaskingL457)
    var col8NoClouds = collection8.map(cloudMaskingL8) 
    
  } else {
    
    var col4NoClouds = collection4.select(['B1','B2','B3','B4','B5','B7','B6'],
                  ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'temp'])         
    var col5NoClouds = collection5.select(['B1','B2','B3','B4','B5','B7','B6'],
                  ['blue', 'green', 'red', 'nir', 'swir1', 'swir2','temp'])
    var col7NoClouds = collection7.select(['B1','B2','B3','B4','B5','B7','B6'],
                  ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'temp'])
    var col8NoClouds = collection8.select(['B2', 'B3','B4','B5','B6','B7','B10'],
                  ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'temp'])
     
  }    
            
  // Checkbox to select which sensors


  var colNoClouds = col4NoClouds
                      .merge(col5NoClouds)
                      .merge(col7NoClouds)
                      .merge(col8NoClouds)

  return colNoClouds                                                              // HH adds
  
}  



function addNdvi(img) {
  var ndvi = img.expression(
    '(nir-red)/(nir+red)', 
    {nir: img.select('nir'), red: img.select('red')}
    ).rename('ndvi').multiply(10000).int16();
  
  return img.addBands(ndvi);
}


function mergeObjects(objects) {
  return objects.reduce(function (acc, o) {
    for (var a in o) { acc[a] = o[a] }
    return acc
    }, {})
}



// Function to mask out cloud and cloud's shadow in a Landsat image
function cloudMaskingL457(image) {
  
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = ee.Number(2).pow(3).int();
  var cloudsBitMask = ee.Number(2).pow(5).int();
  
  var qa = image.select('pixel_qa');
  
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0).and(
            qa.bitwiseAnd(cloudsBitMask).eq(0));

  return image.updateMask(mask)
          .select(['B1','B2','B3','B4','B5','B7','B6'],
                  ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'temp'])
                  .copyProperties(image, image.propertyNames());
};



function cloudMaskingL8(image) {
  
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = ee.Number(2).pow(3).int();
  var cloudsBitMask = ee.Number(2).pow(5).int();
  
  var qa = image.select('pixel_qa');
  
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0).and(
            qa.bitwiseAnd(cloudsBitMask).eq(0));

  return image.updateMask(mask)
          .select(['B2', 'B3','B4','B5','B6','B7','B10'],
                  ['blue', 'green', 'red', 'nir', 'swir1', 'swir2', 'temp'])
                  .copyProperties(image, image.propertyNames());
};





////////////////////////////////////////////////////////////////////////////////
// Function for computing the mean squared difference medoid from an image 
// collection
// Source: https://code.earthengine.google.com/?scriptPath=users%2FUSFS_GTAC%2Fmodules%3AgetImagesLib.js

function medoidMosaicMSD(inCollection, medoidIncludeBands) {
  // Find band names in first image
  var f = ee.Image(inCollection.first());
  var bandNames = f.bandNames();
  //var bandNumbers = ee.List.sequence(1,bandNames.length());
  
  if (medoidIncludeBands === undefined || medoidIncludeBands === null) {
    medoidIncludeBands = bandNames;
  }
  // Find the median
  var median = inCollection.select(medoidIncludeBands).median();
  
  // Find the squared difference from the median for each image
  var medoid = inCollection.map(function(img){
    var diff = ee.Image(img).select(medoidIncludeBands).subtract(median)
      .pow(ee.Image.constant(2));
    img = addYearBand(img);
    img = addJulianDayBand(img);
    return diff.reduce('sum').addBands(img);
  });
  // When exported as CSV, this provides a weighted list of the scenes being included in the composite
  // Map.addLayer(medoid,{},'Medoid Image Collection Scenes') 
  
  bandNames = bandNames.cat(['year','julianDay']);
  var bandNumbers = ee.List.sequence(1, bandNames.length());
  // Minimize the distance across all bands
  medoid = ee.ImageCollection(medoid)
    .reduce(ee.Reducer.min(bandNames.length().add(1)))
    .select(bandNumbers,bandNames);
  
  return medoid;
}


function addYearBand(img){
  var d = ee.Date(img.get('system:time_start'));
  var y = d.get('year');
  
  var db = ee.Image.constant(y).rename(['year']).float();
  db = db;//.updateMask(img.select([0]).mask())
  return img.addBands(db).float();
}


function addJulianDayBand(img){
  var d = ee.Date(img.get('system:time_start'));
  var julian = ee.Image(ee.Number(d.getRelative('day','year')).add(1)).rename(['julianDay']);

  return img.addBands(julian).float();
}




//////////////////////////////////////////////////////////
// The follows are a set of functions to do cloud and shadow masking with cloudScore and TDOM
// Source: https://code.earthengine.google.com/?scriptPath=users%2FUSFS_GTAC%2Fmodules%3AgetImagesLib.js
/////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// Compute a cloud score and adds a band that represents the cloud mask.  
// This expects the input image to have the common band names: 
// ["red", "blue", etc], so it can work across sensors.
function landsatCloudScore(img) {
  // Compute several indicators of cloudiness and take the minimum of them.
  var score = ee.Image(1.0);
  // Clouds are reasonably bright in the blue band.
  score = score.min(rescale(img, 'img.blue', [0.1, 0.3]));
 
  // Clouds are reasonably bright in all visible bands.
  score = score.min(rescale(img, 'img.red + img.green + img.blue', [0.2, 0.8]));
   
  // Clouds are reasonably bright in all infrared bands.
  score = score.min(
    rescale(img, 'img.nir + img.swir1 + img.swir2', [0.3, 0.8]));

  // Clouds are reasonably cool in temperature.
  score = score.min(rescale(img,'img.temp', [300, 290]));    // Need temperature band

  // However, clouds are not snow.
  var ndsi = img.normalizedDifference(['green', 'swir1']);
  score = score.min(rescale(ndsi, 'img', [0.8, 0.6]));
  
 
  score = score.multiply(100).byte();
  score = score.clamp(0,100);
  return score;
}



////////////////////////////////////////////////////////////////////////////////
//Wrapper for applying cloudScore function

function applyCloudScoreAlgorithm(collection,cloudScoreFunction,cloudScoreThresh,cloudScorePctl,contractPixels,dilatePixels,performCloudScoreOffset){
  if(performCloudScoreOffset === undefined || performCloudScoreOffset === null){performCloudScoreOffset = true}
  
  // Add cloudScore
  var collection = collection.map(function(img){
    var cs = cloudScoreFunction(img).rename(['cloudScore']);
    return img.addBands(cs);
  });
  
  if(performCloudScoreOffset){
    // print('Computing cloudScore offset');
    // Find low cloud score pctl for each pixel to avoid comission errors
    var minCloudScore = collection.select(['cloudScore'])
      .reduce(ee.Reducer.percentile([cloudScorePctl]));
    // Map.addLayer(minCloudScore,{'min':0,'max':30},'minCloudScore',false);
  }else{
    // print('Not computing cloudScore offset');
    var minCloudScore = ee.Image(0).rename(['cloudScore']);
  }
  
  // Apply cloudScore
  var collection = collection.map(function(img){
    var cloudMask = img.select(['cloudScore']).subtract(minCloudScore)
      .lt(cloudScoreThresh)
      .focal_max(contractPixels).focal_min(dilatePixels).rename('cloudMask');
    return img.updateMask(cloudMask);
  });
  
  return collection;
}





////////////////////////////////////////////////////////////////////////////////
// Function for finding dark outliers in time series.
// Original concept written by Carson Stam and adapted by Ian Housman.
// Adds a band that is a mask of pixels that are dark, and dark outliers.
function simpleTDOM2(collection,zScoreThresh,shadowSumThresh,contractPixels,
  dilatePixels,shadowSumBands,irMean,irStdDev){
  if(zScoreThresh === undefined || zScoreThresh === null){zScoreThresh = -1}
  if(shadowSumThresh === undefined || shadowSumThresh === null){shadowSumThresh = 0.35}
  if(contractPixels === undefined || contractPixels === null){contractPixels = 1.5}
  if(dilatePixels === undefined || dilatePixels === null){dilatePixels = 3.5}
  if(shadowSumBands === null || shadowSumBands === undefined){
    shadowSumBands = ['nir','swir1'];
  }
  
  
  // Get some pixel-wise stats for the time series
  if(irMean === null || irMean === undefined){
    // print('Computing irMean for TDOM');
    irMean = collection.select(shadowSumBands).mean();
  }
  if(irStdDev === null || irStdDev === undefined){
    // print('Computing irStdDev for TDOM');
    irStdDev = collection.select(shadowSumBands).reduce(ee.Reducer.stdDev());
  }
  
  // Mask out dark dark outliers
  collection = collection.map(function(img){
    var zScore = img.select(shadowSumBands).subtract(irMean).divide(irStdDev);
    var irSum = img.select(shadowSumBands).reduce(ee.Reducer.sum());
    var TDOMMask = zScore.lt(zScoreThresh).reduce(ee.Reducer.sum()).eq(shadowSumBands.length)
      .and(irSum.lt(shadowSumThresh));
    TDOMMask = TDOMMask.focal_min(contractPixels).focal_max(dilatePixels);
    return img.updateMask(TDOMMask.not());
  });
  
  return collection;
}






////////////////////////////////////////////////////////////////////////////////
// Helper function to apply an expression and linearly rescale the output.
// Used in the landsatCloudScore function below.
function rescale(img, exp, thresholds) {
  return img.expression(exp, {img: img})
    .subtract(thresholds[0]).divide(thresholds[1] - thresholds[0]);
}







//****************************************************************************************
////////////////////////////////////////////////////////////////////////////////
// Get Sentinel-2 data


function getSentinel2Data(params){
  
  var defaultParams = {
    region: map1.getBounds(true),
    // startDate: '2018-01-01',
    // endDate: '2018-12-31',
  }
  
  
  params = mergeObjects([defaultParams, params])


   // Import and filter S2 SR. Now also implement if TOA.
  if(params.procLevel === "SR") {
    
     var s2_col = ee.ImageCollection('COPERNICUS/S2_SR')  // TOA collection 'COPERNICUS/S2' doesn't come with 'SCL' band to get water, so in this case need to rely on external water mask
                  .filterBounds(params.region)
                  .filterDate(params.startDate, params.endDate)
                  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', params.sceneMaxCloud))
    
  } else if(params.procLevel === "TOA") {
    
     var s2_col = ee.ImageCollection('COPERNICUS/S2')  // TOA collection 'COPERNICUS/S2' doesn't come with 'SCL' band to get water, so in this case need to rely on external water mask
              .filterBounds(params.region)
              .filterDate(params.startDate, params.endDate)
              .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', params.sceneMaxCloud))
    
  }
              
                   
  // Import and filter s2cloudless.
  var s2_cloudless_col = ee.ImageCollection('COPERNICUS/S2_CLOUD_PROBABILITY')
                         .filterBounds(params.region)
                         .filterDate(params.startDate, params.endDate)
  
  
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

