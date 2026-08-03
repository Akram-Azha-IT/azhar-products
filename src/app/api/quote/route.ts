import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import { createQuoteSchema } from '@/features/contact/schema';
import { EmailNotConfiguredError, getEmailProvider } from '@/lib/email';
import { checkRateLimit } from '@/lib/rateLimit';

const MAX_BODY_BYTES = 16_000;

function clientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(request: Request) {
  const { isAllowed, retryAfterSeconds } = checkRateLimit(
    clientIdentifier(request),
  );

  if (!isAllowed) {
    return NextResponse.json(
      { success: false, error: 'rate_limited' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSeconds) },
      },
    );
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { success: false, error: 'payload_too_large' },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'invalid_json' },
      { status: 400 },
    );
  }

  const requestedLocale = request.headers.get('x-locale');
  const locale = routing.locales.includes(
    requestedLocale as (typeof routing.locales)[number],
  )
    ? (requestedLocale as (typeof routing.locales)[number])
    : routing.defaultLocale;

  const t = await getTranslations({ locale, namespace: 'contact.form.errors' });

  const schema = createQuoteSchema({
    nameRequired: t('nameRequired'),
    companyRequired: t('companyRequired'),
    emailInvalid: t('emailInvalid'),
    phoneRequired: t('phoneRequired'),
    countryRequired: t('countryRequired'),
    productRequired: t('productRequired'),
    messageTooShort: t('messageTooShort'),
  });

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'validation_failed',
        // Field-level messages so the client can attach them to inputs.
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  // Honeypot tripped: accept silently so the bot learns nothing.
  if (parsed.data.website) {
    return NextResponse.json({ success: true }, { status: 202 });
  }

  try {
    await getEmailProvider().send(parsed.data);
  } catch (error: unknown) {
    if (error instanceof EmailNotConfiguredError) {
      // Never pretend a quote was delivered when it was not.
      return NextResponse.json(
        { success: false, error: 'not_configured' },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { success: false, error: 'delivery_failed' },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true }, { status: 202 });
}
