import { useTranslations } from 'next-intl';

import { Eyebrow } from '@/components/ui/Eyebrow';
import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="px-(--spacing-gutter) pt-40 pb-(--spacing-section)">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-6 max-w-[16ch] text-(length:--text-section) font-medium">
        {t('title')}
      </h1>
      <p className="mt-8 max-w-[48ch] text-lg leading-relaxed text-steel">
        {t('body')}
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <ButtonLink href="/products" variant="primary">
          {t('products')}
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          {t('contact')}
        </ButtonLink>
      </div>
    </div>
  );
}
