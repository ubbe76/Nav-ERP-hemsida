import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ManualLayout } from "@/components/ManualLayout";
import { MANUAL_META } from "@/content/manual-meta";
import { MANUAL_CHAPTERS, getChapter, loadChapter } from "@/lib/manual";
import { SITE } from "@/lib/site";
import { breadcrumbs, techArticle } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return MANUAL_CHAPTERS.map((c) => ({ kapitel: c.slug }));
}

type Props = { params: Promise<{ kapitel: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chapter = getChapter((await params).kapitel);
  if (!chapter) return {};
  // A chapter without its own entry falls back to the app's title and description.
  const meta = MANUAL_META[chapter.slug] ?? chapter;
  return { title: `${meta.title} — manual`, description: meta.description };
}

export default async function ChapterPage({ params }: Props) {
  const chapter = getChapter((await params).kapitel);
  if (!chapter) notFound();
  const { html, toc } = loadChapter(chapter);
  return (
    <>
      <JsonLd data={techArticle(chapter)} />
      <JsonLd
        data={breadcrumbs([
          { name: SITE.name, path: "/" },
          { name: "Manual", path: "/hjalp/" },
          { name: chapter.title },
        ])}
      />
      <ManualLayout current={chapter.slug} html={html} toc={toc} />
    </>
  );
}
