import Link from "next/link";
import { HUB_CENTER, HUB_SPOKES } from "@/content/areas";
import { Reveal } from "./Reveal";
import styles from "./HubDiagram.module.css";

// Six spokes like the logo's hub symbol, clockwise from twelve o'clock.
// Coordinates are percentages of a square.
const ANGLES = [-90, -30, 30, 90, 150, 210];

function point(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
}

export function HubDiagram() {
  return (
    <Reveal className={styles.hub}>
      <svg className={styles.lines} viewBox="0 0 100 100" aria-hidden>
        {ANGLES.map((deg) => {
          const a = point(deg, 13);
          const b = point(deg, 27);
          return <line key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} pathLength={1} />;
        })}
      </svg>
      <ul className={styles.spokes}>
        {HUB_SPOKES.map((spoke, i) => {
          const p = point(ANGLES[i] ?? 0, 38);
          return (
            <li key={spoke.label} className={styles.spoke} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <Link href={spoke.href} className={styles.card}>
                <span className={styles.label}>{spoke.label}</span>
                <span className={styles.text}>{spoke.text}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href={HUB_CENTER.href} className={styles.center}>
        <span className={styles.centerLabel}>{HUB_CENTER.label}</span>
        <span className={styles.centerText}>{HUB_CENTER.text}</span>
      </Link>
    </Reveal>
  );
}
