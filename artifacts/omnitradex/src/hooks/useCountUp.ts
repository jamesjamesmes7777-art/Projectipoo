import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 1400, startDelay = 200): number {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      fromRef.current = 0;
      return;
    }

    const from = fromRef.current;
    let start: number | null = null;
    let rafId: number;

    const delay = setTimeout(() => {
      function step(timestamp: number) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const next = Math.round(from + (target - from) * eased);
        setValue(next);
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          fromRef.current = target;
        }
      }
      rafId = requestAnimationFrame(step);
    }, startDelay);

    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(rafId);
    };
  }, [target, duration, startDelay]);

  return value;
}
