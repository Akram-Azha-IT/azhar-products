'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { TransitionLink } from './TransitionLink';

type Variant = 'primary' | 'ghost';

const BASE =
  'group relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden ' +
  'px-8 py-4 text-sm font-medium tracking-[0.04em] uppercase transition-colors ' +
  'duration-[var(--duration-ui)] ease-[var(--ease-brand)] disabled:cursor-not-allowed disabled:opacity-50';

const VARIANT: Record<Variant, string> = {
  primary: 'bg-accent-strong text-paper hover:text-accent-strong',
  ghost:
    'border border-steel-light text-navy hover:border-navy hover:text-paper focus-visible:text-navy',
};

/** The wipe surface: scales up from the bottom edge on hover. */
const FILL: Record<Variant, string> = {
  primary: 'bg-mist',
  ghost: 'bg-navy-deep',
};

interface ButtonContentProps {
  variant: Variant;
  children: ReactNode;
}

function Fill({ variant }: { variant: Variant }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-0 -z-10 origin-bottom scale-y-0 transition-transform duration-[var(--duration-ui)] ease-[var(--ease-brand)] group-hover:scale-y-100 motion-reduce:transition-none ${FILL[variant]}`}
    />
  );
}

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Partial<ButtonContentProps> {}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${BASE} ${VARIANT[variant]} ${className}`} {...props}>
      <Fill variant={variant} />
      {children}
    </button>
  );
}

interface ButtonLinkProps extends ButtonContentProps {
  href: string;
  className?: string;
}

export function ButtonLink({
  href,
  variant = 'primary',
  className = '',
  children,
}: ButtonLinkProps) {
  return (
    <TransitionLink
      href={href}
      className={`${BASE} ${VARIANT[variant]} ${className}`}
    >
      <Fill variant={variant} />
      {children}
    </TransitionLink>
  );
}
