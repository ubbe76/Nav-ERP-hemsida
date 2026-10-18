import type { Metadata } from "next";
import Link from "next/link";
import { MANUAL_CHAPTERS } from "@/lib/manual";
import { ManualSearch } from "@/components/ManualSearch";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Manual",
  description: "Användarmanualen för Nav|ERP — alla rutiner, kapitel för kapitel.",
};

const GROUPS = [...new Set(MANUAL_CHAPTERS.map((c) => c.group))];

export default function ManualIndex() {
  return (
    <div className="container section">
      <div className="stack">
        <p className="eyebrow">Manual</p>
        <h1>Användarmanualen</h1>
        <p className="lead">
          Samma manual som finns inbyggd i Nav|ERP under Hjälp. Den beskriver varje rutin som den fungerar i dag och
          uppdateras i samma takt som programmet.
        </p>
      </div>
      <div style={{ marginTop: 32, maxWidth: 760 }}>
        <ManualSearch />
      </div>
      {GROUPS.map((group) => (
        <section key={group} className={styles.group}>
          <h2 className={styles.groupTitle}>{group}</h2>
          <ul className={styles.grid}>
            {MANUAL_CHAPTERS.filter((c) => c.group === group).map((c) => (
              <li key={c.slug}>
                <Link href={`/hjalp/${c.slug}/`} className={styles.card}>
                  <span className={styles.title}>{c.title}</span>
                  <span className={styles.desc}>{c.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
