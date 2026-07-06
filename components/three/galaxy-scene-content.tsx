'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// @ts-ignore
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

const coinData = [
  { symbol: '$', label: 'USD', color: '#f5c842', pos: [-3.0, 0.4, -1.5] },
  { symbol: '€', label: 'EUR', color: '#4a8fe7', pos: [-1.6, -0.6, -3.0] },
  { symbol: '£', label: 'GBP', color: '#2d8b7a', pos: [1.6, 0.8, -2.8] },
  { symbol: '¥', label: 'JPY', color: '#d43f3f', pos: [3.0, -0.2, -1.2] },
  { symbol: 'Rp', label: 'IDR', color: '#8b6b4d', pos: [0.0, 1.2, -2.6] },
  { symbol: '₿', label: 'BTC', color: '#f7931a', pos: [-2.0, 1.6, 2.0], isCrypto: true },
  { symbol: '⟠', label: 'ETH', color: '#627eea', pos: [0.0, 1.8, 2.8], isCrypto: true },
  { symbol: 'Au', label: 'GOLD', color: '#f5c842', pos: [2.0, 0.0, 3.2], isGold: true },
];

interface GalaxySceneContentProps {
  onCoinClick?: (symbol: string) => void;
}

export default function GalaxySceneContent({ onCoinClick }: GalaxySceneContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070912);
    scene.fog = new THREE.FogExp2(0x070912, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 5;
    controls.maxDistance = 25;
    controls.target.set(0, 0, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0x223355, 0.6);
    scene.add(ambient);
    const mainLight = new THREE.DirectionalLight(0xffeedd, 4);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);
    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.8);
    fillLight.position.set(-4, 3, -5);
    scene.add(fillLight);
    const rimLight = new THREE.DirectionalLight(0xffd700, 0.5);
    rimLight.position.set(0, -3, 8);
    scene.add(rimLight);
    const backLight = new THREE.DirectionalLight(0x4466ff, 0.3);
    backLight.position.set(-2, -1, -8);
    scene.add(backLight);

    // Stars
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000 * 3; i++) starsPos[i] = (Math.random() - 0.5) * 250;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0x8899bb, size: 0.15, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending,
    })));

    const coinObjects: THREE.Group[] = [];

    // ─── TEKSTUR COIN REALISTIS (tanpa border putih) ───
    const createRealisticCoinTexture = (data: any) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      const baseColor = new THREE.Color(data.color);
      const lightColor = baseColor.clone().lerp(new THREE.Color(0xffffff), 0.45);
      const darkColor = baseColor.clone().lerp(new THREE.Color(0x000000), 0.35);
      const isGold = data.isGold || false;
      const isCrypto = data.isCrypto || false;

      // ─ Background radial gradient ─
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      if (isGold) {
        grad.addColorStop(0, '#f5d742');
        grad.addColorStop(0.2, '#e8b830');
        grad.addColorStop(0.5, '#d4a020');
        grad.addColorStop(0.8, '#b07818');
        grad.addColorStop(1, '#8c5510');
      } else if (isCrypto) {
        grad.addColorStop(0, lightColor.getStyle());
        grad.addColorStop(0.35, baseColor.getStyle());
        grad.addColorStop(0.7, baseColor.getStyle());
        grad.addColorStop(0.9, darkColor.getStyle());
        grad.addColorStop(1, '#0a0a1a');
      } else {
        grad.addColorStop(0, lightColor.getStyle());
        grad.addColorStop(0.3, baseColor.getStyle());
        grad.addColorStop(0.6, baseColor.getStyle());
        grad.addColorStop(0.85, darkColor.getStyle());
        grad.addColorStop(1, '#1a1a2e');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(256, 256, 245, 0, Math.PI * 2);
      ctx.fill();

      // ─ Inner emboss rings (NO white border) ─
      for (let r = 230; r > 30; r -= 14) {
        ctx.strokeStyle = r % 28 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(256, 256, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ─ "IN GOD WE TRUST" (top arc) ─
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isGold ? '#8c6010' : 'rgba(255,255,255,0.35)';
      ctx.font = 'bold 28px "Times New Roman", "Inter", serif';
      const text1 = 'IN GOD WE TRUST';
      for (let i = 0; i < text1.length; i++) {
        const angle = -Math.PI * 0.7 + (i / (text1.length - 1)) * Math.PI * 1.4;
        const x = 256 + Math.cos(angle) * 185;
        const y = 256 + Math.sin(angle) * 185;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(text1[i], 0, 0);
        ctx.restore();
      }

      // ─ "PLURIBUS UNUM" (bottom arc) ─
      ctx.fillStyle = isGold ? '#8c6010' : 'rgba(255,255,255,0.25)';
      ctx.font = 'bold 22px "Times New Roman", "Inter", serif';
      const text2 = 'PLURIBUS UNUM';
      for (let i = 0; i < text2.length; i++) {
        const angle = Math.PI * 0.7 - (i / (text2.length - 1)) * Math.PI * 1.4;
        const x = 256 + Math.cos(angle) * 185;
        const y = 256 + Math.sin(angle) * 185;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle - Math.PI / 2);
        ctx.fillText(text2[i], 0, 0);
        ctx.restore();
      }

      // ─ "UNITED STATES OF AMERICA" ─
      ctx.shadowBlur = 0;
      ctx.fillStyle = isGold ? '#a07018' : 'rgba(255,255,255,0.2)';
      ctx.font = 'bold 20px "Times New Roman", "Inter", serif';
      ctx.fillText('UNITED STATES OF AMERICA', 256, 105);
      ctx.fillStyle = isGold ? '#8c6010' : 'rgba(255,255,255,0.15)';
      ctx.font = 'bold 16px "Times New Roman", "Inter", serif';
      ctx.fillText('ONE ' + data.label.toUpperCase(), 256, 135);

      // ─ CENTER SYMBOL ─
      ctx.shadowColor = 'rgba(0,0,0,0.45)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      if (isCrypto) {
        const iconMap: Record<string, string> = {
          BTC: '₿',
          ETH: '⟠',
        };
        ctx.fillStyle = data.color;
        ctx.font = 'bold 160px "Inter", "Arial", sans-serif';
        ctx.fillText(iconMap[data.label] || '◆', 256, 265);
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 42px "Inter", "Arial", sans-serif';
        ctx.fillText(data.label, 256, 345);
      } else if (isGold) {
        ctx.fillStyle = '#f5c842';
        ctx.font = 'bold 180px "Inter", "Arial", sans-serif';
        ctx.fillText('Au', 256, 255);
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#8c6010';
        ctx.font = 'bold 30px "Inter", "Arial", sans-serif';
        ctx.fillText('999.9', 256, 330);
        ctx.fillText('GOLD', 256, 375);
      } else {
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 150px "Inter", "Arial", sans-serif';
        ctx.fillText(data.symbol, 256, 270);
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#444';
        ctx.font = 'bold 36px "Inter", "Arial", sans-serif';
        ctx.fillText(data.label, 256, 350);
      }

      // ─ Year ─
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = isGold ? '#a07018' : 'rgba(255,255,255,0.1)';
      ctx.font = 'bold 18px "Inter", "Arial", sans-serif';
      ctx.fillText('2025', 256, 455);

      // ─ Reflection highlight ─
      const hl = ctx.createRadialGradient(140, 140, 20, 190, 190, 210);
      hl.addColorStop(0, 'rgba(255,255,255,0.18)');
      hl.addColorStop(0.4, 'rgba(255,255,255,0.05)');
      hl.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hl;
      ctx.beginPath();
      ctx.arc(190, 190, 210, 0, Math.PI * 2);
      ctx.fill();

      // ─ Secondary shadow (bottom right) ─
      const shadow = ctx.createRadialGradient(380, 380, 20, 400, 400, 180);
      shadow.addColorStop(0, 'rgba(0,0,0,0.08)');
      shadow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadow;
      ctx.beginPath();
      ctx.arc(400, 400, 180, 0, Math.PI * 2);
      ctx.fill();

      return new THREE.CanvasTexture(canvas);
    };

    coinData.forEach((data) => {
      const group = new THREE.Group();
      const size = 0.85;
      const texture = createRealisticCoinTexture(data);

      const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        metalness: data.isGold ? 0.95 : 0.82,
        roughness: data.isGold ? 0.10 : 0.18,
        clearcoat: 0.6,
        clearcoatRoughness: 0.12,
        reflectivity: 1,
        envMapIntensity: 2.2,
        emissive: new THREE.Color(data.color),
        emissiveIntensity: data.isCrypto ? 0.10 : 0.03,
        side: THREE.DoubleSide,
      });

      // ─ Coin body (tanpa silver ring) ─
      const geo = new THREE.CylinderGeometry(size, size, size * 0.14, 64);
      const mesh = new THREE.Mesh(geo, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.rotation.x = Math.PI / 2;
      group.add(mesh);

      // ─ Inner glow ring (soft, tanpa border) ─
      const glowGeo = new THREE.TorusGeometry(size * 0.85, size * 0.02, 24, 48);
      const glowMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: new THREE.Color(data.color),
        emissiveIntensity: 0.25,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        metalness: 0,
        roughness: 0.5,
        side: THREE.DoubleSide,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.rotation.x = Math.PI / 2;
      glow.position.z = 0.003;
      group.add(glow);

      // ─ Tiny inner glow (center) ─
      const centerGlowGeo = new THREE.CircleGeometry(size * 0.3, 16);
      const centerGlowMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(data.color),
        emissive: new THREE.Color(data.color),
        emissiveIntensity: 0.08,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        metalness: 0,
        roughness: 0.8,
        side: THREE.DoubleSide,
      });
      const centerGlow = new THREE.Mesh(centerGlowGeo, centerGlowMat);
      centerGlow.rotation.x = Math.PI / 2;
      centerGlow.position.z = 0.002;
      group.add(centerGlow);

      group.position.set(data.pos[0], data.pos[1], data.pos[2]);
      group.userData = {
        label: data.label,
        symbol: data.symbol,
        floatOffset: Math.random() * Math.PI * 2,
        rotSpeed: 0.3 + Math.random() * 0.3,
        floatAmp: 0.08 + Math.random() * 0.06,
        baseY: data.pos[1],
        mat: material,
      };

      scene.add(group);
      coinObjects.push(group);
    });

    // ─ Decorative orbit ring ─
    const ringPoints = [];
    for (let i = 0; i <= 80; i++) {
      const theta = (i / 80) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(
        Math.cos(theta) * 4.5,
        -0.2 + Math.sin(theta * 2) * 0.08,
        Math.sin(theta) * 4.5
      ));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringLine = new THREE.Line(ringGeo, new THREE.LineBasicMaterial({
      color: 0xf5c842, transparent: true, opacity: 0.05,
    }));
    scene.add(ringLine);

    // ─ Second orbit ring ─
    const ringPoints2 = [];
    for (let i = 0; i <= 80; i++) {
      const theta = (i / 80) * Math.PI * 2;
      ringPoints2.push(new THREE.Vector3(
        Math.cos(theta + 0.5) * 4.8,
        0.3 + Math.cos(theta * 3) * 0.06,
        Math.sin(theta + 0.5) * 4.8
      ));
    }
    const ringGeo2 = new THREE.BufferGeometry().setFromPoints(ringPoints2);
    const ringLine2 = new THREE.Line(ringGeo2, new THREE.LineBasicMaterial({
      color: 0x4488ff, transparent: true, opacity: 0.03,
    }));
    scene.add(ringLine2);

    // ─ Raycaster ─
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hovered: THREE.Object3D | null = null;

    renderer.domElement.style.pointerEvents = 'auto';

    renderer.domElement.addEventListener('click', (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const meshes: THREE.Mesh[] = [];
      coinObjects.forEach(g => g.children.forEach(c => { if (c instanceof THREE.Mesh) meshes.push(c); }));
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length > 0) {
        let parent = hits[0].object.parent;
        while (parent && !parent.userData?.label) parent = parent.parent;
        if (parent) {
          const symbol = parent.userData.symbol;
          onCoinClick?.(symbol);
        }
      }
    });

    renderer.domElement.addEventListener('mousemove', (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const meshes: THREE.Mesh[] = [];
      coinObjects.forEach(g => g.children.forEach(c => { if (c instanceof THREE.Mesh) meshes.push(c); }));
      const hits = raycaster.intersectObjects(meshes);
      renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'default';
      if (hovered) {
        const ud = hovered.userData;
        if (ud?.mat) ud.mat.emissiveIntensity = 0.03;
        hovered = null;
      }
      if (hits.length > 0) {
        let parent = hits[0].object.parent;
        while (parent && !parent.userData?.label) parent = parent.parent;
        if (parent && parent.type === 'Group') {
          hovered = parent;
          const ud = parent.userData;
          if (ud?.mat) ud.mat.emissiveIntensity = 0.5;
        }
      }
    });

    // ─ Animation ─
    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      coinObjects.forEach((obj) => {
        const ud = obj.userData;
        if (ud?.floatOffset !== undefined) {
          const float = Math.sin(t * 0.8 + ud.floatOffset) * ud.floatAmp;
          obj.position.y = ud.baseY + float;
          obj.rotation.y += ud.rotSpeed * 0.012;
        }
      });
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      container.removeChild(renderer.domElement);
      container.removeChild(labelRenderer.domElement);
      renderer.dispose();
    };
  }, [onCoinClick]);

  return <div ref={containerRef} className="w-full h-full" />;
}
