import { ArrowRight, KeyRound, Receipt, Wrench } from "lucide-react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CalcChain } from "@/components/CalcChain";
import { CodeBlock } from "@/components/CodeBlock";
import { CtaBand } from "@/components/CtaBand";
import { HubDiagram } from "@/components/HubDiagram";
import { Reveal } from "@/components/Reveal";
import { Screenshot } from "@/components/Screenshot";
import { RELEASES } from "@/content/releases";
import type { ScreenshotKey } from "@/content/screenshots";
import { SITE } from "@/lib/site";
import styles from "./page.module.css";

const VALUES = [
  {
    icon: KeyRound,
    title: "Ingen licenskostnad, ingen inlåsning",
    text: "Nav|ERP är fri programvara under GPL. Ni betalar inget per användare och år, er data ligger i en vanlig PostgreSQL-databas, och ni kan alltid ta systemet med er vidare.",
  },
  {
    icon: Wrench,
    title: "Byggt från verkstadsgolvet",
    text: "Systemet byggs av Urban Källefors, som arbetar dagligen med inköp, tillverkning och kalkyl. Rutinerna följer hur ett tillverkande företag faktiskt jobbar.",
  },
  {
    icon: Receipt,
    title: "Svenskt på riktigt",
    text: "SIE till revisorn, PAXml till lönesystemet, bankfiler för in- och utbetalningar, momsrapport och ATF. Svenska begrepp hela vägen, från beredning till efterkalkyl.",
  },
];

const SHOWCASE: Array<{ shot: ScreenshotKey; title: string; text: string; href: string; more: string }> = [
  {
    shot: "article",
    title: "Beredning med struktur och rutt",
    text: "Artikelträdet och operationerna på samma flik. Ställtid, tid per enhet och resurs för varje operation — underlaget för både planering och kalkyl.",
    href: "/funktioner/tillverkning/#beredning",
    more: "Mer om tillverkning",
  },
  {
    shot: "article-overview",
    title: "Disponibelt, rad för rad",
    text: "Artikelöversikten lägger alla behov och allt inkommande i datumordning och räknar disponibelt efter varje rad. Ni ser direkt när det tar slut — och varför.",
    href: "/funktioner/lager-och-artiklar/#planering",
    more: "Mer om lager och artiklar",
  },
  {
    shot: "manufacturing-orders",
    title: "Tillverkningsordrar med tydlig status",
    text: "Från frisläppt till stängd, med materialuttag och tid från stämpelterminalen. En klar order ger efterkalkyl.",
    href: "/funktioner/tillverkning/#ordrar",
    more: "Mer om tillverkningsorder",
  },
];

const COSTS = [
  { value: "0 kr", title: "Licens", text: "För alla användare, för alltid. Inga moduler att låsa upp." },
  { value: "En server", title: "Drift", text: "En VPS eller en maskin i ert eget nätverk. Hyr ni en VPS räcker oftast ett par hundra kronor i månaden." },
  { value: "Er tid", title: "Installation", text: "Någon som kan Docker — er IT-ansvarige, en konsult ni själva väljer, eller ni själva." },
];

const INSTALL = `git clone ${SITE.cloneUrl}
cd Nav-ERP
cp .env.example .env    # byt JWT_SECRET innan ni går live
docker compose up -d --build`;

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroText}>
          <p className="eyebrow">Öppen källkod · GPL-3.0</p>
          <h1 className={styles.heroTitle}>
            Affärssystemet för svensk tillverkning.{" "}
            <span>Öppet, självhostat och utan licensavgifter.</span>
          </h1>
          <p className={`lead ${styles.heroLead}`}>
            Artiklar, lager, inköp, försäljning, tillverkning, tid, kalkyl och bokföring i ett och samma system — byggt
            för mindre och medelstora tillverkande företag.
          </p>
          <div className={`btnRow ${styles.actions}`}>
            <Link href="/kom-igang/" className="btn btnPrimary">
              Kom igång gratis <ArrowRight size={18} aria-hidden />
            </Link>
            <Link href="/funktioner/" className="btn btnSecondary">
              Se funktionerna
            </Link>
          </div>
          <p className={styles.note}>Körs på er egen server med Docker. Ingen registrering.</p>
        </div>
        <div className={styles.heroShot}>
          <Screenshot shot="dashboard" />
        </div>
      </section>

      {/* The one-paragraph answer to "what is Nav|ERP?" — written to be quoted as is. */}
      <section className="container" aria-labelledby="vad-ar-nav-erp">
        <div className={styles.definition}>
          <h2 id="vad-ar-nav-erp">Vad är Nav|ERP?</h2>
          <p className="lead">
            Nav|ERP är ett affärssystem (ERP) med öppen källkod för mindre och medelstora tillverkande företag i
            Sverige. Det samlar artiklar, lager, inköp, försäljning, tillverkning, tid, kalkyl och bokföring i ett
            system, är gratis under licensen GPL-3.0 och körs på företagets egen server med Docker och PostgreSQL.
            Nav|ERP byggs av Urban Källefors och är ännu i alfa — senaste version är {RELEASES[0]!.version}.
          </p>
        </div>
      </section>

      <section className={`section ${styles.alt}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="eyebrow">Ett system</p>
            <h2>Allt hänger ihop — och allt landar i kalkylen</h2>
            <p className="lead">
              En kundorder blir behov, behovet blir inköp och tillverkning, tiden från verkstaden blir kostnad och
              fakturan bokförs av sig själv. Inga integrationer mellan olika program, inga dubbelregistreringar.
            </p>
          </div>
          <HubDiagram />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ul className={styles.values}>
            {VALUES.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Reveal className={styles.value}>
                  <Icon size={26} aria-hidden className={styles.valueIcon} />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="eyebrow">Produkten</p>
            <h2>Direkt ur Nav|ERP</h2>
          </div>
          <div className={styles.showcase}>
            {SHOWCASE.map((item) => (
              <Reveal key={item.shot} className={styles.row}>
                <div className={styles.rowText}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link href={item.href} className={styles.more}>
                    {item.more} <ArrowRight size={16} aria-hidden />
                  </Link>
                </div>
                <Screenshot shot={item.shot} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.alt}`}>
        <div className={`container ${styles.calc}`}>
          <div className={styles.sectionHead}>
            <p className="eyebrow">Kalkyl</p>
            <h2>Vet vad det kostar innan ni lovar ett pris</h2>
            <p className="lead">
              Förkalkylen räknar fram självkostnad och försäljningspris ur struktur och rutt. Efterkalkylen visar vad
              ordern faktiskt kostade. Påslagen är era egna.
            </p>
            <Link href="/funktioner/kalkyl/" className={styles.more}>
              Så fungerar kalkylen <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <CalcChain />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="eyebrow">Vad det kostar</p>
            <h2>Programvaran är gratis</h2>
            <p className="lead">Det ni står för är en server att köra den på och någon som installerar.</p>
          </div>
          <ul className={styles.costs}>
            {COSTS.map((c) => (
              <li key={c.title} className={styles.cost}>
                <span className={styles.costValue}>{c.value}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Kör igång på några minuter"
        text="Allt som behövs är en server med Docker. Databasen, API:et och webben startar med ett kommando."
      >
        <CodeBlock code={INSTALL} label="Terminal" />
        <div className="btnRow">
          <Link href="/kom-igang/" className="btn btnPrimary">
            Hela installationsguiden
          </Link>
          <a href={SITE.repoUrl} className="btn btnSecondary">
            Källkoden på GitHub
          </a>
        </div>
      </CtaBand>
    </>
  );
}
