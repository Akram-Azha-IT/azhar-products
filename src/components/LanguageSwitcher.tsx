import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { LOCALES, useI18n } from '../i18n';
import type { Locale } from '../i18n';
import FlagIcon from './FlagIcon';

/** Chaque langue s'affiche dans sa propre langue : lisible quelle que soit la locale active. */
const NATIVE_NAMES: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  de: 'Deutsch',
};

const SHORT_LABELS: Record<Locale, string> = { fr: 'FR', en: 'EN', de: 'DE' };

type LanguageSwitcherProps = {
  /** `dark` s'utilise sur les fonds encre (pied de page). */
  tone?: 'light' | 'dark';
  /** La liste s'ouvre vers le haut en pied de page, faute de place en dessous. */
  placement?: 'bottom' | 'top';
};

export default function LanguageSwitcher({
  tone = 'light',
  placement = 'bottom',
}: LanguageSwitcherProps) {
  const { locale, t, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isDark = tone === 'dark';

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const select = (next: Locale) => {
    setLocale(next);
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={t.nav.ariaLanguage}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex items-center gap-2 rounded-full py-1.5 pl-2 pr-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 ${
          isDark
            ? 'bg-bone/10 text-bone hover:bg-bone/20'
            : 'bg-ink/[0.07] text-ink hover:bg-ink/[0.12]'
        }`}
      >
        <FlagIcon locale={locale} uid={`trigger-${tone}`} className="h-3.5 w-5" />
        {SHORT_LABELS[locale]}
        <ChevronDown
          size={13}
          strokeWidth={2.5}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t.nav.ariaLanguage}
          className={`absolute right-0 z-[80] min-w-[168px] overflow-hidden rounded-2xl border py-1 shadow-[0_18px_40px_-18px_rgba(20,22,26,0.55)] ${
            placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } ${isDark ? 'border-bone/15 bg-ink' : 'border-line bg-bone'}`}
        >
          {LOCALES.map((code) => {
            const isActive = code === locale;
            return (
              <li key={code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  lang={code}
                  onClick={() => select(code)}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-[13px] transition-colors duration-150 ${
                    isDark ? 'hover:bg-bone/10' : 'hover:bg-ink/5'
                  } ${
                    isActive
                      ? isDark
                        ? 'text-bone font-semibold'
                        : 'text-ink font-semibold'
                      : isDark
                        ? 'text-bone/70'
                        : 'text-ink/70'
                  }`}
                >
                  <FlagIcon locale={code} uid={`${tone}-${code}`} className="h-4 w-6" />
                  <span className="flex-1">{NATIVE_NAMES[code]}</span>
                  {isActive && <Check size={14} strokeWidth={2.5} className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
