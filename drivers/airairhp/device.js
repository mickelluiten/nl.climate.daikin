'use strict';

const Homey = require('homey');
const Device = require('../../drivers/device');
const util = require('../../lib/daikin');

// Device for a Daikin AirAirHP device
class AirAirHPDevice extends Device {
	onInit() {
		this.log('>>>onInit');
		super.onInit();

		this.log('AirAirHP capability registration started...');
		const settings = this.getSettings();
		const spmode_config = settings.spmode;
		this.log('Special Mode: case', spmode_config);
		switch (spmode_config) {
			case 0:
				this.registerCapabilityListener('thermostat_mode_std', this.onCapabilityMode.bind(this));
				this.setCapabilityValue('thermostat_mode_std', 'off'); // ensure a valid mode is shown at start up...
				break;
			case 1:
				this.registerCapabilityListener('thermostat_mode_std', this.onCapabilityMode.bind(this));
				this.setCapabilityValue('thermostat_mode_std', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('special_mode_eco', this.onCapabilitySpecialModeEco.bind(this));
				this.setCapabilityValue('special_mode_eco', 'off'); // ensure a valid mode is shown at start up...
				break;
			case 2:
				this.registerCapabilityListener('thermostat_mode_std', this.onCapabilityMode.bind(this));
				this.setCapabilityValue('thermostat_mode_std', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('special_mode_pwr', this.onCapabilitySpecialModePwr.bind(this));
				this.setCapabilityValue('special_mode_pwr', 'off'); // ensure a valid mode is shown at start up...
				break;
			case 3:
				this.registerCapabilityListener('thermostat_mode_std', this.onCapabilityMode.bind(this));
				this.setCapabilityValue('thermostat_mode_std', 'off'); // ensure a valid mode is shown at start up...  
				this.registerCapabilityListener('special_mode_eco', this.onCapabilitySpecialModeEco.bind(this));
				this.setCapabilityValue('special_mode_eco', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('special_mode_pwr', this.onCapabilitySpecialModePwr.bind(this));
				this.setCapabilityValue('special_mode_pwr', 'off'); // ensure a valid mode is shown at start up...
				break;
			case 4:
				this.registerCapabilityListener('thermostat_mode_std', this.onCapabilityMode.bind(this));
				this.setCapabilityValue('thermostat_mode_std', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('special_mode_str', this.onCapabilitySpecialModeStr.bind(this));
				this.setCapabilityValue('special_mode_str', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('target_humidity', this.onCapabilityAircoHum.bind(this));
				break;
			case 5:
				this.registerCapabilityListener('thermostat_mode_std', this.onCapabilityMode.bind(this));
				this.setCapabilityValue('thermostat_mode_std', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('special_mode_eco', this.onCapabilitySpecialModeEco.bind(this));
				this.setCapabilityValue('special_mode_eco', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('special_mode_str', this.onCapabilitySpecialModeStr.bind(this));
				this.setCapabilityValue('special_mode_str', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('target_humidity', this.onCapabilityAircoHum.bind(this));
				break;
			case 6:
				this.registerCapabilityListener('thermostat_mode_std', this.onCapabilityMode.bind(this));
				this.setCapabilityValue('thermostat_mode_std', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('special_mode_pwr', this.onCapabilitySpecialModePwr.bind(this));
				this.setCapabilityValue('special_mode_pwr', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('special_mode_str', this.onCapabilitySpecialModeStr.bind(this));
				this.setCapabilityValue('special_mode_str', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('target_humidity', this.onCapabilityAircoHum.bind(this));
				break;
			case 7:
				this.registerCapabilityListener('thermostat_mode_std', this.onCapabilityMode.bind(this));
				this.setCapabilityValue('thermostat_mode_std', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('special_mode_eco', this.onCapabilitySpecialModeEco.bind(this));
				this.setCapabilityValue('special_mode_eco', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('special_mode_pwr', this.onCapabilitySpecialModePwr.bind(this));
				this.setCapabilityValue('special_mode_pwr', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('special_mode_str', this.onCapabilitySpecialModeStr.bind(this));
				this.setCapabilityValue('special_mode_str', 'off'); // ensure a valid mode is shown at start up...
				this.registerCapabilityListener('target_humidity', this.onCapabilityAircoHum.bind(this));
				break;
			default:
				break;
		}
		this.setSettings({
			capability_mode: 'off',
		});

		this.registerCapabilityListener('fan_rate', this.onCapabilityFanRate.bind(this));
		this.registerCapabilityListener('fan_direction', this.onCapabilityFanDir.bind(this));
		this.registerCapabilityListener('target_temperature', this.onCapabilityAircoTemp.bind(this));
		this.registerCapabilityListener('measure_temperature.inside', this.onCapabilityMeasureTemperature.bind(this));
		this.registerCapabilityListener('measure_temperature.outside', this.onCapabilityMeasureTemperature.bind(this));

		this.log('AirAirHP registration of Capabilities and Report Listeners completed!');

        const devcap = this.getCapabilities();
		this.log('devcap =:', devcap);

		// for documentation about the Daikin API look at https://github.com/Apollon77/daikin-controller and at
		// https://github.com/Apollon77/daikin-controller

		this.AirAirHPIsDeleted = false;
		this.refreshData(); // refresh every x-seconds the Homey app with data retrieved from the airco...
	}

	onAdded() {
		this.log('AirAirHP device added');
	}

	// this method is called when the Device is deleted
	onDeleted() {
		this.log('AirAirHP device deleted');

		this.setSettings({
				ip: '0.0.0.0',
				interval: 0,
			})
			.then(this.log('settings for AirAirHP are cleared'));

		this.AirAirHPIsDeleted = true;
	}

	// -------- app capabilities --------------

	// Capability 1: Device get/set mode
	onCapabilityMode(acmode) {
		this.log('>>>onCapabilityMode');
		this.log('Set Daikin AI airco mode to:', acmode);

		this.setCapabilityValue('thermostat_mode_std', acmode);

		this.daikinModeControl(acmode);

		return Promise.resolve();
	}

    // Special mode Econo
	onCapabilitySpecialModeEco(special_mode_eco) {
		this.log('>>>onCapabilitySpecialModeEco');
		this.log('Economy:', special_mode_eco);

		const settings = this.getSettings();
		const ip = settings.ip;
		const useGetToPost = settings.useGetToPost;
		const adapter = settings.adapter;
		let options = {};
		this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
		this.log('Adapter model:', adapter);

		if (useGetToPost) options = {
			useGetToPost: true
		}
		else options = {
			useGetToPost: false
		};

		this.setCapabilityValue('special_mode_eco', special_mode_eco);

		if (special_mode_eco === "on") {
			var advstate = 1;
			this.log('Special mode: On, function: Econo');
		} else {
			var advstate = 0;
			this.log('Special mode: Off, function: Econo');
		};

		util.daikinSpecialModeControl("econo", ip, options, advstate);

		return Promise.resolve();
	}

    // Special mode Powerful
	onCapabilitySpecialModePwr(special_mode_pwr) {
		this.log('>>>onCapabilitySpecialModePwr');
		this.log('Powerful:', special_mode_pwr);

		const settings = this.getSettings();
		const ip = settings.ip;
		const useGetToPost = settings.useGetToPost;
		const adapter = settings.adapter;
		let options = {};
		this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
		this.log('Adapter model:', adapter);

		if (useGetToPost) options = {
			useGetToPost: true
		}
		else options = {
			useGetToPost: false
		};

		this.setCapabilityValue('special_mode_pwr', special_mode_pwr);

		if (special_mode_pwr === "on") {
			var advstate = 1;
			this.log('Special mode: On, function: Powerful');
		} else {
			var advstate = 0;
			this.log('Special mode: Off, function: Powerful');
		};

		util.daikinSpecialModeControl("powerful", ip, options, advstate);

		return Promise.resolve();
	}

    // Special mode Streamer
	onCapabilitySpecialModeStr(special_mode_str) {
		this.log('>>>onCapabilitySpecialModeStr');
		this.log('Streamer:', special_mode_str);

		const settings = this.getSettings();
		const ip = settings.ip;
		const useGetToPost = settings.useGetToPost;
		const adapter = settings.adapter;
		let options = {};
		this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
		this.log('Adapter model:', adapter);

		if (useGetToPost) options = {
			useGetToPost: true
		}
		else options = {
			useGetToPost: false
		};

		this.setCapabilityValue('special_mode_str', special_mode_str);

		if (special_mode_str === "on") {
			var advstate = 1;
			this.log('Special mode: On, function: Streamer');
		} else {
			var advstate = 0;
			this.log('Special mode: Off, function: Steamer');
		};

		util.daikinSpecialModeControl("streamer", ip, options, advstate);

		return Promise.resolve();
	}

	// Capability 2: Device get/set fan rate
	onCapabilityFanRate(fan_rate) {
		this.log('>>>onCapabilityFanRate');

		this.log('fan rate:', fan_rate);
		this.setCapabilityValue('fan_rate', fan_rate);

		this.daikinFanRateControl(fan_rate);

		return Promise.resolve();
	}

	// Capability 3: Device get/set fan direction
	onCapabilityFanDir(fan_direction) {
		this.log('>>>onCapabilityFanDir');

		this.log('fan direction:', fan_direction);
		this.setCapabilityValue('fan_direction', fan_direction);

		this.daikinFanDirControl(fan_direction);

		return Promise.resolve();
	}

	// Capability 4: Device get/set humidity
	onCapabilityAircoHum(ahum) {
		this.log('>>>onCapabilityAircoHum');

	    const oldahum = this.getState()['target_humidity'];
	    this.log('old target humidity: ', oldahum);

		// --- Flowcards logic for humidity triggering
		if (oldahum !== ahum) {
			this.log('New target humidity:', ahum);
			this.setCapabilityValue('target_humidity', ahum);

			const device = this;
			const tokens = {
				humidity_set: ahum
			};

			const state = {
				'target_humidity': ahum
			};

			// trigger action flows as necessary (see driver.js)
			const driver = this.getDriver();
			driver
				.triggerTargetHumidityMoreThan(device, tokens, state)
				.triggerTargetHumidityLessThan(device, tokens, state)
				.triggerTargetHumidityBetween(device, tokens, state);

			// update the airco its settings
			this.daikinHumControl(ahum);
		}

		return Promise.resolve();
	}

	// Capability 5: Device get/set target temperature
	onCapabilityAircoTemp(atemp) {
		this.log('>>>onCapabilityAircoTemp');

		const oldTargetTemperature = this.getState()['target_temperature'];
		this.log('oldTargetTemperature: ', oldTargetTemperature);

		// --- Flowcards logic for target temp triggering
		if (oldTargetTemperature !== atemp) {
			this.log('New target airco temperature °C:', atemp);
			this.setCapabilityValue('target_temperature', atemp);

			const device = this;
			const tokens = {
				temperature_set: atemp
			};

			const state = {
				target_temperature: atemp
			};

			// trigger temperature flows
			const driver = this.getDriver();
			driver
				.triggerTargetTemperatureMoreThan(device, tokens, state)
				.triggerTargetTemperatureLessThan(device, tokens, state)
				.triggerTargetTemperatureBetween(device, tokens, state);

			// update the airco its settings
			this.daikinTempControl(atemp);
		}

		return Promise.resolve();
	}

	// Capability 6 & 7: Device measure in/outside temperature
	onCapabilityMeasureTemperature(inside, outside) {
		this.log('>>>onCapabilityMeasureTemperature');

		// updates by interrogation of the airco, refer to refreshData method.

		return Promise.resolve();
	}

	// -------- airco data retrieval and app refresh/update methods --------------

	// look for changes in the airco its settings made outside of Homey app...
	refreshData() {
		this.log('>>>refreshData');

		if (this.AirAirHPIsDeleted) {
			this.log('AirAirHP device has been deleted, the refresh loop is now stopped...');

			return;
		}

		const settings = this.getSettings();
		const ip = settings.ip;
		this.log('AirAirHP ip-address:', ip);
		const interval = settings.interval || 10; // to prevent "undefined"...
		this.log('Refresh interval:', interval);

		this.deviceRequestControl(ip);
		this.deviceRequestSensor(ip);

		setTimeout(this.refreshData.bind(this), interval * 1000);
	}

	// Interrogate Airconditioner Status
	deviceRequestControl(ip) {
		this.log('>>>deviceRequestControl');

		util.request_control(ip, this.updateControlListeners.bind(this));

		return Promise.resolve();
	}

	// Interrogate Airconditioner Temperature Sensor
	deviceRequestSensor(ip) {
		this.log('>>>deviceRequestSensor');

		util.request_sensor(ip, this.updateSensorListeners.bind(this));

		return Promise.resolve();
	}

	// Update the app after interrogation of control_request
	updateControlListeners(control_info, control_response) {
		this.log('>>>updateControlListeners');

		// ---- power status
		const apow = Number(control_info[1]);

		// ---- mode
		const thermostat_modes = ['auto', 'auto1', 'dehumid', 'cool', 'heat', 'off', 'fan', 'auto2', 'streamer', 'powerful', 'econo'];

		const settings = this.getSettings();
		const oldcapability_mode = settings.capability_mode;
		this.log('oldcapability_mode =', oldcapability_mode);
		const demo_mode = settings.demomode;
		const spmode = settings.spmode;
		this.log('Special mode: case', spmode);

		var amode = Number(control_info[2]);
		if ((amode === 1) || (amode === 7)) amode = 0; // do not differentiate the modes: auto1 and auto2

		const thermostat_mode = thermostat_modes[amode];
		var capability_mode = this.getCapabilityValue('thermostat_mode_std');

		// when the airco is tured off then Daikin AI should show mode "OFF" and keep showing that mode iso the airco mode
		if ((capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_std', thermostat_mode);
		// but when the airco is powered on externally make sure that capability mode "OFF" is cleared by
		// setting it to "auto" which will be overruled by the correct airco mode the next refreshData loop
		if ((apow === 1) && (capability_mode === 'off')) this.setCapabilityValue('thermostat_mode_std', 'auto');
		// when the airo is powered off externally make sure that capability mode "OFF" is set
		if ((apow === 0) && (capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_std', 'off');

		this.setSettings({
			capability_mode
		});
		this.log('mode:', thermostat_mode);
		this.log('capability_mode_std:', capability_mode);

		// --- Flowcards logic for mode triggering
		// check if this is the initial run (after paring).
		if (oldcapability_mode === 'undefined') {
		    this.log('On first run... initialize the oldcapability_mode')	
			oldcapability_mode = capability_mode;
			this.log('oldcapability_mode =', oldcapability_mode);
		}
		if ((oldcapability_mode !== capability_mode) && (demo_mode === false)) {
			this.log('Airco mode has changed, old:', oldcapability_mode, ' new:', capability_mode);

			const device = this;
			const tokens = {
				new_capability_mode: capability_mode,
			};

			const state = {
				capability_mode
			};

			// trigger action flows as necessary (see driver.js)
			const driver = this.getDriver();
			driver
				.triggerCapabilityModeChange(device, tokens, state);
		}

		// ---- temperature
		const atemp = Number(control_info[4]);
		this.log('target temperature °C:', atemp);
		this.setCapabilityValue('target_temperature', atemp);

		// turn thermostat ui component black when AC is turned off (note: a custom airco_mode capability and the thermostat ui component do not work properly together...)
		//if ((capability_mode === 'off')) {
		if ((apow === 0)) {
			const inside_temp = this.getCapabilityValue('measure_temperature.inside');
			const target_temp = this.getCapabilityValue('target_temperature');
			this.setCapabilityValue('target_temperature', inside_temp); // inside = target results in black thermostat ui component

			// update the airco its settings as necessary
			if (target_temp !== inside_temp) {
				this.daikinTempControl(inside_temp);
			}
		}

		// ---- humidity
		if ((spmode === 4) || (spmode === 5) || (spmode === 6) || (spmode === 7)) {
			const ahum = Number(control_info[5]);
		    this.log('Target humidity: ', ahum);
			this.setCapabilityValue('target_humidity', ahum);
		}		

		// ---- fan rate
		const fan_rates = ['A', 'B', '3', '4', '5', '6', '7'];
		let frate_nbr = -1;
		const frate = String(control_info[23]);
		if (frate === 'A') {
			frate_nbr = 0;
		}
		if (frate === 'B') {
			frate_nbr = 1;
		}
		if (frate_nbr !== 0 && frate_nbr !== 1) {
			frate_nbr = parseInt(frate - 1);
		}
		const fan_rate = fan_rates[frate_nbr];
		this.log('frate:', fan_rate);
		this.setCapabilityValue('fan_rate', fan_rate);

		// ---- fan direction
		const fan_directions = ['0', '1', '2', '3'];
		const fdir = Number(control_info[24]);
		const fan_direction = fan_directions[fdir];
		this.setCapabilityValue('fan_direction', fan_direction);
		this.log('fdir:', fan_direction);

		return Promise.resolve();
	}

	// Update the app after interrogation of sensor_request
	updateSensorListeners(sensor_info) {
		this.log('>>>updateSensorListeners');

		var oldInsideTemperature = this.getState()['measure_temperature.inside'];
		this.log('oldInsideTemperature: ', oldInsideTemperature);
		var oldOutsideTemperature = this.getState()['measure_temperature.outside'];
		this.log('oldOutsideTemperature: ', oldOutsideTemperature);

		const inside = Number(sensor_info[1]);
		const outside = Number(sensor_info[3]);
    	this.setCapabilityValue('measure_temperature', inside); // used by the Homey thermostat
		this.setCapabilityValue('measure_temperature.inside', inside);
		this.log('Temp inside:', inside);
		this.setCapabilityValue('measure_temperature.outside', outside);
		this.log('Temp outside:', outside);

		// --- Flowcards logic for inside and outside temperature triggering
		// check if this is the initial run (after paring).
		if (oldInsideTemperature === null) {
			this.log('On first run... initialize the oldInsideTemperature and oldOutsideTemperature');
			oldInsideTemperature = inside;
			this.log('oldInsideTemperature: ', oldInsideTemperature);
			oldOutsideTemperature = outside;
			this.log('oldOutsideTemperature: ', oldOutsideTemperature);
		}
		
		// --- Inside
		if (oldInsideTemperature !== inside) {
			this.log('New inside airco temperature °C:', inside);
			this.setCapabilityValue('measure_temperature.inside', inside);

			const device = this;
			const tokens = {
				inside_temperature: inside
			};

			const state = {
				'measure_temperature.inside': inside
			};

			// trigger inside temperature flows
			const driver = this.getDriver();
			driver
				.triggerInsideTemperatureMoreThan(device, tokens, state)
				.triggerInsideTemperatureLessThan(device, tokens, state)
				.triggerInsideTemperatureBetween(device, tokens, state);
		}

		// --- Outside
		if (oldOutsideTemperature !== outside) {
			this.log('New outside airco temperature °C:', outside);
			this.setCapabilityValue('measure_temperature.outside', outside);

			const device = this;
			const tokens = {
				outside_temperature: outside
			};

			const state = {
				'measure_temperature.outside': outside
			};

			// trigger outside temperature flows
			const driver = this.getDriver();
			driver
				.triggerOutsideTemperatureMoreThan(device, tokens, state)
				.triggerOutsideTemperatureLessThan(device, tokens, state)
				.triggerOutsideTemperatureBetween(device, tokens, state);
		}

		return Promise.resolve();
	}

	// -------- airco control methods --------------

	// POST new Power settings to Airconditioner
	daikinPowerControl(pow) {
		this.log('>>>daikinPowerControl');

		const settings = this.getSettings();
		const ip = settings.ip;
		const useGetToPost = settings.useGetToPost;
		const adapter = settings.adapter;
		let options = {};
		this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
		this.log('Adapter model:', adapter);

		if (useGetToPost) options = {
			useGetToPost: true
		};
		else options = {
			useGetToPost: false
		};

		var daikin = new DaikinAC(ip, options, ((err) => {
			daikin.setACControlInfo({
				pow,
			});
		}));
		this.log('Power control: ', pow);
	}

	// POST new Mode settings to Airconditioner
	daikinModeControl(acmode) {
		this.log('>>>daikinModeControl');

		const settings = this.getSettings();
		const ip = settings.ip;
		const demo_mode = settings.demomode;
		const useGetToPost = settings.useGetToPost;
		const adapter = settings.adapter;
		let options = {};
		this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
		this.log('Adapter model:', adapter);

		if (useGetToPost) options = {
			useGetToPost: true
		};
		else options = {
			useGetToPost: false
		};

		this.log('thermostat_mode_std:', acmode);
		// set thermostat mode i.e. cool, heat etc.
		util.daikinModeControl(acmode, ip, options, demo_mode);
	}

	// POST new Fan Rate settings to Airconditioner
	daikinFanRateControl(fan_rate) {
		this.log('>>>daikinFanRateControl');

		const settings = this.getSettings();
		const ip = settings.ip;
		const useGetToPost = settings.useGetToPost;
		const adapter = settings.adapter;
		let options = {};
		this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
		this.log('Adapter model:', adapter);

		if (useGetToPost) options = {
			useGetToPost: true
		};
		else options = {
			useGetToPost: false
		};

		util.daikinFanRateControl(fan_rate, ip, options);
	}

	// POST new Fan Rate settings to Airconditioner
	daikinFanDirControl(fan_direction) {
		this.log('>>>daikinFanDirControl');

		const settings = this.getSettings();
		const ip = settings.ip;
		const useGetToPost = settings.useGetToPost;
		const adapter = settings.adapter;
		let options = {};
		this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
		this.log('Adapter model:', adapter);

		if (useGetToPost) options = {
			useGetToPost: true
		};
		else options = {
			useGetToPost: false
		};

		util.daikinFanDirControl(fan_direction, ip, options);
	}

	// POST new Temperature settings to Airconditioner
	daikinTempControl(atemp) {
		this.log('>>>daikinTempControl');

		const settings = this.getSettings();
		const ip = settings.ip;
		const useGetToPost = settings.useGetToPost;
		const adapter = settings.adapter;
		let options = {};

		this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
		this.log('Adapter model:', adapter);

		if (useGetToPost) options = {
			useGetToPost: true
		};
		else options = {
			useGetToPost: false
		};

		util.daikinTempControl(atemp, ip, options);
	}

	// POST new Target Humidity settings to Airconditioner
	daikinHumControl(ahum) {
		this.log('>>>daikinHumControl');

		const settings = this.getSettings();
		const ip = settings.ip;
		const useGetToPost = settings.useGetToPost;
		const adapter = settings.adapter;
		let options = {};

		this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
		this.log('Adapter model:', adapter);

		if (useGetToPost) options = {
			useGetToPost: true
		};
		else options = {
			useGetToPost: false
		};

		util.daikinHumControl(ahum, ip, options);
	}
}

module.exports = AirAirHPDevice;
