'use strict';

const Homey = require('homey');
const Log = require('homey-log').Log;

class Daikin extends Homey.App {
  onInit() {
    this.log('Daikin AI version 4 is running...');
  }
}

module.exports = Daikin;
