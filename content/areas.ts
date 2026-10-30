import { Boxes, Calculator, Clock, Factory, Landmark, ShoppingCart, type LucideIcon } from "lucide-react";
import type { ScreenshotKey } from "./screenshots";

// The six feature areas. Every claim here is backed by the user manual
// (dev/docs/manual) — check the chapter before adding a point.
export interface ManualRef {
  chapter: string;
  anchor?: string;
  label: string;
}

export interface FeatureGroup {
  id: string;
  title: string;
  points: string[];
}

/** A walk-through of one realistic case, in the order things happen in the system. */
export interface FeatureExample {
  title: string;
  intro?: string;
  steps: string[];
}

export interface FeatureFaq {
  question: string;
  answer: string;
}

export interface FeatureArea {
  slug: string;
  title: string;
  icon: LucideIcon;
  tagline: string;
  intro: string;
  /** <title> and meta description: what someone searching would type, and short enough to show whole. */
  seoTitle: string;
  description: string;
  screenshot?: ScreenshotKey;
  /** Laws and standards the area is built around, linked to their own source. */
  sources?: Array<{ label: string; href: string }>;
  /** Where in the demo the area is seen — the menu path a visitor opens after logging in. */
  demoWhere: string;
  /** More screenshots, shown in pairs under the text, each with a caption saying what it shows. */
  gallery?: Array<{ shot: ScreenshotKey; caption: string }>;
  groups: FeatureGroup[];
  example: FeatureExample;
  /** What the area doesn't do yet — said up front, so nobody finds out after installing. */
  limits: string[];
  /** Shown as visible questions and answers. No FAQPage schema: Google stopped showing those results. */
  faq: FeatureFaq[];
  manual: ManualRef[];
}

