import { motion } from 'motion/react';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { COMPANY } from '../data/company';
import { useI18n } from '../i18n';

export default function Contact() {
  const { t } = useI18n();
  const quoteHref = `mailto:${COMPANY.email}?subject=${encodeURIComponent(t.contact.mailSubject)}`;

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#CFE3D8] px-4 py-14 sm:px-8 sm:py-24"
    >
      <div className="grain pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1400px]">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="font-display max-w-4xl whitespace-pre-line uppercase leading-[0.92]"
          style={{ fontSize: 'clamp(38px, 6.5vw, 106px)', letterSpacing: '-0.02em' }}
        >
          {t.contact.title}
        </motion.h2>

        <p className="text-ink-soft mt-6 max-w-lg text-sm leading-relaxed sm:text-base">
          {t.contact.lead}
        </p>

        <div className="mt-10 grid gap-8 sm:gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <dl className="grid gap-8 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <dt className="text-ink/55 mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                <Phone size={14} strokeWidth={2} />
                {t.contact.phone}
              </dt>
              <dd className="text-ink text-base font-semibold sm:text-lg">
                <a className="hover:opacity-70" href={COMPANY.phoneHref}>
                  {COMPANY.phone}
                </a>
              </dd>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.08 }}
            >
              <dt className="text-ink/55 mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                <Mail size={14} strokeWidth={2} />
                {t.contact.email}
              </dt>
              <dd className="text-ink text-base font-semibold sm:text-lg">
                <a className="hover:opacity-70" href={`mailto:${COMPANY.email}`}>
                  {COMPANY.email}
                </a>
              </dd>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.16 }}
            >
              <dt className="text-ink/55 mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                <MapPin size={14} strokeWidth={2} />
                {t.contact.address}
              </dt>
              <dd className="text-ink text-sm font-semibold leading-relaxed">
                {t.company.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </dd>
            </motion.div>
          </dl>

          <motion.a
            href={quoteHref}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            className="bg-ink text-bone inline-flex items-center gap-3 self-start rounded-full px-8 py-5 text-sm font-semibold uppercase tracking-[0.14em]"
          >
            {t.contact.cta}
            <ArrowRight size={18} strokeWidth={2.25} />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
