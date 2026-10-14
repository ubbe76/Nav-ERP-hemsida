import styles from "./AnnouncementBar.module.css";

// Early-version notice under the header on the start page. Reword when
// Nav|ERP is publicly available, and again when it is ready for production.
export function AnnouncementBar() {
  return (
    <section className={styles.bar} aria-label="Tidig version">
      <p className={`container ${styles.inner}`}>
        <span className={styles.badge}>Tidig version</span>
        <span>
          Nav|ERP släpps snart som öppen källkod. Det är en tidig version som ännu inte är redo för skarp drift, men den
          går att prova — och varje synpunkt hjälper oss framåt.
        </span>
      </p>
    </section>
  );
}
