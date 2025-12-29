import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const labels = [
  { text: "PORTFOLIO_CO_01", position: [-1.6, 1.2, 0.8] },
  { text: "PUDGY PENGUINS", position: [1.4, 0.6, -0.4] },
  { text: "TEMP: -18.4°C", position: [-1.2, -0.4, -0.8] },
  { text: "DATE: 03.12.25", position: [1.2, -0.9, 0.9] },
  { text: "CLICK TO EXPLORE", position: [0, 1.7, 0] },
];

function createPenguinPoints(count) {
  const positions = [];
  const colors = [];

  const bodyColor = new THREE.Color("#9fb4c9");
  const bellyColor = new THREE.Color("#f1f6ff");
  const beakColor = new THREE.Color("#ffd296");

  let attempts = 0;
  while (positions.length / 3 < count && attempts < count * 10) {
    attempts += 1;
    const x = (Math.random() - 0.5) * 2.2;
    const y = Math.random() * 3.2;
    const z = (Math.random() - 0.5) * 1.6;

    const body = new THREE.Vector3(x, y - 1.2, z).length() < 1.1;
    const head = new THREE.Vector3(x, y - 2.2, z).length() < 0.55;
    const belly = new THREE.Vector3(x * 1.2, y - 1.1, z * 1.2).length() < 0.75;
    const beak =
      y > 2.15 &&
      y < 2.45 &&
      Math.abs(x) < 0.2 &&
      z > 0.25 &&
      z < 0.55;

    if (body || head || beak) {
      positions.push(x, y, z);
      if (beak) {
        colors.push(beakColor.r, beakColor.g, beakColor.b);
      } else if (belly && !head) {
        colors.push(bellyColor.r, bellyColor.g, bellyColor.b);
      } else {
        colors.push(bodyColor.r, bodyColor.g, bodyColor.b);
      }
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
  };
}

export default function PenguinVoxel({ reducedMotion }) {
  const pointsRef = useRef(null);
  const { positions, colors } = useMemo(
    () => createPenguinPoints(reducedMotion ? 900 : 1800),
    [reducedMotion]
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current || reducedMotion) return;
    const time = clock.getElapsedTime();
    pointsRef.current.rotation.y = Math.sin(time * 0.3) * 0.4;
    pointsRef.current.rotation.x = Math.cos(time * 0.2) * 0.1;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={reducedMotion ? 0.05 : 0.035}
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>

      {labels.map((label) => (
        <Html
          key={label.text}
          position={label.position}
          transform
          occlude
          className="penguin-label"
        >
          <button
            type="button"
            className="penguin-button"
            onClick={() => console.info(`Label clicked: ${label.text}`)}
          >
            {label.text}
          </button>
        </Html>
      ))}
    </group>
  );
}
