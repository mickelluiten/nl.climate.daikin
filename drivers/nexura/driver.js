'use strict';

const Homey = require('homey');
const Driver = require('../../drivers/driver');
const nexuractrl = require('../../lib/daikin');

// Driver for a Daikin Nexura type Airconditioner
class NexuraDriver extends Driver {
    onInit() {
        this.deviceType = 'nexura';

//* ** V3 TRIGGER FLOWCARDS *******************************************************************************************
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

        /** * MODE CHANGE TRIGGERS ** */
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

//* ** V3 CONDITION FLOWCARDS *******************************************************************************************
    /* ** TARGET TEMPERATURE CONDITIONS ** */
        this._v3conditionTargetTemperatureMoreThan = new Homey.FlowCardCondition('has_target_temperature_more_than');
        this._v3conditionTargetTemperatureMoreThan
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const devicestate = device.getState();
                const conditionMet = devicestate.target_temperature > args.target_temperature_more;
                // this.log('condition args.target_temperature_more', args.target_temperature_more);
                // this.log('condition device.getState().target_temperature', devicestate.target_temperature);
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

        /* ** INSIDE TEMPERATURE CONDITIONS ** */
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

        /* ** OUTSIDE TEMPERATURE CONDITIONS ** */
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

        /* ** MODE CHANGE CONDITIONS ** */
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

//* ** V3 ACTION FLOWCARDS *******************************************************************************************
    /* ** TARGET TEMPERATURE ACTION ** */
        this._v3actionTargetTemp = new Homey.FlowCardAction('change_target_temp');
        this._v3actionTargetTemp
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const settings = device.getSettings();

                const ip_address = settings.nexura_ip;
                // this.log('ip_address', ip_address);

                const atemp = args.atemp;
                device.setCapabilityValue('target_temperature', atemp);
                // this.log('target temp', atemp);

                // type B adapter logic
                const useGetToPost = settings.nexura_useGetToPost;
                const adapter = settings.nexura_adapter;
                let options = {};
                // this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
                // this.log('Adapter model:', adapter)
                if (useGetToPost) options = {
                    useGetToPost: true,
                };
                else options = {
                    useGetToPost: false,
                };

                nexuractrl.daikinTempControl(atemp, ip_address, options);
                return Promise.resolve(atemp);
            });

        // --- MODE CHANGE ACTIONS
        this._v3actionAircoMode = new Homey.FlowCardAction('change_mode');
        this._v3actionAircoMode
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const settings = device.getSettings();

                const ip_address = settings.nexura_ip;
                // this.log('ip_address', ip_address);

                const demo_mode = settings.nexura_demomode;
                // this.log('demo_mode', demo_mode);

                const thermostat_mode_std = args.mode;
                device.setCapabilityValue('thermostat_mode_std', thermostat_mode_std);
                // this.log('thermostat_mode_std', thermostat_mode_std);

                // type B adapter logic
                const useGetToPost = settings.nexura_useGetToPost;
                const adapter = settings.nexura_adapter;
                let options = {};
                // this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
                // this.log('Adapter model:', adapter)
                if (useGetToPost) options = {
                    useGetToPost: true,
                };
                else options = {
                    useGetToPost: false,
                };

                nexuractrl.daikinModeControl(thermostat_mode_std, ip_address, options, demo_mode);
                return Promise.resolve(thermostat_mode_std);
            });

        // --- FAN RATE ACTIONS
        this._v3actionFanRate = new Homey.FlowCardAction('change_fan_rate');
        this._v3actionFanRate
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const settings = device.getSettings();

                const ip_address = settings.nexura_ip;
                // this.log('ip_address', ip_address);

                const fan_rate = args.frate;
                device.setCapabilityValue('fan_rate', fan_rate);
                // this.log('fan_rate', fan_rate);

                // type B adapter logic
                const useGetToPost = settings.nexura_useGetToPost;
                const adapter = settings.nexura_adapter;
                let options = {};
                // this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
                // this.log('Adapter model:', adapter)
                if (useGetToPost) options = {
                    useGetToPost: true,
                };
                else options = {
                    useGetToPost: false,
                };

                nexuractrl.daikinFanRateControl(fan_rate, ip_address, options);
                return Promise.resolve(fan_rate);
            });

        // --- FAN DIRECTION ACTIONS
        this._v3actionFanDirection = new Homey.FlowCardAction('change_fan_direction');
        this._v3actionFanDirection
            .register()
            .registerRunListener((args, state) => {
                const device = args.device;
                const settings = device.getSettings();

                const ip_address = settings.nexura_ip;
                // this.log('ip_address', ip_address);

                const fan_direction = args.fdir;
                device.setCapabilityValue('fan_direction', fan_direction);
                // this.log('fan_direction', fan_direction);

                // type B adapter logic
                const useGetToPost = settings.nexura_useGetToPost;
                const adapter = settings.nexura_adapter;
                let options = {};
                // this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
                // this.log('Adapter model:', adapter)
                if (useGetToPost) options = {
                    useGetToPost: true,
                };
                else options = {
                    useGetToPost: false,
                };

                nexuractrl.daikinFanDirControl(fan_direction, ip_address, options);
                return Promise.resolve(fan_direction);
            });

