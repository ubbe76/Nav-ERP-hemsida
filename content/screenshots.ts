// Alt text per screenshot key (see lib/screenshots.ts for the file naming).
export const SCREENSHOTS = {
  dashboard:
    "Översikten i Nav|ERP: öppna inköps-, tillverknings- och försäljningsordrar, sådant att bevaka, pågående tillverkning och senaste lagerhändelser.",
  article:
    "Artikelkortets flik Beredning: artikelträdet med komponenter till vänster och rutten med operationer, ställtid och tid per enhet till höger.",
  "article-overview":
    "Artikelöversikten: lagersaldo, beställningspunkt och huvudleverantör, och därunder alla behov och allt inkommande i datumordning med löpande disponibelt.",
  "manufacturing-orders": "Listan över tillverkningsordrar med artikel, antal, färdigdatum och status.",
  belaggning:
    "Beläggningen per resurs och vecka: planerade timmar mot tillgänglig tid, där laserskärningen är överbelagd vecka 43 och markeras röd.",
  "pagaende-arbete":
    "Pågående arbete: vilka anställda som är instämplade på vilken tillverkningsorder och operation, och vem som är på plats utan arbete.",
  behovsberakning:
    "Behovsberäkningen: saldo, behov, inkommande och nettobehov per artikel, med förslag på inköp från huvudleverantören.",
  "lager-transaktioner":
    "Lagrets transaktionslogg: varje rörelse med datum, artikel, lagerplats, typ, mängd och källa, till exempel kundleverans eller materialförbrukning.",
  "lager-saldon": "Saldon per artikel, lager och lagerplats.",
  kundorder:
    "Ett kundorderkort med kund, leveransdatum och orderrader, där varje rad visar sin tillverkningsorder.",
  faktura:
    "En betald kundfaktura med OCR-nummer, fakturarader, moms och den registrerade betalningen med sitt verifikat.",
  inkopsordrar: "Listan över inköpsordrar med leverantör, status som Bekräftad eller Delvis mottagen och leveransdatum.",
  kalkyl:
    "Artikelkortets flik Kalkyl: sparade förkalkyler och efterkalkyler med material, lön, självkostnad, styckpris och försäljningspris.",
  marginal: "Marginalrapporten: nettoomsättning, självkostnad, täckningsbidrag och täckningsgrad per månad.",
  terminal: "Stämpelterminalen: en sifferknappsats för anställningsnumret och en rad som visar vilka som är närvarande.",
  momsrapport:
    "Momsrapporten för oktober med momsdeklarationens rutor: momspliktig försäljning, utgående moms och ingående moms.",
  verifikat: "Verifikatlistan med automatiskt bokförda kundfakturor, betalningar och leverantörsfakturor i sina serier.",
  kundreskontra: "Kundreskontrans öppna poster med faktura, kund, förfallodatum och öppet belopp.",
} as const;

export type ScreenshotKey = keyof typeof SCREENSHOTS;
