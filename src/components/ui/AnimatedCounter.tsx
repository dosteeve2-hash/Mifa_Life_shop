'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export default function AnimatedCounter({
  from = 0,
  to,
  suffix = '',
  prefix = '',
  duration = 2,
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;

    const obj = { val: from };
    el.textContent = prefix + from.toFixed(decimals) + suffix;

    const ctx = gsap.context(() => {
      const tween = gsap.to(obj, {
        val: to,
        duration,
        ease: 'power2.out',
        paused: true,
        onUpdate() {
          el.textContent =
            prefix +
            obj.val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') +
            suffix;
        },
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter() {
          if (!hasAnimated.current) {
            hasAnimated.current = true;
            tween.play();
          }
        },
      });
    });

    return () => ctx.revert();
  }, [from, to, duration, decimals, prefix, suffix]);

  return (
    <span ref={nodeRef} className={className}>
      {prefix}{from.toFixed(decimals)}{suffix}
    </span>
  );
}
