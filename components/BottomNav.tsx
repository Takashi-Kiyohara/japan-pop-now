'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarDays, Coffee, Bookmark, Menu } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Tab = {
  href: string;
  Icon: LucideIcon;
  label: string;
  matchPrefix?: string;
};

const TABS: Tab[] = [
  { href: '/', Icon: Home, label: 'Home' },
  { href: '/calendar', Icon: CalendarDays, label: 'Events', matchPrefix: '/calendar' },
  { href: '/cafes', Icon: Coffee, label: 'Cafes', matchPrefix: '/cafes' },
  { href: '/bookmarks', Icon: Bookmark, label: 'Saved', matchPrefix: '/bookmarks' },
  { href: '/menu', Icon: Menu, label: 'More', matchPrefix: '/menu' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (t: Tab) =>
    t.matchPrefix
      ? pathname === t.matchPrefix || pathname.startsWith(`${t.matchPrefix}/`)
      : pathname === t.href;

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden
                 bg-white/95 backdrop-blur-md
                 border-t border-neutral-200
                 pb-[env(safe-area-inset-bottom)]
                 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
    >
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => {
          const active = isActive(tab);
          return (
            <li key={tab.href} className="flex">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                aria-label={tab.label}
                className={`flex flex-col items-center justify-center gap-0.5 w-full
                            min-h-[56px] py-1.5
                            text-[10px] font-semibold tracking-wide
                            transition-colors touch-manipulation
                            ${active
                              ? 'text-accent-600'
                              : 'text-neutral-500 hover:text-neutral-900 active:text-accent-600'}`}
              >
                <tab.Icon
                  aria-hidden
                  className="w-5 h-5"
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span className="leading-none">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
