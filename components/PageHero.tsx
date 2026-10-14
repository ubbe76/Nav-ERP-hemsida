import type { ReactNode } from "react";
import styles from "./PageHero.module.css";

export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead: string; children?: ReactNode }) {
  return (
    <header className={`container ${styles.hero}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className="lead">{lead}</p>
      {children}
    </header>
  );
}
