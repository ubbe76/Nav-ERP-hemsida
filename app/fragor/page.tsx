import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { FAQ_GROUPS } from "@/content/faq";
import { SITE } from "@/lib/site";
import { breadcrumbs } from "@/lib/structured-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Vanliga frågor och svar",
  description:
    "Är det redo för skarp drift, vad kostar det, var lagras datan, hur tas backup och kan vi flytta in data från vårt gamla system? Svaren på det de flesta frågar.",
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: SITE.name, path: "/" }, { name: "Vanliga frågor" }])} />
      <PageHero
        eyebrow="Vanliga frågor"
        title="Frågor och svar om Nav|ERP"
        lead="Det de flesta vill veta innan de provar: hur färdigt systemet är, vad det kostar, var datan finns och hur man kommer igång."
      />
      <div className={`container ${styles.groups}`}>
        {FAQ_GROUPS.map((group) => (
          <section key={group.title} className={styles.group}>
            <h2 className={styles.title}>{group.title}</h2>
            <FaqList items={group.items} />
          </section>
        ))}
        <p className={styles.more}>
          Frågor om en viss funktion besvaras på respektive <Link href="/funktioner/">funktionssida</Link>. Hittar ni
          inte svaret, <a href={SITE.newIssueUrl}>fråga på GitHub</a> eller skriv till{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
      <CtaBand title="Prova själva" text="Installera Nav|ERP och skapa exempeldata med ett klick.">
        <div className="btnRow">
          <Link href="/kom-igang/" className="btn btnPrimary">
            Kom igång gratis
          </Link>
        </div>
      </CtaBand>
    </>
  );
}
