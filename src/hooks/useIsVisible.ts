import { type RefObject, useEffect, useState } from "react";

/** Indica se o elemento referenciado está visível na tela. Começa como visível. */
export default function useIsVisible(ref: RefObject<Element | null>): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return visible;
}
