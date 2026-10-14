"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

// <details> keeps the mobile menu usable without JavaScript. The header sits in
// the persistent root layout, so client-side navigation would leave it open:
// close it whenever the path changes, and on any link tap inside the panel
// (which also covers a tap on the page you're already on).
export function MobileMenu({ className, summary, children }: { className?: string; summary: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.removeAttribute("open");
  }, [pathname]);

  return (
    <details
      ref={ref}
      className={className}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) ref.current?.removeAttribute("open");
      }}
    >
      {summary}
      {children}
    </details>
  );
}
