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

    // Stars
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000 * 3; i++) starsPos[i] = (Math.random() - 0.5) * 250;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({
      color: 0x8899bb, size: 0.15, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending,
    })));

    const coinObjects: THREE.Group[] = [];

    const createCoinTexture = (data: any) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      const col = new THREE.Color(data.color);
      const light = col.clone().lerp(new THREE.Color(0xffffff), 0.3);
      const dark = col.clone().lerp(new THREE.Color(0x000000), 0.3);
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, light.getStyle());
      grad.addColorStop(0.6, col.getStyle());
      grad.addColorStop(1, dark.getStyle());
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(128, 128, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(128, 128, 115, 0, Math.PI * 2);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 80px "Inter", "Arial", sans-serif';
      ctx.fillText(data.symbol, 128, 130);
      return new THREE.CanvasTexture(canvas);
    };

    coinData.forEach((data) => {
      const group = new THREE.Group();
      const size = 0.8;
      const texture = createCoinTexture(data);
      const mat = new THREE.MeshPhysicalMaterial({
        map: texture,
        metalness: 0.85,
        roughness: 0.2,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        reflectivity: 1,
        envMapIntensity: 1.8,
        emissive: new THREE.Color(data.color),
        emissiveIntensity: 0.05,
      });
      const geo = new THREE.CylinderGeometry(size, size, size * 0.12, 48);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.rotation.x = Math.PI / 2;
      group.add(mesh);

      const rimGeo = new THREE.TorusGeometry(size * 1.04, size * 0.04, 32, 48);
      const rimMat = new THREE.MeshPhysicalMaterial({
        color: 0xdddddd,
        metalness: 0.9,
        roughness: 0.15,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      group.add(rim);

      group.position.set(data.pos[0], data.pos[1], data.pos[2]);
      group.userData = {
        label: data.label,
        symbol: data.symbol,
        floatOffset: Math.random() * Math.PI * 2,
        rotSpeed: 0.3 + Math.random() * 0.3,
        floatAmp: 0.08 + Math.random() * 0.06,
        baseY: data.pos[1],
        isCrypto: data.isCrypto || false,
        isGold: data.isGold || false,
      };

      scene.add(group);
      coinObjects.push(group);
    });

    // Decorative ring
    const ringPoints = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(Math.cos(theta) * 4.2, -0.2, Math.sin(theta) * 4.2));
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
    const ringLine = new THREE.Line(ringGeo, new THREE.LineBasicMaterial({
      color: 0xf5c842, transparent: true, opacity: 0.08,
    }));
    scene.add(ringLine);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hovered: THREE.Group | null = null;

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
          const label = parent.userData.label;
          const symbol = parent.userData.symbol;
          onCoinClick?.(symbol || label);
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
        if (ud?.mat) ud.mat.emissiveIntensity = 0.05;
        hovered = null;
      }
      if (hits.length > 0) {
        let parent = hits[0].object.parent;
        while (parent && !parent.userData?.label) parent = parent.parent;
        if (parent) {
          hovered = parent;
          const ud = parent.userData;
          if (ud?.mat) ud.mat.emissiveIntensity = 0.5;
        }
      }
    });

    // Animation
    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      coinObjects.forEach((obj) => {
        const ud = obj.userData;
        if (ud?.floatOffset !== undefined) {
          const float = Math.sin(t * 0.8 + ud.floatOffset) * ud.floatAmp;
          obj.position.y = ud.baseY + float;
          obj.rotation.y += ud.rotSpeed * 0.01;
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
