import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { RELEASES } from "@/content/releases";
import { fetchRoadmap, type RoadmapItem, type RoadmapPriority } from "@/lib/github";
import { SITE } from "@/lib/site";
import { breadcrumbs } from "@/lib/structured-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Färdplan",
  description:
    "Det här byggs härnäst i Nav|ERP: de öppna förslagen på GitHub, sorterade efter prioritet. Kommentera ett förslag eller föreslå en egen funktion.",
};

const GROUPS: { priority: RoadmapPriority | null; title: string }[] = [
  { priority: "hög", title: "Hög prioritet" },
  { priority: "medel", title: "Medelhög prioritet" },
  { priority: "låg", title: "Låg prioritet" },
  { priority: null, title: "Inte prioriterat än" },
];

const OPEN_SUGGESTIONS_URL = `${SITE.repoUrl}/issues?q=${encodeURIComponent("is:issue is:open label:förslag")}`;

function Group({ title, items }: { title: string; items: RoadmapItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className={styles.group}>
      <h2>{title}</h2>
      <ul className={styles.items}>
        {items.map((item) => (
          <li key={item.number} className={styles.item}>
            <a href={item.url}>{item.title}</a> <span className={styles.number}>#{item.number}</span>
            {item.areas.length > 0 && (
              <span className={styles.areas}>
                {item.areas.map((area) => (
                  <span key={area} className={styles.area}>
                    {area}
                  </span>
                ))}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function RoadmapPage() {
  // Read from GitHub when the site is built (lib/github.ts) — the nightly
  // build keeps it current; null when GitHub could not be reached.
  const items = await fetchRoadmap();
  const latest = RELEASES[0]!;
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: SITE.name, path: "/" }, { name: "Färdplan" }])} />
      <PageHero
        eyebrow="Färdplan"
        title="Det här byggs härnäst"
        lead="De öppna förslagen på GitHub, sorterade efter prioritet. Här står inga datum: Nav|ERP byggs av en person, och ordningen kan ändras när en användare behöver något."
      />
      <div className="container">
        <div className="prose">
          <p className={styles.latest}>
            Senast släppt: <Link href="/versioner/">{latest.version}</Link> ({latest.date}) — {latest.summary.replaceAll("`", "")}
          </p>
          {items === null ? (
            <p>
              Färdplanen kunde inte hämtas när sidan byggdes. Se <a href={OPEN_SUGGESTIONS_URL}>de öppna förslagen på GitHub</a>.
            </p>
          ) : items.length === 0 ? (
            <p>Inga öppna förslag just nu.</p>
          ) : (
            GROUPS.map((group) => (
              <Group key={group.title} title={group.title} items={items.filter((item) => item.priority === group.priority)} />
            ))
          )}
          <section className={styles.group}>
            <h2>Påverka färdplanen</h2>
            <p>
              Kommentera ett förslag på GitHub eller ge det en tumme upp, så syns det vad användarna saknar mest. Saknas något helt,{" "}
              <a href={SITE.newIssueUrl}>föreslå en funktion</a>. Vad som saknas i dag inom varje del av systemet står också på{" "}
              <Link href="/funktioner/">funktionssidorna</Link>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
