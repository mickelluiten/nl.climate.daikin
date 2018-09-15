# Daikin AI
Control your Daikin air conditioner (or heatpump) through Homey. This app requires that your Daikin air conditioner (or heatpump) is equipped with a WiFi adapter (either model BRP069A-- or BRP069B--).

![Daikin logo](https://github.com/PeterEIER/nl.climate.daikin/raw/master/assets/images/Daikin-logo-wide.png)

## Features
- supports Daikin airconditioners & heatpumps (aka inverters) through model range drivers.
- the mobile card shows, depeding on the selected driver, target temperature, operating mode, inside temperature, fan rate and fan swing mode. Target temperature, fan speed, fan swing mode as well as AC operating mode can be controlled from the mobile card.

![Mobile card2](https://github.com/PeterEIER/nl.climate.daikin/raw/alpha/assets/images/mobilecard3.png)

- with the available 22 flowcards (9 trigger cards, 9 condition cards and 4 action cards) the options to automate are almost endless.
- HomeKit support* for every WiFi capable Daikin Airconditioner thru the "Model HomeKit" driver. The "Model Homekit" driver has 2 trigger flowcards, no condition flowcards and 2 action flowcards. The AC control functionality is however limited to: airco's mode setting, target temperature setting and inside temperature measurement.
  Note *: requires either HomeKit by Sprut, or HomeyKit by Bas Jansen.
- Special modes, i.e. POWERFUL, are supported for some models/model variants.

## Action flow cards
When designing flows and you add multiple Daikin AI action flowcards to a flow, or serveral flows but with the same trigger condition, it might be necessary to spread these actions over several seconds to give the airco time to process all the commands as the interface handles all the commands separately. The nature (asynchronous polling) of the Daikin interface still makes it possible that commands colide and as a result commands are not executed correctly which is something to keep in mind when building flows.

## Demo mode (upon pairing the demo mode is by default turned ON !!)
Demo mode can be disabled in the device its settings menu. Demo mode can be very usefull when you are designing new flows as demo mode prevents the airco to be switched on so you can safely experiment and test your new flows.

## Refresh interval
Daikin designed an interface that is based on polling which means the airconditioner must be interogated once in a while to know its current status. The polling interval of the official Daikin Online Controller app is between 30 and 60 seconds. With the refresh interval setting of the Daikin AI app it is possible to set its polling interval between 5 and 30 seconds which is up to 6 times faster. A higher refresh interval means that your Homey has more work to do. When your setup involves more than one airconditioner a polling interval of less than 10 seconds is not recommended. As a result of the polling mechanism a change made with the app, either the official Daikin Online Controller app or the Homey Daikin AI app, may not show immediately in either app. It should be noted that the refresh interval (setting) has no influence for sending commands to the airconditioner, a mode, target temperature etc. change is always executed immediately.

## IP-address: the use of a static IP-address is recommended
To prevent unreliable behavior of the application the use of a fixed (static) IP-address is required. When DHCP changes your airconditioners IP-address the application will not be aware of this change and as a result the application can no longer controle the airconditioner till you manually update the IP-address in the devices its settings menu. 

Note: your airconditioner its current IP-address can be found in the Daikin Online Controller app (select your airco > click on the gear sysmbol > the IP-address shows under "Adapter information").  

## WiFi adapter models
Daikin just recently introduced a new model WiFi adapter (BRP069B--) which uses a different way to sent commands to the airconditioner. During paring the app will pair your airconditioner with model specific default settings, in some cases you have to change these default settings which can be done in the device settings menu.

Note: the WiFi adapter its firmware version can be found in the Daikin Online Controller app (select your airco > click on the gear sysmbol > the firmware version shows under "Adapter information").  

## Special Modes
Special modes are not supported by all models, model variants and/or the WiFi adapter its firmware version, in addition it might be that not all 3 special modes are supported. Check the Daikin Online Controller which special modes are supported by your airco, during paring you may enable supported Special Modes by checking the applicable checkboxes or leave them all unchecked.

## Change log
#### v1.1.1
- Special modes can now be enabled on a per special mode basis instead of all ON or all OFF.

#### v1.1.0
- Added support for special modes (POWERFUL, ECONO and STREAMER). Note: Model Homekit cannot support these special modes due to limitations of the HomeKit/HomeyKit apps.
- Devices settings menu changes.
- Changes to App store description. 

#### v1.0.10
- Fan rate and Fan Swing mode can now be controlled from the mobile card.

#### v1.0.9
- Optimizations.

#### v1.0.8
- Error handling improvement.
- Flow action card bug fix.

### v1.0.7
- Fixed a bug which prevented flow action cards to function correctly for airco's equipped with the type B adapter.

### v1.0.6
- Fixed a problem that prevented the mode knob to update when the mode was set using either the IR remote control or Daikin Controller app. 

### v1.0.5
- Removed Model Inverter.
- Multi model driver (Sensira, Stylish, Comfora, Ururu Sarara, Perfera) replaces the Comfora driver.
- Fixed an compatibility issue with the type B WiFi adapter (BRP069B--) as a result of which the airco could not be controlled.

### v0.6.2
- Added support for model series Comfora.
- Bug fixes (as provided by the Apollon77 Daikin Controller Library).

### v0.5.0
- first public beta

## Limitations
- HomeKit support only applies for the 'Model HomeKit'.
- DHCP is not supported.
- Not all Daikin airconditioner models / model seriers / combinations of indoor and outdoor units are supported. Due to the fact that Daikin does not disclose their interface specification reverse engineering of the interface is extremely difficult.
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
