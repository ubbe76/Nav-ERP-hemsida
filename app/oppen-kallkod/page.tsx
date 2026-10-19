import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Öppen källkod och GPL-3.0: ett affärssystem utan inlåsning",
  description: "Nav|ERP är fri programvara under GPL-3.0-or-later. Vad det betyder för ett företag: ingen licenskostnad, ingen inlåsning, er data.",
};

export default function OpenSourcePage() {
  return (
    <>
      <PageHero
        eyebrow="Öppen källkod"
        title="Ert affärssystem. Er data. Er kod."
        lead="Nav|ERP är fri programvara. Här är vad det betyder för ett företag — utan juridiska omvägar."
      />
      <div className="container">
        <div className="prose">
          <p>
            Nav|ERP sprids under <strong>GNU General Public License version 3 eller senare</strong>{" "}
            (GPL-3.0-or-later), © 2026 Urban Källefors.
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

          <h2>Varför öppen källkod</h2>
          <p>
            Ett affärssystem är något ett företag lever med i tio år eller mer. Med öppen källkod hänger det inte på en
            leverantörs prislista, ett uppköp eller en nedläggning. Koden finns kvar, och därmed möjligheten att
            utveckla den vidare.
          </p>

          <h2>Bakgrunden</h2>
          <p>
            Nav|ERP byggs av Urban Källefors, som arbetar dagligen med inköp, tillverkning, lager och kalkyl i ett
            tillverkande företag. Målet är ett system som täcker kärnflödet från artikel till kalkyl och bokföring —
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
      <CtaBand title="Läs koden, kör systemet" text="Allt finns på GitHub. Installationen tar några minuter med Docker.">
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
