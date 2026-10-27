// Release notes, newest first. One entry per tagged version of Nav|ERP.
// `breaking` lists what needs action when updating, or changes numbers an
// installation already shows — it is rendered first and highlighted.
export interface Release {
  version: string;
  date: string; // YYYY-MM-DD
  summary: string;
  breaking: string[];
  added: string[];
  changed: string[];
}

export const RELEASES: Release[] = [
  {
    version: "0.6.0-alpha",
    date: "2026-10-27",
    summary:
      "Bokföringen blir komplett med momskoder och hela momsdeklarationen, fakturor och betalningar i utländsk valuta, bankavstämning, kostnadsställen och projekt, budget och räntefakturering. Leverantörsfakturor tolkas i en ny Fakturainkorg, reklamationer och avvikelser har fått menyn Kvalitet, och momssatsen följer nu artikelns varugrupp.",
    breaking: [
      "Migrationerna 0142–0165 körs automatiskt när API:et startar. Flera av dem flyttar data (se nedan), så ta en säkerhetskopia först. Ingen ändring i `.env` behövs.",
      "Artikeln har ingen egen momssats längre — den följer varugruppen (Artikelgrupp heter nu Varugrupp). Migration 0155 ger varje varugrupp den momssats som är vanligast bland dess artiklar (vid lika många vinner den högre, en tom grupp får 25 %), och 0156 tar bort artikelns egen sats. En artikel med en annan sats än gruppen, eller utan varugrupp och med en annan sats än 25 %, byter alltså momssats. Kör den här kontrollen före uppdateringen för att se vilka det gäller, och flytta dem efteråt till en varugrupp med rätt Momssats: `docker compose exec postgres psql -U erp -d erp -c 'SELECT a.article_number, a.vat_rate, coalesce(g.rate, 25) AS ny_sats FROM articles a LEFT JOIN (SELECT group_id, mode() WITHIN GROUP (ORDER BY vat_rate DESC) AS rate FROM articles WHERE group_id IS NOT NULL GROUP BY group_id) g ON g.group_id = a.group_id WHERE a.vat_rate <> coalesce(g.rate, 25)'`. Utfärdade fakturor påverkas inte.",
      "API: `POST`/`PATCH /articles` tar inte längre `vatRate` — fältet ignoreras, och i svaret är det härlett från varugruppen. `POST`/`PATCH /article-groups` tar `vatRate`, och varugruppens kod får vara 1–4 siffror. API-sökvägarna och `groupId` heter som förut; i webben skickas `/artikelgrupper` vidare till `/varugrupper`.",
      "Varje kundfakturarad har en Momskod i stället för en momssats, och Nav väljer koden utifrån kundens Land, VAT-nummer, Privatperson och Omvänd betalningsskyldighet för byggtjänster. En ny faktura till ett företag i ett annat EU-land med VAT-nummer, eller till en kund utanför EU, blir därför utan svensk moms, och Utfärda vägrar en faktura med EU-försäljning eller omvänd betalningsskyldighet när kundens momsnummer inte är giltigt. Kontrollera Land och VAT-nummer på utländska kunder — kundkortets Momsbehandling visar vad kunden får.",
      "Leverantörer har fått Land och Momskod (förval), och leverantörsfakturor bokförs per momskod, så att en leverantör i ett annat EU-land ger omvänd moms. Migrationen läser landet ur leverantörens momsnummer och annars ur IBAN; övriga får SE. Kontrollera Land på varje utländsk leverantör, annars får fakturorna svensk moms. Öppna också Ekonomi → Momskoder och Momsrapport och läs varningarna: konton som redan har bokförda verifikat har inte fått sin momsruta ändrad automatiskt, eftersom det skulle ändra redan deklarerade perioder (manualens avsnitt Efter uppgraderingen under Momskoder).",
      "Intäkts- och momskontona per momssats har flyttat från Konteringsregler till momskoderna, med de konton ni hade. Momsomföringen bokför nu ruta 49 i hela kronor och öresdifferensen på Öres- och kronutjämning. API: `PATCH /settings/posting` tar inte längre `postingRevenue25`/`12`/`6`/`0`, `postingVatOut25`/`12`/`6` eller `postingVatIn` — använd `PATCH /vat-codes/:id`. Konteringsreglerna (`/posting-rules`) har `vatCodeId` i stället för `vatRate`, och kund- och leverantörsfakturarader tar `vatCodeId`; en ensam `vatRate` på en kundfakturarad betyder fortfarande den svenska koden för satsen.",
      "En leverantörsfaktura i annan valuta än SEK som sparades som utkast före uppdateringen saknar kurs och kan inte godkännas förrän kursen är bekräftad eller inskriven på utkastet. Godkända fakturor var alla i SEK och påverkas inte.",
      "Den nya behörigheten Kvalitet styr menyn Kvalitet och genvägarna som skapar dokument åt ett avvikelseärende. Varje behörighetsgrupp som hade Försäljning, Inköp eller Tillverkning får den vid uppdateringen. API: `deviationId` på `POST /quotes`, `/purchase-orders`, `/manufacturing-orders` och `POST /invoices/:id/credit` kräver `kvalitet` (403 annars).",
      "Så fort det finns en aktiv kassationsorsak under Kvalitetsorsaker måste varje kassation i stämpelterminalen, Pågående arbete och på tillverkningsorderns kort ha en orsak (API: `scrapReasonId`, annars 400 `scrap-reason-required`). Utan kassationsorsaker är kassationens orsak fritext som förut.",
      "Operationsimporten läser kolumnen Cykeltid som operationens egen Cykeltid, inte längre som Stycktid. Ställtid och Stycktid / Tid per enhet är inte längre obligatoriska kolumner, men en rad på en vanlig resurs utan tider blir ett radfel — finns stycktiden bara i kolumnen Cykeltid, mappa den till Stycktid / Tid per enhet i steget Kolumner.",
      "Kundprisimporten kräver inte längre Pris: en rad behöver ett pris eller ett kundens artikelnummer, och rader utan kund, pris och kundens artikelnummer hoppas över i stället för att bli radfel.",
      "När en Ställkostnadsartikel är vald under System → Inställningar (tom från början) får en ny offert- eller orderrad på en artikel med ställpris en kopplad ställkostnadsrad direkt efter sig, även via `POST /quotes` i konfiguratorns API. Raden bär `setupForRowId`, och regeln att samma artikel bara får ligga en gång per order gäller inte ställkostnadsraderna — en integration som letar upp raden för en viss artikel behöver ta hänsyn till det.",
    ],
    added: [
      "Momskoder under Ekonomi → Momskoder: en fast katalog med företagets konton och fakturatext per kod, för svensk moms, EU-försäljning, export, omvänd betalningsskyldighet, inköp från EU och utanför EU och importmoms. Momsrapport visar hela deklarationen med alla rutor och Att deklarera (hela kr), Redovisningsperiod för moms (Månad, Kvartal eller Helår) och Ladda ned fil till Skatteverket. Bokför importmoms bokför importmomsen på tullbeslutet, och fakturan skriver köparens momsnummer, momskodens text och Levererad-datum per rad. Ekonomi → Periodisk sammanställning sammanställer EU-försäljningen per köparens momsnummer, stämmer av mot momsrapporten och laddar ned filen till Skatteverket.",
      "Valuta: Ekonomi → Valutakurser hämtar Riksbankens dagskurser och tar egna kurser. Leverantörsfakturor kan registreras i utländsk valuta och bokförs i SEK, och utbetalningen registreras med Belopp i SEK och Bankavgift så att kursdifferensen bokförs. Betalfilen klarar SEPA- och utlandsbetalningar med leverantörens utländska konto, Avgiftsfördelning och Betalningskod (Skatteverket), och markerar betalningar som ska rapporteras till Skatteverket (KU81). Kunder och prislistor kan ha valuta, och offert, kundorder, faktura och kundbetalning går då i kundens valuta med kursen vid Utfärda. Årsbokslutet har steget Valutaomvärdering för öppna fakturor i valuta.",
      "Manuell bokföring: Nytt verifikat registreras i en tabell med kontosök, tangentbordsflöde, motrad och Momskod som delar upp beloppet, och Spara och bokför gör allt i ett steg. Verifikat kan kopieras och sparas som mall (Ekonomi → Verifikatmallar), Ekonomi → Återkommande verifikat skapar verifikat varje månad ur en mall, Fördela över perioder periodiserar en kostnad eller intäkt, och SIE-filer har fliken Importera verifikat — till exempel lönejournalen, i serien LÖ — med förhandsgranskning.",
      "Ekonomi → Bankavstämning: importera kontoutdraget (camt.053 eller CSV), matcha posterna mot bokföringen, bokför det som saknas och markera kontot avstämt t.o.m. ett datum. Bankregler känner igen återkommande poster som avgifter, ränta och skattekontot.",
      "Kostnadsställen och projekt (SIE-dimension 1 och 6) som register under Ekonomi, på verifikatrader, mallar, kund- och leverantörsfakturor, kundorder och inköpsorder, med förval från varugrupp, leverantör och anläggningsgrupp. Kontot kan Kräva kostnadsställe, resultaträkningen kan visas per kostnadsställe eller projekt, Rapporter har projektrapporten, och SIE-exporten och -importen tar med objekten.",
      "Ekonomi → Budget: budget per räkenskapsår med belopp per konto och månad och valfritt per kostnadsställe, Fördela årsbelopp jämnt, kopiera budget eller utfall och CSV-export och -import. Resultaträkningen visar budget och avvikelse för perioden och ackumulerat.",
      "Räntefakturering under Försäljning → Fakturering: dröjsmålsränta enligt räntelagen på Riksbankens referensränta (Ekonomi → Referensränta, Hämta från Riksbanken) och förseningsersättning på 450 kr, en räntefaktura per kund, med Utfärda direkt. Rutinen är avstängd från början och slås på under Konteringsregler (Debitera dröjsmålsränta, Debitera förseningsersättning); kundkortet har Dröjsmålsränta, Avtalad räntesats och Förseningsersättning.",
      "Inköp → Fakturainkorg tar emot leverantörsfakturor som PDF, foto (Fota faktura) eller e-post och tolkar dem lokalt till ett förslag med leverantör, fakturanummer, datum, belopp och inköpsorder, som du granskar bredvid originalet och gör till en leverantörsfaktura som utkast. Nav lär sig var varje leverantör har sina uppgifter. AI-tolkning med företagets egen API-nyckel hos Anthropic kan slås på för foton och fakturor som reglerna inte klarar, och en e-postlåda kan läsas automatiskt — båda under System → Fakturaskanning.",
      "Kvalitet: en egen meny med Avvikelser — kundreklamation, leverantörsavvikelse och intern avvikelse med egen nummerserie (AV-…), status Börja utreda/Avsluta/Makulera/Öppna igen, kostnader, kopplade dokument, bilder och filer och historik. Genvägar skapar kreditfaktura, ersättningsorder, inköpsorder och tillverkningsorder åt ärendet, och reklamationsrapporten kan skrivas ut och skickas. Kundorder-, faktura-, inköpsorder-, tillverkningsorder-, kund- och leverantörskorten har sektionen Avvikelser, Kvalitetsorsaker är ett nytt register, och Leveransprecision kan grupperas per motpart med kvalitetskolumnerna.",
      "Artikelkod: ett nytt register under Grunddata för urval och gruppering, med fält på artikelkortet, kolumn och filter i Artiklar, filter i Orderförteckningen och Lagervärderingen, som också kan grupperas per Varugrupp eller Artikelkod. Artikelimporten läser Varugrupp (kod) och Artikelkod.",
      "Favoriter överst i sidomenyn: stjärnan på modulsidornas rader och Favorit uppe till höger sparar en sida med sina filter. Favoriterna sparas på användaren, högst 20.",
      "System → Säkerhetskopiering visar Lagringsutrymme — hur mycket de uppladdade filerna tar per slag och databasens storlek, med en påminnelse när filerna passerar 50 GB — och Exportera filer laddar ner alla lagrade filer som en zip med en mapp per slag och post.",
      "Artikelkortet har Extra benämning, en flerradig text som skrivs ut under benämningen på de dokument som väljs under System → Inställningar (Extra benämning på dokument), och Lager-flikens Planering har Säkerhetslager och Styrning (Lagerstyrd/Orderstyrd). Behovsberäkningen föreslår påfyllning när saldot faller under det största av beställningspunkt och säkerhetslager, och visar kolumnen BP / SL.",
      "Kundkortets flik Kundens artikelnummer: vad kunden kallar artikeln, utskrivet som Ert art.nr på offert, orderbekräftelse, plocklista, följesedel och faktura. Kundpriser har Ställpris, som läggs på ordern som en egen rad med texten Ställkostnad för {artikelnummer}, och kunden kan ha Faktura i vänteläge, så att Samlingsfaktureringens Utfärda direkt lämnar fakturan som utkast för granskning.",
      "Strukturraden har Pos., operationen Cykeltid och legooperationen Transportkostnad (kr), som läggs till ställpriset på legoinköpsordern och i kalkylen. Resursen har Kalkylpris 2, som sparas men inte används av kalkylen ännu.",
      "Importerna läser fler kolumner ur exporterna från det tidigare affärssystemet: lego-operationslistan känns igen som operationsimport (legoleverantör, ställ- och styckpris och transportkostnad), artikelimporten läser Artikelrevision, Ritningsnummer, Ritningsrevision, Extra benämning, Säkerhetslager, Styrning, Antal/kolli (Inköp) och Leverantörsnr (förvald leverantör), strukturimporten Pos. med kryssrutan Uppdatera befintliga strukturrader, kundprisimporten Ställpris och Kundens artikelnummer ur filen Kundkopplingar, kundimporten Faktura i vänteläge, Valuta och Alternativa leveransadresser med adressens namn och Förvald, och resursimporten Kalkylpris 2.",
      "API: `/vat-codes`, `GET /vat-report/file`, `/settings/vat-reporting`, `POST /import-vat`, `GET /periodic-summary` och `…/file`, `/exchange-rates` med `…/fetch`, `/exchange-rate-settings`, `currency` och `exchangeRate` på kund, prislista, offert, kundorder och faktura, `POST /year-end-closings/:id/fx-revaluation`, `PUT /verifications/:id/rows`, `book` på `POST /verifications`, `POST /verifications/:id/copy` och `…/template`, `/verification-templates`, `/recurring-verifications`, `POST /sie/verifications/preview` och `…/import`, `/bank-accounts`, `POST /bank-statements/preview` och `…/import`, `/bank-matches`, `/bank-rules`, `POST /bank-reconciliations`, `/cost-centers`, `/projects`, `costCenterId` och `projectId` på rader och dokument, `GET /reports/project-report`, `/budgets`, `GET /late-interest/candidates`, `POST /late-interest/invoices`, `/reference-rates`, `/invoice-scans`, `/settings/invoice-scan`, `/deviations`, `/deviation-reasons`, `/article-codes` och `articleCodeId`, `/customers/:id/article-numbers`, `GET /storage` och `/storage/export`, `favorites` i `PATCH /me/settings`, `extraDescription`, `safetyStock` och `stockControlled` på artikeln, `position` på strukturraden, `cycleTimePerUnit` och `transportPrice` på operationen, `calcRate2` på resursen, `setupPrice` på kundpriset, `invoiceOnHold` på kunden och `vatCodeId` och `deliveryDate` på fakturaraden.",
    ],
    changed: [
      "Behovsberäkningen: Förslag visar det nyräknade förslaget efter Uppdatera. Tidigare behöll en rad sitt första förslag tills sidan laddades om; nu behåller bara rader där du själv ändrat antal eller val sitt värde.",
      "Konton med Endast läsning kan spara sina egna inställningar — favoriter, tema, rader per sida och aviseringsmejlet. `PATCH /me/settings` är det enda skrivande undantaget; affärsdata går fortfarande inte att ändra.",
      "Importens Förhandsgranska och Importera tar emot upp till 16 MB, så stora filer med upp till 10 000 rader går igenom (tidigare tog det stopp vid 1 MB). Flerradiga celler i Excelfilerna blir riktiga radbrytningar.",
      "Lego-operationslistan tolkades tidigare som en artikelimport, där kolumnen Namn blev artiklarnas benämning. Nu känns den igen som operationsimport.",
      "Knappen på kundkortet heter Kundordrar i stället för Säljordrar.",
    ],
  },
  {
    version: "0.5.0-alpha",
    date: "2026-10-23",
    summary:
      "Tillägg: externa program som får händelser från Nav|ERP och kan visa egna sidor och flikar, egna färgteman med temaredigerare, och offerter som en egen rutin med egen nummerserie.",
    breaking: [
      "Migrationerna 0138–0141 körs automatiskt när API:et startar.",
      "Ändringsanrop med en inloggad session (även inloggning, registrering och utloggning) som kommer från en annan webbplats vägras nu med 403 `cross-site-request`. Webben, stämpelterminalen och integrationer med API-klient (OAuth2) påverkas inte. Har du gett API:et en egen publik adress med `NEXT_PUBLIC_API_URL` måste `WEB_ORIGIN` vara adressen användarna öppnar webben på.",
      "En ny offert får sitt nummer ur den nya serien Offert (`OF-…`), även via `POST /quotes` utan `confirm`; när offerten bekräftas får den nästa kundordernummer och offertnumret sparas. Ny kundorder får ett kundordernummer direkt som förut, och befintliga offerter behåller sina nummer. Kontrollera serien under System → Nummerserier. `GET /sales-orders` tar `kind=quote|order`.",
      "Användarregistret visar tilläggens tekniska användare, märkta Tillägg. De kan inte loggas in med eller ändras där. API: `GET /auth/users` har fältet `kind`.",
    ],
    added: [
      "Tillägg under System → Tillägg: ett externt program installeras från sin adress och får en egen API-nyckel och behörighetsgrupp, med Endast läsning om man vill. Det kan prenumerera på 16 händelser — artikel, kund och leverantör skapad eller ändrad, offert skapad, kundorder bekräftad, levererad eller makulerad, faktura utfärdad eller betald, inköpsorder skapad eller mottagen och tillverkningsorder skapad eller klar — som skickas som signerade webhooks och försöks igen automatiskt. Tillägget kan visa egna sidor i modulernas menyer och egna flikar på artikel-, kund- och leverantörskorten, och de följer användarens tema. Ett tillägg måste köras på en annan värd än Nav|ERP. Ett exempeltillägg utan beroenden finns i `examples/nav-plugin-exempel/`, och manualen har kapitlet Tillägg.",
      "Egna färgteman under System → Teman: skapa ett tema i temaredigeraren utifrån fyra grundfärger — Nav|ERP räknar fram resten och kontrollerar att all text klarar WCAG AA — eller ladda upp en temafil. Teman kan exporteras, och administratören väljer företagets förvalda tema och kan låsa valet för alla.",
      "Offerter är en egen rutin under Försäljning → Offerter, skild från Kundorder, och offerten har fältet Kundens förfrågan som skrivs ut som Er förfrågan på offerten och orderbekräftelsen. Orderbekräftelsen visar Vår offert.",
      "API: `/themes` med `/themes/validate` och export, `GET /theme-boot`, `/plugins` med förhandsgranskning, nyckelbyte, testhändelse och leveranser, `GET /plugin-ui`, `POST /plugins/:id/context`, `GET /plugin-kit.css` och `customerInquiryNumber` på offerten.",
    ],
    changed: [
      "Användarens temaval sparas på användaren och följer med mellan datorer.",
      "Personalkortets Schema visar Kommande 4 veckor staplat på mobilen.",
    ],
  },
  {
    version: "0.4.2-alpha",
    date: "2026-10-22",
    summary:
      "Aviseringar med daglig sammanställning per e-post, uppföljning av offerter med giltighetstid, status Förlorad och hit rate, Excelmallar för alla importer, anledning vid sen ankomst och tidig hemgång och val av övertidsersättning i stämpelterminalen, och en egen huvudmeny Personal & lön.",
    breaking: [
      "Migrationerna 0134–0137 körs automatiskt när API:et startar.",
      "Personal & lön är en egen huvudmeny och en egen behörighet. Anställda (tidigare Personal), Attestering, Löneunderlag och Lönekoder har flyttat från Tillverkning till `/personal/…`; de gamla adresserna skickas vidare. Varje behörighetsgrupp som hade Tillverkning får Personal & lön vid uppdateringen, så ingen tappar åtkomst — men en grupp som ska attestera eller se personalregistret behöver från och med nu Personal & lön, och en grupp med bara Tillverkning når inte längre de sidorna. Attestering och Löneunderlag kräver fortfarande rollen arbetsledare eller administratör.",
      "API: personal-, frånvaro-, attesterings- och lönerutterna (`/employees`, frånvaron, löneperioden, övertidsvalen, lönekoderna och arbetsledarens rättning av närvaro) kräver behörigheten `personal` i stället för Tillverkning. Terminalens rutter, `/employees/directory`, tidrapporterna och scheman är oförändrade.",
      "En ny offert får Giltig t.o.m. dagens datum plus 30 dagar, även via `POST /quotes`. Sätt Offertens giltighetstid (dagar) till 0 under Systeminställningar för att stänga av det. Kundorder har en ny status, `lost` (Förlorad).",
    ],
    added: [
      "Aviseringar: en egen sida och Översiktens Att bevaka visar det som behöver åtgärdas — negativa saldon, försenade kundordrar, inköpsordrar och tillverkningsordrar, inköps- och tillverkningsbehov, förfallna kundfakturor, leverantörsfakturor att betala, misslyckade e-fakturor och utskick och offerter att följa upp. En avisering försvinner när orsaken är åtgärdad. Varje användare kan slå på en daglig sammanställning per e-post; fyll i Navs adress under Systeminställningar för att få länkar i mejlet.",
      "Offerter har Giltig t.o.m. och kan markeras Förlorad… med en förlustorsak ur det nya registret Förlustorsaker, och öppnas igen. Rapporten Offertuppföljning visar hit rate i antal och värde per kund, månad och förlustorsak.",
      "Ladda ned mall i varje importflik ger en Excelmall med rätt kolumner, en kommentar per kolumn och ett instruktionsblad. Importguidens mappningssteg visar förklaringen för varje fält, och manualen har kapitlet Importmallar.",
      "Stämpelterminalen kan kräva en anledning när någon stämplar in senare eller går hem tidigare än schemat, med en marginal i minuter, och fråga om övertiden ska betalas ut eller sparas. Båda är av som förval och slås på under Systeminställningar → Lön & PAXml; anledningarna väljs ur registret Avvikelseorsaker under Personal & lön → Lönekoder. Attesteringen visar avvikelserna och anledningarna per dag.",
      "API: `GET /alerts`, `POST /sales-orders/:id/lose` och `…/reopen`, `GET /reports/quote-followup`, registret `/quote-loss-reasons`, `GET /imports/:entity/fields`, `GET /attendance-deviation-reasons` och `reason`/`overtimeDisposition` på närvarostämplingen.",
    ],
    changed: [
      "Översiktens Att bevaka och flödesremsans försenade och negativa siffror räknas nu på samma sätt som Aviseringar.",
    ],
  },
  {
    version: "0.4.1-alpha",
    date: "2026-10-21",
    summary:
      "E-faktura via Peppol till svenska företagskunder, ångra en utleverans per leveransrad, nya pallkort med streck- eller QR-kod och eget antal per kolli, materialpåslag i kalkylen och TO-påslaget sist på försäljningspriset.",
    breaking: [
      "Migrationerna 0129–0133 körs automatiskt när API:et startar. Befintliga leveransrader paras ihop med sina lagerrader så att de kan ångras; en leveransrad som inte går att para ihop kan inte ångras.",
      "Kalkylen: TO-påslaget ingår inte längre i tillverkningskostnaden (TVK) eller självkostnaden (SVK) utan läggs sist, direkt på försäljningspriset, utan Affo eller generellt påslag på sig. En ny kalkyl kan därför ge lägre TVK, SVK och försäljningspris än förut, och standardpris, varianters standardpris, lagervärdet vid inleverans av en konfigurerad tillverkningsorder, marginal och Kalkylutfall följer med. Sparade kalkyler summerar fortfarande till sitt sparade försäljningspris.",
      "Pallkort: utan egen inställning får dialogen Pallkort skriva ut även när kollina inte stämmer med totalt antal — den varnar men spärrar inte. Stäng av Tillåt utskrift av pallkort även om kollina inte stämmer med totalt antal under Systeminställningar för att spärra.",
    ],
    added: [
      "E-faktura via Peppol (Peppol BIS Billing 3): Skicka e-faktura på fakturakortet skickar fakturan eller kreditfakturan till en svensk företagskund genom accesspunkten B2Brouter, och statusen (Skickad, Mottagen, Avvisad, Misslyckad) hämtas automatiskt. Inställningarna finns under System → E-faktura, och kundkortet har Fakturaleverans och Peppol-id med Kontrollera mot Peppol-katalogen. Börja i B2Brouters testmiljö (Sandbox). Ingen ändring i `.env` behövs.",
      "Ångra… i kundorderkortets Följesedlar ångrar en leveransrad: varorna går tillbaka till sin lagerplats och ordern öppnas igen. Det går inte när raden är fakturerad (även utkast) eller följesedeln ligger på en bokad transport.",
      "Nya pallkort: ett vikbart A4-kort med Kolli n av m, kund och båda ordernumren, och valfri streckkod eller QR-kod (Kod på pallkort i Systeminställningar och per kund). Dialogen Pallkort fördelar ett totalt antal på flera kolli, och pallkorten kan skrivas ut igen per rapport i tillverkningsorderns logg och per följesedel.",
      "Materialpåslag (%) under System → Kalkyler: ett påslag på direkt material och MO som läggs på försäljningspriset bredvid det generella påslaget, utan att ändra självkostnaden.",
      "Kundorderkortet visar tillverkningsorderns nummer och status på raden, och Skapa TO skapar bara det som återstår.",
      "API: `GET`/`POST /invoices/:id/einvoice`, `POST /einvoice-transmissions/:id/refresh`, `GET /einvoice-transmissions/:id/document`, `GET`/`PATCH /einvoice-settings`, `POST /customers/:id/peppol-lookup`, `invoiceDelivery` och `peppolId` på kunden, `einvoiceStatus` i fakturalistan och `POST /sales-orders/:id/deliveries/:deliveryId/rows/:deliveryRowId/undo`.",
    ],
    changed: [
      "Följesedelns PDF markerar ångrade rader, och leveransprecisionen räknar bara följesedlar som inte är ångrade.",
    ],
  },
  {
    version: "0.4.0-alpha",
    date: "2026-10-19",
    summary:
      "Leveransdatum per orderrad och bekräftat leveransdatum på inköpsorder, ny leveransadress direkt på kundordern, ändringar av material och operationer på en skapad tillverkningsorder, orderförteckning för kundorder och inköp, nummerserie för artikelnummer, användarkonton som bara kan läsa och sökning i manualen.",
    breaking: [
      "Migrationerna 0125–0128 körs automatiskt när API:et startar. Befintliga orderrader och inköpsordrar får inga egna datum — de följer orderns datum som förut.",
      "Planeringen räknar inköpsorderns rader på Bekräftat leveransdatum när ett sådant finns, före Önskat leveransdatum. Kundorder- och inköpsorderlistornas Leveransdatum och Översiktens försenade ordrar visar nu nästa leveransdatum bland raderna som inte är fullt levererade eller mottagna, i stället för orderhuvudets datum.",
      "Planera, Flytta och en ny tillverkningsorder varnar när en operation ensam skulle fylla resursen i fler än 4 normalveckor. Gränsen ställs in under Systeminställningar (Orimligt mycket tid på en operation (veckor), 0 stänger av varningen). Operationen planeras ändå.",
      "Rapporten Kalkylutfall jämför nu varje orders efterkalkyl med artikelns förkalkyl som gällde då, så siffrorna ändras. API: räknaren `notComparable.onlyPre` är borttagen.",
      "API: en rad på en leverantörsfaktura kan IO-matchas mot en inköpsorder från en annan leverantör än fakturans — bara artikeln måste stämma. `PATCH /supplier-invoices/:id` tar `supplierId` på ett utkast.",
    ],
    added: [
      "Kundorderrader kan få ett eget Leveransdatum (Ny kundorder med Eget leveransdatum per rad, kortets Lägg till rad och Ändra). Offert, orderbekräftelse och plocklista skriver radens datum när det avviker från orderns.",
      "Inköpsordern har Bekräftat leveransdatum i huvudet och per rad; raderna ärver huvudets.",
      "+ Ny leveransadress… i Ny kundorder, Ny offert och Ändra orderhuvud. Utan Spara på kunden blir adressen en engångsadress som bara gäller ordern.",
      "Material och operationer kan läggas till, ändras och tas bort på en Frisläppt eller Pågående tillverkningsorder, utan att artikelns beredning ändras. Operationsändringar planerar om ordern direkt.",
      "Rapporter → Orderförteckning kundorder och Orderförteckning inköp: ordervärde och restvärde per order eller med rader, urval på datum, kund/leverantör, status, artikel och artikelgrupp, som PDF i liggande A4 och CSV.",
      "Ett tomt Artikelnummer i Ny artikel får nästa lediga nummer ur standardserien Artikelnummer eller ur en egen artikelserie som kopplas till artikelgrupper (System → Nummerserier → Egna artikelserier).",
      "Endast läsning under System → Användare: kontot ser allt dess behörighetsgrupp ger men kan inte ändra något.",
      "Ny leverantörsfaktura förifyller Momsbelopp och Bruttobelopp ur nettot och Momssats, och fakturan kan registreras med Betalas till en annan leverantör.",
      "Sökfält i manualen, på Hjälp och ovanför varje kapitel.",
      "API: `newDeliveryAddress` på `POST /quotes` och `PATCH /sales-orders/:id`, `expectedDeliveryDate` på kundorderrader, `confirmedDeliveryDate` på inköpsorder och inköpsorderrader, `nextDeliveryDate` i orderlistorna, `POST /articles` utan `articleNumber`, `GET /reports/sales-order-register` och `/reports/purchase-order-register`, och `POST/PATCH/DELETE /manufacturing-orders/:id/materials` och `…/operations`.",
    ],
    changed: [
      "Ett konto som är markerat Endast läsning får 403 `read-only-account` på allt utom läsningar. En administratör kan inte vara Endast läsning.",
    ],
  },
  {
    version: "0.3.0-alpha",
    date: "2026-10-18",
    summary:
      "Produktionsplanering: tillverkningsordrarnas operationer planeras på resursernas lediga kapacitet vecka för vecka, kan flyttas och låsas för hand, och Leveranstidskontrollen kan skapa tillverkningsordrarna för det som saknas direkt från kundordern.",
    breaking: [
      "Migration 0124 körs automatiskt när API:et startar och lägger till planerade veckor på operationerna. Befintliga tillverkningsordrar lämnas oplanerade och räknas i beläggningen som förut, i färdigdatumets vecka. Tryck Planera under Tillverkning → Beläggning en gång efter uppdateringen för att planera dem.",
      "API: en tillverkningsorder som skapas med `POST /manufacturing-orders` planeras nu direkt i samma transaktion. `releaseWarnings` kan därför också innehålla planeringsvarningar, till exempel att ordern blir klar efter färdigdatumet eller hamnar utanför planeringshorisonten. Ordern skapas ändå; varningarna stoppar aldrig.",
    ],
    added: [
      "Planera under Beläggning lägger alla öppna tillverkningsordrars operationer på resursernas lediga kapacitet, i färdigdatumsordning och i operationsordning. Sammanfattningsraden visar när planen senast gjordes och varnar för ordrar som blir sena.",
      "Flytta… i beläggningens utfällda cell flyttar en operation till en annan vecka, som förval tillsammans med de efterföljande. En flyttad operation låses och ligger kvar vid nästa Planera tills någon väljer Lås upp.",
      "En ny tillverkningsorder planeras direkt när den skapas, från alla vägar: Ny tillverkningsorder, kundorderradens Skapa TO, behovsberäkningens Skapa ordrar och API:t.",
      "TO-listan och TO-kortet visar Planerad vecka, Sen och Låst. Terminalens operationslista har förvalet Planerad vecka.",
      "Leveranstidskontroll på en bekräftad kundorder har kryssrutan Skapa tillverkningsordrar för det som saknas: Använd datumet skapar då hela strukturens tillverkningsordrar i de veckor kontrollen räknade med och låser dem, så att det lovade datumet håller. Har läget ändrats sedan kontrollen visas den nya kontrollen och ingenting skapas.",
      "API: `POST /planning/plan`, `POST /planning/operations/:opId/move`, `POST /planning/operations/:opId/unlock` och `POST /delivery-time-check/apply`.",
    ],
    changed: [
      "Beläggningen och Leveranstidskontrollen räknar en planerad operations återstående tid i de planerade veckorna i stället för i färdigdatumets vecka.",
      "En operation på en resurs utan kalender blir inte längre klar en helgdag.",
    ],
  },
  {
    version: "0.2.5-alpha",
    date: "2026-10-17",
    summary:
      "Rättningar efter granskningen av leveransdagarna och Leveranstidskontrollen — kontrollen räknar nu mot projicerat saldo och skjuter eftersläpande last framåt — och versionsnumret syns i appen.",
    breaking: [
      "API: datumfält som räknas på (kundorderns `expectedDeliveryDate` i `POST /quotes` och `PATCH /sales-orders/:id`, `date` i förslagsendpointsen) tar nu bara år 1900–2999 — ett datum utanför ger 400. Integrationer som skickar platshållardatum som 9999-12-31 behöver ändras.",
    ],
    added: [
      "Versionen syns längst ned i sidomenyn, under användaren, med länk till versionssidan. API:ets `GET /health` svarar också med versionen.",
    ],
    changed: [
      "Leveranstidskontroll räknar det som redan finns mot det projicerade saldot: en kundorder långt fram tar inte längre lagret framför en ny order. Last som inte ryms i en vecka skjuts framåt vecka för vecka i stället för att försvinna. Datumen kan därför bli både tidigare och senare än förut.",
      "Försenade order och utkast till inköpsorder räknas fortfarande som tillgång men märks i kedjan och i noteringarna. En tillverkad artikel utan beredning noteras, och ett avrundat inköp delas mellan raderna.",
      "Använd datumet visas bara när kontrollen räknats med en kund, och en order som inte är öppen kan inte kontrolleras.",
      "Fasta leveransdagar: långa transporttider räknas nu rätt i planeringen, i Skapa ordrar och i datumvarningarna — tidigare försvann transporten tyst.",
      "Kontrollen är snabbare på stora strukturer. Ingen migration i den här versionen.",
    ],
  },
  {
    version: "0.2.4-alpha",
    date: "2026-10-17",
    summary:
      "Resurser kan få kapacitet i timmar per dag i stället för ett veckoschema — beläggningen och Leveranstidskontrollen räknar med den direkt.",
    breaking: [],
    added: [
      "Kapacitet (timmar per dag) på resursen: så många timmar måndag–fredag (× kapacitetsfaktorn), en röd dag i helgdagskalendern ledig och en halvdag på helgdagens dagschema. Har resursen ett veckoschema gäller schemat. Beläggningen och Leveranstidskontrollen räknar med timmarna.",
      "Resurslistans kolumn Kapacitet visar veckoschemat eller t.ex. 8 h/dag, och timmarna kan ändras direkt i listan.",
      "API: resurser bär `hoursPerDay`.",
    ],
    changed: ["Databasen migreras automatiskt (migration 0123) när API:et startar."],
  },
  {
    version: "0.2.3-alpha",
    date: "2026-10-17",
    summary:
      "Leveranstidskontroll: tidigaste avsändnings- och leveransdatum för en kundorder ur lager, öppna order, materialets ledtid och ledig kapacitet i produktionen.",
    breaking: [],
    added: [
      "Leveranstidskontroll på kundorderkortet och i Ny kundorder, och som egen sida under Försäljning → Leveranstidskontroll (valfria artiklar och antal, valfri kund). Kontrollen räknar med lager och öppna order efter de behov som redan är lovade, ledtiden på material som måste köpas, och ledig tid per resurs och vecka för det som måste tillverkas — på alla nivåer i strukturen och för konfigurerade rader.",
      "Resultatet visar leveransdatum, avsändningsdag och vad som begränsar varje rad steg för steg; Använd datumet sätter orderns Förväntat leveransdatum. Kontrollen bokar varken tid eller material.",
      "Beläggningen räknas för resurser som har ett veckoschema — lägg in veckoscheman på resurserna för att kapaciteten ska påverka datumen.",
      "API: `POST /delivery-time-check`; `PATCH /sales-orders/:id` tar `expectedDeliveryDate`.",
    ],
    changed: ["Ingen migration i den här versionen."],
  },
  {
    version: "0.2.2-alpha",
    date: "2026-10-17",
    summary:
      "Fasta leveransdagar och transportdagar för leverantörer och kunder: datumen på inköps- och kundorder föreslås ur dem, Skapa ordrar följer leverantörens dagar och ledtid, och planeringen räknar kundorderns behov på avsändningsdagen.",
    breaking: [
      "Skapa ordrar i behovsberäkningen använder nu ledtiden i leverantörskatalogen (Ledtid (dagar), räknat i arbetsdagar). Tidigare visades den bara. Inköpsordrar till leverantörer som har en ledtid får därför ett senare Önskat leveransdatum än förut när ledtiden inte hinner före behovet — resultatet listar då en varning. Se över ledtiderna i katalogen innan ni skapar ordrar.",
    ],
    added: [
      "Leveransdagar på leverantörs- och kundkortet (fliken Villkor & frakt): veckodagar, om dagarna avser ankomst eller avsändning, och transportdagar. Förvalen för läge och transportdagar ställs in under System → Inställningar → Leveransdagar.",
      "Ny inköpsorder och Ny kundorder föreslår datum ur partnerns leveransdagar, och Lägg till rad på inköpsordern föreslår radens datum med artikelns ledtid. Ett datum du skriver själv rörs inte.",
      "Datumfälten på inköps- och kundorder visar partnerns dagar och varnar när ett datum inte passar dem — varningen spärrar aldrig.",
      "Skapa ordrar lägger inköpens datum på leverantörens leveransdagar före behovet och varnar när leveransen kommer efter behovet.",
      "API: `GET /supplier-delivery-date-suggestion` och `GET /customer-delivery-date-suggestion`; leverantörer och kunder bär `deliveryWeekdays`, `deliveryDayMode` och `transitDays`, och svaret från `POST /planning/orders` har listan `warnings`.",
    ],
    changed: [
      "Kundorderns Förväntat leveransdatum är dagen kunden får varan. Artikelöversikten, färdigdatumsförslaget för nya tillverkningsordrar och Skapa ordrar räknar kundorderns behov på avsändningsdagen, alltså leveransdatumet minus kundens transportdagar. Utan transportdagar och leveransdagar är allt som förut.",
      "Stämpelterminalens stationsval är kompaktare och ligger i en egen panel.",
      "Databasen migreras automatiskt (migration 0122) när API:et startar.",
    ],
  },
  {
    version: "0.2.1-alpha",
    date: "2026-10-16",
    summary:
      "Stämpelterminalens arbetslista visar nu en operation per rad — med station, beredskap, färdigdatum och material — och installationen körs av ett eget servicekonto.",
    breaking: [
      "Lägg in Förvalda stationer på personalkorten (Tillverkning → Personal → fliken Allmänt). Terminalen väljer dem när den anställde identifierar sig; utan förval visas Alla stationer.",
      "Stämpelterminalen fungerar annorlunda: steget där man först valde en order är borta, och Stämpla in på arbete visar direkt alla operationer att börja på. Berätta för personalen innan ni uppdaterar.",
    ],
    added: [
      "Stämpelterminalen visar en operation per rad. Välj Station (resurserna i nummerordning, egna stationer förvalda, byt fritt eller välj Alla stationer), filtrera på Material eller Bara redo, sortera Brådskande (färdigdatum) eller Material (samma material intill varandra), och sök.",
      "Varje rad visar Redo, 8 av 20 redo eller Inte redo — det spärrar aldrig — tillsammans med färdigdatum (försenade markerade) och kopplat material. Starta valda ligger fast längst ned och fungerar över flera ordrar.",
      "Förvalda stationer per anställd på personalkortet.",
      "API: `GET /terminal/operations` och `GET /terminal/stations`; personalkatalogen och `GET/PATCH /employees/:id` bär `defaultWorkCenterIds`.",
    ],
    changed: [
      "Installationsanvisningarna kör Nav|ERP som ett eget servicekonto, `naverp`, med `.env` bara läsbar för det kontot. Befintliga installationer fungerar som förut.",
      "Databasen migreras automatiskt (migration 0121) när API:et startar.",
    ],
  },
  {
    version: "0.2.0-alpha",
    date: "2026-10-16",
    summary:
      "Närvaro och arbete i verkstaden, behörigheter per API-klient, Kom igång och exempeldata — och en härdad driftmiljö på Node.js 24.",
    breaking: [
      "Node.js 24 krävs. Node.js 20 slutade få säkerhetsuppdateringar i april 2026, och både imagerna och lokal utveckling går nu på Node.js 24. Bygg om med `docker compose build --pull`.",
      "Servern går i svensk tid (`TZ: Europe/Stockholm` i `docker-compose.yml`). Löneunderlaget jämförde tidigare schemats klockslag i UTC, alltså 1–2 timmar fel. Övertid, OB och ofördelad tid i öppna löneperioder räknas om när ni uppdaterar — se över innevarande månad i Attestering. Låsta perioder påverkas inte.",
      "Containrarna `api` och `web` körs som den oprivilegierade användaren `node`, utan Linux-capabilities, och `api` har skrivskyddat filsystem. Har ni egna ändringar som skriver till disk i containrarna behöver de ses över.",
      "API-klienter har nu rättigheter och kan knytas till en kund. Befintliga klienter får alla rättigheter och fungerar som förut, men en klient som knyts till en kund kan bara agera för den kunden och inte sätta egna priser.",
    ],
    added: [
      "Närvaro och arbete: instämpling på arbete stämplar in närvaron, en glömd Gå hem fångas i stämpelterminalen (med Gå hem nu för den som jobbat över midnatt), arbetsledaren anger Sluttid när någon stämplas ut på Pågående arbete, och en rättad närvaro i Attestering följer med till arbetena.",
      "Frånvarande märks på Pågående arbete och på personalkortet, och när en operation eller order blir klar stämplas andra som är instämplade på den ut automatiskt — raden Automatisk utstämpling kan ångras som en vanlig utstämpling.",
      "Behörigheter per API-klient med förvalen Hemsida, Återförsäljare och Intern.",
      "Kom igång: en checklista för nya installationer under System → Kom igång och på Översikten.",
      "Exempeldata: ett påhittat företag med artiklar, strukturer, kunder och leverantörer att prova med, under System → Exempeldata.",
      "Anvisningar för att köra Nav|ERP på Windows med Docker Desktop och WSL 2.",
    ],
    changed: [
      "Kundorder: när antalet på en rad ändras och ingen prisregel finns behåller raden sitt pris, i stället för att ändringen avvisas.",
      "Nummerserierna för följesedel, försändelse och inventering har fått namn.",
      "Databasen migreras automatiskt (migration 0119 och 0120) när API:et startar.",
    ],
  },
  {
    version: "0.1.0-alpha",
    date: "2026-10-15",
    summary:
      "Första alfaversionen: artiklar med struktur och beredning, lager, inköp, försäljning, tillverkning med stämpling, kalkyl, produktkonfigurator, bokföring med reskontra, moms, bokslut och bankfiler, löneunderlag, frakt och import.",
    breaking: [],
    added: [],
    changed: [],
  },
];
