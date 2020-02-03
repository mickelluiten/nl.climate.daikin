'use strict';

const Homey = require('homey');
const Driver = require('../../drivers/driver');
const comforactrl = require('../../lib/daikin');

// Driver for a Daikin Comfora type Airconditioner
class ComforaDriver extends Driver {
    onInit() {
        this.deviceType = 'comfora';

//* ** TRIGGER FLOWCARDS *******************************************************************************************
    // --- Temperature flowcards
        /* ** TARGET TEMPERATURE TRIGGERS ** */
        this._v3triggerTargetTemperatureMoreThan = new Homey.FlowCardTriggerDevice('change_target_temperature_more_than');
        this._v3triggerTargetTemperatureMoreThan
            .register()
            .registerRunListener((args, state) => {
                const conditionMet = state.target_temperature > args.target_temperature_more;
                // this.log('trigger - args.target_temperature_more', args.target_temperature_more);
                // this.log('trigger - state.target_temperature', (state.target_temperature) );
                // this.log('trigger - conditionMet', conditionMet);
                return Promise.resolve(conditionMet);
            });

        this._v3triggerTargetTemperatureLessThan = new Homey.FlowCardTriggerDevice('change_target_temperature_less_than');
        this._v3triggerTargetTemperatureLessThan
            .register()
            .registerRunListener((args, state) => {
                const conditionMet = state.target_temperature < args.target_temperature_less;
                return Promise.resolve(conditionMet);
            });

        this._v3triggerTargetTemperatureBetween = new Homey.FlowCardTriggerDevice('change_target_temperature_between');
        this._v3triggerTargetTemperatureBetween
            .register()
            .registerRunListener((args, state) => {
                const conditionMet = state.target_temperature > args.target_temperature_from && state.target_temperature < args.target_temperature_to;
                return Promise.resolve(conditionMet);
            });

        /** * INSIDE TEMPERATURE TRIGGERS ** */
        this._v3triggerInsideTemperatureMoreThan = new Homey.FlowCardTriggerDevice('inside_temperature_more_than');
        this._v3triggerInsideTemperatureMoreThan
            .register()
            .registerRunListener((args, state) => {
                const conditionMet = state['measure_temperature.inside'] > args.inside_temperature_more;

                // this.log('trigger - args.inside_temperature_more', args.inside_temperature_more);
                // this.log('trigger - state()[measure_temperature.inside]', ( state['measure_temperature.inside']) );
                // this.log('trigger - conditionMet inside temp', conditionMet);
                return Promise.resolve(conditionMet);
            });

        this._v3triggerInsideTemperatureLessThan = new Homey.FlowCardTriggerDevice('inside_temperature_less_than');
        this._v3triggerInsideTemperatureLessThan
            .register()
            .registerRunListener((args, state) => {
                const conditionMet = state['measure_temperature.inside'] < args.inside_temperature_less;
                return Promise.resolve(conditionMet);
            });

        this._v3triggerInsideTemperatureBetween = new Homey.FlowCardTriggerDevice('inside_temperature_between');
        this._v3triggerInsideTemperatureBetween
            .register()
            .registerRunListener((args, state) => {
                const conditionMet = state['measure_temperature.inside'] > args.inside_temperature_from && state['measure_temperature.inside'] < args.inside_temperature_to;
                return Promise.resolve(conditionMet);
            });

        /** * OUTSIDE TEMPERATURE TRIGGERS ** */
        this._v3triggerOutsideTemperatureMoreThan = new Homey.FlowCardTriggerDevice('outside_temperature_more_than');
        this._v3triggerOutsideTemperatureMoreThan
            .register()
            .registerRunListener((args, state) => {
                const conditionMet = state['measure_temperature.outside'] > args.outside_temperature_more;
                // this.log('trigger - args.outside_temperature_more', args.outside_temperature_more);
                // this.log('trigger - state[measure_temperature.outside]', ( state['measure_temperature.outside']) );
                // this.log('trigger - conditionMet outside temp', conditionMet);
                return Promise.resolve(conditionMet);
            });

        this._v3triggerOutsideTemperatureLessThan = new Homey.FlowCardTriggerDevice('outside_temperature_less_than');
        this._v3triggerOutsideTemperatureLessThan
            .register()
            .registerRunListener((args, state) => {
                const conditionMet = state['measure_temperature.outside'] < args.ouside_temperature_less;
                return Promise.resolve(conditionMet);
            });

        this._v3triggerOutsideTemperatureBetween = new Homey.FlowCardTriggerDevice('outside_temperature_between');
        this._v3triggerOutsideTemperatureBetween
            .register()
            .registerRunListener((args, state) => {
                const conditionMet = state['measure_temperature.outside'] > args.outside_temperature_from && state['measure_temperature.outside'] < args.outside_temperature_to;
                return Promise.resolve(conditionMet);
            });

        /** *  MODE CHANGE TRIGGERS ** */
        this._v3triggerAircoMode = new Homey.FlowCardTriggerDevice('mode_changed');
        this._v3triggerAircoMode
            .register()
            .registerRunListener((args, state) => {
                const conditionMet = state.capability_mode === args.mode;
                // this.log('trigger - args.mode', args.mode);
                // this.log('trigger - state[capability_mode]', ( state['capability_mode']) );
                // this.log('trigger - conditionMet capability_mode', conditionMet);
                return Promise.resolve(conditionMet);
            });

//* ** CONDITION FLOWCARDS *******************************************************************************************
    /* ** TARGET TEMPERATURE CONDITIONS ** */
        this._v3conditionTargetTemperatureMoreThan = new Homey.FlowCardCondition('has_target_temperature_more_than');
        this._v3conditionTargetTemperatureMoreThan
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const devicestate = device.getState();
                const conditionMet = devicestate.target_temperature > args.target_temperature_more;
                // this.log('condition args.target_temperature_more', args.target_temperature_more);
                // this.log('condition devicestate.target_temperature', devicestate.target_temperature);
                // this.log('condition conditionMet', conditionMet);
                return Promise.resolve(conditionMet);
            });

        this._v3conditionTargetTemperatureLessThan = new Homey.FlowCardCondition('has_target_temperature_less_than');
        this._v3conditionTargetTemperatureLessThan
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const devicestate = device.getState();
                const conditionMet = devicestate.target_temperature < args.target_temperature_less;
                return Promise.resolve(conditionMet);
            });

        this._v3conditionTargetTemperatureBetween = new Homey.FlowCardCondition('has_target_temperature_between');
        this._v3conditionTargetTemperatureBetween
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const devicestate = device.getState();
                const conditionMet = devicestate.target_temperature > args.target_temperature_from && devicestate.target_temperature < args.target_temperature_to;
                return Promise.resolve(conditionMet);
            });

        /** * INSIDE TEMPERATURE CONDITIONS ** */
        this._v3conditionInsideTemperatureMoreThan = new Homey.FlowCardCondition('has_inside_temperature_more_than');
        this._v3conditionInsideTemperatureMoreThan
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const devicestate = device.getState();
                const conditionMet = devicestate['measure_temperature.inside'] > args.inside_temperature_more;
                // this.log('condition - [measure_temperature.inside]', devicestate['measure_temperature.inside']);
                // this.log('condition - args.inside_temperature_more', args.inside_temperature_more);
                // this.log('condition - conditionMet inside temp', conditionMet);
                return Promise.resolve(conditionMet);
            });

        this._v3conditionInsideTemperatureLessThan = new Homey.FlowCardCondition('has_inside_temperature_less_than');
        this._v3conditionInsideTemperatureLessThan
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const devicestate = device.getState();
                const conditionMet = devicestate['measure_temperature.inside'] < args.inside_temperature_less;
                return Promise.resolve(conditionMet);
            });

        this._v3conditionInsideTemperatureBetween = new Homey.FlowCardCondition('has_inside_temperature_between');
        this._v3conditionInsideTemperatureBetween
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const devicestate = device.getState();
                const conditionMet = devicestate['measure_temperature.inside'] > args.inside_temperature_from && devicestate['measure_temperature.inside'] < args.inside_temperature_to;
                return Promise.resolve(conditionMet);
            });

        /** * OUTSIDE TEMPERATURE CONDITIONS ** */
        this._v3conditionOutsideTemperatureMoreThan = new Homey.FlowCardCondition('has_outside_temperature_more_than');
        this._v3conditionOutsideTemperatureMoreThan
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const devicestate = device.getState();
                const conditionMet = devicestate['measure_temperature.outside'] > args.outside_temperature_more;
                // this.log('condition - [measure_temperature.outside]', devicestate['measure_temperature.outside']);
                // this.log('condition - args.outside_temperature_more', args.outside_temperature_more);
                // this.log('condition - conditionMet outside temp', conditionMet);
                return Promise.resolve(conditionMet);
            });

        this._v3conditionOutsideTemperatureLessThan = new Homey.FlowCardCondition('has_outside_temperature_less_than');
        this._v3conditionOutsideTemperatureLessThan
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const devicestate = device.getState();
                const conditionMet = devicestate['measure_temperature.outside'] < args.outside_temperature_less;
                return Promise.resolve(conditionMet);
            });

        this._v3conditionOutsideTemperatureBetween = new Homey.FlowCardCondition('has_outside_temperature_between');
        this._v3conditionOutsideTemperatureBetween
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const devicestate = device.getState();
                const conditionMet = devicestate['measure_temperature.outside'] > args.outside_temperature_from && devicestate['measure_temperature.outside'] < args.outside_temperature_to;
                return Promise.resolve(conditionMet);
            });

        /* ** V3 MODE CHANGE CONDITIONS ** */
        this._v3conditionAircoMode = new Homey.FlowCardCondition('mode_equals');
        this._v3conditionAircoMode
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const settings = device.getSettings();
                const conditionMet = settings.capability_mode === args.mode;
                // this.log('condition - [settings.capability_mode]', settings.capability_mode);
                // this.log('condition - args.mode', args.mode);
                // this.log('condition - conditionMet capability_mode', conditionMet);
                return Promise.resolve(conditionMet);
            });

