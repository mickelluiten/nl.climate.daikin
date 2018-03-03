"use strict";

const Homey = require('homey');
const Driver = require('../../lib/Driver');
const inverterctrl = require('../../lib/Daikin');

//Driver for a Daikin Inverter type Airconditioner
class InverterDriver extends Driver {		

	onInit() {
		this.deviceType = 'inverter';

//*** TRIGGER FLOWCARDS *******************************************************************************************
        
    //--- Temperature flowcards	
		/*** TARGET TEMPERATURE TRIGGERS ***/        
        this._triggerTargetTemperatureMoreThan = new Homey.FlowCardTriggerDevice('change_inverter_target_temperature_more_than').register();
		this._triggerTargetTemperatureMoreThan.registerRunListener((args, state) => {
			let conditionMet = state.set_temperature > args.target_temperature_more;
            this.log('trigger - args.target_temperature_more', args.target_temperature_more);
            this.log('trigger - state.set_temperature', (state.set_temperature) );
            this.log('trigger - conditionMet', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._triggerTargetTemperatureLessThan = new Homey.FlowCardTriggerDevice('change_inverter_target_temperature_less_than').register();
		this._triggerTargetTemperatureLessThan.registerRunListener((args, state) => {
			let conditionMet = state.set_temperature < args.target_temperature_less;
            this.log('trigger - args.target_temperature_less', args.target_temperature_less);
            this.log('trigger - state.set_temperature', (state.set_temperature) );
            this.log('trigger - conditionMet', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._triggerTargetTemperatureBetween = new Homey.FlowCardTriggerDevice('change_inverter_target_temperature_between').register();
		this._triggerTargetTemperatureBetween.registerRunListener((args, state) => {
			let conditionMet = state.set_temperature > args.target_temperature_from && state.set_temperature < args.target_temperature_to;
            this.log('trigger - args.target_temperature_from', args.target_temperature_from);
            this.log('trigger - args.target_temperature_to', args.target_temperature_to);
            this.log('trigger - state.set_temperature', (state.set_temperature) );
            this.log('trigger - conditionMet', conditionMet);
			return Promise.resolve(conditionMet);
		});

	    /*** INSIDE TEMPERATURE TRIGGERS ***/
		this._triggerInsideTemperatureMoreThan = new Homey.FlowCardTriggerDevice('inside_inverter_temperature_more_than').register();
		this._triggerInsideTemperatureMoreThan.registerRunListener((args, state) => {
			let conditionMet = state['measure_temperature.inside'] > args.inside_temperature_more;
            this.log('trigger - args.inside_temperature_more', args.inside_temperature_more);
            this.log('trigger - state()[measure_temperature.inside]', ( state['measure_temperature.inside']) );
            this.log('trigger - conditionMet inside temp', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._triggerInsideTemperatureLessThan = new Homey.FlowCardTriggerDevice('inside_inverter_temperature_less_than').register();
		this._triggerInsideTemperatureLessThan.registerRunListener((args, state) => {
			let conditionMet = state['measure_temperature.inside'] < args.inside_temperature_less;
            this.log('trigger - args.inside_temperature_less', args.inside_temperature_less);
            this.log('trigger - state()[measure_temperature.inside]', ( state['measure_temperature.inside']) );
            this.log('trigger - conditionMet inside temp', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._triggerInsideTemperatureBetween = new Homey.FlowCardTriggerDevice('inside_inverter_temperature_between').register();
		this._triggerInsideTemperatureBetween.registerRunListener((args, state) => {
			let conditionMet = state['measure_temperature.inside'] > args.inside_temperature_from && state['measure_temperature.inside'] < args.inside_temperature_to;
			return Promise.resolve(conditionMet);
		});

		/*** OUTSIDE TEMPERATURE TRIGGERS ***/
		this._triggerOutsideTemperatureMoreThan = new Homey.FlowCardTriggerDevice('outside_inverter_temperature_more_than').register();
		this._triggerOutsideTemperatureMoreThan.registerRunListener((args, state) => {
			let conditionMet = state['measure_temperature.outside'] > args.outside_temperature_more;
            this.log('trigger - args.outside_temperature_more', args.outside_temperature_more);
            this.log('trigger - state[measure_temperature.outside]', ( state['measure_temperature.outside']) );
            this.log('trigger - conditionMet outside temp', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._triggerOutsideTemperatureLessThan = new Homey.FlowCardTriggerDevice('outside_inverter_temperature_less_than').register();
		this._triggerOutsideTemperatureLessThan.registerRunListener((args, state) => {
			let conditionMet = state['measure_temperature.outside'] < args.ouside_temperature_less;
            this.log('trigger - args.ouside_temperature_less', args.ouside_temperature_less);
            this.log('trigger - state[measure_temperature.outside]', ( state['measure_temperature.outside']) );
            this.log('trigger - conditionMet outside temp', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._triggerOutsideTemperatureBetween = new Homey.FlowCardTriggerDevice('outside_inverter_temperature_between').register();
		this._triggerOutsideTemperatureBetween.registerRunListener((args, state) => {
			let conditionMet = state['measure_temperature.outside'] > args.outside_temperature_from && state['measure_temperature.outside'] < args.outside_temperature_to;
			return Promise.resolve(conditionMet);
		});

//*** CONDITION FLOWCARDS *******************************************************************************************
        
    	/*** TARGET TEMPERATURE CONDITIONS ***/
		this._conditionTargetTemperatureMoreThan = new Homey.FlowCardCondition('has_inverter_target_temperature_more_than').register();
		this._conditionTargetTemperatureMoreThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().set_temperature > args.target_temperature_more;
            this.log('condition args.target_temperature_more', args.target_temperature_more);            
            this.log('condition device.getState().set_temperature', (device.getState().set_temperature) );
            this.log('condition conditionMet', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._conditionTargetTemperatureLessThan = new Homey.FlowCardCondition('has_inverter_target_temperature_less_than').register();
		this._conditionTargetTemperatureLessThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().set_temperature < args.target_temperature_less;
            this.log('condition args.target_temperature_less', args.target_temperature_less);            
            this.log('condition device.getState().set_temperature', (device.getState().set_temperature) );
            this.log('condition conditionMet', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._conditionTargetTemperatureBetween = new Homey.FlowCardCondition('has_inverter_target_temperature_between').register();
		this._conditionTargetTemperatureBetween.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().set_temperature > args.target_temperature_from && device.getState().set_temperature < args.target_temperature_to;
            this.log('condition args.target_temperature_from', args.target_temperature_from);  
            this.log('condition args.target_temperature_to', args.target_temperature_to);                       
            this.log('condition device.getState().set_temperature', (device.getState().set_temperature) );
            this.log('condition conditionMet', conditionMet);
			return Promise.resolve(conditionMet);
		});

		/*** INSIDE TEMPERATURE CONDITIONS ***/
		this._conditionInsideTemperatureMoreThan = new Homey.FlowCardCondition('has_inverter_inside_temperature_more_than').register();
		this._conditionInsideTemperatureMoreThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().temperature_inside > args.inside_temperature_more;
            this.log('condition - temperature_inside', device.getState().temperature_inside);
            this.log('condition - args.inside_temperature_more', args.inside_temperature_more);
            this.log('condition - conditionMet inside temp', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._conditionInsideTemperatureLessThan = new Homey.FlowCardCondition('has_inverter_inside_temperature_less_than').register();
		this._conditionInsideTemperatureLessThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().temperature_inside < args.inside_temperature_less;
            this.log('condition - temperature_inside', device.getState().temperature_inside);
            this.log('condition - args.inside_temperature_more', args.inside_temperature_more);
            this.log('condition - conditionMet inside temp', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._conditionInsideTemperatureBetween = new Homey.FlowCardCondition('has_inverter_inside_temperature_between').register();
		this._conditionInsideTemperatureBetween.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().temperature_inside > args.inside_temperature_from && device.getState().temperature_inside < args.inside_temperature_to;
            this.log('condition - temperature_inside', device.getState().temperature_inside);
            this.log('condition - args.inside_temperature_from', args.inside_temperature_from);
            this.log('condition - args.inside_temperature_to', args.inside_temperature_to);
            this.log('condition - conditionMet inside temp', conditionMet);
			return Promise.resolve(conditionMet);
		});

		/*** OUTSIDE TEMPERATURE CONDITIONS ***/
		this._conditionOutsideTemperatureMoreThan = new Homey.FlowCardCondition('has_inverter_outside_temperature_more_than').register();
		this._conditionOutsideTemperatureMoreThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().temperature_outside > args.outside_temperature_more;
            this.log('condition - temperature_outside', device.getState().temperature_outside);
            this.log('condition - args.outside_temperature_more', args.outside_temperature_more);
            this.log('condition - conditionMet outside temp', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._conditionOutsideTemperatureLessThan = new Homey.FlowCardCondition('has_inverter_outside_temperature_less_than').register();
		this._conditionOutsideTemperatureLessThan.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().temperature_outside < args.outside_temperature_less;
            this.log('condition - temperature_outside', device.getState().temperature_outside);
            this.log('condition - args.outside_temperature_less', args.outside_temperature_less);
            this.log('condition - conditionMet outside temp', conditionMet);
			return Promise.resolve(conditionMet);
		});

		this._conditionOutsideTemperatureBetween = new Homey.FlowCardCondition('has_inverter_outside_temperature_between').register();
		this._conditionOutsideTemperatureBetween.registerRunListener((args, state) => {
			let device = args.device;
			let conditionMet = device.getState().temperature_outside > args.outside_temperature_from && device.getState().temperature_outside < args.outside_temperature_to;
            this.log('condition - temperature_outside', device.getState().temperature_outside);
            this.log('condition - args.outside_temperature_from', args.outside_temperature_from);
            this.log('condition - args.outside_temperature_to', args.outside_temperature_to);
            this.log('condition - conditionMet outside temp', conditionMet);
			return Promise.resolve(conditionMet);
		});

//*** ACTION FLOWCARDS *******************************************************************************************
                           
    	/*** TARGET TEMPERATURE ACTION ***/ 
		this._actionTargetTemp = new Homey.FlowCardAction('change_inverter_target_temp').register();
		this._actionTargetTemp.registerRunListener((args, state) => {
			let device = args.device;           
            let settings = device.getSettings();   
                                    
            var ip_address = settings.inverter_ip;    
            this.log('ip_address', ip_address);                        

            var atemp = args.atemp;
            this.log('target temp', atemp);
                        
            inverterctrl.daikinTempControl(atemp, ip_address);
			return Promise.resolve(atemp);
		});  
        
    //--- MODE CHANGE ACTIONS
		this._actionAircoOn = new Homey.FlowCardAction('turn_inverter_on').register();
		this._actionAircoOn.registerRunListener((args, state) => {
			let device = args.device;           
            let settings = device.getSettings();   
        
            var ip_address = settings.inverter_ip;               
            this.log('ip_address', ip_address);                        

            var airco_mode = args.mode;
            this.log('airco_mode', airco_mode); 
                        
            inverterctrl.daikinModeControl(airco_mode, ip_address);
			return Promise.resolve(airco_mode);
		});

		this._actionAircoOff = new Homey.FlowCardAction('turn_inverter_off').register();
		this._actionAircoOff.registerRunListener((args, state) => {
			let device = args.device;           
            let settings = device.getSettings();   
                                    
            var ip_address = settings.inverter_ip;    
            this.log('ip_address', ip_address);                        

            var airco_mode = args.mode;
            this.log('airco_mode', airco_mode); 
                        
            inverterctrl.daikinModeControl(airco_mode, ip_address);
			return Promise.resolve(airco_mode);
		});            

    //--- FAN RATE ACTIONS
		this._actionFanRate = new Homey.FlowCardAction('change_inverter_fan_rate').register();
		this._actionFanRate.registerRunListener((args, state) => {
			let device = args.device;           
            let settings = device.getSettings();   
                                    
            var ip_address = settings.inverter_ip;    
            this.log('ip_address', ip_address);                        

            var fan_rate = args.frate;
            this.log('fan_rate', fan_rate);
                        
            inverterctrl.daikinFanRateControl(fan_rate, ip_address);
			return Promise.resolve(fan_rate);
		});  

    //--- FAN DIRECTION ACTIONS
		this._actionFanDirection = new Homey.FlowCardAction('change_inverter_fan_direction').register();
		this._actionFanDirection.registerRunListener((args, state) => {
			let device = args.device;           
            let settings = device.getSettings();   
                                    
            var ip_address = settings.inverter_ip;    
            this.log('ip_address', ip_address);                        

            var fan_direction = args.fdir;
            this.log('fan_direction', fan_direction);
                        
            inverterctrl.daikinFanDirControl(fan_direction, ip_address);
			return Promise.resolve(fan_direction);
		});  

               
	}

//--- METHODS FOR TEMPERATURE FLOWCARD TRIGGERS
    //--- Target Temperature triggering
	triggerTargetTemperatureMoreThan(device, tokens, state) {
		this.triggerFlow(this._triggerTargetTemperatureMoreThan, device, tokens, state);
		return this;
	}
	triggerTargetTemperatureLessThan(device, tokens, state) {
		this.triggerFlow(this._triggerTargetTemperatureLessThan, device, tokens, state);
		return this;
	}
	triggerTargetTemperatureBetween(device, tokens, state) {
		this.triggerFlow(this._triggerTargetTemperatureBetween, device, tokens, state);
		return this;
	}

    //--- Inside Temperature triggering
	triggerInsideTemperatureMoreThan(device, tokens, state) {
		this.triggerFlow(this._triggerInsideTemperatureMoreThan, device, tokens, state);
		return this;
	}
	triggerInsideTemperatureLessThan(device, tokens, state) {
		this.triggerFlow(this._triggerInsideTemperatureLessThan, device, tokens, state);
		return this;
	}
	triggerInsideTemperatureBetween(device, tokens, state) {
		this.triggerFlow(this._triggerInsideTemperatureBetween, device, tokens, state);
		return this;
	}

    //--- Outside Temperature triggering    
	triggerOutsideTemperatureMoreThan(device, tokens, state) {
		this.triggerFlow(this._triggerOutsideTemperatureMoreThan, device, tokens, state);
		return this;
	}
	triggerOutsideTemperatureLessThan(device, tokens, state) {
		this.triggerFlow(this._triggerOutsideTemperatureLessThan, device, tokens, state);
		return this;
	}
	triggerOutsideTemperatureBetween(device, tokens, state) {
		this.triggerFlow(this._triggerOusideTemperatureBetween, device, tokens, state);
		return this;
	}    
}

module.exports = InverterDriver;