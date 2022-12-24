///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// I. GENERATE LANDSAT COMPOSITE, SPECTRAL FEATURES, AND TEMPORAL FEATURES ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////////////////////////////
Make a function to make Landsat composite
*/////////////////////////////////////////////////////////////////

// Fixed variables for BRDF correction and terrain correction
var PI = ee.Number(3.14159265359);
var MAX_SATELLITE_ZENITH = 7.5;
var MAX_DISTANCE = 1000000;
var UPPER_LEFT = 0;
var LOWER_LEFT = 1;
var LOWER_RIGHT = 2;
var UPPER_RIGHT = 3;

var scale = 300;
var toaOrSR = 'SR';

// get terrain layers
var dem = ee.Image("USGS/SRTMGL1_003")
var degree2radian = 0.01745;



function makeLandsatComposite(aoiGeom, startDateStr, endDateStr, sceneMaxCloudPercNum, sensorsStr) {
  
  var startDate = startDateStr;
  var endDate = endDateStr;
  var sceneMaxCloud = sceneMaxCloudPercNum;
  var sensors = sensorsStr;
  

  var l5 = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR');
  var l7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR');
  var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR');

  var l5filtered = l5.filterDate(startDate, endDate)
                   .filterBounds(aoiGeom)
                   .filterMetadata("CLOUD_COVER", "less_than", sceneMaxCloud)
                   .map(resampleBilinear)   
                   .map(edgeRemoval)
                   .map(maskL457_unscaled); 

                  
  var l7filtered = l7.filterDate(startDate, endDate)
                   .filterBounds(aoiGeom)
                   .filterMetadata("CLOUD_COVER", "less_than", sceneMaxCloud)
                   .map(resampleBilinear)    
                   .map(edgeRemoval)
                   .map(maskL457_unscaled);   
                   
                   
  var l8filtered = l8.filterDate(startDate, endDate)
                   .filterBounds(aoiGeom)
                   .filterMetadata("CLOUD_COVER", "less_than", sceneMaxCloud)
                   .map(resampleBilinear)    
                   .map(edgeRemoval)
                   .map(maskL8_unscaled)     
                   // Harmonize L8 to L7/L5
                   .map(harmonizationRoy);    
  
  var lsMerged;                 
  
  if (sensors === "L5") {
    
    lsMerged = l5filtered;
    
  } else if (sensors === "L7") {
    
    lsMerged = l7filtered;
    
  } else if (sensors === "L8") {
    
    lsMerged = l8filtered;
    
  } else if (sensors === "L5,L7") {
    
    lsMerged = l5filtered.merge(l7filtered);  
    
  } else if (sensors === "L7,L8") {
    
    lsMerged = l7filtered.merge(l8filtered);  
    
  } else {
    
    print('Error: sensorsStr argument must be either "L5", "L7", "L8", "L5,L7", or "L7,L8"')
    
  }
  
  // print("lsMerged", lsMerged)
  

  // Apply topographic correction
  var lsMerged_topoCor = terrainCorrection(lsMerged);


  // Apply BRDF correction
  var lsMerged_topoCor_brdfCor = brdfL8(lsMerged_topoCor)             


  // Calculate indices to also be composited
  var lsMerged_topoCor_brdfCor_indices = lsMerged_topoCor_brdfCor.map(calcIndicesLandsat)                     



  ///// Make annual composite of terrain & BRDF corrected collection ///////
  
  // Define selected reducers to save storage
  var blueBandReducers = ee.Reducer.median()

  var rawBandsReducers = ee.Reducer.median()
    .combine(ee.Reducer.stdDev(), '', true)
    .combine(ee.Reducer.percentile([10,25,75,90]), '', true); 

  var indicesReducers = ee.Reducer.median()
  
  
  // Apply the reducers
  var lsMergedBlueBandComposite = lsMerged_topoCor_brdfCor.select(['blue']).reduce(blueBandReducers, 8)   // parallelScale = 8 was found to work, not sure if necessary
  var lsMergedRawBandsComposite = lsMerged_topoCor_brdfCor.select(['green','red','nir','swir1','swir2']).reduce(rawBandsReducers, 8)
  var lsMergedIndicesComposite = lsMerged_topoCor_brdfCor_indices.reduce(indicesReducers, 8)
  var lsMergedValidPixelCount = lsMerged_topoCor_brdfCor.select('red').reduce(ee.Reducer.count(), 8)

  
  // Return
  var out = ee.Image.cat(lsMergedBlueBandComposite, lsMergedRawBandsComposite, lsMergedIndicesComposite, lsMergedValidPixelCount)
            .clip(aoiGeom); // clip may be unnecessary  
            
            
  return ee.Image(out).toShort();   //  signed 16-bit integer
  
} //~~~~~~~~~~~~~~~~~~~~~~ End of makeLandsatComposite() ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~






/*/////////////////////////////////////////////////////////////////////
Cloud and shadow masking
*//////////////////////////////////////////////////////////////////////

function maskL457_unscaled(img) {
  /*  Keep 'clear' and 'water' pixels for Landsat 4, 5 and 7  
  https://prd-wret.s3-us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/atoms/files/LSDS-1370_L4-7_Surface%20Reflectance-LEDAPS-Product-Guide.pdf
  or
  https://prd-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/atoms/files/LSDS-1370_L4-7_SurfaceReflectance-LEDAPS_ProductGuide-v2.pdf*/
  var mask = img.select(['pixel_qa']).eq(66)
              .or(img.select(['pixel_qa']).eq(68))
              .and(img.select('B1').gt(ee.Image(0)))
              // Add filter for band values < 10,000 i.e. 100% reflectance
              .and(img.select('B1').lte(ee.Image(10000)))
              .and(img.select('B2').lte(ee.Image(10000)))
              .and(img.select('B3').lte(ee.Image(10000)))
              .and(img.select('B4').lte(ee.Image(10000)))
              .and(img.select('B5').lte(ee.Image(10000)))
              .and(img.select('B7').lte(ee.Image(10000)))
  var masked = img.updateMask(mask)
         .select(['B1','B2', 'B3','B4','B5','B7'],
                 ['blue', 'green', 'red', 'nir', 'swir1', 'swir2'])
                 
  var out = ee.Image(masked)
               .copyProperties(masked, masked.propertyNames());
  
  return out;
}



