import { useMemo, useState } from "react";

const sections = [
  {
    title: "FLOATING ICE SHARD",
    copy: "A translucent monument drifting through polar dusk.",
  },
  {
    title: "PENGUIN PROTOCOL",
    copy: "Particle-born mascots signal the portfolio archive.",
  },
  {
    title: "IGLOO MANIFESTO",
    copy: "We build immersive, quiet digital worlds that loop forever.",
  },
];

export default function UIOverlay({ scrollRef, scrollProgress, reducedMotion }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const progressDisplay = useMemo(
    () => `${Math.round(scrollProgress * 100)}%`,
    [scrollProgress]
  );

  return (
    <div className="overlay" aria-label="Igloo cinematic experience">
      <div className="hud">
        <div className="hud-top">
          <div className="brand">IGLOO</div>
          <div className="coords">
            <span>LAT 78.9N</span>
            <span>LONG 11.9E</span>
          </div>
        </div>
        <div className="hud-lines">
          <span className="line" />
          <span className="line" />
          <span className="line" />
        </div>
        <div className="hud-right">
          <div className="hud-label">SCROLL</div>
          <div className="hud-progress">{progressDisplay}</div>
          <div className="hud-arrow">↓</div>
        </div>
        <button
          type="button"
          className="sound-toggle"
          onClick={() => setSoundEnabled((prev) => !prev)}
          aria-pressed={soundEnabled}
        >
          Sound: {soundEnabled ? "On" : "Off"}
        </button>
        <div className="hud-footer">
          <span>{reducedMotion ? "REDUCED MOTION" : "FULL MOTION"}</span>
          <span>IGLOO.INC</span>
        </div>
      </div>

      <div className="scroll-loop" ref={scrollRef}>
        {sections.map((section) => (
          <section key={section.title} className="scroll-section">
            <div className="section-content">
              <p className="section-label">{section.title}</p>
              <p className="section-copy">{section.copy}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
