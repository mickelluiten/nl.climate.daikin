
![Daikin logo](https://github.com/PeterEIER/nl.climate.daikin/raw/development/assets/images/Daikin-logo-wide.png)

# Daikin AI
Adds to Homey control support for Daikin Air Conditioners and Heatpumps (aka inverters).

Note: Do not use the MASTER branch for now, what is available in the development branch is the best available. The beta branch is also available via the Athom's App Store.

## Features
- supports Daikin airconditioners & heatpumps through either a generic driver (called Inverter) or a model (range) specific one like Emura.
- the mobile card shows target temperature, operating mode, fan rate and fan swing mode.
- target temperature as well as operating mode can be controlled from the mobile card.

![Daikin logo](https://github.com/PeterEIER/nl.climate.daikin/raw/development/assets/images/mobilecard.png)

- with the available 22 flowcards (9 trigger cards, 9 condition cards and 4 action cards) the options to automate are almost endless.
- HomeKit support* for every WiFi capable Daikin Airconditioner thru the "Model HomeKit" driver. The "Model Homekit" driver has 2 trigger flowcards, no condition flowcards and 2 action flowcards. The AC control functionality is however limited to: airco's mode setting, target temperature setting and inside temperature measurement.
  Note *: requires either HomeKit by Sprut, or HomeyKit by Bas Jansen. 

## Demo mode (upon pairing the demo mode is by default turned ON !!)
Demo mode can be disabled in the device its settings menu. Demo mode can be very usefull when you are designing new flows as demo mode prevents the airco to be switched on so you can safely experiment and test your new flows.

## To-do (in random order)
- crush more bugs (and try not to introduce new ones...)
- improve and extend "error handling"

## Credits
App uses icons that where created by http://www.freepik.com from https://www.flaticon.com is licensed by Creative Commons.

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