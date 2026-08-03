'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'soft' | 'ghost';

const BASE =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-(--radius-pill) ' +
  'px-7 py-3.5 text-sm font-semibold tracking-[0.01em] ' +
  'transition-[background-color,color,transform,box-shadow] duration-[var(--duration-ui)] ' +
  'ease-[var(--ease-brand)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ' +
  'motion-reduce:transition-none motion-reduce:active:scale-100';

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-accent text-paper shadow-[0_8px_20px_-8px_rgba(10,99,201,0.7)] hover:bg-ink hover:shadow-[0_10px_24px_-8px_rgba(16,21,28,0.5)]',
  soft: 'bg-panel text-ink hover:bg-panel-deep',
  ghost: 'border border-line text-ink hover:border-ink',
};

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${BASE} ${VARIANT[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Anchor-styled button. The site is one page, so these are in-page jumps — a
 * plain `<a href="#id">` keeps them shareable and keyboard-native.
 */
export function ButtonLink({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={`${BASE} ${VARIANT[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
