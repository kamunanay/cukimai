'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// @ts-ignore
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// @ts-ignore
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// @ts-ignore
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
// @ts-ignore
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

interface PremiumCoinProps {
  symbol: string;
  label: string;
  color?: string;
  isCrypto?: boolean;
  isGold?: boolean;
  width?: number;
  height?: number;
  autoRotate?: boolean;
}

export function PremiumCoin3D({
  symbol,
  label,
  color = '#f5c842',
  isCrypto = false,
  isGold = false,
  width = 500,
  height = 500,
  autoRotate = true,
}: PremiumCoinProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const container = containerRef.current;
    const w = container.clientWidth || width;
    const h = container.clientHeight || height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);

    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
    camera.position.set(0, 0.3, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      0.2, 0.5, 0.1
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.8;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.target.set(0, 0, 0);
    controls.update();

    // Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x1a1a2e);

    const areaLight = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffeedd, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
    );
    areaLight.position.set(0, 5, 5);
    areaLight.rotation.x = -Math.PI / 3;
    envScene.add(areaLight);

    const light1 = new THREE.DirectionalLight(0xffeedd, 1.5);
    light1.position.set(3, 5, 4);
    envScene.add(light1);
    const light2 = new THREE.DirectionalLight(0x4488ff, 0.8);
    light2.position.set(-4, 2, -3);
    envScene.add(light2);
    const light3 = new THREE.DirectionalLight(0xffd700, 0.6);
    light3.position.set(0, -3, 5);
    envScene.add(light3);

    const envTexture = pmremGenerator.fromScene(envScene, 0, 0.1, 100).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Studio lights
    const keyLight = new THREE.DirectionalLight(0xffeedd, 4);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4488ff, 1.5);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd700, 1.0);
    rimLight.position.set(0, -3, 5);
    scene.add(rimLight);

    const ambient = new THREE.AmbientLight(0x223355, 0.3);
    scene.add(ambient);

    const sparkLight = new THREE.PointLight(0xf5c842, 0.8, 8);
    sparkLight.position.set(0, 2, 3);
    scene.add(sparkLight);

    // Coin geometry
    const createCoinGeometry = (): THREE.BufferGeometry => {
      const segments = 80;
      const radius = 1.2;
      const thickness = 0.2;
      const bevel1 = 0.06;
      const bevel2 = 0.03;

      const points: THREE.Vector2[] = [];
      const r = radius;
      const t = thickness / 2;

      points.push(new THREE.Vector2(0, -t));
      points.push(new THREE.Vector2(r - bevel1 * 2, -t));
      points.push(new THREE.Vector2(r - bevel1, -t + bevel1 * 0.6));
      points.push(new THREE.Vector2(r - bevel1 * 0.5, -t + bevel1));
      points.push(new THREE.Vector2(r, -t + bevel1 + bevel2));
      points.push(new THREE.Vector2(r, t - bevel1 - bevel2));
      points.push(new THREE.Vector2(r - bevel1 * 0.5, t - bevel1));
      points.push(new THREE.Vector2(r - bevel1, t - bevel1 * 0.6));
      points.push(new THREE.Vector2(r - bevel1 * 2, t));
      points.push(new THREE.Vector2(0, t));

      return new THREE.LatheGeometry(points, segments);
    };

    const coinGeo = createCoinGeometry();

    // Reeded edges
    const reededEdges = new THREE.Group();
    const grooveCount = 140;
    const grooveRadius = 1.225;
    const grooveDepth = 0.02;
    const grooveWidth = 0.006;

    for (let i = 0; i < grooveCount; i++) {
      const angle = (i / grooveCount) * Math.PI * 2;
      const x = Math.cos(angle) * grooveRadius;
      const z = Math.sin(angle) * grooveRadius;

      const groove = new THREE.Mesh(
        new THREE.BoxGeometry(grooveWidth, 0.24, grooveDepth),
        new THREE.MeshPhysicalMaterial({
          color: 0x8c6010,
          metalness: 0.95,
          roughness: 0.2,
          emissive: 0x4a3008,
          emissiveIntensity: 0.05,
        })
      );
      groove.position.set(x, 0, z);
      groove.lookAt(0, 0, 0);
      groove.rotateX(Math.PI / 2);
      reededEdges.add(groove);
    }
    scene.add(reededEdges);

    // Normal map
    const createNormalMap = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#8080ff';
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 160; i++) {
        const angle = (i / 160) * Math.PI * 2;
        const x = 256 + Math.cos(angle) * 230;
        const y = 256 + Math.sin(angle) * 230;
        for (let j = -8; j < 8; j++) {
          const dx = 256 + Math.cos(angle + 0.02) * (230 + j);
          const dy = 256 + Math.sin(angle + 0.02) * (230 + j);
          ctx.fillStyle = j % 2 === 0 ? '#ffff00' : '#0000ff';
          ctx.fillRect(dx, dy, 2, 2);
        }
      }
      for (let r = 50; r < 230; r += 20) {
        ctx.strokeStyle = r % 40 === 0 ? '#ffff00' : '#0000ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(256, 256, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      return new THREE.CanvasTexture(canvas);
    };

    const normalMap = createNormalMap();
    normalMap.needsUpdate = true;

    // Main texture
    const createCoinTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d')!;

      const baseColor = new THREE.Color(color);
      const isGoldCoin = isGold || symbol === 'Au' || label === 'GOLD';

      const grad = ctx.createRadialGradient(1024, 1024, 0, 1024, 1024, 1024);
      if (isGoldCoin) {
        grad.addColorStop(0, '#f7d94e');
        grad.addColorStop(0.2, '#edc83a');
        grad.addColorStop(0.5, '#d4a020');
        grad.addColorStop(0.75, '#b07818');
        grad.addColorStop(1, '#8c5510');
      } else if (isCrypto) {
        grad.addColorStop(0, baseColor.clone().lerp(new THREE.Color(0xffffff), 0.5).getStyle());
        grad.addColorStop(0.4, baseColor.getStyle());
        grad.addColorStop(0.8, baseColor.clone().lerp(new THREE.Color(0x000000), 0.4).getStyle());
        grad.addColorStop(1, '#0a0a1a');
      } else {
        grad.addColorStop(0, baseColor.clone().lerp(new THREE.Color(0xffffff), 0.5).getStyle());
        grad.addColorStop(0.3, baseColor.getStyle());
        grad.addColorStop(0.6, baseColor.getStyle());
        grad.addColorStop(0.85, baseColor.clone().lerp(new THREE.Color(0x000000), 0.4).getStyle());
        grad.addColorStop(1, '#1a1a2e');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(1024, 1024, 1000, 0, Math.PI * 2);
      ctx.fill();

      // Brushed metal
      for (let i = 0; i < 800; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 2048;
        const len = 20 + Math.random() * 100;
        const angle = Math.random() * Math.PI;
        ctx.strokeStyle = `rgba(255,255,255,${0.005 + Math.random() * 0.025})`;
        ctx.lineWidth = 0.5 + Math.random() * 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
        ctx.stroke();
      }

      // Scratches
      for (let i = 0; i < 200; i++) {
        const x = 200 + Math.random() * 1648;
        const y = 200 + Math.random() * 1648;
        const len = 5 + Math.random() * 40;
        const angle = Math.random() * Math.PI * 2;
        ctx.strokeStyle = `rgba(0,0,0,${0.01 + Math.random() * 0.05})`;
        ctx.lineWidth = 0.5 + Math.random() * 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
        ctx.stroke();
      }

      // Engraved rings
      for (let r = 160; r < 980; r += 30) {
        ctx.strokeStyle = r % 60 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(1024, 1024, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Stars
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
        const x = 1024 + Math.cos(angle) * 870;
        const y = 1024 + Math.sin(angle) * 870;
        const size = 12 + Math.random() * 6;
        ctx.fillStyle = isGoldCoin ? '#f5c842' : 'rgba(255,255,255,0.3)';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        for (let j = 0; j < 10; j++) {
          const starAngle = (j / 10) * Math.PI * 2 - Math.PI / 2;
          const radius = j % 2 === 0 ? size : size * 0.4;
          const sx = x + Math.cos(starAngle) * radius;
          const sy = y + Math.sin(starAngle) * radius;
          j === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
      }

      // Text arcs
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = isGoldCoin ? '#7a5510' : 'rgba(255,255,255,0.3)';
      ctx.font = 'bold 52px "Times New Roman", "Inter", serif';
      const text1 = 'IN GOD WE TRUST';
      for (let i = 0; i < text1.length; i++) {
        const angle = -Math.PI * 0.65 + (i / (text1.length - 1)) * Math.PI * 1.3;
        const x = 1024 + Math.cos(angle) * 770;
        const y = 1024 + Math.sin(angle) * 770;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(text1[i], 0, 0);
        ctx.restore();
      }

      ctx.fillStyle = isGoldCoin ? '#7a5510' : 'rgba(255,255,255,0.2)';
      ctx.font = 'bold 40px "Times New Roman", "Inter", serif';
      const text2 = 'PLURIBUS UNUM';
      for (let i = 0; i < text2.length; i++) {
        const angle = Math.PI * 0.65 - (i / (text2.length - 1)) * Math.PI * 1.3;
        const x = 1024 + Math.cos(angle) * 770;
        const y = 1024 + Math.sin(angle) * 770;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle - Math.PI / 2);
        ctx.fillText(text2[i], 0, 0);
        ctx.restore();
      }

      ctx.shadowBlur = 0;
      ctx.fillStyle = isGoldCoin ? '#8c6010' : 'rgba(255,255,255,0.15)';
      ctx.font = 'bold 38px "Times New Roman", "Inter", serif';
      ctx.fillText('UNITED STATES OF AMERICA', 1024, 420);
      ctx.fillStyle = isGoldCoin ? '#7a5510' : 'rgba(255,255,255,0.12)';
      ctx.font = 'bold 30px "Times New Roman", "Inter", serif';
      ctx.fillText('ONE ' + label.toUpperCase(), 1024, 470);

      // Center symbol
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      if (isCrypto) {
        const iconMap: Record<string, string> = {
          BTC: '₿',
          ETH: '⟠',
          SOL: '◎',
          XRP: '✕',
        };
        ctx.fillStyle = color;
        ctx.font = 'bold 300px "Inter", "Arial", sans-serif';
        ctx.fillText(iconMap[symbol] || '◆', 1024, 1024);
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 80px "Inter", "Arial", sans-serif';
        ctx.fillText(label, 1024, 1300);
      } else if (isGoldCoin) {
        ctx.fillStyle = '#f5c842';
        ctx.font = 'bold 340px "Inter", "Arial", sans-serif';
        ctx.fillText('Au', 1024, 980);
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#7a5510';
        ctx.font = 'bold 60px "Inter", "Arial", sans-serif';
        ctx.fillText('999.9', 1024, 1280);
        ctx.fillText('GOLD', 1024, 1360);
      } else {
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 280px "Inter", "Arial", sans-serif';
        ctx.fillText(symbol, 1024, 1030);
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#444';
        ctx.font = 'bold 70px "Inter", "Arial", sans-serif';
        ctx.fillText(label, 1024, 1340);
      }

      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = isGoldCoin ? '#8c6010' : 'rgba(255,255,255,0.08)';
      ctx.font = 'bold 34px "Inter", "Arial", sans-serif';
      ctx.fillText('2025', 1024, 1780);

      ctx.fillStyle = isGoldCoin ? '#8c6010' : 'rgba(255,255,255,0.06)';
      ctx.font = 'bold 28px "Inter", "Arial", sans-serif';
      ctx.fillText('E', 1550, 1780);

      const hl = ctx.createRadialGradient(480, 480, 40, 600, 600, 500);
      hl.addColorStop(0, 'rgba(255,255,255,0.15)');
      hl.addColorStop(0.3, 'rgba(255,255,255,0.05)');
      hl.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hl;
      ctx.beginPath();
      ctx.arc(600, 600, 500, 0, Math.PI * 2);
      ctx.fill();

      const ao = ctx.createRadialGradient(1400, 1400, 40, 1500, 1500, 500);
      ao.addColorStop(0, 'rgba(0,0,0,0.1)');
      ao.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ao;
      ctx.beginPath();
      ctx.arc(1500, 1500, 500, 0, Math.PI * 2);
      ctx.fill();

      return new THREE.CanvasTexture(canvas);
    };

    const texture = createCoinTexture();
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;

    const material = new THREE.MeshPhysicalMaterial({
      map: texture,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.8, 0.8),
      metalness: isGold ? 0.98 : 0.85,
      roughness: isGold ? 0.08 : 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.05,
      reflectivity: 1,
      envMap: envTexture,
      envMapIntensity: 3.0,
      emissive: new THREE.Color(color),
      emissiveIntensity: isCrypto ? 0.08 : 0.02,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(coinGeo, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.rotation.x = -0.05;
    scene.add(mesh);

    // Floating animation
    let time = 0;
    const floatAmplitude = 0.08;
    const floatSpeed = 0.8;

    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;
      const floatOffset = Math.sin(time * floatSpeed) * floatAmplitude;
      mesh.position.y = floatOffset;
      sparkLight.intensity = 0.5 + Math.sin(time * 1.5) * 0.2;
      controls.update();
      composer.render();
    }
    animate();

    const resize = () => {
      const w2 = container.clientWidth || width;
      const h2 = container.clientHeight || height;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
      composer.setSize(w2, h2);
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
      composer.dispose();
    };
  }, [symbol, label, color, isCrypto, isGold, width, height, autoRotate]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 350 }} />;
}