//*** !! DEPRECIATED !! TRIGGER FLOWCARDS *******************************************************************************************
    //--- Temperature flowcards	
        /*** TARGET TEMPERATURE TRIGGERS ***/
        this._triggerTargetTemperatureMoreThan = new Homey.FlowCardTriggerDevice('change_nexura_target_temperature_more_than').register();
        this._triggerTargetTemperatureMoreThan.registerRunListener((args, state) => {
            let conditionMet = state.target_temperature > args.target_temperature_more;

            //this.log('trigger - args.target_temperature_more', args.target_temperature_more);
            //this.log('trigger - state.target_temperature', (state.target_temperature) );
            //this.log('trigger - conditionMet', conditionMet);
            return Promise.resolve(conditionMet);
        });

        this._triggerTargetTemperatureLessThan = new Homey.FlowCardTriggerDevice('change_nexura_target_temperature_less_than').register();
        this._triggerTargetTemperatureLessThan.registerRunListener((args, state) => {
            let conditionMet = state.target_temperature < args.target_temperature_less;
            return Promise.resolve(conditionMet);
        });

        this._triggerTargetTemperatureBetween = new Homey.FlowCardTriggerDevice('change_nexura_target_temperature_between').register();
        this._triggerTargetTemperatureBetween.registerRunListener((args, state) => {
            let conditionMet = state.target_temperature > args.target_temperature_from && state.target_temperature < args.target_temperature_to;
            return Promise.resolve(conditionMet);
        });

        /*** INSIDE TEMPERATURE TRIGGERS ***/
        this._triggerInsideTemperatureMoreThan = new Homey.FlowCardTriggerDevice('inside_nexura_temperature_more_than').register();
        this._triggerInsideTemperatureMoreThan.registerRunListener((args, state) => {
            let conditionMet = state['measure_temperature.inside'] > args.inside_temperature_more;

            //this.log('trigger - args.inside_temperature_more', args.inside_temperature_more);
            //this.log('trigger - state()[measure_temperature.inside]', ( state['measure_temperature.inside']) );
            //this.log('trigger - conditionMet inside temp', conditionMet);
            return Promise.resolve(conditionMet);
        });

        this._triggerInsideTemperatureLessThan = new Homey.FlowCardTriggerDevice('inside_nexura_temperature_less_than').register();
        this._triggerInsideTemperatureLessThan.registerRunListener((args, state) => {
            let conditionMet = state['measure_temperature.inside'] < args.inside_temperature_less;
            return Promise.resolve(conditionMet);
        });

        this._triggerInsideTemperatureBetween = new Homey.FlowCardTriggerDevice('inside_nexura_temperature_between').register();
        this._triggerInsideTemperatureBetween.registerRunListener((args, state) => {
            let conditionMet = state['measure_temperature.inside'] > args.inside_temperature_from && state['measure_temperature.inside'] < args.inside_temperature_to;
            return Promise.resolve(conditionMet);
        });

        /*** OUTSIDE TEMPERATURE TRIGGERS ***/
        this._triggerOutsideTemperatureMoreThan = new Homey.FlowCardTriggerDevice('outside_nexura_temperature_more_than').register();
        this._triggerOutsideTemperatureMoreThan.registerRunListener((args, state) => {
            let conditionMet = state['measure_temperature.outside'] > args.outside_temperature_more;

            //this.log('trigger - args.outside_temperature_more', args.outside_temperature_more);
            //this.log('trigger - state[measure_temperature.outside]', ( state['measure_temperature.outside']) );
            //this.log('trigger - conditionMet outside temp', conditionMet);
            return Promise.resolve(conditionMet);
        });

        this._triggerOutsideTemperatureLessThan = new Homey.FlowCardTriggerDevice('outside_nexura_temperature_less_than').register();
        this._triggerOutsideTemperatureLessThan.registerRunListener((args, state) => {
            let conditionMet = state['measure_temperature.outside'] < args.ouside_temperature_less;
            return Promise.resolve(conditionMet);
        });

        this._triggerOutsideTemperatureBetween = new Homey.FlowCardTriggerDevice('outside_nexura_temperature_between').register();
        this._triggerOutsideTemperatureBetween.registerRunListener((args, state) => {
            let conditionMet = state['measure_temperature.outside'] > args.outside_temperature_from && state['measure_temperature.outside'] < args.outside_temperature_to;
            return Promise.resolve(conditionMet);
        });

        /*** MODE CHANGE TRIGGERS ***/
        this._triggerAircoMode = new Homey.FlowCardTriggerDevice('mode_nexura_changed').register();
        this._triggerAircoMode.registerRunListener((args, state) => {
            let conditionMet = state['capability_mode'] == args.mode;

            //this.log('trigger - args.mode', args.mode);
            //this.log('trigger - state[capability_mode]', ( state['capability_mode']) );
            //this.log('trigger - conditionMet capability_mode', conditionMet);
            return Promise.resolve(conditionMet);
        });

