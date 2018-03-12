# Daikin AI
Adds to Homey control support for Daikin Air Conditioners and Heatpumps (aka inverters).

![Daikin logo](https://github.com/PeterEIER/nl.climate.daikin/raw/development/assets/images/Daikin-logo-wide.png)

## Features
- supports Daikin airconditioners & heatpumps through either a generic driver (called Inverter) or a model (range) specific one like Emura.
- the mobile card shows target temperature, operating mode, fan rate and fan swing mode.
- target temperature as well as operating mode can be controlled from the mobile card.

![Mobile card](https://github.com/PeterEIER/nl.climate.daikin/raw/development/assets/images/mobilecard.png)

- with the available 22 flowcards (9 trigger cards, 9 condition cards and 4 action cards) the options to automate are almost endless.
- HomeKit support* for every WiFi capable Daikin Airconditioner thru the "Model HomeKit" driver. The "Model Homekit" driver has 2 trigger flowcards, no condition flowcards and 2 action flowcards. The AC control functionality is however limited to: airco's mode setting, target temperature setting and inside temperature measurement.
  Note *: requires either HomeKit by Sprut, or HomeyKit by Bas Jansen. 


### Demo mode (upon pairing the demo mode is by default turned ON !!)
Demo mode can be disabled in the device its settings menu. Demo mode can be very usefull when you are designing new flows as demo mode prevents the airco to be switched on so you can safely experiment and test your new flows.

## Change log
### v0.5.0
- initial release to the App Store.
- Added HomeKit support (only for the Model HomeKit), functionality is limited to: mode setting, target temperature setting and inside temperature measurement (due to limitations of the HomeKit App).
- Note: this beta for sure contains bugs, let me know if you found one...

## Limitations
HomeKit support only applies for the 'Model HomeKit'.

## Credits
App uses icons that where created by http://www.freepik.com from https://www.flaticon.com is licensed by Creative Commons.