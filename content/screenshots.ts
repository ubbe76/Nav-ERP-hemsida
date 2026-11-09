// Alt text per screenshot key (see lib/screenshots.ts for the file naming).
export const SCREENSHOTS = {
  dashboard:
    "Översikten i Nav|ERP: öppna inköps-, tillverknings- och försäljningsordrar, sådant att bevaka, pågående tillverkning och senaste lagerhändelser.",
  article:
    "Artikelkortets flik Beredning: artikelträdet med komponenter till vänster, och till höger ritningen med sin aktiva revision och rutten med operationer, ställtid och tid per enhet.",
  "article-overview":
    "Artikelöversikten: lagersaldo, beställningspunkt och huvudleverantör, och därunder alla behov och allt inkommande i datumordning med löpande disponibelt.",
  "manufacturing-orders": "Listan över tillverkningsordrar med artikel, antal, färdigdatum och status.",
  belaggning:
    "Beläggningen per resurs och vecka: planerade timmar mot tillgänglig tid, där svetsningen är överbelagd vecka 49 och markeras röd.",
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
  inkopsordrar:
    "Listan över inköpsordrar med leverantör, status som Utkast, Bekräftad, Mottagen eller Delvis mottagen och leveransdatum.",
  kalkyl:
    "Artikelkortets flik Kalkyl: sparade förkalkyler och efterkalkyler med material, lön, självkostnad, styckpris och försäljningspris.",
  marginal: "Marginalrapporten: nettoomsättning, självkostnad, täckningsbidrag och täckningsgrad per månad.",
  terminal: "Stämpelterminalen: en sifferknappsats för anställningsnumret och en rad som visar vilka som är närvarande.",
  momsrapport:
    "Momsrapporten för tredje kvartalet med momsdeklarationens rutor, här momspliktig försäljning och utgående moms.",
  verifikat: "Verifikatlistan med automatiskt bokförda kundfakturor, betalningar och leverantörsfakturor i sina serier.",
  kundreskontra: "Kundreskontrans öppna poster med faktura, kund, förfallodatum och öppet belopp.",
  offertuppfoljning:
    "Offertuppföljningen: antal och värde för vunna, förlorade och öppna offerter, hit rate i antal och värde, och samma siffror per kund.",
  fakturagranskning:
    "En leverantörsfaktura i fakturainkorgen: originalet till vänster och de tolkade uppgifterna till höger, matchade mot leverantören och en delvis mottagen inköpsorder.",
  reklamation: "En kundreklamation under utredning med rubrik, orsak, ansvarig, sista åtgärdsdatum och kund.",
  veckoschema:
    "Ett veckoschema med 40 timmars ordinarie arbetstid och 60 minuter ATF per vecka: fredagen blir den korta dagen, och en vecka med helgdag på fredag får den korta dagen på torsdagen.",
  attestering:
    "Attesteringen för oktober: schema, arbetad tid, frånvaro och övertid per anställd, avvikelser och vilka som är attesterade.",
  arbetskort:
    "Arbetskortet, en utskriven tillverkningsorder med operationer, instruktioner, packning och material att signera.",
  flikar:
    "Dokument i flikar: en tillverkningsorder, en artikel, en faktura och en kundorder öppna samtidigt i flikraden, med kundordern framme.",
  "delad-vy":
    "Delad vy: listan över tillverkningsordrar till vänster och den öppna tillverkningsordern med material och behov till höger.",
  sok: "Sök eller gå till (Ctrl+K): sökningen arbetsbord hittar offerter, tillverkningsordrar och artiklar.",
  kolumner:
    "Kolumnvalet i kundorderlistan: kolumner som visas eller döljs och flyttas upp och ned, och bredden dras i rubriken.",
  pallkort:
    "Ett pallkort till kund med artikelnummer, antal, kolli, kund och ordernummer, och streckkoder för artikel och order.",
} as const;

export type ScreenshotKey = keyof typeof SCREENSHOTS;
