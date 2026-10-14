"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./CodeBlock.module.css";

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  // The copy button only appears once JS runs and the Clipboard API exists.
  const [canCopy, setCanCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setCanCopy(!!navigator.clipboard), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard denied — the text is still selectable.
    }
  }

  return (
    <div className={styles.block}>
      {label && <div className={styles.label}>{label}</div>}
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
      {canCopy && (
        <button type="button" className={styles.copy} onClick={copy} aria-label={copied ? "Kopierat" : "Kopiera"}>
          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
        </button>
      )}
    </div>
  );
}
