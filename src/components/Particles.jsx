import { useMemo } from "react";
import * as THREE from "three";

export default function Particles({ density = 1, reducedMotion }) {
  const count = reducedMotion
    ? 200
    : Math.floor(700 + Math.max(density, 0.2) * 450);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 6 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      array[i * 3 + 2] = radius * Math.cos(phi);
    }
    return array;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#b8d9ff",
        size: 0.03,
        sizeAttenuation: true,
        transparent: true,
        opacity: reducedMotion ? 0.35 : 0.55,
      }),
    [reducedMotion]
  );

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}
