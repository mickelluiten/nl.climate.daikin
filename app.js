'use strict';

const Homey = require('homey');

class Daikin extends Homey.App {
  onInit() {
    this.log('Daikin AI version 4 is running...');
  }
}

module.exports = Daikin;
