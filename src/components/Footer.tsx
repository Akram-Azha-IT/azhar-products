import { motion } from 'motion/react';
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { COMPANY } from '../data/company';
import { RANGES } from '../data/ranges';
import { useI18n } from '../i18n';
import type { NavKey } from '../i18n/types';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_LINKS: { href: string; key: NavKey }[] = [
  { href: '#univers', key: 'univers' },
  { href: '#catalogue', key: 'catalogue' },
  { href: '#savoir-faire', key: 'savoirFaire' },
  { href: '#atelier', key: 'atelier' },
  { href: '#contact', key: 'contact' },
];

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-ink text-bone relative overflow-hidden">
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1400px] px-4 pt-14 sm:px-8 sm:pt-20">
        <div className="border-bone/15 grid gap-10 border-b pb-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <img src="/brand/logo.png" alt="" className="h-11 w-auto" />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                {COMPANY.name}
              </span>
            </div>
            <p className="text-bone/60 mb-5 text-xs uppercase tracking-[0.16em]">
              {t.company.baseline}
            </p>
            <LanguageSwitcher tone="dark" placement="top" />
          </div>

          <nav aria-label={t.footer.ariaNav}>
            <p className="text-bone/40 mb-4 text-[10px] font-semibold uppercase tracking-[0.24em]">
              {t.footer.site}
            </p>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-bone/75 hover:text-bone group inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
                  >
                    {t.nav.links[link.key]}
                    <ArrowUpRight
                      size={13}
                      strokeWidth={2.25}
                      className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-bone/40 mb-4 text-[10px] font-semibold uppercase tracking-[0.24em]">
              {t.footer.universes}
            </p>
            <ul className="text-bone/75 flex flex-col gap-2.5 text-sm">
              {RANGES.map((range) => (
                <li key={range.id}>{t.ranges.items[range.id].title}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-bone/40 mb-4 text-[10px] font-semibold uppercase tracking-[0.24em]">
              {t.footer.contact}
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={COMPANY.phoneHref}
                  className="text-bone/75 hover:text-bone flex items-center gap-2.5 transition-colors duration-200"
                >
                  <Phone size={14} strokeWidth={2} className="shrink-0 opacity-50" />
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-bone/75 hover:text-bone flex items-center gap-2.5 transition-colors duration-200"
                >
                  <Mail size={14} strokeWidth={2} className="shrink-0 opacity-50" />
                  {COMPANY.email}
                </a>
              </li>
              <li className="text-bone/75 flex gap-2.5">
                <MapPin size={14} strokeWidth={2} className="mt-0.5 shrink-0 opacity-50" />
                <address className="not-italic leading-relaxed">
                  {t.company.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Signature typographique : le nom occupe toute la largeur, comme un cartouche. */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
          className="font-display text-bone/10 mt-10 select-none text-center uppercase leading-[0.8]"
          style={{ fontSize: 'clamp(52px, 15vw, 230px)', letterSpacing: '-0.03em' }}
        >
          {COMPANY.name}
        </motion.p>

        <div className="text-bone/45 flex flex-col gap-2 py-6 text-[11px] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {COMPANY.name}. {t.footer.rights}
          </p>
          <p>{t.footer.city}</p>
        </div>
      </div>
    </footer>
  );
}
