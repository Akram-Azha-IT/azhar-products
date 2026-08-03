import { useTranslations } from 'next-intl';

import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="mx-auto max-w-[80rem] px-(--spacing-gutter) pt-40 pb-(--spacing-section)">
      <p className="eyebrow text-accent">404</p>
      <h1 className="mt-4 max-w-[16ch] text-(length:--text-section) font-semibold">
        {t('title')}
      </h1>
      <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted">
        {t('body')}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="#products">{t('products')}</ButtonLink>
        <ButtonLink href="#contact" variant="soft">
          {t('contact')}
        </ButtonLink>
      </div>
    </div>
  );
}
