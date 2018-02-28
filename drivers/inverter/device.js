"use strict";

const Homey = require('homey');
const Device = require('../../lib/Device');
const util = require('../../lib/Daikin');

//Device for a Daikin Inverter device
class InverterDevice extends Device {

    onInit() {						

		super.onInit();

		this.log('Inverter capability registration started...');
        this.registerCapabilityListener('airco_mode_inverter', this.onCapabilityMode.bind(this));
		this.registerCapabilityListener('fan_rate', this.onCapabilityFanRate.bind(this));			
		this.registerCapabilityListener('fan_direction', this.onCapabilityFanDir.bind(this));	       
		this.registerCapabilityListener('target_humidty', this.onCapabilityAircoHum.bind(this));
        this.registerCapabilityListener('set_temperature', this.onCapabilityAircoTemp.bind(this));        
		this.registerCapabilityListener('measure_temperature.inside', this.onCapabilityMeasureTemperature.bind(this));
        this.registerCapabilityListener('measure_temperature.outside', this.onCapabilityMeasureTemperature.bind(this));       
                
		this.log('Inverter registration of Capabilities and Report Listeners completed!');
        
        // for documentation about the Daikin API look at https://github.com/Apollon77/daikin-controller and at
        // https://github.com/Apollon77/daikin-controller

    	this.setCapabilityValue('airco_mode_inverter', "off");  // ensure a valid mode is shown at start up...
                
        this.inverterIsDeleted = false;
        this.refreshData(); // refresh every x-seconds the Homey app with data retrieved from the airco...

    }
		
	onAdded() {
		this.log('Inverter device added');

	}

    // this method is called when the Device is deleted
    onDeleted() {
        this.log('Inverter device deleted');
        
        this.setSettings({inverter_ip: "0.0.0.0", interval: 0})
            .then(this.log('settings for Inverter are cleared'));
            
        this.inverterIsDeleted = true;
        
    }

//-------- app capabilities --------------
    	
    // Capability 1: Device get/set mode
    onCapabilityMode(airco_mode_inverter) {
		this.log('onCapabilityMode');
		this.log('mode:', airco_mode_inverter);
        
    	this.setCapabilityValue('airco_mode_inverter', airco_mode_inverter);
        
        this.daikinModeControl(airco_mode_inverter);

		return Promise.resolve();  
	}
    
    // Capability 2: Device get/set fan rate
    onCapabilityFanRate(fan_rate) {
		this.log('onCapabilityFanRate');

		this.log('fan rate:', fan_rate);
    	this.setCapabilityValue('fan_rate', fan_rate);
        
        this.daikinFanRateControl(fan_rate);

		return Promise.resolve();  
	}

    // Capability 3: Device get/set fan direction
    onCapabilityFanDir(fan_direction) {
		this.log('onCapabilityFanDir');

		this.log('fan direction:', fan_direction);
    	this.setCapabilityValue('fan_direction', fan_direction);
        
        this.daikinFanDirControl(fan_direction);

		return Promise.resolve();  
	}

    // Capability 4: Device get/set humidity
    onCapabilityAircoHum(ahum) {
		this.log('onCapabilityAircoHum');

		this.log('humidity %:', ahum);
    	this.setCapabilityValue('set_humidity', ahum);
        
        return Promise.resolve();  
	}
      
    // Capability 5: Device get/set target temperature
    onCapabilityAircoTemp(atemp, opts) {
		this.log('onCapabilityAircoTemp');

 	    var oldTargetTemperature = this.getState().set_temperature;
        this.log('oldTargetTemperature: ', oldTargetTemperature);
 	    
        if (oldTargetTemperature != atemp) {
           this.log('new target airco temperature °C:', atemp);        
 	   	   this.setCapabilityValue('set_temperature', atemp);
       
 	   	   let device = this;
 	   	   let tokens = {
 	   		   'temperature_set': atemp
 	   	   };
       
 	   	   let state  = {
 	   		   'set_temperature': atemp
 	   	   }
       
 	   	   // trigger temperature flows
 	   	   let driver = this.getDriver();
 	   	   driver
 	   			.triggerTargetTemperatureMoreThan(device, tokens, state)
 	   			.triggerTargetTemperatureLessThan(device, tokens, state)
 	   			.triggerTargetTemperatureBetween(device, tokens, state);
           
           // update the airco its settings         
           this.daikinTempControl(atemp);
 	   	}
       
		return Promise.resolve(); 
        
    }        
   	
