import { SITE } from "@/lib/site";

// Vanliga frågor (/fragor/), and a few of them on the start page. Every
// answer is backed by the manual, the README or the code — check before
// changing one. Shown as visible questions without FAQPage schema: Google no
// longer shows those results.
export interface Faq {
  /** Anchor on /fragor/, so an answer can be linked to. */
  id: string;
  question: string;
  answer: string;
  more?: { href: string; label: string };
}

export interface FaqGroup {
  title: string;
  items: Faq[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Om projektet",
    items: [
      {
        id: "redo-for-produktion",
        question: "Är Nav|ERP redo att användas i skarp drift?",
        answer:
          "Inte än. Nav|ERP är i alfa och har ännu inte använts i skarp drift. Datamodell, API och arbetsflöden kan ändras mellan versioner. Prova det med exempeldata eller era egna artiklar, men använd det ännu inte för riktig bokföring, lön eller fakturering.",
        more: { href: "/versioner/", label: "Vad som är nytt i varje version" },
      },
      {
        id: "vem",
        question: "Vem står bakom Nav|ERP?",
        answer:
          "Nav|ERP byggs av Urban Källefors, som arbetar med inköp, tillverkning, lager och kalkyl i ett tillverkande företag. Projektet är öppen källkod, och vem som helst kan läsa koden, rapportera fel och föreslå ändringar på GitHub.",
        more: { href: "/om/", label: "Om Nav|ERP" },
      },
      {
        id: "vad-kostar-det",
        question: "Vad kostar Nav|ERP?",
        answer:
          "Licensen kostar 0 kr för alla användare och alla delar av systemet. Det som kostar är en server, extern backup och tiden för installation och drift.",
        more: { href: "/gratis-affarssystem/", label: "Räkna på fem år" },
      },
      {
        id: "support",
        question: "Finns det support?",
        answer:
          "Det finns ingen betald support och inget serviceavtal från projektet. Frågor, fel och förslag tas upp som ärenden på GitHub. Vill ni ha någon som svarar på en viss tid anlitar ni en konsult som kan Docker och PostgreSQL.",
        more: { href: SITE.newIssueUrl, label: "Skapa ett ärende på GitHub" },
      },
      {
        id: "om-projektet-laggs-ner",
        question: "Vad händer om projektet läggs ner?",
        answer:
          "Systemet fortsätter att fungera på er server, och koden finns kvar under GPL-3.0, så ni eller någon ni anlitar kan rätta fel och bygga vidare. Datan ligger i en vanlig PostgreSQL-databas, och bokföringen går att ta ut som SIE 4-fil.",
        more: { href: "/oppen-kallkod/", label: "Vad GPL-3.0 betyder för er" },
      },
    ],
  },
  {
    title: "Data och drift",
    items: [
      {
        id: "var-lagras-data",
        question: "Var lagras vår data?",
        answer:
          "På er egen server, i en PostgreSQL-databas som bara ni når. Ingenting skickas till projektet. Nav|ERP kontaktar andra tjänster bara om ni själva ställer in det: en e-postserver för utskick, frakttjänsten Sendify och lagringen för den externa backupen.",
      },
      {
        id: "backup",
        question: "Hur tas backup?",
        answer:
          "Ett skript dumpar databasen varje natt och sparar dumparna i 30 dagar. En administratör kan också ladda ner en färsk kopia under System → Säkerhetskopiering. För skydd mot en trasig disk eller en stöld finns en krypterad kopia utanför servern, med årsarkiv som aldrig raderas och en provåterställning varje månad. Backupen omfattar allt, även ritningar, underlag och arkiverade fakturor.",
        more: { href: "/hjalp/drift-utveckling/#backup", label: "Backup i manualen" },
      },
      {
        id: "server",
        question: "Vad behöver servern?",
        answer:
          "En Linux-server med Docker, antingen en hyrd virtuell server eller en maskin i ert eget nätverk. 2 GB minne och 20 GB disk räcker. Användarna behöver bara en webbläsare.",
        more: { href: "/kom-igang/#krav", label: "Uppmätta krav och installationen" },
      },
      {
        id: "uppdatera",
        question: "Hur uppdaterar vi till en ny version?",
        answer:
          "Med tre kommandon: hämta koden med git, bygg om och starta. Databasen uppdateras automatiskt när API:et startar. Läs först avsnittet Kräver åtgärd för versionen, där står det som behöver göras för hand eller ändrar siffror ni redan har.",
        more: { href: "/versioner/", label: "Versioner" },
      },
      {
        id: "mobil",
        question: "Fungerar Nav|ERP på mobilen?",
        answer:
          "Ja, i webbläsaren. Gränssnittet är anpassat för mobil och surfplatta, men det finns ingen app att installera. Stämpelterminalen är gjord för en delad skärm i verkstaden.",
      },
    ],
  },
  {
    title: "Införande",
    items: [
      {
        id: "flytta-in-data",
        question: "Kan vi flytta in data från vårt gamla system?",
        answer:
          "Ja, från CSV- och xlsx-filer: artiklar med alternativa enheter, struktur och operationer, kunder och leverantörer med kontakter och leveransadresser, resurser och produktionsgrupper, inköpspriser och kundpriser. Bokföringens ingående balanser läses in från en SIE-fil. Lagersaldon läggs in med en inventering, och öppna ordrar och personal läggs upp för hand.",
        more: { href: "/hjalp/artiklar/#importera-alla-filer", label: "Import i manualen" },
      },
      {
        id: "prova",
        question: "Kan vi prova utan att lägga in egna data?",
        answer:
          "Ja. Enklast är demon på demo.naverp.se, ett påhittat företag med ordrar, planering och bokföring, där ni loggar in med ett konto som bara kan läsa. På en egen installation skapar System → Exempeldata samma påhittade företag, och där kan ni lägga en kundorder och följa flödet hela vägen.",
        more: { href: "/kom-igang/#demo", label: "Inloggningen till demon" },
      },
      {
        id: "anvandare",
        question: "Hur många användare kan vi ha, och vad får de se?",
        answer:
          "Hur många som helst. En administratör styr med behörighetsgrupper vilka delar av systemet varje användare kommer åt, till exempel Ekonomi. Administratörer har alltid tillgång till allt.",
      },
      {
        id: "integrationer",
        question: "Kan Nav|ERP kopplas till andra system?",
        answer:
          "Ja, genom API:t, där externa system loggar in med egna API-klienter och bara får de rättigheter ni ger dem, till exempel en produktkonfigurator som lägger offerter. Ett tillägg kan dessutom få händelser som webhooks och visa egna sidor och flikar i Nav|ERP. Dessutom kan Nav|ERP läsa och skriva standardfiler: SIE 4 till revisorn, PAXml till lönesystemet och bankens filer för in- och utbetalningar.",
        more: { href: "/hjalp/system/#integrationer", label: "Integrationer i manualen" },
      },
    ],
  },
  {
    title: "Säkerhet och personuppgifter",
    items: [
      {
        id: "sakerhet",
        question: "Hur skyddas systemet?",
        answer:
          "Varje användare loggar in med eget konto, behörighetsgrupperna begränsar vad var och en ser, och händelseloggen visar vem som gjort vad. Databasen och API:et lyssnar bara på servern själv. Lägg en omvänd proxy med HTTPS framför webben. Tvåfaktorsinloggning finns ännu inte.",
        more: { href: "/kom-igang/", label: "Installationen steg för steg" },
      },
      {
        id: "personuppgifter",
        question: "Vilka personuppgifter lagrar Nav|ERP, och vem ansvarar för dem?",
        answer:
          "Personalregistret har namn, kontaktuppgifter, personnummer, lön och anställningsform. Dessutom lagras stämplingar, tidrapporter och frånvaro, och frånvaron kan omfatta sjukfrånvaro, som är en känslig uppgift. Kunders och leverantörers kontaktpersoner och användarnas e-postadresser finns också. Allt ligger på er egen server, så det är ert företag som är personuppgiftsansvarigt. Personalregistret syns bara för administratörer och för arbetsledare med behörigheten Tillverkning. En anställd kan markeras som inaktiv, men det finns ännu ingen funktion för att radera eller anonymisera en anställds uppgifter.",
        more: { href: "/hjalp/personal-tid/", label: "Personalregistret i manualen" },
      },
      {
        id: "sakerhetsbrist",
        question: "Hur rapporterar vi en säkerhetsbrist?",
        answer:
          "Privat via GitHub, aldrig i ett öppet ärende. Då kan bristen rättas innan den blir känd.",
        more: { href: SITE.securityUrl, label: "Rapportera privat" },
      },
    ],
  },
];

/** The questions shown on the start page, in order. */
export const HOME_FAQ_IDS = ["redo-for-produktion", "vad-kostar-det", "var-lagras-data", "flytta-in-data"] as const;

export function getFaq(id: string): Faq | undefined {
  return FAQ_GROUPS.flatMap((g) => g.items).find((f) => f.id === id);
}