function maskL8_unscaled(img) {
    /*  Keep 'clear' and 'water' pixels for Landsat 8
  https://prd-wret.s3-us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/atoms/files/LSDS-1368_%20L8_Surface-Reflectance-Code-LASRC-Product-Guide.pdf 
  or
  https://prd-wret.s3-us-west-2.amazonaws.com/assets/palladium/production/atoms/files/LSDS-1368_L8_SurfaceReflectanceCode-LASRC_ProductGuide-v2.pdf*/

  var mask = img.select(['pixel_qa']).eq(322)
               .or(img.select(['pixel_qa']).eq(324))
               .and(img.select('B2').gt(ee.Image(0)))
              // Add filter for band values < 10,000 i.e. 100% reflectance           
              .and(img.select('B3').lte(ee.Image(10000)))
              .and(img.select('B4').lte(ee.Image(10000)))
              .and(img.select('B5').lte(ee.Image(10000)))
              .and(img.select('B6').lte(ee.Image(10000)))
              .and(img.select('B7').lte(ee.Image(10000)))
               
  var masked = ee.Image(img).updateMask(mask)
                      .select(['B2', 'B3','B4','B5','B6','B7'],
                              ['blue', 'green', 'red', 'nir', 'swir1', 'swir2']);
                 
  var out = ee.Image(masked)
               .copyProperties(masked, masked.propertyNames());
  
  return out;
}




/*/////////////////////////////////////////////////////////////////////
Harmonize Landsat-8 data to Landsat-7 and Landsat-5
Adapted from https://code.earthengine.google.com/?scriptPath=users%2Femaprlab%2Fpublic%3AModules%2FLandTrendr.js by authors: Justin Braaten (Google), Zhiqiang Yang (USDA Forest Service), and Robert Kennedy (Oregon State University)
*//////////////////////////////////////////////////////////////////////


// slope and intercept citation: Roy, D.P., Kovalskyy, V., Zhang, H.K., Vermote, E.F., Yan, L., Kumar, S.S, Egorov, A., 2016, Characterization of Landsat-7 to Landsat-8 reflective wavelength and normalized difference vegetation index continuity, Remote Sensing of Environment, 185, 57-70.(http://dx.doi.org/10.1016/j.rse.2015.12.024); Table 2 - reduced major axis (RMA) regression coefficients
function harmonizationRoy(oli) {
  var slopes = ee.Image.constant([0.885, 0.9317, 0.9372, 0.8339, 0.8639, 0.9165]);
  var itcp = ee.Image.constant([0.0183, 0.0123, 0.0123, 0.0448, 0.0306, 0.0116]);
  var y = oli
           .resample('bicubic')                                                          // ...resample the L8 bands using bicubic
           .subtract(itcp.multiply(10000)).divide(slopes) // ...multiply the y-intercept bands by 10000 to match the scale of the L7 bands then apply the line equation - subtract the intercept and divide by the slope
           .copyProperties(oli, oli.propertyNames()) // added
           //.set('system:time_start', oli.get('system:time_start'));                      // ...set the output system:time_start metadata to the input image time_start otherwise it is null
  return ee.Image(y).toShort();                                                                       // return the image as short to match the type of the other data
}




/*/////////////////////////////////////////////////////////////////////
Other miscellaneous functions
*//////////////////////////////////////////////////////////////////////


function edgeRemoval(image) {
    var edgeSize = -5500.0;
    image = image.clip(
        image.geometry()
        .buffer(edgeSize)
        .simplify(1)
    );
    return image;
}


function resampleBilinear(image) {
  var resampled = image.resample('bilinear');
  return ee.Image(resampled);
}




/*/////////////////////////////////////////////////////////////////////
Calculate spectral indices
*//////////////////////////////////////////////////////////////////////

function NDVI(image) {
    var ndvi = image.normalizedDifference(['nir', 'red']).multiply(10000).int16(); 
    return ndvi.rename("ndvi");
}

function NDWI(image) {
    var ndwi = image.normalizedDifference(['nir', 'swir1']).multiply(10000).int16(); 
    return ndwi.rename("ndwi");
}

function NBR(image) {
    var nbr = image.normalizedDifference(['nir', 'swir2']).multiply(10000).int16();
    return nbr.rename("nbr");
}

function SAVI(image) {
    var savi = image.expression('(1 + L) * float(nir - red)/(nir + red + L)', {
        'nir': image.select('nir'),
        'red': image.select('red'),
        'L': 0.9
    }).multiply(10000).int16();
    return savi.rename("savi");
}


function EVI2(image) {
    var evi2 = image.expression('(2.5 * float(nir - red)/(nir + 2.4 * red + 1))', {
        'nir': image.select('nir'),
        'red': image.select('red'),
    }).multiply(10000).int16();
    return evi2.rename("evi2");
}



// Want to re-write this
function calcIndicesLandsat(image) {  

    var landsatIndices = NDVI(image).rename('ndvi')    // originally utils.NDVI i.e. all functions have utils, should it be?
        .addBands({
            "srcImg": NDWI(image),     
            "names": ['ndwi'],
            "overwrite": true
        }).addBands({
            "srcImg": NBR(image),
            "names": ['nbr'],
            "overwrite": true
        }).addBands({
            "srcImg": SAVI(image),
            "names": ['savi'],
            "overwrite": true
        }).addBands({
            "srcImg": EVI2(image),
            "names": ['evi2'],
            "overwrite": true
        })
        
    return landsatIndices;
}



/*////////////////////////////////////////////////////////////////
BRDF correction
Poortinga, A., Tenneson, K., Shapiro, A., Nquyen, Q., San Aung, K., Chishtie, F., & Saah, D. (2019). Mapping plantations in Myanmar by fusing Landsat-8, Sentinel-2 and Sentinel-1 data along with systematic error quantification. Remote Sensing, 11(7), 831.
https://www.mdpi.com/2072-4292/11/7/831/htm
*/////////////////////////////////////////////////////////////////


