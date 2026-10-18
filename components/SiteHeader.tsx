import { Github, Menu } from "lucide-react";
import Link from "next/link";
import { Wordmark } from "@/components/upstream/Wordmark";
import { getRepoStats } from "@/lib/github";
import { SITE } from "@/lib/site";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./SiteHeader.module.css";

export async function SiteHeader() {
  // A zero count reads as "nobody uses this" — show the number from the first star on.
  const stars = (await getRepoStats()).stars || null;
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="Nav|ERP, till startsidan">
          <Wordmark height={30} />
        </Link>
        <nav className={styles.desktopNav} aria-label="Huvudmeny">
          <NavLinks className={styles.links} linkClassName={styles.link} />
        </nav>
        <div className={styles.actions}>
          <ThemeToggle />
          <a
            className={styles.github}
            href={SITE.repoUrl}
            aria-label={stars === null ? "Källkoden på GitHub" : `Källkoden på GitHub, ${stars} stjärnor`}
          >
            <Github size={18} aria-hidden />
            {stars !== null && <span className="num">{stars}</span>}
          </a>
          <Link href="/kom-igang/" className={`btn btnPrimary btnSmall ${styles.cta}`}>
            Ladda ner
          </Link>
          <MobileMenu
            className={styles.mobileMenu}
            summary={
              <summary aria-label="Meny">
                <Menu size={22} aria-hidden />
              </summary>
            }
          >
            <nav className={styles.mobilePanel} aria-label="Huvudmeny (mobil)">
              <NavLinks className={styles.mobileLinks} linkClassName={styles.mobileLink} />
              <Link href="/kom-igang/" className="btn btnPrimary">
                Ladda ner
              </Link>
            </nav>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
