"use client";

import { useEffect, useRef, useState } from "react";
import type { TocEntry } from "@/lib/manual";

// The section whose heading has scrolled up to the header counts as the one
// being read — the same line a TOC click lands on (html scroll-padding-top).
// At the bottom of the page the last section wins even if it is too short to
// reach that line.
function currentSection(ids: string[]): string | undefined {
  const root = document.documentElement;
  if (window.scrollY + window.innerHeight >= root.scrollHeight - 2) return ids.at(-1);
  const line = parseFloat(getComputedStyle(root).scrollPaddingTop) + 8;
  let current = ids[0];
  for (const id of ids) {
    const top = document.getElementById(id)?.getBoundingClientRect().top;
    if (top === undefined || top > line) break;
    current = id;
  }
  return current;
}

export function ChapterToc({ toc, className, titleClassName }: { toc: TocEntry[]; className?: string; titleClassName?: string }) {
  const [active, setActive] = useState<string | undefined>(toc[0]?.id);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ids = toc.map((t) => t.id);
    let frame = 0;
    const update = () => {
      frame = 0;
      setActive(currentSection(ids));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [toc]);

  // Keep the marked link inside the sticky list when the list is taller than
  // the window. Scrolls only the list — scrollIntoView would move the page too.
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>('a[aria-current="location"]');
    if (!nav || !link) return;
    const above = link.offsetTop - nav.scrollTop;
    if (above < 0 || above + link.offsetHeight > nav.clientHeight) {
      nav.scrollTop = link.offsetTop - nav.clientHeight / 2;
    }
  }, [active]);

  return (
    <nav ref={navRef} className={className} aria-label="I det här kapitlet">
      <p className={titleClassName}>I det här kapitlet</p>
      <ul>
        {toc.map((t) => (
          <li key={t.id}>
            <a href={`#${t.id}`} aria-current={t.id === active ? "location" : undefined}>
              {t.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
