/////////////////////////////////////////////////////////////////////
///// Note this script has not been cleaned completely ////////////////////////////////////
////////////////////////////////////////////////////////////////////


/*///////////////////////////////////////////////////////////////
GLOBAL VARIABLES
*//////////////////////////////////////////////////////////////


var params = {
    numTrees: 100,                                             
    seed: 1234,                                    
    outScale: 30,                                    // 100
  };
  
  
  var CLASSIFIEDLYRNUM = 4; 
  var COVNAMESSEL = [];
  
  
  
  var config = {
      reprojectClassifiedDisplay: false
  };
  
  
  
  /*///////////////////////////////////////////////////////////////
  IMPORT MODULES
  *///////new///////////////////////////////////////////////////////
  var utils = require('users/hadicu06/IIASA:utils');  // This is sandbox
  var palettes = require('users/gena/packages:palettes');
  
  // Function to add legend
  // Adapted from https://code.earthengine.google.com/?accept_repo=users/smokepolicytool/public by author Tianjia Liu
  var discreteLegendMap = function(title, subtitle, labels, colPal) {
    var discreteLegendPanel = ui.Panel({
      style: {
        padding: '0 9px 2px 9px',
        position: 'bottom-left'
      }
    });
     
    var legendTitle = ui.Label(title, {fontWeight: 'bold', fontSize: '18.5px', margin: '6px 0 4px 0'});
    discreteLegendPanel.add(legendTitle);
    discreteLegendPanel.add(ui.Label(subtitle,{margin: '-6px 0 6px 8px'}));
  
    
    var makeRow = function(colPal, labels) {
      var colorBox = ui.Label({
        style: {
          backgroundColor: colPal,
          padding: '8px',
          margin: '0 0 6px 0',
          fontSize: '14px',
        }
      });
  
      var description = ui.Label({value: labels, style: {margin: '0 0 4px 6px', fontSize: '13.5px'}});
      return ui.Panel({widgets: [colorBox, description], layout: ui.Panel.Layout.Flow('horizontal')});
    };
    
    for (var i = 0; i < labels.length; i++) {
      discreteLegendPanel.add(makeRow(colPal[i], labels[i]));
    }
    return discreteLegendPanel;
  };
  
  
  /*///////////////////////////////////////////////////////////////
  ADMINISTRATIVE MAP
  *//////////////////////////////////////////////////////////////
  
  // Classification regions
  
  var IndoRegions = ee.FeatureCollection("users/hadicu06/IIASA/RESTORE/vector_datasets/classification_regions")
  
  
  
  
  /*///////////////////////////////////////////////////////////////
  COVARIATES
  *//////////////////////////////////////////////////////////////
  
  
  // Year invariant
  
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
  
  
  ////////////////////////////////////////////////
  // Landsat 
  ////////////////////////////////////////////////
  
  
  var landsat_2018_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/ls_composite_2018_byRegion").mosaic()
  
  landsat_2018_mosaic = landsat_2018_mosaic.select(landsat_2018_mosaic.bandNames().removeAll(['red_count']))
  
  
  
  
  ////////////////////////////////////////////////
  // ALOS PALSAR
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
  // ALOS PALSAR: texture
  ////////////////////////////////////////////////
  
  var palsar_texture_2017 = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/palsar_composite_2017_texture_country")
  
  
  
  
  ////////////////////////////////////////////////
  // Sentinel-1: two season composite *
  ////////////////////////////////////////////////
  
  var S1_season_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/s1_rainy_dry_composites_2018_byRegion").mosaic()
  
  
  // Add ratio band = VV/VH
  S1_season_mosaic = S1_season_mosaic.addBands( 
    S1_season_mosaic.select('VV_median_dry').divide(S1_season_mosaic.select('VH_median_dry')).rename('VV_div_VH_median_dry'))   // // ratio band .multiply(1000).toUint16() needed?
  
  
  
  
  ////////////////////////////////////////////////
  // Sentinel-1: annual composite *
  ////////////////////////////////////////////////
  
  var S1_annual_mosaic = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/s1_annual_composite_2018_byRegion").mosaic()
  
  
  
  
  ////////////////////////////////////////////////
  // Sentinel-1: texture *
  ////////////////////////////////////////////////
  
  var S1_texture = ee.Image("users/hadicu06/IIASA/RESTORE/covariates_images/s1_composite_2018_texture_country")
  
  
  
  ////////////////////////////////////////////////
  // NEW: Sentinel-1 ARD *
  ////////////////////////////////////////////////
  
  var S1_ard = ee.ImageCollection("users/hadicu06/IIASA/RESTORE/covariates_images/s1_extraProc_dry_composites_2018_byRegion").mosaic()
               .select(['VV_median', 'VH_median'], ['VV_median_ard', 'VH_median_ard'])
  
  
  
  
  ////////////////////////////////////////////////
  // NEW: Sentinel-2 *
  ////////////////////////////////////////////////
  var S2_javaBali = ee.Image("projects/ee-hadicu06/assets/s2_2018_10m_toa_median_s2cloudless_JRCwater_javabali")
  var S2_southSum = ee.Image("projects/ee-hadicu06/assets/s2_2018_10m_toa_median_s2cloudless_JRCwater_SouthSum")
  
  var S2_javaBali_southSum = ee.ImageCollection.fromImages([S2_javaBali, S2_southSum]).mosaic()
  
  S2_javaBali_southSum = S2_javaBali_southSum.select(
    ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12'],
    [ 's2_blue_javabali_southsum', 
      's2_green_javabali_southsum', 
      's2_red_javabali_southsum', 
      's2_rededge1_javabali_southsum', 
      's2_rededge2_javabali_southsum', 
      's2_rededge3_javabali_southsum', 
      's2_nir_javabali_southsum', 
      's2_rededge4_javabali_southsum', 
      's2_swir1_javabali_southsum', 
      's2_swir2_javabali_southsum', 
    ])
  
  
  
  
  ////////////////////////////////////////////////
  // NEW: Landsat 3-year composite *
  ////////////////////////////////////////////////
  // var landsat_2018_3y_javaBali = ee.Image("projects/ee-hadicu06/assets/L87_2018_plusMin1Year_w151_composite_indices_30m_manyReducers_topoCor_brdfCor/jawabali")
  
  
  // landsat_2018_3y_javaBali = landsat_2018_3y_javaBali.select(landsat_2018_3y_javaBali.bandNames().removeAll(['red_count']))
  
  
  
  
  ////////////////////////////////////////////////
  // Stack the covariates
  ////////////////////////////////////////////////
  var covariates_2018 = ee.Image.cat(
                  landsat_2018_mosaic, 
                  palsar_2017,
                  palsar_texture_2017,
                  S1_season_mosaic,
                  S1_annual_mosaic,
                  S1_texture,
                  nationalElev, nationalSlope, nationalAspect,
                  distToRoad, distToRiver, distToSettlement,
                  distToFbSettlement,            // New
                  distToAllRoadRBIandOSM,       // NEW
                  distToCoast,                   // NEW
                  S1_ard,                        
                  S2_javaBali_southSum
                  )
  
  
  
                  
  
  
  /*///////////////////////////////////////////////////////////////
  INITIALIZE UI PANELS
  *//////////////////////////////////////////////////////////////
  
  //////////////////////////////////////////
  
  function makeEmptyLegend(){
    var emptyLegend = discreteLegendMap('Land cover class', "",   
      "",   
      "")
    return emptyLegend;
  }
  
  
  
  
  ////////////////////////////////////////////////
  
  function makeLoadingPanel() {
    var label = new ui.Label('');
    var loadingPanel = new ui.Panel([label]);
    loadingPanel.style().set({
         position: 'top-left',
         margin: '0 0 0 0', padding: '0px',
         fontSize: '24px'
    })
    //Map.add(loadingPanel);
    loadingPanel.setLayout(ui.Panel.Layout.flow('horizontal'));
    
    return loadingPanel;
  }
  
  
  
  /////////////////////////////////////////////////////
  function makeUiKeepClassified(){
    var uiKeepClassified = ui.Checkbox({
      label: 'Keep last classified image', 
      value: false, 
      onChange: function(value) {
        var selKeepClassified = value;
      }, 
      style: {
        width: '200px', position: 'bottom-left'
        //margin: '0px', padding: '0px'
      }
    })
    
    return uiKeepClassified;
  
  }
  
  
  
  
  ///////////////////////////////////////////////////////////////////////
  //////////////////// COVARIATE SELECTOR /////////////////////////////
  
  
  
  var covNames = covariates_2018.bandNames()
  
  var covNamesInfo = covNames.getInfo()
  
  COVNAMESSEL.push(covNamesInfo)                                 //*** ALL PREDICTORS BY DEFAULT
  
  
  function makeUiClassNames(){
    var uiClassNames = ui.Textbox({
      value: 'class0;class1',
      onChange: function(text) {
        var filledClassNames = text
      },
      style: {
        'position': 'top-left',
        'width': '200px'
      }
    })
    return uiClassNames;
  }
  
  function makeUiUserName(){
    var uiUserName = ui.Textbox({
      placeholder: 'John Doe', 
      value: 'John Doe', 
      onChange: function(value){
        var userName = value;
      }, 
      style: {position: 'top-left'}
    })
    return uiUserName;
  }
  
  
  
  /////////////////////////////////////////////////
  // Loading textbox for button "Load previous data"
  
  
  // var loadingLoadPrevData = ui.Panel()
  
  
  /////////////////////////////////////////////////
  
  function makeConfigPanel(uiClassNames, map, uiUserName, runButton, drawingTools) {
    
    /////////////////////////////////////////////////////////
    // Covariates selector
    var uiCheckboxCovNames = ui.Panel()
  
    for (var i = 0; i < covNamesInfo.length; i++){
        var covName_i = covNamesInfo[i];
        
        var checkbox_covName_i = ui.Checkbox({
          label: covName_i, 
          value: true
        });
        
        uiCheckboxCovNames.add(checkbox_covName_i);
    }
    
    
    var covSelButton = ui.Button({
      label: 'Use selected predictors',
      onClick: covSelButtonFun
    })
    
    
    function covSelButtonFun() {
        
        covSelButton.setLabel('loading...')
        
        var checkboxWidgets = uiCheckboxCovNames.widgets();
        
         var checkboxCovName = ee.List(checkboxWidgets.map(function(i) {
          return i.get('label')
        })).getInfo()
        
    
        
        var checkboxCovUse = ee.List(checkboxWidgets.map(function(i) {
          return i.get('value')
        })).getInfo()
        
        
       
        // Make a fake feature collection
        var checkboxCovFC = []
        
        for (var i = 0; i < checkboxCovName.length; i++) {
          var fc_i = ee.Feature(null, {'name': checkboxCovName[i], 'use': checkboxCovUse[i]})
          checkboxCovFC.push(fc_i)
        }
       
        checkboxCovFC = ee.FeatureCollection(checkboxCovFC)
    
        var covNamesSel = checkboxCovFC.filter(ee.Filter.eq('use', true))
                   .toList(100)
                   .map(function(i) {
                     return ee.Feature(i).get('name')
                   })
                   
        COVNAMESSEL.length = 0
        COVNAMESSEL.push(covNamesSel)  
        
        // Not ideal, but for now just some indication the button's action has done running
        covNamesSel.evaluate(setBackLabel_covSelButton)  
  
       // 20201018 also displays "RUN CLASSIFICATION" button
       runButton.style().set("shown", true)
       
      }
    
    
    
    function setBackLabel_covSelButton (result){
      //print('result', result)
      covSelButton.setLabel('Use selected predictors')
    }
    
    
    
    /////////////////////////////////////////////////////////////////////////
    var uiAddLayerButton = makeUiAddLayerButton(uiClassNames, map);
    
    
    
    /////////////////////////////////////////////////////////////////////
    
    // 20201017   // NOT DONE
    var uiPrevData = ui.Textbox({
      placeholder: 'JSON string',
      style: {
        'position': 'top-left',
        'width': '200px'
      }
    })
      
      
    var uiLoadPrevDataButton = ui.Button({ label: 'Load previous data' })
    
    
    uiLoadPrevDataButton.onClick(function(){
    
          
        var ft = uiPrevData.getValue()
        
        // print("ft", ft)
        
        if (typeof ft === 'undefined') {
          
          // Do nothing
          
        } else {
          
          var myFT = ee.List(ee.Dictionary(ee.String(ft).decodeJSON())
                    .get("features"))
                    .map(function(item){
                      item = ee.Dictionary(item)
                      return ee.Feature(ee.Geometry.MultiPolygon(ee.Dictionary(item.get("geometry")).get("coordinates")), 
                      item.get("properties"))
                    })
          
                            
          var fc = ee.FeatureCollection(ee.List(myFT))
      
          map.centerObject(fc)   // input "map"    // Cannot read property 'centerObject' of undefined
          
          
          // Add to geometry layers
          var class_names = ee.List(fc.distinct('class_name').reduceColumns(ee.Reducer.toList(), ['class_name'])
                            .get('list'))
                            
           
          //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                  
          uiClassNames.setValue(class_names.getInfo().join(";"))                   // ***    
          uiAddLayerButton.setDisabled(true)
          //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%                     
      
          var numLayers = class_names.size().getInfo()
      
          for (var i = 0; i <= numLayers-1; i++){
      
            var layerName = class_names.get(i).getInfo()
            
            var class_fc = ee.FeatureCollection(fc.filter(ee.Filter.eq('class_name', layerName)))
      
            var class_geometry = class_fc.geometry()
      
            var class_geometries = class_geometry.geometries()
      
            map.drawingTools().addLayer(class_geometries.getInfo(), layerName)  // input "drawingTools"
            
          }
          
        }
      })
      
      
  
  
      /////////////////////////////////////////////////////////////////////////
      // Combine panels
    var configPanel = ui.Panel({
                     widgets: [
                        ui.Label('Hi, this is an app to run quick experiments on automated land cover classification, in an interactive mode by digitizing training areas on screen. The following are the steps to use the app:', {fontWeight: 'bold'}), 
                        ui.Label('1) Fill your user name.'),
                        uiUserName,
                        ui.Label('2) If you wish to upload previously collected data in this tool, fill below with the JSON string, click the button "Load previous data", and skip step 3.'),
                        
                        // 20201017
                        uiPrevData,
                        uiLoadPrevDataButton,   // NOT DONE
                        
                        // loadingLoadPrevData,
                        
                        
                        ui.Label('3) Specify the names of land cover classes of interest (separated by semicolon). For example "Rubber monoculture", "Agroforestry", "Plantation forest", "Shrub" etc. Then, click the button "Create geometry layers". The "geometry layers" for the specified classes will appear in the "Geometry Imports" at the upper left corner of the map window.'),
                        uiClassNames,
                        uiAddLayerButton,
                        ui.Label('4) Create training areas for the specified classes i.e. for each of the "geometry layer". To do that, click a class (i.e. a "geometry layer") for which the training areas will be made, click (!) the polygon icon ("Draw a shape") on the right of the "hand" (pan) icon, and then digitize the training polygons on the screen, for that class. Repeat this step for other classes (i.e. other geometry layers).'),
                        ui.Label('5) Select/de-select the input predictors to the supervised classification (Random Forest). Click "Use selected predictors".'),
                        uiCheckboxCovNames,
                        covSelButton,
                        ui.Label('6) Position the map window to the geographical area where the classification is to be run. Finally, click "RUN CLASSIFICATION" at the bottom-center of the map window.'),
                        ui.Label('7) To save the training areas, click "Download training data" on the map window. To share the training data, login to your gmail account, upload the downloaded training data to the shared google drive. Fill the corresponding informaton in the shared google spreadsheet.'),
                        ui.Label('drive').setUrl('https://drive.google.com/drive/u/0/folders/1SbXC_HzEiaHDmZ7-f1olxn5QGn4xP1Lj'),
                        ui.Label('spreadsheet').setUrl('https://docs.google.com/spreadsheets/d/190N-rsBZHNINAvQ8NM6zkqUQc69KqJY5VBWwg0zzS_c/edit#gid=0'),
                        ui.Label('Thank you for your contributions, data from all contributors can be accessed in the shared google drive.', {fontWeight: 'bold'})
                        // ui.Label('For questions and feedbacks, please contact Hadi at hadi@iiasa.ac.at / Olga at danylo@iiasa.ac.at.')
                       ],
                    layout: ui.Panel.Layout.flow('vertical'),  // horizontal
                    style: {width: '30'}   
    });
    
    return configPanel;
      
  }
  
  
  
  //ui.root.add(uiSelectCovariates)
  
  
  
  
  // Toggle show/hide (based on Olha Danylo's script)
  
  // heynow
  
  // Functions for toggle
  function makeToggleUi (mypanel, mypos, mylabel, mywidth) {
    var hide_panel = {
      position: mypos,
      shown: false
    };
  
    var show_panel = {
                 position: mypos,
                 width: mywidth,
                 //height: '200px',
                 shown: true
    };
    
    
    
    var toggleCheckbox = ui.Checkbox({
      label: mylabel,
      style: {fontWeight: 'bold', position: mypos},                                ///
      value: false,
      onChange: function(value) {
         if (value) 
         {
          mypanel.style().set(hide_panel)
         }
         else 
         {
          mypanel.style().set(show_panel)
         }
      }});
      
      return toggleCheckbox;
  }
  
  
  
  
  
  
  
  
  
  
  ////////////////////////////////////////////////////////////////////
  // Generate named geometry layers automatically based on class names input by users (by Olha Danylo)
  
  function makeUiAddLayerButton(uiClassNames, map) {
    var addLayerButton = ui.Button({
    label: "Create geometry layers",
    onClick: function(){
      var class_names = uiClassNames.getValue()
      class_names = ee.List(class_names.split(';')).getInfo()
      class_names.map(function(layerName){
        var layer = ui.Map.GeometryLayer({name: layerName})
        map.drawingTools().addLayer([], layerName)
      })
    }
    })
    return addLayerButton;
  }
  
  
  
  
  
  /*///////////////////////////////////////////////////////////////
  FUNCTION TO INITIALIZE THE APP
  *//////////////////////////////////////////////////////////////
  
  
  function init() {
    
    var uiUserName = makeUiUserName()
    var uiClassNames = makeUiClassNames()
    var emptyLegend = makeEmptyLegend()
    var runButton = makeRunButton()
    var loadingPanel = makeLoadingPanel()
    var uiKeepClassified = makeUiKeepClassified()
    
    var map = ui.Map()
    map.setCenter(114.17966656306427,-1.3611500370441083, 5)
    map.setOptions('SATELLITE')
    map.drawingTools().setShown(true)
    var drawingTools = map.drawingTools();   // Map
    drawingTools.setDrawModes(['polygon']);                                      //**** CONSIDER JUST ALLOWING DRAWING MODE "POLYGON"
  
    
    var configPanel = makeConfigPanel(uiClassNames, map, uiUserName, runButton, drawingTools)
    
  
    
    emptyLegend.style().set('shown', false)
    runButton.style().set('shown', false)                         // *** 20201018
    loadingPanel.style().set('shown', false)
    uiKeepClassified.style().set('shown', false)
   
    
    map.add(emptyLegend)
    map.add(runButton)
    map.add(loadingPanel);
    map.add(uiKeepClassified);
  
  
     var initUiDownloadLink = ui.Panel();
    initUiDownloadLink.style().set({shown: false, position: 'top-left', padding: '0px', margin: '0px'})
    map.add(initUiDownloadLink)
  
  
  
    /////////////////////////////
    // Placeholder for variable importance chart
    var varImpChartPanel = ui.Panel({
          style: {position: 'bottom-right', width: '500px', shown: false, margin: '0 0 0 0', padding: '0px'}  // shown: true
        });
          
    //varImpChartPanel.add(ui.Label("Kepentingan prediktor", {fontWeight: 'bold', fontSize: '14px', margin: '0 0 0 0'}));
    map.add(varImpChartPanel)
    
    
    
    ///////////////////////////////
    // Toggle to hide/show variable importance chart
    //makeToggleUi (mypanel, mypos, mylabel, mywidth) 
    
    var hideChartUi = makeToggleUi(varImpChartPanel, 'bottom-right', 'Hide graph', '500px')
    hideChartUi.style().set('shown', false)
    map.add(hideChartUi)
    
    
    
  
    
    ////////////////////////////
    // Add placeholder to print bounding box of classified area(s)
  
    var uiLLUR = ui.Label()
    var uiBoundBox = ui.Panel().add(uiLLUR)
    uiBoundBox.style().set({shown: false, position: 'top-right', padding: '0px', margin: '0px'})
    map.add(uiBoundBox)
    
    //print('map.widgets()', map.widgets())
    
    map.addLayer(covariates_2018, {min:0, max:1500, bands: ['red_median', 'green_median', 'blue_median']}, 'Landsat true colour (2018 composite)')
    map.addLayer(covariates_2018, {min:[0,0,0], max:[3000,6000,1500], bands: ['swir1_median', 'nir_median', 'red_median']}, 'Landsat false colour (2018 composite)')
    
    // Add Sentinel-1 mosaic
    var bands = ['VV_median_dry', 'VH_median_dry', 'VV_div_VH_median_dry']
    var minVV = -1200
    var maxVV = -500
    var minVH = -1800
    var maxVH = -1100
    var minRatio = 0.5
    var maxRatio = 0.7
    map.addLayer(S1_season_mosaic, {bands:bands, min:[minVV, minVH, minRatio], max:[maxVV, maxVH, maxRatio]}, 'Sentinel-1 VV;VH;VV/VH (2018)')
  
  
    ///////////////////////////////////////////////////
    // Initialize root
    ui.root.clear()
  
    var splitPanel = ui.SplitPanel({
      firstPanel: configPanel, 
      secondPanel: map
    })
    
    ui.root.add(splitPanel)
  
  
    /////////////////// Make button to run classification moved here ////////////////////////
    function makeRunButton(){
    
      var runButton = new ui.Button({
                label:'RUN CLASSIFICATION',
                onClick: function() {
                    classify();
                }
            });
            
      runButton.style().set({
           position: 'bottom-center',
           fontSize: '18.5px', margin: '6px 0 4px 0', // 18.5px
           fontWeight: 'bold',
           width: 100
      });
      
      return runButton;
    }
  
    
    
    
    
    //////////////////// Function to read drawn geometries ////////////////
    // Version for automatically generated geometry layers based on class names (by Olha Danylo)
    function getMergedFC() {
      var numGeomLayers = ee.Number(drawingTools.layers().length()).getInfo()   // evaluate()
      var fc_merged = ee.FeatureCollection(ee.Feature(null, {'dummy': 1, "class_name":0}))
          var result = numGeomLayers;
          for (var i = 0; i <= result-1; i++) {
            var layer = drawingTools.layers().get(i)
            var name = layer.get("name")
            var fc = ee.FeatureCollection(layer.getEeObject()).map(function(ft){
              return ft.set("class_name", name)
            })
            fc_merged = fc_merged.merge(fc)
          }
      fc_merged = fc_merged.filter(ee.Filter.neq('dummy', 1))
      return fc_merged;
    }
  
    
    
    // Update version 20201017. Can't use cause "classes"
    
    // function getMergedFC() {
    //   var layer = drawingTools.toFeatureCollection("class_id")
    //   layer = layer.map(function(ft){
    //     return ft.set("class_name", ee.List(classes).get(ft.get("class_id")))  // ** classes error
    //   })   
    //   return layer
    // }
    
    
    
    
    
    
    ///////////////// Classification function moved here ///////////////////
    function classify() {
      
      
      runButton.setLabel('LOADING...')
      
      var loadingPanel = makeLoadingPanel()
      loadingPanel.style().set('shown', true)
      loadingPanel.clear();
      //loadingPanel.add(ui.Label('Loading...', {color: 'gray'}));
    
    
      // Move function arguments to here
      var trainCovariates = covariates_2018;
      var classifyCovariates = covariates_2018;
      var outScale = params.outScale;                      // globally defined
     
     
     
       ///////////////////////////// Training polygons ////////////////////////////////////
       
       // Merge the geometry layers into a single FeatureCollection.
      var newfc = getMergedFC();         // * THIS IS WHAT LISTENS TO THE CHANGE IN GEOMETRY LAYERS
      //print('newfc', newfc)
      
      //print('fc geom types', newfc.toList(10000).map(function(ft) { return ee.Feature(ft).geometry().type()}))
    
      
      newfc.evaluate(function(result) {
          loadingPanel.clear();
      })
      
      
      //var newfcLyr = ui.Map.Layer(newfc, {}, 'Training polygons')  // temp check
      //map.layers().set(4, newfcLyr)
      
      //map.centerObject(newfc)                                                          //***
      
      ///////////////////////////////////////////////////////////////////
  
      // Clip covariates to mapped area = map view bound
      var geometry = map.getBounds(true)                            // * mapped area = map view bound  //***
     
      //var geomTrainCovariates = trainCovariates.clip(geometry);          //***
      //var geomPredictCovariates = classifyCovariates.clip(geometry);     //***
    
      var geomTrainCovariates = trainCovariates;
      var geomPredictCovariates = classifyCovariates.clip(geometry);
      
      
      // Select covariates
      //print('COVNAMESSEL[0]', COVNAMESSEL[0])
      geomTrainCovariates = geomTrainCovariates.select(COVNAMESSEL[0])
      geomPredictCovariates = geomPredictCovariates.select(COVNAMESSEL[0])
      
        
      
      //*****************************************************************
      // newfc must be points feature collection, so:
      // Option 1) need to generate random points (ee.FeatureCollection.randomPoints) within feature that is a polygon
      // Option 2) take samples from all pixels generated with sampleRegions()
      // Can we check if type of feature is "Polygon"? Yes
      // Option 3) newfc is polygon, so rasterize polygon, then do image.stratifiedSample() <- FOR NOW DO THIS
        //****************************************************************
      
      
      // Get class ids & class names, for map visualization, and legend
      
      
      /*
      var numClass = newfc.aggregate_count_distinct('class_id')
      var class_ids = ee.List.sequence(0, ee.Number(numClass).subtract(1), 1)
      
      var newfc_dist = newfc.distinct(['class_id', 'class_name'])
      var class_names = newfc_dist.select('class_name').toList(30) // a list of string
                        .map(function(ft) { return ee.Feature(ft).get('class_name') })
                        .getInfo()
      */
      
      // ui.Map() drawingTools does not allow to specify property, only geometry, so newfc is 
      // just feature collection without the properties 'class_name' and 'class_id'
     
      var class_names = uiClassNames.getValue()
      class_names = ee.List(class_names.split(';')).getInfo()
      
      var numClass = class_names.length
      
      var class_ids = ee.List.sequence(0, ee.Number(numClass).subtract(1), 1)
  
      //print('class_names', class_names)
      //print('class_ids', class_ids)
    
      // Set attribute 'class_id' to newfc
      
      var newfcWithProp = class_ids.map(function(id){
        return newfc.toList(50).map(function(ft){
          return ee.Feature(ft).set('class_id', id)
        }).get(id)
      }).flatten()  // List of features
      
      newfcWithProp = ee.FeatureCollection(newfcWithProp);
    
      //** Sample points within drawn polygons
      // Drawn feature collection must have attribute 'class_id'
      
      var newfcImage = newfcWithProp.reduceToImage({
        properties: ['class_id'], 
        reducer: ee.Reducer.mode()
      }).rename('class_id').toUint8()
      
      //print('newfcImage', newfcImage);
      //var newfcImageLyr = ui.Map.Layer(newfcImage.randomVisualizer(), {}, 'newfcImage')  // temp check
      //map.layers().set(4, newfcImageLyr)
    
      var newfcSample = newfcImage.stratifiedSample({
        numPoints: 500, 
        region: newfc.geometry(), 
        scale: 30,                                      // 100
        seed: params.seed, 
        geometries: true
      })
      
      //print('newfcSample', newfcSample)
      
      //var newfcSampleLyr = ui.Map.Layer(newfcSample, {}, 'newfcSample') // temp check
      //map.layers().set(4, newfcSampleLyr)
    
      // Sample covariates at the drawn reference samples
      var sampleData = geomTrainCovariates.sampleRegions({
        collection: newfcSample,
        properties: ['class_id'],                  // * Make sure drawn geometries have class property named 'class' !
        scale: outScale
      }).filter(ee.Filter.neq('red_median', null));
      
      //print('sampleData.size()', sampleData.size());               //***** check training samples, all pixels within polygon are used?
      //print('sampleData.first()', sampleData.first());
      
         // Split training and validation set
      sampleData = sampleData.randomColumn({ seed: params.seed });  // globally defined
      var trainData = sampleData
    
      // Train Random Forest classifier using training set
      var trainedClassifier = ee.Classifier.smileRandomForest({
        numberOfTrees: params.numTrees,                                  // globally defined
        //outOfBagMode: true                                             // if smile version, to get variable importance     
      }).train({
            features: trainData,
            classProperty: 'class_id',                             
            inputProperties: geomTrainCovariates.bandNames()
         });
    
      // Apply trained classifier to all pixels
      var classified = geomPredictCovariates.classify(trainedClassifier).toUint8();
      
      var classified_ori = classified;
      
      // Fix output map resolution when changing map view zoom level
     
      if(config.reprojectClassifiedDisplay){
        classified = classified.reproject({
          crs: geomPredictCovariates.select('swir1_median').projection().crs(),  // Landsat composite is the main covariate
          scale: outScale      
        })
      }
  
      
      
   
      //////////////////////////////////////
      // Side effects
      
      // Display classified map
    
      
      if (numClass > 2) {
        var legend_palettes = ee.List(palettes.colorbrewer.Accent[numClass]).getInfo();   // Accent(8) / Paired(12) / Set3(12)
      } else {
        var legend_palettes = ['#feb24c', '#252525']
      }
    
      
      //print('legend_palettes', legend_palettes)
    
      map.setOptions('SATELLITE')
      
      // Whether keep the current classified map
      
      
      uiKeepClassified.style().set('shown', true)
      
      if (uiKeepClassified.getValue()) {
          CLASSIFIEDLYRNUM = CLASSIFIEDLYRNUM + 1
      }
      
      
      map.layers().set(CLASSIFIEDLYRNUM, 
          ui.Map.Layer(classified.select('classification'), 
              {min: 0, max: ee.Number(numClass).subtract(1).getInfo(), palette: legend_palettes}, 
              "User's classification", true));  // 0.5
              
      // Add legend 
      var legend = discreteLegendMap('Land cover class', "",   // Need to make this update-able
        class_names,   
        legend_palettes)
      
      //hey
      //map.widgets().get(0).clear();
      //map.widgets().get(0).insert(0, legend);
      
      emptyLegend.style().set('shown', true)
      emptyLegend.clear()
      emptyLegend.add(legend)
      
      
    
       ////////////// Download geojson (by Olha Danylo) ////////////////////////////////
       // Version for automatically generated geometry layers based on class names
        // var downloadButton = ui.Button({
        //       label: "Update link",
        //       style: {position: 'top-left'},
        //       onClick: function() {
        //         var today = new Date();
        //         var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'-'+today.getHours()+'-'+today.getMinutes()+'-'+today.getSeconds();
        //         var newfc = getMergedFC();    
        //         var class_names = ee.String(uiClassNames.getValue()).replace('(;)+', "_", "g")
        //         // HH added:
        //         var user_name = ee.String(uiUserName.getValue())
        //         //
        //         //var filename = ee.String(class_names).cat("_").cat(date).getInfo()
        //         // HH
        //         var filename = ee.String(user_name).cat("_").cat(ee.String(class_names)).cat("_").cat(date).getInfo()
        //         //
        //         var downloadLink = newfc.getDownloadURL({format:"json", selectors: [".geo", "class_name"], filename: filename})
        //         var urlLabel = ui.Label({value:'Download training data', style: {position: 'top-left'}})
        //         urlLabel.setUrl(downloadLink)
        //         downloadTablePanel.widgets().reset([urlLabel])
        //       }
        // }) 
  
  
        // var urlLabel = ui.Label({value:"Download training data", style: {position: 'top-left'}})
        // var downloadTablePanel = ui.Panel({widgets:[urlLabel], style: {position: 'top-left'}})
        // //map.add(downloadButton).add(downloadTablePanel);
  
        
        // initUiUpdateLink.clear()
        // initUiUpdateLink.add(downloadButton)
        
        // initUiDownloadLink.clear()
        // initUiDownloadLink.add(downloadTablePanel)
        
        
        /////// Update 20201017 without download button /////////////////
        var urlLabel = ui.Label({value:"Download training data", style: {position: 'top-left'}})
        // var urlLabel = ui.Label({value:"", style: {shown: false, position: 'top-left'}})
        var downloadTablePanel = ui.Panel({widgets:[urlLabel], style: {position: 'top-left'}})
  
        
        var updateLink = function(url){
          urlLabel.setValue('Download training data').setUrl(url)
          downloadTablePanel.widgets().reset([urlLabel])
        }  
        
  
        var updateTable = function() {
          urlLabel.style().set("shown", true)
          urlLabel.setValue("Loading...")
          var today = new Date();
          var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
          var newfc = getMergedFC();    
          // var filename = "data_" + date
          // HH modified file names:
          var class_names = ee.String(uiClassNames.getValue()).replace('(;)+', "_", "g")
          var user_name = ee.String(uiUserName.getValue())
          var filename = ee.String(user_name).cat("_").cat(ee.String(class_names)).cat("_").cat(date).getInfo()
      
          newfc.getDownloadURL({
            format:"json",                                  // ***** json *******
            selectors: [".geo", "class_name"], 
            filename: filename,
            callback: updateLink
          })
        }
  
  
        updateTable()
  
        drawingTools.onDraw(updateTable)
        drawingTools.onEdit(updateTable)
        drawingTools.onErase(updateTable)
        
        initUiDownloadLink.style().set('shown', true)
        initUiDownloadLink.clear()
        initUiDownloadLink.add(downloadTablePanel)
  
  
  
     ///////////////////////////////////////////////////////////////
     // Print bounding box of classified area(s)
     
     uiBoundBox.style().set('shown', true)
     
     var bound = map.getBounds(true)
     var ll = ee.List(ee.List(ee.Dictionary(bound).get('coordinates')).get(0)).get(1).getInfo()
     var ur = ee.List(ee.List(ee.Dictionary(bound).get('coordinates')).get(0)).get(3).getInfo()
     
     var ll_round = ll.map(function(i){return i.toFixed(5)})
     ll_round = ll_round.map(function(i){return Number(i)})  
     
     var ur_round = ur.map(function(i){return i.toFixed(5)})
     ur_round = ur_round.map(function(i){return Number(i)})  
     
     uiLLUR.setValue(ll_round + ';' + ur_round)
     
     
     //////////////////////////////////////////////////
     // Print variable importance chart
     
      // Get variable importance
      var dict = trainedClassifier.explain();
      var variable_importance = ee.Feature(null, ee.Dictionary(dict).get('importance'));
      var varImpChart =
        ui.Chart.feature.byProperty(variable_importance)
        .setChartType('ColumnChart')
        .setOptions({
          title: 'Variable importance',
          legend: {position: 'none'},
          hAxis: {title: 'Predictors'},
          vAxis: {title: 'Importance (%)'}
       });
       
       varImpChart.style().set({
                 position: 'bottom-right',
                 width: '500px',
                 height: '200px',
                 margin: '0px',
                 padding: '0px'
       })
     
      
      //Hey
      varImpChartPanel.style().set('shown', true)
      hideChartUi.style().set('shown', true)
      
      
      varImpChartPanel.clear()
      varImpChartPanel.add(varImpChart)
        
         
      //////////////////////////////////////////
      // Function return
      // Return 1) Classified image
      
      
      var returned = ee.Dictionary({
        'classifiedImage': classified,
      })
      
      //return returned;
      
      
      returned.evaluate(setBackLabel_runButton)
      
      
      //hey
      // Not ideal, there are still .getInfo() in classify, but for now gives some indication the classification has done running
      function setBackLabel_runButton () {
        runButton.setLabel('RUN CLASSIFICATION')  
      }
      
      
    }
  
  
  }
  
  
  
  /*///////////////////////////////////////////////////////////////
  INITIALIZE THE APP
  *//////////////////////////////////////////////////////////////
  
  init()
  
  
  