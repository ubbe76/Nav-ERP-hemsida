import Link from "next/link";
import type { Faq } from "@/content/faq";
import styles from "./FaqList.module.css";

// Questions as visible headings with their answers — `level` is the heading
// level the questions get on the page they're placed in.
export function FaqList({ items, level = 3 }: { items: readonly Faq[]; level?: 2 | 3 }) {
  const Heading = `h${level}` as const;
  return (
    <div className={styles.list}>
      {items.map((faq) => (
        <div key={faq.id} id={faq.id} className={styles.item}>
          <Heading className={styles.question}>{faq.question}</Heading>
          <p>{faq.answer}</p>
          {faq.more && (
            <p className={styles.more}>
              {faq.more.href.startsWith("/") ? (
                <Link href={faq.more.href}>{faq.more.label}</Link>
              ) : (
                <a href={faq.more.href}>{faq.more.label}</a>
              )}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
