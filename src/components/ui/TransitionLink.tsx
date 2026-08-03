'use client';

import type { ComponentProps, MouseEvent } from 'react';

import { Link } from '@/i18n/navigation';
import { usePageTransition } from '@/components/providers/PageTransition';

type TransitionLinkProps = ComponentProps<typeof Link>;

/**
 * Locale-aware link that plays the page-transition wipe before navigating.
 *
 * Modified clicks (new tab, download, middle click) fall through to the browser
 * untouched, and the `href` stays on the anchor so the link remains a real,
 * crawlable, right-clickable URL.
 */
export function TransitionLink({ onClick, ...props }: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const isModified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (event.defaultPrevented || isModified || event.button !== 0) return;

    const href = event.currentTarget.getAttribute('href');
    if (!href || href.startsWith('http')) return;

    event.preventDefault();
    navigate(typeof props.href === 'string' ? props.href : href);
  };

  return <Link {...props} onClick={handleClick} />;
}
