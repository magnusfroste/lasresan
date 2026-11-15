/**
 * Läsresans texter. Alla texter är skrivna för den här appen och är fria att
 * använda och ändra (CC BY 4.0). Tre nivåer: 4, 5 och 6.
 *
 * Varje text har exakt tre frågor:
 *  - "rad"    → svaret står direkt på raderna
 *  - "mellan" → svaret måste man läsa sig till mellan raderna
 *  - "ord"    → ord- och begreppsförståelse
 */

export type Level = 4 | 5 | 6;
export type QuestionKind = "rad" | "mellan" | "ord";

export type Question = {
  kind: QuestionKind;
  prompt: string;
  options: string[];
  /** Index i options för det rätta svaret. */
  correct: number;
  /** Förklaring som visas efter att eleven svarat. */
  explain: string;
};

export type ReadingText = {
  id: string;
  title: string;
  level: Level;
  topic: string;
  body: string[];
  questions: Question[];
};

export const KIND_LABEL: Record<QuestionKind, string> = {
  rad: "På raderna",
  mellan: "Mellan raderna",
  ord: "Ordförståelse",
};

export const KIND_HINT: Record<QuestionKind, string> = {
  rad: "Svaret står direkt i texten.",
  mellan: "Läs mellan raderna – leta efter ledtrådar.",
  ord: "Vad betyder ordet i det här sammanhanget?",
};

