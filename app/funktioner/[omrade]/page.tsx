import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalcChain } from "@/components/CalcChain";
import { CtaBand } from "@/components/CtaBand";
import { FeatureGroups } from "@/components/FeatureGroups";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Screenshot } from "@/components/Screenshot";
import { FEATURE_AREAS, getArea, manualHref } from "@/content/areas";
import { SITE } from "@/lib/site";
import { breadcrumbs } from "@/lib/structured-data";
import styles from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURE_AREAS.map((a) => ({ omrade: a.slug }));
}

type Props = { params: Promise<{ omrade: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = getArea((await params).omrade);
  return area ? { title: area.seoTitle, description: area.description } : {};
}

export default async function AreaPage({ params }: Props) {
  const area = getArea((await params).omrade);
  if (!area) notFound();
  const others = FEATURE_AREAS.filter((a) => a.slug !== area.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Funktioner", path: "/funktioner/" },
          { name: area.title },
        ])}
      />
      <PageHero eyebrow="Funktioner" title={area.title} lead={area.intro} />
      {area.screenshot && (
        <div className="container">
          <Screenshot shot={area.screenshot} priority />
        </div>
      )}
      {area.slug === "kalkyl" && (
        <div className={`container ${styles.calc}`}>
          <CalcChain />
          <p className={styles.calcMore}>
            <Link href="/verktyg/paslagskalkyl/">Räkna med era egna siffror</Link>
          </p>
        </div>
      )}
      <div className={`container section ${styles.body}`}>
        <FeatureGroups area={area} />
        <aside className={styles.manual}>
          <h2 className={styles.asideTitle}>
            <BookOpen size={18} aria-hidden /> I manualen
          </h2>
          <ul>
            {area.manual.map((ref) => (
              <li key={manualHref(ref)}>
                <Link href={manualHref(ref)}>{ref.label}</Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      {area.gallery && (
        <section className={`container ${styles.gallery}`} aria-labelledby="sa-ser-det-ut">
          <h2 id="sa-ser-det-ut">Så ser det ut</h2>
          <div className={styles.shots}>
            {area.gallery.map(({ shot, caption }) => (
              <Screenshot
                key={shot}
                shot={shot}
                caption={caption}
                sizes="(min-width: 1280px) 584px, (min-width: 768px) 50vw, 100vw"
              />
            ))}
          </div>
        </section>
      )}
      <nav className="container" aria-label="Fler funktionsområden">
        <h2 className={styles.othersTitle}>Fler områden</h2>
        <ul className={styles.others}>
          {others.map((a) => (
            <li key={a.slug}>
              <Link href={`/funktioner/${a.slug}/`}>{a.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <CtaBand
        title="Prova med era egna artiklar"
        text="Installera Nav|ERP på en server, läs in era artiklar från CSV och se hur det fungerar för just er."
      >
        <div className="btnRow">
          <Link href="/kom-igang/" className="btn btnPrimary">
            Kom igång gratis
          </Link>
        </div>
      </CtaBand>
    </>
  );
}
