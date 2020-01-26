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

  /*
     * Triggers a flow
     * @param {Homey.FlowCardTriggerDevice} trigger - A Homey.FlowCardTriggerDevice instance
     * @param {Device} device - A Device instance
     * @param {Object} tokens - An object with tokens and their typed values, as defined in the app.json
     * @param {Object} state - An object with properties which are accessible throughout the Flow
     */
  triggerFlow(trigger, device, tokens, state) {
    if (trigger) {
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
