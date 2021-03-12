'use strict';

const XMLHttpRequest = require('XMLHttpRequest').XMLHttpRequest;
const {
	DaikinAC,
} = require('daikin-controller');

const options = {
	logger: console.log,
}; // optional logger method to get debug logging

exports.request_control = function(ip_address, callback) {
	console.log('exports.request_control');

	const target = `http://${ip_address}`;
	const request = 'GET';
	const parameters = '/aircon/get_control_info';

	const xmlhttp = new XMLHttpRequest();
	xmlhttp.open(request, target + parameters, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.status === 404) {
			console.log("Control error: HTTP 404");
			callback('ctrlerr_404');
		}

		if ((xmlhttp.readyState === 4 && xmlhttp.status === 200)) {
			const response = (function(raw) {
				try {
					return JSON.parse(raw);
				} catch (err) {
					return false;
				}
			})(`{"${xmlhttp.responseText.replace(/=/g, '": "').replace(/,/g, '", "')}"}`);

			if (response) {
				const control_info = [];
				for (const setting in response) {
					control_info.push(response[setting]);
				}
				callback(control_info);
			} else {
				console.log('Control error: JSON.parse(json) failed');
				callback('ctrlerr_parse');
			}
		}
	}
	xmlhttp.send();
};

exports.request_sensor = function(ip_address, callback) {
	console.log('exports.request_sensor');

	const target = `http://${ip_address}`;
	const request = 'GET';
	const parameters = '/aircon/get_sensor_info';

	const xmlhttp = new XMLHttpRequest();
	xmlhttp.open(request, target + parameters, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.status === 404) {
			console.log("Sensor error: HTTP 404");
			callback('sensorerr_404');
		}

		if ((xmlhttp.readyState === 4 && xmlhttp.status === 200)) {
			const response = (function(raw) {
				try {
					return JSON.parse(raw);
				} catch (err) {
					return false;
				}
			})(`{"${xmlhttp.responseText.replace(/=/g, '": "').replace(/,/g, '", "')}"}`);

			if (response) {
				//console.log('raw sensor info: ', response);
				const sensor_info = [];
				for (const setting in response) {
					sensor_info.push(response[setting]);
				}
				callback(sensor_info);
			} else {
				console.log('Sensor error: JSON.parse(json) failed');
				callback('sensorerr_parse');
			}
		}
	}
	xmlhttp.send();
};

// POST new Mode settings to Airconditioner
exports.daikinModeControl = function(airco_mode, ip_address, options, demo_mode) {
	console.log('exports.daikinModeControl');

	let powerctrl = false;
	if (demo_mode === false) {
		powerctrl = true;
	}

	// var options = {'logger': console.log}; // optional logger method to get debug logging
	var daikin = new DaikinAC(ip_address, options, ((err) => {
		// daikin.currentCommonBasicInfo - contains automatically requested basic device data
		// daikin.currentACModelInfo - contains automatically requested device model data
		// modified DaikinAC,js so that currentACControlInfo is sent iso currentACModelInfo
		if (err) {
			console.log(err);
			return;
		}

		switch (airco_mode) {
			case 'off':
				var setpow = false;
				// "power off" is not a mode...
				// daikin.setACControlInfo({"power":setpow}); // does not work for DRY (dehumid) mode
				// power, mode, targettemperature and targethumidity are mandatory parameters for mode changes!
				daikin.setACControlInfo({
					power: setpow,
					mode: 0,
					targetTemperature: 21,
					targetHumidity: 40
				}); // default values assigned...
				return;

				// case "cooling":       var amode = 3; var setpow = powerctrl; // obsolete...
				//                      break;

			case 'cool':
				var amode = 3;
				var setpow = powerctrl; // standard for all models including Homekit
				break;

				// case "heating":       var amode = 4; var setpow = powerctrl; // obsolete...
				//                      break;

			case 'heat':
				var amode = 4;
				var setpow = powerctrl; // standard for all models including Homekit
				break;

			case 'auto':
				var amode = 0;
				var setpow = powerctrl;
				break;

			case 'auto1':
				var amode = 1;
				var setpow = powerctrl;
				break;

			case 'auto2':
				var amode = 7;
				var setpow = powerctrl;
				break;

			case 'dehumid':
				var amode = 2;
				var setpow = powerctrl;
				break;

			case 'fan':
				var amode = 6;
				var setpow = powerctrl;
				break;

			default:
				console.log('unrecognized mode !!, the airco will be powered off (& mode auto is selected) !!');
				var amode = 0;
				var setpow = false;
				break;
		}
		// dehumid and fan mode have no temperature setting assigned, however
		// we must make sure a target temperature is set when we change back to another mode
		let atemp = 21; // just in case targetTemperatureMode1 is not set between 10 - 45 degC
		if (daikin.currentACControlInfo.targetTemperatureMode1 >= 10 && daikin.currentACControlInfo.targetTemperatureMode1 <= 45) {
			atemp = daikin.currentACControlInfo.targetTemperatureMode1;
		}
		if (daikin.currentACControlInfo.targetTemperature >= 10 && daikin.currentACControlInfo.targetTemperature <= 45) {
			atemp = daikin.currentACControlInfo.targetTemperature;
		}
		let shum = 0; // just in case targetHumidityMode1 is not set between 0 - 50 %
		if (daikin.currentACControlInfo.targetHumidityMode1 >= 0 && daikin.currentACControlInfo.targetHumidityMode1 <= 50) {
			shum = daikin.currentACControlInfo.targetHumidityMode1;
		}
		if (daikin.currentACControlInfo.targetHumidity >= 0 && daikin.currentACControlInfo.targetHumidity <= 50) {
			shum = daikin.currentACControlInfo.targetHumidity;
		}
		// power, mode, targettemperature and targethumidity are mandatory parameters for mode changes!
		daikin.setACControlInfo({
			power: setpow,
			mode: amode,
			targetTemperature: atemp,
			targetHumidity: shum
		});
	}));
};

