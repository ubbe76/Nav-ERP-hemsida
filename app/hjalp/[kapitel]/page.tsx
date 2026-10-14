import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ManualLayout } from "@/components/ManualLayout";
import { MANUAL_CHAPTERS, getChapter, loadChapter } from "@/lib/manual";

export const dynamicParams = false;

export function generateStaticParams() {
  return MANUAL_CHAPTERS.map((c) => ({ kapitel: c.slug }));
}

type Props = { params: Promise<{ kapitel: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chapter = getChapter((await params).kapitel);
  return chapter ? { title: `${chapter.title} — manual`, description: chapter.description } : {};
}

export default async function ChapterPage({ params }: Props) {
  const chapter = getChapter((await params).kapitel);
  if (!chapter) notFound();
  const { html, toc } = loadChapter(chapter);
  return <ManualLayout current={chapter.slug} html={html} toc={toc} />;
}
