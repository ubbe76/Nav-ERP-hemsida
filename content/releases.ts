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
