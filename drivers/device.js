'use strict';

const Homey = require('homey');

class Device extends Homey.Device {
  onInit() {
	this.log('>>>onInit device.js');
    this.log('Device initialization...');
    this.log('Driver name:', this.getName());
    this.log('Driver class:', this.getClass());
  }

  onAdded() {
    this.log('Daikin air to air heat pump added');
  }

  onDeleted() {
    this.log('Daikin air to air heat pump deleted');
  }

  getDeviceUrl() {
    return this.getData().deviceURL;
  }

}

module.exports = Device;
