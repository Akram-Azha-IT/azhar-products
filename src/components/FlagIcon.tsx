import type { Locale } from '../i18n';

/**
 * Drapeaux dessinés en SVG plutôt qu'en emoji : Windows ne rend pas les emoji
 * drapeau en couleur, l'emoji tomberait sur deux lettres grises.
 */
type FlagIconProps = {
  locale: Locale;
  className?: string;
  /** Suffixe d'identifiant : le clip du drapeau britannique doit rester unique. */
  uid: string;
};

function FrenchFlag() {
  return (
    <>
      <rect width="20" height="30" fill="#002654" />
      <rect x="20" width="20" height="30" fill="#FFFFFF" />
      <rect x="40" width="20" height="30" fill="#ED2939" />
    </>
  );
}

function GermanFlag() {
  return (
    <>
      <rect width="60" height="10" fill="#000000" />
      <rect y="10" width="60" height="10" fill="#DD0000" />
      <rect y="20" width="60" height="10" fill="#FFCE00" />
    </>
  );
}

function BritishFlag({ uid }: { uid: string }) {
  const clipId = `union-jack-${uid}`;

  return (
    <>
      <clipPath id={clipId}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath={`url(#${clipId})`}
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </>
  );
}

export default function FlagIcon({ locale, className = '', uid }: FlagIconProps) {
  return (
    <svg
      viewBox="0 0 60 30"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 rounded-[2px] ${className}`}
    >
      {locale === 'fr' && <FrenchFlag />}
      {locale === 'de' && <GermanFlag />}
      {locale === 'en' && <BritishFlag uid={uid} />}
    </svg>
  );
}
