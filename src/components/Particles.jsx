import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function Particles({ count = 800, reducedMotion }) {
  const pointsRef = useRef(null);
  const { positions, velocities } = useMemo(() => {
    const array = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 20;
      array[i * 3 + 1] = Math.random() * 8 + 1;
      array[i * 3 + 2] = (Math.random() - 0.5) * 20;
      speed[i] = 0.2 + Math.random() * 0.6;
    }
    return { positions: array, velocities: speed };
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#c7e6ff",
        size: reducedMotion ? 0.035 : 0.025,
        sizeAttenuation: true,
        transparent: true,
        opacity: reducedMotion ? 0.35 : 0.6,
      }),
    [reducedMotion]
  );

  useFrame((_, delta) => {
    if (!pointsRef.current || reducedMotion) return;
    const positionAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i += 1) {
      const index = i * 3 + 1;
      positionAttr.array[index] -= velocities[i] * delta;
      if (positionAttr.array[index] < -1) {
        positionAttr.array[index] = 9;
      }
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
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
