import { EXAMPLE, calcChain, formatKr } from "@/lib/calc";
import styles from "./CalcChain.module.css";

export function CalcChain() {
  const { lines } = calcChain(EXAMPLE);
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
        <caption className={styles.caption}>Räkneexempel: så byggs försäljningspriset upp</caption>
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
      <figcaption className={styles.note}>
        Påslagen sätter ni själva under System → Kalkyler, TO-påslaget per resurs. Beloppen i exemplet är påhittade.
      </figcaption>
    </figure>
  );
}