//*** !! DEPRECIATED !! CONDITION FLOWCARDS *******************************************************************************************
    /*** TARGET TEMPERATURE CONDITIONS ***/
        this._conditionTargetTemperatureMoreThan = new Homey.FlowCardCondition('has_nexura_target_temperature_more_than').register();
        this._conditionTargetTemperatureMoreThan.registerRunListener((args, state) => {
            let device = args.device;
            let devicestate = device.getState();
            let conditionMet = devicestate.target_temperature > args.target_temperature_more;

            //this.log('condition args.target_temperature_more', args.target_temperature_more);            
            //this.log('condition device.getState().target_temperature', devicestate.target_temperature);
            //this.log('condition conditionMet', conditionMet);
            return Promise.resolve(conditionMet);
        });

        this._conditionTargetTemperatureLessThan = new Homey.FlowCardCondition('has_nexura_target_temperature_less_than').register();
        this._conditionTargetTemperatureLessThan.registerRunListener((args, state) => {
            let device = args.device;
            let devicestate = device.getState();
            let conditionMet = devicestate.target_temperature < args.target_temperature_less;
            return Promise.resolve(conditionMet);
        });

        this._conditionTargetTemperatureBetween = new Homey.FlowCardCondition('has_nexura_target_temperature_between').register();
        this._conditionTargetTemperatureBetween.registerRunListener((args, state) => {
            let device = args.device;
            let devicestate = device.getState();
            let conditionMet = devicestate.target_temperature > args.target_temperature_from && devicestate.target_temperature < args.target_temperature_to;
            return Promise.resolve(conditionMet);
        });

        /*** INSIDE TEMPERATURE CONDITIONS ***/
        this._conditionInsideTemperatureMoreThan = new Homey.FlowCardCondition('has_nexura_inside_temperature_more_than').register();
        this._conditionInsideTemperatureMoreThan.registerRunListener((args, state) => {
            let device = args.device;
            let devicestate = device.getState();
            let conditionMet = devicestate['measure_temperature.inside'] > args.inside_temperature_more;

            //this.log('condition - [measure_temperature.inside]', devicestate['measure_temperature.inside']);
            //this.log('condition - args.inside_temperature_more', args.inside_temperature_more);
            //this.log('condition - conditionMet inside temp', conditionMet);
            return Promise.resolve(conditionMet);
        });

        this._conditionInsideTemperatureLessThan = new Homey.FlowCardCondition('has_nexura_inside_temperature_less_than').register();
        this._conditionInsideTemperatureLessThan.registerRunListener((args, state) => {
            let device = args.device;
            let devicestate = device.getState();
            let conditionMet = devicestate['measure_temperature.inside'] < args.inside_temperature_less;
            return Promise.resolve(conditionMet);
        });

        this._conditionInsideTemperatureBetween = new Homey.FlowCardCondition('has_nexura_inside_temperature_between').register();
        this._conditionInsideTemperatureBetween.registerRunListener((args, state) => {
            let device = args.device;
            let devicestate = device.getState();
            let conditionMet = devicestate['measure_temperature.inside'] > args.inside_temperature_from && devicestate['measure_temperature.inside'] < args.inside_temperature_to;
            return Promise.resolve(conditionMet);
        });

        /*** OUTSIDE TEMPERATURE CONDITIONS ***/
        this._conditionOutsideTemperatureMoreThan = new Homey.FlowCardCondition('has_nexura_outside_temperature_more_than').register();
        this._conditionOutsideTemperatureMoreThan.registerRunListener((args, state) => {
            let device = args.device;
            let devicestate = device.getState();
            let conditionMet = devicestate['measure_temperature.outside'] > args.outside_temperature_more;

            //this.log('condition - [measure_temperature.outside]', devicestate['measure_temperature.outside']);
            //this.log('condition - args.outside_temperature_more', args.outside_temperature_more);
            //this.log('condition - conditionMet outside temp', conditionMet);
            return Promise.resolve(conditionMet);
        });

        this._conditionOutsideTemperatureLessThan = new Homey.FlowCardCondition('has_nexura_outside_temperature_less_than').register();
        this._conditionOutsideTemperatureLessThan.registerRunListener((args, state) => {
            let device = args.device;
            let devicestate = device.getState();
            let conditionMet = devicestate['measure_temperature.outside'] < args.outside_temperature_less;
            return Promise.resolve(conditionMet);
        });

        this._conditionOutsideTemperatureBetween = new Homey.FlowCardCondition('has_nexura_outside_temperature_between').register();
        this._conditionOutsideTemperatureBetween.registerRunListener((args, state) => {
            let device = args.device;
            let devicestate = device.getState();
            let conditionMet = devicestate['measure_temperature.outside'] > args.outside_temperature_from && devicestate['measure_temperature.outside'] < args.outside_temperature_to;
            return Promise.resolve(conditionMet);
        });

        /*** MODE CHANGE CONDITIONS ***/
        this._conditionAircoMode = new Homey.FlowCardCondition('mode_nexura_equals').register();
        this._conditionAircoMode.registerRunListener((args, state) => {
            let device = args.device;
            let settings = device.getSettings();
            let conditionMet = settings.capability_mode == args.mode;

            //this.log('condition - [settings.capability_mode]', settings.capability_mode);
            //this.log('condition - args.mode', args.mode);
            //this.log('condition - conditionMet capability_mode', conditionMet);
            return Promise.resolve(conditionMet);
        });

