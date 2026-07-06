'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// @ts-ignore
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { PremiumCoin3D } from './premium-coin';

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

    // ─── SCENE ───
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070912);
    scene.fog = new THREE.FogExp2(0x070912, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 14);

    // ─── RENDERER ───
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ─── LABEL RENDERER ───
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    // ─── CONTROLS ───
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.minDistance = 5;
    controls.maxDistance = 25;
    controls.target.set(0, 0, 0);

    // ─── LIGHTS ───
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

    // ─── STARS ───
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000 * 3; i++) starsPos[i] = (Math.random() - 0.5) * 250;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0x8899bb, size: 0.15, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending,
    })));

    // ─── ORBIT RINGS ───
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
      color: 0xf5c842, transparent: true, opacity: 0.06,
    }));
    scene.add(ringLine);

    // ─── COIN OBJECTS ───
    const coinObjects: THREE.Group[] = [];
    const coinMeshes: THREE.Object3D[] = [];

    // Fungsi untuk membuat texture coin secara canvas (sebagai fallback)
    // Tapi kita akan menggunakan PremiumCoin3D langsung sebagai objek 3D
    // Karena PremiumCoin3D membutuhkan DOM container, kita buat approach alternatif:
    // Kita render setiap coin sebagai mesh dengan texture yang di-generate

    const createCoinTexture = (data: any): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      const baseColor = new THREE.Color(data.color);
      const lightColor = baseColor.clone().lerp(new THREE.Color(0xffffff), 0.4);
      const darkColor = baseColor.clone().lerp(new THREE.Color(0x000000), 0.3);
      const isGold = data.isGold || false;
      const isCrypto = data.isCrypto || false;

      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      if (isGold) {
        grad.addColorStop(0, '#f5d742');
        grad.addColorStop(0.3, '#e8b830');
        grad.addColorStop(0.6, '#c99220');
        grad.addColorStop(0.85, '#a07018');
        grad.addColorStop(1, '#7a5510');
      } else if (isCrypto) {
        grad.addColorStop(0, lightColor.getStyle());
        grad.addColorStop(0.4, baseColor.getStyle());
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
      ctx.arc(256, 256, 240, 0, Math.PI * 2);
      ctx.fill();

      // Inner rings
      for (let r = 220; r > 40; r -= 12) {
        ctx.strokeStyle = r % 24 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(256, 256, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // "IN GOD WE TRUST"
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isGold ? '#8c6010' : 'rgba(255,255,255,0.3)';
      ctx.font = 'bold 28px "Times New Roman", "Inter", serif';
      const text1 = 'IN GOD WE TRUST';
      for (let i = 0; i < text1.length; i++) {
        const angle = -Math.PI * 0.7 + (i / (text1.length - 1)) * Math.PI * 1.4;
        const x = 256 + Math.cos(angle) * 175;
        const y = 256 + Math.sin(angle) * 175;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(text1[i], 0, 0);
        ctx.restore();
      }

      // "PLURIBUS UNUM"
      ctx.fillStyle = isGold ? '#8c6010' : 'rgba(255,255,255,0.2)';
      ctx.font = 'bold 22px "Times New Roman", "Inter", serif';
      const text2 = 'PLURIBUS UNUM';
      for (let i = 0; i < text2.length; i++) {
        const angle = Math.PI * 0.7 - (i / (text2.length - 1)) * Math.PI * 1.4;
        const x = 256 + Math.cos(angle) * 175;
        const y = 256 + Math.sin(angle) * 175;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle - Math.PI / 2);
        ctx.fillText(text2[i], 0, 0);
        ctx.restore();
      }

      // Center symbol
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 20;
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
        ctx.font = 'bold 44px "Inter", "Arial", sans-serif';
        ctx.fillText(data.label, 256, 345);
      } else if (isGold) {
        ctx.fillStyle = '#f5c842';
        ctx.font = 'bold 180px "Inter", "Arial", sans-serif';
        ctx.fillText('Au', 256, 255);
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#8c6010';
        ctx.font = 'bold 32px "Inter", "Arial", sans-serif';
        ctx.fillText('999.9', 256, 330);
        ctx.fillText('GOLD', 256, 375);
      } else {
        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 150px "Inter", "Arial", sans-serif';
        ctx.fillText(data.symbol, 256, 270);
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#444';
        ctx.font = 'bold 38px "Inter", "Arial", sans-serif';
        ctx.fillText(data.label, 256, 350);
      }

      // Year
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = isGold ? '#8c6010' : 'rgba(255,255,255,0.1)';
      ctx.font = 'bold 20px "Inter", "Arial", sans-serif';
      ctx.fillText('2025', 256, 455);

      // Reflection highlight
      const hl = ctx.createRadialGradient(160, 160, 20, 200, 200, 180);
      hl.addColorStop(0, 'rgba(255,255,255,0.15)');
      hl.addColorStop(0.5, 'rgba(255,255,255,0.03)');
      hl.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hl;
      ctx.beginPath();
      ctx.arc(200, 200, 180, 0, Math.PI * 2);
      ctx.fill();

      return new THREE.CanvasTexture(canvas);
    };

    // ─── BUAT COIN ───
    coinData.forEach((data) => {
      const group = new THREE.Group();
      const size = 0.85;
      const texture = createCoinTexture(data);

      const material = new THREE.MeshPhysicalMaterial({
        map: texture,
        metalness: data.isGold ? 0.95 : 0.82,
        roughness: data.isGold ? 0.1 : 0.18,
        clearcoat: 0.5,
        clearcoatRoughness: 0.15,
        reflectivity: 1,
        envMapIntensity: 2.0,
        emissive: new THREE.Color(data.color),
        emissiveIntensity: data.isCrypto ? 0.1 : 0.03,
        side: THREE.DoubleSide,
      });

      const geo = new THREE.CylinderGeometry(size, size, size * 0.14, 48);
      const mesh = new THREE.Mesh(geo, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.rotation.x = Math.PI / 2;
      group.add(mesh);

      // ─── INNER GLOW ───
      const glowGeo = new THREE.TorusGeometry(size * 0.82, size * 0.02, 24, 48);
      const glowMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: new THREE.Color(data.color),
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        metalness: 0,
        roughness: 0.5,
        side: THREE.DoubleSide,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.rotation.x = Math.PI / 2;
      glow.position.z = 0.003;
      group.add(glow);

      // ─── LABEL (CSS2D) ───
      const div = document.createElement('div');
      div.textContent = data.label;
      div.style.color = '#fff';
      div.style.fontSize = '12px';
      div.style.fontWeight = '600';
      div.style.fontFamily = 'Inter, sans-serif';
      div.style.background = 'rgba(0,0,0,0.5)';
      div.style.backdropFilter = 'blur(8px)';
      div.style.padding = '3px 12px';
      div.style.borderRadius = '40px';
      div.style.border = '1px solid rgba(255,255,255,0.08)';
      div.style.letterSpacing = '0.04em';
      div.style.textShadow = '0 2px 12px rgba(0,0,0,0.6)';
      div.style.pointerEvents = 'none';
      const label = new CSS2DObject(div);
      label.position.set(0, -size * 0.7, 0);
      group.add(label);

      group.position.set(data.pos[0], data.pos[1], data.pos[2]);
      group.userData = {
        label: data.label,
        symbol: data.symbol,
        floatOffset: Math.random() * Math.PI * 2,
        rotSpeed: 0.25 + Math.random() * 0.3,
        floatAmp: 0.06 + Math.random() * 0.06,
        baseY: data.pos[1],
        mat: material,
      };

      scene.add(group);
      coinObjects.push(group);
      coinMeshes.push(mesh);
    });

    // ─── RAYCASTER ───
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

    // ─── ANIMATION ───
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

    // ─── RESIZE ───
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
