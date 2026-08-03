'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { NAV_ITEMS } from '@/content/nav';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { ButtonLink } from '@/components/ui/Button';
import { LocaleSwitcher } from './LocaleSwitcher';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const t = useTranslations('nav');
  const { isPastHero, isScrollingDown } = useScrollDirection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const close = () => setIsMenuOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, [isMenuOpen]);

  const isHidden = isPastHero && isScrollingDown && !isMenuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-[var(--duration-ui)] ease-[var(--ease-brand)] motion-reduce:transition-none ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        } ${isPastHero ? 'bg-paper/90 backdrop-blur-md' : 'bg-transparent'}`}
      >
        <div className="mx-auto flex max-w-[80rem] items-center justify-between gap-4 px-(--spacing-gutter) py-4">
          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/brand/azhar-logo.png"
              alt=""
              width={40}
              height={40}
              priority
              className="h-9 w-9 object-contain"
            />
            <span className="text-base font-semibold tracking-[-0.02em]">
              Azhar
            </span>
            <span className="sr-only">Products — {t('homeLabel')}</span>
          </a>

          <nav
            aria-label={t('primaryLabel')}
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-(--radius-pill) px-4 py-2 text-sm font-medium text-muted transition-colors duration-[var(--duration-ui)] hover:bg-panel hover:text-ink"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <LocaleSwitcher />
            {/*
             * Visibility sits on a wrapper, never on the button's own class:
             * ButtonLink's base already sets `inline-flex`, so a `hidden`
             * utility passed alongside it loses the specificity tie and the
             * button stayed visible on mobile, crowding out the logo.
             */}
            <span className="hidden sm:block">
              <ButtonLink href="#contact" className="px-5 py-2.5">
                {t('quote')}
              </ButtonLink>
            </span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-(--radius-pill) md:hidden"
            >
              <span className="sr-only">{t('openMenu')}</span>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
