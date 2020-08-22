'use strict';

const Homey = require('homey');

// Driver for a Daikin Airconditioner
class Driver extends Homey.Driver {
  onPair(socket) {
    console.log('onPair(socket)');

    socket.on('manual_add', (device, callback) => {
      const devices = {};
      const request = require('request');
      const url = `http://${device.data.ip}/aircon/get_control_info`;
      console.log(`Connecting to: ${url}`);
      // to be done: add check to prevent that another airco is assigned with same ip-address...
      request(url, (error, response, body) => {
        if (response === null || response === undefined) {
          console.log('Response: ', response);
          socket.emit('error', 'http error');
          return response;
        }

        if (!error && (response.statusCode === 200 || response.statusCode === 403)) {
          devices[device.data.id] = {
            id: device.data.id,
            name: device.data.name,
            ip: device.data.ip,
          };
          console.log('Device ID: ', device.data.id);
          console.log('Device name: ', device.data.inputdevicename);
          console.log('Device ip-address: ', device.data.ip);
          callback(null, devices);
          socket.emit('success', device);
        } else {
          console.log('Response.statusCode:', response.statusCode);
          socket.emit('error', `http error: ${response.statusCode}`);
        }
      });

      // emit when devices are still being searched
      socket.emit('list_devices', devices);

      // fire the callback when searching is done
      callback(null, devices);

      // when no devices are found, return an empty array
      callback(null, []);

      // or fire a callback with Error to show that instead
      callback(new Error('Something bad has occured!'));
    });

    // this happens when user clicks away the pairing windows
    socket.on('disconnect', () => {
      console.log('Pairing is finished (done or aborted)'); // using console.log because this.log or Homey.log is not a function
    });
  }

  // Maintenance action - repairing action in support of v4 Special Modes
  onRepair(socket, device) {
	console.log('>>> onRepair(socket, device)');

    socket.on('dorepair', (data, callback) => {
	  console.log('Fixing/changing special modes...');
	  console.log('Note: the maintenance dialog calls > socket.on("dorepair", (data, callback)');

	  var amode = device.getCapabilityValue("thermostat_mode_std"); // so special modes are enabled...
	  if(amode === null) {
		console.log('Step 1 - remove old the special modes capabilities...');
	  	// v3 to v4 maintenance... remove deprecated special mode capabilities
	  	device.removeCapability('thermostat_mode_ext1');
	  	device.removeCapability('thermostat_mode_ext2');
	  	device.removeCapability('thermostat_mode_ext3');
	  	device.removeCapability('thermostat_mode_ext4');
	  	device.removeCapability('thermostat_mode_ext5');
	  	device.removeCapability('thermostat_mode_ext6');
	  	device.removeCapability('thermostat_mode_ext7');
	  	console.log('Deprecated Special Mode capabilities have been removed.')

      	// part 2
	  	console.log('Step 2 - add the new special mode capabilities...');
	 	console.log('Capabilities of the device when RePairing has finished: ', data.capabilities);

	 	// these capabilities might still show in the picker after upgrading from v3 to v4
	 	// to ensure a certain picker sequence we also remove these capabilities... 
	    device.removeCapability('fan_rate');
	    device.removeCapability('fan_direction');
	    console.log('Capabilities "fan_rate" and "fan_direction" are now temporarily removed !! User should exectute the RePair function ones more.');

	 	// add main thermostat mode controle capabilty, should be the first to show in the picker selector...
	    device.addCapability('thermostat_mode_std');
	    //device.registerCapabilityListener('thermostat_mode_std');
	    console.log('Capability "thermostat_mode_std" added ');

  	    //-- it seems not possible to remove and then add the same capability in one go... 
			// now add "fan_rate" and "fan_direction" again so they shown in the picker in the correct sequence...
  	    	//device.addCapability('fan_rate');
  	    	//device.registerCapabilityListener('fan_rate');
  	    	//device.addCapability('fan_direction');
  	    	//device.registerCapabilityListener('fan_direction');
	    	//console.log('Capabilities "fan_rate" and "fan_direction" have been added once again.');
	  }

	  // check if the fan capabilies are yet registered if not register them now...
	  var fanrate = device.getCapabilityValue("fan_rate");
	  if(fanrate === null) {
  	    device.addCapability('fan_rate');
  	    device.addCapability('fan_direction');
	    console.log('Capabilities "fan_rate" and "fan_direction" have been added once again.');
	  }
	  
      // Save the Special Mode ID
	  console.log('Special Mode Id:', data.settings.spmode);
      device.setSettings(data.settings);

      // add special modes based on user selection to the picker selector...
	  console.log('Registering the Special Mode capabilities');  
	  const spmode_config = data.settings.spmode;  
	  switch (spmode_config) {
      	case 0:
      		device.removeCapability('special_mode_eco');
      		device.removeCapability('special_mode_pwr');
      		device.removeCapability('special_mode_str');
      		device.removeCapability('target_humidity');
      		break;
      	case 1:
      		device.addCapability('special_mode_eco');
      		device.removeCapability('special_mode_pwr');
      		device.removeCapability('special_mode_str');
      		device.removeCapability('target_humidity');
      		break;
			case 2:;
      		device.removeCapability('special_mode_eco');
      		device.addCapability('special_mode_pwr');
      		device.removeCapability('special_mode_str');
      		device.removeCapability('target_humidity');
      		break;
      	case 3:
      		device.addCapability('special_mode_eco');
      		device.addCapability('special_mode_pwr');
      		device.removeCapability('special_mode_str');
      		device.removeCapability('target_humidity');
      		break;
      	case 4:
     		device.removeCapability('special_mode_eco');
      		device.removeCapability('special_mode_pwr');
      		device.addCapability('special_mode_str');
      		device.addCapability('target_humidity');
      		break;
      	case 5:
      		device.addCapability('special_mode_eco');
      		device.addCapability('special_mode_pwr');
      		device.removeCapability('special_mode_str');
      		device.removeCapability('target_humidity');
      		break;
      	case 6:
      		device.removeCapability('special_mode_eco');
      		device.addCapability('special_mode_pwr');
      		device.addCapability('special_mode_str');
      		device.addCapability('target_humidity');
      		break;
      	case 7:
      		device.addCapability('special_mode_eco');
      		device.addCapability('special_mode_pwr');
      		device.addCapability('special_mode_str');
      		device.addCapability('target_humidity');
      		break;
      	default:
      		break;
    };

	  console.log('Finishing up...');
  	  socket.emit('finish');
      callback(null, true);
    });

    socket.on('disconnect', () => {
      console.log('RePairing either aborted or completed');
    });

  }

  /*
     * Triggers a flow
     * @param {Homey.FlowCardTriggerDevice} trigger - A Homey.FlowCardTriggerDevice instance
     * @param {Device} device - A Device instance
     * @param {Object} tokens - An object with tokens and their typed values, as defined in the app.json
     * @param {Object} state - An object with properties which are accessible throughout the Flow
     */
  triggerFlow(trigger, device, tokens, state) {
    if (trigger) {
	  //this.log('triggerFlow called... > trigger:',trigger);
	  //this.log('triggerFlow called... > device:',device);
	  //this.log('triggerFlow called... > tokens:',tokens);
	  //this.log('triggerFlow called... > state:',state);
      trigger
        .trigger(device, tokens, state)
        .then(this.log('flowcard triggered'))
        .catch(this.error);
    }
  }

  getDeviceType() {
    return this.deviceType ? this.deviceType : false;
  }
}

module.exports = Driver;
