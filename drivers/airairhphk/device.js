'use strict';

const Homey = require('homey');
const Device = require('../../drivers/device');
const util = require('../../lib/daikin');

// Device for a Daikin AirAirHP Homekit device
class AirAirHPHKDevice extends Device {
  onInit() {
	this.log('>>>onInit device airairhphk');
    super.onInit();

    const deviceCapabilities = this.getCapabilities();
	this.log('Device Capabilities:', deviceCapabilities);

    this.log('AirAirHP Homekit capability registration started...');
    this.registerCapabilityListener('thermostat_mode', this.onCapabilityMode.bind(this));
    this.registerCapabilityListener('target_temperature', this.onCapabilityAircoTemp.bind(this));
    this.registerCapabilityListener('measure_temperature', this.onCapabilityMeasureTemperature.bind(this));

    this.log('AirAirHP Homekit registration of Capabilities and Report Listeners completed!');

    // for documentation about the Daikin API look at https://github.com/Apollon77/daikin-controller and at
    // https://github.com/Apollon77/daikin-controller

    this.setCapabilityValue('thermostat_mode', 'off')
		.catch(this.error); // ensure a valid mode is shown at start up...

    this.AirAirHPHKIsDeleted = false;
    this.refreshData(); // refresh every x-seconds the Homey app with data retrieved from the airco...
  }

  onAdded() {
    this.log('AirAirHP Homekit device added');
  }

  // this method is called when the Device is deleted
  onDeleted() {
    this.log('AirAirHP Homekit device deleted');

    this.setSettings({
      ip: '0.0.0.0',
      interval: 0,
    })
	  .catch(this.error)
      .then(this.log('settings for AirAirHP Homekit are cleared'));

    this.AirAirHPHKIsDeleted = true;
  }

  // -------- app capabilities --------------

  // Capability 1: Device get/set mode
  onCapabilityMode(thermostat_mode) {
    this.log('>>>onCapabilityMode');
    this.log('mode:', thermostat_mode);

    this.setCapabilityValue('thermostat_mode', thermostat_mode)
		.catch(this.error);

    this.daikinModeControl(thermostat_mode);

    return Promise.resolve();
  }

  // Capability 2: Device get/set fan rate >>> Not supported by HomeKit

  // Capability 3: Device get/set fan direction >>> Not supported by HomeKit

  // Capability 4: Device get/set humidity >>> Not supported by HomeKit

  // Capability 5: Device get/set target temperature
  onCapabilityAircoTemp(atemp, opts) {
    this.log('>>>onCapabilityAircoTemp');

    const oldTargetTemperature = this.getState().target_temperature;
    this.log('oldTargetTemperature: ', oldTargetTemperature);

    if (oldTargetTemperature !== atemp) {
      this.log('new target airco temperature °C:', atemp);
      this.setCapabilityValue('target_temperature', atemp)
	  	.catch(this.error);

      const tokens = {
        temperature_set: atemp,
      };
      const state = {
        target_temperature: atemp,
      };

      this.daikinTempControl(atemp);
    }

    return Promise.resolve();
  }

  // Capability 6 & 7: Device measure in/outside temperature >>> only inside temp supported by HomeKit
  onCapabilityMeasureTemperature(inside, opts) {
    this.log('>>>onCapabilityMeasureTemperature');

    // updates by interrogation of the airco, refer to refreshData method.

    return Promise.resolve();
  }

  // -------- airco data retrieval and app refresh/update methods --------------

  // look for changes in the airco its settings made outside of Homey app...
  refreshData() {
    this.log('>>>refreshData');

    if (this.AirAirHPHKIsDeleted) {
      this.log('Air-to-air Homekit device has been deleted, the refresh loop is now stopped...');

      return;
    }

    const settings = this.getSettings();
    const ip = settings.ip;
    this.log('AirAirHPHK ip-address: ', ip);
    const interval = settings.interval || 10; // to prevent "undefined"...
    this.log('Refresh interval: ', interval);

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

	// ---- error handling
	if (!(control_info === 'ctrlerr_404' && control_info === 'ctrlerr_parse')) this.setWarning(null);
	if(control_info === 'ctrlerr_404') { 
		this.setWarning('HTTP 404 error (control)');
		return Promise.resolve();
	}
	if(control_info === 'ctrlerr_parse') {
		this.setWarning('Control update failed (parse err)');
		return Promise.resolve();
	}

    // ---- power status
    const apow = Number(control_info[1]);

    // ---- mode
    const airco_modes = ['auto', 'auto1', 'dehumid', 'cool', 'heat', 'off', 'fan', 'auto2'];
    let amode = Number(control_info[2]);
    // do not differentiate the modes: auto1 and auto2
    if ((amode === 1) || (amode === 7)) amode = 0;
    // Homekit does not support the modes: dehumid and fan
    if ((amode === 2) || (amode === 6)) amode = this.getCapabilityValue('thermostat_mode'); // we stick to the current thermostat_mode
    const thermostat_mode = airco_modes[amode];
    const capability_mode = this.getCapabilityValue('thermostat_mode');
    this.log('mode:', thermostat_mode);
    this.log('capability_mode:', capability_mode);
    // when the airco is tured off using Daikin AI show mode "OFF" and keep showing that mode
    if ((capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode', thermostat_mode)
		.catch(this.error);
    // but when the airco is powered on externally make sure that capability mode "OFF" is cleared by
    // setting it to "auto" which will be overruled by the correct airco mode the next refreshData loop
    if ((apow === 1) && (capability_mode === 'off')) this.setCapabilityValue('thermostat_mode', 'auto')
		.catch(this.error);
    // when the airo is powered off externally make sure that capability mode "OFF" is set
    if ((apow === 0) && (capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode', 'off')
		.catch(this.error);

    // ---- temperature
    const atemp = Number(control_info[4]);
    this.log('target temperature °C:', atemp);
    this.setCapabilityValue('target_temperature', atemp)
		.catch(this.error);

    return Promise.resolve();
  }

  // Update the app after interrogation of sensor_request
  updateSensorListeners(sensor_info) {
    this.log('>>>updateSensorListeners');

	// ---- error handling
	if (!(sensor_info === 'sensorerr_404' && sensor_info === 'sensorerr_parse')) this.setWarning(null);
	if(sensor_info === 'sensorerr_404') { 
		this.setWarning('HTTP 404 error (sensors)');
		return Promise.resolve();
	}
	if(sensor_info === 'sensorerr_parse') {
		this.setWarning('Sensor update failed (parse err)');
		return Promise.resolve();
	}

	// ---- update temperature readings
    const inside = parseFloat(sensor_info[1]); //was >> Number(sensor_info[1]); // Note that parseFloat >> 10.0 = 10, 10.45 = 10.45!!
    this.setCapabilityValue('measure_temperature', inside)
		.catch(this.error);
    this.log('Temp inside:', inside);

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
      useGetToPost: true,
    };
    else options = {
      useGetToPost: false,
    };

    var daikin = new DaikinAC(ip, options, ((err) => {
      daikin.setACControlInfo({
        pow,
      });
    }));
    this.log('Power control: ', pow);
  }

  // POST new Mode settings to Airconditioner
  daikinModeControl(thermostat_mode) {
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
      useGetToPost: true,
    };
    else options = {
      useGetToPost: false,
    };

    util.daikinModeControl(thermostat_mode, ip, options, demo_mode);
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
      useGetToPost: true,
    };
    else options = {
      useGetToPost: false,
    };

    util.daikinTempControl(atemp, ip, options);
  }
}

module.exports = AirAirHPHKDevice;
