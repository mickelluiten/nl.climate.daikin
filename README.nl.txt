Voor een juiste werking van deze Homey App is het noodzakelijk dat uw Daikin airconditioner is uitgerust met een WiFi adapter (zijnde model BRP069A-- of BRP069B--). Deze applicatie is niet geschikt om kanaal of plafond modellen te bedienen.

<<Mogelijkheden>>
- maakt bediening van een breed scala Daikin airconditioners mogelijk middels model reeks stuurprogramma's.

- afhankelijk van het geselecteerde stuurprogramma kunnen zaken als doel temperatuur, werkmodus, binnen temperatuur, buiten temperatuur, ventilator snelheid en lamel richting worden bediend en/of getoond in deze Homey App.

- voegt HomeKit ondersteuning toe aan vrijwel iedere Daikin airconditioner voorzien van een WiFi adapter wanneer het HomeKit stuurprogramma wordt gebruikt. N.b. De functionaliteit van het HomeKit stuurprogramma is echter beperkt tot het bedienen van de airconditioner werkmodus, het instellen van de doeltemperatuur en het tonen van de buiten temperatuur.

Opmerking: vereist dat Homey's experimentele Apple HomeKit ondersteuning is ingeschakeld, danwel 1 van de volgende toepassingen "HomeKit by Sprut" of "HomeyKit by Bas Jansen" wordt gebruikt.

- beperkte ondersteuning voor speciale modi zoals "Krachtig" en beschikbaar zijn op een beperkt aantal modellen/model reeksen.

<<Flow kaarten>>
Bij het ontwikkelen van flows die meerdere Daikin AI actie flow kaartjes bevatten, danwel verschillende flows met dezelfde trigger conditie die dan al of niet weer een Daikin AI actie uitvoeren, kan het nodig zijn dat deze triggers/acties verspreid worden over meerdere seconden dit als gevolg van het feit dat de airconditioner slechts 1 commando te gelijk kan uitvoeren. Gelet op het feit dat het interface protocol van Daikin is gebaseerd op "asynchrone polling", zie ook hieronder "Verversinterval", kan het desondanks nog steeds voorkomen dat commando's "botsen" en als gevolg daarvan niet worden uitgevoerd.  

<<Verversinterval>>
Daikin heeft een interface ontwikkelt die gebaseerd is op "polling" hetgeen betekent dat de Daikin AI app de huidige status van het apparaat zelf moet opvragen bij de airconditioner. De verversinterval van de officiële Daikin Onlin Controller app ligt ergens tussen de 30 en 60 seconden. In de Daikin AI app kan de verversinterval door de gebruiker worden ingesteld tussen minimaal 5 en maximaal 30 seconden, hetgeen tot 6 keer sneller is dan de officiele Daikin app. Een hogere verversinterval heeft naast voordelen ook nadelen zoals een hogere CPU belasting dat weer nadelig kan uitpakken voor andere applicaties die draaien op uw Homey. Als gevolg van het polling mechanisme zullen wijzigingen die gemaakt worden met een app, hetzij de officiële Daikin Online Controller app danwel de Homey Daikin AI app, vaak niet direct maar vertraagd worden getoond in de app. Hierbij dient te worden opgemerkt dat de instelling van het verversinterval geen enkele invloed heeft op snelheid waarmee app commando's zoals een modi wijziging, doel temperatuur wijziging etc. worden uitgevoerd, deze worden namelijk altijd direct verstuurd naar en uitgevoerd door de airconditioner.


<<Daikin AI demonstratie mode>>
Demonstratie mode kan worden uitgeschakeld in het apparaat instellingen menu. Demonstratie mode kan handig zijn bij het ontwerpen van nieuwe flows aangezien demonstratie mode voorkomt dat de airconditioner daadwerkelijk wordt aangeschakeld. Het herhaalt aan en vervolgens weer uitschakelen of het schakelen tussen verwarmen en koelen is iets dat de levensduur van de compressor niet ten goede komt.

Opmerking: na het initieel toevoegen van de airconditioner is demonstratie mode ingeschakeld, u dient deze dan ook zelf uit te te schakelen!!

<<Speciale Modi>>
Speciale modi worden slechts door een beperkt aantal modellen, model reeksen en/of WiFi adapter firmware versies ondersteund, raadpleeg hiervoor de gebruiksaanwijzing van uw airconditioner. Speciale Modi kunnen alleen tijdens het aanmelden van het apparaat worden aan of uitgezet.


<<WiFi adapter typen>>
In de afgelopen jaren heeft Daikin verschillende modellen WiFi adapter's geintroduceerd, zoals de BRP069B-- met ook nieuwe firmware, die op een andere manier communiceren met de airconditioner als voorheen. Tijdens het initieel toevoegen van het apparaat wordt er op basis van het model airconditioner een bepaald type WiFi adapter geselecteerd, in sommige gevallen zal dat helaas de verkeerde zijn en dient u het door de toepassing geselecteerde WiFi adapter type zelf te wijzigen in de juiste. 

Opmerking: het type WiFi adapter en de gebruikte firmware is te achterhalen in de Daikin Online Controller app, selecteer uw airco > klik op het tandwiel symbool > de firmware versie wordt getoond onder "Adapter information".  

