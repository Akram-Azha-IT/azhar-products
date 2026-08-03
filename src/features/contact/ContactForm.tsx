'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';

import type { Locale } from '@/i18n/routing';
import { PRODUCTS } from '@/content/products';
import { EASE } from '@/lib/motionTokens';
import { useGsapEffect } from '@/hooks/useGsapEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { createQuoteSchema, type QuoteInput } from './schema';
import { Field } from './Field';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const locale = useLocale() as Locale;
  const prefersReduced = useReducedMotion();

  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const schema = createQuoteSchema({
    nameRequired: t('errors.nameRequired'),
    companyRequired: t('errors.companyRequired'),
    emailInvalid: t('errors.emailInvalid'),
    phoneRequired: t('errors.phoneRequired'),
    countryRequired: t('errors.countryRequired'),
    productRequired: t('errors.productRequired'),
    messageTooShort: t('errors.messageTooShort'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<QuoteInput>({
    resolver: zodResolver(schema),
    // Validate on blur, not on every keystroke.
    mode: 'onBlur',
    defaultValues: { productInterest: [], website: '' },
  });

  /*
   * Pre-fill from ?product=<slug>, read from the URL directly rather than via
   * useSearchParams so /contact stays statically rendered.
   */
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('product');
    if (slug && PRODUCTS.some((product) => product.slug === slug)) {
      setValue('productInterest', [slug]);
    }
  }, [setValue]);

  // Success replaces the form in place; animate it, never navigate away.
  useGsapEffect(
    ({ gsap }) => {
      const panel = panelRef.current;
      if (!panel) return;

      const context = gsap.context(() => {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: EASE.out },
        );
      }, panel);

      return () => context.revert();
    },
    [submitState],
    !prefersReduced && submitState === 'success',
  );

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState('submitting');
    setSubmitError(null);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        const code =
          typeof body === 'object' && body !== null && 'error' in body
            ? String((body as { error: unknown }).error)
            : 'unknown';

        setSubmitError(
          code === 'not_configured'
            ? t('status.notConfigured')
            : t('status.error'),
        );
        setSubmitState('error');
        return;
      }

      setSubmitState('success');
    } catch {
      setSubmitError(t('status.network'));
      setSubmitState('error');
    }
  });

  // On a failed validation pass, put focus on the first invalid field.
  const onInvalid = () => {
    const firstError = Object.keys(errors)[0] as keyof QuoteInput | undefined;
    if (firstError) setFocus(firstError);
  };

  if (submitState === 'success') {
    return (
      <div ref={panelRef} role="status" className="border-t border-steel-light/30 pt-10">
        <h2 className="font-display text-3xl tracking-[-0.03em]">
          {t('status.successTitle')}
        </h2>
        <p className="mt-4 max-w-[46ch] text-steel">
          {t('status.successBody')}
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={(event) => void onSubmit(event).catch(onInvalid)}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label={t('fields.name')} error={errors.name?.message} required>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register('name')}
            className="form-input"
          />
        </Field>

        <Field
          id="company"
          label={t('fields.company')}
          error={errors.company?.message}
          required
        >
          <input
            id="company"
            type="text"
            autoComplete="organization"
            {...register('company')}
            className="form-input"
          />
        </Field>

        <Field id="email" label={t('fields.email')} error={errors.email?.message} required>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            {...register('email')}
            className="form-input"
          />
        </Field>

        <Field id="phone" label={t('fields.phone')} error={errors.phone?.message} required>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...register('phone')}
            className="form-input"
          />
        </Field>

        <Field
          id="country"
          label={t('fields.country')}
          error={errors.country?.message}
          required
        >
          <input
            id="country"
            type="text"
            autoComplete="country-name"
            {...register('country')}
            className="form-input"
          />
        </Field>

        <Field
          id="monthlyVolume"
          label={t('fields.monthlyVolume')}
          hint={t('hints.monthlyVolume')}
          error={errors.monthlyVolume?.message}
        >
          <input
            id="monthlyVolume"
            type="text"
            inputMode="numeric"
            {...register('monthlyVolume')}
            className="form-input"
          />
        </Field>
      </div>

      <fieldset className="mt-10">
        <legend className="text-sm font-medium">
          {t('fields.productInterest')}
          <span aria-hidden className="text-accent-strong">
            {' *'}
          </span>
        </legend>
        <p className="mt-1 text-sm text-steel">
          {t('hints.productInterest')}
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {PRODUCTS.map((product) => (
            <label
              key={product.slug}
              className="flex cursor-pointer items-center gap-2 border border-steel-light/40 px-4 py-2.5 text-sm transition-colors duration-[var(--duration-ui)] hover:border-navy-deep has-checked:border-accent-strong has-checked:bg-accent-strong has-checked:text-mist"
            >
              <input
                type="checkbox"
                value={product.slug}
                {...register('productInterest')}
                className="sr-only"
              />
              {product.name[locale]}
            </label>
          ))}
        </div>

        {errors.productInterest ? (
          <p role="alert" className="mt-3 text-sm text-accent-strong">
            {errors.productInterest.message}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-10">
        <Field
          id="message"
          label={t('fields.message')}
          error={errors.message?.message}
          required
        >
          <textarea
            id="message"
            rows={6}
            {...register('message')}
            className="form-input resize-y"
          />
        </Field>
      </div>

      {/* Honeypot — off-screen, not display:none, so bots still find it. */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {submitError ? (
        <p role="alert" className="mt-8 border-l-2 border-accent-strong pl-4 text-sm text-accent-strong">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitState === 'submitting'}
        className="group relative isolate mt-10 inline-flex cursor-pointer items-center justify-center overflow-hidden bg-accent-strong px-8 py-4 text-sm font-medium tracking-[0.04em] text-mist uppercase transition-colors duration-[var(--duration-ui)] hover:text-accent-strong disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-mist"
      >
        <span
          aria-hidden
          className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-mist transition-transform duration-[var(--duration-ui)] ease-[var(--ease-brand)] group-hover:scale-y-100 group-disabled:scale-y-0 motion-reduce:transition-none"
        />
        {submitState === 'submitting' ? t('status.submitting') : t('submit')}
      </button>
    </form>
  );
}
