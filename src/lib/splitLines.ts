const LINE_CLASS = 'reveal-line';
const SOURCE_ATTR = 'data-split-source';

/**
 * Rewrites an element's text into one masked wrapper per visual line:
 *
 *   <div class="reveal-line"><span>…line text…</span></div>
 *
 * Lines are derived by measuring where words actually wrap, so the split
 * follows the real layout at the current width rather than a guess. Call it
 * again on resize — the original text is stashed on the element, making the
 * operation idempotent.
 *
 * Returns the inner `<span>` elements, which are what gets animated.
 */
export function splitIntoLines(element: HTMLElement): HTMLElement[] {
  const source = element.getAttribute(SOURCE_ATTR) ?? element.textContent ?? '';
  if (!source.trim()) return [];

  element.setAttribute(SOURCE_ATTR, source);
  element.textContent = '';

  const words = source.trim().split(/\s+/);
  const probes = words.map((word) => {
    const probe = document.createElement('span');
    probe.style.display = 'inline-block';
    probe.textContent = word;
    element.append(probe, document.createTextNode(' '));
    return probe;
  });

  const lines: string[][] = [];
  let currentTop: number | null = null;

  probes.forEach((probe, index) => {
    const top = probe.offsetTop;
    if (currentTop === null || Math.abs(top - currentTop) > 1) {
      currentTop = top;
      lines.push([]);
    }
    lines[lines.length - 1].push(words[index]);
  });

  element.textContent = '';

  return lines.map((line) => {
    const mask = document.createElement('span');
    mask.className = LINE_CLASS;

    const inner = document.createElement('span');
    inner.textContent = line.join(' ');

    mask.appendChild(inner);
    element.appendChild(mask);
    return inner;
  });
}

/** Restores the element's original, unsplit text. */
export function restoreLines(element: HTMLElement): void {
  const source = element.getAttribute(SOURCE_ATTR);
  if (source === null) return;
  element.textContent = source;
}
