export type FactCategory =
  | 'kracht'
  | 'beweging'
  | 'slaap'
  | 'alcohol'
  | 'water'
  | 'groentenFruit'
  | 'menopauze'
  | 'spiermassa'
  | 'gewicht'
  | 'buikomtrek'
  | 'herstel'
  | 'motivatie'
  | 'lymfoedeem'
  | 'gewoontevorming';

export type Fact = {
  id: string;
  category: FactCategory;
  text: string;
};

/**
 * Korte, evidence-informed weetjes. Gewone taal, niet belerend, geen absolute
 * medische claims. Getoond als kaart "Even weten", maximaal één per dag.
 */
export const FACTS: Fact[] = [
  { id: 'f1', category: 'kracht', text: 'Spierkracht verbetert niet alleen door zwaarder te trainen. Een oefening gecontroleerder uitvoeren kan ook vooruitgang zijn.' },
  { id: 'f2', category: 'kracht', text: 'Twee keer per week krachttraining is voor veel mensen al genoeg om sterker te worden.' },
  { id: 'f3', category: 'kracht', text: 'Sterker worden gaat vaak in kleine stappen. Eén herhaling meer telt ook mee.' },
  { id: 'f4', category: 'kracht', text: 'Rust tussen sets hoort erbij. Uw spieren herstellen even, zodat de volgende set beter lukt.' },
  { id: 'f5', category: 'beweging', text: 'Tien minuten bewegen is geen mislukte training. Het is tien minuten meer dan niets.' },
  { id: 'f6', category: 'beweging', text: 'Bewegen verdeeld over de dag telt ook. Een paar korte wandelingen mogen samen meetellen.' },
  { id: 'f7', category: 'beweging', text: 'Vaker rechtstaan en even stappen wordt door veel mensen als prettig ervaren voor de energie.' },
  { id: 'f8', category: 'beweging', text: 'De beste beweging is doorgaans de beweging die u volhoudt.' },
  { id: 'f9', category: 'slaap', text: 'Een regelmatig slaapritme helpt voor veel mensen meer dan één keer lang uitslapen.' },
  { id: 'f10', category: 'slaap', text: 'Schermlicht vlak voor het slapengaan kan het inslapen bemoeilijken.' },
  { id: 'f11', category: 'slaap', text: 'Wie slecht slaapt, beweegt de volgende dag vaak minder. Een rustige dag mag dan ook.' },
  { id: 'f12', category: 'alcohol', text: 'Alcohol kan de slaapkwaliteit verminderen, ook wanneer u sneller inslaapt.' },
  { id: 'f13', category: 'alcohol', text: 'Een paar alcoholvrije dagen per week worden door veel mensen als opknappend ervaren.' },
  { id: 'f14', category: 'alcohol', text: 'Alcohol bevat vrij veel calorieën, maar weinig voedingsstoffen.' },
  { id: 'f15', category: 'water', text: 'Dorst is geen perfecte graadmeter. Toch is regelmatig drinken voor de meeste mensen voldoende.' },
  { id: 'f16', category: 'water', text: 'Niet iedereen heeft exact acht glazen water nodig. Kleur van de urine geeft vaak een ruwe indicatie.' },
  { id: 'f17', category: 'water', text: 'Ook thee, soep en waterrijke groenten dragen bij aan uw vochtinname.' },
  { id: 'f18', category: 'groentenFruit', text: 'Groenten van verschillende kleuren eten geeft doorgaans een bredere mix aan voedingsstoffen.' },
  { id: 'f19', category: 'groentenFruit', text: 'Diepvriesgroenten zijn een prima keuze; ze zijn vaak vers ingevroren.' },
  { id: 'f20', category: 'groentenFruit', text: 'Een stuk fruit als tussendoortje is voor veel mensen een makkelijke gewoonte om vol te houden.' },
  { id: 'f21', category: 'menopauze', text: 'Rond de menopauze verandert voor veel vrouwen de vetverdeling. Dat is een normaal proces.' },
  { id: 'f22', category: 'menopauze', text: 'Krachttraining kan rond de menopauze helpen om spiermassa te behouden.' },
  { id: 'f23', category: 'menopauze', text: 'Slaap kan tijdens de overgang wisselvalliger zijn. Een vast ritme helpt sommige mensen.' },
  { id: 'f24', category: 'spiermassa', text: 'Vanaf middelbare leeftijd neemt spiermassa geleidelijk af. Regelmatig belasten helpt dit tegen te gaan.' },
  { id: 'f25', category: 'spiermassa', text: 'Voldoende eiwit verdeeld over de dag ondersteunt voor veel mensen het behoud van spieren.' },
  { id: 'f26', category: 'spiermassa', text: 'Spieren reageren op vraag. Regelmatig gebruiken houdt ze doorgaans sterker.' },
  { id: 'f27', category: 'gewicht', text: 'Uw gewicht kan schommelen door vocht, zout, stoelgang en hormonen. Kijk vooral naar de trend.' },
  { id: 'f28', category: 'gewicht', text: 'Eén weegmoment per week geeft meestal een rustiger en duidelijker beeld dan dagelijks wegen.' },
  { id: 'f29', category: 'gewicht', text: 'De weegschaal vertelt niet alles. Kracht, energie en omtrek zeggen samen veel meer.' },
  { id: 'f30', category: 'buikomtrek', text: 'Buikomtrek kan veranderen terwijl het gewicht weinig beweegt.' },
  { id: 'f31', category: 'buikomtrek', text: 'Meet uw buikomtrek bij voorkeur telkens op dezelfde plaats en op hetzelfde moment van de dag.' },
  { id: 'f32', category: 'buikomtrek', text: 'Buikomtrek is voor veel mensen een handiger maat voor verandering dan gewicht alleen.' },
  { id: 'f33', category: 'herstel', text: 'Rust is een onderdeel van training, niet het tegenovergestelde ervan.' },
  { id: 'f34', category: 'herstel', text: 'Spieren worden niet sterker tijdens de training zelf, maar in de rust erna.' },
  { id: 'f35', category: 'herstel', text: 'Een rustige dag inlassen is geen achteruitgang, maar vaak juist slim.' },
  { id: 'f36', category: 'motivatie', text: 'Motivatie komt vaak pas ná het starten. De eerste minuut is meestal het lastigst.' },
  { id: 'f37', category: 'motivatie', text: 'Een gemiste dag is geen mislukte week. Gewoon opnieuw beginnen werkt beter dan streng zijn.' },
  { id: 'f38', category: 'motivatie', text: 'Kleine doelen die u haalt, motiveren doorgaans meer dan grote doelen die u ontmoedigen.' },
  { id: 'f39', category: 'gewoontevorming', text: 'Een nieuwe gewoonte koppelen aan een bestaande gewoonte maakt volhouden vaak makkelijker.' },
  { id: 'f40', category: 'gewoontevorming', text: 'Gewoontes vormen kost tijd. Enkele weken volhouden is normaal voordat iets vanzelf gaat.' },
  { id: 'f41', category: 'gewoontevorming', text: 'De omgeving helpt: gezonde keuzes zichtbaar en makkelijk maken werkt voor veel mensen.' },
  { id: 'f42', category: 'lymfoedeem', text: 'Rustige beweging en kuitpompbewegingen worden bij een zwaar gevoel vaak als aangenaam ervaren.' },
  { id: 'f43', category: 'lymfoedeem', text: 'Bij lymfoedeem is geleidelijk opbouwen doorgaans verstandiger dan plots zwaar belasten.' },
  { id: 'f44', category: 'lymfoedeem', text: 'Bij nieuwe of snel toenemende zwelling is een medische beoordeling aangewezen.' },
  { id: 'f45', category: 'kracht', text: 'Zwaarte mag u zelf inschatten. Een gevoel van "ik kon nog net twee herhalingen" is een handige maat.' },
  { id: 'f46', category: 'beweging', text: 'Wandelen na een maaltijd wordt door sommige mensen als prettig voor de spijsvertering ervaren.' },
  { id: 'f47', category: 'slaap', text: 'Cafeïne laat in de dag kan bij sommige mensen het inslapen bemoeilijken.' },
  { id: 'f48', category: 'water', text: 'Een vaste drinkfles binnen handbereik helpt veel mensen om vaker te drinken.' },
  { id: 'f49', category: 'groentenFruit', text: 'Groenten toevoegen is vaak makkelijker dan iets weglaten. Begin met wat u al lekker vindt.' },
  { id: 'f50', category: 'gewicht', text: 'Snel gewichtsverlies is voor veel mensen lastiger vol te houden dan geleidelijke verandering.' },
  { id: 'f51', category: 'herstel', text: 'Lichte spierpijn na een nieuwe oefening is doorgaans normaal en trekt meestal binnen enkele dagen weg.' },
  { id: 'f52', category: 'motivatie', text: 'Vergelijk uzelf liefst met uzelf van enkele weken geleden, niet met iemand anders.' },
  { id: 'f53', category: 'spiermassa', text: 'Ook alledaagse taken als traplopen en boodschappen dragen bij aan spierbehoud.' },
  { id: 'f54', category: 'menopauze', text: 'Klachten rond de overgang verschillen sterk per persoon. Er is geen enkele juiste aanpak.' },
  { id: 'f55', category: 'alcohol', text: 'Een alternatief klaarzetten, zoals bruiswater met citroen, helpt sommige mensen minderen.' },
  { id: 'f56', category: 'beweging', text: 'Bewegen in het groen wordt door veel mensen als extra ontspannend ervaren.' },
  { id: 'f57', category: 'gewoontevorming', text: 'Eén ding tegelijk veranderen lukt doorgaans beter dan alles ineens.' },
  { id: 'f58', category: 'buikomtrek', text: 'Verandering in omtrek gaat vaak traag. Om de vier weken meten volstaat meestal.' },
  { id: 'f59', category: 'herstel', text: 'Stress kan herstel vertragen. Een kort rustmoment inbouwen helpt sommige mensen.' },
  { id: 'f60', category: 'water', text: 'Op actieve of warme dagen heeft uw lichaam doorgaans wat meer vocht nodig.' },
  { id: 'f61', category: 'kracht', text: 'Goede uitvoering gaat voor gewicht. Netjes bewegen is meestal effectiever dan zwaarder tillen.' },
  { id: 'f62', category: 'motivatie', text: 'Een training plannen op een vast moment maakt de kans groter dat het lukt.' },
  { id: 'f63', category: 'slaap', text: 'Een korte routine voor het slapen helpt het lichaam vaak tot rust te komen.' },
];
