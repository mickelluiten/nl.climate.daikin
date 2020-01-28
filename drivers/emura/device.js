'use strict';

const Homey = require('homey');
const Device = require('../../drivers/device');
const util = require('../../lib/daikin');

// Device for a Daikin Emura device
class EmuraDevice extends Device {
  onInit() {
    super.onInit();

    this.log('Emura capability registration started...');
    const settings = this.getSettings();
    const spmode_config = settings.emura_spmode;
    switch (spmode_config) {
      case 0:
        this.registerCapabilityListener('thermostat_mode_std', this.onCapabilityMode.bind(this));
        this.setCapabilityValue('thermostat_mode_std', 'off'); // ensure a valid mode is shown at start up...
        break;
      case 1:
        this.registerCapabilityListener('thermostat_mode_ext1', this.onCapabilityExtendedMode.bind(this));
        this.setCapabilityValue('thermostat_mode_ext1', 'off'); // ensure a valid mode is shown at start up...
        break;
      case 2:
        this.registerCapabilityListener('thermostat_mode_ext2', this.onCapabilityExtendedMode.bind(this));
        this.setCapabilityValue('thermostat_mode_ext2', 'off'); // ensure a valid mode is shown at start up...
        break;
      case 3:
        this.registerCapabilityListener('thermostat_mode_ext3', this.onCapabilityExtendedMode.bind(this));
        this.setCapabilityValue('thermostat_mode_ext3', 'off'); // ensure a valid mode is shown at start up...
        break;
      case 4:
        this.registerCapabilityListener('thermostat_mode_ext4', this.onCapabilityExtendedMode.bind(this));
        this.setCapabilityValue('thermostat_mode_ext4', 'off'); // ensure a valid mode is shown at start up...
        break;
      case 5:
        this.registerCapabilityListener('thermostat_mode_ext5', this.onCapabilityExtendedMode.bind(this));
        this.setCapabilityValue('thermostat_mode_ext5', 'off'); // ensure a valid mode is shown at start up...
        break;
      case 6:
        this.registerCapabilityListener('thermostat_mode_ext6', this.onCapabilityExtendedMode.bind(this));
        this.setCapabilityValue('thermostat_mode_ext6', 'off'); // ensure a valid mode is shown at start up...
        break;
      case 7:
        this.registerCapabilityListener('thermostat_mode_ext7', this.onCapabilityExtendedMode.bind(this));
        this.setCapabilityValue('thermostat_mode_ext7', 'off'); // ensure a valid mode is shown at start up...
        break;
      default:
        break;
    }
    this.setSettings({
      capability_mode: 'off',
    });

    this.registerCapabilityListener('fan_rate', this.onCapabilityFanRate.bind(this));
    this.registerCapabilityListener('fan_direction', this.onCapabilityFanDir.bind(this));
    // this.registerCapabilityListener('target_humidity', this.onCapabilityAircoHum.bind(this));
    this.registerCapabilityListener('target_temperature', this.onCapabilityAircoTemp.bind(this));
    this.registerCapabilityListener('measure_temperature', this.onCapabilityMeasureTemperature.bind(this));
    this.registerCapabilityListener('measure_temperature.inside', this.onCapabilityMeasureTemperature.bind(this));
    this.registerCapabilityListener('measure_temperature.outside', this.onCapabilityMeasureTemperature.bind(this));

    this.log('Emura registration of Capabilities and Report Listeners completed!');

    // for documentation about the Daikin API look at https://github.com/Apollon77/daikin-controller and at
    // https://github.com/Apollon77/daikin-controller

    this.emuraIsDeleted = false;
    this.refreshData(); // refresh every x-seconds the Homey app with data retrieved from the airco...
  }

  onAdded() {
    this.log('Emura device added');
  }

  // this method is called when the Device is deleted
  onDeleted() {
    this.log('Emura device deleted');

    this.setSettings({
      emura_ip: '0.0.0.0',
      emura_interval: 0,
    })
      .then(this.log('settings for Emura are cleared'));

    this.emuraIsDeleted = true;
  }