function brdfL8(collection) {

  
  collection = collection.map(applyBRDF);
  
  return collection;
    
  function applyBRDF(image) {

    var date = image.date();
    var footprint = ee.List(image.geometry().bounds(0.001).bounds(0.001).coordinates().get(0)); // .bounds().bounds()
    var angles =  getsunAngles(date, footprint);
    var sunAz = angles[0];
    var sunZen = angles[1];
  
    var viewAz = azimuth(footprint);
    var viewZen = zenith(footprint);
  
  
    var kval = _kvol(sunAz, sunZen, viewAz, viewZen);
    var kvol = kval[0];
    var kvol0 = kval[1];
    var result = _apply(image, kvol.multiply(PI), kvol0.multiply(PI));
    
    return result;
  }

  /* Get sunAngles from the map given the data.
  *
  * date:  ee.date object
  * footprint: geometry of the image
  */
  function getsunAngles(date, footprint){
    var jdp = date.getFraction('year');
    var seconds_in_hour = 3600;
    var  hourGMT = ee.Number(date.getRelative('second', 'day')).divide(seconds_in_hour);
    
    var latRad = ee.Image.pixelLonLat().select('latitude').multiply(PI.divide(180));
    var longDeg = ee.Image.pixelLonLat().select('longitude');
    
    // Julian day proportion in radians
    var jdpr = jdp.multiply(PI).multiply(2);
    
    var a = ee.List([0.000075, 0.001868, 0.032077, 0.014615, 0.040849]);
    var meanSolarTime = longDeg.divide(15.0).add(ee.Number(hourGMT));
    var localSolarDiff1 = value(a, 0)
            .add(value(a, 1).multiply(jdpr.cos())) 
            .subtract(value(a, 2).multiply(jdpr.sin())) 
            .subtract(value(a, 3).multiply(jdpr.multiply(2).cos())) 
            .subtract(value(a, 4).multiply(jdpr.multiply(2).sin()));
  
    var localSolarDiff2 = localSolarDiff1.multiply(12 * 60);
  
    var localSolarDiff = localSolarDiff2.divide(PI);
    var trueSolarTime = meanSolarTime 
            .add(localSolarDiff.divide(60)) 
            .subtract(12.0);
    
    // Hour as an angle;
    var ah = trueSolarTime.multiply(ee.Number(MAX_SATELLITE_ZENITH * 2).multiply(PI.divide(180))) ;   
    var b = ee.List([0.006918, 0.399912, 0.070257, 0.006758, 0.000907, 0.002697, 0.001480]);
    var delta = value(b, 0) 
          .subtract(value(b, 1).multiply(jdpr.cos())) 
          .add(value(b, 2).multiply(jdpr.sin())) 
          .subtract(value(b, 3).multiply(jdpr.multiply(2).cos())) 
          .add(value(b, 4).multiply(jdpr.multiply(2).sin())) 
          .subtract(value(b, 5).multiply(jdpr.multiply(3).cos())) 
          .add(value(b, 6).multiply(jdpr.multiply(3).sin()));
  
    var cosSunZen = latRad.sin().multiply(delta.sin()) 
          .add(latRad.cos().multiply(ah.cos()).multiply(delta.cos()));
    var sunZen = cosSunZen.acos();
  
    // sun azimuth from south, turning west
    var sinSunAzSW = ah.sin().multiply(delta.cos()).divide(sunZen.sin());
    sinSunAzSW = sinSunAzSW.clamp(-1.0, 1.0);
  
    var cosSunAzSW = (latRad.cos().multiply(-1).multiply(delta.sin())
                    .add(latRad.sin().multiply(delta.cos()).multiply(ah.cos()))) 
                    .divide(sunZen.sin());
    var sunAzSW = sinSunAzSW.asin();
  
    sunAzSW = where(cosSunAzSW.lte(0), sunAzSW.multiply(-1).add(PI), sunAzSW);
    sunAzSW = where(cosSunAzSW.gt(0).and(sinSunAzSW.lte(0)), sunAzSW.add(PI.multiply(2)), sunAzSW);
  
    var sunAz = sunAzSW.add(PI);
     // # Keep within [0, 2pi] range
    sunAz = where(sunAz.gt(PI.multiply(2)), sunAz.subtract(PI.multiply(2)), sunAz);
  
    var footprint_polygon = ee.Geometry.Polygon(footprint);
    sunAz = sunAz.clip(footprint_polygon);
    sunAz = sunAz.rename(['sunAz']);
    sunZen = sunZen.clip(footprint_polygon).rename(['sunZen']);
  
    return [sunAz, sunZen];
  }


  /* Get azimuth.
  *
  * 
  * footprint: geometry of the image
  */
  function azimuth(footprint){

    function x(point){return ee.Number(ee.List(point).get(0))}
    function  y(point){return ee.Number(ee.List(point).get(1))}
    
    var upperCenter = line_from_coords(footprint, UPPER_LEFT, UPPER_RIGHT).centroid().coordinates();
    var lowerCenter = line_from_coords(footprint, LOWER_LEFT, LOWER_RIGHT).centroid().coordinates();
    var slope = ((y(lowerCenter)).subtract(y(upperCenter))).divide((x(lowerCenter)).subtract(x(upperCenter)));
    var slopePerp = ee.Number(-1).divide(slope);
    var azimuthLeft = ee.Image(PI.divide(2).subtract((slopePerp).atan()));
    return azimuthLeft.rename(['viewAz']);
  }

  /* Get zenith.
  *
  * 
  * footprint: geometry of the image
  */
  function zenith(footprint){
    var leftLine = line_from_coords(footprint, UPPER_LEFT, LOWER_LEFT);
    var rightLine = line_from_coords(footprint, UPPER_RIGHT, LOWER_RIGHT);
    var leftDistance = ee.FeatureCollection(leftLine).distance(MAX_DISTANCE);
    var rightDistance = ee.FeatureCollection(rightLine).distance(MAX_DISTANCE);
    var viewZenith = rightDistance.multiply(ee.Number(MAX_SATELLITE_ZENITH * 2)) 
        .divide(rightDistance.add(leftDistance)) 
        .subtract(ee.Number(MAX_SATELLITE_ZENITH)) 
        .clip(ee.Geometry.Polygon(footprint)) 
        .rename(['viewZen']);
    return viewZenith.multiply(PI.divide(180));
  }
  
  /* apply function to all bands
  *
  * http://www.mdpi.com/2072-4292/9/12/1325/htm#sec3dot2-remotesensing-09-01325 
  * https://www.sciencedirect.com/science/article/pii/S0034425717302791
  *
  * image : the image to apply the function to
  * kvol:
  * kvol0
  *
  */
  function _apply(image, kvol, kvol0){
    var f_iso = 0;
    var f_geo = 0;
    var f_vol = 0;
		var blue = _correct_band(image, 'blue', kvol, kvol0, f_iso=0.0774, f_geo=0.0079, f_vol=0.0372);
		var green = _correct_band(image, 'green', kvol, kvol0, f_iso=0.1306, f_geo=0.0178, f_vol=0.0580);
		var red = _correct_band(image, 'red', kvol, kvol0, f_iso=0.1690, f_geo=0.0227, f_vol=0.0574);
    var nir = _correct_band(image, 'nir', kvol, kvol0, f_iso=0.3093, f_geo=0.0330, f_vol=0.1535);
    var swir1 = _correct_band(image, 'swir1', kvol, kvol0, f_iso=0.3430, f_geo=0.0453, f_vol=0.1154);   
    var swir2 = _correct_band(image, 'swir2', kvol, kvol0, f_iso=0.2658, f_geo=0.0387, f_vol=0.0639);
    //var DOY = image.select("DOY")
		return image.select([]).addBands([blue, green, red, nir, swir1, swir2]);     // DOY removed                     // RETURN
  }

  /* correct band function
  *
  *
  * image : the image to apply the function to
  * band_name
  * kvol
  * kvol0
  * f_iso
  * f_geo
  * f_vol
  *
  */  
  function _correct_band(image, band_name, kvol, kvol0, f_iso, f_geo, f_vol){
 			//"""fiso + fvol * kvol + fgeo * kgeo"""
			var iso = ee.Image(f_iso);
			var geo = ee.Image(f_geo);
			var vol = ee.Image(f_vol);
			var pred = vol.multiply(kvol).add(geo.multiply(kvol)).add(iso).rename(['pred']);
			var pred0 = vol.multiply(kvol0).add(geo.multiply(kvol0)).add(iso).rename(['pred0']);
			var cfac = pred0.divide(pred).rename(['cfac']);
			var corr = image.select(band_name).multiply(cfac).rename([band_name]);
			return corr;
  }

  /* calculate kvol and kvol0
  *
  * sunAZ
  * sunZen
  * viewAz
  * viewZen
  *
  */  
  function _kvol(sunAz, sunZen, viewAz, viewZen){
		//"""Calculate kvol kernel.
		//From Lucht et al. 2000
		//Phase angle = cos(solar zenith) cos(view zenith) + sin(solar zenith) sin(view zenith) cos(relative azimuth)"""
		
		var relative_azimuth = sunAz.subtract(viewAz).rename(['relAz']);
		var pa1 = viewZen.cos().multiply(sunZen.cos());
		var pa2 = viewZen.sin().multiply(sunZen.sin()).multiply(relative_azimuth.cos());
		var phase_angle1 = pa1.add(pa2);
		var phase_angle = phase_angle1.acos();
		var p1 = ee.Image(PI.divide(2)).subtract(phase_angle);
		var p2 = p1.multiply(phase_angle1);
		var p3 = p2.add(phase_angle.sin());
		var p4 = sunZen.cos().add(viewZen.cos());
		var p5 = ee.Image(PI.divide(4));

		var kvol = p3.divide(p4).subtract(p5).rename(['kvol']);

		var viewZen0 = ee.Image(0);
		var pa10 = viewZen0.cos().multiply(sunZen.cos());
		var pa20 = viewZen0.sin().multiply(sunZen.sin()).multiply(relative_azimuth.cos());
		var phase_angle10 = pa10.add(pa20);
		var phase_angle0 = phase_angle10.acos();
		var p10 = ee.Image(PI.divide(2)).subtract(phase_angle0);
		var p20 = p10.multiply(phase_angle10);
		var p30 = p20.add(phase_angle0.sin());
		var p40 = sunZen.cos().add(viewZen0.cos());
		var p50 = ee.Image(PI.divide(4));

		var kvol0 = p30.divide(p40).subtract(p50).rename(['kvol0']);

		return [kvol, kvol0]
  }

  /* helper function
  *
  */  
                             
  function line_from_coords(coordinates, fromIndex, toIndex){
    return ee.Geometry.LineString(ee.List([
      coordinates.get(fromIndex),
      coordinates.get(toIndex)]));
  }

  function where(condition, trueValue, falseValue){
    var trueMasked = trueValue.mask(condition);
    var falseMasked = falseValue.mask(invertMask(condition));
    return trueMasked.unmask(falseMasked);
  }
  
  function invertMask(mask){
    return mask.multiply(-1).add(1);
  }


  function value(list,index){
    return ee.Number(list.get(index));
  }

}  // ****** End of brdfL8() definition *******




