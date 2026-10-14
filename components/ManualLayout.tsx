import Link from "next/link";
import { MANUAL_CHAPTERS, type TocEntry } from "@/lib/manual";
import styles from "./ManualLayout.module.css";

// The chapter's own "# Title" is the page's h1, so this layout adds none.
export function ManualLayout({ current, html, toc }: { current: string; html: string; toc: TocEntry[] }) {
  return (
    <div className={`container ${styles.layout}`}>
      <nav className={styles.chapters} aria-label="Manualens kapitel">
        <Link href="/hjalp/" className={styles.home}>
          Manual
        </Link>
        <ul>
          {MANUAL_CHAPTERS.map((c) => (
            <li key={c.slug}>
              <Link href={`/hjalp/${c.slug}/`} aria-current={c.slug === current ? "page" : undefined}>
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <article className={`prose ${styles.article}`} dangerouslySetInnerHTML={{ __html: html }} />
      {toc.length > 0 && (
        <nav className={styles.toc} aria-label="I det här kapitlet">
          <p className={styles.tocTitle}>I det här kapitlet</p>
          <ul>
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
