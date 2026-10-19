import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { GUIDE, STATUS_LABELS } from "@/content/guide";
import { SITE } from "@/lib/site";
import { breadcrumbs } from "@/lib/structured-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Affärssystem för tillverkning: det här ska det klara",
  description:
    "En checklista för mindre tillverkande företag som väljer affärssystem: struktur och rutt, kalkyl, planering, stämpling, lager, svensk bokföring, drift och kostnad.",
};

const all = GUIDE.flatMap((g) => g.items);

export default function ManufacturingErpGuide() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: SITE.name, path: "/" }, { name: "Affärssystem för tillverkning" }])} />
      <PageHero
        eyebrow="Guide"
        title="Affärssystem för tillverkning: det här ska det klara"
        lead="En checklista för mindre och medelstora tillverkande företag som ska välja affärssystem. Ställ frågorna till varje system ni tittar på."
      />
      <div className="container">
        <div className="prose">
          {/* The short answer, written to be quoted as is. */}
          <p>
            Ett affärssystem för ett tillverkande företag behöver mer än ett vanligt affärssystem. Det ska hålla ihop
            artikelns struktur och rutt, kalkylen före och efter, planeringen av material och kapacitet, tiden från
            verkstaden och ekonomin, så att en kundorder blir inköp, tillverkning, leverans, faktura och bokföring utan
            att något knappas in två gånger. För ett svenskt företag tillkommer moms, SIE, löneunderlag och bankens
            filer.
          </p>
          <p>
            Under varje fråga står vad ni bör kräva, och därefter hur Nav|ERP klarar det i dag:{" "}
            {all.filter((i) => i.status === "ja").length} av {all.length} punkter finns,{" "}
            {all.filter((i) => i.status === "delvis").length} finns delvis. Nav|ERP är i alfa, så se svaren som en
            beskrivning av vad som är byggt, inte som ett löfte om skarp drift.
          </p>
        </div>

        <nav className={styles.toc} aria-label="Innehåll">
          <ol>
            {GUIDE.map((g) => (
              <li key={g.title}>
                <a href={`#${g.items[0]!.id}`}>{g.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.groups}>
          {GUIDE.map((group) => (
            <section key={group.title} className={styles.group} aria-labelledby={`grupp-${group.items[0]!.id}`}>
              <h2 id={`grupp-${group.items[0]!.id}`} className={styles.groupTitle}>
                {group.title}
              </h2>
              <div>
                {group.items.map((item) => (
                  <div key={item.id} id={item.id} className={styles.item}>
                    <h3 className={styles.question}>{item.question}</h3>
                    <p>{item.demand}</p>
                    <div className={styles.answer} data-status={item.status}>
                      <span className={styles.status}>{STATUS_LABELS[item.status]} i Nav|ERP</span>
                      <p>
                        {item.navErp}
                        {item.more && (
                          <>
                            {" "}
                            <Link href={item.more.href}>{item.more.label}</Link>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="prose">
          <h2>Det som ofta glöms</h2>
          <ul>
            <li>
              <strong>Datan från det gamla systemet.</strong> Ta reda på vad som kan importeras och vad som måste läggas
              in för hand, till exempel lagersaldon och öppna ordrar.
            </li>
            <li>
              <strong>Tiden för införandet.</strong> Grunddata, kalkylinställningar och utbildning tar tid med alla
              system, oavsett vad licensen kostar.
            </li>
            <li>
              <strong>Vem som svarar när något går fel.</strong> En leverantör, er egen IT eller en konsult. Bestäm det
              innan ni går i skarp drift.
            </li>
            <li>
              <strong>Att prova med egna data.</strong> En demo med påhittad data visar flödet, men först med era egna
              artiklar och rutter ser ni om systemet passar.
            </li>
          </ul>
          <p>
            Fler frågor och svar om Nav|ERP finns under <Link href="/fragor/">Vanliga frågor</Link>.
          </p>
        </div>
      </div>
      <CtaBand
        title="Ställ frågorna till Nav|ERP själva"
        text="Klicka runt i demon med påhittad data, eller installera och prova med era egna artiklar."
      >
        <div className="btnRow">
          <Link href="/kom-igang/#demo" className="btn btnPrimary">
            Prova demon
          </Link>
          <Link href="/kom-igang/" className="btn btnSecondary">
            Kom igång gratis
          </Link>
        </div>
      </CtaBand>
    </>
  );
}
