'use strict';

const Homey = require('homey');

class Daikin extends Homey.App {

	onInit() {
		this.log('Daikin AI version 5 is running...');
	}

}

module.exports = Daikin;
