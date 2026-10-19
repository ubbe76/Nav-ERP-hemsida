import { FlaskConical } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { CtaBand } from "@/components/CtaBand";
import { DemoBox } from "@/components/DemoBox";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { HARDWARE } from "@/content/hardware";
import { SITE } from "@/lib/site";
import { breadcrumbs } from "@/lib/structured-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Kom igång: installera med Docker",
  description:
    "Installera Nav|ERP på en egen server med Docker: uppmätta serverkrav, steg för steg, import av register, uppdatering, backup och en demo att prova först.",
};

const STEPS: Array<{ title: string; text: React.ReactNode; code?: string }> = [
  {
    title: "Installera Docker och skapa ett servicekonto",
    text: (
      <>
        På en ny Ubuntu- eller Debian-server (hoppa över första raden om Docker redan finns). Nav|ERP körs av ett eget
        konto, här <code>naverp</code> — inte root och inte ert personliga konto. Det äger koden, <code>.env</code>{" "}
        och säkerhetskopiorna. Lägg bara det kontot i gruppen <code>docker</code>: medlemskap där är i praktiken
        root-behörighet på servern.
      </>
    ),
    code: 'curl -fsSL https://get.docker.com | sh\nsudo adduser --disabled-password --gecos "Nav|ERP" naverp\nsudo usermod -aG docker naverp',
  },
  {
    title: "Hämta och konfigurera",
    text: (
      <>
        Logga in som <code>naverp</code>, hämta koden och skapa <code>.env</code> från mallen med kommandona nedan —{" "}
        <code>chmod 600</code> gör att bara kontot kan läsa filen. Fyll sedan i två obligatoriska
        värden i <code>.env</code> — så länge de är tomma vägrar Docker Compose starta:{" "}
        <code>POSTGRES_PASSWORD</code>, databasens lösenord (<code>openssl rand -hex 24</code>), och{" "}
        <code>JWT_SECRET</code>, som signerar inloggningarna (<code>openssl rand -hex 32</code>). Sätt också{" "}
        <code>WEB_ORIGIN</code> till adressen användarna når webben på, t.ex. <code>http://er-server:3000</code>.
        Lämna NEXT_PUBLIC_API_URL tom — webben skickar själv vidare anropen till API:et. Kör ni utan HTTPS i ett
        internt nätverk, sätt även <code>COOKIE_SECURE=false</code>, annars går det inte att logga in.
      </>
    ),
    code: `sudo -iu naverp\ngit clone ${SITE.cloneUrl}\ncd Nav-ERP\ncp .env.example .env\nchmod 600 .env`,
  },
  {
    title: "Starta",
    text: "Första gången byggs alla images — räkna med omkring tio minuter. Databasen skapas och migreras automatiskt när API:et startar.",
    code: "docker compose up -d --build",
  },
  {
    title: "Skapa första användaren",
    text: (
      <>
        Gör det direkt efter starten. Hämta engångskoden som API:et skriver i sin logg med kommandot nedan, gå till{" "}
        <code>http://er-server:3000/register</code> och fyll i den i fältet Engångskod. Koden gör att bara den som
        kommer åt servern kan skapa kontot, och en ny kod skrivs vid varje omstart. Det första kontot blir
        administratör, och sidan stänger sig själv så fort en användare finns. Fler användare skapar
        administratören inifrån systemet.
      </>
    ),
    code: "docker compose logs api | grep Engångskod",
  },
  {
    title: "Öppna bara webben",
    text: (
      <>
        Användarna behöver bara port 3000 — eller hellre en omvänd proxy med HTTPS framför den. Databasen och API:et
        lyssnar redan bara på servern själv. Ändra inte det i <code>docker-compose.yml</code>: Docker går förbi
        brandväggen ufw, så en port som publiceras på alla nätverk blir nåbar från internet även om brandväggen
        säger stängt.
      </>
    ),
  },
];

