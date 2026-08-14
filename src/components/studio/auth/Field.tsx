'use client';

import type { ReactNode } from 'react';

interface FieldProps {
  icon: ReactNode;
  label: string;
  type: string;
  value: string;
  maxLength: number;
  autoComplete: string;
  onChange: (value: string) => void;
}

/**
 * Champ à libellé flottant : le label monte dès que le champ est actif ou rempli.
 * L'état « rempli » est détecté en CSS via `:not(:placeholder-shown)` — d'où le
 * `placeholder=" "` volontaire, qui évite un state React par champ.
 */
export default function Field({
  icon,
  label,
  type,
  value,
  maxLength,
  autoComplete,
  onChange,
}: FieldProps) {
  const floated =
    'peer-focus:top-3.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase ' +
    'peer-focus:tracking-[.08em] peer-focus:text-gold ' +
    'peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[10px] ' +
    'peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:uppercase ' +
    'peer-[:not(:placeholder-shown)]:tracking-[.08em]';

  return (
    <label className="group relative block">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4f6d8e] transition-colors group-focus-within:text-gold">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder=" "
        onChange={(e) => onChange(e.target.value)}
        className="peer h-[52px] w-full rounded-xl border border-gold/15 bg-white/[.04] pl-10 pr-3 pt-4 text-sm text-[#e8edf5] transition-colors focus:border-gold/60 focus:bg-gold/[.05] focus:outline-none"
      />
      <span
        className={`pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-xs text-[#4f6d8e] transition-all duration-200 ${floated}`}
      >
        {label}
      </span>
    </label>
  );
}
