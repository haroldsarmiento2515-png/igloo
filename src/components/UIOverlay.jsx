import { useEffect, useMemo, useRef, useState } from "react";

const navItems = [
  { label: "Home", index: 0 },
  { label: "Portfolio", index: 1 },
  { label: "Contact", index: 2 },
];

const portfolioItems = [
  {
    title: "Pudgy Penguins",
    description: "Digital collectibles with a warm, icy soul.",
  },
  {
    title: "OverpassIP",
    description: "Identity layer for the next-generation web.",
  },
  {
    title: "Arctic Labs",
    description: "Spatial computing studio for chill surfaces.",
  },
  {
    title: "Glacier Pay",
    description: "Modern treasury tools for global makers.",
  },
];

export default function UIOverlay({ onProgress, reducedMotion }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleNav = (index) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.clientHeight * index,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let frameId = null;
    const updateProgress = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(() => {
        const maxScroll = container.scrollHeight - container.clientHeight;
        const nextProgress = maxScroll > 0 ? container.scrollTop / maxScroll : 0;
        setProgress(nextProgress);
        if (onProgress) {
          onProgress(nextProgress);
        }
        frameId = null;
      });
    };

    updateProgress();
    container.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      container.removeEventListener("scroll", updateProgress);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [onProgress]);

  const progressWidth = useMemo(() => `${Math.min(progress * 100, 100)}%`, [
    progress,
  ]);

  return (
    <div className="overlay" aria-label="Igloo landing page">
      <div className="hud">
        <div className="brand">IGLOO</div>
        <nav className="nav" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className="nav-link"
              onClick={() => handleNav(item.index)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="sound-toggle"
          onClick={() => setSoundEnabled((prev) => !prev)}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? "Sound On" : "Sound Off"}
        </button>
        <div className="progress-track" aria-hidden="true">
          <span className="progress-bar" style={{ width: progressWidth }} />
        </div>
      </div>

      <div className="scroll-container" ref={containerRef}>
        <section className="section" id="home">
          <div className="section-inner">
            <p className="eyebrow">Igloo Inc / 2025</p>
            <h1>IGLOO INC</h1>
            <p className="lead">
              A minimal studio shaping premium digital environments for the next
              wave of immersive brands.
            </p>
            <button className="cta" type="button">
              Start a project
            </button>
          </div>
        </section>

        <section className="section" id="portfolio">
          <div className="section-inner">
            <p className="eyebrow">Portfolio</p>
            <h2>Curated cold-proof builds.</h2>
            <div className="cards">
              {portfolioItems.map((item) => (
                <article key={item.title} className="card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="section-inner">
            <p className="eyebrow">About / Contact</p>
            <h2>Precision, clarity, and calm.</h2>
            <p className="lead">
              We craft spacious, scroll-driven experiences that blend real-time
              3D, thoughtful motion, and a focused product narrative.
            </p>
            <div className="links">
              <a href="mailto:hello@igloo.inc">hello@igloo.inc</a>
              <a href="https://igloo.inc" target="_blank" rel="noreferrer">
                igloo.inc
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                Twitter / X
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
