import { SCREENSHOTS, type ScreenshotKey } from "@/content/screenshots";
import { loadScreenshot } from "@/lib/screenshots";
import { withBase } from "@/lib/site";
import styles from "./Screenshot.module.css";

// Every theme variant is in the markup and CSS shows the one matching
// <html data-theme> — <picture> can't see data-theme. Hidden lazy images are
// never fetched, so only the visible variant is downloaded.
//
// `priority` is for the screenshot at the top of a page (the LCP image): the
// light variant — what a first visit without a stored theme sees — loads
// eagerly at high priority. The other variants stay lazy, since an eager
// hidden image would be downloaded for nothing.
export function Screenshot({
  shot,
  caption,
  priority = false,
}: {
  shot: ScreenshotKey;
  caption?: string;
  priority?: boolean;
}) {
  const images = loadScreenshot(shot);
  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        {images.map((img) => {
          const eager = priority && img.themes.includes("light");
          return (
            <img
              key={img.src}
              className={styles.img}
              data-themes={img.themes.join(" ")}
              src={withBase(img.src)}
              srcSet={img.webp.map((w) => `${withBase(w.src)} ${w.width}w`).join(", ") || undefined}
              // Never wider than the 1200 px container.
              sizes={img.webp.length ? "(min-width: 1280px) 1200px, 100vw" : undefined}
              width={img.width}
              height={img.height}
              alt={SCREENSHOTS[shot]}
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : undefined}
              decoding="async"
            />
          );
        })}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
