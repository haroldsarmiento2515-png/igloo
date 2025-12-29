"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Igloo from "./Igloo";
import Snow from "./Snow";

const lerp = (start: THREE.Vector3, end: THREE.Vector3, t: number) =>
  new THREE.Vector3().lerpVectors(start, end, t);

function SceneContent() {
  const { camera, scene } = useThree();
  const terrainRef = useRef<THREE.Mesh>(null);
  const progressTarget = useRef(0);
  const progressSmooth = useRef(0);
  const assembleRef = useRef(0);
  const glowRef = useRef(0);
  const snowRef = useRef(0);

  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(90, 90, 160, 160);
    geometry.rotateX(-Math.PI / 2);
    const position = geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const base =
        Math.sin(x * 0.18) * 0.4 +
        Math.cos(z * 0.22) * 0.35 +
        Math.sin((x + z) * 0.12) * 0.25;
      const radius = Math.sqrt(x * x + z * z);
      const falloff = Math.max(0, 1 - radius / 50);
      position.setY(i, base * falloff);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const rocks = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        const radius = 16 + Math.sin(index) * 6;
        return {
          position: [
            Math.cos(angle) * radius,
            -0.3,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          scale: 0.8 + (index % 4) * 0.15,
        };
      }),
    []
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        progressTarget.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, []);

  useFrame((state, delta) => {
    progressSmooth.current = THREE.MathUtils.damp(
      progressSmooth.current,
      progressTarget.current,
      4,
      delta
    );
    const progress = progressSmooth.current;

    const camStart = new THREE.Vector3(12, 6.2, 18);
    const camMid = new THREE.Vector3(7.5, 4.6, 12.5);
    const camEnd = new THREE.Vector3(5.2, 3.4, 7.4);
    const targetStart = new THREE.Vector3(2.2, 2.2, 0);
    const targetMid = new THREE.Vector3(2.1, 2.1, -0.5);
    const targetEnd = new THREE.Vector3(1.5, 2.3, -0.8);

    let cameraPosition = camEnd;
    let lookTarget = targetEnd;

    if (progress <= 0.25) {
      const t = progress / 0.25;
      cameraPosition = lerp(camStart, camMid, t);
      lookTarget = lerp(targetStart, targetMid, t);
    } else if (progress <= 0.6) {
      const t = (progress - 0.25) / 0.35;
      cameraPosition = lerp(camMid, camEnd, t);
      lookTarget = lerp(targetMid, targetEnd, t);
    }

    camera.position.copy(cameraPosition);
    camera.lookAt(lookTarget);

    if (terrainRef.current) {
      terrainRef.current.position.x = -0.6 * progress;
      terrainRef.current.position.z = -1.2 * progress;
    }

    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      scene.fog.density = THREE.MathUtils.lerp(0.024, 0.038, progress);
    }

    glowRef.current = THREE.MathUtils.smoothstep(progress, 0, 0.25);
    assembleRef.current = THREE.MathUtils.smoothstep(progress, 0.05, 0.6);
    snowRef.current = THREE.MathUtils.smootherstep(progress, 0.25, 0.7);
  });

  return (
    <>
      <color attach="background" args={["#d6dbe1"]} />
      <fogExp2 attach="fog" args={["#cfd4da", 0.03]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[6, 8, 4]}
        intensity={0.9}
        color="#f2f5f8"
      />
      <directionalLight
        position={[-6, 4, -4]}
        intensity={0.35}
        color="#e1e6f0"
      />

      <mesh ref={terrainRef} geometry={terrainGeometry} receiveShadow>
        <meshStandardMaterial
          color="#a7adb6"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {rocks.map((rock) => (
        <mesh
          key={`rock-${rock.position.join("-")}`}
          position={rock.position}
          scale={rock.scale}
        >
          <dodecahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color="#9aa1ab"
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>
      ))}

      <Igloo assembleRef={assembleRef} glowRef={glowRef} />
      <Snow intensityRef={snowRef} />
    </>
  );
}

export default function Scene() {
  return (
    <div className="scene-wrapper">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 45, position: [12, 6, 18], near: 0.1, far: 120 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
