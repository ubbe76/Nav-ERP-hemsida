"use client";

import { useState } from "react";
import { EXAMPLE, type CalcInput } from "@/lib/calc";
import { CalcChain } from "./CalcChain";
import styles from "./MarkupCalculator.module.css";

const GROUPS: Array<{ title: string; fields: Array<{ key: keyof CalcInput; label: string; unit: string }> }> = [
  {
    title: "Direkta kostnader per styck",
    fields: [
      { key: "material", label: "Direkt material", unit: "kr" },
      { key: "labour", label: "Direkt lön", unit: "kr" },
      { key: "subcontract", label: "Legokostnad", unit: "kr" },
      { key: "semiFinished", label: "Halvfabrikat", unit: "kr" },
    ],
  },
  {
    title: "Påslag",
    fields: [
      { key: "moPct", label: "MO-påslag, på materialet", unit: "%" },
      { key: "toPct", label: "TO-påslag, på lönen", unit: "%" },
      { key: "loPct", label: "LO-påslag, på legot", unit: "%" },
      { key: "affoPct", label: "Affo-påslag, på tillverkningskostnaden", unit: "%" },
      { key: "generalPct", label: "Generellt påslag, på självkostnaden", unit: "%" },
    ],
  },
];

const clean = (input: CalcInput): CalcInput =>
  Object.fromEntries(
    Object.entries(input).map(([k, v]) => [k, Number.isFinite(v) && v > 0 ? v : 0]),
  ) as unknown as CalcInput;

// Rendered on the server with the example, so the page works without
// JavaScript; the fields come alive once it loads.
export function MarkupCalculator() {
  const [input, setInput] = useState<CalcInput>(EXAMPLE);
  return (
    <div className={styles.calc}>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        {GROUPS.map((group) => (
          <fieldset key={group.title} className={styles.group}>
            <legend>{group.title}</legend>
            {group.fields.map(({ key, label, unit }) => (
              <label key={key} className={styles.field}>
                <span>{label}</span>
                <span className={styles.input}>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    value={Number.isNaN(input[key]) ? "" : input[key]}
                    onChange={(e) => setInput({ ...input, [key]: e.target.valueAsNumber })}
                  />
                  <span className={styles.unit} aria-hidden>
                    {unit}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        ))}
      </form>
      <div aria-live="polite">
        <CalcChain input={clean(input)} caption="Er kalkyl per styck" note="" />
      </div>
    </div>
  );
}
