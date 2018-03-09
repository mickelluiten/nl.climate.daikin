"use strict";

const Homey = require('homey');
const Driver = require('../../lib/driver');
const homekitctrl = require('../../lib/daikin');

//Driver adds HomeKit support for the basic functions of every Daikin airconditioner
class HomeKitDriver extends Driver {		

	onInit() {
        this.deviceType = 'homekit';

    //*** standard capabilities use standard flowcards... no need to define them here. ***

    }
}

module.exports = HomeKitDriver;