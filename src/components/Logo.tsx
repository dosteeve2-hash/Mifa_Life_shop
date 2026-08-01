'use client';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm:  { width: 110, height: 32  },
  md:  { width: 152, height: 44  },
  lg:  { width: 200, height: 58  },
  xl:  { width: 256, height: 74  },
};

// ── Adinkra-inspired diamond ornament ─────────────────────────────────────────
function AfricanOrnament({ x, y, r = 10 }: { x: number; y: number; r?: number }) {
  const d = r;
  return (
    <g>
      {/* Central diamond */}
      <polygon
        points={`${x},${y - d} ${x + d * 0.6},${y} ${x},${y + d} ${x - d * 0.6},${y}`}
        fill="#D4AF37"
        opacity="0.95"
      />
      {/* Inner diamond */}
      <polygon
        points={`${x},${y - d * 0.5} ${x + d * 0.3},${y} ${x},${y + d * 0.5} ${x - d * 0.3},${y}`}
        fill="#0A1628"
        opacity="0.8"
      />
      {/* Four corner dots — kente/adinkra accent */}
      <circle cx={x}            cy={y - d * 1.5} r={d * 0.18} fill="#D4AF37" opacity="0.7" />
      <circle cx={x + d * 0.95} cy={y}            r={d * 0.18} fill="#D4AF37" opacity="0.7" />
      <circle cx={x}            cy={y + d * 1.5} r={d * 0.18} fill="#D4AF37" opacity="0.7" />
      <circle cx={x - d * 0.95} cy={y}            r={d * 0.18} fill="#D4AF37" opacity="0.7" />
    </g>
  );
}

// ── Icon only ─────────────────────────────────────────────────────────────────
function IconOnly({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 56"
      width={size}
      height={size}
      aria-label="MIFA Life"
    >
      <rect width="56" height="56" rx="14" fill="#0D1E38" />
      {/* Background ornament glow */}
      <ellipse cx="28" cy="28" rx="18" ry="18" fill="#D4AF37" opacity="0.08" />
      {/* M lettermark in gold */}
      <path
        d="M13 42 L13 16 L28 32 L43 16 L43 42"
        stroke="#D4AF37"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Dot accent */}
      <circle cx="28" cy="44" r="2.2" fill="#00D4FF" opacity="0.9" />
    </svg>
  );
}

// ── Compact (icon + MIFA LIFE) ────────────────────────────────────────────────
function Compact({ width, height }: { width: number; height: number }) {
  const scale = height / 44;
  const vw = Math.round(width / scale);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${vw} 44`}
      width={width}
      height={height}
      aria-label="MIFA Life"
    >
      {/* Ornament */}
      <AfricanOrnament x={13} y={22} r={9} />
      {/* MIFA */}
      <text
        x="30"
        y="27"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="21"
        fontWeight="700"
        fontStyle="italic"
        fill="#D4AF37"
        letterSpacing="3"
      >
        MIFA
      </text>
      {/* LIFE */}
      <text
        x="93"
        y="27"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="21"
        fontWeight="300"
        fill="#E8F4FF"
        letterSpacing="3"
        opacity="0.88"
      >
        LIFE
      </text>
    </svg>
  );
}

// ── Full logo ─────────────────────────────────────────────────────────────────
function Full({ width, height }: { width: number; height: number }) {
  const scale = height / 58;
  const vw = Math.round(width / scale);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${vw} 58`}
      width={width}
      height={height}
      aria-label="MIFA Life — Boutique premium africaine"
    >
      {/* Ornament left */}
      <AfricanOrnament x={14} y={24} r={11} />

      {/* MIFA — gold italic serif */}
      <text
        x="34"
        y="32"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="26"
        fontWeight="700"
        fontStyle="italic"
        fill="#D4AF37"
        letterSpacing="3.5"
      >
        MIFA
      </text>

      {/* Thin separator line */}
      <line
        x1="116" y1="14"
        x2="116" y2="34"
        stroke="#D4AF37"
        strokeWidth="1"
        opacity="0.35"
      />

      {/* LIFE — light, cyan accent */}
      <text
        x="124"
        y="32"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="26"
        fontWeight="300"
        fill="#00D4FF"
        letterSpacing="3.5"
        opacity="0.92"
      >
        LIFE
      </text>

      {/* Tagline */}
      <text
        x="34"
        y="47"
        fontFamily="'JetBrains Mono', 'Courier New', monospace"
        fontSize="7"
        fontWeight="500"
        fill="#D4AF37"
        letterSpacing="5"
        opacity="0.55"
      >
        BOUTIQUE PREMIUM AFRICAINE
      </text>

      {/* Gold accent line under tagline */}
      <rect x="34" y="52" width="30" height="1.5" rx="1" fill="#D4AF37" opacity="0.4" />
      <rect x="66" y="52" width="30" height="1.5" rx="1" fill="#00D4FF" opacity="0.25" />
    </svg>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const { width, height } = sizes[size];

  if (variant === 'icon') {
    return (
      <span className={className} aria-label="MIFA Life">
        <IconOnly size={height} />
      </span>
    );
  }

  if (variant === 'compact') {
    return (
      <span className={className}>
        <Compact width={width} height={height} />
      </span>
    );
  }

  return (
    <span className={className}>
      <Full width={width} height={height} />
    </span>
  );
}