/*////////////////////////////////////////////////////////////////
Terrain correction
Poortinga, A., Tenneson, K., Shapiro, A., Nquyen, Q., San Aung, K., Chishtie, F., & Saah, D. (2019). Mapping plantations in Myanmar by fusing Landsat-8, Sentinel-2 and Sentinel-1 data along with systematic error quantification. Remote Sensing, 11(7), 831.
https://www.mdpi.com/2072-4292/11/7/831/htm

(Note: Alternative approach see regression-based implementation in another study:
https://github.com/Forests2020-Indonesia/Module-TOPO/blob/master/Topographic%20Correction.py)
*/////////////////////////////////////////////////////////////////


function terrainCorrection(collection) {

  ///////////////////////////////////////////////////////////////////////////////////////////
  // Apply illuminationCondition()
  collection = collection.map(illuminationCondition);
  
   ///////////////////////////////////////////////////////////////////////////////////////////
  // Apply illuminationCorrection()
  collection = collection.map(illuminationCorrection);

  return(collection);

  ////////////////////////////////////////////////////////////////////////////////
  // Function to calculate illumination condition (IC). Function by Patrick Burns 
  // (pb463@nau.edu) and Matt Macander 
  // (mmacander@abrinc.com)
  function illuminationCondition(img){
      // Extract image metadata about solar position
      var SZ_rad = ee.Image.constant(ee.Number(img.get('SOLAR_ZENITH_ANGLE'))).multiply(3.14159265359).divide(180).clip(img.geometry().buffer(10000)); 
      var SA_rad = ee.Image.constant(ee.Number(img.get('SOLAR_AZIMUTH_ANGLE')).multiply(3.14159265359).divide(180)).clip(img.geometry().buffer(10000)); 

      // Creat terrain layers
      var slp = ee.Terrain.slope(dem).clip(img.geometry().buffer(10000));
      var slp_rad = ee.Terrain.slope(dem).multiply(3.14159265359).divide(180).clip(img.geometry().buffer(10000));
      var asp_rad = ee.Terrain.aspect(dem).multiply(3.14159265359).divide(180).clip(img.geometry().buffer(10000));
      
      // Calculate the Illumination Condition (IC)
      // slope part of the illumination condition
      var cosZ = SZ_rad.cos();
      var cosS = slp_rad.cos();
      var slope_illumination = cosS.expression("cosZ * cosS", 
                                              {'cosZ': cosZ,
                                               'cosS': cosS.select('slope')});
                                               
      // aspect part of the illumination condition
      var sinZ = SZ_rad.sin(); 
      var sinS = slp_rad.sin();
      var cosAziDiff = (SA_rad.subtract(asp_rad)).cos();
      var aspect_illumination = sinZ.expression("sinZ * sinS * cosAziDiff", 
                                               {'sinZ': sinZ,
                                                'sinS': sinS,
                                                'cosAziDiff': cosAziDiff});
      // full illumination condition (IC)
      var ic = slope_illumination.add(aspect_illumination);
    
      // Add IC to original image
      var img_plus_ic = ee.Image(img.addBands(ic.rename('IC')).addBands(cosZ.rename('cosZ')).addBands(cosS.rename('cosS')).addBands(slp.rename('slope')));
      
      return img_plus_ic;
  }
  
  ////////////////////////////////////////////////////////////////////////////////
  // Function to apply the Sun-Canopy-Sensor + C (SCSc) correction method to each 
  // image. Function by Patrick Burns (pb463@nau.edu) and Matt Macander 
  // (mmacander@abrinc.com)
  function illuminationCorrection(img){
    var props = img.toDictionary();
    var st = img.get('system:time_start');
    
    var img_plus_ic = img;
    var mask1 = img_plus_ic.select('nir').gt(-0.1);
    var mask2 = img_plus_ic.select('slope').gte(5)
                            .and(img_plus_ic.select('IC').gte(0))
                            .and(img_plus_ic.select('nir').gt(-0.1));
    var img_plus_ic_mask2 = ee.Image(img_plus_ic.updateMask(mask2));
    
    // Specify Bands to topographically correct  
    var bandList = ['blue','green','red','nir','swir1','swir2']; 
    var compositeBands = img.bandNames();
    var nonCorrectBands = img.select(compositeBands.removeAll(bandList));
    
    var geom = ee.Geometry(img.get('system:footprint')).bounds(0.001).buffer(10000);
    
    function apply_SCSccorr(band){
      var method = 'SCSc';
      var out =  ee.Image(1).addBands(img_plus_ic_mask2.select('IC', band))
                            .reduceRegion({reducer: ee.Reducer.linearRegression(2,1),
                                           geometry: ee.Geometry(img.geometry()),
                                           scale: scale,
                                           bestEffort :true,
                                           maxPixels:1e10});
 
        var fit = out.combine({"coefficients": ee.Array([[1],[1]])}, false);
 
                //Get the coefficients as a nested list,
                // ast it to an array, and get just the selected column
                var out_a = (ee.Array(fit.get('coefficients')).get([0,0]));
                var out_b = (ee.Array(fit.get('coefficients')).get([1,0]));
                var out_c = out_a.divide(out_b);
 
        // Apply the SCSc correction
        var SCSc_output = img_plus_ic_mask2.expression(
        "((image * (cosB * cosZ + cvalue)) / (ic + cvalue))", {
        'image': img_plus_ic_mask2.select(band),
        'ic': img_plus_ic_mask2.select('IC'),
        'cosB': img_plus_ic_mask2.select('cosS'),
        'cosZ': img_plus_ic_mask2.select('cosZ'),
        'cvalue': out_c
        });
 
      return SCSc_output;
 
    }
 
    var img_SCSccorr = ee.Image(bandList.map(apply_SCSccorr)).addBands(img_plus_ic.select('IC'));
    var bandList_IC = ee.List([bandList, 'IC']).flatten();
    img_SCSccorr = img_SCSccorr.unmask(img_plus_ic.select(bandList_IC)).select(bandList);
 
  
    img_SCSccorr = ee.Image(img_SCSccorr.addBands(nonCorrectBands).setMulti(props).set('system:time_start',st))
    
    //return img_SCSccorr.select(['red','green','blue','nir','swir1','swir2',"DOY"])  // HH: why 'red' band first?
    return img_SCSccorr.select(['blue','green','red','nir','swir1','swir2']) // "DOY" removed
    
  }
  
} // ****** End of terrainCorrection() definition ******





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////// II. GENERATE LANDSAT COMPOSITE (MULTI-YEAR WINDOW) (NOT INCLUDED IN THE PAPER) /////////////////////////////////// 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function makeLandsatCompositeWeightYears(aoiGeom, startYearNum, endYearNum, yearWeightsList, sceneMaxCloudPercNum, sensorsStr) {
  
  var sceneMaxCloud = sceneMaxCloudPercNum;
  var sensors = sensorsStr;
  
  var l5 = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR');
  var l7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR');
  var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR');
  
  var l5_filt1 = l5.filterBounds(aoiGeom)
                   .filterMetadata("CLOUD_COVER", "less_than", sceneMaxCloud)

  var l7_filt1 = l7.filterBounds(aoiGeom)
                   .filterMetadata("CLOUD_COVER", "less_than", sceneMaxCloud)

  var l8_filt1 = l8.filterBounds(aoiGeom)
                   .filterMetadata("CLOUD_COVER", "less_than", sceneMaxCloud)


  ///////////////////////////////////////////////////////////////////////
  // Extend composite time window to multiple years, apply weights to observations from different years

  var startYearT = startYearNum;
  var endYearT = endYearNum;
  var weights = yearWeightsList;
  
  var yearsT = ee.List.sequence(startYearT, endYearT);
  
  var z = yearsT.zip(weights);
  var yearsTT = z.map(function(i){
    i = ee.List(i);
    return ee.List.repeat(i.get(0),i.get(1));
  }).flatten();
  

  function fillEmptyCollections(inCollection,dummyImage){                       
    var dummyCollection = ee.ImageCollection([dummyImage.mask(ee.Image(0))]);
    var imageCount = inCollection.toList(1).length();
    return ee.ImageCollection(ee.Algorithms.If(imageCount.gt(0),inCollection,dummyCollection));
  }
  
  // L5 //
  var l5images = yearsTT.map(function(yr){
    // Set up dates
    var startDateT = ee.Date.fromYMD(yr,1,1);
    var endDateT = ee.Date.fromYMD(ee.Number(yr).add(1),1,1);
    
    // Filter images for given date range
    var lsT = l5_filt1.filterDate(startDateT, endDateT)
    // Fill empty collection (in case) with dummy image
    var dummyImage = ee.Image(l5_filt1.first());             
    lsT = fillEmptyCollections(lsT, dummyImage);
    return lsT;
  });
  
  var l5imcol = ee.ImageCollection(ee.FeatureCollection(l5images).flatten());

  
  // L7 //
  var l7images = yearsTT.map(function(yr){
    // Set up dates
    var startDateT = ee.Date.fromYMD(yr,1,1);
    var endDateT = ee.Date.fromYMD(ee.Number(yr).add(1),1,1);
    
    // Filter images for given date range
    var lsT = l7_filt1.filterDate(startDateT, endDateT)
    // Fill empty collection (in case) with dummy image
    var dummyImage = ee.Image(l7_filt1.first());             
    lsT = fillEmptyCollections(lsT, dummyImage);
    return lsT;
  });
  
  var l7imcol = ee.ImageCollection(ee.FeatureCollection(l7images).flatten());
  
  
  
  // L8 //
  var l8images = yearsTT.map(function(yr){
    // Set up dates
    var startDateT = ee.Date.fromYMD(yr,1,1);
    var endDateT = ee.Date.fromYMD(ee.Number(yr).add(1),1,1);
    
    // Filter images for given date range
    var lsT = l8_filt1.filterDate(startDateT, endDateT)
    // Fill empty collection (in case) with dummy image
    var dummyImage = ee.Image(l8_filt1.first());             
    lsT = fillEmptyCollections(lsT, dummyImage);
    return lsT;
  });
  
  var l8imcol = ee.ImageCollection(ee.FeatureCollection(l8images).flatten());

  ///////////////////////////////////////////////////////////////////////
  // Apply preprocessing to each image in the expanded image collection
  
  var l5_filt2 = l5imcol
                 .map(resampleBilinear)    
                 .map(edgeRemoval)
                 .map(maskL457_unscaled);  
  
  var l7_filt2 = l7imcol
                 .map(resampleBilinear)    
                 .map(edgeRemoval)
                 .map(maskL457_unscaled);  
  
  var l8_filt2 = l8imcol
                 .map(resampleBilinear)    
                 .map(edgeRemoval)
                 .map(maskL8_unscaled)     
                 // Harmonize L8 to L7/L5
                 .map(harmonizationRoy); 
                  
                  
 var lsMerged;                 
  
  if (sensors === "L5") {
    
    lsMerged = l5_filt2;
    
  } else if (sensors === "L7") {
    
    lsMerged = l7_filt2;
    
  } else if (sensors === "L8") {
    
    lsMerged = l8_filt2;
    
  } else if (sensors === "L5,L7") {
    
    lsMerged = l5_filt2.merge(l7_filt2);  
    
  } else if (sensors === "L7,L8") {
    
    lsMerged = l7_filt2.merge(l8_filt2);  
    
  } else {
    
    print('Error: sensorsStr argument must be either "L5", "L7", "L8", "L5,L7", or "L7,L8"')
    
  }
  
  // print("lsMerged", lsMerged)
  

  // Apply topographic correction
  var lsMerged_topoCor = terrainCorrection(lsMerged);


  // Apply BRDF correction
  var lsMerged_topoCor_brdfCor = brdfL8(lsMerged_topoCor)             


  // Calculate indices to also be composited
  var lsMerged_topoCor_brdfCor_indices = lsMerged_topoCor_brdfCor.map(calcIndicesLandsat)                     



  ///// Make annual composite of terrain & BRDF corrected collection ///////
  
  // Define selected reducers to save storage
  var blueBandReducers = ee.Reducer.median()

  var rawBandsReducers = ee.Reducer.median()
    .combine(ee.Reducer.stdDev(), '', true)
    .combine(ee.Reducer.percentile([10,25,75,90]), '', true); 

  var indicesReducers = ee.Reducer.median()
  
  
  // Apply the reducers
  var lsMergedBlueBandComposite = lsMerged_topoCor_brdfCor.select(['blue']).reduce(blueBandReducers, 8)   // parallelScale = 8 was found to work, not sure if necessary for the parallel processing
  var lsMergedRawBandsComposite = lsMerged_topoCor_brdfCor.select(['green','red','nir','swir1','swir2']).reduce(rawBandsReducers, 8)
  var lsMergedIndicesComposite = lsMerged_topoCor_brdfCor_indices.reduce(indicesReducers, 8)
  var lsMergedValidPixelCount = lsMerged_topoCor_brdfCor.select('red').reduce(ee.Reducer.count(), 8)

  
  // Return
  var out = ee.Image.cat(lsMergedBlueBandComposite, lsMergedRawBandsComposite, lsMergedIndicesComposite, lsMergedValidPixelCount)
            .clip(aoiGeom); // clip may be unnecessary
  
  return ee.Image(out).toShort();   //  signed 16-bit integer
  
} //~~~~~~~~~~~~~~~~~~~~~~ End of makeLandsatCompositeWeightYears() ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~





// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////// II. GENERATE SENTINEL-1 COMPOSITE, SPECTRAL FEATURES, AND TEMPORAL FEATURES ////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function toNatural(img) {
  return ee.Image(10.0).rename(img.bandNames())
        .pow(img.select(0).divide(10.0))
}

function toDB(img) {
  return ee.Image(img).log10().multiply(10.0);
}


  



/////////////////////////////////////////////////////////////////
// ANNUAL COMPOSITE

/**
 * Design choice: speckle filtering was not applied, as multitemporal averaging was done i.e. temporal composites;
 * If desired, speckle filtering (e.g. refined lee filter) can be done on the composites.
*/


function makeSentOneComposite(aoiGeom, startDateStr, endDateStr, reducers) {
  
    var startDate = startDateStr;
    var endDate = endDateStr;
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Get collections containing 'VV' band, and collections containing 'VH' bands separately, to get all images
    var S1_VV = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
        .filterMetadata('instrumentMode', 'equals', 'IW') 
        .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
        .filterDate(startDate, endDate)
        .filterBounds(aoiGeom)       
        .select(['VV']) 

    var S1_VH = ee.ImageCollection('COPERNICUS/S1_GRD')
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
        .filterMetadata('instrumentMode', 'equals', 'IW') 
        .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
        .filterDate(startDate, endDate)
        .filterBounds(aoiGeom)   
        .select(['VH'])


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Minor processing to minimize image artifacts
    
    // Remove ugly edges
    // from https://github.com/rdandrimont/AGREE/blob/master/1_Sentinel1-VV-VH_7-day_ParcelAverage.js
    function maskEdge(img) {
      var mask = img.select(0).unitScale(-25, 5).multiply(255).toByte().connectedComponents(ee.Kernel.rectangle(1,1), 100);
      return img.updateMask(mask.select(0));  
    }
    
    // Apply
    S1_VV = S1_VV.map(maskEdge);            
    S1_VH = S1_VH.map(maskEdge);

    // Remove stripes
    function stripeMaskVH(im) {
      var mask = ee.Image(0).where(im.select('VH').lte(-30), 1).not();
      return im.updateMask(mask).rename('VH');
    } 
    
    function stripeMaskVV(im) {
      var mask = ee.Image(0).where(im.select('VV').lte(-25), 1).not();
      return im.updateMask(mask).rename('VV');
    }
      
    // Apply  
    S1_VV = S1_VV.map(stripeMaskVV);                
    S1_VH = S1_VH.map(stripeMaskVH);
      
      
    /////////////////////////////////////////////////////////////////////////////////////////////////// 
    // Composites
      
    // VV
    var S1_VV_reduced = S1_VV.map(toNatural) // aggregate the values in natural unit
        .map(resampleBilinear) 
        .reduce(reducers, 8)   // parallelScale = 8 was found to work, not sure if necessary for the parallel processing
         
    S1_VV_reduced =  toDB(S1_VV_reduced); // convert back to db unit          
        
  
    // VH
    var S1_VH_reduced = S1_VH.map(toNatural) // aggregate the values in natural unit
        .map(resampleBilinear)   
        .reduce(reducers, 8)   // parallelScale = 8 was found to work, not sure if necessary for the parallel processing
  
    S1_VH_reduced =  toDB(S1_VH_reduced); // convert back to db unit              
  
  
    // Merge into single composite image (VV & VH)
    var composite =  ee.Image.cat(S1_VV_reduced, S1_VH_reduced)
    
    
    // Return from function 
    var clippedComposite = composite.clip(aoiGeom);
    
    // Convert data type to save storage
    // S1 are 16-bit integer as GRD products
    // https://forum.step.esa.int/t/s1-bit-depth/11803/2
    clippedComposite = clippedComposite.multiply(100).toShort();    // scaling factor 100, so range is ~ -5000 to 100+
    
    return clippedComposite;
}





