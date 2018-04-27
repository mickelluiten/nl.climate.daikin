"use strict";

const Homey = require('homey');
const XMLHttpRequest = require('XMLHttpRequest').XMLHttpRequest;
const { DaikinAC } = require('daikin-controller');

var options = {'logger': console.log}; // optional logger method to get debug logging

exports.request_control = function(ip_address, callback) {
	console.log('exports.request_control');	

	var target="http://" + ip_address;
	var request="GET";
	var parameters="/aircon/get_control_info";
	
	var xmlhttp=new XMLHttpRequest();
    xmlhttp.open(request,target + parameters ,true);
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			if( xmlhttp.status==200 ){
				var json = '{"' + xmlhttp.responseText.replace(/=/g, '": "').replace(/,/g, '", "') + '"}';
				var response = JSON.parse(json);
                var control_info = [];
                for (var setting in response){
                    control_info.push(response[setting]);
                };
				callback(control_info, response);																																											
			}else{
				console.log("Error: control request failed");
			}
		}else{
			//alert(xmlhttp.readyState);
		}
	}
	
	xmlhttp.send();
}

exports.request_sensor = function (ip_address, callback) {
	console.log('exports.request_sensor');	
	
	var target="http://" + ip_address;
	var request="GET";
	var parameters="/aircon/get_sensor_info";
	
	var xmlhttp=new XMLHttpRequest();
    xmlhttp.open(request,target + parameters, true);
	xmlhttp.onreadystatechange  = function () {
		if ( xmlhttp.readyState == 4 ){
			if( xmlhttp.status==200 ){
				var json = '{"' + xmlhttp.responseText.replace(/=/g, '": "').replace(/,/g, '", "') + '"}';
				var response = JSON.parse(json);
                var sensor_info = [];
                for (var setting in response){
                    sensor_info.push(response[setting]);
                };
                callback(sensor_info);
			}else{
				console.log("Error: sensor request failed");
			}
		}else{
			
			//alert(xmlhttp.readyState);
		}
	}

	xmlhttp.send();
}


// POST new Mode settings to Airconditioner    
exports.daikinModeControl = function(airco_mode, ip_address, demo_mode) {
   console.log('exports.daikinModeControl');

   var powerctrl = false;
   if (demo_mode === false) { powerctrl = true };
      
   var daikin = new DaikinAC(ip_address, options, function(err) {
      // daikin.currentCommonBasicInfo - contains automatically requested basic device data
      // daikin.currentACModelInfo - contains automatically requested device model data           
      // modified DaikinAC,js so that currentACControlInfo is sent iso currentACModelInfo                     
       switch (airco_mode) { 
          case "off":             var setpow = false;
                                  // "power off" is not a mode...
                                  daikin.setACControlInfo({"power":setpow});                                  
                                  return;
          
          case "cooling":         var amode = 3; var setpow = powerctrl;          
                                  break;

          case "cool":            var amode = 3; var setpow = powerctrl; // homekit support
                                  break;
                                                    
          case "heating":         var amode = 4; var setpow = powerctrl;  
                                  break;

          case "heat":            var amode = 4; var setpow = powerctrl; // homekit support  
                                  break;
                                                                                                                            
          case "auto":            var amode = 0; var setpow = powerctrl; 
                                  break;
                                                    
          case "auto1":           var amode = 1; var setpow = powerctrl;    
                                  break;
                                                    
          case "auto2":           var amode = 7; var setpow = powerctrl;  
                                  break;
                                                    
          case "dehumid":         var amode = 2; var setpow = powerctrl;
                                  break;
                                                    
          case "fan":             var amode = 6; var setpow = powerctrl;
                                  break;
                                                    
          default:                console.log('unrecognized mode !!, the airco will be powered off (& mode auto is selected) !!');
                                  var amode = 0; var setpow = false;
                                  break;
       }
       // dehumid and fan mode have no temperature setting assigned, however
       // we must make sure a target temperature is set when we change back to another mode
       var atemp = 21; // just in case targetTemperatureMode1 is not set between 10 - 45 degC
       if (daikin.currentACControlInfo.targetTemperatureMode1 >= 10 && daikin.currentACControlInfo.targetTemperatureMode1 <= 45) { 
           atemp = daikin.currentACControlInfo.targetTemperatureMode1;
       }           
       if (daikin.currentACControlInfo.targetTemperature >= 10 && daikin.currentACControlInfo.targetTemperature <= 45) { 
           atemp = daikin.currentACControlInfo.targetTemperature;
       }           
       var shum = 0; // just in case targetHumidityMode1 is not set between 0 - 50 %
       if (daikin.currentACControlInfo.targetHumidityMode1 >= 0 && daikin.currentACControlInfo.targetHumidityMode1 <= 50) {
           shum = daikin.currentACControlInfo.targetHumidityMode1; 
       }           
       if (daikin.currentACControlInfo.targetHumidity >= 0 && daikin.currentACControlInfo.targetHumidity <= 50) {
           shum = daikin.currentACControlInfo.targetHumidity; 
       }
       // power, mode, targettemperature and targethumidity are mandatory parameters for mode changes!
       daikin.setACControlInfo({"power":setpow, "mode":amode, "targetTemperature":atemp, "targetHumidity":shum});
   });

}  


