// Search titles and meta descriptions for the manual chapters. The chapter list
// itself is synced from the app, whose short descriptions suit the in-app help
// but are too thin for a search result — so the site keeps its own here.
export const MANUAL_META: Record<string, { title: string; description: string }> = {
  "komma-igang": {
    title: "Komma igång: inloggning och navigering",
    description:
      "Så loggar du in i Nav|ERP och hittar i menyerna, översikten och listorna: sökning, filter och bläddring, artikelväljaren och de vanliga knapparna.",
  },
  artiklar: {
    title: "Artiklar, artikelstruktur och import",
    description:
      "Artikelregistret och artikelkortet, artikelöversikten, artikelgrupper och import av artiklar, alternativa enheter, strukturer och operationer från CSV.",
  },
  grunddata: {
    title: "Grunddata: villkor, speditörer, enheter",
    description:
      "Leveransvillkor, betalningsvillkor, speditörer, enheter och kollityper i Nav|ERP – och hur de används på order, fakturor och frakt.",
  },
  importmallar: {
    title: "Importmallar i Excel",
    description:
      "Excelmallar för alla importer i Nav|ERP – artiklar, struktur, operationer, kunder, leverantörer, priser och resurser – med förklaring och exempel per kolumn.",
  },
  tillagg: {
    title: "Tillägg: webhooks, sidor och flikar",
    description:
      "Så installeras och hanteras tillägg i Nav|ERP – API-nyckel, rättigheter, signerade webhooks, egna sidor och flikar – och hur man bygger ett eget tillägg.",
  },
  aviseringar: {
    title: "Aviseringar: det som behöver åtgärdas",
    description:
      "Försenade ordrar, negativa saldon, förfallna fakturor och misslyckade utskick samlade på ett ställe i Nav|ERP, plus den dagliga sammanställningen via e-post.",
  },
  "personal-tid": {
    title: "Personal, scheman och tidrapporter",
    description:
      "Personalregistret, arbetsscheman per anställd, ATF (arbetstidsförkortning) och tidrapporter – underlaget för stämpling, efterkalkyl och lön.",
  },
  inkop: {
    title: "Inköp: order, inleverans och fakturor",
    description:
      "Leverantörer, prisförfrågningar, inköpsorder och inleverans, fakturaunderlag och leverantörsfakturor, reskontra och betalfiler – med import från CSV.",
  },
  forsaljning: {
    title: "Försäljning: order, leverans och faktura",
    description:
      "Kunder och prislistor, offert och kundorder, leveranstidskontroll, utleverans och frakt, fakturor och samlingsfakturering, kundreskontra och bankfiler.",
  },
  tillverkning: {
    title: "Tillverkningsorder och planering",
    description:
      "Resurser och produktionsgrupper, tillverkningsorder, behovsberäkning, beläggning och planering per vecka, pågående arbete och tidrapporter.",
  },
  terminal: {
    title: "Stämpelterminalen i verkstaden",
    description:
      "Så stämplar personalen i Nav|ERP:s stämpelterminal: identifiera sig, stämpla närvaro (kom/gå), stämpla på tillverkningsorder och ta ut ATF.",
  },
  lon: {
    title: "Lön: attestering och PAXml-export",
    description:
      "Lönekoder, frånvaro, övertid och attestering av tid i Nav|ERP, och hur löneunderlaget exporteras som en PAXml-fil till lönesystemet.",
  },
  lager: {
    title: "Lager: saldon, inventering, värdering",
    description:
      "Hur saldot fungerar, transaktionsloggen, lagerplatser och lagerflytt, inventering, justeringar och lagervärdering – varje saldo går att spåra bakåt.",
  },
  ekonomi: {
    title: "Bokföring: verifikat, moms och bokslut",
    description:
      "Kontoplan, räkenskapsår, verifikat och huvudbok, balans- och resultaträkning, momsrapport, SIE-filer, anläggningsregister, årsbokslut och automatkontering.",
  },
  rapporter: {
    title: "Rapporter och statistik",
    description:
      "Leveransprecision, försäljnings- och inköpsstatistik, kassation, kalkylutfall, marginal och lagervärde – och hur rapporterna exporteras till Excel (CSV).",
  },
  system: {
    title: "Användare, behörigheter och inställningar",
    description:
      "Användare och behörighetsgrupper, företagsinformation, nummerserier, bank, e-post, integrationer, exempeldata, säkerhetskopiering och händelseloggen.",
  },
  "drift-utveckling": {
    title: "Drift och utveckling: backup och tester",
    description:
      "Projektstrukturen, testkörning, backup och återställning, Nav|ERP på Windows och de kända tekniska begränsningarna – för den som driftar eller utvecklar.",
  },
};
