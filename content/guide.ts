// The guide on /affarssystem-for-tillverkning/: what an ERP for a small
// manufacturer has to handle, as a checklist, with Nav|ERP's own status after
// each point. No other product is named (site rule). Every status is backed by
// the manual or a feature page's "Det här saknas i dag" — check before changing.
export type GuideStatus = "ja" | "delvis" | "saknas";

export interface GuideItem {
  id: string;
  question: string;
  /** What to demand of any system, in plain terms. */
  demand: string;
  status: GuideStatus;
  /** Nav|ERP's honest answer. */
  navErp: string;
  more?: { href: string; label: string };
}

export interface GuideGroup {
  title: string;
  items: GuideItem[];
}

export const STATUS_LABELS: Record<GuideStatus, string> = { ja: "Finns", delvis: "Delvis", saknas: "Saknas" };

export const GUIDE: GuideGroup[] = [
  {
    title: "Artiklar och beredning",
    items: [
      {
        id: "struktur-och-rutt",
        question: "Hanterar det struktur och rutt?",
        demand:
          "Varje tillverkad artikel behöver en struktur med material och halvfabrikat och en rutt med operationer, ställtid och tid per enhet på en resurs. Det är grunden för kalkyl, planering och materialuttag, så den ska gå att bygga och ändra utan krångel.",
        status: "ja",
        navErp:
          "Struktur och rutt ligger på samma flik i artikelkortet, och material kan kopplas till den operation där det går åt. Strukturer och operationer går att importera från CSV.",
        more: { href: "/funktioner/tillverkning/", label: "Tillverkning" },
      },
      {
        id: "ritningar",
        question: "Följer ritningar och revisioner med?",
        demand:
          "Verkstaden ska tillverka efter rätt revision. Ritningen bör ligga på artikeln och följa med offerten och tillverkningsordern.",
        status: "ja",
        navErp:
          "Artikeln har revisioner med ritningsnummer och en aktiv revision i taget. Ritningar laddas upp på artikeln och följer med utskicket av offerten och utskriften av tillverkningsordern.",
        more: { href: "/funktioner/lager-och-artiklar/", label: "Lager och artiklar" },
      },
      {
        id: "konfigurerade-produkter",
        question: "Klarar det produkter som konfigureras per order?",
        demand:
          "Säljer ni varianter eller produkter som byggs efter kundens val behöver systemet regler för valen, ett pris per konfiguration och en tillverkningsorder med rätt struktur.",
        status: "ja",
        navErp:
          "En tillverkad artikel kan bli en mall i konfiguratorn, antingen för lagerförda variantartiklar eller för en beställningsvara som konfigureras på orderraden och tillverkas mot ordern.",
        more: { href: "/hjalp/artiklar/#konfigurator", label: "Konfiguratorn i manualen" },
      },
    ],
  },
  {
    title: "Kalkyl",
    items: [
      {
        id: "forkalkyl",
        question: "Räknar det fram självkostnad och pris?",
        demand:
          "Förkalkylen ska räkna material, lön och lego ur struktur och rutt och lägga på era egna omkostnadspåslag, så att offertpriset bygger på verkliga tider och inte på en känsla.",
        status: "ja",
        navErp:
          "Förkalkylen är en påläggskalkyl med MO-, TO-, LO-, Affo- och generellt påslag, och halvfabrikat kan räknas ur sin egen struktur och rutt.",
        more: { href: "/verktyg/paslagskalkyl/", label: "Prova påläggskalkylen" },
      },
      {
        id: "efterkalkyl",
        question: "Visar det vad ordern faktiskt kostade?",
        demand:
          "Efterkalkylen ska bygga på verklig materialförbrukning och rapporterad tid, inklusive kassationer, så att ni ser var avvikelsen uppstod.",
        status: "ja",
        navErp:
          "Efterkalkylen räknar verklig förbrukning till glidande medelpris och rapporterad tid gånger resursens timkostnad, och Kalkylutfall jämför den med förkalkylen per styck.",
        more: { href: "/funktioner/kalkyl/", label: "Kalkyl" },
      },
    ],
  },
  {
    title: "Planering och verkstad",
    items: [
      {
        id: "behovsberakning",
        question: "Räknar det ut vad som ska köpas och tillverkas?",
        demand:
          "Behovsberäkningen ska gå igenom kundordrar, lager och inkommande och föreslå inköps- och tillverkningsordrar, med hänsyn till beställningspunkt, ledtid och förpackningsstorlek.",
        status: "delvis",
        navErp:
          "Behovsberäkningen föreslår ordrar för alla artiklar på en gång, med beställningspunkt, orderkvantitet och avrundning. Förslagen är inte tidsfasade: datumen sätts när ordrarna skapas.",
        more: { href: "/hjalp/tillverkning/#behovsberakning", label: "Behovsberäkning i manualen" },
      },
      {
        id: "belaggning",
        question: "Ser ni beläggningen på maskiner och personal?",
        demand:
          "Ni behöver se last mot tillgänglig tid per resurs, så att ni kan lova leveranstider som håller och se flaskhalsen innan den blir ett problem.",
        status: "delvis",
        navErp:
          "Beläggningen visas per resurs och vecka, operationer planeras på ledig tid och kan flyttas och låsas, och Leveranstidskontrollen räknar fram ett leveransdatum. Det finns ingen detaljplanering per dag eller timme.",
        more: { href: "/funktioner/tillverkning/", label: "Tillverkning" },
      },
      {
        id: "stampling",
        question: "Kommer tiden från verkstaden in i systemet?",
        demand:
          "Tiden ska registreras där arbetet görs och hamna direkt på ordern, annars blir efterkalkylen en gissning och löneunderlaget dubbelarbete.",
        status: "ja",
        navErp:
          "Stämpelterminalen på en delad skärm registrerar närvaro och arbete på operationerna, med antal och kassationer. Samma tid blir efterkalkyl och, efter attest, en PAXml-fil till lönesystemet.",
        more: { href: "/funktioner/personal-tid-lon/", label: "Personal, tid och lön" },
      },
      {
        id: "lego",
        question: "Hanterar det legoarbete?",
        demand:
          "Ytbehandling, härdning och annat som görs hos en underleverantör ska vara en operation i rutten, med inköp, pris och ledtid, och komma med i kalkylen.",
        status: "ja",
        navErp:
          "Legoarbete är egna operationer på legoresurser med leverantör, ställ- och styckpris. Behovsberäkningen föreslår legoinköpen, och efterkalkylen tar den verkliga kostnaden från inköpsordern.",
      },
      {
        id: "kvalitet",
        question: "Följer det upp kassation och kvalitet?",
        demand:
          "Kassationer ska registreras med orsak när de uppstår, så att ni ser vilka artiklar, resurser och orsaker som kostar mest.",
        status: "delvis",
        navErp:
          "Kassationer rapporteras med obligatorisk orsak och summeras i rapporten Kassationsstatistik. Det finns ingen separat funktion för avvikelserapporter eller reklamationer.",
      },
    ],
  },
  {
    title: "Lager, inköp och försäljning",
    items: [
      {
        id: "sparbart-lager",
        question: "Går varje saldo att följa bakåt?",
        demand:
          "Saldot ska bara ändras genom transaktioner, så att ni kan se vad som orsakade en differens. Spårbarhet på batch- eller serienummer kan vara ett krav i er bransch.",
        status: "delvis",
        navErp:
          "Lagret ändras bara genom transaktioner, med källa, löpande saldo och vem som gjorde vad. Spårbarhet på batch- eller serienummer finns ännu inte.",
        more: { href: "/funktioner/lager-och-artiklar/", label: "Lager och artiklar" },
      },
      {
        id: "orderflode",
        question: "Hänger offert, order, leverans och faktura ihop?",
        demand:
          "En kundorder ska bli behov i planeringen direkt, och leveransen ska kunna faktureras utan att något knappas in igen. Samma sak åt andra hållet för inköp.",
        status: "ja",
        navErp:
          "Offert, kundorder, utleverans och faktura hänger ihop, liksom förfrågan, inköpsorder, inleverans och leverantörsfaktura. Fakturor skickas som PDF med e-post eller som e-faktura via Peppol till svenska företagskunder. EDI finns inte.",
        more: { href: "/funktioner/inkop-och-forsaljning/", label: "Inköp och försäljning" },
      },
    ],
  },
  {
    title: "Ekonomi och svenska krav",
    items: [
      {
        id: "bokforing",
        question: "Klarar det svensk bokföring?",
        demand:
          "Fakturor och betalningar ska bokföras automatiskt, momsrapporten ska ge momsdeklarationens rutor, och bokföringen ska gå att lämna till revisorn som SIE-fil. Bokförda verifikat ska inte gå att ändra, bara rätta.",
        status: "ja",
        navErp:
          "Grundbokföring med BAS-kontoplan, automatkontering, momsrapport, bokslutsguide och SIE 4-export. Bokförda verifikat är spärrade i databasen och rättas med omföring. Systemet är i alfa och ännu inte prövat i skarp bokföring.",
        more: { href: "/funktioner/ekonomi/", label: "Ekonomi" },
      },
      {
        id: "bank-och-lon",
        question: "Pratar det med banken och lönesystemet?",
        demand:
          "Inbetalningar bör kunna läsas in och matchas mot fakturor, leverantörsbetalningar skapas som fil till banken, och löneunderlaget gå över till lönesystemet utan att skrivas av.",
        status: "ja",
        navErp:
          "Nav|ERP läser bankens inbetalningsfil (camt.054), skapar betalfiler (pain.001) och exporterar löneunderlaget som PAXml. Själva lönen räknas i lönesystemet.",
      },
    ],
  },
  {
    title: "Drift och kostnad",
    items: [
      {
        id: "drift",
        question: "Var körs det, och vem äger datan?",
        demand:
          "Ta reda på var datan lagras, hur backupen görs och hur ni tar ut datan om ni vill byta system. Det avgör hur bundna ni blir.",
        status: "ja",
        navErp:
          "Nav|ERP körs på er egen server med Docker och PostgreSQL, med skript för nattlig backup och en krypterad kopia utanför servern. Datan går att ta ut som CSV och SIE 4.",
        more: { href: "/kom-igang/", label: "Kom igång" },
      },
      {
        id: "kostnad",
        question: "Vad kostar det över fem år?",
        demand:
          "Räkna licenser, drift, införande och support över flera år, inte bara startkostnaden. Licenser per användare växer med företaget.",
        status: "ja",
        navErp:
          "Licensen kostar 0 kr för alla användare. Det som kostar är server, backup och tid. Det finns ingen betald support från projektet.",
        more: { href: "/gratis-affarssystem/", label: "Räkna på fem år" },
      },
    ],
  },
];
