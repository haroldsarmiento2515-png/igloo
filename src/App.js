import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './App.css';

const FLOATING_ORB_COUNT = 48;

function App() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambientLight = new THREE.AmbientLight(0x8fb7ff, 0.7);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(4, 6, 3);
    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.8);
    rimLight.position.set(-6, -4, 4);

    scene.add(ambientLight, keyLight, rimLight);

    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x9ad1ff,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.75,
      thickness: 0.9,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
    });

    const coreGeometry = new THREE.TorusKnotGeometry(1.4, 0.45, 240, 24);
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    heroGroup.add(coreMesh);

    const haloGeometry = new THREE.RingGeometry(2.2, 2.55, 64);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x70e1ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    haloMesh.rotation.x = Math.PI / 2.3;
    heroGroup.add(haloMesh);

    const shardGeometry = new THREE.OctahedronGeometry(0.35, 1);
    const shardMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe2f3ff,
      roughness: 0.15,
      metalness: 0.05,
      transmission: 0.85,
      thickness: 0.5,
      clearcoat: 0.8,
    });

    const shards = Array.from({ length: 8 }, (_, index) => {
      const shard = new THREE.Mesh(shardGeometry, shardMaterial);
      const angle = (index / 8) * Math.PI * 2;
      shard.position.set(Math.cos(angle) * 2.8, Math.sin(angle) * 1.4, (index % 2) * 1.2 - 0.6);
      shard.rotation.set(angle, angle / 2, angle / 3);
      heroGroup.add(shard);
      return shard;
    });

    const orbGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const orbMaterial = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x2f6bff,
      emissiveIntensity: 0.5,
      roughness: 0.4,
    });

    const orbs = Array.from({ length: FLOATING_ORB_COUNT }, () => {
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 6,
      );
      scene.add(orb);
      return orb;
    });

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (event.clientX / innerWidth) * 2 - 1;
      mouseY = (event.clientY / innerHeight) * 2 - 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      heroGroup.rotation.y += 0.003;
      heroGroup.rotation.x += 0.0015;

      coreMesh.rotation.z -= 0.002;

      shards.forEach((shard, index) => {
        shard.rotation.x += 0.004 + index * 0.0004;
        shard.rotation.y -= 0.003 + index * 0.0003;
      });

      orbs.forEach((orb, index) => {
        orb.position.y += Math.sin(Date.now() * 0.001 + index) * 0.0009;
        orb.position.x += Math.cos(Date.now() * 0.001 + index) * 0.0006;
      });

      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.6 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      coreGeometry.dispose();
      haloGeometry.dispose();
      shardGeometry.dispose();
      orbGeometry.dispose();
      coreMaterial.dispose();
      haloMaterial.dispose();
      shardMaterial.dispose();
      orbMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="app">
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
      <div className="gradient-orb" />
      <div className="content">
        <header className="nav">
          <div className="logo">Igloo Inc.</div>
          <nav className="nav-links">
            <a href="#mission">Mission</a>
            <a href="#network">Network</a>
            <a href="#labs">Labs</a>
            <button type="button" className="nav-cta">Join the community</button>
          </nav>
        </header>

        <main className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Onchain consumer collective</p>
            <h1>
              Building the coldest
              <span> crypto community</span>
            </h1>
            <p className="lead">
              Igloo Inc. brings together creators, collectors, and builders to launch immersive consumer
              experiences across web3. Our mission is to grow the world’s largest onchain community.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary">Get early access</button>
              <button type="button" className="ghost">View the ecosystem</button>
            </div>
            <div className="metrics">
              <div>
                <h3>4.2M</h3>
                <span>Global members</span>
              </div>
              <div>
                <h3>128</h3>
                <span>Partner studios</span>
              </div>
              <div>
                <h3>24/7</h3>
                <span>Community ops</span>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <h2>Igloo Signal</h2>
            <p>
              Adaptive intelligence for onchain communities. Track drops, launch events, and collective
              momentum in real time.
            </p>
            <div className="card-row">
              <div>
                <strong>+68%</strong>
                <span>Weekly engagement</span>
              </div>
              <div>
                <strong>3s</strong>
                <span>Average response</span>
              </div>
            </div>
            <button type="button" className="secondary">Request demo</button>
          </div>
        </main>

        <section id="mission" className="grid">
          <div>
            <h3>Mission</h3>
            <p>
              We design a social layer for crypto-native brands: community tooling, immersive launches,
              and real-world activations.
            </p>
          </div>
          <div>
            <h3>Network</h3>
            <p>
              Our ecosystem spans marketplaces, real-time rewards, and creator tooling. Everything is
              built to scale with the collective.
            </p>
          </div>
          <div>
            <h3>Labs</h3>
            <p>
              A research studio experimenting with spatial experiences, always-on live operations, and
              new forms of digital identity.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
