"use client";

import { useState } from "react";
import { formatKr } from "@/lib/calc";
import { TCO_EXAMPLE, YEARS, tco, type TcoInput, type TcoLine } from "@/lib/tco";
import styles from "./CostCalculator.module.css";

const FIELDS: Array<{ key: keyof TcoInput; label: string; unit: string }> = [
  { key: "users", label: "Användare", unit: "st" },
  { key: "licencePerUserMonth", label: "Licens per användare och månad i systemet ni jämför med", unit: "kr" },
  { key: "serverMonth", label: "Server per månad", unit: "kr" },
  { key: "backupMonth", label: "Extern backup per månad", unit: "kr" },
  { key: "hourlyRate", label: "Timkostnad för er tid eller en konsult", unit: "kr/h" },
  { key: "installHours", label: "Timmar för installationen", unit: "h" },
  { key: "upkeepHoursMonth", label: "Timmar drift per månad", unit: "h" },
];

// Rendered on the server with the example values, so the page shows a full
// worked example without JavaScript; the fields come alive once it loads.
export function CostCalculator() {
  const [input, setInput] = useState<TcoInput>(TCO_EXAMPLE);
  const result = tco(input);
  return (
    <div className={styles.calc}>
      <form className={styles.fields} onSubmit={(e) => e.preventDefault()}>
        {FIELDS.map(({ key, label, unit }) => (
          <label key={key} className={styles.field}>
            <span>{label}</span>
            <span className={styles.input}>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                value={Number.isNaN(input[key]) ? "" : input[key]}
                onChange={(e) => setInput({ ...input, [key]: e.target.valueAsNumber })}
              />
              <span className={styles.unit} aria-hidden>
                {unit}
              </span>
            </span>
          </label>
        ))}
      </form>
      <div className={styles.results} aria-live="polite">
        <Column title={`Nav|ERP, ${YEARS} år`} lines={result.navErp.lines} total={result.navErp.total} />
        <Column title={`Licenser, ${YEARS} år`} lines={result.licensed.lines} total={result.licensed.total} />
        <p className={styles.difference}>
          {result.difference >= 0
            ? `Skillnad på ${YEARS} år: ${formatKr(result.difference)} lägre med Nav|ERP.`
            : `Skillnad på ${YEARS} år: ${formatKr(-result.difference)} högre med Nav|ERP.`}
        </p>
      </div>
    </div>
  );
}

function Column({ title, lines, total }: { title: string; lines: TcoLine[]; total: number }) {
  return (
    <table className={styles.table}>
      <caption>{title}</caption>
      <tbody>
        {lines.map((l) => (
          <tr key={l.label}>
            <th scope="row">{l.label}</th>
            <td className="num">{formatKr(l.amount)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Totalt</th>
          <td className="num">{formatKr(total)}</td>
        </tr>
      </tfoot>
    </table>
  );
}
