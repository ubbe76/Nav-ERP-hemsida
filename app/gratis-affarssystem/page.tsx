import type { Metadata } from "next";
import Link from "next/link";
import { CostCalculator } from "@/components/CostCalculator";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { HARDWARE } from "@/content/hardware";
import { SITE } from "@/lib/site";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Gratis affärssystem: vad kostar det på fem år?",
  description:
    "Nav|ERP har ingen licenskostnad. Det ni betalar för är server, backup och tid. Så räknar ni totalkostnaden över fem år mot licenser per användare.",
};

const FAQ = [
  {
    question: "Finns det en gräns för hur många användare vi kan ha?",
    answer:
      "Nej. Licensen gäller hela företaget och alla användare, och ingen modul är låst. Fler användare kan däremot kräva en större server.",
  },
  {
    question: "Kostar uppdateringar något?",
    answer:
      "Nej. En ny version hämtas med git och byggs om med Docker. Det som kostar är tiden: att läsa vad som är nytt, köra uppdateringen och kontrollera att allt fungerar.",
  },
  {
    question: "Kan vi köpa support?",
    answer:
      "Det finns ingen betald support och inget serviceavtal från projektet. Frågor och fel tas upp som ärenden på GitHub. Vill ni ha någon som svarar på en viss tid anlitar ni en konsult som kan Docker och PostgreSQL.",
  },
  {
    question: "Vad händer om projektet läggs ner?",
    answer:
      "Programmet fortsätter att fungera på er server, och koden finns kvar under GPL-3.0. Ni eller någon ni anlitar kan rätta fel och bygga vidare. Datan ligger i en vanlig PostgreSQL-databas, och bokföringen går att ta ut som SIE 4-fil.",
  },
];

export default function FreeErpPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: SITE.name, path: "/" }, { name: "Gratis affärssystem" }])} />
      <PageHero
        eyebrow="Vad det kostar"
        title="Gratis affärssystem — och vad det kostar ändå"
        lead="Nav|ERP har ingen licenskostnad. Det ni betalar för är en server, backup och tiden det tar att installera och sköta systemet."
      />
      <div className="container">
        <div className="prose">
          {/* The short answer, written to be quoted as is. */}
          <p>
            Nav|ERP är ett affärssystem med öppen källkod under licensen GPL-3.0. Licensen kostar 0 kr för hela
            företaget, oavsett antal användare, och alla funktioner ingår. Det som kostar är driften: en server för
            några hundra kronor i månaden, extern backup och några timmars arbete för installation och uppdateringar.
            För tio användare blir det i exemplet nedan drygt en tredjedel av vad licenser för 500 kr per
            användare och månad kostar på fem år.
          </p>

          <h2>Det här är gratis</h2>
          <ul>
            <li>Licensen, för alla användare och för alltid.</li>
            <li>
              Alla delar: lager, inköp, försäljning, tillverkning, tid och lön, kalkyl och bokföring. Inga moduler
              att låsa upp.
            </li>
            <li>Uppdateringar till nya versioner.</li>
            <li>Källkoden, som ni får läsa, ändra och bygga vidare på.</li>
          </ul>

          <h2>Det här kostar ändå</h2>
          <ul>
            <li>
              <strong>En server.</strong> En hyrd virtuell server (VPS) eller en maskin i ert eget nätverk. Vad den
              behöver står under <a href="#server">Vad servern behöver</a>.
            </li>
            <li>
              <strong>Extern backup.</strong> Säkerhetskopiorna bör ligga utanför servern. Nav|ERP har skript för en
              krypterad kopia hos en lagringstjänst ni väljer, se{" "}
              <Link href="/hjalp/drift-utveckling/#krypterad-extern-backup-bokforingslagen">manualen</Link>.
            </li>
            <li>
              <strong>Installation.</strong> Någon som är van vid en terminal och Docker. Själva installationen tar
              under en timme, men räkna med en arbetsdag för server, adress, backup och första kontroll.
            </li>
            <li>
              <strong>Drift.</strong> Uppdateringar, en blick på att backupen fungerar och en och annan omstart.
            </li>
            <li>
              <strong>Införande.</strong> Att flytta in artiklar, kunder och leverantörer, ställa in kalkyl och
              bokföring och lära personalen systemet. Det kostar tid med alla affärssystem och ingår därför inte i
              jämförelsen nedan.
            </li>
          </ul>

          <h2 id="rakna">Räkna på fem år</h2>
          <p>
            Kalkylatorn jämför det som skiljer: driften av Nav|ERP mot licenser per användare. Siffrorna är exempel.
            Byt till era egna, till exempel priset i en offert ni har fått.
          </p>
        </div>
        <CostCalculator />
        <div className="prose">
          <h2 id="server">Vad servern behöver</h2>
          <p>{HARDWARE.summary}</p>
          <ul>
            {HARDWARE.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p>
            Hur installationen går till steg för steg står under <Link href="/kom-igang/">Kom igång</Link>.
          </p>

          <h2>Det ska ni också väga in</h2>
          <ul>
            <li>
              Nav|ERP är i alfa och har ännu inte använts i skarp drift. Prova med exempeldata och era egna artiklar
              innan ni bestämmer er.
            </li>
            <li>Ni ansvarar själva för servern, säkerhetsuppdateringarna och att backupen fungerar.</li>
            <li>
              Projektet byggs i dag av en person. Koden finns kvar oavsett, men utvecklingstakten hänger på det.
            </li>
          </ul>

          <h2>Vanliga frågor</h2>
          {FAQ.map(({ question, answer }) => (
            <div key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </div>
      <CtaBand title="Prova utan att betala något" text="Installera Nav|ERP på en server och läs in era egna artiklar.">
        <div className="btnRow">
          <Link href="/kom-igang/" className="btn btnPrimary">
            Kom igång gratis
          </Link>
        </div>
      </CtaBand>
    </>
  );
}
