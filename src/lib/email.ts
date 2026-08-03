import type { QuoteInput } from '@/features/contact/schema';

export interface EmailProvider {
  readonly name: string;
  send(quote: QuoteInput): Promise<void>;
}

/**
 * Stands in until a real provider is wired.
 *
 * It throws rather than resolving, so an unconfigured deployment surfaces a
 * clear 503 instead of quietly accepting quote requests that go nowhere. A
 * lost enquiry is worse than a visible error.
 */
class UnconfiguredProvider implements EmailProvider {
  readonly name = 'unconfigured';

  async send(): Promise<never> {
    throw new EmailNotConfiguredError();
  }
}

export class EmailNotConfiguredError extends Error {
  constructor() {
    super(
      'No email provider is configured. Set RESEND_API_KEY and QUOTE_INBOX to enable quote delivery.',
    );
    this.name = 'EmailNotConfiguredError';
  }
}

/**
 * Resend-ready seam.
 *
 * To enable: `npm install resend`, set RESEND_API_KEY and QUOTE_INBOX, and
 * replace the body below with a Resend client call. Nothing else in the app
 * needs to change — the route handler only knows about `EmailProvider`.
 */
export function getEmailProvider(): EmailProvider {
  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.QUOTE_INBOX;

  if (!apiKey || !inbox) {
    return new UnconfiguredProvider();
  }

  return {
    name: 'resend',
    async send() {
      throw new Error(
        'Resend credentials are present but the client is not implemented yet. See src/lib/email.ts.',
      );
    },
  };
}
