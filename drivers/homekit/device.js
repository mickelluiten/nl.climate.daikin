'use strict';

const Homey = require('homey');
const Device = require('../../drivers/device');
const util = require('../../lib/daikin');

// Device for a Daikin Model HomeKit device
class HomeKitDevice extends Device {
  onInit() {
    super.onInit();

    this.log('HomeKit capability registration started...');
    this.registerCapabilityListener('thermostat_mode', this.onCapabilityMode.bind(this));
    this.registerCapabilityListener('target_temperature', this.onCapabilityAircoTemp.bind(this));
    this.registerCapabilityListener('measure_temperature', this.onCapabilityMeasureTemperature.bind(this));

    this.log('HomeKit registration of Capabilities and Report Listeners completed!');

    // for documentation about the Daikin API look at https://github.com/Apollon77/daikin-controller and at
    // https://github.com/Apollon77/daikin-controller

    this.setCapabilityValue('thermostat_mode', 'off'); // ensure a valid mode is shown at start up...

    this.homekitIsDeleted = false;
    this.refreshData(); // refresh every x-seconds the Homey app with data retrieved from the airco...
  }

  onAdded() {
    this.log('HomeKit device added');
  }

  // this method is called when the Device is deleted
  onDeleted() {
    this.log('HomeKit device deleted');

    this.setSettings({
      homekit_ip: '0.0.0.0',
      homekit_interval: 0,
    })
      .then(this.log('settings for HomeKit are cleared'));

    this.homekitIsDeleted = true;
  }

  // -------- app capabilities --------------

  // Capability 1: Device get/set mode
  onCapabilityMode(thermostat_mode) {
    this.log('onCapabilityMode');
    this.log('mode:', thermostat_mode);

    this.setCapabilityValue('thermostat_mode', thermostat_mode);

    this.daikinModeControl(thermostat_mode);

    return Promise.resolve();
  }

  // Capability 2: Device get/set fan rate >>> Not supported by HomeKit

  // Capability 3: Device get/set fan direction >>> Not supported by HomeKit

  // Capability 4: Device get/set humidity >>> Not supported by HomeKit

