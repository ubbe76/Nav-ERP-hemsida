import styles from "./AnnouncementBar.module.css";

// Pre-launch notice under the header on the start page. Remove (or reword)
// when Nav|ERP is publicly available.
export function AnnouncementBar() {
  return (
    <section className={styles.bar} aria-label="Kommer snart">
      <p className={`container ${styles.inner}`}>
        <span className={styles.badge}>Kommer snart</span>
        <span>
          Nav|ERP släpps som öppen källkod inom kort. Manualen och installationsguiden kan du läsa redan nu.
        </span>
      </p>
    </section>
  );
}
