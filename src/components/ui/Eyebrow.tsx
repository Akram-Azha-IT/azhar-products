import type { ReactNode } from 'react';

interface EyebrowProps {
  /** Chapter number, e.g. "01". Rendered before an em dash. */
  index?: string;
  children: ReactNode;
  className?: string;
}

/** Section label: "01 — Products". */
export function Eyebrow({ index, children, className = '' }: EyebrowProps) {
  return (
    <p className={`eyebrow text-steel ${className}`}>
      {index ? <span aria-hidden>{index} — </span> : null}
      {children}
    </p>
  );
}
