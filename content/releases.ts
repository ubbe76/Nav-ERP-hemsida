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
