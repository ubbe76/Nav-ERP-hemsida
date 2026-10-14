import type { ReactNode } from "react";
import styles from "./CtaBand.module.css";

export function CtaBand({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.band}>
          <div className={styles.text}>
            <h2>{title}</h2>
            <p className="lead">{text}</p>
          </div>
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </section>
  );
}
