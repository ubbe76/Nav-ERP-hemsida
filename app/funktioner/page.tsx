import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHero } from "@/components/PageHero";
import { FEATURE_AREAS } from "@/content/areas";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Funktioner i affärssystemet för tillverkning",
  description:
    "Tillverkning, lager och artiklar, inköp och försäljning, kalkyl, personal och lön, och ekonomi — allt som ingår i Nav|ERP.",
};

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Funktioner"
        title="Allt ett tillverkande företag behöver — i ett system"
        lead="Sex områden som delar samma artiklar, samma lager och samma kalkyl. Det ni registrerar på ett ställe syns direkt överallt där det behövs."
      />
      <div className="container">
        <ul className={styles.grid}>
          {FEATURE_AREAS.map(({ slug, title, tagline, icon: Icon }) => (
            <li key={slug}>
              <Link href={`/funktioner/${slug}/`} className={styles.card}>
                <Icon size={24} aria-hidden className={styles.icon} />
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.tagline}>{tagline}</p>
                <span className={styles.more}>
                  Läs mer <ArrowRight size={16} aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <CtaBand
        title="Se det med egna ögon"
        text="Det snabbaste sättet att förstå Nav|ERP är att köra det. Installationen tar några minuter med Docker."
      >
        <div className="btnRow">
          <Link href="/kom-igang/" className="btn btnPrimary">
            Kom igång gratis
          </Link>
          <Link href="/hjalp/" className="btn btnSecondary">
            Läs manualen
          </Link>
        </div>
      </CtaBand>
    </>
  );
}
