// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx and handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate transition properties for a fly and scale animation
 */
export function flyAndScale(
  node: HTMLElement,
  { delay = 0, duration = 150, easing = (x: number) => x, y = 5 } = {}
) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;

  return {
    delay,
    duration,
    css: (t: number) => {
      const eased = easing(t);
      return `
        transform: ${transform} translate3d(0, ${(1 - eased) * y}px, 0) scale(${eased});
        opacity: ${eased * opacity}
      `;
    }
  };
}