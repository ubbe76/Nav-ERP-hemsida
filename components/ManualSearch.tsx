"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { withBase } from "@/lib/site";
import { searchSections, type ManualSection, type SnippetPart } from "@/lib/upstream/manualSearch";
import styles from "./ManualSearch.module.css";

function Parts({ parts }: { parts: SnippetPart[] }) {
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className={styles.mark}>
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

// The index is a static JSON file built from the manual; it is fetched the
// first time the field is used and searched entirely in the browser.
let indexPromise: Promise<ManualSection[]> | null = null;
function loadIndex(): Promise<ManualSection[]> {
  indexPromise ??= fetch(withBase("/hjalp/index.json"))
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<ManualSection[]>;
    })
    .catch((e) => {
      indexPromise = null;
      throw e;
    });
  return indexPromise;
}

export function ManualSearch() {
  const [query, setQuery] = useState("");
  const [sections, setSections] = useState<ManualSection[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) setQuery(q);
  }, []);

  const active = query.trim().length > 0;
  useEffect(() => {
    if (!active || sections) return;
    loadIndex().then(setSections, () => setFailed(true));
  }, [active, sections]);

  const hits = useMemo(() => (sections && active ? searchSections(sections, query) : []), [sections, active, query]);

  return (
    <div className={styles.wrap}>
      <form role="search" className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => void loadIndex().then(setSections, () => {})}
          placeholder="Sök i manualen…"
          aria-label="Sök i manualen"
          className={styles.input}
        />
      </form>
      {active && failed && <p className={styles.summary}>Sökningen kunde inte laddas.</p>}
      {active && sections && (
        <>
          <p className={styles.summary} aria-live="polite">
            {hits.length === 0 ? `Inga träffar på "${query.trim()}".` : `${hits.length} träffar`}
          </p>
          <ul className={styles.results}>
            {hits.map((h) => (
              <li key={`${h.chapter}#${h.id}`}>
                <Link href={`/hjalp/${h.chapter}/${h.id ? `#${h.id}` : ""}`} className={styles.hit}>
                  <span className={styles.where}>{h.chapterTitle}</span>
                  <span className={styles.heading}>
                    <Parts parts={h.headingParts} />
                  </span>
                  <span className={styles.snippet}>
                    <Parts parts={h.snippet} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
