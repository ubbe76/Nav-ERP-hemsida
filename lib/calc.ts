// The cost chain Nav|ERP's calculation uses (manual: System → Kalkyler),
// for the worked example on the site. All markups are percentages.
export interface CalcInput {
  material: number;
  moPct: number;
  labour: number;
  toPct: number;
  subcontract: number;
  loPct: number;
  semiFinished: number;
  affoPct: number;
  generalPct: number;
}

export interface CalcLine {
  label: string;
  amount: number;
  kind: "base" | "markup" | "subtotal";
}

const pct = (n: number) => `${new Intl.NumberFormat("sv-SE").format(n)} %`;

export function calcChain(i: CalcInput): { lines: CalcLine[]; tvk: number; svk: number; price: number } {
  const mo = (i.material * i.moPct) / 100;
  const to = (i.labour * i.toPct) / 100;
  const lo = (i.subcontract * i.loPct) / 100;
  // Semi-finished goods carry no MO/LO markup — it's already inside their own cost.
  const tvk = i.material + mo + i.labour + to + i.subcontract + lo + i.semiFinished;
  const affo = (tvk * i.affoPct) / 100;
  const svk = tvk + affo;
  const general = (svk * i.generalPct) / 100;
  const price = svk + general;

  const lines: CalcLine[] = [
    { label: "Direkt material", amount: i.material, kind: "base" },
    { label: `MO-påslag ${pct(i.moPct)}`, amount: mo, kind: "markup" },
    { label: "Direkt lön", amount: i.labour, kind: "base" },
    { label: `TO-påslag ${pct(i.toPct)}`, amount: to, kind: "markup" },
    { label: "Legokostnad", amount: i.subcontract, kind: "base" },
    { label: `LO-påslag ${pct(i.loPct)}`, amount: lo, kind: "markup" },
    ...(i.semiFinished > 0 ? [{ label: "Halvfabrikat", amount: i.semiFinished, kind: "base" } as const] : []),
    { label: "Tillverkningskostnad", amount: tvk, kind: "subtotal" },
    { label: `Affo-påslag ${pct(i.affoPct)}`, amount: affo, kind: "markup" },
    { label: "Självkostnad", amount: svk, kind: "subtotal" },
    { label: `Generellt påslag ${pct(i.generalPct)}`, amount: general, kind: "markup" },
    { label: "Försäljningspris", amount: price, kind: "subtotal" },
  ];
  return { lines, tvk, svk, price };
}

/** Made-up numbers for the worked example. */
export const EXAMPLE: CalcInput = {
  material: 1000,
  moPct: 10,
  labour: 600,
  toPct: 40,
  subcontract: 200,
  loPct: 5,
  semiFinished: 0,
  affoPct: 8,
  generalPct: 20,
};

export function formatKr(n: number): string {
  return `${new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(n)} kr`;
}
