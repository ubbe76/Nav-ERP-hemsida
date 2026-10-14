import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { MANUAL_CHAPTERS, splitAtTitle, type TocEntry } from "@/lib/manual";
import { ChapterToc } from "./ChapterToc";
import { MobileMenu } from "./MobileMenu";
import styles from "./ManualLayout.module.css";

// The chapter's own "# Title" is the page's h1, so this layout adds none.
// Section links: a sticky side list on wide screens, a collapsible list under
// the title on narrow ones (MobileMenu closes it when a link is tapped).
export function ManualLayout({ current, html, toc }: { current: string; html: string; toc: TocEntry[] }) {
  const { title, body } = splitAtTitle(html);
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
      <article className={`prose ${styles.article}`}>
        <div dangerouslySetInnerHTML={{ __html: title }} />
        {toc.length > 0 && (
          <MobileMenu
            className={styles.tocMobile}
            summary={
              <summary>
                I det här kapitlet ({toc.length} avsnitt)
                <ChevronDown size={18} aria-hidden className={styles.chevron} />
              </summary>
            }
          >
            <ul>
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.text}</a>
                </li>
              ))}
            </ul>
          </MobileMenu>
        )}
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </article>
      {toc.length > 0 && <ChapterToc toc={toc} className={styles.toc} titleClassName={styles.tocTitle} />}
    </div>
  );
}
