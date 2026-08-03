import { z } from 'zod';

/**
 * Messages are injected rather than hardcoded so the same schema validates on
 * the client (with the visitor's locale) and on the server (with the request's
 * locale) — one definition, no drift between the two.
 */
export interface QuoteMessages {
  nameRequired: string;
  companyRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  countryRequired: string;
  productRequired: string;
  messageTooShort: string;
}

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;

export function createQuoteSchema(messages: QuoteMessages) {
  /*
   * The message is passed twice on purpose. `.min()` only covers a value that
   * is present but too short; a missing field raises an invalid_type issue,
   * which is what the constructor-level `error` catches. Without both, an
   * untouched required field reports zod's default "Invalid input".
   */
  return z.object({
    name: z
      .string({ error: messages.nameRequired })
      .trim()
      .min(2, messages.nameRequired)
      .max(120),
    company: z
      .string({ error: messages.companyRequired })
      .trim()
      .min(2, messages.companyRequired)
      .max(160),
    email: z.email(messages.emailInvalid).max(200),
    phone: z
      .string({ error: messages.phoneRequired })
      .trim()
      .min(6, messages.phoneRequired)
      .max(40),
    country: z
      .string({ error: messages.countryRequired })
      .trim()
      .min(2, messages.countryRequired)
      .max(80),
    productInterest: z
      .array(z.string(), { error: messages.productRequired })
      .min(1, messages.productRequired),
    monthlyVolume: z.string().trim().max(120).optional(),
    message: z
      .string({ error: messages.messageTooShort })
      .trim()
      .min(MESSAGE_MIN, messages.messageTooShort)
      .max(MESSAGE_MAX),
    /*
     * Honeypot. Hidden from people, irresistible to naive bots.
     *
     * It is deliberately permissive: a filled honeypot must reach the route
     * handler so the request can be accepted and dropped silently. Rejecting it
     * here would return a validation error and tell the bot exactly which field
     * gave it away.
     */
    website: z.string().max(200).optional(),
  });
}

export type QuoteInput = z.infer<ReturnType<typeof createQuoteSchema>>;
