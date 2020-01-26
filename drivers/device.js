'use strict';

const Homey = require('homey');

class Device extends Homey.Device {
  onInit() {
    this.log('Device initialization...');
    this.log('Driver name:', this.getName());
    this.log('Driver class:', this.getClass());
  }

  onAdded() {
    this.log('Daikin airconditioner added');
  }

  onDeleted() {
    this.log('Daikin airconditioner deleted');
  }

  getDeviceUrl() {
    return this.getData().deviceURL;
  }

  getDeviceType() {
    this.getDriver().getDeviceType();
  }
}

module.exports = Device;
