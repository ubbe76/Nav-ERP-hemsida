// Five-year cost of running Nav|ERP versus paying per-user licences, for the
// calculator on /gratis-affarssystem/. Only what differs between the two is
// counted: introduction, training and moving data cost time in both cases.
export interface TcoInput {
  users: number;
  /** Licence per user and month in the system being compared with. */
  licencePerUserMonth: number;
  /** Server rent (or the share of an own machine) per month. */
  serverMonth: number;
  /** Off-site backup storage per month. */
  backupMonth: number;
  /** What an hour of your own or a consultant's time costs. */
  hourlyRate: number;
  installHours: number;
  /** Updates, checking the backup, the odd restart. */
  upkeepHoursMonth: number;
}

export const YEARS = 5;
const MONTHS = YEARS * 12;

// Defaults for the calculator — examples to replace, not a market survey.
export const TCO_EXAMPLE: TcoInput = {
  users: 10,
  licencePerUserMonth: 500,
  serverMonth: 300,
  backupMonth: 50,
  hourlyRate: 700,
  installHours: 8,
  upkeepHoursMonth: 2,
};

export interface TcoLine {
  label: string;
  amount: number;
}

export interface TcoResult {
  navErp: { lines: TcoLine[]; total: number };
  licensed: { lines: TcoLine[]; total: number };
  difference: number;
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function tco(input: TcoInput): TcoResult {
  const i = Object.fromEntries(Object.entries(input).map(([k, v]) => [k, clean(v)])) as unknown as TcoInput;
  const navLines: TcoLine[] = [
    { label: "Licens", amount: 0 },
    { label: "Server", amount: i.serverMonth * MONTHS },
    { label: "Extern backup", amount: i.backupMonth * MONTHS },
    { label: "Installation", amount: i.installHours * i.hourlyRate },
    { label: "Drift och uppdateringar", amount: i.upkeepHoursMonth * MONTHS * i.hourlyRate },
  ];
  const licensedLines: TcoLine[] = [{ label: "Licenser", amount: i.users * i.licencePerUserMonth * MONTHS }];
  const sum = (lines: TcoLine[]) => lines.reduce((s, l) => s + l.amount, 0);
  const navTotal = sum(navLines);
  const licensedTotal = sum(licensedLines);
  return {
    navErp: { lines: navLines, total: navTotal },
    licensed: { lines: licensedLines, total: licensedTotal },
    difference: licensedTotal - navTotal,
  };
}