    // Capability 6 & 7: Device measure in/outside temperature    
    onCapabilityMeasureTemperature(inside, outside) {
		this.log('onCapabilityMeasureTemperature');

        // updates by interrogation of the airco, refer to refreshData method.

		return Promise.resolve();
             
	}

//-------- airco data retrieval and app refresh/update methods --------------

    // look for changes in the airco its settings made outside of Homey app...
    refreshData() {
		this.log('refreshData');
        
        if (this.inverterIsDeleted) {
            this.log('Inverter device has been deleted, the refresh loop is now stopped...');
            
            return;
        }

        var settings = this.getSettings();
        var inverter_ip = settings.inverter_ip; this.log('Inverter ip-address: ', inverter_ip);        
        var interval = settings.interval; this.log('Refresh interval: ', interval);
        
        var currentmode = this.getState().airco_mode_inverter;     
        if (currentmode != "off") this.deviceRequestControl(inverter_ip); // refresh only when the airco is powered on...
		this.deviceRequestSensor(inverter_ip);                            // always refresh sensors...
     
        setTimeout(this.refreshData.bind(this), interval * 1000);
        
    }

    // Interrogate Airconditioner Status
	deviceRequestControl(inverter_ip) {
		this.log('deviceRequestControl');
	    
	    util.request_control(inverter_ip, this.updateControlListeners.bind(this));
		
		return Promise.resolve();
    }

    // Interrogate Airconditioner Temperature Sensor
	deviceRequestSensor(inverter_ip) {
		this.log('deviceRequestSensor');
				
	    util.request_sensor(inverter_ip, this.updateSensorListeners.bind(this));
		
		return Promise.resolve();
    }

   // Update the app after interrogation of control_request
	updateControlListeners(control_info, control_response) {        
		this.log('updateControlListeners');

    //---- mode
        var airco_mode_inverters = [ "auto", "auto1", "dehumid", "cooling", "heating", "off", "fan", "auto2" ];                        
        const amode = Number(control_info[2]);
        const airco_mode_inverter = airco_mode_inverters[amode];	
        this.log('mode:', airco_mode_inverter);
        this.setCapabilityValue('airco_mode_inverter', airco_mode_inverter);
        
    //---- temperature
		const atemp = Number(control_info[4]);
        this.log('temperature °C:', atemp);  
        this.setCapabilityValue('set_temperature', atemp);
        
    //---- humidity
		const ahum = Number(control_info[5]);      
    	this.setCapabilityValue('set_humidity', ahum);              
        
    //---- fan rate
        var fan_rates = [ "A", "B", "3", "4", "5", "6", "7"];
		var frate_nbr = -1;
        const frate = String(control_info[23]);
        if (frate == "A") { frate_nbr = 0; }
        if (frate == "B") { frate_nbr = 1; } 
        if ( frate_nbr !=0 && frate_nbr != 1 ) { frate_nbr = parseInt(frate - 1); }
        const fan_rate = fan_rates[frate_nbr];
        this.log('frate:', fan_rate);            
    	this.setCapabilityValue('fan_rate', fan_rate);
            
    //---- fan direction
        var fan_directions = [ "0", "1", "2", "3" ];
		const fdir = Number(control_info[24]);      
        const fan_direction = fan_directions[fdir];             
    	this.setCapabilityValue('fan_direction', fan_direction);
        this.log('fdir:', fan_direction);                 	
		return Promise.resolve();
	}

