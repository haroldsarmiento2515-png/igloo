"use client";

import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type SnowProps = {
  intensityRef: MutableRefObject<number>;
};

const MAX_PARTICLES = 700;

export default function Snow({ intensityRef }: SnowProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const velocities = useMemo(
    () =>
      Array.from({ length: MAX_PARTICLES }, () => ({
        speed: 0.3 + Math.random() * 0.6,
        driftX: (Math.random() - 0.5) * 0.4,
        driftZ: (Math.random() - 0.5) * 0.4,
      })),
    []
  );

  const positions = useMemo(() => {
    const array = new Float32Array(MAX_PARTICLES * 3);
    for (let i = 0; i < MAX_PARTICLES; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 40;
      array[i * 3 + 1] = Math.random() * 12 + 2;
      array[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return array;
  }, []);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    const positionArray = points.geometry.attributes.position
      .array as Float32Array;
    const intensity = intensityRef.current;
    const drawCount = Math.floor(
      THREE.MathUtils.lerp(0.3, 1, intensity) * MAX_PARTICLES
    );
    points.geometry.setDrawRange(0, drawCount);

    for (let i = 0; i < MAX_PARTICLES; i += 1) {
      const baseIndex = i * 3;
      positionArray[baseIndex + 1] -=
        velocities[i].speed * delta * (0.6 + intensity);
      positionArray[baseIndex] += velocities[i].driftX * delta;
      positionArray[baseIndex + 2] += velocities[i].driftZ * delta;

      if (positionArray[baseIndex + 1] < -1) {
        positionArray[baseIndex + 1] = 10 + Math.random() * 6;
        positionArray[baseIndex] = (Math.random() - 0.5) * 40;
        positionArray[baseIndex + 2] = (Math.random() - 0.5) * 40;
      }
    }

    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f3f7fb"
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </points>
  );
}
