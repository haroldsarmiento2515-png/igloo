import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function IceShard({ reducedMotion }) {
  const groupRef = useRef(null);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#cfe8ff"),
        roughness: 0.2,
        transmission: 0.92,
        thickness: 1.6,
        clearcoat: 0.9,
        clearcoatRoughness: 0.2,
        ior: 1.4,
        metalness: 0,
      }),
    []
  );

  const coreGeometry = useMemo(
    () => new THREE.IcosahedronGeometry(1.2, 2),
    []
  );
  const tipGeometry = useMemo(
    () => new THREE.ConeGeometry(0.55, 1.5, 7, 1),
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current || reducedMotion) return;
    const time = clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.15;
    groupRef.current.rotation.z = Math.sin(time * 0.4) * 0.08;
  });

  return (
    <group ref={groupRef} scale={reducedMotion ? 0.95 : 1}>
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
