import SceneCanvas from "./components/SceneCanvas";
import UIOverlay from "./components/UIOverlay";
import usePrefersReducedMotion from "./components/usePrefersReducedMotion";
import useScrollLoop from "./components/useScrollLoop";
import "./index.css";

export default function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollRef, progress } = useScrollLoop({
    reducedMotion: prefersReducedMotion,
  });

  return (
    <div className={`app ${prefersReducedMotion ? "reduced-motion" : ""}`}>
      <SceneCanvas
        scrollProgress={progress}
        reducedMotion={prefersReducedMotion}
      />
      <UIOverlay
        scrollRef={scrollRef}
        scrollProgress={progress}
        reducedMotion={prefersReducedMotion}
      />
    </div>
  );
}
