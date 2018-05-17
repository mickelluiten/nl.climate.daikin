# Daikin AI
Adds to Homey control support for Daikin Air Conditioners and Heatpumps (aka inverters).

![Daikin logo](https://github.com/PeterEIER/nl.climate.daikin/raw/master/assets/images/Daikin-logo-wide.png)

## Features
- supports Daikin airconditioners & heatpumps through either a generic driver (called Inverter) or a model (range) specific one like Emura.
- the mobile card shows target temperature, operating mode, fan rate and fan swing mode.
- target temperature as well as operating mode can be controlled from the mobile card.

![Mobile card](https://github.com/PeterEIER/nl.climate.daikin/raw/master/assets/images/mobilecard.png)

- with the available 22 flowcards (9 trigger cards, 9 condition cards and 4 action cards) the options to automate are almost endless.
- HomeKit support* for every WiFi capable Daikin Airconditioner thru the "Model HomeKit" driver. The "Model Homekit" driver has 2 trigger flowcards, no condition flowcards and 2 action flowcards. The AC control functionality is however limited to: airco's mode setting, target temperature setting and inside temperature measurement.
  Note *: requires either HomeKit by Sprut, or HomeyKit by Bas Jansen. 


### Demo mode (upon pairing the demo mode is by default turned ON !!)
Demo mode can be disabled in the device its settings menu. Demo mode can be very usefull when you are designing new flows as demo mode prevents the airco to be switched on so you can safely experiment and test your new flows.

### IP-address conciderations
To prevent unreliable behavior of this application the use of a fixed (static) IP-address is required.

Note: your airconditioner its IP-address can be found in the Daikin Controller app (select your airco > click on the gear sysmbol > the information shows under "Adapter information").  

### WiFi adapter models
Daikin just recently introduced a new model WiFi adapter (BRP069B--) which uses a different way to sent commands to the airconditioner. During paring the app will pair your airconditioner with model specific default settings for the WiFi adapter its firmware. In some case you have to change these default settings, this can be done in the device settings menu.

Note: the WiFi adapter its firmware version can be found in the Daikin Controller app (select your airco > click on the gear sysmbol > the information shows under "Adapter information").  

## Change log
### v1.0.2
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

#### Compatible units in combination with BRP069A41:
FTXG20LV1BW, FTXG20LV1BS , FTXG25LV1BW, FTXG25LV1BS, FTXG35LV1BW, FTXG35LV1BS, FTXG50LV1BW, FTXG50LV1BS, FTXJ20LV1BW, FTXJ20LV1BS, FTXJ25LV1BW, FTXJ25LV1BS, FTXJ35LV1BW, FTXJ35LV1BS, FTXJ50LV1BW, FTXJ50LV1BS.

#### Compatible units in combination with BRP069A42:
FTXZ25NV1B, FTXZ35NV1B, FTXZ50NV1B, FTXS35K2V1B, FTXS35K3V1B, FTXS42K2V1B, FTXS42K3V1B, FTXS50K2V1B, FTXS50K3V1B, FTXLS25K2V1B, FTXLS35K2V1B,FTXM35K3V1B, FTXM42K3V1B, FTXM50K3V1B, , FTXS60GV1B, FTXS71GV1B, ATXS35K2V1B, ATXS35K3V1B, ATXS50K2V1B, ATXS50K3V1B, FTX50GV1B, FTX60GV1B, FTX71GV1B, FVXG25K2V1B, FVXG35K2V1B, FVXG50K2V1B, , FVXS25FV1B, FVXS35FV1B, FVXS50FV1B, FLXS25BAVMB, FLXS25BVMA, FLXS25BVMB, FLXS35BAVMB, FLXS35BAVMB9, FLXS35BVMA, FLXS35BVMB, FLXS50BAVMB, FLXS50BVMA, FLXS50BVMB, FLXS60BAVMB, FLXS60BVMA, FLXS60BVMB.

#### Compatible units in combination with BRP069A43 (?):
CTXS15K2V1B, CTXS15K3V1B, FTXS20K2V1B, FTXS20K3V1B, FTXS25K2V1B, FTXS25K3V1B, CTXS35K2V1B, CTXS35K3V1B, FTXM20K3V1B, FTXM25K3V1B, , ATXS20K2V1B, ATXS20K3V1B, ATXS25K2V1B, ATXS25K3V1B, FTX20J2V1B, FTX25J2V1B, FTX35J2V1B, FTX20J3V1B, FTX25J3V1B, FTX35J3V1B, , FTXL25J2V1B, FTXL35J2V1B, , FTX20KV1B, FTX25KV1B, FTX35KV1B, FTX20GV1B, FTX25GV1B, FTX35GV1B, ATX20J2V1B, ATX20J3V1B, ATX25J2V1B, ATX25J3V1B, ATX35J2V1B, ATX35J3V1B, ATX20KV1B, ATX25KV1B, ATX35KV1B, , ATXL25J2V1B, ATXL35J2V1B,

#### Compatible units in combination with BRP069A44 (?):
FTX50KV1B, FTX60KV1B

#### Compatible units in combination with BRP069Bxx  (?):
No information available.

##Credits
This Homey App is based on the great work of the unofficial Daikin API documentation project (https://github.com/ael-code/daikin-control) as well as the Apollon77 Daikin Controller library (https://github.com/Apollon77/daikin-controller).

---
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