//*** !! DEPRECIATED !! ACTION FLOWCARDS *******************************************************************************************
    /*** TARGET TEMPERATURE ACTION ***/
        this._actionTargetTemp = new Homey.FlowCardAction('change_nexura_target_temp').register();
        this._actionTargetTemp.registerRunListener((args, state) => {
            let device = args.device;
            let settings = device.getSettings();

            var ip_address = settings.nexura_ip;
            //this.log('ip_address', ip_address);                        

            var atemp = args.atemp;
            device.setCapabilityValue('target_temperature', atemp);
            //this.log('target temp', atemp);

            // type B adapter logic
            var useGetToPost = settings.nexura_useGetToPost;
            var adapter = settings.nexura_adapter;
            var options = {};
            //this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
            //this.log('Adapter model:', adapter)
            if (useGetToPost) options = {
                'useGetToPost': true
            };
            else options = {
                'useGetToPost': false
            };

            nexuractrl.daikinTempControl(atemp, ip_address, options);
            return Promise.resolve(atemp);
        });

        //--- MODE CHANGE ACTIONS
        this._actionAircoMode = new Homey.FlowCardAction('change_nexura_mode').register();
        this._actionAircoMode.registerRunListener((args, state) => {
            let device = args.device;
            let settings = device.getSettings();

            var ip_address = settings.nexura_ip;
            //this.log('ip_address', ip_address);                        

            var demo_mode = settings.nexura_demomode;
            //this.log('demo_mode', demo_mode);  

            var thermostat_mode_std = args.mode;
            device.setCapabilityValue('thermostat_mode_std', thermostat_mode_std);
            //this.log('thermostat_mode_std', thermostat_mode_std); 

            // type B adapter logic
            var useGetToPost = settings.nexura_useGetToPost;
            var adapter = settings.nexura_adapter;
            var options = {};
            //this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
            //this.log('Adapter model:', adapter)
            if (useGetToPost) options = {
                'useGetToPost': true
            };
            else options = {
                'useGetToPost': false
            };

            nexuractrl.daikinModeControl(thermostat_mode_std, ip_address, options, demo_mode);
            return Promise.resolve(thermostat_mode_std);
        });

        //--- FAN RATE ACTIONS
        this._actionFanRate = new Homey.FlowCardAction('change_nexura_fan_rate').register();
        this._actionFanRate.registerRunListener((args, state) => {
            let device = args.device;
            let settings = device.getSettings();

            var ip_address = settings.nexura_ip;
            //this.log('ip_address', ip_address);                        

            var fan_rate = args.frate;
            device.setCapabilityValue('fan_rate', fan_rate);
            //this.log('fan_rate', fan_rate);

            // type B adapter logic
            var useGetToPost = settings.nexura_useGetToPost;
            var adapter = settings.nexura_adapter;
            var options = {};
            //this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
            //this.log('Adapter model:', adapter)
            if (useGetToPost) options = {
                'useGetToPost': true
            };
            else options = {
                'useGetToPost': false
            };

            nexuractrl.daikinFanRateControl(fan_rate, ip_address, options);
            return Promise.resolve(fan_rate);
        });

        //--- FAN DIRECTION ACTIONS
        this._actionFanDirection = new Homey.FlowCardAction('change_nexura_fan_direction').register();
        this._actionFanDirection.registerRunListener((args, state) => {
            let device = args.device;
            let settings = device.getSettings();

            var ip_address = settings.nexura_ip;
            //this.log('ip_address', ip_address);                        

            var fan_direction = args.fdir;
            device.setCapabilityValue('fan_direction', fan_direction);
            //this.log('fan_direction', fan_direction);

            // type B adapter logic
            var useGetToPost = settings.nexura_useGetToPost;
            var adapter = settings.nexura_adapter;
            var options = {};
            //this.log('firmware < v2.0.1 (then useGetToPost):', useGetToPost);
            //this.log('Adapter model:', adapter)
            if (useGetToPost) options = {
                'useGetToPost': true
            };
            else options = {
                'useGetToPost': false
            };

            nexuractrl.daikinFanDirControl(fan_direction, ip_address, options);
            return Promise.resolve(fan_direction);
        });
    }

// --- !! DEPRECIATED !! METHODS FOR TEMPERATURE FLOWCARD TRIGGERS
    /*
     * Triggers the 'luminance more than x' flow
     * @param {Device} device - A Device instance
     * @param {Object} tokens - An object with tokens and their typed values, as defined in the app.json
     * @param {Object} state - An object with properties which are accessible throughout the Flow
     */
    // --- Target Temperature triggering
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

    // --- Inside Temperature triggering
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

    // --- Outside Temperature triggering
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

// --- !! DEPRECIATED !! METHODS FOR MODE FLOWCARD TRIGGERS
    // --- Mode triggering
    triggerCapabilityModeChange(device, tokens, state) {
        this.triggerFlow(this._triggerAircoMode, device, tokens, state);
        return this;
    }

// --- V3 METHODS FOR TEMPERATURE FLOWCARD TRIGGERS
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

// --- V3 METHODS FOR MODE FLOWCARD TRIGGERS
    // --- Mode triggering
    v3triggerCapabilityModeChange(device, tokens, state) {
        this.triggerFlow(this._v3triggerAircoMode, device, tokens, state);
        return this;
    }
}

module.exports = NexuraDriver;
