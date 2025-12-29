import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import IceShard from "./IceShard";
import Particles from "./Particles";

const SECTION_CONFIG = [
  {
    rotation: new THREE.Euler(0.1, 0, 0.05),
    position: new THREE.Vector3(0, 0, 0),
    light: 0.9,
    particles: 0.75,
  },
  {
    rotation: new THREE.Euler(0.25, Math.PI * 0.66, -0.08),
    position: new THREE.Vector3(0.25, -0.12, 0.1),
    light: 1.1,
    particles: 1,
  },
  {
    rotation: new THREE.Euler(0.2, Math.PI * 1.33, 0.12),
    position: new THREE.Vector3(-0.22, -0.18, 0.2),
    light: 1.3,
    particles: 1.2,
  },
];

const lerp = (start, end, t) => start + (end - start) * t;

function SceneContent({ scrollProgress, reducedMotion }) {
  const shardGroup = useRef();
  const keyLight = useRef();
  const sceneState = useRef({
    rotX: SECTION_CONFIG[0].rotation.x,
    rotY: SECTION_CONFIG[0].rotation.y,
    rotZ: SECTION_CONFIG[0].rotation.z,
    posX: SECTION_CONFIG[0].position.x,
    posY: SECTION_CONFIG[0].position.y,
    posZ: SECTION_CONFIG[0].position.z,
    light: SECTION_CONFIG[0].light,
  });
  const [particleDensity, setParticleDensity] = useState(
    SECTION_CONFIG[0].particles
  );

  useEffect(() => {
    if (reducedMotion) {
      gsap.killTweensOf(sceneState.current);
      const base = SECTION_CONFIG[0];
      sceneState.current.rotX = base.rotation.x;
      sceneState.current.rotY = base.rotation.y;
      sceneState.current.rotZ = base.rotation.z;
      sceneState.current.posX = base.position.x;
      sceneState.current.posY = base.position.y;
      sceneState.current.posZ = base.position.z;
      sceneState.current.light = base.light;
      setParticleDensity(0.5);
      return;
    }

    const clamped = Math.min(Math.max(scrollProgress, 0), 1);
    const sectionProgress = clamped * (SECTION_CONFIG.length - 1);
    const sectionIndex = Math.floor(sectionProgress);
    const nextIndex = Math.min(sectionIndex + 1, SECTION_CONFIG.length - 1);
    const localT = sectionProgress - sectionIndex;

    const current = SECTION_CONFIG[sectionIndex];
    const next = SECTION_CONFIG[nextIndex];

    const target = {
      rotX: lerp(current.rotation.x, next.rotation.x, localT),
      rotY: lerp(current.rotation.y, next.rotation.y, localT),
      rotZ: lerp(current.rotation.z, next.rotation.z, localT),
      posX: lerp(current.position.x, next.position.x, localT),
      posY: lerp(current.position.y, next.position.y, localT),
      posZ: lerp(current.position.z, next.position.z, localT),
      light: lerp(current.light, next.light, localT),
    };

    gsap.to(sceneState.current, {
      ...target,
      duration: 0.8,
      ease: "power3.out",
    });

    setParticleDensity(lerp(current.particles, next.particles, localT));
  }, [scrollProgress, reducedMotion]);

  useFrame(({ clock }) => {
    if (!shardGroup.current) return;

    const time = clock.getElapsedTime();
    const floatOffset = reducedMotion ? 0 : Math.sin(time * 0.6) * 0.06;
    shardGroup.current.position.set(
      sceneState.current.posX,
      sceneState.current.posY + floatOffset,
      sceneState.current.posZ
    );
    shardGroup.current.rotation.set(
      sceneState.current.rotX + floatOffset * 0.15,
      sceneState.current.rotY + floatOffset * 0.25,
      sceneState.current.rotZ
    );

    if (keyLight.current) {
      keyLight.current.intensity = sceneState.current.light;
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} color="#d9f1ff" />
      <directionalLight
        ref={keyLight}
        position={[4, 6, 5]}
        intensity={1}
        color="#f1fbff"
      />
      <pointLight position={[-4, -2, -4]} intensity={0.4} color="#8fb6ff" />
      <group ref={shardGroup}>
        <IceShard reducedMotion={reducedMotion} />
      </group>
      <Particles density={particleDensity} reducedMotion={reducedMotion} />
      <Environment preset="warehouse" />
    </>
  );
}

export default function SceneCanvas({ scrollProgress, reducedMotion }) {
  const dpr = useMemo(() => [1, 1.6], []);

  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0.6, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#05070c"]} />
        <SceneContent
          scrollProgress={scrollProgress}
          reducedMotion={reducedMotion}
        />
        {!reducedMotion && (
          <EffectComposer>
            <Bloom intensity={0.25} luminanceThreshold={0.3} />
            <Vignette eskil={false} offset={0.15} darkness={0.8} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
