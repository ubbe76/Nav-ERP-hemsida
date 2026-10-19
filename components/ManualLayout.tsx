import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { RELEASES } from "@/content/releases";
import { MANUAL_CHAPTERS, splitAtTitle, type TocEntry } from "@/lib/manual";
import { ChapterToc } from "./ChapterToc";
import { ManualSearch } from "./ManualSearch";
import { MobileMenu } from "./MobileMenu";
import styles from "./ManualLayout.module.css";

// The chapter's own "# Title" is the page's h1, so this layout adds none.
// Section links: a sticky side list on wide screens, a collapsible list under
// the title on narrow ones (MobileMenu closes it when a link is tapped).
export function ManualLayout({
  current,
  html,
  toc,
  updated,
}: {
  current: string;
  html: string;
  toc: TocEntry[];
  /** ISO timestamp of the chapter's last change, when known. */
  updated?: string;
}) {
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
              {/* No prefetch: the list in view would otherwise fetch every chapter (~280 KiB). */}
              <Link
                href={`/hjalp/${c.slug}/`}
                prefetch={false}
                aria-current={c.slug === current ? "page" : undefined}
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <article className={`prose ${styles.article}`}>
        <ManualSearch />
        <div dangerouslySetInnerHTML={{ __html: title }} />
        {/* The manual follows Nav-ERP's main branch, so it can run ahead of the latest
            release: the line names the latest version rather than claiming the chapter
            matches it. */}
        <p className={styles.meta}>
          {updated ? (
            <>
              Uppdaterad <time dateTime={updated}>{formatDate(updated)}</time> · senaste version{" "}
            </>
          ) : (
            "Senaste version "
          )}
          <Link href="/versioner/">{RELEASES[0]!.version}</Link>
        </p>
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

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("sv-SE", { dateStyle: "long", timeZone: "Europe/Stockholm" }).format(new Date(date));
