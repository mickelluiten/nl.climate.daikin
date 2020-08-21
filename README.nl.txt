OPGELET: maakt u gebruik van Speciale Modi dan dient u na de installatie van versie 4 eenmalig met behulp van het onderhoudsmenu en de opnieuw paren functie Speciale Modi te herstellen.

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
