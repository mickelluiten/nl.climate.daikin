# Daikin AI
Adds to Homey control support for Daikin Air Conditioners and Heatpumps (aka inverters).

![Daikin logo](https://github.com/PeterEIER/nl.climate.daikin/raw/development/assets/images/Daikin-logo-wide.png)

## Features
- supports Daikin airconditioners & heatpumps through either a generic driver (called Inverter) or a model (range) specific one like Emura.
- the mobile card shows target temperature, operating mode, fan rate and fan swing mode.
- target temperature as well as operating mode can be controlled from the mobile card.

![Daikin logo](https://github.com/PeterEIER/nl.climate.daikin/raw/development/assets/images/mobilecard.png)

- with the available 22 flowcards (9 trigger cards, 9 condition cards and 4 action cards) the options to automate are almost endless.

### Demo mode (upon pairing the demo mode is by default turned ON !!)
Demo mode can be disabled in the device its settings menu. Demo mode can be very usefull when you are designing new flows as demo mode prevents the airco to be switched on so you can safely experiment and test your new flows.

## Change log
### v0.4.1
- initial beta release to Athom App Store.
  Note: this beta for sure contains bugs, let me know if you found one...

### v0.3.0
- was only available via GitHub

### v0.2.0
- was only available via GitHub

### v0.1.0
- was only available via GitHub

## Limitations
HomeKit is not supported, however in future updates I might add a "HomeKit model". This "HomeKit model" should than make it possible to control only the basic capabilities, i.e. cool, heat, off, temp setting, of "every" WiFi capable Daikin airconditioner using HomeKit.

## Credits
App uses icons that where created by http://www.freepik.com from https://www.flaticon.com is licensed by Creative Commons.