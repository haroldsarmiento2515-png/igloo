"use client";

import { forwardRef, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type IglooProps = {
  assembleRef: MutableRefObject<number>;
  glowRef: MutableRefObject<number>;
};

type Block = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  lift: number;
};

const Igloo = forwardRef<THREE.Group, IglooProps>(
  ({ assembleRef, glowRef }, ref) => {
    const blockRefs = useRef<THREE.Mesh[]>([]);
    const capRef = useRef<THREE.Mesh>(null);
  const blocks = useMemo<Block[]>(() => {
    const collection: Block[] = [];
    const ringCount = 6;
    for (let ring = 0; ring < ringCount; ring += 1) {
      const radius = 3.6 - ring * 0.45;
      const y = ring * 0.52;
      const count = Math.max(8, Math.floor((Math.PI * 2 * radius) / 1.1));
      for (let i = 0; i < count; i += 1) {
        const angle = (i / count) * Math.PI * 2;
        const entranceGap = Math.abs(Math.sin(angle)) < 0.25 && ring < 3;
        if (entranceGap && Math.cos(angle) > 0.6) {
          continue;
        }
        collection.push({
          position: [
            Math.cos(angle) * radius,
            y,
            Math.sin(angle) * radius,
          ],
          rotation: [0, -angle + Math.PI / 2, 0],
          scale: [0.95, 0.42, 0.65],
          lift: 0.25 + Math.random() * 0.35,
        });
      }
    }

    const entranceBlocks: Block[] = [
      {
        position: [4, 0.2, 0.4],
        rotation: [0, -0.2, 0],
        scale: [1, 0.5, 0.8],
        lift: 0.3,
      },
      {
        position: [4.3, 0.2, -0.4],
        rotation: [0, 0.2, 0],
        scale: [1, 0.5, 0.8],
        lift: 0.32,
      },
      {
        position: [3.9, 0.8, 0],
        rotation: [0, 0, 0],
        scale: [0.9, 0.45, 0.7],
        lift: 0.28,
      },
    ];

    return collection.concat(entranceBlocks);
  }, []);

    useFrame(() => {
      const assemble = assembleRef.current;
      const glow = glowRef.current;
      const emissiveIntensity = THREE.MathUtils.lerp(0.2, 1.4, glow);

      blockRefs.current.forEach((mesh, index) => {
        const block = blocks[index];
        if (!mesh || !block) return;
        mesh.position.y = block.position[1] - block.lift * (1 - assemble);
        const material = mesh.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = emissiveIntensity;
      });

      if (capRef.current) {
        const material = capRef.current
          .material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = emissiveIntensity * 0.9;
      }
    });

    return (
      <group ref={ref} position={[2.2, 0, 0]}>
        {blocks.map((block, index) => (
          <mesh
            key={`block-${index}`}
            ref={(mesh) => {
              if (mesh) blockRefs.current[index] = mesh;
            }}
            position={block.position}
            rotation={block.rotation}
            scale={block.scale}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color="#9ca4af"
              roughness={0.5}
              metalness={0.05}
              emissive="#eef6ff"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
        <mesh ref={capRef} position={[0, 2.9, 0]}>
          <sphereGeometry
            args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#a8b2bd"
            roughness={0.4}
            emissive="#f0f6ff"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>
    );
  }
);

Igloo.displayName = "Igloo";

export default Igloo;