  // Capability 5: Device get/set target temperature
  onCapabilityAircoTemp(atemp, opts) {
    this.log('onCapabilityAircoTemp');

    const oldTargetTemperature = this.getState().target_temperature;
    this.log('oldTargetTemperature: ', oldTargetTemperature);

    if (oldTargetTemperature !== atemp) {
      this.log('new target airco temperature °C:', atemp);
      this.setCapabilityValue('target_temperature', atemp);

      const device = this;
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
    this.log('onCapabilityMeasureTemperature');

    // updates by interrogation of the airco, refer to refreshData method.

    return Promise.resolve();
  }

  // -------- airco data retrieval and app refresh/update methods --------------

  // look for changes in the airco its settings made outside of Homey app...
  refreshData() {
    this.log('refreshData');

    if (this.homekitIsDeleted) {
      this.log('HomeKit device has been deleted, the refresh loop is now stopped...');

      return;
    }

    const settings = this.getSettings();
    const homekit_ip = settings.homekit_ip;
    this.log('HomeKit ip-address: ', homekit_ip);
    const homekit_interval = settings.homekit_interval || 10; // to prevent "undefined"...
    this.log('Refresh interval: ', homekit_interval);

    this.deviceRequestControl(homekit_ip);
    this.deviceRequestSensor(homekit_ip);

    setTimeout(this.refreshData.bind(this), homekit_interval * 1000);
  }

  // Interrogate Airconditioner Status
  deviceRequestControl(homekit_ip) {
    this.log('deviceRequestControl');

    util.request_control(homekit_ip, this.updateControlListeners.bind(this));

    return Promise.resolve();
  }

  // Interrogate Airconditioner Temperature Sensor
  deviceRequestSensor(homekit_ip) {
    this.log('deviceRequestSensor');

    util.request_sensor(homekit_ip, this.updateSensorListeners.bind(this));

    return Promise.resolve();
  }

  // Update the app after interrogation of control_request
  updateControlListeners(control_info, control_response) {
    this.log('updateControlListeners');

    // ---- power status
    const apow = Number(control_info[1]);

    // ---- mode
    const airco_modes_homekit = ['auto', 'auto1', 'dehumid', 'cool', 'heat', 'off', 'fan', 'auto2'];
    let amode = Number(control_info[2]);
    // do not differentiate the modes: auto1 and auto2
    if ((amode === 1) || (amode === 7)) amode = 0;
    // Homekit does not support the modes: dehumid and fan
    if ((amode === 2) || (amode === 6)) amode = this.getCapabilityValue('thermostat_mode'); // we stick to the current thermostat_mode
    const thermostat_mode = airco_modes_homekit[amode];
    const capability_mode = this.getCapabilityValue('thermostat_mode');
    this.log('mode:', thermostat_mode);
    this.log('capability_mode:', capability_mode);
    // when the airco is tured off using Daikin AI show mode "OFF" and keep showing that mode
    if ((capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode', thermostat_mode);
    // but when the airco is powered on externally make sure that capability mode "OFF" is cleared by
    // setting it to "auto" which will be overruled by the correct airco mode the next refreshData loop
    if ((apow === 1) && (capability_mode === 'off')) this.setCapabilityValue('thermostat_mode', 'auto');
    // when the airo is powered off externally make sure that capability mode "OFF" is set
    if ((apow === 0) && (capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode', 'off');

    // ---- temperature
    const atemp = Number(control_info[4]);
    this.log('target temperature °C:', atemp);
    this.setCapabilityValue('target_temperature', atemp);

    return Promise.resolve();
  }

  // Update the app after interrogation of sensor_request
  updateSensorListeners(sensor_info) {
    this.log('updateSensorListeners');

    const inside = Number(sensor_info[1]);
    this.setCapabilityValue('measure_temperature', inside);
    this.log('Temp inside:', inside);

    return Promise.resolve();
  }

  // -------- airco control methods --------------

  // POST new Power settings to Airconditioner
  daikinPowerControl(pow) {
    this.log('daikinPowerControl');

    const settings = this.getSettings();
    const homekit_ip = settings.homekit_ip;
    const homekit_useGetToPost = settings.homekit_useGetToPost;
    const homekit_adapter = settings.homekit_adapter;
    let homekit_options = {};
    this.log('firmware < v2.0.1 (then useGetToPost):', homekit_useGetToPost);
    this.log('Adapter model:', homekit_adapter);

    if (homekit_useGetToPost) homekit_options = {
      useGetToPost: true,
    };
    else homekit_options = {
      useGetToPost: false,
    };

    var daikin = new DaikinAC(homekit_ip, homekit_options, ((err) => {
      daikin.setACControlInfo({
        pow,
      });
    }));
    this.log('Power control: ', pow);
  }

  // POST new Mode settings to Airconditioner
  daikinModeControl(thermostat_mode) {
    this.log('daikinModeControl');

    const settings = this.getSettings();
    const homekit_ip = settings.homekit_ip;
    const demo_mode = settings.homekit_demomode;
    const homekit_useGetToPost = settings.homekit_useGetToPost;
    const homekit_adapter = settings.homekit_adapter;
    let homekit_options = {};
    this.log('firmware < v2.0.1 (then useGetToPost):', homekit_useGetToPost);
    this.log('Adapter model:', homekit_adapter);

    if (homekit_useGetToPost) homekit_options = {
      useGetToPost: true,
    };
    else homekit_options = {
      useGetToPost: false,
    };

    util.daikinModeControl(thermostat_mode, homekit_ip, homekit_options, demo_mode);
  }

  // POST new Temperature settings to Airconditioner
  daikinTempControl(atemp) {
    this.log('daikinTempControl');

    const settings = this.getSettings();
    const homekit_ip = settings.homekit_ip;
    const homekit_useGetToPost = settings.homekit_useGetToPost;
    const homekit_adapter = settings.homekit_adapter;
    let homekit_options = {};
    this.log('firmware < v2.0.1 (then useGetToPost):', homekit_useGetToPost);
    this.log('Adapter model:', homekit_adapter);

    if (homekit_useGetToPost) homekit_options = {
      useGetToPost: true,
    };
    else homekit_options = {
      useGetToPost: false,
    };

    util.daikinTempControl(atemp, homekit_ip, homekit_options);
  }
}

module.exports = HomeKitDevice;
