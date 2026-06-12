'use client';

/* Motion signature STEEVE.DO — charte « Nuit Sahélienne & Or » §5bis
   Cible les sélecteurs existants du site (aucun markup à modifier).
   Respecte prefers-reduced-motion. */

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const HERO_SEQUENCE = [
  '.hero-eyebrow',
  '.hero-h1',
  '.hero-sub',
  '.hero-search',
  '.hero-chips',
  '.hero-cards',
];

const SCROLL_BLOCKS = [
  '.sec-hd',
  '#cats-grid',
  '#featured-grid',
  '.how-grid',
  '.trust-grid',
  '.cta-in',
];

export default function BrandMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroEls = HERO_SEQUENCE
        .map((sel) => document.querySelector<HTMLElement>(sel))
        .filter((el): el is HTMLElement => el !== null);
      if (heroEls.length) {
        gsap.from(heroEls, {
          opacity: 0,
          y: 26,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.11,
          delay: 0.1,
          clearProps: 'all',
        });
      }

      SCROLL_BLOCKS.forEach((sel) => {
        gsap.utils.toArray<HTMLElement>(sel).forEach((block) => {
          gsap.from(block, {
            opacity: 0,
            y: 24,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'all',
            scrollTrigger: { trigger: block, start: 'top 82%' },
          });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
