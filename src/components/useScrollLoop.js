import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

export default function useScrollLoop({ reducedMotion = false } = {}) {
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef({ value: 0 });
  const tweenRef = useRef(null);

  const updateProgress = useMemo(
    () =>
      (next) => {
        if (reducedMotion) {
          progressRef.current.value = next;
          setProgress(next);
          return;
        }

        if (tweenRef.current) {
          tweenRef.current.kill();
        }

        tweenRef.current = gsap.to(progressRef.current, {
          value: next,
          duration: 0.65,
          ease: "power3.out",
          onUpdate: () => setProgress(progressRef.current.value),
        });
      },
    [reducedMotion]
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) return;

      if (container.scrollTop <= 0) {
        container.scrollTop = maxScroll - 2;
      } else if (container.scrollTop >= maxScroll) {
        container.scrollTop = 2;
      }

      const next = container.scrollTop / maxScroll;
      updateProgress(next % 1);
    };

    container.scrollTop = 2;
    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [updateProgress]);

  return { scrollRef, progress };
}