export default function GetStartedPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: SITE.name, path: "/" }, { name: "Kom igång" }])} />
      <PageHero
        eyebrow="Kom igång"
        title="Från tom server till inloggad"
        lead="Nav|ERP körs i Docker: databas, API och webb i tre containrar. Den här guiden är för den som installerar — IT-ansvarig, konsult eller den på företaget som är van vid en terminal."
      />

      <div className="container">
        <div className={styles.notice} role="note" aria-label="Ännu inte redo för produktion">
          <FlaskConical size={22} aria-hidden className={styles.noticeIcon} />
          <p>
            <strong>Ännu inte redo för produktion.</strong> Nav|ERP är under aktiv utveckling. Prova och utvärdera
            gärna, men använd det ännu inte som ert enda affärssystem eller för er skarpa bokföring. Funktioner kan
            ändras mellan versioner, och det finns säkert fel vi inte har hittat än. Hittar ni ett,{" "}
            <a href={SITE.newIssueUrl}>berätta gärna</a>.
          </p>
        </div>

        <div className={styles.demo}>
          <DemoBox />
        </div>

        <section className={styles.needs}>
          <h2 className={styles.h2}>Det här behöver ni</h2>
          <ul className={styles.list}>
            <li>
              En Linux-server med Docker — en VPS eller en maskin i ert eget nätverk. Node.js och PostgreSQL behövs
              inte, allt körs i containrar. Vill ni prova på en Windows-dator, se <a href="#windows">På Windows</a>{" "}
              nedan.
            </li>
            <li>Git, för att hämta och uppdatera källkoden.</li>
            <li>Någon som är van vid en terminal. Resten av företaget behöver bara en webbläsare.</li>
          </ul>
          <h3 id="krav" className={styles.h3}>
            Serverns storlek
          </h3>
          <p>{HARDWARE.summary}</p>
          <ul className={styles.list}>
            {HARDWARE.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p>
            Vad servern och driften kostar över fem år kan ni räkna på under{" "}
            <Link href="/gratis-affarssystem/">Vad det kostar</Link>.
          </p>
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

        <section id="windows" className={`${styles.needs} ${styles.windows}`} aria-labelledby="windows-rubrik">
          <h2 id="windows-rubrik" className={styles.h2}>
            På Windows
          </h2>
          <p>
            Nav|ERP går också att köra på en Windows-dator med Docker Desktop och WSL 2 — samma containrar som på en
            Linux-server. Det är ännu inte testat i projektet, så se det som ett sätt att prova och utvärdera.
          </p>
          <ul className={styles.list}>
            <li>
              Installera <a href="https://docs.docker.com/desktop/setup/install/windows-install/">Docker Desktop</a>{" "}
              med WSL 2 och en Linux-distribution i WSL, t.ex. Ubuntu (<code>wsl --install</code>).
            </li>
            <li>
              Hämta koden <strong>inne i WSL</strong>, t.ex. till <code>~/Nav-ERP</code> i Ubuntu-terminalen — inte
              under <code>C:\</code>. Följ sedan stegen ovan i den terminalen.
            </li>
            <li>
              Skripten för backup och återställning körs i WSL-terminalen. Hur nattlig backup schemaläggs står i{" "}
              <Link href="/hjalp/drift-utveckling/#windows">manualen</Link>.
            </li>
            <li>
              Docker Desktop är gratis för företag med färre än 250 anställda och under 10 miljoner USD i omsättning.
            </li>
          </ul>
        </section>

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
            <p>
              Nya versioner hämtas med git, och databasen migreras automatiskt när API:et startar. Läs först vad som
              kräver åtgärd under <Link href="/versioner/">Versioner</Link>. Installerade ni före version
              0.1.0-alpha? Lägg då först till <code>POSTGRES_PASSWORD=erp_dev_password</code> i <code>.env</code> — en
              befintlig databas behåller sitt lösenord — och läs README:ns avsnitt om att uppdatera.
            </p>
            <CodeBlock code={"git pull\ndocker compose build --pull\ndocker compose up -d"} />
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
