![Daikin logo](https://github.com/PeterEIER/nl.climate.daikin/raw/master/assets/images/Daikin-logo-wide.png)

# Daikin AI for Homey
Control your Daikin air conditioner through Homey. This app requires that your Daikin air conditioner is equipped with a WiFi adapter (either model BRP069A-- or BRP069B–). This app does NOT support “Sky Air” ducted/ceiling models, models that are/can only be controlled by Daikin’s Residential Controller app (which was introduced in January of 2021) and/or models equipped with a C type (i.e. BRP069C4x) WiFi adapter.

## Features
- supports most Daikin airconditioners that belonging to Daikin's "Air-to-air heat pumps" productgroup through a single driver. Note for existing users; the "range model" drivers are as of now depreciated.
- the user interface, depending on the selected driver, can show target temperature, operating mode, inside temperature, outside temperature, fan speed and fan swing mode.
- HomeKit support (see note) for every WiFi capable Daikin Airconditioner thru the "Model HomeKit" driver. The AC control functionality is however limited to: airco's mode setting, target temperature setting and inside temperature measurement.
  Note: requires either Homey's experimental Apple Homekit feature enabled or one of the following apps: "HomeKit by Sprut", "HomeyKit by Bas Jansen".
- special modes, i.e. POWERFUL, are supported for some models/model variants.

## Action flow cards
When designing flows and you add multiple Daikin AI action flowcards to a flow, or several flows but with the same trigger condition, it might be necessary to spread these actions over several seconds to give the airco time to process all the commands as the interface handles all the commands separately. The nature (asynchronous polling) of the Daikin interface still makes it possible that commands collide and as a result commands are not executed correctly which is something to keep in mind when building flows.

## Refresh interval
Daikin designed an interface that is based on polling which means the airconditioner must be interrogated once in a while to know its current status. The polling interval of the official Daikin Online Controller app is between 30 and 60 seconds. With the refresh interval setting of the Daikin AI app it is possible to set its polling interval between 5 and 30 seconds which is up to 6 times faster. A higher refresh interval means that your Homey has more work to do. When your setup involves more than one airconditioner a polling interval of less than 10 seconds is not recommended. As a result of the polling mechanism a change made with the app, either the official Daikin Online Controller app or the Homey Daikin AI app, may not show immediately in either app. It should be noted that the refresh interval (setting) has no influence for sending commands to the airconditioner, a mode, target temperature etc. change is always executed immediately.

## Demo mode (upon pairing the demo mode is by default turned OFF !!)
Demo mode can be enabled in the device its settings menu. Demo mode can be very usefull when you are designing new flows as demo mode prevents the airco to be switched on so you can safely experiment and test your new flows.

## Special Modes
Special modes are not supported by all models, model variants and/or the WiFi adapter its firmware version, in addition it might be that not all 3 special modes are supported. Check the Daikin Online Controller app which special modes are supported by your airco, during paring enable the supported Special Mode(s) by checking the applicable checkbox(es) or leave them all unchecked (disabled).

## WiFi adapter models
In the settings menu for your airconditioner device you can switch between the old (WiFi adapter model A) and the new (WiFi adapter model B) communication protocol.   

## IP-address: the use of a static IP-address is recommended
To prevent unreliable behaviour of the application the use of a fixed (static) IP-address is required. When DHCP changes your airconditioners IP-address the application will not be aware of this change and as a result the application can no longer controle the airconditioner till you manually update the IP-address in the devices its settings menu. 

Note: your airconditioner its current IP-address can be found in the Daikin Online Controller app (select your airco > click on the gear symbol > the IP-address shows under "Adapter information").

## Installation and/or updating the software
It is advised to turn your airconditioner OFF before and keep it switched OFF during Daikin AI software installation/upgrade/restart or when rebooting your Homey as the software will initialise itself immediately after software installation/upgrade/app restart/Homey reboot and because of that some of the airconditioner settings might change i.e. the target temperature might be set to a lower or higher temperature.

##Limitations
- "Sky Air" ducted/ceiling models are NOT supported by this app.
- The app is not compatible with Homey v1 firmware.
- The "Airflow Rate" and "Swing" (a picker) control requires Homey mobile app version 2.0.6 or higher to be shown.
- HomeKit support only applies for the 'Model HomeKit'.
- DHCP is not supported.
- Not all Daikin airconditioner models / model series / combinations of indoor and outdoor units are supported. Due to the fact that Daikin does not disclose their interface specification reverse engineering of the interface is extremely difficult.
- Homey speech is not supported (note: Homekit driver users have speech support through Siri and can set airconditioner mode and the target temperature).
- Special modes can not be used in flows.

##Compatible Daikin Air Conditioning Units
### in combination with BRP069A41:
FTXG20LV1BW, FTXG20LV1BS , FTXG25LV1BW, FTXG25LV1BS, FTXG35LV1BW, FTXG35LV1BS, FTXG50LV1BW, FTXG50LV1BS, FTXJ20LV1BW, FTXJ20LV1BS, FTXJ25LV1BW, FTXJ25LV1BS, FTXJ35LV1BW, FTXJ35LV1BS, FTXJ50LV1BW, FTXJ50LV1BS.

### in combination with BRP069A42:
FTXZ25NV1B, FTXZ35NV1B, FTXZ50NV1B, FTXS35K2V1B, FTXS35K3V1B, FTXS42K2V1B, FTXS42K3V1B, FTXS50K2V1B, FTXS50K3V1B, FTXLS25K2V1B, FTXLS35K2V1B,FTXM35K3V1B, FTXM42K3V1B, FTXM50K3V1B, , FTXS60GV1B, FTXS71GV1B, ATXS35K2V1B, ATXS35K3V1B, ATXS50K2V1B, ATXS50K3V1B, FTX50GV1B, FTX60GV1B, FTX71GV1B, FVXG25K2V1B, FVXG35K2V1B, FVXG50K2V1B, , FVXS25FV1B, FVXS35FV1B, FVXS50FV1B, FLXS25BAVMB, FLXS25BVMA, FLXS25BVMB, FLXS35BAVMB, FLXS35BAVMB9, FLXS35BVMA, FLXS35BVMB, FLXS50BAVMB, FLXS50BVMA, FLXS50BVMB, FLXS60BAVMB, FLXS60BVMA, FLXS60BVMB.

### in combination with BRP069A43 (?):
CTXS15K2V1B, CTXS15K3V1B, FTXS20K2V1B, FTXS20K3V1B, FTXS25K2V1B, FTXS25K3V1B, CTXS35K2V1B, CTXS35K3V1B, FTXM20K3V1B, FTXM25K3V1B, , ATXS20K2V1B, ATXS20K3V1B, ATXS25K2V1B, ATXS25K3V1B, FTX20J2V1B, FTX25J2V1B, FTX35J2V1B, FTX20J3V1B, FTX25J3V1B, FTX35J3V1B, , FTXL25J2V1B, FTXL35J2V1B, , FTX20KV1B, FTX25KV1B, FTX35KV1B, FTX20GV1B, FTX25GV1B, FTX35GV1B, ATX20J2V1B, ATX20J3V1B, ATX25J2V1B, ATX25J3V1B, ATX35J2V1B, ATX35J3V1B, ATX20KV1B, ATX25KV1B, ATX35KV1B, , ATXL25J2V1B, ATXL35J2V1B,

### in combination with BRP069A44 (?):
FTX50KV1B, FTX60KV1B

## in combination with BRP069Bxx  (?):
No model information available.

## Credits
- This Homey (by Athom) App is based on the great work of the unofficial Daikin API documentation project ( https://github.com/ael-code/daikin-control ) as well as the Apollon77 Daikin Controller library ( https://github.com/Apollon77/daikin-controller ).
- App uses icons that where created by http://www.freepik.com from https://www.flaticon.com is licensed by Creative Commons.


#Dutch  version
OPGELET: maakt u gebruik van Speciale Modi dan dient u na de installatie van versie 4 eenmalig met behulp van het onderhoudsmenu en de opnieuw paren functie Speciale Modi te herstellen. Vervolgens kan de melding "Rond de upgrade naar versie 4 af." worden gewist door de Daikin AI app te herstarten. 

Voor een juiste werking van deze Homey App is het noodzakelijk dat uw Daikin airconditioner is uitgerust met een WiFi adapter (zijnde model BRP069A-- of BRP069B--). Deze applicatie is NIET geschikt om kanaal of plafond "Sky Air" modellen te bedienen.

<<Mogelijkheden>>
- maakt de bediening van de meeste airconditioners behorende tot Daikin's lucht/lucht warmtepompen productgroep mogelijk middels 1 enkel stuurprogramma.

- zaken als doel temperatuur, werkmodus, binnen temperatuur, buiten temperatuur, ventilator snelheid en lamel richting kunnen worden bediend en/of getoond in deze Homey App.

- voegt HomeKit ondersteuning toe aan vrijwel iedere Daikin airconditioner voorzien van een WiFi adapter wanneer het "Air-to-air Heatpump (HomeKit)" stuurprogramma wordt gebruikt. N.b. De functionaliteit van het "Air-to-air Heatpump (HomeKit)" stuurprogramma is echter beperkt tot het bedienen van de airconditioner werkmodus, het instellen van de doeltemperatuur en het tonen van de buiten temperatuur.

Opmerking: vereist dat Homey's experimentele Apple HomeKit ondersteuning is ingeschakeld, dan wel 1 van de volgende toepassingen "HomeKit by Sprut" of "HomeyKit by Bas Jansen" wordt gebruikt.

- beperkte ondersteuning voor speciale modi, zoals "Krachtig", en beschikbaar zijn op een beperkt aantal modellen/model reeksen.

Opmerking: het beschikbaar hebben van speciale modi op de IR afstandsbediening betekent niet automatisch dat deze modi ook via WiFi kunnen worden bediend.

<<Actie flow kaarten en gegevens verversen>>
Bij het ontwikkelen van flows die meerdere Daikin AI actie flow kaartjes bevatten, dan wel verschillende flows met dezelfde trigger conditie die dan al of niet weer een Daikin AI actie uitvoeren, kan het nodig zijn dat deze triggers/acties verspreid worden over meerdere seconden dit als gevolg van het feit dat de airconditioner slechts 1 commando te gelijk kan uitvoeren. Gelet op het feit dat het interface protocol van Daikin is gebaseerd op "asynchrone polling", zie ook hieronder "Verversinterval", kan het desondanks nog steeds voorkomen dat commando's "botsen" en als gevolg daarvan niet worden uitgevoerd. Wanneer er meerdere airco units zijn aangesloten is het meer en meer belangrijk om hier rekening mee te houden. Verder is het goed om te begrijpen dat wanneer Homey reboot en vervolgens alle airco drivers herstarten ook dit polling mechanisme voor alle aangesloten airco units zo'n beetje gelijktijdig zal starten.

<<Verversinterval>>
Daikin heeft een interface ontwikkelt die gebaseerd is op "polling" hetgeen betekent dat de Daikin AI app de huidige status van het apparaat zelf moet opvragen bij de airconditioner. De verversinterval van de officiële Daikin Online Controller app ligt ergens tussen de 30 en 60 seconden. In de Daikin AI app kan de verversinterval door de gebruiker worden ingesteld tussen minimaal 5 en maximaal 30 seconden, hetgeen tot 6 keer sneller is dan de officiele Daikin app. Een hogere verversinterval heeft naast voordelen ook nadelen zoals een hogere CPU belasting dat weer nadelig kan uitpakken voor andere applicaties die draaien op uw Homey. Als gevolg van het polling mechanisme zullen wijzigingen die gemaakt worden met een app, hetzij de officiële Daikin Online Controller app dan wel de Homey Daikin AI app, vaak niet direct maar vertraagd worden getoond in de app. Hierbij dient te worden opgemerkt dat de instelling van het verversinterval geen enkele invloed heeft op snelheid waarmee de app commando's zoals een modi wijziging, doel temperatuur wijziging etc. doorvoert, deze worden namelijk altijd direct verstuurd naar en uitgevoerd door de airconditioner.


<<Daikin AI demonstratie mode>>
Demonstratie mode kan worden ingeschakeld in het apparaat instellingen menu. Demonstratie mode kan handig zijn bij het ontwerpen van nieuwe flows aangezien demonstratie mode voorkomt dat de airconditioner daadwerkelijk wordt aangeschakeld. Het herhaalt aan en vervolgens weer uitschakelen of het schakelen tussen verwarmen en koelen is iets dat de levensduur van de compressor niet ten goede komt.

Opmerking: na het initieel toevoegen van de airconditioner is demonstratie mode UITgeschakeld.

<<Speciale Modi>>
Speciale modi worden slechts door een beperkt aantal modellen, model reeksen en/of WiFi adapter firmware versies ondersteund, raadpleeg hiervoor de gebruiksaanwijzing van uw airconditioner. Speciale Modi dienen (bijvoorkeur) tijdens het aanmelden van het apparaat te worden aan of uitgezet.

<<WiFi adapter typen>>
In het settings menu van het airconditioner apparaat kunt u kiezen tussen het oude (WiFi adapter model A) en nieuwe (WiFi adapter model B) communicatie protocol. 

<<IP-adres>>
Het gebruik van een statisch IP-adres wordt aangeraden. Wanneer er toch gebruik gemaakt wordt van DHCP kan het IP-adres van de airconditioner wijzigen waardoor Homey niet meer in staat is om de airconditioner te bedienen, in dat geval dient u het IP-adres in het Daikin AI instellingen menu handmatig aan te passen naar het door DHCP nieuw toegekende IP-adres.

Opmerking: het actueel door de airconditioner gebruikte IP-adres kan worden teruggevonden in de Daikin Online Controller app, selecteer uw airco > klik op het tandwiel symbool > de firmware versie wordt getoond onder "Adapter information".

<<Installatie en/of bijwerken van software>>
U wordt geadviseerd om uw airconditioner uit te schakelen wanneer u de Daikin AI software bijwerkt, of Homey van nieuwe firmware voorziet dan wel Homey herstart aangezien het mogelijk is dat de doel temperatuur naar beneden dan wel boven wordt aangepast. Wanneer u vervolgens de airconditioner weer inschakelt dient gecontroleerd te worden of doel temperatuur etc. nog juist zijn.

<<Beperkingen>>
- "Sky Air" kanaal en plafond modellen worden NIET ondersteund door de app.
- Niet alle Daikin airconditioner modellen / model reeksen / combinaties van binnen en buiten units worden ondersteund. Daikin als fabrikant stelt geen interface specificaties beschikbaar hetgeen het extra lastig maakt om software te ontwikkelen voor Daikin airconditioners.
- Daikin AI app is niet geschikt voor gebruik in combinatie met Homey v1 firmware.
- Voor bediening vanuit de Apple Home app (HomeKit) dient het 'Air-to-air Heatpump (HomeKit)' te worden gebruikt.
- DHCP is niet ondersteund.
- Het gebruik van WiFi Mesh netwerken kan problemen geven.
- Het gebruik van een ander subnet voor de airco dan waar Homey in zit wordt niet ondersteund (ofwel de airco en Homey (app) moeten zich in hetzelfde subnet bevinden).
- Homey spraak wordt niet ondersteund (opmerking: er bestaat een beperkte spraakondersteuning middels Siri wanneer het 'Air-to-air Heatpump (HomeKit)' stuurprogramma wordt gebruikt).
- Geen trigger flow cards beschikbaar voor speciale modi.
- Speciale modi flow cards ook van niet ingeschakelde speciale modi worden getoond (wordt mogelijk opgelost met Homey Firmware 5 / SDK3).

<<Ondersteunde modellen>
Afgaand op Daikin Support Documentatie zou (op zijn minst) de volgende apparatuur moeten kunnen werken met Daikin AI:

Ondersteund in combinatie met BRP069A41: FTXG20LV1BW, FTXG20LV1BS , FTXG25LV1BW, FTXG25LV1BS, FTXG35LV1BW, FTXG35LV1BS, FTXG50LV1BW, FTXG50LV1BS, FTXJ20LV1BW, FTXJ20LV1BS, FTXJ25LV1BW, FTXJ25LV1BS, FTXJ35LV1BW, FTXJ35LV1BS, FTXJ50LV1BW, FTXJ50LV1BS ,

Ondersteund in combinatie met BRP069A42: FTXZ25NV1B, FTXZ35NV1B, FTXZ50NV1B, FTXS35K2V1B, FTXS35K3V1B, FTXS42K2V1B, FTXS42K3V1B, FTXS50K2V1B, FTXS50K3V1B, FTXLS25K2V1B, FTXLS35K2V1B,FTXM35K3V1B, FTXM42K3V1B, FTXM50K3V1B, , FTXS60GV1B, FTXS71GV1B, ATXS35K2V1B, ATXS35K3V1B, ATXS50K2V1B, ATXS50K3V1B, , FTX50GV1B, FTX60GV1B, FTX71GV1B, , FVXG25K2V1B, FVXG35K2V1B, FVXG50K2V1B, , FVXS25FV1B, FVXS35FV1B, FVXS50FV1B, , FLXS25BAVMB, FLXS25BVMA, FLXS25BVMB, FLXS35BAVMB, FLXS35BAVMB9, FLXS35BVMA, FLXS35BVMB, FLXS50BAVMB, FLXS50BVMA, FLXS50BVMB, FLXS60BAVMB, FLXS60BVMA, FLXS60BVMB,

Ondersteund in combinatie met BRP069A43 (?): CTXS15K2V1B, CTXS15K3V1B, FTXS20K2V1B, FTXS20K3V1B, FTXS25K2V1B, FTXS25K3V1B, CTXS35K2V1B, CTXS35K3V1B, FTXM20K3V1B, FTXM25K3V1B, , ATXS20K2V1B, ATXS20K3V1B, ATXS25K2V1B, ATXS25K3V1B, , FTX20J2V1B, FTX25J2V1B, FTX35J2V1B, FTX20J3V1B, FTX25J3V1B, FTX35J3V1B, , FTXL25J2V1B, FTXL35J2V1B, , FTX20KV1B, FTX25KV1B, FTX35KV1B, FTX20GV1B, FTX25GV1B, FTX35GV1B, , ATX20J2V1B, ATX20J3V1B, ATX25J2V1B, ATX25J3V1B, ATX35J2V1B, ATX35J3V1B, ATX20KV1B, ATX25KV1B, ATX35KV1B, , ATXL25J2V1B, ATXL35J2V1B,

Ondersteund in combinatie met BRP069A44 (?): FTX50KV1B, FTX60KV1B

<<Dankbetuiging>>
De Daikin AI app had niet ontwikkeld kunnen worden zonder het fantastische uitzoekwerk ("reverse engineering") van het "Daikin API documentation project" ( https://github.com/ael-code/daikin-control ) en dat van "Apollon77" zijn Daikin Controller library ( https://github.com/Apollon77/daikin-controller ).
 
---
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## Donations
If you like the app, consider buying me a cup of coffee!  
[![Paypal donate][pp-donate-image]][pp-donate-link]

[pp-donate-link]: https://www.paypal.me/donations4petereier
[pp-donate-image]: https://www.paypalobjects.com/webstatic/en_US/i/btn/png/btn_donate_92x26.png

## Development history
- 31-JAN-18: inside / outside / target temperature (fixed value for now) show on mobile card.
- 02-FEB-18: all data shown on mobile card is read from the airconditioner.
- 03-FEB-18: lifted the requirement to use experimental firmware v1.5.6, can now be previewed with Homey stable firmware v1.5.3.
- 04-FEB-18: translations of mode, fan, wing etc code in to meaningful strings. Work done on changing airco setting.
- 07-FEB-18: Mobile card: temperature control is functional, mode selection functional.
- 11-FEB-18: 1/ Implemented the Apollon77 library. Note: for testing/troubleshooting purposes the airco power is always set to OFF.
- 11-FEB-18: 2/ Working on flow cards... not functional!
- 15-FEB-18: Added a trigger, condition and action flowcard.
- 16-FEB-18: 1/ Action triggers to set the: Airco Operation Mode, Fan rate, Fan direction and Target temperature.
- 16-FEB-18: 2/ Several code optimisations
- 16-FEB-18: 3/ Asset updates, now passes the Homey App Store validation cli
- 18-FEB-18: 1/ New pairing dialog
- 18-FEB-18: 2/ Emura driver enabled (still needs refinement...)  
- 19-FEB-18: 1/ Flowcard fix, now available to both the Emura and Inverter driver
- 19-FEB-18: 2/ Introduced demo mode which can be set via settings in demo mode the power is always OFF.
- 19-FEB-18: 3/ Mode switching: crushed a few bugs
- 20-FEB-18: The airco can now also be switched off with the mode settings wheel
- 21-FEB-18: Added a whole bunch of condition flowcards
- 22-FEB-18: Completed the flowcards for trigger (9x), condition (9x) and action (5x).
- 24-FEB-18: Code optimisations, crushed bugs that I introduced with adding of the flowcards.
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
- 28-AUG-18: Device settings menu cleanup and code optimisations.
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
- 29-MAR-19: Fixed a bug: condition card invert flag did not change the condition card text.
- 18-AUG-19: Bug fix (dry mode related).
- ---------- Start of the development of V3.x.x (compatible with Homey v3 firmware, but no energy functionality support as realtime power consumption is not available from the airco's)
- 13-NOV-19: Updates related to Athoms refresh app store.
- 23-NOV-19: Added support for Daikin Airbase (SkyFi) used in some countries i.e. Australia.
- 25-NOV-19: Removed code changes in relation to Daikin Airbase (SkyFi). Will not support ducted/ceiling models due to lack of documentation regarding these models.
- 28-JAN-20: Restructure app with .homeycompose, and version 2 flow cards depreciated.
- 02-FEB-20: Model range drivers are replaced by the AirAirHP driver which now supports most of the Air Air Heatpumps from Diakin.
- 07-MAR-20: Rename "Model HomeKit" to "Air-to-air heat pumps (HomeKit)".
- 12-APR-20: Changes made to pairing response validation.
- 12-APR-20: Upgraded to the latest Apollon7 Daikin library (v1.1.5).
- 12-APR-20: Removed WiFi adapter setting.
- 12-APP-20: Demo mode is now OFF by default (iso of ON).
- 01-AUG-20: Added new action flow card "change-target-temp-by", fixed a bug that prevented flows from executing.
- 03-AUG-20: Added range check for new action flow card, fixed a bug related to special modes (action card set mode).
- ---------- Start of the development of V4.x.x 
- 10-AUG-20: Version 4.0.0 intial release (old drivers and related code is now completly removed from the app).
- 11-AUG-20: Special modes refactored, these do now show as seperate pickers iso being part of the opertion mode picker.
- 16-AUG-20: Added condition and action flow cards for special modes. Added flow cards for target_humidity.
- 19-AUG-20: Added Maintenance Menu "Repair".
- 22-AUG-20: Improvements to Repair, further improved on error handling.
- 05-SEP-20: Improvements to error handling related sensor / control info.
- 12-SEP-20: Action flow card Dehumidification is now Dry (same as mode).
- ---------- Start of the development of V5.x.x -- SDK 3
- 24-OCT-20: Updates to support SDK v3
- 30-OCT-20: Thermostat UI component when airco is turned off it will follow the target temperature setting (iso the inside temp.)
- 31-OCT-20: Changes to thermostat logic when airco is turned off
- 24-DEC-20: Changes to enumaration of fan-rate and fan-direction in support of the MQTT Hub (Homey) app
- 12-FEB-21: Fixed a bug related to flow cards not show UoM
- 10-MAR-21: Bug fix - (inside) temperature changed flowcard was missing
- 12-MAR-21: Bug fix - flowcard logic Fan Rate and Fan Direction