/////////////////////////////////////////////////////////////////
// SEASONAL COMPOSITES

function makeSentOneCompositeTwoSeasons(aoiGeom, startDateStr, endDateStr, startMonthRainyNum, endMonthRainyNum, startMonthDryNum, endMonthDryNum, reducers) {
  
  var startDate = startDateStr;
  var endDate = endDateStr;
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Get collections containing 'VV' band, and collections containing 'VH' bands separately, to get all images
  var S1_VV = ee.ImageCollection('COPERNICUS/S1_GRD')
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
      .filterMetadata('instrumentMode', 'equals', 'IW') 
      .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
      .filterDate(startDate, endDate)
      .filterBounds(aoiGeom)       
      .select(['VV']) 

  var S1_VH = ee.ImageCollection('COPERNICUS/S1_GRD')
      .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
      .filterMetadata('instrumentMode', 'equals', 'IW') 
      .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))
      .filterDate(startDate, endDate)
      .filterBounds(aoiGeom)   
      .select(['VH'])


  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Minor processing to minimize image artifacts
  
  // Remove ugly edges
  // from https://github.com/rdandrimont/AGREE/blob/master/1_Sentinel1-VV-VH_7-day_ParcelAverage.js
  function maskEdge(img) {
    var mask = img.select(0).unitScale(-25, 5).multiply(255).toByte().connectedComponents(ee.Kernel.rectangle(1,1), 100);
    return img.updateMask(mask.select(0));  
  }
  
  // Apply
  S1_VV = S1_VV.map(maskEdge);            
  S1_VH = S1_VH.map(maskEdge);

  // Remove stripes
  function stripeMaskVH(im) {
    var mask = ee.Image(0).where(im.select('VH').lte(-30), 1).not();
    return im.updateMask(mask).rename('VH');
  } 
  
  function stripeMaskVV(im) {
    var mask = ee.Image(0).where(im.select('VV').lte(-25), 1).not();
    return im.updateMask(mask).rename('VV');
  }
    
  // Apply  
  S1_VV = S1_VV.map(stripeMaskVV);                
  S1_VH = S1_VH.map(stripeMaskVH);
    
    
  /////////////////////////////////////////////////////////////////////////////////////////////////// 
  // Composites

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // VV rainy season
  
  var S1_VV_rainySeason = S1_VV.filter(ee.Filter.calendarRange({
    start: 1,
    end: 3,
    field: 'month'
  })).map(toNatural)
    .map(resampleBilinear) 
    .reduce(reducers, 8)
       
  S1_VV_rainySeason =  toDB(S1_VV_rainySeason);  
  
  // Rename bands
  var S1_VV_rainySeason_names = S1_VV_rainySeason.bandNames()
  var S1_VV_rainySeason_names_new = S1_VV_rainySeason_names.map(function(name) {return ee.String(name).cat('_rainy')} )
  
  S1_VV_rainySeason = S1_VV_rainySeason.rename(S1_VV_rainySeason_names_new)
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // VV dry season
  
  var S1_VV_drySeason = S1_VV.filter(ee.Filter.calendarRange({
      start: 6,
      end: 10,
      field: 'month'
    })).map(toNatural)
      .map(resampleBilinear)   
      .reduce(reducers, 8)
  
  S1_VV_drySeason = toDB(S1_VV_drySeason)  
  
  // Rename bands  
  var S1_VV_drySeason_names = S1_VV_drySeason.bandNames()
  var S1_VV_drySeason_names_new = S1_VV_drySeason_names.map(function(name) {return ee.String(name).cat('_dry')} )

  S1_VV_drySeason = S1_VV_drySeason.rename(S1_VV_drySeason_names_new)

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // VH rainy season
  
  var S1_VH_rainySeason = S1_VH.filter(ee.Filter.calendarRange({
      start: 1,
      end: 3,
      field: 'month'
    })).map(toNatural)
      .map(resampleBilinear) 
      .reduce(reducers, 8)

  
  S1_VH_rainySeason = toDB(S1_VH_rainySeason)
  
  // Rename bands
  var S1_VH_rainySeason_names = S1_VH_rainySeason.bandNames()
  var S1_VH_rainySeason_names_new = S1_VH_rainySeason_names.map(function(name) {return ee.String(name).cat('_rainy')} )
  
  S1_VH_rainySeason = S1_VH_rainySeason.rename(S1_VH_rainySeason_names_new)

  
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // VH dry season
  
  var S1_VH_drySeason = S1_VH.filter(ee.Filter.calendarRange({
      start: 6,
      end: 10,
      field: 'month'
    })).map(toNatural)
      .map(resampleBilinear) 
      .reduce(reducers, 8)
  
  S1_VH_drySeason = toDB(S1_VH_drySeason)  
    
    
  
 // Rename bands
  var S1_VH_drySeason_names = S1_VH_drySeason.bandNames()
  var S1_VH_drySeason_names_new = S1_VH_drySeason_names.map(function(name) {return ee.String(name).cat('_dry')} )

  S1_VH_drySeason = S1_VH_drySeason.rename(S1_VH_drySeason_names_new)


   
  /////////////////////////////////////////////////////////////////////////////////////////////////// 
  // Merge into single composite image
  var composite =  ee.Image.cat(S1_VV_rainySeason, S1_VV_drySeason, S1_VH_rainySeason, S1_VH_drySeason)
   

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Return
  var clippedComposite = composite.clip(aoiGeom);
  
  // Convert data type to save storage
  // S1 are 16-bit integer as GRD products
  // https://forum.step.esa.int/t/s1-bit-depth/11803/2
  
  clippedComposite = clippedComposite.multiply(100).toShort();    // scaling factor 100, so range is -5000 to 100+
  
  return clippedComposite;
}




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////// III. GENERATE PALSAR TEXTURAL FEATURES //////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function makePALSARtexture(aoiGeom, compositeYearStr, neighbourhoodSizeNum) {
  
  var palsar_hh_hv_qa = ee.ImageCollection('JAXA/ALOS/PALSAR/YEARLY/SAR')
                    .filterMetadata('system:index', 'equals', compositeYearStr)
                    .filterBounds(aoiGeom)
                    .first();                        // only 1 image in a year
                     
  var palsar_hh_hv = palsar_hh_hv_qa
                    .updateMask(palsar_hh_hv_qa.select('qa').neq(ee.Image(0)))
                    .updateMask(palsar_hh_hv_qa.select('qa').neq(ee.Image(100)))
                    .updateMask(palsar_hh_hv_qa.select('qa').neq(ee.Image(150))) // just keep land & ocean/water
                    .select(['HH', 'HV'], ['HH', 'HV'])
                    .clip(aoiGeom);
                    
  
  // Add ratio band = HH/HV
  palsar_hh_hv = palsar_hh_hv.addBands(
    palsar_hh_hv.select('HH').divide(palsar_hh_hv.select('HV')).multiply(1000).rename('HH_div_HV'));
  
  // Convert to positive values and uint16
  var palsar_hh_hv_pos = palsar_hh_hv.add(10000).uint16();
  
  var palsar_hh_hv_pos_selBands = palsar_hh_hv_pos.select(['HH', 'HV', 'HH_div_HV']);

  // Compute GLCM texture variables
  var glcm = palsar_hh_hv_pos_selBands.glcmTexture({size: neighbourhoodSizeNum});       // if 5, 11 by 11 window
  
  
  // Select a few useful texture variables (also based on literature), computed only on ratio band (found most informative in preliminary analysis), to save storage
  var sel_glcm_vars = ['HH_div_HV_contrast',
                      'HH_div_HV_var',
                      'HH_div_HV_ent',
                      'HH_div_HV_corr',
                      'HH_div_HV_savg'];
  
  
  var sel_glcm = glcm.select(sel_glcm_vars)   

  
  /**
   * Design choice: aim to store more texture variables under storage size limit.
   * Rescale values (upper and lower  based on random samples) to be able to convert to integers to minimize data size (double data type for nationwide coverage results in too big data size, beyond storage capacity at the time),
   * Considering the outlier values likely not helpful.
   */

  function rescale(img, thresholds) {
    return img
        .subtract(thresholds[0]).divide(thresholds[1] - thresholds[0]);
  }
  
  var contrast = rescale(sel_glcm.select('HH_div_HV_contrast'), [13710.52, 228047.59]).multiply(65535).toUint16();
  var variance = rescale(sel_glcm.select('HH_div_HV_var'), [13710.52, 228047.59]).multiply(65535).toUint16();
  var ent = sel_glcm.select('HH_div_HV_ent').multiply(10000).toUint16();
  var corr = sel_glcm.select('HH_div_HV_corr').multiply(10000).add(20000).toUint16();
  var savg = sel_glcm.select('HH_div_HV_savg').toUint16();
  
  
  // Return
  var out = ee.Image.cat(contrast, variance, ent, corr, savg);
  
  return ee.Image(out);                   
  
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// IV. GENERATE SENTINEL-1 TEXTURAL FEATURES //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function makeSentOneTextureFrom10m(VV_dry_10m_mosaic, VH_dry_10m_mosaic, aoiGeom, neighbourhoodSizeNum) {  

  // Merge VV & VH, and clip to aoi
  var VV_VH_dry_10m_mosaic = ee.Image.cat(VV_dry_10m_mosaic, VH_dry_10m_mosaic).clip(aoiGeom);   

  
  // Add ratio band = VV/VH
  VV_VH_dry_10m_mosaic = VV_VH_dry_10m_mosaic.addBands(
    VV_VH_dry_10m_mosaic.select('VV_median_dry').divide(VV_VH_dry_10m_mosaic.select('VH_median_dry'))
    .multiply(10000)                            // Scaling factor 10000 to convert data type to integers
    .rename('VV_div_VH_median_dry'));
  
  
  // Apply offset 10000 to convert data type to unsigned integers
  VV_VH_dry_10m_mosaic = VV_VH_dry_10m_mosaic.add(10000).uint16();
  
  
  // COMPUTE TEXTURE VARIABLES
  // Texture computed only on ratio band to save data size in the study

  var glcm = VV_VH_dry_10m_mosaic.select(['VV_div_VH_median_dry']).glcmTexture({size: neighbourhoodSizeNum});      

  // Only VV/VH band
  var sel_glcm_vars = ['VV_div_VH_median_dry_contrast',
                      'VV_div_VH_median_dry_var',
                      'VV_div_VH_median_dry_ent',
                      'VV_div_VH_median_dry_corr',
                      'VV_div_VH_median_dry_savg']
  

  var sel_glcm = glcm.select(sel_glcm_vars)
  
  /**
   * Design choice: aim to store more texture variables under storage size limit.
   * Rescale values (upper and lower thresholds based on random samples) to be able to convert to integers to minimize data size (double data type for nationwide coverage results in too big data size, beyond storage capacity at the time),
   * Considering the outlier values likely not helpful.
   */
  
  function rescale(img, thresholds) {
    return img
        .subtract(thresholds[0]).divide(thresholds[1] - thresholds[0]);
  }
  
  
  var contrast = rescale(sel_glcm.select('VV_div_VH_median_dry_contrast'), [19466.68, 1923362.89]).multiply(65535).toUint16()
  var variance = rescale(sel_glcm.select('VV_div_VH_median_dry_var'), [13332.97, 1902771.44]).multiply(65535).toUint16()
  var ent = sel_glcm.select('VV_div_VH_median_dry_ent').multiply(10000).toUint16()
  var corr = sel_glcm.select('VV_div_VH_median_dry_corr').multiply(10000).add(20000).toUint16()
  var savg = sel_glcm.select('VV_div_VH_median_dry_savg').toUint16()
  
  
  // Return
  var out = ee.Image.cat(contrast, variance, ent, corr, savg);
  return ee.Image(out);                    
  
}




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// FUNCTIONS TO EXPOSE //////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


exports = {
  makeLandsatComposite: makeLandsatComposite,
  makeLandsatCompositeWeightYears: makeLandsatCompositeWeightYears,
  makeSentOneComposite: makeSentOneComposite,
  makeSentOneCompositeTwoSeasons: makeSentOneCompositeTwoSeasons,
  makePALSARtexture: makePALSARtexture,
  makeSentOneTextureFrom10m: makeSentOneTextureFrom10m
}






