import { renderToString } from 'react-dom/server';
import App from './App';
import { DICTIONARIES, LanguageProvider } from './i18n';
import type { Locale } from './i18n';

/** Le script de prérendu y puise titres, descriptions et FAQ pour le `<head>`. */
export { DICTIONARIES };

/** Appelé par scripts/prerender.mjs, une fois par langue. */
export function render(locale: Locale): string {
  return renderToString(
    <LanguageProvider locale={locale}>
      <App />
    </LanguageProvider>,
  );
}