   // Update the app after interrogation of sensor_request
	updateSensorListeners(sensor_info) {        
		this.log('updateSensorListeners');

	    var oldInsideTemperature = this.getState()['measure_temperature.inside'];
        this.log('oldInsideTemperature: ', oldInsideTemperature);
 	    var oldOutsideTemperature = this.getState()['measure_temperature.outside'];
        this.log('oldOutsideTemperature: ', oldOutsideTemperature);   

		const inside = Number(sensor_info[1]);
		const outside = Number(sensor_info[3]);
		this.setCapabilityValue('measure_temperature.inside', inside);
        this.log('Temp inside:', inside);     
        this.setCapabilityValue('measure_temperature.outside', outside);
        this.log('Temp outside:', outside);            		

    //--- Flowcards logic
        if (oldInsideTemperature != inside) {
           this.log('new inside airco temperature °C:', inside);        
           this.setCapabilityValue('measure_temperature.inside', inside);

	   	   let device = this;
	   	   let tokens = {
	   		   'inside_temperature': inside
	   	   };

	   	   let state  = {
	   		   'measure_temperature.inside': inside
	   	   }

	   	   // trigger inside temperature flows
	   	   let driver = this.getDriver();
	   	   driver
	   			.triggerInsideTemperatureMoreThan(device, tokens, state)
	   			.triggerInsideTemperatureLessThan(device, tokens, state)
	   			.triggerInsideTemperatureBetween(device, tokens, state);

        }
         	    
        if (oldOutsideTemperature != outside) {
           this.log('new outside airco temperature °C:', outside);        
           this.setCapabilityValue('measure_temperature.outside', outside);
       
 	   	   let device = this;
 	   	   let tokens = {
 	   		   'outside_temperature': outside
 	   	   };
       
 	   	   let state  = {
 	   		   'measure_temperature.outside': outside
 	   	   }
       
 	   	   // trigger outside temperature flows
 	   	   let driver = this.getDriver();
 	   	   driver
 	   			.triggerOutsideTemperatureMoreThan(device, tokens, state)
 	   			.triggerOutsideTemperatureLessThan(device, tokens, state)
 	   			.triggerOutsideTemperatureBetween(device, tokens, state);

        }

		return Promise.resolve();
	}

//-------- airco controll methods --------------

    // POST new Power settings to Airconditioner    
    daikinPowerControl(pow) {
       this.log('daikinPowerControl');

       var settings = this.getSettings();
       var inverter_ip = settings.inverter_ip;
              
       var daikin = new DaikinAC(inverter_ip, options, function(err) {

           daikin.setACControlInfo({"pow":pow});           
       });
       this.log('Power control: ', pow);      
    }

    // POST new Mode settings to Airconditioner    
    daikinModeControl(airco_mode_inverter) {
       this.log('daikinModeControl');

       var settings = this.getSettings();
       var inverter_ip = settings.inverter_ip;
       var demo_mode = settings.demomode;
       
       util.daikinModeControl(airco_mode_inverter, inverter_ip, demo_mode);
      
    }  

    // POST new Fan Rate settings to Airconditioner    
    daikinFanRateControl(fan_rate) {
       this.log('daikinFanRateControl');
    
       var settings = this.getSettings();
       var inverter_ip = settings.inverter_ip;
       
       util.daikinFanRateControl(fan_rate, inverter_ip);
       
    }  

    // POST new Fan Rate settings to Airconditioner    
    daikinFanDirControl(fan_direction) {
       this.log('daikinFanDirControl');
    
       var settings = this.getSettings();
       var inverter_ip = settings.inverter_ip;
       
       util.daikinFanDirControl(fan_direction, inverter_ip);
      
    }  
       
    // POST new Temperature settings to Airconditioner    
    daikinTempControl(atemp) {
       this.log('daikinTempControl');

       var settings = this.getSettings();
       var inverter_ip = settings.inverter_ip;

       util.daikinTempControl(atemp, inverter_ip);

    }

}

module.exports = InverterDevice;