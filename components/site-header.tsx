'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler';

const links = [
  { name: 'Home', href: '/', isActive: (p: string) => p === '/' },
  {
    name: 'Portfolio',
    href: '/blogs/portfolio',
    isActive: (p: string) => p.startsWith('/blogs/portfolio')
  },
  {
    name: 'Blog',
    href: '/blogs',
    isActive: (p: string) =>
      p === '/blogs' ||
      (p.startsWith('/blogs/') && !p.startsWith('/blogs/portfolio'))
  }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="absolute top-4 right-4 z-50 flex items-center gap-1 sm:gap-2">
      <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
        {links.map((link) => {
          const active = link.isActive(pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={
                active
                  ? 'rounded-md px-2 py-1 text-sm font-semibold text-gray-900 dark:text-zinc-100'
                  : 'rounded-md px-2 py-1 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
      <AnimatedThemeToggler className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800" />
    </header>
  );
}
