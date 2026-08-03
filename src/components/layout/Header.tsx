'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { usePathname } from '@/i18n/navigation';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { ButtonLink } from '@/components/ui/Button';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { NAV_ITEMS } from '@/content/nav';
import { LocaleSwitcher } from './LocaleSwitcher';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { isPastHero, isScrollingDown } = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // A route change should never leave the overlay hanging open.
  useEffect(() => setIsMenuOpen(false), [pathname]);

  const isHidden = isPastHero && isScrollingDown && !isMenuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-[var(--duration-ui)] ease-[var(--ease-brand)] motion-reduce:transition-none ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          isPastHero
            ? 'border-b border-teal-mid/30 bg-cream/95 backdrop-blur-sm'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between gap-6 px-(--spacing-gutter) py-4">
          <TransitionLink
            href="/"
            className="flex items-center gap-3"
            aria-label={t('homeLabel')}
          >
            <Image
              src="/brand/azhar-logo.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-contain"
            />
            <span className="sr-only">Azhar Products</span>
          </TransitionLink>

          <nav
            aria-label={t('primaryLabel')}
            className="hidden items-center gap-8 md:flex"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <TransitionLink
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative text-sm tracking-[0.04em] uppercase transition-colors duration-[var(--duration-ui)] ${
                    isActive ? 'text-accent-strong' : 'text-ink hover:text-ink'
                  }`}
                >
                  {t(item.key)}
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-[var(--duration-ui)] ease-[var(--ease-brand)] group-hover:origin-left group-hover:scale-x-100 motion-reduce:transition-none"
                  />
                </TransitionLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <ButtonLink
              href="/contact"
              variant="primary"
              className="hidden px-6 py-3 lg:inline-flex"
            >
              {t('quote')}
            </ButtonLink>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 cursor-pointer items-center justify-center md:hidden"
            >
              <span className="sr-only">{t('openMenu')}</span>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="square" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
