import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Kom igång",
  description: "Installera Nav|ERP på en egen server med Docker: krav, steg för steg, import av register, uppdatering och backup.",
};

const STEPS: Array<{ title: string; text: React.ReactNode; code?: string }> = [
  {
    title: "Installera Docker",
    text: "Hoppa över steget om servern redan har Docker. På en ny Ubuntu- eller Debian-server:",
    code: "curl -fsSL https://get.docker.com | sh\nsudo usermod -aG docker $USER   # logga ut och in igen",
  },
  {
    title: "Hämta och konfigurera",
    text: (
      <>
        Öppna sedan <code>.env</code> och sätt <code>JWT_SECRET</code> till ett slumpat värde (
        <code>openssl rand -hex 32</code>), och <code>NEXT_PUBLIC_API_URL</code> och <code>WEB_ORIGIN</code> till
        serverns adress — inte <code>localhost</code>. Kör ni utan HTTPS i ett internt nätverk, sätt även{" "}
        <code>COOKIE_SECURE=false</code>, annars går det inte att logga in.
      </>
    ),
    code: `git clone ${SITE.cloneUrl}\ncd Nav-ERP\ncp .env.example .env`,
  },
  {
    title: "Starta",
    text: "Första gången byggs alla images — räkna med några minuter. Databasen skapas och migreras automatiskt när API:et startar.",
    code: "docker compose up -d --build",
  },
  {
    title: "Skapa första användaren",
    text: (
      <>
        Gå till <code>http://er-server:3000/register</code>. Det första kontot blir administratör, och sidan stänger
        sig själv så fort en användare finns. Fler användare skapar administratören inifrån systemet.
      </>
    ),
  },
  {
    title: "Stäng databasporten",
    text: (
      <>
        Ska servern nås från internet: ta bort raderna <code>ports: - &quot;5432:5432&quot;</code> under{" "}
        <code>postgres</code> i <code>docker-compose.yml</code>. Bara containrarna behöver nå databasen. Öppna port
        3000 (webben) och 4000 (API:et) för användarna.
      </>
    ),
  },
];

export default function GetStartedPage() {
  return (
    <>
      <PageHero
        eyebrow="Kom igång"
        title="Från noll till inloggad på några minuter"
        lead="Nav|ERP körs i Docker: databas, API och webb i tre containrar. Den här guiden är för den som installerar — IT-ansvarig, konsult eller den på företaget som är van vid en terminal."
      />

      <div className="container">
        <section className={styles.needs}>
          <h2 className={styles.h2}>Det här behöver ni</h2>
          <ul className={styles.list}>
            <li>
              En Linux-server med Docker — en VPS eller en maskin i ert eget nätverk. Node.js och PostgreSQL behövs
              inte, allt körs i containrar.
            </li>
            <li>Git, för att hämta och uppdatera källkoden.</li>
            <li>Någon som är van vid en terminal. Resten av företaget behöver bara en webbläsare.</li>
          </ul>
        </section>

        <ol className={styles.steps} aria-label="Installationssteg">
          {STEPS.map((step, i) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.number} aria-hidden>
                {i + 1}
              </span>
              <div className={styles.stepBody}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                {step.code && <CodeBlock code={step.code} />}
              </div>
            </li>
          ))}
        </ol>

        <section className={styles.after}>
          <div>
            <h2 className={styles.h2}>Läs in era register</h2>
            <p>
              Artiklar, struktur, operationer, kunder, leverantörer, priser och resurser kan läsas in från CSV, så ni
              slipper knappa in allt för hand.
            </p>
            <ul className={styles.links}>
              <li><Link href="/hjalp/artiklar/#importera-artiklar">Importera artiklar</Link></li>
              <li><Link href="/hjalp/forsaljning/#importera-kunder">Importera kunder</Link></li>
              <li><Link href="/hjalp/inkop/#importera-leverantorer">Importera leverantörer</Link></li>
            </ul>
          </div>
          <div>
            <h2 className={styles.h2}>Uppdatera</h2>
            <p>Nya versioner hämtas med git. Databasen migreras automatiskt när API:et startar.</p>
            <CodeBlock code={"git pull\ndocker compose up -d --build"} />
          </div>
          <div>
            <h2 className={styles.h2}>Säkerhetskopiering</h2>
            <p>
              En administratör kan när som helst ladda ner en komplett databasdump under System → Säkerhetskopiering.
              Nattlig backup och återställning beskrivs i manualen.
            </p>
            <ul className={styles.links}>
              <li><Link href="/hjalp/drift-utveckling/#backup">Backup och återställning</Link></li>
            </ul>
          </div>
        </section>
      </div>

      <CtaBand
        title="All teknisk dokumentation"
        text="README:n i källkoden beskriver allt i detalj: miljövariabler, flytt till en ny server, tester och begränsningar."
      >
        <div className="btnRow">
          <a href={`${SITE.repoUrl}#readme`} className="btn btnPrimary">
            README på GitHub
          </a>
          <Link href="/hjalp/" className="btn btnSecondary">
            Användarmanualen
          </Link>
        </div>
      </CtaBand>
    </>
  );
}
