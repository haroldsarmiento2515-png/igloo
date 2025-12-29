import { useMemo } from "react";
import * as THREE from "three";

function buildIglooBricks() {
  const bricks = [];
  const radius = 2.4;
  const height = 2.1;
  const rings = 7;

  for (let ring = 0; ring < rings; ring += 1) {
    const ringHeight = (ring / rings) * height;
    const ringRadius = radius * (1 - ring / (rings + 1));
    const segments = Math.max(8, Math.floor(20 - ring * 1.6));

    for (let i = 0; i < segments; i += 1) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * ringRadius;
      const z = Math.sin(angle) * ringRadius;
      const rotationY = -angle + Math.PI / 2;

      bricks.push({
        position: new THREE.Vector3(x, ringHeight, z),
        rotation: new THREE.Euler(0, rotationY, 0),
        scale: new THREE.Vector3(0.6, 0.25, 0.35),
      });
    }
  }

  return bricks;
}

export default function IglooScene({ reducedMotion }) {
  const bricks = useMemo(() => buildIglooBricks(), []);
  const groundGeo = useMemo(() => new THREE.PlaneGeometry(30, 30, 40, 40), []);
  const brickGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const mountainGeoLarge = useMemo(() => new THREE.ConeGeometry(4, 3, 6), []);
  const mountainGeoSmall = useMemo(() => new THREE.ConeGeometry(3.5, 2.6, 6), []);
  const groundMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#d7e9ff",
        roughness: 0.9,
        metalness: 0.1,
      }),
    []
  );

  const brickMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#b9d7ff",
        roughness: 0.5,
        metalness: 0.2,
        emissive: new THREE.Color("#6ea6ff"),
        emissiveIntensity: reducedMotion ? 0.15 : 0.35,
      }),
    [reducedMotion]
  );

  return (
    <group position={[0, -1.2, 0]}>
      <mesh
        geometry={groundGeo}
        material={groundMaterial}
        rotation-x={-Math.PI / 2}
        position={[0, -0.45, 0]}
      />
      <mesh geometry={mountainGeoLarge} position={[-8, 0.5, -6]}>
        <meshStandardMaterial color="#90b7f5" roughness={0.7} />
      </mesh>
      <mesh geometry={mountainGeoSmall} position={[7, 0.4, -7]}>
        <meshStandardMaterial color="#7ea4de" roughness={0.7} />
      </mesh>

      <group>
        {bricks.map((brick, index) => (
          <mesh
            key={`brick-${index}`}
            geometry={brickGeo}
            position={brick.position}
            rotation={brick.rotation}
            scale={brick.scale}
            material={brickMaterial}
          />
        ))}
      </group>
    </group>
  );
}
