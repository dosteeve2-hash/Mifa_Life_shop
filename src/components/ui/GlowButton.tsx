'use client';

import { useRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';

type Variant = 'gold' | 'navy' | 'outline' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<Variant, string> = {
  gold:    'bg-gold text-navy font-bold shadow-gold-glow hover-gold border-0',
  navy:    'bg-navy text-gold border border-gold/30 hover-navy',
  outline: 'bg-transparent text-gold border border-gold/50 hover-outline',
  ghost:   'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10',
};

const SIZE_STYLES: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
};

const BASE =
  'inline-flex items-center justify-center rounded-xl font-semibold ' +
  'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-gold/60 disabled:opacity-50 disabled:pointer-events-none ' +
  'relative overflow-hidden select-none';

export default function GlowButton({
  children,
  variant = 'gold',
  size = 'md',
  href,
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  className = '',
  ...rest
}: GlowButtonProps) {
  const rippleRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = rippleRef.current;
    if (!ripple) return;
    ripple.style.left = `${x}px`;
    ripple.style.top  = `${y}px`;
    ripple.style.opacity = '1';
    ripple.style.transform = 'scale(0) translate(-50%, -50%)';
    requestAnimationFrame(() => {
      ripple.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      ripple.style.transform = 'scale(4) translate(-50%, -50%)';
      ripple.style.opacity = '0';
    });
  };

  const cls = [
    BASE,
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    fullWidth ? 'w-full' : '',
    className,
  ].join(' ');

  const inner = (
    <>
      <span
        ref={rippleRef}
        style={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          pointerEvents: 'none',
          opacity: 0,
          transformOrigin: 'center',
        }}
      />
      {loading ? (
        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="10" />
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </>
  );

  if (href) {
    return (
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={fullWidth ? 'w-full' : 'inline-block'}>
        <Link href={href} className={cls} onMouseEnter={handleMouseEnter}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...rest}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cls}
      onMouseEnter={handleMouseEnter}
    >
      {inner}
    </motion.button>
  );
}
