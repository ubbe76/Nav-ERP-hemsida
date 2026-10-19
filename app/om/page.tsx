import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { RELEASES } from "@/content/releases";
import { SITE } from "@/lib/site";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Om Nav|ERP och vem som bygger det",
  description:
    "Nav|ERP byggs av Urban Källefors, som har arbetat i mekaniska verkstäder sedan 1999 med beredning, planering, offerter, IT och konstruktion.",
};

// The roles behind the system and where each one shows in it. Facts about
// the person are confirmed by him (2026-10-19) — don't add any that aren't.
const ROLES = [
  {
    role: "Produktionsberedning",
    shows: "Artikelns struktur och rutt med ställtid, tid per enhet och resurs för varje operation.",
    href: "/funktioner/tillverkning/",
  },
  {
    role: "Planering",
    shows: "Behovsberäkningen, beläggningen per resurs och vecka och planeringen av operationerna.",
    href: "/funktioner/tillverkning/",
  },
  {
    role: "Offerter",
    shows: "Förkalkylen med påslag, offerten och täckningsbidraget direkt på raden.",
    href: "/funktioner/kalkyl/",
  },
  {
    role: "IT-ansvarig och ansvarig för affärssystemet",
    shows: "Installationen med Docker, backupen och att datan ligger i en vanlig databas på er egen server.",
    href: "/kom-igang/",
  },
  {
    role: "CAD-konstruktör",
    shows: "Ritningar och revisioner på artikeln, som följer med offerten och tillverkningsordern.",
    href: "/funktioner/lager-och-artiklar/",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: SITE.name, path: "/" }, { name: "Om Nav|ERP" }])} />
      <PageHero
        eyebrow="Om Nav|ERP"
        title="Ett affärssystem byggt från verkstadsgolvet"
        lead="Nav|ERP byggs av Urban Källefors, som har arbetat i mekaniska verkstäder sedan 1999 med beredning, planering, offerter, IT och konstruktion."
      />
      <div className="container">
        <div className="prose">
          <h2>Vem som bygger Nav|ERP</h2>
          <p>
            Urban Källefors har arbetat inom tillverkning sedan 1999, i mekaniska verkstäder som arbetar med plåt, rör
            och skärande bearbetning. Där har han haft hand om produktionsberedning och planering, räknat offerter, varit
            IT-ansvarig med ansvar för företagets affärssystem och arbetat som CAD-konstruktör.
          </p>
          <p>
            Det är samma kedja som Nav|ERP håller ihop: från ritningen och beredningen, via offerten och planeringen, till
            verkstaden och kalkylen. Rollerna syns i systemet:
          </p>
          <ul>
            {ROLES.map(({ role, shows, href }) => (
              <li key={role}>
                <strong>{role}:</strong> {shows} <Link href={href}>Läs mer</Link>
              </li>
            ))}
          </ul>

          <h2>Varför Nav|ERP finns</h2>
          <p>
            Målet är ett system som täcker kärnflödet från artikel till kalkyl och bokföring, utan den komplexitet som
            gör stora affärssystem tunga att införa och dyra att äga. Rutinerna följer hur ett tillverkande företag
            faktiskt arbetar, och systemet är fri programvara, så att inget företag blir beroende av en enda
            leverantör. <Link href="/oppen-kallkod/">Vad öppen källkod betyder för er</Link>.
          </p>

          <h2>Hur projektet drivs</h2>
          <p>
            Nav|ERP byggs i dag av en person, öppet på GitHub. Varje version beskrivs under{" "}
            <Link href="/versioner/">Versioner</Link>, med det som kräver åtgärd vid uppdatering först. Manualen skrivs
            i samma takt som programmet och finns både i systemet och på <Link href="/hjalp/">webbplatsen</Link>.
            Felrapporter, frågor och förslag från företag som provar systemet tas emot som ärenden på GitHub.
          </p>

          <h2>Var projektet står</h2>
          <p>
            Nav|ERP är i alfa. Senaste version är <Link href="/versioner/">{RELEASES[0]!.version}</Link>. Det går att
            installera och prova, och det finns en <Link href="/kom-igang/#demo">demo</Link> att klicka runt i, men
            systemet är ännu inte redo för skarp drift.
          </p>

          <h2 id="kontakt">Kontakt</h2>
          <ul>
            <li>
              E-post: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              Felrapporter, frågor och förslag: <a href={SITE.newIssueUrl}>skapa ett ärende på GitHub</a>
            </li>
            <li>
              Säkerhetsbrister: <a href={SITE.securityUrl}>rapportera privat</a>, aldrig i ett öppet ärende
            </li>
          </ul>
        </div>
      </div>
      <CtaBand title="Prova själva" text="Klicka runt i demon, eller installera Nav|ERP på en egen server.">
        <div className="btnRow">
          <Link href="/kom-igang/#demo" className="btn btnPrimary">
            Prova demon
          </Link>
          <Link href="/kom-igang/" className="btn btnSecondary">
            Kom igång
          </Link>
        </div>
      </CtaBand>
    </>
  );
}
