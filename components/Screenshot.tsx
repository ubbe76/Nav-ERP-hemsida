import { SCREENSHOTS, type ScreenshotKey } from "@/content/screenshots";
import { loadScreenshot } from "@/lib/screenshots";
import { withBase } from "@/lib/site";
import styles from "./Screenshot.module.css";

// Every theme variant is in the markup and CSS shows the one matching
// <html data-theme> — <picture> can't see data-theme. Hidden lazy images are
// never fetched, so only the visible variant is downloaded.
export function Screenshot({ shot, caption }: { shot: ScreenshotKey; caption?: string }) {
  const images = loadScreenshot(shot);
  return (
    <figure className={styles.figure}>
      <div className={styles.frame}>
        {images.map((img) => (
          <img
            key={img.src}
            className={styles.img}
            data-themes={img.themes.join(" ")}
            src={withBase(img.src)}
            width={img.width}
            height={img.height}
            alt={SCREENSHOTS[shot]}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
