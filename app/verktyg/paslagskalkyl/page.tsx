import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { MarkupCalculator } from "@/components/MarkupCalculator";
import { PageHero } from "@/components/PageHero";
import { SITE } from "@/lib/site";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Påläggskalkyl: räkna fram självkostnad och pris",
  description:
    "Räkna en påläggskalkyl med MO-, TO-, LO- och Affo-påslag: från direkt material och lön till tillverkningskostnad, självkostnad och försäljningspris.",
};

const TERMS = [
  { term: "Direkt material", text: "Det material som går åt till just den här produkten, till exempel plåt och skruv." },
  { term: "Direkt lön", text: "Lönekostnaden för tiden som läggs på produkten: tid per operation gånger resursens timkostnad." },
  { term: "Legokostnad", text: "Arbete som köps av en underleverantör, till exempel ytbehandling eller härdning." },
  {
    term: "MO, TO och LO",
    text: "Material-, tillverknings- och legoomkostnader: de indirekta kostnaderna för inköp och lager, för verkstaden och för att hantera legoarbete. De läggs på som procent av material, lön och lego. TO ingår inte i tillverknings- eller självkostnaden utan läggs sist på försäljningspriset.",
  },
  {
    term: "Tillverkningskostnad (TVK)",
    text: "De direkta kostnaderna plus MO och LO. Det produkten kostar att tillverka, utan TO-påslaget.",
  },
  {
    term: "Affo",
    text: "Affärsomkostnader: administration, försäljning och ledning. Läggs på som procent av tillverkningskostnaden.",
  },
  { term: "Självkostnad (SVK)", text: "Tillverkningskostnaden plus Affo. Det produkten kostar företaget totalt." },
  {
    term: "Generellt påslag",
    text: "Vinsten, i procent av självkostnaden. Självkostnaden plus det generella påslaget och TO-påslaget (som inte får något vinstpåslag) är försäljningspriset.",
  },
];

export default function MarkupCalculatorPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: SITE.name, path: "/" }, { name: "Påläggskalkyl" }])} />
      <PageHero
        eyebrow="Verktyg"
        title="Påläggskalkyl"
        lead="Räkna fram tillverkningskostnad, självkostnad och försäljningspris med procentuella påslag, på samma sätt som förkalkylen i Nav|ERP."
      />
      <div className="container">
        <div className="prose">
          <p>
            En påläggskalkyl räknar fram priset på en produkt genom att lägga procentuella påslag på de direkta
            kostnaderna. Material, lön och legoarbete går att koppla till produkten direkt. Övriga kostnader, som
            lokaler, maskiner, inköp och administration, fördelas med påslagen. Fyll i era egna siffror nedan.
          </p>
        </div>
        <MarkupCalculator />
        <div className="prose">
          <h2>Begreppen</h2>
          <dl>
            {TERMS.map(({ term, text }) => (
              <div key={term}>
                <dt>
                  <strong>{term}</strong>
                </dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>

          <h2>Pålägg eller marginal?</h2>
          <p>
            Påslaget räknas på självkostnaden, men täckningsgraden räknas på försäljningspriset. Därför blir de inte
            samma tal: ett påslag på 20 % ger en täckningsgrad på knappt 17 %, och för att få 20 % täckningsgrad
            behöver påslaget vara 25 %. Kalkylatorn ovan visar båda. I Nav|ERP visar marginalrapporten och offerten
            täckningsgraden, mot artikelns senaste förkalkyl.
          </p>

          <h2>Halvfabrikat får inget MO- eller LO-påslag</h2>
          <p>
            Ett halvfabrikat som ni tillverkar själva har redan fått sina påslag i sin egen kalkyl. Därför läggs
            inget MO- eller LO-påslag på det igen. Affo och det generella påslaget träffar däremot hela
            tillverkningskostnaden, eftersom de gäller företaget som helhet.
          </p>

          <h2>Hur stora ska påslagen vara?</h2>
          <p>
            Påslagen bygger på era egna kostnader. Ett vanligt sätt är att ta ett års indirekta kostnader för ett
            område och dela med den direkta kostnad de läggs på. Kostar inköp och lager 150 000 kr på ett år och det
            direkta materialet 1,5 miljoner, blir MO-påslaget 10 %. Se över påslagen när kostnaderna eller volymen
            ändras. Ett påslag som räknats på förra årets volym blir för högt om ni tillverkar mer.
          </p>

          <h2>Påläggskalkyl i Nav|ERP</h2>
          <p>
            I Nav|ERP räknar förkalkylen fram kedjan ur artikelns struktur och rutt, med materialpriser och
            resursernas timkostnad. MO-, LO-, Affo- och det generella påslaget sätts under System → Kalkyler och
            TO-påslaget per resurs. När ordern är klar räknar efterkalkylen samma kedja med verklig förbrukning och
            rapporterad tid.{" "}
            <Link href="/funktioner/kalkyl/">Mer om kalkylen i Nav|ERP</Link> och om påslagen i{" "}
            <Link href="/hjalp/system/#kalkyler">manualen</Link>.
          </p>
        </div>
      </div>
      <CtaBand
        title="Låt systemet räkna åt er"
        text="Nav|ERP räknar förkalkyl och efterkalkyl för varje artikel och order. Gratis och med öppen källkod."
      >
        <div className="btnRow">
          <Link href="/kom-igang/" className="btn btnPrimary">
            Kom igång gratis
          </Link>
        </div>
      </CtaBand>
    </>
  );
}