export const TEXTS: ReadingText[] = [
  {
    id: "katten-pa-bussen",
    title: "Katten på bussen",
    level: 4,
    topic: "Vardag",
    body: [
      "Varje morgon tar Ali buss 12 till skolan. Han sitter alltid längst bak, vid fönstret.",
      "En dag sitter en grå katt på sätet bredvid honom. Katten har ett rött halsband och en liten klocka som pinglar när den rör sig. Ali vet inte vems katten är. Han sätter försiktigt sin väska på golvet så att katten får plats.",
      "Vid hållplatsen vid torget reser sig en gammal dam. ”Där är du ju, Tass!” säger hon och skrattar. Katten hoppar ner och går efter henne.",
      "Ali tittar ut genom fönstret och ler. Bussen kör vidare mot skolan.",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Var sitter Ali på bussen?",
        options: ["Längst fram vid dörren", "Längst bak vid fönstret", "I mitten av bussen"],
        correct: 1,
        explain: "Texten säger att Ali alltid sitter längst bak, vid fönstret.",
      },
      {
        kind: "mellan",
        prompt: "Varför sätter Ali sin väska på golvet?",
        options: [
          "För att väskan är för tung att hålla",
          "För att han ska gå av snart",
          "För att katten ska få plats",
        ],
        correct: 2,
        explain:
          "Det står inte rakt ut, men texten säger att han gör det ”så att katten får plats”. Ali tar hänsyn till katten.",
      },
      {
        kind: "ord",
        prompt: "Vad betyder ”försiktigt” i texten?",
        options: ["Varsamt och lugnt", "Snabbt och hårt", "Argt och bestämt"],
        correct: 0,
        explain:
          "Att göra något försiktigt är att göra det varsamt, så att inget går sönder eller blir stört.",
      },
    ],
  },
  {
    id: "fagelholken",
    title: "Fågelholken",
    level: 4,
    topic: "Natur",
    body: [
      "När snön smälter brukar Maja och hennes pappa hänga upp en fågelholk i trädgården. Holken är gjord av gamla brädor som låg i garaget.",
      "Pappa borrar ett litet hål i framsidan, lagom stort för en mes. ”Om hålet är för stort kan skatorna komma in”, säger han.",
      "Maja lägger torrt gräs och mossa på marken nedanför. Hon har läst att fåglarna gärna använder det när de bygger bo.",
      "Efter två veckor sitter en blåmes i holken. Den tittar ut genom hålet och vippar på huvudet. Maja står alldeles stilla länge.",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Vad är fågelholken gjord av?",
        options: ["Gamla brädor från garaget", "Ny plywood från affären", "En tom mjölkkartong"],
        correct: 0,
        explain: "Texten säger att holken är gjord av gamla brädor som låg i garaget.",
      },
      {
        kind: "mellan",
        prompt: "Varför får hålet i holken inte vara för stort?",
        options: [
          "Då blir holken för tung att hänga upp",
          "Då kan skator komma in och ta boet",
          "Då syns inte fåglarna från köket",
        ],
        correct: 1,
        explain:
          "Pappa säger att skatorna kan komma in om hålet är för stort. Skator är större än mesar och kan då ta över holken.",
      },
      {
        kind: "ord",
        prompt: "Vad betyder ”vippar på huvudet”?",
        options: ["Gömmer huvudet under vingen", "Somnar med huvudet nedåt", "Rör huvudet snabbt fram och tillbaka"],
        correct: 2,
        explain: "Att vippa på huvudet är att snabbt röra det fram och tillbaka – något fåglar ofta gör.",
      },
    ],
  },
  {
    id: "elden-vid-sjon",
    title: "Elden vid sjön",
    level: 4,
    topic: "Historia",
    body: [
      "För länge sedan, innan det fanns bilar och el, levde människor i små byar nära vatten.",
      "En dag började det åska över sjön. Blixten slog ner i en torr tall, och grenarna började brinna. Folket i byn blev rädda först.",
      "Men en äldre kvinna som hette Runa tog en pinne, stack den i glöden och bar försiktigt elden till byns eldstad. Där fick lågan leva vidare. Sedan dess behövde de inte vara rädda för kalla nätter.",
      "Runa lärde alla barn att mata elden med små torra kvistar, aldrig med stora blöta stockar.",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Hur började branden i tallen?",
        options: ["Blixten slog ner i trädet", "Någon tände eld med flit", "Solen värmde grenarna"],
        correct: 0,
        explain: "Det började åska, och blixten slog ner i en torr tall.",
      },
      {
        kind: "mellan",
        prompt: "Varför bar Runa elden till byns eldstad?",
        options: [
          "För att släcka branden i tallen",
          "För att byn skulle ha eld och kunna hålla sig varm",
          "För att visa barnen hur farlig eld är",
        ],
        correct: 1,
        explain:
          "Texten säger att lågan fick leva vidare och att de sedan inte behövde vara rädda för kalla nätter. Runa räddade elden till byn.",
      },
      {
        kind: "ord",
        prompt: "Vad betyder ”glöden”?",
        options: ["Den grå röken", "Askan efter en släckt eld", "De röda, varma resterna av elden"],
        correct: 2,
        explain: "Glöd är det som lyser rött och fortfarande är mycket varmt när lågorna har slocknat.",
      },
    ],
  },
  {
    id: "snurran-pa-golvet",
    title: "Snurran på golvet",
    level: 4,
    topic: "Vardag",
    body: [
      "Farmor har köpt en liten robot som städar golvet. Den ser ut som en platt puck och låter som en surrande humla.",
      "Första dagen körde den rakt in i en stol och fastnade. Farmor skrattade och lyfte undan stolen. Sedan dess lägger hon undan sladdar och skor innan hon startar den.",
      "Roboten åker runt i rummet och känner med små sensorer när något är i vägen. När batteriet blir dåligt kör den själv tillbaka till sin laddstation.",
      "”Den är inte lika bra som en sopkvast i hörnen”, säger farmor, ”men jag slipper böja mig.”",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Vad gör roboten när batteriet blir dåligt?",
        options: ["Den stannar där den är", "Den kör tillbaka till laddstationen", "Den piper tills farmor lyfter den"],
        correct: 1,
        explain: "Texten säger att roboten själv kör tillbaka till sin laddstation när batteriet blir dåligt.",
      },
      {
        kind: "mellan",
        prompt: "Varför lägger farmor undan sladdar och skor?",
        options: [
          "För att roboten inte ska fastna",
          "För att det ska se städat ut",
          "För att roboten ska ladda snabbare",
        ],
        correct: 0,
        explain:
          "Första dagen fastnade roboten i en stol. Att hon sedan röjer undan sladdar och skor visar att hon vill undvika att den fastnar igen.",
      },
      {
        kind: "ord",
        prompt: "Vad menas med att roboten låter ”som en surrande humla”?",
        options: ["Att den är gul och svart", "Att den låter som ett brummande bi", "Att den flyger runt i rummet"],
        correct: 1,
        explain: "Jämförelsen handlar om ljudet: roboten brummar som en humla som surrar.",
      },
    ],
  },
  {
    id: "banken-i-parken",
    title: "Bänken i parken",
    level: 5,
    topic: "Empati",
    body: [
      "Milo satt på bänken i parken och väntade på att fotbollsträningen skulle börja. Bredvid honom satt en pojke som hette Sam och ritade i en anteckningsbok.",
      "Milo tittade nyfiket. På pappret växte en stad av torn och broar, med små bilar på gatorna. ”Vad fint”, sa Milo.",
      "Sam ryckte på axlarna och stängde boken fort. ”Det är inget.” Milo förstod att Sam var blyg. Han satte sig lite närmare och frågade om bron överst.",
      "Då började Sam prata. Han berättade att bron hade tre våningar och att det fanns en hemlig hiss inuti. När tränaren ropade gick båda två mot planen, och Sam stoppade boken i väskan med ett litet leende.",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Vad ritar Sam i sin anteckningsbok?",
        options: ["Ett fotbollsmål", "En stad med torn och broar", "En karta över parken"],
        correct: 1,
        explain: "På pappret växte en stad av torn och broar, med små bilar på gatorna.",
      },
      {
        kind: "mellan",
        prompt: "Varför stänger Sam boken så fort Milo säger att det är fint?",
        options: [
          "Han är blyg och tror inte att teckningen är bra nog",
          "Han har bråttom till träningen",
          "Han vill inte att Milo ska se hissen",
        ],
        correct: 0,
        explain:
          "Han rycker på axlarna och säger ”Det är inget”. Sedan konstaterar texten att Milo förstod att Sam var blyg.",
      },
      {
        kind: "ord",
        prompt: "Vad betyder ”nyfiket” i texten?",
        options: ["Med lust att veta och se mer", "Med rädsla för att bli störd", "Med tråkighet och likgiltighet"],
        correct: 0,
        explain: "Nyfiken är man när man gärna vill veta eller se mer av något.",
      },
    ],
  },
  {
    id: "isen-som-sjong",
    title: "Isen som sjöng",
    level: 5,
    topic: "Natur",
    body: [
      "Det var en kall morgon i februari när Elsa och hennes morfar gick ut på sjön. Isen var tjock och täckt av frost.",
      "Plötsligt hördes ett ljud djupt under fötterna, som ett långt sjungande. Elsa stannade. ”Är det farligt?” frågade hon.",
      "Morfar skakade på huvudet. ”Nej, det är isen som rör sig. När det blir kallare drar isen ihop sig och spricker. Ljudet färdas långt i isen.”",
      "Han pekade på en ljus spricka några meter bort. ”Ser du? Den har funnits länge. Vi går här varje vinter.”",
      "Elsa lyssnade igen. Nu lät isen nästan som en cello som stämdes inför en konsert. Hon vågade ta ett steg till.",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Vad är det som låter under fötterna?",
        options: ["Vinden som blåser över sjön", "Isen som rör sig och spricker", "Fiskar som simmar under isen"],
        correct: 1,
        explain: "Morfar förklarar: isen drar ihop sig när det blir kallare och spricker, och ljudet färdas långt i isen.",
      },
      {
        kind: "mellan",
        prompt: "Varför vågar Elsa till slut ta ett steg till?",
        options: [
          "Hon vill tillbaka till land så fort som möjligt",
          "Hon har bråttom och vågar inte stanna",
          "Morfar förklarar ljudet och hon känner sig trygg",
        ],
        correct: 2,
        explain:
          "Elsa frågar om det är farligt, får en förklaring och ser att morfar är lugn. Först då vågar hon fortsätta.",
      },
      {
        kind: "ord",
        prompt: "Vad betyder ”stämdes” när texten beskriver cellon?",
        options: [
          "Att instrumentet ställdes in så att tonerna blev rätt",
          "Att någon spelade en melodi på instrumentet",
          "Att instrumentet lades ner i sitt fodral",
        ],
        correct: 0,
        explain: "Att stämma ett instrument är att justera tonerna så att de låter rätt – isens ljud påminner om det.",
      },
    ],
  },
  {
    id: "brevet-fran-amerika",
    title: "Brevet från Amerika",
    level: 5,
    topic: "Historia",
    body: [
      "År 1888 bodde nioåriga Stina i en liten stuga i Småland. En dag kom brevbäraren med ett tunt kuvert med frimärken från Amerika.",
      "Stinas farbror hade rest dit tre år tidigare för att hitta arbete. I brevet fanns en sedel och en bild av en stad med höga hus.",
      "Stina kunde bara läsa några ord, så hon gick till skolmästaren. Han läste högt: farbrodern arbetade i en fabrik och hade byggt ett hus av trä.",
      "På kvällen satt familjen vid lampskenet och tittade på bilden. Stinas mor sa att de skulle spara sedeln till vinterns skor.",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Vem hade skickat brevet?",
        options: ["Skolmästaren", "Stinas farbror i Amerika", "Brevbäraren i Småland"],
        correct: 1,
        explain: "Stinas farbror hade rest till Amerika, och det var hans brev som kom med frimärken därifrån.",
      },
      {
        kind: "mellan",
        prompt: "Varför gick Stina till skolmästaren med brevet?",
        options: [
          "Hon kunde inte läsa hela brevet själv",
          "Hon ville skicka ett svar direkt",
          "Hon behövde hjälp att växla sedeln",
        ],
        correct: 0,
        explain:
          "Texten säger att Stina bara kunde läsa några ord. Därför behövde hon någon som kunde läsa högt för sig.",
      },
      {
        kind: "ord",
        prompt: "Vad är en fabrik?",
        options: ["En stor bondgård på landet", "Ett hus där en familj bor", "En byggnad där man tillverkar saker"],
        correct: 2,
        explain: "I en fabrik tillverkas saker, ofta av många arbetare och maskiner på samma plats.",
      },
    ],
  },
  {
    id: "snurrorna-pa-berget",
    title: "Snurrorna på berget",
    level: 5,
    topic: "Teknik",
    body: [
      "Ovanför byn där Noor bor står tre vindkraftverk. Hon kallar dem snurrorna.",
      "Varje morgon när hon cyklar till skolan ser hon dem vrida sina långa vingar långsamt mot vinden. En dag stannade en av dem helt.",
      "Noor trodde först att den var trasig, men pappa berättade att verket stänger av sig själv när det blåser för mycket. ”Annars kan vingarna gå sönder”, sa han.",
      "På kvällen frågade Noor varför de inte bygger fler verk. Pappa svarade att det finns regler för hur nära hus de får stå, eftersom de låter lite.",
      "Noor tänkte på det. Hon tyckte ändå att ljudet lät som havet.",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Varför stannade vindkraftverket en dag?",
        options: ["Det blåste för mycket", "Det hade gått sönder", "Det var avstängt för reparation"],
        correct: 0,
        explain: "Pappa berättar att verket stänger av sig själv när det blåser för mycket, så att vingarna inte går sönder.",
      },
      {
        kind: "mellan",
        prompt: "Varför får det inte stå vindkraftverk hur nära husen som helst?",
        options: [
          "De skuggar taken på morgonen",
          "De låter, och det finns bestämmelser om avstånd",
          "De behöver plats för att kunna lagas",
        ],
        correct: 1,
        explain:
          "Pappa säger att det finns regler för avståndet eftersom verken låter lite. Reglerna finns för att människor inte ska störas.",
      },
      {
        kind: "ord",
        prompt: "Vad betyder ”regler” i texten?",
        options: ["Ritningar över tornet", "Långa kablar i marken", "Bestämmelser för vad som är tillåtet"],
        correct: 2,
        explain: "Regler är bestämmelser som talar om vad man får och inte får göra.",
      },
    ],
  },
  {
    id: "tystnaden-i-klassrummet",
    title: "Tystnaden i klassrummet",
    level: 6,
    topic: "Empati",
    body: [
      "Klass 6B hade fått en ny elev, Iman, som knappt sa ett ord under de första veckorna. Läraren bad klassen göra grupper om fyra till ett projekt om havet.",
      "Ingen ville direkt fråga Iman, och Iman stod kvar vid sin bänk. Då gick Linn fram och la sin bok bredvid Imans. ”Vi ska göra om maneter. Du får bestämma bilden”, sa hon, fast hon egentligen redan hade tänkt ut en.",
      "Iman nickade. Nästa dag kom hon med en teckning av en manet som glödde i mörkret, med långa trådar som svävade.",
      "Gruppen blev tyst. ”Hur visste du att de lyser?” frågade Linn. Iman log för första gången. ”Vi har sett dem”, sa hon. ”Hemma.”",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Vad fick Iman bestämma i grupparbetet?",
        options: ["Vilket hav gruppen skulle skriva om", "Bilden", "Vem som skulle läsa högt"],
        correct: 1,
        explain: "Linn säger: ”Du får bestämma bilden.”",
      },
      {
        kind: "mellan",
        prompt: "Varför säger Linn att Iman får bestämma bilden, trots att Linn redan tänkt ut en?",
        options: [
          "Hon vill att Iman ska känna sig välkommen och våga vara med",
          "Hon tycker inte att hennes egen idé var bra",
          "Hon har inte tid att rita själv",
        ],
        correct: 0,
        explain:
          "Texten säger att Linn egentligen redan hade en idé. Att hon ändå ger bort uppgiften visar att hon vill få med Iman i gruppen.",
      },
      {
        kind: "ord",
        prompt: "Vad betyder ”svävade” i texten?",
        options: ["Låg stilla på botten", "Satt fast i en sten", "Rörde sig fritt utan att sjunka"],
        correct: 2,
        explain: "Att sväva är att röra sig fritt, som i vatten eller luft, utan att sjunka till botten.",
      },
    ],
  },
  {
    id: "lavarna-pa-berget",
    title: "Lavarna på berget",
    level: 6,
    topic: "Natur",
    body: [
      "På fjället, ovanför trädgränsen, finns nästan inga träd, bara sten och låga växter. Där växer lavar som kan bli hundratals år gamla.",
      "De har inga rötter och suger inte vatten ur marken som andra växter. I stället tar de upp fukt direkt från dimman och regnet genom hela sin yta.",
      "Det gör att de klarar långa perioder av torka, men också att de reagerar snabbt på föroreningar i luften. Forskare använder därför lavar som ett slags mätare: om lavarna försvinner från en plats har luften blivit sämre.",
      "När Klara var liten trodde hon att lavarna var gråa fläckar av färg som någon hade spillt.",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Hur får lavarna vatten?",
        options: [
          "Genom rötter som går djupt ner i marken",
          "Genom hela ytan, från dimma och regn",
          "Från smältvatten under snön",
        ],
        correct: 1,
        explain: "Lavarna har inga rötter. De tar upp fukt direkt från dimman och regnet genom hela sin yta.",
      },
      {
        kind: "mellan",
        prompt: "Varför kan forskare använda lavar som en mätare?",
        options: [
          "De blir högre när luften blir bättre",
          "De byter färg varje år",
          "De försvinner när luften blir sämre",
        ],
        correct: 2,
        explain:
          "Lavarna reagerar snabbt på föroreningar. Om de försvinner från en plats har luften blivit sämre – alltså fungerar de som ett tecken.",
      },
      {
        kind: "ord",
        prompt: "Vad betyder ”föroreningar”?",
        options: ["Ämnen som smutsar ner luft eller vatten", "Näringsämnen som växterna behöver", "Vatten som fryser till is"],
        correct: 0,
        explain: "Föroreningar är skadliga ämnen som blandas ut i luft, vatten eller mark och smutsar ner den.",
      },
    ],
  },
  {
    id: "tryckpressen",
    title: "Tryckpressen",
    level: 6,
    topic: "Historia",
    body: [
      "Före 1400-talet kopierades böcker för hand, och en enda bok kunde ta månader att göra.",
      "Sedan kom Gutenberg på hur man kunde gjuta lösa bokstäver i metall och sätta dem i rader. Med en press kunde en sida tryckas hundratals gånger på kort tid.",
      "Böckerna blev billigare, men de blev inte billiga: en tryckt bok kunde fortfarande kosta som en månadslön. Ändå förändrades något viktigt. När fler kunde läsa samma text började idéer spridas snabbare än kyrkan och kungen kunde stoppa dem.",
      "Gutenberg själv tjänade inte mycket på sin uppfinning. Han lånade pengar till verkstaden och förlorade en rättegång om den.",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Vad kom Gutenberg på?",
        options: [
          "Att gjuta lösa bokstäver i metall och sätta dem i rader",
          "Att skriva böcker snabbare för hand",
          "Att göra papper av trä",
        ],
        correct: 0,
        explain: "Han gjöt lösa bokstäver i metall, satte dem i rader och kunde sedan trycka samma sida många gånger.",
      },
      {
        kind: "mellan",
        prompt: "Varför var det viktigt att många kunde läsa samma text?",
        options: [
          "För att böckerna då blev dyrare och mer värdefulla",
          "För att idéer då spreds snabbare och blev svårare att stoppa",
          "För att kyrkan ville ha fler präster",
        ],
        correct: 1,
        explain:
          "Texten säger att idéer började spridas snabbare än kyrkan och kungen kunde stoppa dem. Det var den stora förändringen.",
      },
      {
        kind: "ord",
        prompt: "Vad är en rättegång?",
        options: ["En lång resa till en annan stad", "Ett möte i kyrkan", "En prövning i domstol"],
        correct: 2,
        explain: "En rättegång är när ett ärende prövas i domstol, där en domare avgör vem som har rätt.",
      },
    ],
  },
  {
    id: "modellen-som-gissar",
    title: "Modellen som gissar",
    level: 6,
    topic: "Teknik",
    body: [
      "En språkmodell är ett program som har läst enorma mängder text. Den har inte förstått texterna som du och jag, utan lärt sig vilka ord som brukar följa på vilka andra.",
      "När du skriver en fråga gissar modellen vilket ord som är mest sannolikt härnäst, om och om igen. Det är därför svaret kan låta mycket säkert även när det är fel.",
      "Modellen har ingen egen källa att kontrollera mot, och den minns inte samtalet efter att det är slut om ingen har sparat det.",
      "Det bästa sättet att använda en sådan modell är att be den förklara hur den tänker och sedan kontrollera påståendena själv.",
    ],
    questions: [
      {
        kind: "rad",
        prompt: "Hur har språkmodellen lärt sig?",
        options: [
          "Den har läst enorma mängder text och lärt sig vilka ord som brukar följa på varandra",
          "Den har fått alla svar inmatade av lärare",
          "Den söker upp svaret i en ordbok varje gång",
        ],
        correct: 0,
        explain: "Texten säger att modellen har läst enorma mängder text och lärt sig vilka ord som brukar följa på vilka andra.",
      },
      {
        kind: "mellan",
        prompt: "Varför kan modellen låta säker på något som är fel?",
        options: [
          "För att den vill luras",
          "För att den gissar ord och inte har någon källa att kontrollera mot",
          "För att den bara svarar på svåra frågor",
        ],
        correct: 1,
        explain:
          "Modellen gissar det mest sannolika ordet och har ingen egen källa att kontrollera mot. Säkerheten i tonen säger inget om att svaret är rätt.",
      },
      {
        kind: "ord",
        prompt: "Vad betyder ”sannolikt”?",
        options: ["Helt säkert", "Omöjligt att veta", "Troligt – med stor chans att det stämmer"],
        correct: 2,
        explain: "Sannolikt betyder troligt: det finns stor chans att det är så, men det är inte säkert.",
      },
    ],
  },
];

export const LEVELS: Level[] = [4, 5, 6];
export const TOTAL_TEXTS = TEXTS.length;

export const wordCount = (text: ReadingText): number =>
  text.body.join(" ").split(/\s+/).filter(Boolean).length;

/** Ungefärlig lästid i minuter, avrundat uppåt, minst 1. */
export const minutes = (text: ReadingText): number => Math.max(1, Math.ceil(wordCount(text) / 120));

export const textById = (id: string): ReadingText | undefined => TEXTS.find((t) => t.id === id);

export const nextText = (id: string, level?: Level): ReadingText => {
  const idx = TEXTS.findIndex((t) => t.id === id);
  const pool = level ? TEXTS.filter((t) => t.level === level) : TEXTS;
  const pos = pool.findIndex((t) => t.id === id);
  if (pos >= 0 && pool.length > 1) return pool[(pos + 1) % pool.length];
  return TEXTS[(idx + 1) % TEXTS.length];
};