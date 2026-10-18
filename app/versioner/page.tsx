import type { Metadata } from "next";
import { Fragment } from "react";
import { PageHero } from "@/components/PageHero";
import { RELEASES } from "@/content/releases";
import { SITE } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Versioner och ändringslogg",
  description:
    "Vad som är nytt i varje version av Nav|ERP, vad som har ändrats och vad som kräver en åtgärd när ni uppdaterar er installation.",
};

// `code` spans in the release texts are written with backticks.
function Text({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) => (
        <Fragment key={i}>{i % 2 === 1 ? <code>{part}</code> : part}</Fragment>
      ))}
    </>
  );
}

function List({ title, items, className }: { title: string; items: string[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <div className={className}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <Text text={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ReleasesPage() {
  return (
    <>
      <PageHero
        eyebrow="Versioner"
        title="Vad är nytt i Nav|ERP"
        lead="Läs avsnittet Kräver åtgärd innan ni uppdaterar — där står det som ändrar siffror ni redan har eller som behöver göras för hand."
      />
      <div className="container">
        <div className="prose">
          <p>Uppdatera en installation så här:</p>
          <pre>
            <code>{"git pull\ndocker compose build --pull\ndocker compose up -d"}</code>
          </pre>
          {RELEASES.map((release) => (
            <section key={release.version} className={styles.release} aria-labelledby={`v-${release.version}`}>
              <h2 id={`v-${release.version}`}>
                {release.version}{" "}
                <span className={styles.date}>
                  <time dateTime={release.date}>{release.date}</time>
                </span>
              </h2>
              <p>
                <Text text={release.summary} />
              </p>
              <List title="Kräver åtgärd" items={release.breaking} className={styles.breaking} />
              <List title="Nytt" items={release.added} />
              <List title="Ändrat" items={release.changed} />
              <p className={styles.link}>
                <a href={`${SITE.repoUrl}/releases/tag/v${release.version}`}>Versionen på GitHub</a>
              </p>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