export const FEATURE_AREAS: FeatureArea[] = [
  {
    slug: "tillverkning",
    title: "Tillverkning",
    icon: Factory,
    demoWhere: "Tillverkning → Beläggning och Tillverkning → Pågående arbete",
    tagline: "Tillverkningsorder från frisläpp till efterkalkyl.",
    seoTitle: "Tillverkningsorder och produktionsplanering",
    description:
      "Tillverkningsorder med struktur och rutt, materialuttag och tid från verkstaden, planering på ledig kapacitet vecka för vecka och efterkalkyl.",
    intro:
      "Tillverkningsordern hämtar struktur och rutt från artikelns beredning, drar material från lagret och samlar tid från verkstaden. När ordern är klar vet ni vad den faktiskt kostade.",
    screenshot: "manufacturing-orders",
    gallery: [
      { shot: "belaggning", caption: "Beläggning per resurs och vecka. En överbelagd vecka blir röd." },
      { shot: "behovsberakning", caption: "Behovsberäkningen föreslår inköp och tillverkning ur nettobehovet." },
      { shot: "arbetskort", caption: "Arbetskortet: tillverkningsordern utskriven med operationer, instruktioner och material." },
      { shot: "pallkort", caption: "Pallkortet skrivs ut när en operation rapporteras, med streckkod för artikel och order." },
    ],
    groups: [
      {
        id: "ordrar",
        title: "Tillverkningsorder",
        points: [
          "Flödet frisläppt → pågår → klar → stängd, med statusövergångar som kontrolleras i systemet.",
          "Materialförbrukning och tidrapportering mot ordern, med rapporteringslogg och möjlighet att ångra.",
          "Efterkalkyl per order: vad materialet och tiden faktiskt kostade.",
          "Material och operationer kan ändras på en frisläppt order, bara för den ordern, och väntande operationer planeras om direkt.",
        ],
      },
      {
        id: "beredning",
        title: "Beredning",
        points: [
          "Artikelstruktur (material) och rutt (operationer) på samma flik i artikelkortet.",
          "Ställtid och tid per enhet för varje operation, kopplad till en resurs.",
          "Legoarbete — ytbehandling, härdning, lackering — som egna operationer med ställ- och styckpris.",
        ],
      },
      {
        id: "planering",
        title: "Planering",
        points: [
          "Behovsberäkningen räknar fram nettobehovet per artikel och föreslår inköps- och tillverkningsordrar.",
          "Beläggning: last mot tillgänglig tid per resurs och vecka, där röda dagar minskar kapaciteten.",
          "Produktionsplanering: Planera lägger operationerna på resursernas lediga tid vecka för vecka, en operation kan flyttas och låsas för hand, och en ny tillverkningsorder planeras direkt.",
          "Leveranstidskontrollen på kundordern räknar fram ett leveransdatum ur lager, inköp och kapacitet och kan skapa tillverkningsordrarna för det som saknas.",
          "Pågående arbete visar i realtid vem som jobbar med vad.",
        ],
      },
      {
        id: "resurser",
        title: "Resurser",
        points: [
          "Maskiner och personal med timkostnad, TO-påslag och veckoschema.",
          "Produktionsgrupper, och legoresurser med standardleverantör och ledtider.",
          "Import av resurser från fil.",
        ],
      },
    ],
    example: {
      title: "Exempel: 50 konsoler till en kund",
      intro: "En verkstad får en order på 50 konsoler i plåt.",
      steps: [
        "På artikelns flik Beredning finns plåten i strukturen och tre operationer i rutten: 10 Laserskärning, 20 Bockning och 30 Svetsning, var och en med ställtid, tid per enhet och resurs. Plåten är kopplad till operation 10.",
        "Kundordern bekräftas, och på kundorderkortet trycker ni Leveranstidskontroll. Kontrollen räknar med lager, öppna ordrar, materialets ledtid och resursernas lediga tid per vecka, och visar leveransdatum och vad som begränsar, till exempel bockningen i vecka 45–46.",
        "Ni klickar Använd datumet med kryssrutan Skapa tillverkningsordrar för det som saknas ikryssad. Kundordern får sitt leveransdatum och en tillverkningsorder på 50 skapas, kopplad till kundorderraden, frisläppt och låst i de veckor kontrollen räknade med. Plåt som måste köpas föreslås i Tillverkning → Behovsberäkning.",
        "I Tillverkning → Beläggning syns ordern per resurs och vecka mot tillgänglig tid, och en vecka över 100 procent blir röd. Måste en operation flyttas gör ni det med Flytta…, och Planera lägger övriga ordrar på den tid som är kvar.",
        "Operatören vid lasern knappar in sitt anställningsnummer i stämpelterminalen, väljer Stämpla in på arbete, markerar operation 10 och trycker Starta valda. Vid Stämpla ut anges 30 OK och 2 kasserade med orsak. Tiden blir en tidrapport, plåt för 32 enheter dras från lagret och bockningen visar 30 av 50 redo.",
        "Varje utstämpling på svetsningen, som är sista operationen, lägger Antal OK i lager som färdiga varor. När alla 50 är inlevererade blir ordern Klar av sig själv.",
        "På tillverkningsordern trycker ni Efterkalkylera. Den räknar verklig materialförbrukning, inklusive det kasserade, och rapporterad tid gånger resursens timkostnad. Spara kalkyl lägger den på ordern, och på artikelns flik Kalkyl jämför ni den med förkalkylen rad för rad.",
      ],
    },
    limits: [
      "Planeringen räknar ledig tid per resurs och vecka. Det finns ingen detaljplanering per dag eller timme och ingen köberäkning.",
      "Det finns ännu ingen spårbarhet med batch- eller serienummer.",
      "Det finns ingen koppling mellan en tillverkningsorder och tillverkningsordrarna för dess halvfabrikat.",
      "Planeringen och Leveranstidskontrollen prövar inte alternativa resurser. En operation planeras alltid på den resurs den har på ordern.",
      "Behovsberäkningens förslag är inte tidsfasade. Datumen sätts först när ordrarna skapas.",
    ],
    faq: [
      {
        question: "Fungerar Nav|ERP både för kundorderstyrd tillverkning och tillverkning mot lager?",
        answer:
          "Ja. En tillverkningsorder kan skapas från en kundorderrad, från Leveranstidskontrollen eller för hand. För lagerartiklar sätter ni Beställningspunkt och Orderkvantitet på artikelns Lager-flik, så föreslår Behovsberäkningen en tillverkningsorder när det projicerade saldot faller under punkten. Kundordrar räknas som behov när de är bekräftade, offerter gör det inte.",
      },
      {
        question: "Följer planeringen operationsordningen?",
        answer:
          "Ja. Planera tar ordrarna efter planerat färdigdatum och lägger varje orders operationer i tur och ordning. Nästa operation får börja samma vecka som den föregående blir klar, om det finns tid kvar. I stämpelterminalen visar märket Redo om föregående operation har rapporterat tillräckligt, men det spärrar aldrig en instämpling.",
      },
      {
        question: "Kan vi rapportera delantal?",
        answer:
          "Ja. Varje utstämpling kan ange Antal OK och Kasserat, och antalen läggs ihop på operationen. Operationen blir klar först när Antal OK når orderns antal. På sista operationen läggs varje delantal i lager direkt, och orderhuvudet visar till exempel Inlevererat: 20 av 50.",
      },
      {
        question: "Hur hanteras kassation?",
        answer:
          "Kasserade enheter rapporteras med obligatorisk kassationsorsak. Materialet dras för OK plus kasserat, eftersom även kasserade enheter har förbrukat material. Kasserade minskar inte det som är kvar att tillverka, eftersom de måste göras om. Rapporten Kassationsstatistik summerar per månad, artikel, resurs eller orsak.",
      },
      {
        question: "Hur fungerar legoarbete hos en underleverantör?",
        answer:
          "Underleverantören läggs upp som legoresurs och blir en operation i rutten, med leverantör, ställpris och styckpris. Behovsberäkningen föreslår en inköpsorder för varje ofärdig lego-operation, och ni kan skicka förfrågan till flera leverantörer för att jämföra pris. När legoinköpet levereras in avrapporteras operationen automatiskt, och efterkalkylen tar den verkliga kostnaden från inköpsordern.",
      },
    ],
    manual: [
      { chapter: "tillverkning", label: "Kapitlet Tillverkning" },
      { chapter: "tillverkning", anchor: "behovsberakning", label: "Behovsberäkning" },
      { chapter: "tillverkning", anchor: "belaggning", label: "Beläggning" },
      { chapter: "tillverkning", anchor: "planerade-veckor", label: "Planerade veckor" },
      { chapter: "terminal", label: "Stämpelterminalen" },
    ],
  },
  {
    slug: "lager-och-artiklar",
    title: "Lager och artiklar",
    icon: Boxes,
    demoWhere: "Lager → Transaktioner, eller en artikel under Artiklar",
    tagline: "Artikeln är navet — saldot är alltid spårbart.",
    seoTitle: "Lager och artiklar: lagerstyrning i affärssystemet",
    description:
      "Artikelregister, lagerplatser, inventering och lagervärdering. Varje saldo går att följa bakåt till transaktionen som skapade det.",
    intro:
      "Allt i Nav|ERP utgår från artikeln: lager, inköp, försäljning, tillverkning och kalkyl. Lagret ändras aldrig utan en transaktion, så varje saldo går att följa bakåt till inleveransen, uttaget eller justeringen som skapade det.",
    screenshot: "article-overview",
    gallery: [
      { shot: "lager-transaktioner", caption: "Transaktionsloggen visar varje rörelse och vad som orsakade den." },
      { shot: "lager-saldon", caption: "Saldon per lagerplats." },
      { shot: "behovsberakning", caption: "Behovsberäkningen räknar nettobehovet för alla artiklar på en gång." },
    ],
    groups: [
      {
        id: "artiklar",
        title: "Artikelregistret",
        points: [
          "Artikelkort med flikarna Allmänt, Beredning, Lager, Kalkyl, Revisioner och Filer.",
          "Artikelgrupper, alternativa enheter och leverantörskatalog med staffelpriser.",
          "Prishistorik för standardkostnad, försäljningspris och leverantörspriser.",
          "Import av artiklar, struktur och operationer från CSV eller Excel, med färdiga Excelmallar — kom igång med data från ert gamla system.",
          "En ny artikel kan kopiera uppgifter, beredning, leverantörer och ritningar från en befintlig artikel.",
          "Artikelnummer ur en nummerserie, med egna serier per artikelgrupp.",
        ],
      },
      {
        id: "planering",
        title: "Planering per artikel",
        points: [
          "Artikelöversikten visar alla behov och allt inkommande i datumordning, med löpande disponibelt.",
          "Beställningspunkt, orderkvantitet och huvudleverantör med ledtid på samma ställe.",
          "Behovsberäkningen föreslår inköps- och tillverkningsordrar för alla artiklar på en gång.",
          "Avrundning till hela förpackningar eller stänger, både i förslagen och på orderraderna.",
        ],
      },
      {
        id: "lager",
        title: "Lagret",
        points: [
          "Saldon per lagerplats och en fullständig transaktionslogg med källa, löpande saldo och vem som gjorde vad.",
          "Lagerflytt, justering och inventering per lagerplats — med möjlighet att spärra platsen medan ni räknar.",
          "Lagervärdering per valfritt datum: standardpris, senaste inköp eller vägt snitt.",
          "Skanning med handskanner eller mobilens kamera i inleverans, plock och inventering — artikelnummer, EAN, ordernummer och lagerplatsetiketter, med etiketter för artiklar och lagerplatser.",
        ],
      },
    ],
    example: {
      title: "Exempel: från det gamla systemet till första inventeringen",
      intro: "En verkstad med 25 anställda flyttar sitt artikelregister till Nav|ERP och följer en artikel, rundstål Ø12, genom första kvartalet.",
      steps: [
        "Lägg upp ett Huvudlager med lagerplatserna A1–A4 under Lager → Lagerplatser. Lägg också upp resurserna under Tillverkning → Resurser, eftersom importerade operationer måste peka på en resurs som finns.",
        "Under Artiklar → Importera, fliken Alla filer, väljer ni artikel-, enhets-, operations- och strukturfilerna på en gång. Guiden importerar dem i rätt ordning, och Importera alla är låst tills ingen fil har fel.",
        "Öppna rundstålet. Grundenheten är kg, och enhetsfilen har gett den alternativa enheten m. På fliken Lager sätter ni Beställningspunkt 400 kg och Orderkvantitet 500 kg, och på fliken Inköp markerar ni huvudleverantören med ledtid.",
        "Saldona följer inte med importen. Under Lager → Inventering skapar ni ett underlag för A1, lägger till artiklarna med Lägg till artikel, fyller i Räknat och klickar Registrera. Varje rad blir en inventeringsjustering, värderad till artikelns standardpris om den har ett.",
        "När netto faller under 400 kg föreslår Tillverkning → Behovsberäkning ett inköp i multiplar av 500 kg. Skapa ordrar gör ett utkast till inköpsorder hos huvudleverantören.",
        "Vid kvartalets inventering skriver ni ut en blind räknelista. Hyllan har 212 kg mot bokförda 230 kg, och Registrera bokför en justering på −18 kg.",
        "Klicka Visa lagerlogg på artikelkortets Lager-flik. Lager → Transaktioner visar varje rad med löpande saldo, vem som bokförde den och källan: inköpsordern, tillverkningsordern eller inventeringen. Filtrera på datum för att se var differensen uppstod.",
      ],
    },
    limits: [
      "Det finns ännu ingen spårbarhet på batch- eller serienummer.",
      "Behovsberäkningen räknar på artikelns totala saldo över alla lager. Det går inte att planera eller sätta beställningspunkt per lager.",
      "Det finns ingen FIFO-värdering, och en lagerrörelse kan inte backdateras in i en tidigare värdering.",
    ],
    faq: [
      {
        question: "Kan vi ta med artiklar och strukturer från vårt gamla system?",
        answer:
          "Ja. Artiklar → Importera läser CSV och xlsx med artiklar, alternativa enheter, operationer, struktur, inköpspriser, kundpriser och lagersaldon. Varje fil importeras helt eller inte alls, så ett radfel stoppar filen tills det är rättat. Lagersaldon bokas som lagerjusteringar med à-pris, så lagerloggen och lagervärderingen stämmer från första dagen.",
      },
      {
        question: "Vad händer om saldot blir negativt?",
        answer:
          "Det tillåts, och artikeln visas på Översiktens bevakningslista. Inställningen Materialbrist vid rapportering avgör om tillverkningens rapportering ska gå igenom, varna eller spärras när materialet inte räcker. En lagerflytt kan aldrig flytta mer än det som står på platsen.",
      },
      {
        question: "Hur värderas lagret i bokslutet?",
        answer:
          "Bokslutsguidens steg Lagerförändring värderar lagret per bokslutsdagen med standardpris, senaste inköp eller vägt snitt. Skillnaden mot kontot Lager (förval 1460) bokförs mot Lagerförändring (förval 4990). Inkurans och pågående tillverkning bokför ni själva med ett eget verifikat.",
      },
      {
        question: "Kan vi inventera medan produktionen går?",
        answer:
          "Ja. Utan spärr fortsätter rörelserna, och rader där artikeln rört sig efter frysningen märks så att ni kan kontrollera räkningen. Med spärr stoppas alla rörelser på just den lagerplatsen tills inventeringen är registrerad eller avbruten.",
      },
      {
        question: "Hur håller vi ordning på revisioner och ritningar?",
        answer:
          "Fliken Revisioner har artikelns revisioner och ritningsnummer, med en aktiv revision i taget. Den aktiva revisionen kan skrivas ut på offert, orderbekräftelse, inköpsorder och förfrågan. Ritningarna laddas upp på fliken Filer och följer med när tillverkningsordern skrivs ut.",
      },
      {
        question: "Vi köper i meter men lagerför i kilo. Fungerar det?",
        answer:
          "Ja. Saldot förs alltid i grundenheten, och alternativa enheter läggs till med en omräkningsfaktor. När ni byter enhet på en orderrad räknas antal och à-pris om.",
      },
    ],
    manual: [
      { chapter: "artiklar", label: "Kapitlet Artiklar" },
      { chapter: "artiklar", anchor: "artikeloversikt", label: "Artikelöversikt" },
      { chapter: "lager", label: "Kapitlet Lager" },
      { chapter: "lager", anchor: "inventering", label: "Inventering" },
      { chapter: "lager", anchor: "lagervardering", label: "Lagervärdering" },
    ],
  },
  {
    slug: "inkop-och-forsaljning",
    title: "Inköp och försäljning",
    icon: ShoppingCart,
    sources: [{ label: "ISO 20022, standarden bakom camt.054 och pain.001", href: "https://www.iso20022.org/" }],
    demoWhere: "Försäljning → Kundorder och Försäljning → Fakturor",
    tagline: "Från offert och förfrågan till faktura och betalning.",
    seoTitle: "Inköp, försäljning och fakturering",
    description:
      "Offert, kundorder, leverans och faktura – och förfrågan, inköpsorder och inleverans. Med reskontra, bankfiler och direkt koppling till lagret.",
    intro:
      "Hela affärsflödet åt båda hållen, med reskontra och bankfiler. Det ni säljer och köper hänger ihop med lager och tillverkning: en kundorder syns direkt som behov och en inleverans direkt som saldo.",
    screenshot: "dashboard",
    gallery: [
      { shot: "kundorder", caption: "Kundordern med en tillverkningsorder per rad." },
      { shot: "faktura", caption: "En betald faktura med OCR-nummer och betalningens verifikat." },
      { shot: "offertuppfoljning", caption: "Offertuppföljningen: hit rate i antal och värde, totalt och per kund." },
      { shot: "inkopsordrar", caption: "Inköpsordrar, bekräftade och delvis mottagna." },
      { shot: "fakturagranskning", caption: "Fakturainkorgen tolkar leverantörsfakturan och matchar den mot leverantör och inköpsorder." },
      { shot: "reklamation", caption: "En kundreklamation under utredning, kopplad till order och faktura." },
    ],
    groups: [
      {
        id: "forsaljning",
        title: "Försäljning",
        points: [
          "Offert → kundorder → utleverans → faktura, med följesedel och kreditfaktura.",
          "Prislistor och kundpriser, med import av kunder och priser från CSV.",
          "Samlingsfakturering: en faktura per kund för alla levererade, ofakturerade rader.",
          "E-faktura via Peppol till svenska företagskunder, med leveransstatus på fakturan.",
          "Pallkort med streck- eller QR-kod och eget antal per kolli, och en utleverans kan ångras per rad.",
          "Täckningsbidrag och täckningsgrad på offerten och ordern, räknat mot artiklarnas förkalkyl.",
          "Eget leveransdatum per orderrad, och en ny leveransadress kan skrivas in direkt på ordern.",
          "Offerter som en egen rutin med egen nummerserie, giltighetstid och status Förlorad med förlustorsak, och rapporten Offertuppföljning med hit rate.",
        ],
      },
      {
        id: "inkop",
        title: "Inköp",
        points: [
          "Prisförfrågan → inköpsorder → inleverans, med tillåten överleverans som inställning och möjlighet att ångra en inleverans.",
          "Leverantörer och inköpspriser med import från CSV.",
          "Leverantörsfakturor med attest, och inköpsdokument som skickas direkt via e-post.",
          "Önskat och bekräftat leveransdatum på inköpsordern och per rad — planeringen räknar med det bekräftade.",
          "Orderförteckning för kundorder och inköp med ordervärde och restvärde, som PDF och CSV.",
        ],
      },
      {
        id: "frakt",
        title: "Frakt",
        points: [
          "Boka transport direkt från följesedeln via Sendify — bland annat DHL, UPS, DSV, PostNord och Schenker.",
          "Jämför priser, boka och skriv ut fraktsedel utan att lämna systemet.",
          "Fraktpris direkt på offert och kundorder.",
        ],
      },
      {
        id: "betalningar",
        title: "Reskontra och betalningar",
        points: [
          "Kund- och leverantörsreskontra med öppna poster.",
          "Läs in bankens inbetalningsfil (camt.054) — inbetalningarna matchas mot öppna fakturor via OCR.",
          "Skapa betalfiler (pain.001) för leverantörsbetalningar och ladda upp dem i internetbanken.",
          "Betalningspåminnelser med e-post, med påminnelseavgift högst en gång per faktura.",
        ],
      },
    ],
    example: {
      title: "Exempel: 40 motorkonsoler från offert till betalning",
      intro: "En kund ber om pris på 40 motorkonsoler som ni tillverkar själva, och plåten till dem räcker inte i lager.",
      steps: [
        "Under Försäljning → Kundorder väljer ni + Ny offert med kunden och 40 konsoler, och priset hämtas från kundens priser. Leveranstidskontroll räknar fram ett datum ni kan lova, Kontrollera fraktpris lägger frakten som en rad och Skicka offert mejlar offerten.",
        "Kunden tackar ja, och Skicka orderbekräftelse gör offerten till en bekräftad kundorder. Skapa tillverkningsorder på raden frisläpper en tillverkningsorder, och kundordern går till Under tillverkning.",
        "Tillverkning → Behovsberäkning visar att plåten saknas. Skapa ordrar lägger en inköpsorder hos huvudleverantören med ett önskat leveransdatum som tar hänsyn till leverantörens ledtid, och Skicka via e-post skickar och bekräftar den.",
        "När plåten kommer rapporterar ni den under Inköp → Inleverans. Saldot ökar direkt, och ordern väntar under Fakturaunderlag på leverantörens faktura.",
        "När konsolerna är klara rapporterar ni dem under Försäljning → Utleverans och får följesedel och pallkort. Boka transport skapar en försändelse med den offererade transporten vald, och Boka vald produkt bokar den.",
        "Under Försäljning → Fakturor väljer ni + Ny faktura och ordern. Utfärda ger fakturan nummer, OCR-nummer och förfallodatum och bokför den, och Skicka faktura mejlar den.",
        "När ni läser in bankens camt.054-fil under Försäljning → Bankfiler matchas inbetalningen mot fakturan på OCR-numret. Bokför valda registrerar betalningen, och fakturan blir betald.",
      ],
    },
    limits: [
      "E-faktura via Peppol går bara till svenska företagskunder i kronor, och inkommande e-fakturor tas inte emot. Andra fakturor skickas som PDF med e-post.",
      "Det finns ingen EDI för order eller fakturor.",
      "Offert, orderbekräftelse, följesedel och faktura skrivs bara ut på svenska.",
      "Det finns ingen färdig koppling till en webbutik. Externa system kan däremot lägga offerter via API:t.",
    ],
    faq: [
      {
        question: "Kan vi leverera och fakturera en order i omgångar?",
        answer:
          "Ja. I Utleverans är antalet förifyllt med det som återstår, och ni ändrar det till det ni skickar nu. Varje leverans får en egen följesedel, och fakturan tar bara med det som är levererat men inte fakturerat.",
      },
      {
        question: "Hur rättar vi en faktura som redan är skickad?",
        answer:
          "Med en kreditfaktura, eftersom en utfärdad faktura är låst. Skapa kreditfaktura på fakturakortet gör ett utkast som speglar fakturan, och ni tar bort rader eller ändrar antal för en delkreditering.",
      },
      {
        question: "Får fakturorna OCR-nummer?",
        answer:
          "Ja. Fakturan får ett OCR-nummer när den utfärdas, och det skrivs ut i betalningsrutan med ert bankgiro eller plusgiro. Saknar en inbetalning i bankfilen OCR föreslår systemet en faktura utifrån belopp och namn, och ni bekräftar själva.",
      },
      {
        question: "Kan vi skicka offerter, order och fakturor med e-post direkt från systemet?",
        answer:
          "Ja, när en e-postserver (SMTP) är inställd. Offert, orderbekräftelse, faktura, påminnelse, prisförfrågan och inköpsorder skickas som PDF, och artiklarnas ritningar kan följa med som bilagor. Alla utskick sparas i e-postloggen.",
      },
      {
        question: "Kan olika kunder ha olika priser?",
        answer:
          "Ja. En kund kan ha egna priser eller rabatter per artikel eller artikelgrupp, med staffel, och dessutom en prislista och en generell kundrabatt. Det mest specifika priset fylls i på ordern, och ett pris ni skriver själva gäller före förslaget.",
      },
      {
        question: "Hur fungerar det med kunder i andra länder?",
        answer:
          "Kunden får en egen valuta, och offert, order och faktura följer den med dagens kurs. Bokföringen sker i kronor, och betalningen bokförs med kursvinst eller kursförlust. Momskoden väljs efter kundens land och VAT-nummer och styr sats, intäktskonto och ruta i momsdeklarationen: ett företag i ett annat EU-land faktureras utan moms och kommer med i den periodiska sammanställningen, och varor till länder utanför EU blir export utan moms. Distansförsäljning till privatpersoner i andra EU-länder (OSS) ingår inte, dokumenten skrivs bara ut på svenska och fraktbokningen hanterar inte tull.",
      },
    ],
    manual: [
      { chapter: "forsaljning", label: "Kapitlet Försäljning" },
      { chapter: "inkop", label: "Kapitlet Inköp" },
      { chapter: "forsaljning", anchor: "frakt", label: "Frakt via Sendify" },
      { chapter: "forsaljning", anchor: "bankfiler-inbetalningar", label: "Bankfiler (inbetalningar)" },
      { chapter: "inkop", anchor: "betalfiler", label: "Betalfiler" },
    ],
  },
  {
    slug: "kalkyl",
    title: "Kalkyl",
    icon: Calculator,
    demoWhere: "en tillverkad artikel under Artiklar och dess flik Kalkyl, eller Rapporter → Marginal",
    tagline: "Vet vad varje artikel kostar — före och efter.",
    seoTitle: "Förkalkyl och efterkalkyl för tillverkning",
    description:
      "Förkalkyl av självkostnad och försäljningspris ur struktur och rutt, med era egna påslag. Efterkalkylen visar vad tillverkningsordern faktiskt kostade.",
    intro:
      "Förkalkylen räknar fram självkostnad och försäljningspris ur artikelns struktur och rutt. Efterkalkylen visar vad tillverkningsordern faktiskt kostade, med verklig materialförbrukning och rapporterad tid. Skillnaden mellan dem är er lönsamhet.",
    screenshot: "article",
    gallery: [
      { shot: "kalkyl", caption: "Förkalkyler och efterkalkyler på artikelns flik Kalkyl." },
      { shot: "marginal", caption: "Marginalrapporten: täckningsbidrag och täckningsgrad per månad." },
    ],
    groups: [
      {
        id: "forkalkyl",
        title: "Förkalkyl",
        points: [
          "Materialkostnad från standardpris eller aktiv leverantörs pris, med staffelpris för kalkylantalet.",
          "Flernivåkalkyl: halvfabrikat räknas ur sin egen struktur och rutt.",
          "Varje kalkyl sparar inställningarna den kördes med — en gammal kalkyl går alltid att förstå.",
          "Sätt standardpris och Sätt försäljningspris för tillbaka en sparad kalkyl till artikeln.",
          "Kalkyloperationer: tid som prissätts i förkalkylen men aldrig följer med till tillverkningsordern.",
        ],
      },
      {
        id: "efterkalkyl",
        title: "Efterkalkyl",
        points: [
          "Egen materialkälla: standardpris, aktiv leverantörs pris eller verklig kostnad.",
          "Verklig materialkostnad: glidande medelpris vid förbrukningstillfället, härlett ur lagertransaktionerna.",
          "Standard- och leverantörspriser, och valutakursen, som de var när materialet togs ut — efterkalkylen ger samma svar om den görs om senare.",
          "Rapporterad tid gånger resursens timkostnad, med TO-påslag per resurs.",
          "Legoarbete som egen post med LO-påslag.",
        ],
      },
      {
        id: "paslag",
        title: "Påslag",
        points: [
          "MO-, LO- och Affo-påslag samt ett generellt påslag och ett materialpåslag, i procent med decimaler.",
          "TO-påslag per resurs — maskinen och handarbetet kostar olika.",
          "Panelen Så räknas försäljningspriset visar hela kedjan med ett räkneexempel.",
        ],
      },
      {
        id: "uppfoljning",
        title: "Uppföljning",
        points: [
          "Rapporterna Kalkylutfall och Marginal under Rapporter.",
          "Marginalrapporten visar täckningsbidrag per månad, kund eller artikel.",
          "Täckningsbidrag och täckningsgrad visas direkt på offert och kundorder, mot artikelns senaste förkalkyl.",
          "Alla rapporter kan exporteras till Excel (CSV).",
        ],
      },
    ],
    example: {
      title: "Exempel: en konsol från förkalkyl till efterkalkyl",
      intro: "Så går en artikel genom kalkyl, offert och tillverkning, och så hittar ni var avvikelsen uppstod.",
      steps: [
        "Under System → Kalkyler fyller ni i MO-, LO-, Affo-, generellt påslag och materialpåslag en gång. Timkostnad och TO-påslag sätter ni per resurs under Tillverkning → Resurser. Förkalkylen räknar materialet på standardpriset, och efterkalkylen med Verklig kostnad på vad materialet faktiskt kostade.",
        "Konsolen har en struktur med plåt och skruv och en rutt med laserskärning, bockning och svetsning. På artikelns flik Kalkyl skriver ni 50 i Antal att förkalkylera och klickar Förkalkylera. Panelen visar kedjan till försäljningspris, totalt och per styck.",
        "Klicka Spara kalkyl. I Kalkylspecifikation trycker ni Sätt försäljningspris, så blir kalkylens pris per styck artikelns försäljningspris.",
        "På offerten förifylls à-priset ur priskedjan, där artikelns försäljningspris gäller när kunden saknar egna priser och prislista. Under raderna visas täckningsbidrag och täckningsgrad mot förkalkylen, så ni ser vad en rabatt kostar.",
        "Kunden beställer och en tillverkningsorder på 50 st skapas. Personalen stämplar tid i stämpelterminalen. Vid bockningen kasseras 3 st, som görs om, och materialet som hör till bockningen dras för både godkända och kasserade enheter.",
        "När ordern är klar klickar ni Efterkalkylera på orderns detaljsida och sedan Spara kalkyl. Efterkalkylen räknar med verklig materialförbrukning och rapporterad tid.",
        "På artikelns flik Kalkyl ligger nu båda kalkylerna. Öppna dem i Kalkylspecifikation och jämför rad för rad: bockningen har fler timmar, plåten ett större antal på grund av kassationen och ett högre à-pris eftersom den köptes in dyrare än standardpriset. Orsaken till kassationen finns under Rapporter → Kassationsstatistik.",
      ],
    },
    limits: [
      "Påslagen gäller hela företaget. Bara TO-påslaget sätts per resurs, och det finns inga påslag per artikelgrupp, kund eller order.",
      "Omkostnaderna fördelas med procentuella påslag. Det finns ingen aktivitetsbaserad kalkyl.",
      "Det går inte att pröva andra påslag på en enskild artikel. Förkalkylen räknar alltid med inställningarna under System → Kalkyler.",
      "Det finns ännu ingen automatisk uppdelning av avvikelsen på pris, mängd och tid, och efterkalkylen skiljer inte på ställtid och stycktid.",
    ],
    faq: [
      {
        question: "Vad är en påläggskalkyl?",
        answer:
          "En påläggskalkyl räknar fram priset genom att lägga procentuella påslag på de direkta kostnaderna: material, lön och legoarbete. Påslagen MO och LO täcker material- och legoomkostnader och ger tillverkningskostnaden. Affo-påslaget för affärsomkostnader ger självkostnaden, och ett generellt påslag ger tillsammans med TO-påslaget (tillverkningsomkostnader) och materialpåslaget (på material + MO) försäljningspriset. TO- och materialpåslaget läggs sist på priset, utan vinstpåslag, och ingår inte i självkostnaden.",
      },
      {
        question: "Vilket materialpris använder kalkylen?",
        answer:
          "Det väljer ni under System → Kalkyler: artikelns standardkostnad, som är standardvalet, eller huvudleverantörens pris, med eller utan staffelpris. Ett leverantörspris i euro eller någon annan valuta räknas om till kronor med dagens kurs från Riksbanken. Saknas leverantörspris, eller kurs för valutan, används standardkostnaden och kalkylen varnar. Verklig kostnad gäller bara efterkalkylen och värderar materialet till glidande medelpris vid uttaget.",
      },
      {
        question: "Hur räknas halvfabrikat?",
        answer:
          "Normalt till sin standardkostnad. Kryssar ni i Räkna om underliggande nivåer räknas varje halvfabrikat ur sin egen struktur och rutt. Det kommer då in till sin tillverkningskostnad utan MO-påslag, så att Affo och det generella påslaget bara läggs på en gång.",
      },
      {
        question: "Vad händer med gamla kalkyler när priser eller påslag ändras?",
        answer:
          "Ingenting. En sparad kalkyl räknas aldrig om och visar vilka inställningar den kördes med. Ändringar gäller från nästa beräkning, så ni kör en ny förkalkyl på de artiklar som berörs.",
      },
      {
        question: "Kommer kassationer med i efterkalkylen?",
        answer:
          "Ja, men inte som en egen rad. Kasserade enheter förbrukar material och tid, och efterkalkylen räknar med allt som förbrukats och rapporterats. Kostnaden delas med orderns antal och blir därför högre per styck när enheter görs om.",
      },
      {
        question: "Kan vi exportera kalkylerna?",
        answer:
          "Rapporterna Kalkylutfall och Marginal kan exporteras som CSV för svensk Excel. Kalkylspecifikationen för en enskild kalkyl har ännu ingen export eller utskrift.",
      },
    ],
    manual: [
      { chapter: "system", anchor: "kalkyler", label: "Kalkylinställningar och påslag" },
      { chapter: "artiklar", anchor: "kalkyl", label: "Kalkyl på artikelkortet" },
      { chapter: "rapporter", anchor: "marginal", label: "Marginalrapporten" },
    ],
  },
  {
    slug: "personal-tid-lon",
    title: "Personal, tid och lön",
    icon: Clock,
    sources: [
      { label: "PAXml, standarden för löneunderlag", href: "https://www.paxml.se/" },
      { label: "Integritetsskyddsmyndigheten om dataskydd", href: "https://www.imy.se/verksamhet/dataskydd/" },
    ],
    demoWhere: "Tillverkning → Stämpelterminal och Tillverkning → Pågående arbete",
    tagline: "Stämpling i verkstaden, underlag till lönen.",
    seoTitle: "Stämpelterminal, tidrapportering och löneunderlag",
    description:
      "Närvaro- och orderstämpling på en delad skärm i verkstaden. Tiden går till tillverkningsordern och efterkalkylen och blir efter attest en PAXml-fil.",
    intro:
      "Personalen stämplar närvaro och arbete på en delad skärm i verkstaden. Tiden hamnar direkt på tillverkningsordern och i efterkalkylen, och samma underlag blir efter attest en PAXml-fil till lönesystemet.",
    screenshot: "terminal",
    gallery: [
      { shot: "pagaende-arbete", caption: "Pågående arbete: vem som är instämplad på vilken operation." },
      { shot: "veckoschema", caption: "ATF och inarbetning i veckoschemat: fredagen blir den korta dagen." },
      { shot: "attestering", caption: "Attesteringen per period med schema, arbetad tid, frånvaro och övertid." },
    ],
    groups: [
      {
        id: "terminal",
        title: "Stämpelterminalen",
        points: [
          "Helskärmsvy för en delad skärm i verkstaden — personalen identifierar sig med sitt anställningsnummer.",
          "Arbetslistan visar en operation per rad för den anställdes egna stationer — vad som är redo att börja, vad som brådskar och vilket material som behövs.",
          "Närvaro (kom/gå) och uttag av ATF. En glömd utstämpling fångas nästa gång personen stämplar in.",
          "Pågående arbete visar i realtid vem som är instämplad på vad, och vem som är frånvarande.",
          "Valfritt krav på anledning vid sen ankomst och tidig hemgång, och val mellan utbetald och sparad övertid vid Gå hem.",
        ],
      },
      {
        id: "tid",
        title: "Tid och scheman",
        points: [
          "Personalregister, veckoscheman och schema per anställd.",
          "ATF med tidbank eller veckouttag, och intjäning per vecka.",
          "ATF och inarbetning i veckoschemat: veckans sista arbetsdag blir den korta dagen, längre i veckor med helgdag eller sjukfrånvaro och flyttad till dagen före när den är röd.",
          "Tidrapporter per anställd.",
          "Dagsscheman med obetald rast och betald paus, och svenska helgdagar som läggs in med en knapp.",
        ],
      },
      {
        id: "lon",
        title: "Lön",
        points: [
          "Frånvaro registreras löpande, och OB räknas fram ur närvarostämplingarna.",
          "Övertid räknas per dag mot schemat, med tröskel och val mellan utbetalning och komptid.",
          "Arbetsledaren attesterar perioden, en administratör låser den och löneunderlaget exporteras som PAXml.",
          "Löneunderlaget delat på timlön och månadslön, som CSV eller PDF.",
        ],
      },
    ],
    example: {
      title: "Exempel: en vecka med stämpelterminalen",
      intro: "Så ser en vanlig vecka ut för en operatör, och så blir den ett löneunderlag när månaden är slut.",
      steps: [
        "Måndag morgon knappar operatören in sitt anställningsnummer i stämpelterminalen och trycker Stämpla in närvaro. Under Stämpla in på arbete kryssar operatören för svetsoperationen på en tillverkningsorder och trycker Starta valda.",
        "När arbetet är klart trycker operatören Stämpla ut och fyller i Antal OK och Kasserat, med kassationsorsak. Tiden blir en tidrapport på operationen och materialet dras från lagret.",
        "På tisdagen glöms Gå hem. På onsdagsmorgonen frågar terminalen när operatören gick, med tisdagens schemaslut förifyllt, och Spara och stämpla in rättar det.",
        "På torsdagen blir det sent, till 19.30. Tiden efter schemaslutet blir övertid om den är längre än er övertidströskel, och tiden inom ert OB-fönster för vardagskvällar blir OB. Ingen registrerar något för hand.",
        "På fredagen går operatören tidigare och väljer Ta ut ATF. Timmarna är förifyllda med dagens schemalagda tid och går att ändra. Uttaget dras från ATF-saldot och närvaron stämplas ut samtidigt.",
        "Efter månadsskiftet öppnar arbetsledaren Personal & lön → Attestering. Ofördelad tid står i rött och rättas under Detaljer, med Ändra på en stämpling eller Registrera frånvaro. Sedan trycker arbetsledaren Attestera.",
        "När alla är attesterade låser en administratör perioden med Lås period, och underlaget fryses. Under Personal & lön → Löneunderlag trycker arbetsledaren Exportera PAXml, och filen läses in i lönesystemet.",
      ],
    },
    limits: [
      "Nav|ERP är inte ett lönesystem. Det räknar inte ut lön, skatteavdrag eller arbetsgivaravgifter. PAXml-filen innehåller timmar per tidkod och dag, inte belopp.",
      "Nav|ERP för inget semestersaldo och inget kompsaldo. Semester och kompledighet registreras som frånvaro i timmar, och kompsaldot förs i lönesystemet.",
      "Det finns inga färdiga kollektivavtal att välja. OB-fönster, övertidströskel och tidkoder lägger ni upp själva.",
      "Det finns ingen koppling till passerkort eller RFID-brickor. Personalen identifierar sig med anställningsnumret.",
      "Det finns ingen mobilapp. Nav|ERP och stämpelterminalen används i webbläsaren.",
    ],
    faq: [
      {
        question: "Hur hanteras de anställdas personuppgifter?",
        answer:
          "De ligger på er egen server, och ert företag är personuppgiftsansvarigt. Personalregistret med personnummer och lön syns bara för administratörer och arbetsledare med behörigheten Personal & lön, och terminalen visar bara anställningsnummer och namn. Frånvaron kan omfatta sjukfrånvaro, som är en känslig uppgift. När en anställd har slutat kan en administratör radera uppgifterna, eller anonymisera dem när det finns tid och lön: namn, personnummer, kontaktuppgifter och kommentarer tas bort, och tiderna och de låsta löneunderlagen finns kvar under anställningsnumret.",
      },
      {
        question: "Vilka lönesystem kan läsa exporten?",
        answer:
          "De som kan läsa in löneunderlag i PAXml version 2.2. Filen har en tidtransaktion per anställd, dag och tidkod, med anställningsnummer och antal timmar. Stäm av tidkoderna mot lönesystemets löneartstabell innan första importen.",
      },
      {
        question: "Vad behöver stämpelterminalen för hårdvara?",
        answer:
          "En skärm och en dator med webbläsare som når er Nav|ERP-server. Terminalen körs under en vanlig inloggning, och varje person identifierar sig med sitt anställningsnummer. Sifferknappsatsen visas på skärmen, och en streckkodsläsare som skriver numret följt av Enter fungerar också.",
      },
      {
        question: "Kan flera stämpla på samma order, och en person på flera?",
        answer:
          "Ja, båda. Flera anställda kan vara instämplade på samma operation, och när den markeras klar stämplas de andra ut automatiskt. En anställd kan starta operationer från flera ordrar på en gång med Starta valda, och varje stämpling blir en egen tidrapport.",
      },
      {
        question: "Vad händer när någon glömmer att stämpla ut?",
        answer:
          "Har någon glömt Gå hem frågar terminalen efter tiden nästa gång personen knappar in sitt nummer. Ett arbete som står öppet kan arbetsledaren stämpla ut under Tillverkning → Pågående arbete, med den tid då arbetet slutade. En närvaro som fortfarande är öppen visas som Öppen närvaro i Attestering och måste rättas innan den anställde kan attesteras.",
      },
      {
        question: "Hur fungerar ATF?",
        answer:
          "ATF tjänas in med ett fast antal minuter per fullbordad arbetsvecka. Standarden sätts under System → Inställningar och kan ändras per anställd på personalkortet, där ni också väljer tidbank eller veckouttag. Uttag görs i terminalen eller på personalkortet och exporteras med en egen tidkod.",
      },
      {
        question: "Kan vi sluta tidigare på fredagar med ATF och inarbetad tid?",
        answer:
          "Ja. Slå på Tillåt ATF-uttag via schemat och ge veckoschemat ordinarie arbetstid och ATF per vecka. Båda räknas per arbetsdag, och veckans sista arbetsdag får det som återstår: en vecka med en röd onsdag gör fredagen lite längre, och är fredagen röd blir torsdagen den korta dagen. Sjukfrånvaro och vård av barn tjänar inte in ATF, så då blir sista dagen så mycket längre. Lönen, attesteringen och stämpelterminalen räknar med den uträknade dagen.",
      },
      {
        question: "Klarar Nav|ERP kollektivavtalets regler för OB och övertid?",
        answer:
          "Ni lägger själva upp reglerna. Ett OB-tillägg är ett tidsfönster per dagtyp (vardag, lördag, söndag eller helgdag) med egen tidkod, och OB räknas ut ur närvarostämplingarna. Övertid räknas per dag mot schemat, och arbete en dag utan schema blir övertid helg. Belopp och ersättningsnivåer sätts i lönesystemet.",
      },
    ],
    manual: [
      { chapter: "terminal", label: "Kapitlet Stämpelterminalen" },
      { chapter: "personal-tid", label: "Kapitlet Personal & tid" },
      { chapter: "personal-tid", anchor: "atf-arbetstidsforkortning", label: "ATF" },
      { chapter: "personal-tid", anchor: "atf-och-inarbetning-i-veckoschemat", label: "ATF och inarbetning i veckoschemat" },
      { chapter: "lon", label: "Kapitlet Lön & attestering" },
      { chapter: "lon", anchor: "paxml-export", label: "PAXml-export" },
    ],
  },
  {
    slug: "ekonomi",
    title: "Ekonomi",
    icon: Landmark,
    sources: [
      { label: "Bokföringslagen (1999:1078)", href: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/bokforingslag-19991078_sfs-1999-1078/" },
      { label: "Bokföringsnämnden", href: "https://www.bfn.se/" },
      { label: "BAS-kontoplanen", href: "https://www.bas.se/" },
      { label: "SIE-formatet", href: "https://sie.se/" },
    ],
    demoWhere: "Ekonomi → Verifikat, eller Ekonomi → Momsrapport för oktober 2026",
    tagline: "Bokföringen sköter sig själv där den kan.",
    seoTitle: "Bokföring, moms och SIE i affärssystemet",
    description:
      "Grundbokföring med kontoplan, verifikat och huvudbok. Fakturor, betalningar och moms bokförs automatiskt, med momsrapport och SIE-fil till revisorn.",
    intro:
      "Nav|ERP har en riktig grundbokföring: kontoplan, räkenskapsår, verifikat och huvudbok. Kund- och leverantörsfakturor, betalningar och momsomföring bokförs automatiskt, och revisorn får en SIE-fil.",
    screenshot: "momsrapport",
    gallery: [
      { shot: "verifikat", caption: "Fakturor och betalningar bokförs automatiskt i sina verifikatserier." },
      { shot: "kundreskontra", caption: "Kundreskontrans öppna poster." },
    ],
    groups: [
      {
        id: "bokforing",
        title: "Bokföring",
        points: [
          "Kontoplan, räkenskapsår med perioder, verifikat och huvudbok.",
          "Automatkontering av kund- och leverantörsfakturor, betalningar, påminnelseavgifter och momsomföring.",
          "Konteringsregler som styr vilka konton som används.",
        ],
      },
      {
        id: "rapporter",
        title: "Rapporter",
        points: [
          "Balansräkning och resultaträkning.",
          "Momsrapport med momsdeklarationens rutor per period.",
          "Leveransprecision samt försäljnings-, inköps- och kassationsstatistik.",
        ],
      },
      {
        id: "bokslut",
        title: "Bokslut och utbyte",
        points: [
          "Anläggningsregister som bokför planenliga avskrivningar och avyttringar.",
          "Bokslutsguide i sex steg som stänger räkenskapsåret.",
          "SIE typ 4-export till revisorn eller ett annat bokföringsprogram.",
          "Import av ingående balanser från en SIE-fil när ni flyttar in bokföringen från ett annat system.",
          "Bokslutsguiden stämmer av reskontran, anläggningsregistret och lagret mot huvudboken innan året stängs.",
        ],
      },
      {
        id: "bokforingslagen",
        title: "Bokföringslagen och arkivering",
        points: [
          "Ett bokfört verifikat får ett löpnummer och låses. Det kan inte ändras eller tas bort, bara rättas med en omföring. Spärren ligger i databasen och gäller även ändringar som inte görs i Nav|ERP.",
          "Kundfakturans PDF sparas när fakturan utfärdas, så en ny utskrift ser alltid ut som originalet. Leverantörens faktura och kvitton sparas som underlag med kontrollsumma och kan efter attest eller bokföring bara läggas till, aldrig tas bort.",
          "En låst period går inte att bokföra i. Den som låser upp den måste skriva en motivering, som sparas med vem som gjorde det. Händelseloggen visar vem som gjorde vad och när.",
          "Säkerhetskopieringen är utformad efter bokföringslagens krav på att räkenskapsinformation bevaras i sju år: en krypterad kopia utanför servern, där årsarkiven aldrig raderas och en provåterställning körs varje månad. Den sätts upp med ett skript på servern.",
          "Efter bokslutet lägger ett kommando räkenskapsårets SIE 4-fil och en full kopia av databasen i ett årsarkiv. SIE 4 är ett öppet standardformat som går att läsa även utan Nav|ERP.",
          "Ni väljer var kopian lagras. Huvudregeln är förvaring i Sverige. I ett annat EU-land krävs anmälan till Skatteverket, och utanför EU krävs tillstånd.",
        ],
      },
    ],
    example: {
      title: "Exempel: en månad i bokföringen",
      intro: "Det mesta bokförs medan ni arbetar, och i slutet av månaden återstår moms och låsning.",
      steps: [
        "När ni utfärdar en kundfaktura under Försäljning → Fakturor bokförs den i serie F. När ni godkänner en leverantörsfaktura under Inköp → Leverantörsfakturor bokförs den i serie L.",
        "Läs in bankens camt.054-fil under Försäljning → Bankfiler med Läs in bankfil. Inbetalningarna matchas mot öppna fakturor via OCR, och Bokför valda registrerar dem i serie K.",
        "Kryssa i leverantörsfakturorna under Inköp → Öppna poster och klicka Skapa betalfil. Exportera betalfil ger en pain.001-fil som ni laddar upp i internetbanken. När bankens debiteringsavi läses in under Inköp → Bankfiler bokförs utbetalningarna i serie U.",
        "Det som inte kommer från en faktura eller en bankfil bokför ni som ett verifikat under Ekonomi → Verifikat, med kvittot som underlag.",
        "Välj månaden under Ekonomi → Momsrapport och granska momsdeklarationens rutor. Bokför momsomföring flyttar momsen till konto 2650 i serie M. Beloppen lämnar ni i Skatteverkets e-tjänst.",
        "Lås månaden under Ekonomi → Räkenskapsår med Visa perioder och Lås period.",
        "Vid årets slut leder Ekonomi → Bokslut er genom sex steg, från kontroller och lagerförändring till att året stängs. Under Ekonomi → SIE-filer laddar ni sedan ner SIE 4-filen till revisorn.",
      ],
    },
    limits: [
      "Nav|ERP lämnar inte in momsdeklarationen. Ni laddar själva upp filen från Momsrapporten i Skatteverkets e-tjänst.",
      "En installation hanterar ett företag. Flera bolag och koncernredovisning finns inte.",
    ],
    faq: [
      {
        question: "Kan vi behålla vårt nuvarande bokföringsprogram?",
        answer:
          "Ja. Under Ekonomi → SIE-filer laddar ni ner en SIE 4-fil per räkenskapsår och läser in den i det andra programmet. Filen innehåller kontoplan, ingående och utgående saldon och alla bokförda verifikat, men inga utkast.",
      },
      {
        question: "Kan ett bokfört verifikat ändras?",
        answer:
          "Nej. Det rättas med Omför, som skapar ett nytt utkast med debet och kredit omvända rad för rad. Utkastet bokför ni separat, och de två verifikaten länkar till varandra.",
      },
      {
        question: "Hur hanteras öresutjämning?",
        answer:
          "En betalning som avviker från fakturan med högst er betalningstolerans stänger fakturan ändå, och skillnaden bokförs på kontot för öres- och kronutjämning. På en leverantörsfaktura bokförs skillnaden mellan nettobeloppet och radernas summa, till exempel frakt och öresavrundning, på standardkontot för kostnader.",
      },
      {
        question: "Vilken kontoplan används?",
        answer:
          "BAS-kontoplanen. Förifyll BAS-urval under Ekonomi → Kontoplan lägger in ett standardurval, och varje konto får sin momsruta. Ni kan lägga till egna konton och byta de standardkonton som automatkonteringen använder.",
      },
      {
        question: "Kan revisorn få läsbehörighet?",
        answer:
          "Inte som en ren läsroll, eftersom rättigheten Ekonomi ger rätt att ändra i hela modulen. Revisorn kan i stället få SIE 4-filen och verifikatlista, huvudbok, balansräkning och resultaträkning som PDF eller CSV.",
      },
      {
        question: "Är Nav|ERP redo för vår skarpa bokföring?",
        answer:
          "Inte än. Nav|ERP är en alfaversion och har ännu inte använts i skarp drift. Prova och utvärdera gärna, men använd det ännu inte för er skarpa bokföring. Funktioner kan ändras mellan versioner.",
      },
    ],
    manual: [
      { chapter: "ekonomi", label: "Kapitlet Ekonomi" },
      { chapter: "ekonomi", anchor: "automatkontering", label: "Automatkontering" },
      { chapter: "ekonomi", anchor: "sie-filer", label: "SIE-filer" },
      { chapter: "ekonomi", anchor: "anlaggningsregister", label: "Anläggningsregister" },
      { chapter: "drift-utveckling", anchor: "krypterad-extern-backup-bokforingslagen", label: "Backup och bokföringslagen" },
      { chapter: "rapporter", label: "Kapitlet Rapporter" },
    ],
  },
];

export function getArea(slug: string): FeatureArea | undefined {
  return FEATURE_AREAS.find((a) => a.slug === slug);
}

export function manualHref(ref: ManualRef): string {
  return `/hjalp/${ref.chapter}/${ref.anchor ? `#${ref.anchor}` : ""}`;
}

export interface HubSpoke {
  label: string;
  text: string;
  href: string;
}

// The hub on the start page: six spokes like the logo, clockwise from
// twelve o'clock, with the calculation in the centre — every cost ends up there.
export const HUB_SPOKES: HubSpoke[] = [
  { label: "Artiklar & lager", text: "Spårbart saldo", href: "/funktioner/lager-och-artiklar/" },
  { label: "Inköp", text: "Förfrågan till inleverans", href: "/funktioner/inkop-och-forsaljning/#inkop" },
  { label: "Tillverkning", text: "Order, beredning, beläggning", href: "/funktioner/tillverkning/" },
  { label: "Personal & tid", text: "Stämpling till lön", href: "/funktioner/personal-tid-lon/" },
  { label: "Försäljning", text: "Offert till faktura", href: "/funktioner/inkop-och-forsaljning/#forsaljning" },
  { label: "Ekonomi", text: "Bokföring och bokslut", href: "/funktioner/ekonomi/" },
];

export const HUB_CENTER: HubSpoke = { label: "Kalkyl", text: "Här landar allt", href: "/funktioner/kalkyl/" };