  // -------- app capabilities --------------

  // Capability 1: Device get/set mode
  onCapabilityMode(thermostat_mode_standard) {
    this.log('onCapabilityMode');
    this.log('mode:', thermostat_mode_standard);

    this.setCapabilityValue('thermostat_mode_std', thermostat_mode_standard);

    this.daikinModeControl(thermostat_mode_standard);

    return Promise.resolve();
  }

  onCapabilityExtendedMode(thermostat_mode_extended) {
    this.log('onCapabilityExtendedMode');
    this.log('extended mode:', thermostat_mode_extended);

    const settings = this.getSettings();
    const spmode_config = settings.emura_spmode;
    switch (spmode_config) {
      case 1:
        this.setCapabilityValue('thermostat_mode_ext1', thermostat_mode_extended);
        break;
      case 2:
        this.setCapabilityValue('thermostat_mode_ext2', thermostat_mode_extended);
        break;
      case 3:
        this.setCapabilityValue('thermostat_mode_ext3', thermostat_mode_extended);
        break;
      case 4:
        this.setCapabilityValue('thermostat_mode_ext4', thermostat_mode_extended);
        break;
      case 5:
        this.setCapabilityValue('thermostat_mode_ext5', thermostat_mode_extended);
        break;
      case 6:
        this.setCapabilityValue('thermostat_mode_ext6', thermostat_mode_extended);
        break;
      case 7:
        this.setCapabilityValue('thermostat_mode_ext7', thermostat_mode_extended);
        break;
      default:
        break;
    }
    this.daikinModeControl(thermostat_mode_extended);

    return Promise.resolve();
  }

  // Capability 2: Device get/set fan rate
  onCapabilityFanRate(fan_rate) {
    this.log('onCapabilityFanRate');

    this.log('fan rate:', fan_rate);
    this.setCapabilityValue('fan_rate', fan_rate);

    this.daikinFanRateControl(fan_rate);

    return Promise.resolve();
  }

  // Capability 3: Device get/set fan direction
  onCapabilityFanDir(fan_direction) {
    this.log('onCapabilityFanDir');

    this.log('fan direction:', fan_direction);
    this.setCapabilityValue('fan_direction', fan_direction);

    this.daikinFanDirControl(fan_direction);

    return Promise.resolve();
  }

  /*
    // Capability 4: Device get/set humidity
    onCapabilityAircoHum(ahum) {
		this.log('onCapabilityAircoHum');

		this.log('humidity %:', ahum);
    	this.setCapabilityValue('target_humidity', ahum);

        return Promise.resolve();
	}
*/

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

