import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { COMPANY } from '../data/company';
import { useI18n } from '../i18n';
import type { NavKey } from '../i18n/types';
import LanguageSwitcher from './LanguageSwitcher';

const LINKS: { href: string; key: NavKey }[] = [
  { href: '#univers', key: 'univers' },
  { href: '#catalogue', key: 'catalogue' },
  { href: '#savoir-faire', key: 'savoirFaire' },
  { href: '#atelier', key: 'atelier' },
  { href: '#contact', key: 'contact' },
];

export default function Nav() {
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
      className={`fixed inset-x-0 top-0 z-[70] transition-colors duration-300 ${
        isScrolled ? 'bg-bone/80 border-line/60 border-b backdrop-blur-md' : ''
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between px-4 transition-all duration-300 sm:px-8 ${
          isScrolled ? 'py-3' : 'py-5'
        }`}
      >
        <a href="#accueil" className="flex min-w-0 shrink items-center gap-3">
          <img
            src="/brand/logo.png"
            alt={COMPANY.name}
            className="h-9 w-auto shrink-0 sm:h-10"
          />
          {/*
           * Sous 640 px, le nom ne tient plus à côté du sélecteur de langue et du
           * bouton de devis : le logo porte seul la marque, son texte alternatif
           * garde le nom accessible.
           */}
          <span className="text-ink hidden whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] sm:inline">
            {COMPANY.name}
          </span>
        </a>

        <nav aria-label={t.nav.ariaMain} className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-ink/75 hover:text-ink hover:bg-ink/5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200"
            >
              {t.nav.links[link.key]}
            </a>
          ))}
          <span className="ml-2">
            <LanguageSwitcher />
          </span>
          <a
            href="#contact"
            className="bg-ink text-bone ml-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-transform duration-200 hover:scale-[1.04]"
          >
            {t.nav.quote}
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <a
            href="#contact"
            className="bg-ink text-bone shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em]"
          >
            {t.nav.quoteShort}
          </a>
        </div>
      </div>
    </motion.header>
  );
}
