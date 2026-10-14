"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./BackToTop.module.css";

// Shown once the visitor is more than a screen down. Without JavaScript it stays
// hidden — the page is still fully readable, just without the shortcut.
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight);
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
  }, []);

  return (
    <button
      type="button"
      className={styles.button}
      data-visible={visible}
      aria-label="Till toppen"
      title="Till toppen"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        // Keyboard and screen reader users continue from the top too: the
        // logo is the first stop after the skip link.
        document.querySelector<HTMLElement>("header a")?.focus({ preventScroll: true });
      }}
    >
      <ArrowUp size={20} aria-hidden />
    </button>
  );
}
