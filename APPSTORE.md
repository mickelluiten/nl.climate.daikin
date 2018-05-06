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

## Change log
### v1.0.0
- Stable release.
- Removed Model Inverter.

### v0.6.2
- Added support for model series Comfora.
- Bug fixes (as provided by the Apollon77 Daikin Controller Library).

### v0.5.0
- first public beta

## Limitations
- HomeKit support only applies for the 'Model HomeKit'.
- DHCP is not supported.
- Daikin AI might be incompatibel with the latest model "B" (BRP069Bxx) WiFi controller.

---
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
