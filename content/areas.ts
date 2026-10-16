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

export interface FeatureArea {
  slug: string;
  title: string;
  icon: LucideIcon;
  tagline: string;
  intro: string;
  screenshot?: ScreenshotKey;
  groups: FeatureGroup[];
  manual: ManualRef[];
}

export const FEATURE_AREAS: FeatureArea[] = [
  {
    slug: "tillverkning",
    title: "Tillverkning",
    icon: Factory,
    tagline: "Tillverkningsorder från frisläpp till efterkalkyl.",
    intro:
      "Tillverkningsordern hämtar struktur och rutt från artikelns beredning, drar material från lagret och samlar tid från verkstaden. När ordern är klar vet ni vad den faktiskt kostade.",
    screenshot: "manufacturing-orders",
    groups: [
      {
        id: "ordrar",
        title: "Tillverkningsorder",
        points: [
          "Flödet frisläppt → pågår → klar → stängd, med statusövergångar som kontrolleras i systemet.",
          "Materialförbrukning och tidrapportering mot ordern, med rapporteringslogg och möjlighet att ångra.",
          "Efterkalkyl per order: vad materialet och tiden faktiskt kostade.",
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
    manual: [
      { chapter: "tillverkning", label: "Kapitlet Tillverkning" },
      { chapter: "tillverkning", anchor: "behovsberakning", label: "Behovsberäkning" },
      { chapter: "tillverkning", anchor: "belaggning", label: "Beläggning" },
      { chapter: "terminal", label: "Stämpelterminalen" },
    ],
  },
  {
    slug: "lager-och-artiklar",
    title: "Lager och artiklar",
    icon: Boxes,
    tagline: "Artikeln är navet — saldot är alltid spårbart.",
    intro:
      "Allt i Nav|ERP utgår från artikeln: lager, inköp, försäljning, tillverkning och kalkyl. Lagret ändras aldrig utan en transaktion, så varje saldo går att följa bakåt till inleveransen, uttaget eller justeringen som skapade det.",
    screenshot: "article-overview",
    groups: [
      {
        id: "artiklar",
        title: "Artikelregistret",
        points: [
          "Artikelkort med flikarna Allmänt, Beredning, Lager, Kalkyl, Revisioner och Filer.",
          "Artikelgrupper, alternativa enheter och leverantörskatalog med staffelpriser.",
          "Import av artiklar, struktur och operationer från CSV — kom igång med data från ert gamla system.",
        ],
      },
      {
        id: "planering",
        title: "Planering per artikel",
        points: [
          "Artikelöversikten visar alla behov och allt inkommande i datumordning, med löpande disponibelt.",
          "Beställningspunkt, orderkvantitet och huvudleverantör med ledtid på samma ställe.",
          "Behovsberäkningen föreslår inköps- och tillverkningsordrar för alla artiklar på en gång.",
        ],
      },
      {
        id: "lager",
        title: "Lagret",
        points: [
          "Saldon per lagerplats och en fullständig transaktionslogg med källa, löpande saldo och vem som gjorde vad.",
          "Lagerflytt, justering och inventering per lagerplats — med möjlighet att spärra platsen medan ni räknar.",
          "Lagervärdering per valfritt datum: standardpris, senaste inköp eller vägt snitt.",
        ],
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
    tagline: "Från offert och förfrågan till faktura och betalning.",
    intro:
      "Hela affärsflödet åt båda hållen, med reskontra och bankfiler. Det ni säljer och köper hänger ihop med lager och tillverkning: en kundorder syns direkt som behov och en inleverans direkt som saldo.",
    screenshot: "dashboard",
    groups: [
      {
        id: "forsaljning",
        title: "Försäljning",
        points: [
          "Offert → kundorder → utleverans → faktura, med följesedel och kreditfaktura.",
          "Prislistor och kundpriser, med import av kunder och priser från CSV.",
          "Samlingsfakturering: en faktura per kund för alla levererade, ofakturerade rader.",
        ],
      },
      {
        id: "inkop",
        title: "Inköp",
        points: [
          "Prisförfrågan → inköpsorder → inleverans, med tillåten överleverans som inställning och möjlighet att ångra en inleverans.",
          "Leverantörer och inköpspriser med import från CSV.",
          "Leverantörsfakturor med attest, och inköpsdokument som skickas direkt via e-post.",
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
        ],
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
    tagline: "Vet vad varje artikel kostar — före och efter.",
    intro:
      "Förkalkylen räknar fram självkostnad och försäljningspris ur artikelns struktur och rutt. Efterkalkylen visar vad tillverkningsordern faktiskt kostade, med verklig materialförbrukning och rapporterad tid. Skillnaden mellan dem är er lönsamhet.",
    screenshot: "article",
    groups: [
      {
        id: "forkalkyl",
        title: "Förkalkyl",
        points: [
          "Materialkostnad från standardpris eller aktiv leverantörs pris, med staffelpris för kalkylantalet.",
          "Flernivåkalkyl: halvfabrikat räknas ur sin egen struktur och rutt.",
          "Varje kalkyl sparar inställningarna den kördes med — en gammal kalkyl går alltid att förstå.",
        ],
      },
      {
        id: "efterkalkyl",
        title: "Efterkalkyl",
        points: [
          "Verklig materialkostnad: glidande medelpris vid förbrukningstillfället, härlett ur lagertransaktionerna.",
          "Rapporterad tid gånger resursens timkostnad, med TO-påslag per resurs.",
          "Legoarbete som egen post med LO-påslag.",
        ],
      },
      {
        id: "paslag",
        title: "Påslag",
        points: [
          "MO-, LO- och Affo-påslag samt ett generellt påslag, i procent med decimaler.",
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
          "Alla rapporter kan exporteras till Excel (CSV).",
        ],
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
    tagline: "Stämpling i verkstaden, underlag till lönen.",
    intro:
      "Personalen stämplar närvaro och arbete på en delad skärm i verkstaden. Tiden hamnar direkt på tillverkningsordern och i efterkalkylen, och samma underlag blir efter attest en PAXml-fil till lönesystemet.",
    groups: [
      {
        id: "terminal",
        title: "Stämpelterminalen",
        points: [
          "Helskärmsvy för en delad skärm i verkstaden — personalen identifierar sig med sitt anställningsnummer.",
          "Arbetslistan visar en operation per rad för den anställdes egna stationer — vad som är redo att börja, vad som brådskar och vilket material som behövs.",
          "Närvaro (kom/gå) och uttag av ATF. En glömd utstämpling fångas nästa gång personen stämplar in.",
          "Pågående arbete visar i realtid vem som är instämplad på vad, och vem som är frånvarande.",
        ],
      },
      {
        id: "tid",
        title: "Tid och scheman",
        points: [
          "Personalregister, veckoscheman och schema per anställd.",
          "ATF med tidbank eller veckouttag, och intjäning per vecka.",
          "Tidrapporter per anställd.",
        ],
      },
      {
        id: "lon",
        title: "Lön",
        points: [
          "Frånvaro och OB registreras löpande.",
          "Övertid räknas per dag mot schemat, med tröskel och val mellan utbetalning och komptid.",
          "Arbetsledaren attesterar perioden, låser den och exporterar löneunderlaget som PAXml.",
        ],
      },
    ],
    manual: [
      { chapter: "terminal", label: "Kapitlet Stämpelterminalen" },
      { chapter: "personal-tid", label: "Kapitlet Personal & tid" },
      { chapter: "personal-tid", anchor: "atf-arbetstidsforkortning", label: "ATF" },
      { chapter: "lon", label: "Kapitlet Lön & attestering" },
      { chapter: "lon", anchor: "paxml-export", label: "PAXml-export" },
    ],
  },
  {
    slug: "ekonomi",
    title: "Ekonomi",
    icon: Landmark,
    tagline: "Bokföringen sköter sig själv där den kan.",
    intro:
      "Nav|ERP har en riktig grundbokföring: kontoplan, räkenskapsår, verifikat och huvudbok. Kund- och leverantörsfakturor, betalningar och momsomföring bokförs automatiskt, och revisorn får en SIE-fil.",
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
        ],
      },
    ],
    manual: [
      { chapter: "ekonomi", label: "Kapitlet Ekonomi" },
      { chapter: "ekonomi", anchor: "automatkontering", label: "Automatkontering" },
      { chapter: "ekonomi", anchor: "sie-filer", label: "SIE-filer" },
      { chapter: "ekonomi", anchor: "anlaggningsregister", label: "Anläggningsregister" },
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
