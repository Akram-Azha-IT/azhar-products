'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import { ButtonLink } from '@/components/ui/Button';
import { TransitionLink } from '@/components/ui/TransitionLink';
import { NAV_ITEMS } from '@/content/nav';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-screen navigation overlay for small viewports.
 *
 * Escape closes it, background scroll is locked while it is open, and focus
 * moves into the panel on open and back to the page on close — an animation
 * must never trap focus.
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations('nav');
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('primaryLabel')}
      inert={!isOpen}
      className={`fixed inset-0 z-100 flex flex-col bg-navy-deep text-paper transition-[opacity,transform] duration-[var(--duration-ui)] ease-[var(--ease-brand)] motion-reduce:transition-none md:hidden ${
        isOpen
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-4 opacity-0'
      }`}
    >
      <div className="flex justify-end px-(--spacing-gutter) py-4">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 cursor-pointer items-center justify-center"
        >
          <span className="sr-only">{t('closeMenu')}</span>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M5 5l14 14M19 5L5 19" strokeLinecap="square" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-2 px-(--spacing-gutter) pb-24">
        {NAV_ITEMS.map((item) => (
          <TransitionLink
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="py-3 font-display text-4xl tracking-[-0.03em]"
          >
            {t(item.key)}
          </TransitionLink>
        ))}
        <ButtonLink
          href="/contact"
          variant="primary"
          className="mt-8 self-start"
        >
          {t('quote')}
        </ButtonLink>
      </nav>
    </div>
  );
}
