'use strict';

const Homey = require('homey');
const Driver = require('../../drivers/driver');
const airairhphkctrl = require('../../lib/daikin');

// Driver adds HomeKit support for the basic functions of every Daikin airconditioner
class AirAirHPHKDriver extends Driver {
  onInit() {
    this.deviceType = 'airairhphk';

    //* ** standard capabilities use standard flowcards... ** */
	
    /** * TARGET TEMPERATURE BY ACTION ** */
    this._v3actionTargetTemp = new Homey.FlowCardAction('change_target_temp_by');
    this._v3actionTargetTemp
        .register()
        .registerRunListener((args, state) => {
            const device = args.device;
			//this.log('args.device', device);
			const devicestate = device.getState();
            const settings = device.getSettings();

            const ip_address = settings.ip;
            //this.log('ip_address', ip_address);

            const target_temperature = devicestate['target_temperature'];
			const bytemp = args.bytemp;
			const atemp = (target_temperature + bytemp); // change current target temp by x degC
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
