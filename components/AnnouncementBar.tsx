import { SITE } from "@/lib/site";
import styles from "./AnnouncementBar.module.css";

// Early-version notice under the header on the start page. Reword when
// Nav|ERP is ready for production.
export function AnnouncementBar() {
  return (
    <section className={styles.bar} aria-label="Tidig version">
      <p className={`container ${styles.inner}`}>
        <span className={styles.badge}>Alfaversion</span>
        <span>
          Nav|ERP 0.1.0-alpha finns nu som öppen källkod <a href={SITE.repoUrl}>på GitHub</a>. Det är en tidig version
          som ännu inte är redo för skarp drift, men den går att prova — och varje synpunkt hjälper oss framåt.
        </span>
      </p>
    </section>
  );
}
