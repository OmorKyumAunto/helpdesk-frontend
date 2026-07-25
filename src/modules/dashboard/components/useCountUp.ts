import { useEffect, useRef, useState } from "react";

/**
 * Eases a number from its previous value to the target so KPI figures roll up
 * instead of snapping.
 *
 * `startDelay` holds the tween until the card's entrance transform has settled
 * — running the rAF text updates while the element is still animating in forces
 * layout inside a moving compositor layer, which is a real source of load jank.
 * Respects prefers-reduced-motion (snaps straight to the value).
 */
export const useCountUp = (target: number, duration = 900, startDelay = 0) => {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    if (reduce || target === fromRef.current) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }

    const from = fromRef.current;
    let raf = 0;
    let startTs = 0;

    const tick = (now: number) => {
      if (!startTs) startTs = now;
      const t = Math.min(1, (now - startTs) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };

    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, startDelay]);

  return display;
};