//* ** ACTION FLOWCARDS *******************************************************************************************
    /** * TARGET TEMPERATURE ACTION ** */
        this._v3actionTargetTemp = new Homey.FlowCardAction('change_target_temp');
        this._v3actionTargetTemp
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const settings = device.getSettings();

                const ip_address = settings.comfora_ip;
                // this.log('ip_address', ip_address);

                const atemp = args.atemp;
                device.setCapabilityValue('target_temperature', atemp);
                // this.log('target temp', atemp);

                // type B adapter logic
                const useGetToPost = settings.comfora_useGetToPost;
                const adapter = settings.comfora_adapter;
                let options = {};
                // this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
                // this.log('Adapter model:', adapter)
                if (useGetToPost) options = {
                    useGetToPost: true,
                };
                else options = {
                    useGetToPost: false,
                };

                comforactrl.daikinTempControl(atemp, ip_address, options);
                return Promise.resolve(atemp);
            });

        // --- MODE CHANGE ACTIONS
        this._v3actionAircoMode = new Homey.FlowCardAction('change_mode');
        this._v3actionAircoMode
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const settings = device.getSettings();

                const ip_address = settings.comfora_ip;
                // this.log('ip_address', ip_address);

                const demo_mode = settings.comfora_demomode;
                // this.log('demo_mode', demo_mode);

                const thermostat_mode_std = args.mode;
                device.setCapabilityValue('thermostat_mode_std', thermostat_mode_std);
                // this.log('thermostat_mode_std', thermostat_mode_std);

                // type B adapter logic
                const useGetToPost = settings.comfora_useGetToPost;
                const adapter = settings.comfora_adapter;
                let options = {};
                // this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
                // this.log('Adapter model:', adapter)
                if (useGetToPost) options = {
                    useGetToPost: true,
                };
                else options = {
                    useGetToPost: false,
                };

                comforactrl.daikinModeControl(thermostat_mode_std, ip_address, options, demo_mode);
                return Promise.resolve(thermostat_mode_std);
            });

        // --- FAN RATE ACTIONS
        this._v3actionFanRate = new Homey.FlowCardAction('change_fan_rate');
        this._v3actionFanRate
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const settings = device.getSettings();

                const ip_address = settings.comfora_ip;
                // this.log('ip_address', ip_address);

                const fan_rate = args.frate;
                device.setCapabilityValue('fan_rate', fan_rate);
                // this.log('fan_rate', fan_rate);

                // type B adapter logic
                const useGetToPost = settings.comfora_useGetToPost;
                const adapter = settings.comfora_adapter;
                let options = {};
                // this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
                // this.log('Adapter model:', adapter)
                if (useGetToPost) options = {
                    useGetToPost: true,
                };
                else options = {
                    useGetToPost: false,
                };

                comforactrl.daikinFanRateControl(fan_rate, ip_address, options);
                return Promise.resolve(fan_rate);
            });

        // --- FAN DIRECTION ACTIONS
        this._v3actionFanDirection = new Homey.FlowCardAction('change_fan_direction');
        this._v3actionFanDirection
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const settings = device.getSettings();

                const ip_address = settings.comfora_ip;
                // this.log('ip_address', ip_address);

                const fan_direction = args.fdir;
                device.setCapabilityValue('fan_direction', fan_direction);
                // this.log('fan_direction', fan_direction);

                // type B adapter logic
                const useGetToPost = settings.comfora_useGetToPost;
                const adapter = settings.comfora_adapter;
                let options = {};
                // this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
                // this.log('Adapter model:', adapter)
                if (useGetToPost) options = {
                    useGetToPost: true,
                };
                else options = {
                    useGetToPost: false,
                };

                comforactrl.daikinFanDirControl(fan_direction, ip_address, options);
                return Promise.resolve(fan_direction);
            });
    }