// POST new Fan Rate settings to Airconditioner    
exports.daikinFanRateControl = function(fan_rate, ip_address) {
   console.log('exports.daikinFanRateControl');
   
   var daikin = new DaikinAC(ip_address, options, function(err) {
       switch (fan_rate) { 
          case "A":         var fanRate = "A";
                            break;
          
          case "B":         var fanRate = "B";
                            break;
                                                    
          case "3":         var fanRate = "3";
                            break;
                                                                  
          case "4":         var fanRate = "4";
                            break;
                                                    
          case "5":         var fanRate = "5";
                            break;
                                                    
          case "6":         var fanRate = "6";
                            break;
                                                    
          case "7":         var fanRate = "7";
                            break;
                                                    
          default:          console.log('unrecognized fan rate !!, auto selected !!');
                            var fanRate = "A";          
                            break;
       }
       daikin.setACControlInfo({"fanRate":fanRate});
   });
    
}  


// POST new Fan Rate settings to Airconditioner    
exports.daikinFanDirControl = function(fan_direction, ip_address) {
   console.log('exports.daikinFanDirControl');
   
   var daikin = new DaikinAC(ip_address, options, function(err) {
       switch (fan_direction) { 
          case "0":         var fanDirection = "0";
                            break;
          
          case "1":         var fanDirection = "1";
                            break;
                                                    
          case "2":         var fanDirection = "2";
                            break;
                                                                  
          case "3":         var fanDirection = "3";
                            break;
                                                    
          default:          console.log('unrecognized fan direction !!, fan turned off !!');
                            var fanDirection = "0";          
                            break;
       }
       daikin.setACControlInfo({"fanDirection":fanDirection});
   });

}


// POST new Temperature settings to Airconditioner    
exports.daikinTempControl = function(atemp, ip_address) {
   console.log('exports.daikinTempControl');
           
   var daikin = new DaikinAC(ip_address, options, function(err) {
     daikin.setACControlInfo({"targetTemperature":atemp});
   });
}


/*
//------- for reference

 get >> /aircon/get_control_info
 
 result:
{ ret: 'OK',
  pow: '0',
  mode: '4',
  adv: '',
  stemp: '25.0',
  shum: '0',
  dt1: '25.0',
  dt2: 'M',
  dt3: '25.0',
  dt4: '25.0',
  dt5: '25.0',
  dt7: '25.0',
  dh1: 'AUTO',
  dh2: '50',
  dh3: '0',
  dh4: '0',
  dh5: '0',
  dh7: 'AUTO',
  dhh: '50',
  b_mode: '4',
  b_stemp: '25.0',
  b_shum: '0',
  alert: '255',
  f_rate: 'A',
  f_dir: '0',
  b_f_rate: 'A',
  b_f_dir: '0',
  dfr1: '5',
  dfr2: '5',
  dfr3: '5',
  dfr4: 'A',
  dfr5: 'A',
  dfr6: '5',
  dfr7: '5',
  dfrh: '5',
  dfd1: '0',
  dfd2: '0',
  dfd3: '0',
  dfd4: '0',
  dfd5: '0',
  dfd6: '0',
  dfd7: '0',
  dfdh: '0' }

 get >> /aircon/get_sensor_info

 result:
{ ret: 'OK',
  htemp: '20.0',
  hhum: '-',
  otemp: '5.0',
  err: '0',
  cmpfreq: '0' }
*/