import Link from "next/link";
import { Wordmark } from "@/components/upstream/Wordmark";
import { getRepoStats } from "@/lib/github";
import { SITE } from "@/lib/site";
import styles from "./SiteFooter.module.css";

export async function SiteFooter() {
  const { release } = await getRepoStats();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <Wordmark height={28} />
          <p className={styles.tagline}>Öppet affärssystem för svensk tillverkning.</p>
          {release && (
            <p className={styles.meta}>
              Senaste version: <a href={release.url}>{release.tag}</a>
            </p>
          )}
        </div>
        <nav className={styles.cols} aria-label="Sidfot">
          <div>
            <h2 className={styles.colTitle}>Produkt</h2>
            <ul>
              <li><Link href="/funktioner/">Funktioner</Link></li>
              <li><Link href="/kom-igang/">Kom igång</Link></li>
              <li><Link href="/hjalp/">Manual</Link></li>
            </ul>
          </div>
          <div>
            <h2 className={styles.colTitle}>Öppen källkod</h2>
            <ul>
              <li><Link href="/oppen-kallkod/">Varför öppen källkod</Link></li>
              <li><a href={SITE.repoUrl}>Källkoden på GitHub</a></li>
              <li><a href="https://www.gnu.org/licenses/gpl-3.0.html">Licens: GPL-3.0-or-later</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <div className={`container ${styles.bottom}`}>
        © 2026 Urban Källefors. Nav|ERP är fri programvara och levereras utan garanti.
      </div>
    </footer>
  );
}
