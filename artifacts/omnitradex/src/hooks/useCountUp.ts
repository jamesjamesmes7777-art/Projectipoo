import { useEffect, useState } from 'react';

export function useCountUp(target: number, duration = 1400, startDelay = 200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let rafId: number;

    const delay = setTimeout(() => {
      function step(timestamp: number) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) {
          rafId = requestAnimationFrame(step);
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
