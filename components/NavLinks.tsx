"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/site";

const trim = (p: string) => p.replace(/\/+$/, "");

export function NavLinks({ className, linkClassName }: { className?: string; linkClassName?: string }) {
  const here = trim(usePathname());
  return (
    <ul className={className}>
      {NAV_ITEMS.map((item) => {
        const target = trim(item.href);
        const active = here === target || here.startsWith(`${target}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={linkClassName}
              aria-current={active ? "page" : undefined}
              // Client-side navigation keeps the layout mounted, so close the mobile menu by hand.
              onClick={(e) => e.currentTarget.closest("details")?.removeAttribute("open")}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
