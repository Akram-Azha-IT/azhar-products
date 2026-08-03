import { useTranslations } from 'next-intl';

/** Keyboard-only shortcut past the header. Visible the moment it takes focus. */
export function SkipLink() {
  const t = useTranslations('nav');

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-1000 focus:bg-navy-deep focus:px-4 focus:py-3 focus:text-sm focus:text-paper"
    >
      {t('skipToContent')}
    </a>
  );
}
