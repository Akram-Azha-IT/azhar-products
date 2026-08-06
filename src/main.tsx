import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider, localeFromPath } from './i18n';
import './index.css';

const container = document.getElementById('root')!;
const tree = (
  <StrictMode>
    <LanguageProvider locale={localeFromPath(window.location.pathname)}>
      <App />
    </LanguageProvider>
  </StrictMode>
);

// La page servie est déjà prérendue : on l'hydrate au lieu de la reconstruire.
if (container.firstElementChild) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
