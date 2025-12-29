import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import './App.css';

const SNOWFLAKE_COUNT = 500;

const createBrickTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  ctx.fillStyle = '#cfd5df';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const rowHeight = 64;
  const colWidth = 128;
  for (let y = 0; y < canvas.height; y += rowHeight) {
    const offset = (y / rowHeight) % 2 === 0 ? 0 : colWidth / 2;
    for (let x = -offset; x < canvas.width; x += colWidth) {
      ctx.fillStyle = '#b8bfcb';
      ctx.fillRect(x + 4, y + 4, colWidth - 8, rowHeight - 8);
      ctx.strokeStyle = '#a8b0bd';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 4, y + 4, colWidth - 8, rowHeight - 8);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.4, 1.2);
  texture.anisotropy = 8;
  return texture;
};

function App() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const brickTexture = useMemo(() => createBrickTexture(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#bfc6d1');
    scene.fog = new THREE.Fog('#c7ccd6', 6, 24);

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 60);
    camera.position.set(0, 2.2, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(6, 10, 6);
    const fillLight = new THREE.DirectionalLight(0xcdd6e2, 0.6);
    fillLight.position.set(-6, 4, 4);

    scene.add(ambientLight, keyLight, fillLight);

    const groundGeometry = new THREE.CircleGeometry(22, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: '#e6e9ef',
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.35;
    scene.add(ground);

    const iglooGroup = new THREE.Group();
    iglooGroup.position.y = -0.2;
    scene.add(iglooGroup);

    const domeGeometry = new THREE.SphereGeometry(2.2, 48, 32);
    const domePositions = domeGeometry.attributes.position;
    for (let i = 0; i < domePositions.count; i += 1) {
      const y = domePositions.getY(i);
      if (y < 0) {
        domePositions.setY(i, 0);
      }
    }
    domeGeometry.computeVertexNormals();

    const domeMaterial = new THREE.MeshStandardMaterial({
      color: '#d8dde6',
      roughness: 0.65,
      metalness: 0.05,
      map: brickTexture,
    });

    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    iglooGroup.add(dome);

    const archGeometry = new THREE.TorusGeometry(0.55, 0.12, 16, 64, Math.PI);
    const archMaterial = new THREE.MeshStandardMaterial({
      color: '#cfd5df',
      roughness: 0.6,
      metalness: 0.1,
      map: brickTexture,
    });
    const arch = new THREE.Mesh(archGeometry, archMaterial);
    arch.rotation.z = Math.PI;
    arch.position.set(0, 0.45, 2.05);
    iglooGroup.add(arch);

    const tunnelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.9, 32, 1, true, 0, Math.PI);
    const tunnelMaterial = new THREE.MeshStandardMaterial({
      color: '#c8ced9',
      roughness: 0.6,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
    tunnel.rotation.x = Math.PI / 2;
    tunnel.position.set(0, 0.1, 2.35);
    iglooGroup.add(tunnel);

    const shadowGeometry = new THREE.CircleGeometry(1.9, 32);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: '#b2b8c3',
      transparent: true,
      opacity: 0.35,
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.34;
    iglooGroup.add(shadow);

    const snowGeometry = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(SNOWFLAKE_COUNT * 3);
    const snowVelocity = new Float32Array(SNOWFLAKE_COUNT);
    for (let i = 0; i < SNOWFLAKE_COUNT; i += 1) {
      snowPositions[i * 3] = (Math.random() - 0.5) * 18;
      snowPositions[i * 3 + 1] = Math.random() * 8 + 1;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      snowVelocity[i] = Math.random() * 0.015 + 0.005;
    }
    snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));

    const snowMaterial = new THREE.PointsMaterial({
      color: '#f8fbff',
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    });
    const snow = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snow);

    let time = 0;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.005;

      iglooGroup.rotation.y = Math.sin(time * 0.4) * 0.04;
      iglooGroup.position.y = -0.2 + Math.sin(time * 0.6) * 0.02;

      const positions = snowGeometry.attributes.position;
      for (let i = 0; i < SNOWFLAKE_COUNT; i += 1) {
        let y = positions.getY(i) - snowVelocity[i];
        if (y < -1.2) {
          y = Math.random() * 6 + 2;
        }
        positions.setY(i, y);
      }
      positions.needsUpdate = true;

      camera.position.x = Math.sin(time * 0.2) * 0.4;
      camera.lookAt(0, 0.8, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      domeGeometry.dispose();
      archGeometry.dispose();
      tunnelGeometry.dispose();
      groundGeometry.dispose();
      shadowGeometry.dispose();
      snowGeometry.dispose();
      domeMaterial.dispose();
      archMaterial.dispose();
      tunnelMaterial.dispose();
      groundMaterial.dispose();
      shadowMaterial.dispose();
      snowMaterial.dispose();
      brickTexture?.dispose();
      renderer.dispose();
    };
  }, [brickTexture]);

  return (
    <div className="igloo-app">
      <canvas ref={canvasRef} className="igloo-canvas" aria-hidden="true" />
      <div className="igloo-copy">
        <div className="igloo-wordmark">
          <span>IGLOO</span>
          <small>INC</small>
        </div>
        <p>
          Building Web3’s first mainstream IP ecosystem and the infrastructure to support a new era of
          brand building and consumer participation, onchain.
        </p>
      </div>
    </div>
  );
}

export default App;
