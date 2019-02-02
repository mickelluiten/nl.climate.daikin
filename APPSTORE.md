# Daikin AI for Homey v2
Control your Daikin air conditioner (or heatpump) through Homey (running v2 firmware). This app requires that your Daikin air conditioner (or heatpump) is equipped with a WiFi adapter (either model BRP069A-- or BRP069B--).

![Daikin logo](https://github.com/PeterEIER/nl.climate.daikin/raw/master/assets/images/Daikin-logo-wide.png)

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
It is advised to turn your airconditioner OFF before and keep it switched OFF during software installation or when upgrading the software as the software will initialize itself immediately after installation and because of that some of the airconditioner settings might change i.e. the target temperature might be set to a lower of higher temperature.

## Change log
#### v2.0.7
- Updates to this readme file.

#### v2.0.6
- Updates to this readme file.

#### v2.0.5
- Updates to this readme file.

#### v2.0.4
- Changed the AC function naming for several "picker" selections.

#### v2.0.3
- Fixed a bug (missing flow cards) that was introduced with v2.0.2 and impacted Model Homekit.
- Made customizations to the thermostat knob its color appearance for all models except Model Homekit. The behaviour is however still very different, due to SDK software constraints, from that of Model Homekit which behavior is Homey's "Thermostat control standard" (both for the knob and thermostat mode selector).

#### v2.0.2
- Even more changes in support of Homey v2 firmware.
- Removed the special mode "Streamer" for the Emura and Nexura model as these models do not support this special mode.
- Replaced the "Dehumidify" mode selection with "Dry" for the Emura and Nexura model, the "Dry" fucntion is either ON or OFF for these models.
- Combined the "Dehumidify" and "Streamer" functionality for the Comfora, Sensira etc. model. The combined "Dehumidify/Streamer" function makes it possible to set the target humidity % thru an extra slider control. 

#### v2.0.1
- More changes in support of Homey v2 firmware.

#### v2.0.0
- Changes in support of Homey v2 firmware.

## Limitations
- The app is not compatible with Homey v1 firmware.
- The "Airflow Rate" and "Swing" (a picker) control requires Homey mobile app version 2.0.6 or higher to be shown.
- HomeKit support only applies for the 'Model HomeKit'.
- DHCP is not supported.
- Not all Daikin airconditioner models / model series / combinations of indoor and outdoor units are supported. Due to the fact that Daikin does not disclose their interface specification reverse engineering of the interface is extremely difficult.
- Homey speech is not supported (note: Homekit driver users have speech support through Siri and can set airconditioner mode and the target temperature).
- Special modes can not be used in flows.

## Compatible units
#### in combination with BRP069A41:
FTXG20LV1BW, FTXG20LV1BS , FTXG25LV1BW, FTXG25LV1BS, FTXG35LV1BW, FTXG35LV1BS, FTXG50LV1BW, FTXG50LV1BS, FTXJ20LV1BW, FTXJ20LV1BS, FTXJ25LV1BW, FTXJ25LV1BS, FTXJ35LV1BW, FTXJ35LV1BS, FTXJ50LV1BW, FTXJ50LV1BS.

#### in combination with BRP069A42:
FTXZ25NV1B, FTXZ35NV1B, FTXZ50NV1B, FTXS35K2V1B, FTXS35K3V1B, FTXS42K2V1B, FTXS42K3V1B, FTXS50K2V1B, FTXS50K3V1B, FTXLS25K2V1B, FTXLS35K2V1B,FTXM35K3V1B, FTXM42K3V1B, FTXM50K3V1B, , FTXS60GV1B, FTXS71GV1B, ATXS35K2V1B, ATXS35K3V1B, ATXS50K2V1B, ATXS50K3V1B, FTX50GV1B, FTX60GV1B, FTX71GV1B, FVXG25K2V1B, FVXG35K2V1B, FVXG50K2V1B, , FVXS25FV1B, FVXS35FV1B, FVXS50FV1B, FLXS25BAVMB, FLXS25BVMA, FLXS25BVMB, FLXS35BAVMB, FLXS35BAVMB9, FLXS35BVMA, FLXS35BVMB, FLXS50BAVMB, FLXS50BVMA, FLXS50BVMB, FLXS60BAVMB, FLXS60BVMA, FLXS60BVMB.

#### in combination with BRP069A43 (?):
CTXS15K2V1B, CTXS15K3V1B, FTXS20K2V1B, FTXS20K3V1B, FTXS25K2V1B, FTXS25K3V1B, CTXS35K2V1B, CTXS35K3V1B, FTXM20K3V1B, FTXM25K3V1B, , ATXS20K2V1B, ATXS20K3V1B, ATXS25K2V1B, ATXS25K3V1B, FTX20J2V1B, FTX25J2V1B, FTX35J2V1B, FTX20J3V1B, FTX25J3V1B, FTX35J3V1B, , FTXL25J2V1B, FTXL35J2V1B, , FTX20KV1B, FTX25KV1B, FTX35KV1B, FTX20GV1B, FTX25GV1B, FTX35GV1B, ATX20J2V1B, ATX20J3V1B, ATX25J2V1B, ATX25J3V1B, ATX35J2V1B, ATX35J3V1B, ATX20KV1B, ATX25KV1B, ATX35KV1B, , ATXL25J2V1B, ATXL35J2V1B,

#### in combination with BRP069A44 (?):
FTX50KV1B, FTX60KV1B

#### in combination with BRP069Bxx  (?):
No model information available.

## Credits
This Homey App is based on the great work of the unofficial Daikin API documentation project (https://github.com/ael-code/daikin-control) as well as the Apollon77 Daikin Controller library (https://github.com/Apollon77/daikin-controller).

---
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
