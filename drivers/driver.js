'use strict';

const Homey = require('homey');

// Driver for a Daikin Airconditioner
class Driver extends Homey.Driver {
  onPair(session) {
    console.log('onPair(session)');

    //session.setHandler('manual_add', (device, callback) => {
    session.setHandler('manual_add', (device) => {
      //const devices = {};
      const devices = [];
      const request = require('request');
      const url = `http://${device.data.ip}/aircon/get_control_info`;
      console.log(`Connecting to: ${url}`);
      // to be done: add check to prevent that another airco is assigned with same ip-address...
      request(url, (error, response, body) => {
        if (response === null || response === undefined) {
          console.log('Response: ', response);
          session.emit('error', 'http error');
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
          session.emit('success', device);
		  return devices;
        } else {
          console.log('Response.statusCode:', response.statusCode);
          session.emit('error', `http error: ${response.statusCode}`);
        }
      });

    });

    // this happens when user clicks away the pairing windows
    session.setHandler('disconnect', () => {
      console.log('Pairing is finished (done or aborted)'); // using console.log because this.log or Homey.log is not a function
    });
  }

  // Maintenance action - repairing action in support of v4 Special Modes
  onRepair(session, device) {
	console.log('>>> onRepair(session, device)');

    session.setHandler('dorepair', (data, callback) => {
	  console.log('Fixing/changing special modes...');
	  //Note: that the maintenance dialog starts the repairstart.html dialog which then calls this routine...

      // Save the Special Mode ID
	  console.log('Special Mode Id:', data.settings.spmode);
      device.setSettings(data.settings);
	  const spmode_config = data.settings.spmode;

	  // check if v3 special mode user has already upgraded... if not delete the old special mode capabilities...
	  if(!device.hasCapability('thermostat_mode_std')) {
		console.log('Upgrade Step 1 - remove old the special modes capabilities...');
	  	// v3 to v4 maintenance... remove deprecated special mode capabilities
	  	device.removeCapability('thermostat_mode_ext1');
	  	device.removeCapability('thermostat_mode_ext2');
	  	device.removeCapability('thermostat_mode_ext3');
	  	device.removeCapability('thermostat_mode_ext4');
	  	device.removeCapability('thermostat_mode_ext5');
	  	device.removeCapability('thermostat_mode_ext6');
	  	device.removeCapability('thermostat_mode_ext7');
	  	console.log('Deprecated Special Mode capabilities have been removed.')

	  	console.log('Prepare the upgrade...');
	 	// to ensure that the thermostat mode picker is the first picker when the upgrade ia completed we remove... 
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
		
			console.log('User should execute the "Try Repair" maintenance function once more...');
	  }

	  // check if the fan capabilies are yet registered if not register them now...
	  if(!device.hasCapability('fan_rate')) {
		console.log('Upgrade Step 2...');
  	    device.addCapability('fan_rate');
  	    device.addCapability('fan_direction');
	    console.log('Capabilities "fan_rate" and "fan_direction" have been added once again.');
	  }

      // add special modes based on user selection to the picker selector...
	  switch (spmode_config) {
      	case 0:
      		device.removeCapability('special_mode_eco');
      		device.removeCapability('special_mode_pwr');
      		device.removeCapability('special_mode_str');
      		device.removeCapability('target_humidity');
			console.log('Added/Updated special modes capabilities... Special Mode Id: 0');
      		break;
      	case 1:
      		device.addCapability('special_mode_eco');
      		device.removeCapability('special_mode_pwr');
      		device.removeCapability('special_mode_str');
      		device.removeCapability('target_humidity');
			console.log('Added/Updated special modes capabilities... Special Mode Id: 1');
      		break;
		case 2:
      		device.removeCapability('special_mode_eco');
      		device.addCapability('special_mode_pwr');
      		device.removeCapability('special_mode_str');
      		device.removeCapability('target_humidity');
			console.log('Added/Updated special modes capabilities... Special Mode Id: 2');
      		break;
		case 3:
      		device.addCapability('special_mode_eco');
      		device.addCapability('special_mode_pwr');
      		device.removeCapability('special_mode_str');
      		device.removeCapability('target_humidity');
			console.log('Added/Updated special modes capabilities... Special Mode Id: 3');
      		break;
      	case 4:
     		device.removeCapability('special_mode_eco');
      		device.removeCapability('special_mode_pwr');
      		device.addCapability('special_mode_str');
      		device.addCapability('target_humidity');
			console.log('Added/Updated special modes capabilities... Special Mode Id: 4');
      		break;
      	case 5:
      		device.addCapability('special_mode_eco');
      		device.addCapability('special_mode_pwr');
      		device.removeCapability('special_mode_str');
      		device.removeCapability('target_humidity');
			console.log('Added/Updated special modes capabilities... Special Mode Id: 5');
      		break;
      	case 6:
      		device.removeCapability('special_mode_eco');
      		device.addCapability('special_mode_pwr');
      		device.addCapability('special_mode_str');
      		device.addCapability('target_humidity');
			console.log('Added/Updated special modes capabilities... Special Mode Id: 6');
      		break;
      	case 7:
      		device.addCapability('special_mode_eco');
      		device.addCapability('special_mode_pwr');
      		device.addCapability('special_mode_str');
      		device.addCapability('target_humidity');
			console.log('Added/Updated special modes capabilities... Special Mode Id: 7');
      		break;
      	default:
      		break;
    };

	  console.log('Finishing up...');
  	  session.emit('finish');
      callback(null, true);
    });

    session.setHandler('disconnect', () => {
      console.log('RePairing either aborted or completed');
    });

  }

  getDeviceType() {
    return this.deviceType ? this.deviceType : false;
  }
}

module.exports = Driver;
