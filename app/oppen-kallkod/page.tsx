import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/site";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Affärssystem med öppen källkod (GPL-3.0)",
  description: "Nav|ERP är fri programvara under GPL-3.0-or-later. Vad det betyder för ett företag: ingen licenskostnad, ingen inlåsning, er data.",
};

export default function OpenSourcePage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: SITE.name, path: "/" }, { name: "Öppen källkod" }])} />
      <PageHero
        eyebrow="Öppen källkod"
        title="Ert affärssystem. Er data. Er kod."
        lead="Nav|ERP är fri programvara. Här är vad det betyder för ett företag — utan juridiska omvägar."
      />
      <div className="container">
        <div className="prose">
          {/* The definition first, written to be quoted as is. */}
          <p>
            Ett affärssystem med öppen källkod är ett affärssystem vars källkod är offentlig och vars licens låter
            företaget använda, läsa, ändra och dela programmet utan licensavgift. Nav|ERP sprids under{" "}
            <strong>GNU General Public License version 3 eller senare</strong> (GPL-3.0-or-later), © 2026 Urban
            Källefors. Det betyder att ni kan köra det i hela företaget med hur många användare som helst, och att
            koden och datan finns kvar hos er oavsett vad som händer med projektet.
          </p>

          <h2>Vad ni får göra</h2>
          <ul>
            <li>Använda Nav|ERP i hela företaget, med hur många användare som helst, utan att betala licens.</li>
            <li>Läsa all källkod och se exakt hur saldon, kalkyler och bokföring räknas.</li>
            <li>Ändra systemet efter era behov — själva eller med hjälp av vem ni vill.</li>
            <li>
              Flytta systemet till en annan server, eller sluta använda det, när ni vill. Datan ligger i en vanlig
              PostgreSQL-databas.
            </li>
          </ul>

          <h2>Vad licensen kräver</h2>
          <p>
            Sprider ni en ändrad version vidare till någon annan måste ni dela den under samma licens. Använder ni
            systemet internt i företaget, ändrat eller inte, behöver ni inte publicera något. Programmet levereras utan
            garanti.
          </p>

          <h2>Vem ger support?</h2>
          <p>
            Projektet säljer ingen support och har inget serviceavtal. Det finns tre vägar, och de går att kombinera:
          </p>
          <ul>
            <li>
              <strong>Projektet på GitHub.</strong> Fel, frågor och förslag tas upp som ärenden, öppet för alla. Det
              finns ingen utlovad svarstid.
            </li>
            <li>
              <strong>Er egen IT.</strong> Driften är Docker och PostgreSQL, och installation, backup och återställning
              står steg för steg i <Link href="/kom-igang/">Kom igång</Link> och manualen.
            </li>
            <li>
              <strong>En konsult ni själva väljer.</strong> Eftersom koden är öppen kan vem som helst som kan
              TypeScript, Docker och PostgreSQL sätta sig in i den. Ni är inte bundna till en viss leverantör för
              support eller anpassningar.
            </li>
          </ul>

          <h2>Riskerna, och hur ni hanterar dem</h2>
          <ul>
            <li>
              <strong>Projektet är ungt.</strong> Nav|ERP är i alfa och har ännu inte använts i skarp drift. Prova i
              demon och med era egna artiklar innan ni bestämmer er.
            </li>
            <li>
              <strong>En person bygger det.</strong> Utvecklingstakten hänger på det. Koden finns kvar oavsett, och
              licensen låter vem som helst bygga vidare.
            </li>
            <li>
              <strong>Ni ansvarar för driften.</strong> Servern, säkerhetsuppdateringarna och backupen är era. Nav|ERP
              har färdiga skript för nattlig backup och en krypterad kopia utanför servern.
            </li>
            <li>
              <strong>Att komma ur systemet.</strong> Datan ligger i en vanlig PostgreSQL-databas, register och
              rapporter kan exporteras som CSV, och bokföringen går att ta ut som SIE 4-fil till ett annat program.
            </li>
          </ul>

          <h2>Så bedömer ni ett affärssystem med öppen källkod</h2>
          <p>Frågorna gäller vilket system ni än tittar på. Svaren för Nav|ERP står efter varje punkt.</p>
          <ul>
            <li>
              <strong>Är licensen tydlig och fri?</strong> GPL-3.0-or-later, utan betalda moduler eller funktioner som
              bara finns i en betald utgåva.
            </li>
            <li>
              <strong>Utvecklas det?</strong> Varje version och dess ändringar står under{" "}
              <Link href="/versioner/">Versioner</Link>, med datum.
            </li>
            <li>
              <strong>Finns det dokumentation?</strong> En manual för varje del av systemet, på svenska, i systemet och
              på <Link href="/hjalp/">webbplatsen</Link>.
            </li>
            <li>
              <strong>Klarar det svenska krav?</strong> Momsrapport med momsdeklarationens rutor, SIE 4, BAS-kontoplanen,
              PAXml till lönesystemet och bankens filer för in- och utbetalningar.
            </li>
            <li>
              <strong>Hur kommer ni åt er data?</strong> En PostgreSQL-databas på er egen server, CSV-export och SIE 4.
            </li>
            <li>
              <strong>Vad kräver driften?</strong> En Linux-server med Docker. Uppmätta krav står under{" "}
              <Link href="/kom-igang/#krav">Serverns storlek</Link>.
            </li>
            <li>
              <strong>Hur hanteras säkerhetsbrister?</strong> De rapporteras privat via GitHub, så att de kan rättas
              innan de blir kända.
            </li>
          </ul>

          <h2>Varför öppen källkod</h2>
          <p>
            Ett affärssystem är något ett företag lever med i tio år eller mer. Med öppen källkod hänger det inte på en
            leverantörs prislista, ett uppköp eller en nedläggning. Koden finns kvar, och därmed möjligheten att
            utveckla den vidare.
          </p>

          <h2>Bakgrunden</h2>
          <p>
            Nav|ERP byggs av Urban Källefors, som har arbetat i mekaniska verkstäder sedan 1999 med beredning,
            planering, offerter, IT och konstruktion. Målet är ett system som täcker kärnflödet från artikel till kalkyl och bokföring —
            utan den komplexitet som gör stora affärssystem tunga att införa och dyra att äga.{" "}
            <Link href="/om/">Mer om projektet</Link>.
          </p>

          <h2 id="hjalp-till">Hjälp till att göra Nav|ERP bättre</h2>
          <p>
            Nav|ERP är ett ungt projekt, och det blir bättre av att fler provar det. Ni behöver inte kunna programmera
            för att hjälpa till: berätta hur ert företag arbetar, vad ni saknar eller vad som var svårt att förstå.
            Felrapporter, frågor och förslag är lika välkomna som kod —{" "}
            <a href={SITE.newIssueUrl}>skapa ett ärende på GitHub</a>. Säkerhetsbrister rapporteras däremot{" "}
            <a href={SITE.securityUrl}>privat</a>, aldrig i ett öppet ärende.
          </p>

          <h2>Tredjepartsinnehåll</h2>
          <p>
            Färgtemat Dracula bygger på <a href="https://draculatheme.com">Dracula-paletten</a> (© 2023 Dracula Theme)
            och används under MIT-licensen.
          </p>
        </div>
      </div>
      <CtaBand title="Läs koden, kör systemet" text="Allt finns på GitHub. Installera med Docker, eller prova demon först.">
        <div className="btnRow">
          <Link href="/kom-igang/" className="btn btnPrimary">
            Kom igång
          </Link>
          <a href={SITE.repoUrl} className="btn btnSecondary">
            Källkoden på GitHub
          </a>
        </div>
      </CtaBand>
    </>
  );
}
