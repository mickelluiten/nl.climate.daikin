'use strict';

const Homey = require('homey');
const Driver = require('../../drivers/driver');
const airairhphkctrl = require('../../lib/daikin');

// Driver adds HomeKit support for the basic functions of every Daikin Air2Air Heatpump airconditioner
class AirAirHPHKDriver extends Driver {

	onInit() {
		this.log('>>>onInit driver airairhphk');
		super.onInit();	

		this.deviceType = 'airairhphk';

		//* ** ACTION FLOWCARDS *******************************************************************************************
		/** * TARGET TEMPERATURE BY ACTION == MODEL HOMEKIT ** */
		let actionTargetTempBy = this.homey.flow.getActionCard('change_target_temp_by');
		actionTargetTempBy
			.registerRunListener((args, state) => {
				this.log('actionTargetTempBy fired');
				const device = args.device;
				//this.log('args.device', device);
				const devicestate = device.getState();
				const settings = device.getSettings();

				const ip_address = settings.ip;
				this.log('ip_address', ip_address);

				const target_temperature = devicestate['target_temperature'];
				const bytemp = args.bytemp;
				var atemp = (target_temperature + bytemp); // change current target temp by x degC
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
				//this.log('target temp', atemp);

				// type B adapter logic
				const useGetToPost = settings.useGetToPost;
				const adapter = settings.adapter;
				let options = {};
				//this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
				//this.log('Adapter model:', adapter)
				if (useGetToPost) options = {
					useGetToPost: true,
				};
				else options = {
					useGetToPost: false,
				};

				airairhphkctrl.daikinTempControl(atemp, ip_address, options);
				return Promise.resolve(atemp);
		});

	}

}

module.exports = AirAirHPHKDriver;
