import { useEffect, useState } from 'react';

/**
 * `true` tant que la requête média correspond.
 *
 * La valeur n'est lue qu'après montage : le premier rendu client est donc
 * identique au rendu prérendu, sans écart d'hydratation. `defaultValue` décrit
 * ce que voit le serveur, donc l'hypothèse mobile par défaut.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
