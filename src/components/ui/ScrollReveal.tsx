'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  stagger?: number;
  className?: string;
  once?: boolean;
}

function getFromVars(direction: Direction, distance: number) {
  switch (direction) {
    case 'up':    return { y: distance, opacity: 0 };
    case 'down':  return { y: -distance, opacity: 0 };
    case 'left':  return { x: distance, opacity: 0 };
    case 'right': return { x: -distance, opacity: 0 };
    case 'scale': return { scale: 0.85, opacity: 0 };
    case 'fade':  return { opacity: 0 };
    default:      return { y: distance, opacity: 0 };
  }
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 40,
  className = '',
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars = getFromVars(direction, distance);

    gsap.set(el, fromVars);

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once,
      onEnter() {
        gsap.to(el, {
          ...Object.fromEntries(
            Object.keys(fromVars).map((k) => [
              k,
              k === 'opacity' ? 1 : k === 'scale' ? 1 : 0,
            ])
          ),
          opacity: 1,
          duration,
          delay,
          ease: 'power3.out',
          clearProps: 'all',
        });
      },
      onLeaveBack() {
        if (!once) gsap.set(el, fromVars);
      },
    });

    return () => {
      trigger.kill();
      gsap.set(el, { clearProps: 'all' });
    };
  }, [direction, delay, duration, distance, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
