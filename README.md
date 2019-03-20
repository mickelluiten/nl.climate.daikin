![Daikin logo](https://github.com/PeterEIER/nl.climate.daikin/raw/master/assets/images/Daikin-logo-wide.png)

# Daikin AI for Homey v2
Control your Daikin air conditioner (or heatpump) through Homey (running v2 firmware). This app requires that your Daikin air conditioner (or heatpump) is equipped with a WiFi adapter (either model BRP069A-- or BRP069B--).

## Features
- supports Daikin airconditioners & heatpumps (aka inverters) through model range drivers.
- the user interface, depeding on the selected driver, can show target temperature, operating mode, inside temperature, outside temperature, fan speed and fan swing mode.
- HomeKit support (see note) for every WiFi capable Daikin Airconditioner thru the "Model HomeKit" driver. The AC control functionality is however limited to: airco's mode setting, target temperature setting and inside temperature measurement.
  Note: requires either Homey's experimental Apple Homekit feature enabled or one of the following apps: "HomeKit by Sprut", "HomeyKit by Bas Jansen".
- special modes, i.e. POWERFUL, are supported for some models/model variants.

## Action flow cards
When designing flows and you add multiple Daikin AI action flowcards to a flow, or serveral flows but with the same trigger condition, it might be necessary to spread these actions over several seconds to give the airco time to process all the commands as the interface handles all the commands separately. The nature (asynchronous polling) of the Daikin interface still makes it possible that commands colide and as a result commands are not executed correctly which is something to keep in mind when building flows.

## Refresh interval
Daikin designed an interface that is based on polling which means the airconditioner must be interogated once in a while to know its current status. The polling interval of the official Daikin Online Controller app is between 30 and 60 seconds. With the refresh interval setting of the Daikin AI app it is possible to set its polling interval between 5 and 30 seconds which is up to 6 times faster. A higher refresh interval means that your Homey has more work to do. When your setup involves more than one airconditioner a polling interval of less than 10 seconds is not recommended. As a result of the polling mechanism a change made with the app, either the official Daikin Online Controller app or the Homey Daikin AI app, may not show immediately in either app. It should be noted that the refresh interval (setting) has no influence for sending commands to the airconditioner, a mode, target temperature etc. change is always executed immediately.

## Demo mode (upon pairing the demo mode is by default turned ON !!)
Demo mode can be disabled in the device its settings menu. Demo mode can be very usefull when you are designing new flows as demo mode prevents the airco to be switched on so you can safely experiment and test your new flows.

## Special Modes
Special modes are not supported by all models, model variants and/or the WiFi adapter its firmware version, in addition it might be that not all 3 special modes are supported. Check the Daikin Online Controller app which special modes are supported by your airco, during paring enable the supported Special Mode(s) by checking the applicable checkbox(es) or leave them all unchecked (disabled).

## WiFi adapter models
Daikin just recently introduced a new model WiFi adapter (BRP069B--) which uses a different way to sent commands to the airconditioner. During paring the app will pair your airconditioner with model specific default settings, in some cases you have to change these default settings which can be done in the device settings menu.

Note: the WiFi adapter its firmware version can be found in the Daikin Online Controller app (select your airco > click on the gear sysmbol > the firmware version shows under "Adapter information").  

## IP-address: the use of a static IP-address is recommended
To prevent unreliable behavior of the application the use of a fixed (static) IP-address is required. When DHCP changes your airconditioners IP-address the application will not be aware of this change and as a result the application can no longer controle the airconditioner till you manually update the IP-address in the devices its settings menu. 

Note: your airconditioner its current IP-address can be found in the Daikin Online Controller app (select your airco > click on the gear sysmbol > the IP-address shows under "Adapter information").

## Installation and/or updating the software
It is advised to turn your airconditioner OFF before and keep it switched OFF during Daikin AI software installation/upgrade/restart or when rebooting your Homey as the software will initialize itself immediately after software installation/upgrade/app restart/Homey reboot and because of that some of the airconditioner settings might change i.e. the target temperature might be set to a lower or higher temperature.

## Credits
- This Homey (by Athom) App is based on the great work of the unofficial Daikin API documentation project (https://github.com/ael-code/daikin-control) as well as the Apollon77 Daikin Controller library (https://github.com/Apollon77/daikin-controller).
- App uses icons that where created by http://www.freepik.com from https://www.flaticon.com is licensed by Creative Commons.

## Donations
If you like the app, consider buying me a cup of coffee!  
[![Paypal donate][pp-donate-image]][pp-donate-link]

[pp-donate-link]: https://www.paypal.me/donations4petereier
[pp-donate-image]: https://www.paypalobjects.com/webstatic/en_US/i/btn/png/btn_donate_92x26.png

## Development history
- 31-JAN-18: inside / outside / target temperature (fixed value for now) show on mobile card.
- 02-FEB-18: all data shown on mobile card is read from the airconditioner.
- 03-FEB-18: lifted the requirement to use experimental firmware v1.5.6, can now be previewed with Homey stable firmware v1.5.3.
- 04-FEB-18: translations of mode, fan, wing etc code in to meaningfull strings. Work done on changing airco setting.
- 07-FEB-18: Mobile card: temperature control is functional, mode selection functional.
- 11-FEB-18: 1/ Implemented the Apollon77 library. Note: for testing/troubleshooting purposes the airco power is always set to OFF.
- 11-FEB-18: 2/ Working on flow cards... not functional!
- 15-FEB-18: Added a trigger, condition and action flowcard.
- 16-FEB-18: 1/ Action triggers to set the: Airco Operation Mode, Fan rate, Fan direction and Target temperature.
- 16-FEB-18: 2/ Several code optimizations
- 16-FEB-18: 3/ Asset updates, now passes the Homey App Store validation cli
- 18-FEB-18: 1/ New pairing dialog
- 18-FEB-18: 2/ Emura driver enabled (still needs refinement...)  
- 19-FEB-18: 1/ Flowcard fix, now available to both the Emura and Inverter driver
- 19-FEB-18: 2/ Introduced demo mode which can be set via settings in demo mode the power is always OFF.
- 19-FEB-18: 3/ Mode switching: crushed a few bugs
- 20-FEB-18: The airco can now also be switched off with the mode settings wheel
- 21-FEB-18: Added a whole bunch of condition flowcards
- 22-FEB-18: Completed the flowcards for trigger (9x), condition (9x) and action (5x).
- 24-FEB-18: Code optimizations, crushed bugs that I introduced with adding of the flowcards.
- 25-FEB-18: Added Nexura driver. Fixed a bug that prevented the inside/outside flowcard triggers from triggering.
- 25-FEB-18: First beta (v0.3.0) pubilished to the Athom app store.
- 28-FEB-18: 1/ Added validation to IP-address (IPv4 validation) input field when paring, removed interval setting from paring dialog.
- 28-FEB-18: 2/ Added validation (valid = between 5 - 30 sec) to Interval input field in device settings dialog. 
- 01-MAR-18: 1/ Fixed a few bugs in app.json that caused CLI 2.0 to fail against "level debug".
- 01-MAR-18: 2/ Added IPv4 validation to device settings dialog.
- 02-MAR-18: Fixed an issue which prevented the App to be installed from the App store.
- 03-MAR-18: Fixed condition and action flow card bug.
- 05-MAR-18: Published v0.4.1 to Athom's App Store.
- 06-MAR-18: Added the Model HomeKit driver (v0.4.5).
- 10-MAR-18: Emura 2 picture replaced by a better looking one (v0.4.6). Checked ones more that athom app validate --level publish passed, which it does.
- 10-MAR-18: Added "athomForumDiscussionId": 2082, to app.json.
- 11-MAR-18: Paring abort handling.
- 09-APR-18: Added model Comfora.
- 27-APR-18: Fixed a bug (in the Apollon77 Daikin Controller library) which did make the app crash when the air conditioner could not be reached.
- 29-APR-18: Apollon77 fixed the error himself (fix#6), Daikin AI upgraded to the latest Daikin Controller lib version v1.1.2 (from v1.1.0)
- 29-APR-18: Further optimized the error handling in the Daikin AI app itself when making calls to the Apollon77 lib.
- 05-MAY-18: Removed model Inverter to decomplex things making the app easier to maintain in the furure.
- 06-MAY-18: Comfora driver changed into a multi model driver.
- 17-MAY-18: Added support for the new model WiFi controller (BRP069B--).
- 18-MAY-18: Cosmetic changes to pairing dialog.
- 25-MAY-18: Fixed a problem that prevented the mode knob to update when the mode was set using either the IR remote control or Daikin Controller app.
- 28-MAY-18: Fixed a bug which prevented flow action cards to function correctly for airco's equipped with the type B adapter.
- 31-MAY-18: Check on correct Refresh Interval setting: when it is undefined for some reason the interval will be set to its default (10 seconds) value.
- 01-JUN-18: Flow action card bug fix.
- 01-JUL-18: Main category (appliance) and sub-category (climate) reversed to optimize Athom App Store search.
- 12-AUG-18: Fan rate and Fan Swing mode can now be controlled from the mobile card. New mobile card photo added to description.
- 20-AUG-18: Minor changes to app store description.
- 28-AUG-18: Device settings menu cleanup and code optimizations.
- 30-AUG-18: Special mode control added.
- 15-SEP-18: Special modes: pick from a list instead of "on/off" switch.
- 20-OCT-18: Added hints to settings menu.
- 22-NOV-18: Fixed an issue that prevented airconditioners equipped with an type B adapter that was using firmware v1.2.51 or above to pair with Homey.
- ---------- Start of the development of V2.x.x which makes the app compatible with Homey v2 firmware, the app will no longer support Homey v1 firmware.
- 12-JAN-19: Changes in support of Homey v2 firmware.
- 19-JAN-19: More changes in support of Homey v2 firmware.
- 20-JAN-19: Even more changes in support of Homey v2 firmware.
- 20-JAN-19: Removed the special mode "Streamer" and replaced "Dehumidify" by the "Dry" selection for Emura and Nexura driver. "Dry" is a on/off capability therefor the target humidity control is not show in the UI.
- 20-JAN-19: Combined "Dehumidify" and "Streamer" functionality for Comfora, Sensira etc driver, the "Dehumidify" function enables the ability to set a target humidity % via the UI.
- 21-JAN-19: Fixed a bug (missing flow cards) introduced with v2.0.2 that impacted Model Homekit.
- 23-JAN-19: Made customizations to the thermostat knob its color appearance for all models except Model Homekit. The behaviour is however still very different, due to SDK software constraints, from that of Model Homekit which behavior is Homey's "Thermostat control standard" (both for the knob and thermostat mode selector).
- 01-FEB-19: Changed the AC function naming for several "picker" selections.
- 17-MAR-19: Added additional action and condition flowcard.
- 20-MAR-19: Fixed an action flow card bug.