<<IP-adres>>
Het gebruik van een statisch IP-adres wordt aangeraden. Wanneer er toch gebruik gemaakt wordt van DHCP kan het IP-adres van de airconditioner wijzigen waardoor Homey niet meer in staat is om de airconditioner te bedienen, in dat geval dient u het IP-adres in het Daikin AI instellingen menu handmatig aan te passen naar het door DHCP nieuw toegekende IP-adres.

Opmerking: het actueel door de airconditioner gebruikte IP-adres kan worden teruggevonden in de Daikin Online Controller app, selecteer uw airco > klik op het tandwiel symbool > de firmware versie wordt getoond onder "Adapter information".

<<Installatie en/of bijwerken van software>>
U wordt geadviseerd om uw airconditioner uit te schakelen wanneer u de Daikin AI software bijwerkt, of Homey van nieuwe firmware voorziet dan wel Homey herstart aangezien het mogelijk is dat de doel temperatuur naar beneden danwel boven wordt aangepast. Wanneer u vervolgens de airconditioner weer inschakelt dient gecontroleerd te worden of doel temperatuur etc. nog juist zijn.

<<Beperkingen>>
- Kanaal en plafond modellen worden NIET ondersteund door de Daikin AI app.
- Daikin AI app is niet geschikt voor gebruik in combinatie met Homey v1 firmware, Homey firmware v2.0.6 of hoger is noodzakelijk voor het gebruik van deze app.
- Voor bediening vanuit de Apple Home app (HomeKit) dient het 'Model HomeKit' stuurprogramma te worden gebruikt.
- DHCP is niet ondersteund.
- Niet alle Daikin airconditioner modellen / model reeksen / combinaties van binnen en buiten units worden ondersteund. Daikin als fabrikant stelt geen interface specificaties beschikbaar hetgeen het extra lastig maakt om software te ontwikkelen voor Daikin airconditioners.
- Homey spraak wordt niet ondersteund (opmerking: er bestaat een beperkte spraakondersteuning middels Siri wanneer het HomeKit stuurprogramma wordt gebruikt. Gebruikers hebben laten weten dat het HomeKit stuurprogramma ook goed samen werkt met Google Home...).
- Speciale modi kunnen niet gebruikt worden in flows.

<<Ondersteunde modellen>
>> in combinatie met BRP069A41:
FTXG20LV1BW, FTXG20LV1BS , FTXG25LV1BW, FTXG25LV1BS, FTXG35LV1BW, FTXG35LV1BS, FTXG50LV1BW, FTXG50LV1BS, FTXJ20LV1BW, FTXJ20LV1BS, FTXJ25LV1BW, FTXJ25LV1BS, FTXJ35LV1BW, FTXJ35LV1BS, FTXJ50LV1BW, FTXJ50LV1BS.

>> in combinatie met BRP069A42:
FTXZ25NV1B, FTXZ35NV1B, FTXZ50NV1B, FTXS35K2V1B, FTXS35K3V1B, FTXS42K2V1B, FTXS42K3V1B, FTXS50K2V1B, FTXS50K3V1B, FTXLS25K2V1B, FTXLS35K2V1B,FTXM35K3V1B, FTXM42K3V1B, FTXM50K3V1B, , FTXS60GV1B, FTXS71GV1B, ATXS35K2V1B, ATXS35K3V1B, ATXS50K2V1B, ATXS50K3V1B, FTX50GV1B, FTX60GV1B, FTX71GV1B, FVXG25K2V1B, FVXG35K2V1B, FVXG50K2V1B, , FVXS25FV1B, FVXS35FV1B, FVXS50FV1B, FLXS25BAVMB, FLXS25BVMA, FLXS25BVMB, FLXS35BAVMB, FLXS35BAVMB9, FLXS35BVMA, FLXS35BVMB, FLXS50BAVMB, FLXS50BVMA, FLXS50BVMB, FLXS60BAVMB, FLXS60BVMA, FLXS60BVMB.

>> in combinatie met BRP069A43 (?):
CTXS15K2V1B, CTXS15K3V1B, FTXS20K2V1B, FTXS20K3V1B, FTXS25K2V1B, FTXS25K3V1B, CTXS35K2V1B, CTXS35K3V1B, FTXM20K3V1B, FTXM25K3V1B, , ATXS20K2V1B, ATXS20K3V1B, ATXS25K2V1B, ATXS25K3V1B, FTX20J2V1B, FTX25J2V1B, FTX35J2V1B, FTX20J3V1B, FTX25J3V1B, FTX35J3V1B, , FTXL25J2V1B, FTXL35J2V1B, , FTX20KV1B, FTX25KV1B, FTX35KV1B, FTX20GV1B, FTX25GV1B, FTX35GV1B, ATX20J2V1B, ATX20J3V1B, ATX25J2V1B, ATX25J3V1B, ATX35J2V1B, ATX35J3V1B, ATX20KV1B, ATX25KV1B, ATX35KV1B, , ATXL25J2V1B, ATXL35J2V1B,

>> in combinatie met BRP069A44 (?):
FTX50KV1B, FTX60KV1B

>> in combinatie met BRP069Bxx  (?):
Geen informatie beschikbaar.

<<Dankbetuiging>>
De Daikin AI app had niet ontwikkeld kunnen worden zonder het fantastische uitzoekwerk ("reverse engineering") van het "Daikin API documentation project" ( https://github.com/ael-code/daikin-control ) en dat van "Apollon77" zijn Daikin Controller library ( https://github.com/Apollon77/daikin-controller ).
 
---
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