      // trigger temperature flows
      const driver = this.getDriver();
      driver
        .triggerTargetTemperatureMoreThan(device, tokens, state)
        .triggerTargetTemperatureLessThan(device, tokens, state)
        .triggerTargetTemperatureBetween(device, tokens, state)
        .v3triggerTargetTemperatureMoreThan(device, tokens, state)
        .v3triggerTargetTemperatureLessThan(device, tokens, state)
        .v3triggerTargetTemperatureBetween(device, tokens, state);
      // update the airco its settings
      this.daikinTempControl(atemp);
    }

    return Promise.resolve();
  }

  // Capability 6 & 7: Device measure in/outside temperature
  onCapabilityMeasureTemperature(inside, outside) {
    this.log('onCapabilityMeasureTemperature');

    // updates by interrogation of the airco, refer to refreshData method.

    return Promise.resolve();
  }

  // -------- airco data retrieval and app refresh/update methods --------------

  // look for changes in the airco its settings made outside of Homey app...
  refreshData() {
    this.log('refreshData');

    if (this.emuraIsDeleted) {
      this.log('Emura device has been deleted, the refresh loop is now stopped...');

      return;
    }

    const settings = this.getSettings();
    const emura_ip = settings.emura_ip;
    this.log('Emura ip-address: ', emura_ip);
    const emura_interval = settings.emura_interval || 10; // to prevent "undefined"...
    this.log('Refresh interval: ', emura_interval);

    this.deviceRequestControl(emura_ip);
    this.deviceRequestSensor(emura_ip);

    setTimeout(this.refreshData.bind(this), emura_interval * 1000);
  }

  // Interrogate Airconditioner Status
  deviceRequestControl(emura_ip) {
    this.log('deviceRequestControl');

    util.request_control(emura_ip, this.updateControlListeners.bind(this));

    return Promise.resolve();
  }

  // Interrogate Airconditioner Temperature Sensor
  deviceRequestSensor(emura_ip) {
    this.log('deviceRequestSensor');

    util.request_sensor(emura_ip, this.updateSensorListeners.bind(this));

    return Promise.resolve();
  }

  // Update the app after interrogation of control_request
  updateControlListeners(control_info, control_response) {
    this.log('updateControlListeners');

    // ---- power status
    const apow = Number(control_info[1]);

    // ---- mode
    const thermostat_modes = ['auto', 'auto1', 'dehumid', 'cool', 'heat', 'off', 'fan', 'auto2', 'streamer', 'powerful', 'econo'];

    const settings = this.getSettings();
    const oldcapability_mode = settings.capability_mode;
    const demo_mode = settings.emura_demomode;
    const emura_spmode = settings.emura_spmode;
    this.log('Special mode set:', emura_spmode);

    if (emura_spmode !== 0) {
      var amode = Number(control_info[2]);
      if ((amode === 1) || (amode === 7)) amode = 0; // do not differentiate the modes: auto1 and auto2

      const advmode = Number(control_info[3]);
      if (advmode == 13) amode = 8;
      if (advmode == 2) amode = 9;
      if (advmode == 12) amode = 10;

      const thermostat_mode = thermostat_modes[amode];
      const spmode_config = settings.emura_spmode;
      switch (spmode_config) {
        case 1:
          var capability_mode = this.getCapabilityValue('thermostat_mode_ext1');
          // when the airco is tured off then Daikin AI should show mode "OFF" and keep showing that mode iso the airco mode
          if ((capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext1', thermostat_mode);
          // but when the airco is powered on externally make sure that capability mode "OFF" is cleared by
          // setting it to "auto" which will be overruled by the correct airco mode the next refreshData loop
          if ((apow === 1) && (capability_mode === 'off')) this.setCapabilityValue('thermostat_mode_ext1', 'auto');
          // when the airo is powered off externally make sure that capability mode "OFF" is set
          if ((apow === 0) && (capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext1', 'off');
          break;
        case 2:
          var capability_mode = this.getCapabilityValue('thermostat_mode_ext2');
          // when the airco is tured off then Daikin AI should show mode "OFF" and keep showing that mode iso the airco mode
          if ((capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext2', thermostat_mode);
          // but when the airco is powered on externally make sure that capability mode "OFF" is cleared by
          // setting it to "auto" which will be overruled by the correct airco mode the next refreshData loop
          if ((apow === 1) && (capability_mode === 'off')) this.setCapabilityValue('thermostat_mode_ext2', 'auto');
          // when the airo is powered off externally make sure that capability mode "OFF" is set
          if ((apow === 0) && (capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext2', 'off');
          break;
        case 3:
          var capability_mode = this.getCapabilityValue('thermostat_mode_ext3');
          // when the airco is tured off then Daikin AI should show mode "OFF" and keep showing that mode iso the airco mode
          if ((capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext3', thermostat_mode);
          // but when the airco is powered on externally make sure that capability mode "OFF" is cleared by
          // setting it to "auto" which will be overruled by the correct airco mode the next refreshData loop
          if ((apow === 1) && (capability_mode === 'off')) this.setCapabilityValue('thermostat_mode_ext3', 'auto');
          // when the airo is powered off externally make sure that capability mode "OFF" is set
          if ((apow === 0) && (capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext3', 'off');
          break;
        case 4:
          var capability_mode = this.getCapabilityValue('thermostat_mode_ext4');
          // when the airco is tured off then Daikin AI should show mode "OFF" and keep showing that mode iso the airco mode
          if ((capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext4', thermostat_mode);
          // but when the airco is powered on externally make sure that capability mode "OFF" is cleared by
          // setting it to "auto" which will be overruled by the correct airco mode the next refreshData loop
          if ((apow === 1) && (capability_mode === 'off')) this.setCapabilityValue('thermostat_mode_ext4', 'auto');
          // when the airo is powered off externally make sure that capability mode "OFF" is set
          if ((apow === 0) && (capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext4', 'off');
          break;
        case 5:
          var capability_mode = this.getCapabilityValue('thermostat_mode_ext5');
          // when the airco is tured off then Daikin AI should show mode "OFF" and keep showing that mode iso the airco mode
          if ((capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext5', thermostat_mode);
          // but when the airco is powered on externally make sure that capability mode "OFF" is cleared by
          // setting it to "auto" which will be overruled by the correct airco mode the next refreshData loop
          if ((apow === 1) && (capability_mode === 'off')) this.setCapabilityValue('thermostat_mode_ext5', 'auto');
          // when the airo is powered off externally make sure that capability mode "OFF" is set
          if ((apow === 0) && (capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext5', 'off');
          break;
        case 6:
          var capability_mode = this.getCapabilityValue('thermostat_mode_ext6');
          // when the airco is tured off then Daikin AI should show mode "OFF" and keep showing that mode iso the airco mode
          if ((capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext6', thermostat_mode);
          // but when the airco is powered on externally make sure that capability mode "OFF" is cleared by
          // setting it to "auto" which will be overruled by the correct airco mode the next refreshData loop
          if ((apow === 1) && (capability_mode === 'off')) this.setCapabilityValue('thermostat_mode_ext6', 'auto');
          // when the airo is powered off externally make sure that capability mode "OFF" is set
          if ((apow === 0) && (capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext6', 'off');
          break;
        case 7:
          var capability_mode = this.getCapabilityValue('thermostat_mode_ext7');
          // when the airco is tured off then Daikin AI should show mode "OFF" and keep showing that mode iso the airco mode
          if ((capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext7', thermostat_mode);
          // but when the airco is powered on externally make sure that capability mode "OFF" is cleared by
          // setting it to "auto" which will be overruled by the correct airco mode the next refreshData loop
          if ((apow === 1) && (capability_mode === 'off')) this.setCapabilityValue('thermostat_mode_ext7', 'auto');
          // when the airo is powered off externally make sure that capability mode "OFF" is set
          if ((apow === 0) && (capability_mode !== 'off')) this.setCapabilityValue('thermostat_mode_ext7', 'off');
          break;
        default:
          break;
      }

      this.setSettings({
        capability_mode,
      });
      this.log('extended mode:', thermostat_mode);
      this.log('extended capability_mode:', capability_mode);
      this.log('emura_spmode_kind:', advmode);
    } else {
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
        capability_mode,
      });
      this.log('mode:', thermostat_mode);
      this.log('capability_mode:', capability_mode);
    }

    // --- Flowcards logic for mode triggering
    if ((oldcapability_mode !== capability_mode) && (demo_mode === false)) {
      this.log('Airco mode has changed, old:', oldcapability_mode, ' new:', capability_mode);

      const device = this;
      const tokens = {
        new_capability_mode: capability_mode,
      };

      const state = {
        capability_mode,
      };

      // trigger action flows as necessary (see driver.js)
      const driver = this.getDriver();
      driver
        .triggerCapabilityModeChange(device, tokens, state)
        .v3triggerCapabilityModeChange(device, tokens, state);
    }

    // ---- temperature
    const atemp = Number(control_info[4]);
    this.log('target temperature °C:', atemp);
    this.setCapabilityValue('target_temperature', atemp);

    // turn thermostat ui component black when AC is turned off (note: a custom airco_mode capability and the thermostat ui component do not work properly together...)
    if ((capability_mode === 'off')) {
      const inside_temp = this.getCapabilityValue('measure_temperature.inside');
      const target_temp = this.getCapabilityValue('target_temperature');
      this.setCapabilityValue('target_temperature', inside_temp); // inside = target results in black thermostat ui component

      // update the airco its settings as necessary
      if (target_temp !== inside_temp) {
        this.daikinTempControl(inside_temp);
      }
    }

    /*
    //---- humidity
		const ahum = Number(control_info[5]);
    	this.setCapabilityValue('target_humidity', ahum);
*/

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
    this.log('updateSensorListeners');

    const oldInsideTemperature = this.getState()['measure_temperature.inside'];
    this.log('oldInsideTemperature: ', oldInsideTemperature);
    const oldOutsideTemperature = this.getState()['measure_temperature.outside'];
    this.log('oldOutsideTemperature: ', oldOutsideTemperature);

    const inside = Number(sensor_info[1]);
    const outside = Number(sensor_info[3]);
    this.setCapabilityValue('measure_temperature', inside);
    this.setCapabilityValue('measure_temperature.inside', inside);
    this.log('Temp inside:', inside);
    this.setCapabilityValue('measure_temperature.outside', outside);
    this.log('Temp outside:', outside);

    // --- Flowcards logic
    if (oldInsideTemperature !== inside) {
      this.log('new inside airco temperature °C:', inside);
      this.setCapabilityValue('measure_temperature.inside', inside);

      const device = this;
      const tokens = {
        inside_temperature: inside,
      };

      const state = {
        'measure_temperature.inside': inside,
      };

      // trigger inside temperature flows
      const driver = this.getDriver();
      driver
        .triggerInsideTemperatureMoreThan(device, tokens, state)
        .triggerInsideTemperatureLessThan(device, tokens, state)
        .triggerInsideTemperatureBetween(device, tokens, state)
        .v3triggerInsideTemperatureMoreThan(device, tokens, state)
        .v3triggerInsideTemperatureLessThan(device, tokens, state)
        .v3triggerInsideTemperatureBetween(device, tokens, state);
    }

    if (oldOutsideTemperature !== outside) {
      this.log('new outside airco temperature °C:', outside);
      this.setCapabilityValue('measure_temperature.outside', outside);

      const device = this;
      const tokens = {
        outside_temperature: outside,
      };

      const state = {
        'measure_temperature.outside': outside,
      };

      // trigger outside temperature flows
      const driver = this.getDriver();
      driver
        .triggerOutsideTemperatureMoreThan(device, tokens, state)
        .triggerOutsideTemperatureLessThan(device, tokens, state)
        .triggerOutsideTemperatureBetween(device, tokens, state)
        .v3triggerOutsideTemperatureMoreThan(device, tokens, state)
        .v3triggerOutsideTemperatureLessThan(device, tokens, state)
        .v3triggerOutsideTemperatureBetween(device, tokens, state);
    }

    return Promise.resolve();
  }

  // -------- airco control methods --------------

  // POST new Power settings to Airconditioner
  daikinPowerControl(pow) {
    this.log('daikinPowerControl');

    const settings = this.getSettings();
    const emura_ip = settings.emura_ip;
    const emura_useGetToPost = settings.emura_useGetToPost;
    const emura_adapter = settings.emura_adapter;
    let emura_options = {};
    this.log('firmware < v2.0.1 (then useGetToPost):', emura_useGetToPost);
    this.log('Adapter model:', emura_adapter);

    if (emura_useGetToPost) emura_options = {
      useGetToPost: true,
    };
    else emura_options = {
      useGetToPost: false,
    };

    var daikin = new DaikinAC(emura_ip, emura_options, ((err) => {
      daikin.setACControlInfo({
        pow,
      });
    }));
    this.log('Power control: ', pow);
  }

  // POST new Mode settings to Airconditioner
  daikinModeControl(acmode) {
    this.log('daikinModeControl');

    const settings = this.getSettings();
    const emura_ip = settings.emura_ip;
    const emura_spmode = settings.emura_spmode;
    const demo_mode = settings.emura_demomode;
    const emura_useGetToPost = settings.emura_useGetToPost;
    const emura_adapter = settings.emura_adapter;
    let emura_options = {};
    this.log('firmware < v2.0.1 (then useGetToPost):', emura_useGetToPost);
    this.log('Adapter model:', emura_adapter);

    if (emura_useGetToPost) emura_options = {
      useGetToPost: true,
    };
    else emura_options = {
      useGetToPost: false,
    };

    if (emura_spmode === false) {
      this.log('thermostat_mode_std:', acmode);

      util.daikinModeControl(acmode, emura_ip, emura_options, demo_mode);
    } else {
      this.log('thermostat_mode_extended:', acmode);

      // step 1 - set mode
      util.daikinModeControl(acmode, emura_ip, emura_options, demo_mode);

      // step 2 - set advanced/special mode ON/OFF and function selection
      switch (acmode) {
        case 'streamer':
          var advstate = 1;
          this.log('Special mode: ON, function: Streamer');
          break;

        case 'powerful':
          var advstate = 1;
          this.log('Special mode: ON, function: Powerful');
          break;

        case 'econo':
          var advstate = 1;
          this.log('Special mode: ON, function: Economy');
          break;

        default:
          var advstate = 0;
          this.log('Special mode: OFF');
          return;
      }

      util.daikinSpecialModeControl(acmode, emura_ip, emura_options, advstate);
    }
  }

  // POST new Fan Rate settings to Airconditioner
  daikinFanRateControl(fan_rate) {
    this.log('daikinFanRateControl');

    const settings = this.getSettings();
    const emura_ip = settings.emura_ip;
    const emura_useGetToPost = settings.emura_useGetToPost;
    const emura_adapter = settings.emura_adapter;
    let emura_options = {};
    this.log('firmware < v2.0.1 (then useGetToPost):', emura_useGetToPost);
    this.log('Adapter model:', emura_adapter);

    if (emura_useGetToPost) emura_options = {
      useGetToPost: true,
    };
    else emura_options = {
      useGetToPost: false,
    };

    util.daikinFanRateControl(fan_rate, emura_ip, emura_options);
  }

  // POST new Fan Rate settings to Airconditioner
  daikinFanDirControl(fan_direction) {
    this.log('daikinFanDirControl');

    const settings = this.getSettings();
    const emura_ip = settings.emura_ip;
    const emura_useGetToPost = settings.emura_useGetToPost;
    const emura_adapter = settings.emura_adapter;
    let emura_options = {};
    this.log('firmware < v2.0.1 (then useGetToPost):', emura_useGetToPost);
    this.log('Adapter model:', emura_adapter);

    if (emura_useGetToPost) emura_options = {
      useGetToPost: true,
    };
    else emura_options = {
      useGetToPost: false,
    };

    util.daikinFanDirControl(fan_direction, emura_ip, emura_options);
  }

  // POST new Temperature settings to Airconditioner
  daikinTempControl(atemp) {
    this.log('daikinTempControl');

    const settings = this.getSettings();
    const emura_ip = settings.emura_ip;
    const emura_useGetToPost = settings.emura_useGetToPost;
    const emura_adapter = settings.emura_adapter;
    let emura_options = {};

    this.log('firmware < v2.0.1 (then useGetToPost):', emura_useGetToPost);
    this.log('Adapter model:', emura_adapter);

    if (emura_useGetToPost) emura_options = {
      useGetToPost: true,
    };
    else emura_options = {
      useGetToPost: false,
    };

    util.daikinTempControl(atemp, emura_ip, emura_options);
  }
}

module.exports = EmuraDevice;
