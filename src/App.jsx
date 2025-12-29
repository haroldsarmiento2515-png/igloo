import { useState } from "react";
import SceneCanvas from "./components/SceneCanvas";
import UIOverlay from "./components/UIOverlay";
import usePrefersReducedMotion from "./components/usePrefersReducedMotion";
import "./index.css";

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={`app ${prefersReducedMotion ? "reduced-motion" : ""}`}>
      <SceneCanvas
        scrollProgress={scrollProgress}
        reducedMotion={prefersReducedMotion}
      />
      <UIOverlay
        onProgress={setScrollProgress}
        reducedMotion={prefersReducedMotion}
      />
    </div>
  );
}
