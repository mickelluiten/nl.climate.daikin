'use strict';

const Homey = require('homey');
const Driver = require('../../drivers/driver');
const airairhpctrl = require('../../lib/daikin');

// Driver for a Daikin Comfora type Airconditioner
class AirAirHPDriver extends Driver {
	onInit() {
		this.deviceType = 'airairhp';

		//* ** TRIGGER FLOWCARDS *******************************************************************************************
		// --- Humidity flowcards
		/* ** TARGET Humidity TRIGGERS ** */
		this._triggerTargetHumidityMoreThan = new Homey.FlowCardTriggerDevice('change_target_humidity_more_than');
		this._triggerTargetHumidityMoreThan
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state.target_humidity > args.target_humidity_more;
				// this.log('trigger - args.target_humidity_more', args.target_humidity_more);
				// this.log('trigger - state.target_humidity', (state.target_humidity) );
				// this.log('trigger - conditionMet', conditionMet);
				return Promise.resolve(conditionMet);
			});

		this._triggerTargetHumidityLessThan = new Homey.FlowCardTriggerDevice('change_target_humidity_less_than');
		this._triggerTargetHumidityLessThan
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state.target_humidity < args.target_humidity_less;
				return Promise.resolve(conditionMet);
			});

		this._triggerTargetHumidityBetween = new Homey.FlowCardTriggerDevice('change_target_humidity_between');
		this._triggerTargetHumidityBetween
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state.target_humidity > args.target_humidity_from && state.target_humidity < args.target_humidity_to;
				return Promise.resolve(conditionMet);
			});

		// --- Temperature flowcards
		/* ** TARGET TEMPERATURE TRIGGERS ** */
		this._triggerTargetTemperatureMoreThan = new Homey.FlowCardTriggerDevice('change_target_temperature_more_than');
		this._triggerTargetTemperatureMoreThan
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state.target_temperature > args.target_temperature_more;
				// this.log('trigger - args.target_temperature_more', args.target_temperature_more);
				// this.log('trigger - state.target_temperature', (state.target_temperature) );
				// this.log('trigger - conditionMet', conditionMet);
				return Promise.resolve(conditionMet);
			});

		this._triggerTargetTemperatureLessThan = new Homey.FlowCardTriggerDevice('change_target_temperature_less_than');
		this._triggerTargetTemperatureLessThan
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state.target_temperature < args.target_temperature_less;
				return Promise.resolve(conditionMet);
			});

		this._triggerTargetTemperatureBetween = new Homey.FlowCardTriggerDevice('change_target_temperature_between');
		this._triggerTargetTemperatureBetween
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state.target_temperature > args.target_temperature_from && state.target_temperature < args.target_temperature_to;
				return Promise.resolve(conditionMet);
			});

		/** * INSIDE TEMPERATURE TRIGGERS ** */
		this._triggerInsideTemperatureMoreThan = new Homey.FlowCardTriggerDevice('inside_temperature_more_than');
		this._triggerInsideTemperatureMoreThan
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state['measure_temperature.inside'] > args.inside_temperature_more;
				//this.log('trigger - args.inside_temperature_more', args.inside_temperature_more);
				//this.log('trigger - state()[measure_temperature.inside]', ( state['measure_temperature.inside']) );
				//this.log('trigger - conditionMet inside temp', conditionMet);
				return Promise.resolve(conditionMet);
			});

		this._triggerInsideTemperatureLessThan = new Homey.FlowCardTriggerDevice('inside_temperature_less_than');
		this._triggerInsideTemperatureLessThan
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state['measure_temperature.inside'] < args.inside_temperature_less;
				return Promise.resolve(conditionMet);
			});

		this._triggerInsideTemperatureBetween = new Homey.FlowCardTriggerDevice('inside_temperature_between');
		this._triggerInsideTemperatureBetween
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state['measure_temperature.inside'] > args.inside_temperature_from && state['measure_temperature.inside'] < args.inside_temperature_to;
				return Promise.resolve(conditionMet);
			});

		/** * OUTSIDE TEMPERATURE TRIGGERS ** */
		this._triggerOutsideTemperatureMoreThan = new Homey.FlowCardTriggerDevice('outside_temperature_more_than');
		this._triggerOutsideTemperatureMoreThan
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state['measure_temperature.outside'] > args.outside_temperature_more;
				// this.log('trigger - args.outside_temperature_more', args.outside_temperature_more);
				// this.log('trigger - state[measure_temperature.outside]', ( state['measure_temperature.outside']) );
				// this.log('trigger - conditionMet outside temp', conditionMet);
				return Promise.resolve(conditionMet);
			});

		this._triggerOutsideTemperatureLessThan = new Homey.FlowCardTriggerDevice('outside_temperature_less_than');
		this._triggerOutsideTemperatureLessThan
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state['measure_temperature.outside'] < args.ouside_temperature_less;
				return Promise.resolve(conditionMet);
			});

		this._triggerOutsideTemperatureBetween = new Homey.FlowCardTriggerDevice('outside_temperature_between');
		this._triggerOutsideTemperatureBetween
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state['measure_temperature.outside'] > args.outside_temperature_from && state['measure_temperature.outside'] < args.outside_temperature_to;
				return Promise.resolve(conditionMet);
			});

		/** * MODE CHANGE TRIGGER ** */
		this._triggerAircoMode = new Homey.FlowCardTriggerDevice('mode_changed');
		this._triggerAircoMode
			.register()
			.registerRunListener((args, state) => {
				const conditionMet = state.capability_mode === args.mode;
				// this.log('trigger - args.mode', args.mode);
				// this.log('trigger - state[capability_mode]', ( state['capability_mode']) );
				// this.log('trigger - conditionMet capability_mode', conditionMet);
				return Promise.resolve(conditionMet);
			});

		//* ** CONDITION FLOWCARDS *******************************************************************************************
		/* ** TARGET HUMIDITY CONDITIONS ** */
		this._conditionTargetHumidityMoreThan = new Homey.FlowCardCondition('has_target_humidity_more_than');
		this._conditionTargetHumidityMoreThan
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate.target_humidity > args.target_humidity_more;
				// this.log('condition args.target_humidity_more', args.target_humidity_more);
				// this.log('condition devicestate.target_humidity', devicestate.target_humidity);
				// this.log('condition conditionMet', conditionMet);
				return Promise.resolve(conditionMet);
			});

		this._conditionTargetHumidityLessThan = new Homey.FlowCardCondition('has_target_humidity_less_than');
		this._conditionTargetHumidityLessThan
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate.target_humidity < args.target_humidity_less;
				return Promise.resolve(conditionMet);
			});

		this._conditionTargetHumidityBetween = new Homey.FlowCardCondition('has_target_humidity_between');
		this._conditionTargetHumidityBetween
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate.target_humidity > args.target_humidity_from && devicestate.target_humidity < args.target_humidity_to;
				return Promise.resolve(conditionMet);
			});

		/* ** TARGET TEMPERATURE CONDITIONS ** */
		this._conditionTargetTemperatureMoreThan = new Homey.FlowCardCondition('has_target_temperature_more_than');
		this._conditionTargetTemperatureMoreThan
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate.target_temperature > args.target_temperature_more;
				// this.log('condition args.target_temperature_more', args.target_temperature_more);
				// this.log('condition devicestate.target_temperature', devicestate.target_temperature);
				// this.log('condition conditionMet', conditionMet);
				return Promise.resolve(conditionMet);
			});

		this._conditionTargetTemperatureLessThan = new Homey.FlowCardCondition('has_target_temperature_less_than');
		this._conditionTargetTemperatureLessThan
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate.target_temperature < args.target_temperature_less;
				return Promise.resolve(conditionMet);
			});

		this._conditionTargetTemperatureBetween = new Homey.FlowCardCondition('has_target_temperature_between');
		this._conditionTargetTemperatureBetween
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate.target_temperature > args.target_temperature_from && devicestate.target_temperature < args.target_temperature_to;
				return Promise.resolve(conditionMet);
			});

		/** * INSIDE TEMPERATURE CONDITIONS ** */
		this._conditionInsideTemperatureMoreThan = new Homey.FlowCardCondition('has_inside_temperature_more_than');
		this._conditionInsideTemperatureMoreThan
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate['measure_temperature.inside'] > args.inside_temperature_more;
				// this.log('condition - [measure_temperature.inside]', devicestate['measure_temperature.inside']);
				// this.log('condition - args.inside_temperature_more', args.inside_temperature_more);
				// this.log('condition - conditionMet inside temp', conditionMet);
				return Promise.resolve(conditionMet);
			});

		this._conditionInsideTemperatureLessThan = new Homey.FlowCardCondition('has_inside_temperature_less_than');
		this._conditionInsideTemperatureLessThan
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate['measure_temperature.inside'] < args.inside_temperature_less;
				return Promise.resolve(conditionMet);
			});

		this._conditionInsideTemperatureBetween = new Homey.FlowCardCondition('has_inside_temperature_between');
		this._conditionInsideTemperatureBetween
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate['measure_temperature.inside'] > args.inside_temperature_from && devicestate['measure_temperature.inside'] < args.inside_temperature_to;
				return Promise.resolve(conditionMet);
			});

		/** * OUTSIDE TEMPERATURE CONDITIONS ** */
		this._conditionOutsideTemperatureMoreThan = new Homey.FlowCardCondition('has_outside_temperature_more_than');
		this._conditionOutsideTemperatureMoreThan
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate['measure_temperature.outside'] > args.outside_temperature_more;
				// this.log('condition - [measure_temperature.outside]', devicestate['measure_temperature.outside']);
				// this.log('condition - args.outside_temperature_more', args.outside_temperature_more);
				// this.log('condition - conditionMet outside temp', conditionMet);
				return Promise.resolve(conditionMet);
			});

		this._conditionOutsideTemperatureLessThan = new Homey.FlowCardCondition('has_outside_temperature_less_than');
		this._conditionOutsideTemperatureLessThan
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate['measure_temperature.outside'] < args.outside_temperature_less;
				return Promise.resolve(conditionMet);
			});

		this._conditionOutsideTemperatureBetween = new Homey.FlowCardCondition('has_outside_temperature_between');
		this._conditionOutsideTemperatureBetween
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate['measure_temperature.outside'] > args.outside_temperature_from && devicestate['measure_temperature.outside'] < args.outside_temperature_to;
				return Promise.resolve(conditionMet);
			});

		/* ** MODE CHANGE CONDITIONS ** */
		this._conditionAircoMode = new Homey.FlowCardCondition('mode_equals');
		this._conditionAircoMode
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const settings = device.getSettings();
				const conditionMet = settings.capability_mode === args.mode;
				// this.log('condition - [settings.capability_mode]', settings.capability_mode);
				// this.log('condition - args.mode', args.mode);
				// this.log('condition - conditionMet capability_mode', conditionMet);
				return Promise.resolve(conditionMet);
			});

		/* ** ECONO MODE CHANGE CONDITIONS ** */
		this._conditionSmodeEcono = new Homey.FlowCardCondition('mode_econo_equals');
		this._conditionSmodeEcono
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate['special_mode_eco'] === args.smode_econo;
				// this.log('condition - [special_mode_eco]', devicestate['special_mode_eco']);
				// this.log('condition - args.smode_econo', args.smode_econo);
				// this.log('condition - conditionMet econo mode', conditionMet);
				return Promise.resolve(conditionMet);
			});

		/* ** POWERFUL MODE CHANGE CONDITIONS ** */
		this._conditionSmodePwrFul = new Homey.FlowCardCondition('mode_pwrful_equals');
		this._conditionSmodePwrFul
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate['special_mode_pwr'] === args.smode_pwrful;
				return Promise.resolve(conditionMet);
			});

		/* ** STREAMER MODE CHANGE CONDITIONS ** */
		this._conditionSmodeStrmr = new Homey.FlowCardCondition('mode_strmr_equals');
		this._conditionSmodeStrmr
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const devicestate = device.getState();
				const conditionMet = devicestate['special_mode_str'] === args.smode_strmr;
				return Promise.resolve(conditionMet);
			});

		//* ** ACTION FLOWCARDS *******************************************************************************************
		/** * TARGET TEMPERATURE ACTION ** */
		this._actionTargetHum = new Homey.FlowCardAction('change_target_hum');
		this._actionTargetHum
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const ahum = args.ahum;
				device.setCapabilityValue('target_humidity', ahum);
				this.log('target hum', ahum);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinHumControl(ahum, ip_address, options);
				return Promise.resolve(ahum);
			});

		/** * TARGET TEMPERATURE ACTION ** */
		this._actionTargetTemp = new Homey.FlowCardAction('change_target_temp');
		this._actionTargetTemp
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const atemp = args.atemp;
				device.setCapabilityValue('target_temperature', atemp);
				this.log('target temp', atemp);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinTempControl(atemp, ip_address, options);
				return Promise.resolve(atemp);
			});

		/** * TARGET TEMPERATURE BY ACTION ** */
		this._actionTargetTemp = new Homey.FlowCardAction('change_target_temp_by');
		this._actionTargetTemp
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				//this.log('args.device', device);
				const devicestate = device.getState();
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const target_temperature = devicestate['target_temperature'];
				const bytemp = args.bytemp;
				var atemp = (target_temperature + bytemp); // change current target temp by x degC, x is between -5 and +5 degC
				// Check the thermostat mode, unfortunately the use of special airco modes make this a bit complicated... 
				const spmode = settings.spmode;
				var thermostat_mode = devicestate['thermostat_mode'];
				this.log('thermostat_mode: ', thermostat_mode);

				switch (thermostat_mode) {
					case 'cool':
						this.log('Cooling range limits applied');
						if (atemp < 18) {
							atemp = 18
						};
						if (atemp > 32) {
							atemp = 32
						};
						break;
					case 'heat':
						this.log('Heating range limits applied');
						if (atemp < 10) {
							atemp = 10
						};
						if (atemp > 30) {
							atemp = 30
						};
						break;
					default:
						break;
				}
				device.setCapabilityValue('target_temperature', atemp);
				this.log('target temp', atemp);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				//this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				//this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinTempControl(atemp, ip_address, options);
				return Promise.resolve(atemp);
			});

		// --- MODE CHANGE ACTIONS
		this._actionAircoMode = new Homey.FlowCardAction('change_mode');
		this._actionAircoMode
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const demo_mode = settings.demomode;
				// this.log('demo_mode', demo_mode);

				const thermostat_mode = args.mode;
				const spmode = settings.spmode;
				device.setCapabilityValue('thermostat_mode', thermostat_mode);
				this.log('thermostat_mode: ', thermostat_mode);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinModeControl(thermostat_mode, ip_address, options, demo_mode);
				return Promise.resolve(thermostat_mode);
			});

		// --- ECONO ACTIONS
		this._actionEcono = new Homey.FlowCardAction('change_smode_econo');
		this._actionEcono
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const economode = args.smecono;
				device.setCapabilityValue('special_mode_eco', economode);
				this.log('special_mode_eco: ', economode);

				if (economode === "on") {
					var advstate = 1;
					this.log('Econo mode: On');
				} else {
					var advstate = 0;
					this.log('Econo mode: Off');
				};

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinSpecialModeControl("econo", ip_address, options, advstate);
				return Promise.resolve(economode);
			});

		// --- POWERFUL ACTIONS
		this._actionPwrFul = new Homey.FlowCardAction('change_smode_pwrful');
		this._actionPwrFul
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const pwrfulmode = args.smpwrful;
				device.setCapabilityValue('special_mode_pwr', pwrfulmode);
				this.log('special_mode_pwr: ', pwrfulmode);

				if (pwrfulmode === "on") {
					var advstate = 1;
					this.log('Powerful mode: On');
				} else {
					var advstate = 0;
					this.log('Powerful mode: Off');
				};

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinSpecialModeControl("powerful", ip_address, options, advstate);
				return Promise.resolve(pwrfulmode);
			});

			// --- STREAMER ACTIONS
			this._actionStrmr = new Homey.FlowCardAction('change_smode_strmr');
			this._actionStrmr
				.register()
				.registerRunListener((args, state) => {
					const device = args.device;
					const settings = device.getSettings();

					const ip_address = settings.ip;
					this.log('ip_address', ip_address);

					const strmrmode = args.smstrmr;
					device.setCapabilityValue('special_mode_str', strmrmode);
					this.log('special_mode_str: ', strmrmode);

					if (strmrmode === "on") {
						var advstate = 1;
						this.log('Streamer mode: On');
					} else {
						var advstate = 0;
						this.log('Streamer mode: Off');
					};

					// type B adapter logic
					const useGetToPost = settings.useGetToPost;
					const adapter = settings.adapter;
					let options = {};
					// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
					// this.log('Adapter model:', adapter)
					if (useGetToPost) options = {
						useGetToPost: true
					};
					else options = {
						useGetToPost: false
					};

					airairhpctrl.daikinSpecialModeControl("streamer", ip_address, options, advstate);
					return Promise.resolve(strmrmode);
				});

		// --- FAN RATE ACTIONS
		this._actionFanRate = new Homey.FlowCardAction('change_fan_rate');
		this._actionFanRate
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const fan_rate = args.frate;
				device.setCapabilityValue('fan_rate', fan_rate);
				this.log('fan_rate', fan_rate);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinFanRateControl(fan_rate, ip_address, options);
				return Promise.resolve(fan_rate);
			});

		// --- FAN DIRECTION ACTIONS
		this._actionFanDirection = new Homey.FlowCardAction('change_fan_direction');
		this._actionFanDirection
			.register()
			.registerRunListener((args, state) => {
				const device = args.device;
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const fan_direction = args.fdir;
				device.setCapabilityValue('fan_direction', fan_direction);
				this.log('fan_direction', fan_direction);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				// this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				// this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true
				};
				else options = {
					useGetToPost: false
				};

				airairhpctrl.daikinFanDirControl(fan_direction, ip_address, options);
				return Promise.resolve(fan_direction);
			});
	}

	// --- METHODS FOR TEMPERATURE FLOWCARD TRIGGERS
	/*
	 * Triggers the 'temperature' flows
	 * @param {Device} device - A Device instance
	 * @param {Object} tokens - An object with tokens and their typed values, as defined in the app.json
	 * @param {Object} state - An object with properties which are accessible throughout the Flow
	 */
	// --- Target Humidity triggering
	triggerTargetHumidityMoreThan(device, tokens, state) {
		this.triggerFlow(this._triggerTargetHumidityMoreThan, device, tokens, state);
		return this;
	}

	triggerTargetHumidityLessThan(device, tokens, state) {
		this.triggerFlow(this._triggerTargetHumidityLessThan, device, tokens, state);
		return this;
	}

	triggerTargetHumidityBetween(device, tokens, state) {
		this.triggerFlow(this._triggerTargetHumidityBetween, device, tokens, state);
		return this;
	}
	
	// --- Target Temperature triggering
	triggerTargetTemperatureMoreThan(device, tokens, state) {
		this.triggerFlow(this._triggerTargetTemperatureMoreThan, device, tokens, state);
		return this;
	}

	triggerTargetTemperatureLessThan(device, tokens, state) {
		this.triggerFlow(this._triggerTargetTemperatureLessThan, device, tokens, state);
		return this;
	}

	triggerTargetTemperatureBetween(device, tokens, state) {
		this.triggerFlow(this._triggerTargetTemperatureBetween, device, tokens, state);
		return this;
	}

	// --- Inside Temperature triggering
	triggerInsideTemperatureMoreThan(device, tokens, state) {
		this.triggerFlow(this._triggerInsideTemperatureMoreThan, device, tokens, state);
		return this;
	}

	triggerInsideTemperatureLessThan(device, tokens, state) {
		this.triggerFlow(this._triggerInsideTemperatureLessThan, device, tokens, state);
		return this;
	}

	triggerInsideTemperatureBetween(device, tokens, state) {
		this.triggerFlow(this._triggerInsideTemperatureBetween, device, tokens, state);
		return this;
	}

	// --- Outside Temperature triggering
	triggerOutsideTemperatureMoreThan(device, tokens, state) {
		this.triggerFlow(this._triggerOutsideTemperatureMoreThan, device, tokens, state);
		return this;
	}

	triggerOutsideTemperatureLessThan(device, tokens, state) {
		this.triggerFlow(this._triggerOutsideTemperatureLessThan, device, tokens, state);
		return this;
	}

	triggerOutsideTemperatureBetween(device, tokens, state) {
		this.triggerFlow(this._triggerOusideTemperatureBetween, device, tokens, state);
		return this;
	}

	// --- METHODS FOR MODE FLOWCARD TRIGGERS
	// --- Mode triggering
	triggerCapabilityModeChange(device, tokens, state) {
		this.triggerFlow(this._triggerAircoMode, device, tokens, state);
		return this;
	}
}

module.exports = AirAirHPDriver;