// --- METHODS FOR TEMPERATURE FLOWCARD TRIGGERS
    /*
     * Triggers the 'luminance more than x' flow
     * @param {Device} device - A Device instance
     * @param {Object} tokens - An object with tokens and their typed values, as defined in the app.json
     * @param {Object} state - An object with properties which are accessible throughout the Flow
     */
    // --- Target Temperature triggering
    v3triggerTargetTemperatureMoreThan(device, tokens, state) {
        this.triggerFlow(this._v3triggerTargetTemperatureMoreThan, device, tokens, state);
        return this;
    }

    v3triggerTargetTemperatureLessThan(device, tokens, state) {
        this.triggerFlow(this._v3triggerTargetTemperatureLessThan, device, tokens, state);
        return this;
    }

    v3triggerTargetTemperatureBetween(device, tokens, state) {
        this.triggerFlow(this._v3triggerTargetTemperatureBetween, device, tokens, state);
        return this;
    }

    // --- Inside Temperature triggering
    v3triggerInsideTemperatureMoreThan(device, tokens, state) {
        this.triggerFlow(this._v3triggerInsideTemperatureMoreThan, device, tokens, state);
        return this;
    }

    v3triggerInsideTemperatureLessThan(device, tokens, state) {
        this.triggerFlow(this._v3triggerInsideTemperatureLessThan, device, tokens, state);
        return this;
    }

    v3triggerInsideTemperatureBetween(device, tokens, state) {
        this.triggerFlow(this._v3triggerInsideTemperatureBetween, device, tokens, state);
        return this;
    }

    // --- Outside Temperature triggering
    v3triggerOutsideTemperatureMoreThan(device, tokens, state) {
        this.triggerFlow(this._v3triggerOutsideTemperatureMoreThan, device, tokens, state);
        return this;
    }

    v3triggerOutsideTemperatureLessThan(device, tokens, state) {
        this.triggerFlow(this._v3triggerOutsideTemperatureLessThan, device, tokens, state);
        return this;
    }

    v3triggerOutsideTemperatureBetween(device, tokens, state) {
        this.triggerFlow(this._v3triggerOusideTemperatureBetween, device, tokens, state);
        return this;
    }

// --- METHODS FOR MODE FLOWCARD TRIGGERS
    // --- Mode triggering
    v3triggerCapabilityModeChange(device, tokens, state) {
        this.triggerFlow(this._v3triggerAircoMode, device, tokens, state);
        return this;
    }
}

module.exports = ComforaDriver;
