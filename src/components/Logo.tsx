'use client';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dark?: boolean;
  className?: string;
}

const sizes = {
  sm:  { width: 100, height: 28 },
  md:  { width: 140, height: 40 },
  lg:  { width: 180, height: 50 },
  xl:  { width: 240, height: 68 },
};

export default function Logo({ variant = 'full', size = 'md', dark = false, className = '' }: LogoProps) {
  const { width, height } = sizes[size];
  const textColor  = dark ? '#FFFFFF' : '#1A2422';
  const subColor   = dark ? 'rgba(255,255,255,0.5)' : '#9cb5a8';

  /* ── Icon only ── */
  if (variant === 'icon') {
    const s = height;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width={s} height={s} className={className} aria-label="Mifa Life">
        <rect width="56" height="56" rx="12" fill="#009A00"/>
        {/* Mali stripe on left */}
        <rect x="6"  y="6" width="4" height="44" rx="2" fill="#ffffff" opacity="0.9"/>
        <rect x="11" y="6" width="4" height="44" rx="2" fill="#FFD700"/>
        <rect x="16" y="6" width="4" height="44" rx="2" fill="#CE1126"/>
        {/* M mark */}
        <path d="M26 44 L26 14 L39 30 L52 14 L52 44" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    );
  }

  /* ── Compact (icon + MIFA) ── */
  if (variant === 'compact') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 44" width={width} height={height} className={className} aria-label="Mifa Life">
        {/* Mali stripe bars */}
        <rect x="0" y="4"  width="3.5" height="36" rx="1.75" fill="#009A00"/>
        <rect x="5" y="4"  width="3.5" height="36" rx="1.75" fill="#FFD700"/>
        <rect x="10" y="4" width="3.5" height="36" rx="1.75" fill="#CE1126"/>
        {/* M mark */}
        <path d="M20 38 L20 10 L30 24 L40 10 L40 38" stroke="#009A00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* MIFA */}
        <text x="48" y="28" fontFamily="Georgia,'Times New Roman',serif" fontSize="18" fontWeight="700" fill={textColor} letterSpacing="2">MIFA</text>
        {/* dot */}
        <circle cx="94" cy="24" r="2.5" fill="#009A00"/>
        {/* LIFE */}
        <text x="100" y="28" fontFamily="Georgia,'Times New Roman',serif" fontSize="18" fontWeight="400" fill="#009A00" letterSpacing="2">LIFE</text>
      </svg>
    );
  }

  /* ── Full logo ── */
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 60" width={width} height={height} className={className} aria-label="Mifa Life — La boutique premium du Mali">
      {/* Mali stripe bars */}
      <rect x="0" y="4"  width="4" height="52" rx="2" fill="#009A00"/>
      <rect x="6" y="4"  width="4" height="52" rx="2" fill="#FFD700"/>
      <rect x="12" y="4" width="4" height="52" rx="2" fill="#CE1126"/>

      {/* M lettermark */}
      <path d="M24 50 L24 14 L38 32 L52 14 L52 50" stroke="#009A00" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>

      {/* MIFA */}
      <text x="62" y="36" fontFamily="Georgia,'Times New Roman',serif" fontSize="22" fontWeight="700" fill={textColor} letterSpacing="3">MIFA</text>

      {/* separator */}
      <circle cx="120" cy="32" r="3" fill="#009A00"/>

      {/* LIFE */}
      <text x="128" y="36" fontFamily="Georgia,'Times New Roman',serif" fontSize="22" fontWeight="400" fill="#009A00" letterSpacing="3">LIFE</text>

      {/* Tagline */}
      <text x="62" y="50" fontFamily="'Helvetica Neue',Arial,sans-serif" fontSize="8" fontWeight="600" fill={subColor} letterSpacing="4">MALI PREMIUM</text>

      {/* Mali accent line under tagline */}
      <rect x="62"  y="55" width="20" height="2" rx="1" fill="#009A00"/>
      <rect x="84"  y="55" width="20" height="2" rx="1" fill="#FFD700"/>
      <rect x="106" y="55" width="20" height="2" rx="1" fill="#CE1126"/>
    </svg>
  );
}
