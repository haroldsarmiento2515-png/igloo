"use client";

import { useMemo } from "react";

type Snowflake = {
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};

const SNOWFLAKE_COUNT = 36;

export default function Scene() {
  const flakes = useMemo<Snowflake[]>(
    () =>
      Array.from({ length: SNOWFLAKE_COUNT }, () => ({
        x: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 8 + Math.random() * 10,
        delay: -Math.random() * 10,
        opacity: 0.4 + Math.random() * 0.5,
      })),
    []
  );

  return (
    <div className="scene-wrapper" aria-hidden="true">
      <div className="scene-sky" />
      <div className="scene-ground" />
      <div className="scene-glow" />
      <div className="scene-igloo">
        <div className="scene-igloo-cap" />
        <div className="scene-igloo-door" />
        <div className="scene-igloo-bricks" />
      </div>
      <div className="scene-snow">
        {flakes.map((flake, index) => (
          <span
            key={`flake-${index}`}
            className="scene-snowflake"
            style={{
              "--x": `${flake.x}%`,
              "--size": `${flake.size}px`,
              "--duration": `${flake.duration}s`,
              "--delay": `${flake.delay}s`,
              "--opacity": `${flake.opacity}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
