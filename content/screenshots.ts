// Alt text per screenshot key (see lib/screenshots.ts for the file naming).
export const SCREENSHOTS = {
  dashboard:
    "Översikten i Nav|ERP: öppna inköps-, tillverknings- och försäljningsordrar, sådant att bevaka, pågående tillverkning och senaste lagerhändelser.",
  article:
    "Artikelkortets flik Beredning: artikelträdet med komponenter till vänster och rutten med operationer, ställtid och tid per enhet till höger.",
  "article-overview":
    "Artikelöversikten: lagersaldo, beställningspunkt och huvudleverantör, och därunder alla behov och allt inkommande i datumordning med löpande disponibelt.",
  "manufacturing-orders": "Listan över tillverkningsordrar med artikel, antal, färdigdatum och status.",
} as const;

export type ScreenshotKey = keyof typeof SCREENSHOTS;
