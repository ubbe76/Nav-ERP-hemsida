import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { RELEASES } from "@/content/releases";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Om Nav|ERP: vem som bygger det och hur ni når oss",
  description:
    "Nav|ERP byggs av Urban Källefors, som arbetar dagligen med inköp, tillverkning och kalkyl. Varför systemet finns, var det står och hur ni når projektet.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Om Nav|ERP"
        title="Ett affärssystem byggt från verkstadsgolvet"
        lead="Nav|ERP byggs av Urban Källefors, som arbetar dagligen med inköp, tillverkning, lager och kalkyl i ett tillverkande företag."
      />
      <div className="container">
        <div className="prose">
          <h2>Varför Nav|ERP finns</h2>
          <p>
            Målet är ett system som täcker kärnflödet från artikel till kalkyl och bokföring — utan den komplexitet som
            gör stora affärssystem tunga att införa och dyra att äga. Rutinerna följer hur ett tillverkande företag
            faktiskt jobbar, och systemet är fri programvara, så att inget företag blir beroende av en enda
            leverantör.{" "}
            <Link href="/oppen-kallkod/">Vad öppen källkod betyder för er</Link>.
          </p>

          <h2>Var projektet står</h2>
          <p>
            Nav|ERP är i alfa — senaste version är <Link href="/versioner/">{RELEASES[0]!.version}</Link>. Det går att
            installera och prova, men det är ännu inte redo för skarp drift.
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
      <CtaBand title="Prova själva" text="Installera Nav|ERP på en egen server och se om det passar ert företag.">
        <div className="btnRow">
          <Link href="/kom-igang/" className="btn btnPrimary">
            Kom igång
          </Link>
        </div>
      </CtaBand>
    </>
  );
}
