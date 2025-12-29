import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import IceShard from "./IceShard";
import PenguinVoxel from "./PenguinVoxel";
import IglooScene from "./IglooScene";
import Particles from "./Particles";

const SCENE_ANGLES = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

function CameraRig({ scrollProgress, reducedMotion }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 1.4, 0));

  useFrame(({ clock }) => {
    const looped = ((scrollProgress % 1) + 1) % 1;
    const angle = looped * Math.PI * 2;
    const time = clock.getElapsedTime();
    const radius = 12 + (reducedMotion ? 0 : Math.sin(time * 0.3) * 0.4);
    const height = 2.4 + (reducedMotion ? 0 : Math.cos(time * 0.4) * 0.3);

    camera.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );
    camera.lookAt(target.current);
  });

  return null;
}

function SceneContent({ scrollProgress, reducedMotion }) {
  const shardRef = useRef(null);
  const penguinRef = useRef(null);
  const iglooRef = useRef(null);

  const positions = useMemo(
    () =>
      SCENE_ANGLES.map((angle) => ({
        position: new THREE.Vector3(
          Math.cos(angle) * 6.2,
          0,
          Math.sin(angle) * 6.2
        ),
        rotation: new THREE.Euler(0, -angle + Math.PI / 2, 0),
      })),
    []
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const drift = reducedMotion ? 0 : Math.sin(time * 0.5) * 0.06;
    const looped = ((scrollProgress % 1) + 1) % 1;
    const shardSpin = looped * Math.PI * 2;

    if (shardRef.current) {
      shardRef.current.position.y = 1.4 + drift;
      shardRef.current.rotation.y = shardSpin + time * 0.15;
      shardRef.current.rotation.x = drift * 0.6;
    }

    if (penguinRef.current) {
      penguinRef.current.rotation.y = -time * 0.12;
    }

    if (iglooRef.current) {
      iglooRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#05070c", 6, 28]} />
      <ambientLight intensity={0.5} color="#cfe8ff" />
      <directionalLight
        position={[6, 7, 5]}
        intensity={1.1}
        color="#f0fbff"
      />
      <pointLight position={[-6, 2, -4]} intensity={0.6} color="#8ab7ff" />
      <pointLight position={[0, 2, 6]} intensity={0.35} color="#b5e3ff" />

      <group
        ref={shardRef}
        position={positions[0].position}
        rotation={positions[0].rotation}
      >
        <IceShard reducedMotion={reducedMotion} />
      </group>

      <group
        ref={penguinRef}
        position={positions[1].position}
        rotation={positions[1].rotation}
      >
        <PenguinVoxel reducedMotion={reducedMotion} />
      </group>

      <group
        ref={iglooRef}
        position={positions[2].position}
        rotation={positions[2].rotation}
      >
        <IglooScene reducedMotion={reducedMotion} />
      </group>

      <Particles
        count={reducedMotion ? 300 : 900}
        reducedMotion={reducedMotion}
      />
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
        camera={{ position: [0, 2.4, 12], fov: 45, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#05070c"]} />
        <CameraRig
          scrollProgress={scrollProgress}
          reducedMotion={reducedMotion}
        />
        <SceneContent
          scrollProgress={scrollProgress}
          reducedMotion={reducedMotion}
        />
        {!reducedMotion && (
          <EffectComposer>
            <Bloom intensity={0.35} luminanceThreshold={0.2} />
            <ChromaticAberration offset={[0.0006, 0.0004]} />
            <Vignette eskil={false} offset={0.2} darkness={0.75} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
