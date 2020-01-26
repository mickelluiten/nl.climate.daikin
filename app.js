'use strict';

const Homey = require('homey');
const Log = require('homey-log').Log;

class Daikin extends Homey.App {
  onInit() {
    this.log('Daikin AI is running...');
  }
}

module.exports = Daikin;
