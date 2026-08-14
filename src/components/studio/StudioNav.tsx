'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { SPRING } from '@/lib/motion/presets';

const LINKS = [
  { href: '/studio', label: 'Composants' },
  { href: '/studio/dashboard', label: 'Dashboard' },
  { href: '/studio/auth', label: 'Auth' },
];

/** Navigation du studio ; le surlignage glisse d'un lien à l'autre entre les pages. */
export default function StudioNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-[62px] z-[500] border-b border-gold/12 bg-[#0A1628]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center gap-1 overflow-x-auto px-4 py-2 sm:px-7">
        {LINKS.map((link) => {
          const on = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                on ? 'text-navy' : 'text-[#93aacb] hover:text-gold'
              }`}
            >
              {on && (
                <motion.span
                  layoutId="forge-studio-nav"
                  transition={SPRING.glide}
                  className="absolute inset-0 rounded-lg bg-gold"
                />
              )}
              <span className="relative">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
