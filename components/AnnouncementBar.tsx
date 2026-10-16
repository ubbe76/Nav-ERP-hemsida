import Link from "next/link";
import { RELEASES } from "@/content/releases";
import { SITE } from "@/lib/site";
import styles from "./AnnouncementBar.module.css";

// Early-version notice under the header on the start page. The version is the
// newest entry in content/releases.ts, so a release only needs that entry.
// Reword when Nav|ERP is ready for production.
export function AnnouncementBar() {
  const latest = RELEASES[0]!;
  return (
    <section className={styles.bar} aria-label="Tidig version">
      <p className={`container ${styles.inner}`}>
        <span className={styles.badge}>Alfaversion</span>
        <span>
          Nav|ERP {latest.version} finns som öppen källkod <a href={SITE.repoUrl}>på GitHub</a> —{" "}
          <Link href="/versioner/">se vad som är nytt</Link>. Det är en tidig version som ännu inte är redo för skarp
          drift, men den går att prova — och varje synpunkt hjälper oss framåt.
        </span>
      </p>
    </section>
  );
}
