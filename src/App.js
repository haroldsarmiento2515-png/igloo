import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import './App.css';

const STAR_COUNT = 900;
const SATELLITE_COUNT = 12;

function App() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const satellites = useMemo(
    () =>
      Array.from({ length: SATELLITE_COUNT }, () => ({
        angle: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.002,
        radius: 2.5 + Math.random() * 1.4,
        offset: (Math.random() - 0.5) * 1.2,
      })),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x05070f, 6, 18);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.6, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambientLight = new THREE.AmbientLight(0x8fb7ff, 0.6);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(6, 8, 6);
    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.9);
    rimLight.position.set(-6, -4, 4);
    scene.add(ambientLight, keyLight, rimLight);

    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    const globeGeometry = new THREE.SphereGeometry(1.65, 96, 96);
    const globeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8ad3ff,
      roughness: 0.15,
      metalness: 0.05,
      transmission: 0.7,
      thickness: 1,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    heroGroup.add(globe);

    const shellGeometry = new THREE.SphereGeometry(1.82, 64, 64);
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: 0x4cc9ff,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    heroGroup.add(shell);

    const ringGeometry = new THREE.TorusGeometry(2.5, 0.06, 24, 160);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x6ee4ff,
      emissive: 0x3a7bff,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.2,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.6;
    ring.rotation.y = Math.PI / 5;
    heroGroup.add(ring);

    const satelliteGeometry = new THREE.OctahedronGeometry(0.18, 1);
    const satelliteMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3fbff,
      emissive: 0x6cc8ff,
      emissiveIntensity: 0.4,
      roughness: 0.35,
    });

    const satelliteMeshes = satellites.map(() => {
      const mesh = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
      heroGroup.add(mesh);
      return mesh;
    });

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i += 1) {
      starPositions[i * 3] = (Math.random() - 0.5) * 30;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      starPositions[i * 3 + 2] = -Math.random() * 25;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      opacity: 0.75,
      transparent: true,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

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

      heroGroup.rotation.y += 0.0025;
      heroGroup.rotation.x += 0.0009;

      shell.rotation.y -= 0.002;
      ring.rotation.z += 0.003;

      satelliteMeshes.forEach((mesh, index) => {
        const { angle, speed, radius, offset } = satellites[index];
        const updatedAngle = angle + speed * frameRef.current;
        mesh.position.set(
          Math.cos(updatedAngle) * radius,
          Math.sin(updatedAngle * 1.3) * 0.8 + offset,
          Math.sin(updatedAngle) * radius * 0.5,
        );
        mesh.rotation.x += 0.02;
        mesh.rotation.y += 0.015;
      });

      starField.rotation.y += 0.0006;

      camera.position.x += (mouseX * 0.9 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 0.6 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      globeGeometry.dispose();
      shellGeometry.dispose();
      ringGeometry.dispose();
      satelliteGeometry.dispose();
      starGeometry.dispose();
      globeMaterial.dispose();
      shellMaterial.dispose();
      ringMaterial.dispose();
      satelliteMaterial.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [satellites]);

  return (
    <div className="app">
      <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />
      <div className="glow-orb" />
      <div className="glow-orb small" />
      <div className="content">
        <header className="nav">
          <div className="logo">igloo</div>
          <nav className="nav-links">
            <a href="#collective">Collective</a>
            <a href="#products">Products</a>
            <a href="#studio">Studio</a>
            <a href="#careers">Careers</a>
            <button type="button" className="nav-cta">Join the collective</button>
          </nav>
        </header>

        <main className="hero">
          <div className="hero-copy">
            <p className="eyebrow">The onchain social layer</p>
            <h1>
              The community powering
              <span> crypto&rsquo;s next wave</span>
            </h1>
            <p className="lead">
              Igloo builds the infrastructure, experiences, and stories that turn onchain moments into
              global culture. We unite creators, collectors, and brands with immersive 3D products and
              real-world activations.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary">Explore the universe</button>
              <button type="button" className="ghost">View the ecosystem</button>
            </div>
            <div className="metrics">
              <div>
                <h3>6.9M</h3>
                <span>Collective members</span>
              </div>
              <div>
                <h3>340+</h3>
                <span>Live drops shipped</span>
              </div>
              <div>
                <h3>24/7</h3>
                <span>Ops + signals</span>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <p className="card-tag">Igloo OS</p>
            <h2>Spatial intelligence for global communities.</h2>
            <p>
              Launch token-gated events, run always-on engagement, and orchestrate multi-chain
              campaigns with real-time telemetry.
            </p>
            <div className="card-grid">
              <div>
                <strong>+73%</strong>
                <span>Community velocity</span>
              </div>
              <div>
                <strong>2.4x</strong>
                <span>Creator output</span>
              </div>
              <div>
                <strong>5M</strong>
                <span>Signals per day</span>
              </div>
            </div>
            <button type="button" className="secondary">Request early access</button>
          </div>
        </main>

        <section id="collective" className="grid">
          <div>
            <h3>Collective</h3>
            <p>
              A global member network that activates new consumer behaviors, with digital wearables,
              live quests, and exclusive drops.
            </p>
          </div>
          <div>
            <h3>Network</h3>
            <p>
              Always-on infrastructure for NFT marketplaces, loyalty experiences, and community
              tooling. Designed to scale with every partner.
            </p>
          </div>
          <div>
            <h3>Studio</h3>
            <p>
              A creative lab producing 3D commerce, spatial storytelling, and real-world activations
              that feel cinematic.
            </p>
          </div>
        </section>

        <section id="products" className="feature">
          <div>
            <h2>Products built for creators + operators.</h2>
            <p>
              Modular tools that connect wallet identity, live experiences, and growth loops. Activate
              your next drop in minutes.
            </p>
          </div>
          <div className="feature-grid">
            <div>
              <h4>Signal Room</h4>
              <p>Monitor your communities across chains with adaptive dashboards.</p>
            </div>
            <div>
              <h4>Quest Engine</h4>
              <p>Create interactive quests, badges, and IRL rewards for super-fans.</p>
            </div>
            <div>
              <h4>Drop Studio</h4>
              <p>Launch immersive 3D commerce drops with embedded storytelling.</p>
            </div>
          </div>
        </section>

        <section id="studio" className="cta">
          <div>
            <h2>Build with Igloo Studio</h2>
            <p>
              We collaborate with brands, artists, and communities to ship next-gen 3D experiences.
              From ideation to execution, we handle the full journey.
            </p>
          </div>
          <button type="button" className="primary">Talk to the studio</button>
        </section>
      </div>
    </div>
  );
}

export default App;
