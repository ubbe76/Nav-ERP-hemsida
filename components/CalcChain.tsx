import { EXAMPLE, calcChain, formatKr, type CalcInput } from "@/lib/calc";
import styles from "./CalcChain.module.css";

// Pure markup: rendered on the server with the example, and inside the
// interactive calculator on /verktyg/paslagskalkyl/ with the visitor's numbers.
export function CalcChain({
  input = EXAMPLE,
  caption = "Räkneexempel: så byggs försäljningspriset upp",
  note = "Påslagen sätter ni själva under System → Kalkyler, TO-påslaget per resurs. Beloppen i exemplet är påhittade.",
}: {
  input?: CalcInput;
  caption?: string;
  note?: string;
}) {
  const { lines } = calcChain(input);
  const parts = lines.filter((l) => l.kind !== "subtotal" && l.amount > 0);
  return (
    <figure className={styles.calc}>
      {/* Price composition: base costs neutral, markups in the accent. */}
      <div className={styles.bar} aria-hidden>
        {parts.map((l) => (
          <span key={l.label} className={styles.segment} data-kind={l.kind} style={{ flexGrow: l.amount }} />
        ))}
      </div>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <tbody>
          {lines.map((l) => (
            <tr key={l.label} data-kind={l.kind}>
              <th scope="row">
                <span className={styles.swatch} data-kind={l.kind} aria-hidden />
                {l.label}
              </th>
              <td className="num">{formatKr(l.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {note && <figcaption className={styles.note}>{note}</figcaption>}
    </figure>
  );
}
