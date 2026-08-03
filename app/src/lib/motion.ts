import { useEffect, useState } from "react";
import type { Transition } from "framer-motion";

export const TRANSITION: Transition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

export const FAST_TRANSITION: Transition = {
  duration: 0.15,
  ease: [0.4, 0, 0.2, 1],
};

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setPrefersReduced(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}

export function useMotionTransition(transition: Transition = TRANSITION): Transition {
  const prefersReducedMotion = usePrefersReducedMotion();
  return prefersReducedMotion ? { duration: 0 } : transition;
}