// POST new Speacial Mode settings to Airconditioner
exports.daikinSpecialModeControl = function(special_mode, ip_address, options, advstate) {
	console.log('exports.daikinSpecialModeControl');

	console.log('SpecialModeState; 0=off, 1=on :', advstate);

	var options = {
		logger: console.log
	}; // optional logger method to get debug logging
	var daikin = new DaikinAC(ip_address, options, ((err) => {
		// daikin.currentCommonBasicInfo - contains automatically requested basic device data
		// daikin.currentACModelInfo - contains automatically requested device model data
		// modified DaikinAC,js so that currentACControlInfo is sent iso currentACModelInfo
		if (err) {
			console.log('exports.daikinSpecialModeControl - ERROR:', err);
			return;
		}

		switch (special_mode) {
			case 'streamer':
				var SpecialModeState = advstate;
				var SpecialModeKind = 0;
				break;

			case 'powerful':
				var SpecialModeState = advstate;
				var SpecialModeKind = 1;
				break;

			case 'econo':
				var SpecialModeState = advstate;
				var SpecialModeKind = 2;
				break;

			default:
				console.log('Not a special mode, command discarded !!');
				return;
		}
		// state and kind are mandatory parameters for special mode changes!
		daikin.setACSpecialMode({
			state: SpecialModeState,
			kind: SpecialModeKind
		});
	}));
};

// POST new Fan Rate settings to Airconditioner
exports.daikinFanRateControl = function(fan_rate, ip_address, options) {
	console.log('exports.daikinFanRateControl');

	var daikin = new DaikinAC(ip_address, options, ((err) => {
		if (err) {
			console.log(err);
			return;
		}

		//console.log('Fanrate: ', fan_rate);
		switch (fan_rate) {
			case 'auto':
				var fanRate = 'A';
				break;

			case 'quiet':
				var fanRate = 'B';
				break;

			case 'level1':
				var fanRate = '3';
				break;

			case 'level2':
				var fanRate = '4';
				break;

			case 'level3':
				var fanRate = '5';
				break;

			case 'level4':
				var fanRate = '6';
				break;

			case 'level5':
				var fanRate = '7';
				break;

			default:
				console.log('unrecognized fan rate !!, auto selected !!');
				var fanRate = 'A';
				break;
		}
		daikin.setACControlInfo({
			fanRate,
		});
	}));
};


// POST new Fan Rate settings to Airconditioner
exports.daikinFanDirControl = function(fan_direction, ip_address, options) {
	console.log('exports.daikinFanDirControl');

	var daikin = new DaikinAC(ip_address, options, ((err) => {
		if (err) {
			console.log(err);
			return;
		}

		//console.log('Fan direction: ', fan_direction);
		switch (fan_direction) {
			case 'stop':
				var fanDirection = '0';
				break;

			case 'vertical':
				var fanDirection = '1';
				break;

			case 'horizontal':
				var fanDirection = '2';
				break;

			case '3d':
				var fanDirection = '3';
				break;

			default:
				console.log('unrecognized fan direction !!, fan turned off !!');
				var fanDirection = '0';
				break;
		}
		daikin.setACControlInfo({
			fanDirection,
		});
	}));
};


// POST new Temperature settings to Airconditioner
exports.daikinTempControl = function(atemp, ip_address, options) {
	console.log('exports.daikinTempControl');

	var daikin = new DaikinAC(ip_address, options, ((err) => {
		if (err) {
			console.log(err);
			return;
		}

		daikin.setACControlInfo({
			targetTemperature: atemp
		});
	}));
};

// POST new Temperature settings to Airconditioner
exports.daikinHumControl = function(ahum, ip_address, options) {
	console.log('exports.daikinHumControl');

	var daikin = new DaikinAC(ip_address, options, ((err) => {
		if (err) {
			console.log(err);
			return;
		}

		daikin.setACControlInfo({
			targetHumidity: ahum
		});
	}));
};

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
