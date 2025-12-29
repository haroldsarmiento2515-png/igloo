"use client";

import Scene from "../components/Scene";
import OverlayUI from "../components/OverlayUI";

export default function Home() {
  return (
    <main className="page">
      <Scene />
      <OverlayUI />
      <div className="scroll-spacer" aria-hidden="true" />
    </main>
  );
}
