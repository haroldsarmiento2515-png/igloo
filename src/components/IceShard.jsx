import { useMemo } from "react";
import * as THREE from "three";

export default function IceShard({ reducedMotion }) {
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#cfe8ff"),
        roughness: 0.2,
        transmission: 0.9,
        thickness: 1.5,
        clearcoat: 0.8,
        clearcoatRoughness: 0.3,
        ior: 1.4,
        metalness: 0,
      }),
    []
  );

  const coreGeometry = useMemo(
    () => new THREE.IcosahedronGeometry(1.2, 1),
    []
  );
  const tipGeometry = useMemo(
    () => new THREE.ConeGeometry(0.55, 1.5, 7, 1),
    []
  );

  return (
    <group scale={reducedMotion ? 0.92 : 1}>
      <mesh geometry={coreGeometry} material={material} scale={[1, 1.4, 0.9]} />
      <mesh
        geometry={tipGeometry}
        material={material}
        position={[0, -1.25, 0.25]}
        rotation={[0.2, 0.8, 0.1]}
      />
      <mesh
        geometry={tipGeometry}
        material={material}
        position={[0.25, 0.9, -0.2]}
        rotation={[-0.4, -0.4, 0.5]}
        scale={[0.7, 0.9, 0.7]}
      />
    </group>
  );
}
