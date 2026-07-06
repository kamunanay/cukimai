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
  const animationFrameRef = useRef<number>();

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
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
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

    // Enhanced Lights with more realistic setup
    const ambient = new THREE.AmbientLight(0x223355, 0.8);
    scene.add(ambient);
    
    const mainLight = new THREE.DirectionalLight(0xffeedd, 5);
    mainLight.position.set(8, 12, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    scene.add(mainLight);
    
    const fillLight = new THREE.DirectionalLight(0x4488ff, 1.2);
    fillLight.position.set(-8, 6, -8);
    scene.add(fillLight);
    
    const rimLight = new THREE.DirectionalLight(0xffd700, 0.8);
    rimLight.position.set(0, -5, 10);
    scene.add(rimLight);

    // Stars
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000 * 3; i++) starsPos[i] = (Math.random() - 0.5) * 250;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0x8899bb, size: 0.15, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(starsGeo, starsMaterial));

    const coinObjects: THREE.Group[] = [];
    const materialsToDispose: THREE.Material[] = [];
    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const texturesToDispose: THREE.Texture[] = [];

    // Create realistic 3D coin with beveled edges and detailed texture
    const createRealisticCoin = (data: any) => {
      const group = new THREE.Group();
      const coinRadius = 0.8;
      const coinThickness = 0.15;

      // Create canvas texture with gradient and embossed effect
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 512, 512);
      const col = new THREE.Color(data.color);
      const light = col.clone().lerp(new THREE.Color(0xffffff), 0.4);
      const mid = col.clone();
      const dark = col.clone().lerp(new THREE.Color(0x000000), 0.4);
      
      bgGrad.addColorStop(0, light.getStyle());
      bgGrad.addColorStop(0.5, mid.getStyle());
      bgGrad.addColorStop(1, dark.getStyle());
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 512, 512);

      // Add radial gradient for 3D effect
      const radGrad = ctx.createRadialGradient(256, 256, 0, 256, 256, 360);
      radGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
      radGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
      radGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(256, 256, 360, 0, Math.PI * 2);
      ctx.fill();

      // Outer rim - metallic effect
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(256, 256, 240, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 1;

      // Inner circle with texture
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.arc(256, 256, 200, 0, Math.PI * 2);
      ctx.fill();

      // Add noise/texture pattern for realism
      const imageData = ctx.getImageData(0, 0, 512, 512);
      const data_arr = imageData.data;
      for (let i = 0; i < data_arr.length; i += 4) {
        if (Math.random() > 0.97) {
          data_arr[i + 3] = Math.random() * 50; // Random noise
        }
      }
      ctx.putImageData(imageData, 0, 0);

      // Symbol text with shadow and glow
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Text shadow
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = 'bold 150px "Arial", sans-serif';
      ctx.fillText(data.symbol, 256, 256);

      // Main symbol text
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 140px "Arial", sans-serif';
      ctx.fillText(data.symbol, 256, 256);

      // Label at bottom
      ctx.font = 'bold 40px "Arial", sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText(data.label, 256, 380);

      const texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texturesToDispose.push(texture);

      // Main coin face (flat top)
      const mainGeo = new THREE.CylinderGeometry(coinRadius, coinRadius, coinThickness, 64, 8);
      geometriesToDispose.push(mainGeo);
      
      const mainMat = new THREE.MeshPhysicalMaterial({
        map: texture,
        metalness: 0.88,
        roughness: 0.15,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        reflectivity: 1,
        envMapIntensity: 2.2,
        emissive: new THREE.Color(data.color),
        emissiveIntensity: 0.08,
        normalScale: new THREE.Vector2(0.5, 0.5),
      });
      materialsToDispose.push(mainMat);
      
      const mainMesh = new THREE.Mesh(mainGeo, mainMat);
      mainMesh.castShadow = true;
      mainMesh.receiveShadow = true;
      group.add(mainMesh);

      // Beveled edge rings for 3D effect
      const edgeGeo1 = new THREE.TorusGeometry(coinRadius * 0.98, coinThickness * 0.3, 32, 64);
      geometriesToDispose.push(edgeGeo1);
      const edgeMat1 = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(data.color).multiplyScalar(0.8),
        metalness: 0.92,
        roughness: 0.1,
        clearcoat: 0.8,
      });
      materialsToDispose.push(edgeMat1);
      const edgeMesh1 = new THREE.Mesh(edgeGeo1, edgeMat1);
      edgeMesh1.position.z = coinThickness * 0.3;
      edgeMesh1.castShadow = true;
      group.add(edgeMesh1);

      // Second edge ring
      const edgeGeo2 = new THREE.TorusGeometry(coinRadius * 0.96, coinThickness * 0.2, 32, 64);
      geometriesToDispose.push(edgeGeo2);
      const edgeMat2 = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(data.color).multiplyScalar(1.2),
        metalness: 0.85,
        roughness: 0.2,
      });
      materialsToDispose.push(edgeMat2);
      const edgeMesh2 = new THREE.Mesh(edgeGeo2, edgeMat2);
      edgeMesh2.position.z = -coinThickness * 0.3;
      edgeMesh2.castShadow = true;
      group.add(edgeMesh2);

      // Highlight ring for extra realism
      const highlightGeo = new THREE.TorusGeometry(coinRadius * 0.7, coinThickness * 0.08, 32, 64);
      geometriesToDispose.push(highlightGeo);
      const highlightMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
      });
      materialsToDispose.push(highlightMat);
      const highlightMesh = new THREE.Mesh(highlightGeo, highlightMat);
      highlightMesh.position.z = coinThickness * 0.5;
      group.add(highlightMesh);

      group.rotation.x = Math.PI / 2;
      return group;
    };

    coinData.forEach((data) => {
      const group = new THREE.Group();
      const coinGroup = createRealisticCoin(data);
      group.add(coinGroup);

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
        coinGroup: coinGroup,
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
    geometriesToDispose.push(ringGeo);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xf5c842, transparent: true, opacity: 0.08,
    });
    materialsToDispose.push(ringMat);
    const ringLine = new THREE.Line(ringGeo, ringMat);
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
      const intersects = raycaster.intersectObjects(coinObjects, true);
      if (intersects.length > 0) {
        let parent: THREE.Object3D | null = intersects[0].object;
        while (parent && !parent.userData?.label) parent = parent.parent;
        if (parent && parent.userData?.label) {
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
      const intersects = raycaster.intersectObjects(coinObjects, true);
      renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
      
      if (hovered) {
        const coinGroup = hovered.userData.coinGroup;
        if (coinGroup) {
          coinGroup.children.forEach((child: any) => {
            if (child.material?.emissiveIntensity !== undefined) {
              child.material.emissiveIntensity = 0.08;
            }
          });
        }
        hovered = null;
      }
      
      if (intersects.length > 0) {
        let parent: THREE.Object3D | null = intersects[0].object;
        while (parent && !parent.userData?.label) parent = parent.parent;
        if (parent && parent.userData?.label) {
          hovered = parent as THREE.Group;
          const coinGroup = parent.userData.coinGroup;
          if (coinGroup) {
            coinGroup.children.forEach((child: any) => {
              if (child.material?.emissiveIntensity !== undefined) {
                child.material.emissiveIntensity = 0.25;
              }
            });
          }
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
      animationFrameRef.current = requestAnimationFrame(animate);
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
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      geometriesToDispose.forEach(geo => geo.dispose());
      materialsToDispose.forEach(mat => mat.dispose());
      texturesToDispose.forEach(tex => tex.dispose());
      
      starsGeo?.dispose();
      starsMaterial?.dispose();
      
      renderer.dispose();
      labelRenderer.domElement.remove?.();
      
      try {
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (container.contains(labelRenderer.domElement)) {
          container.removeChild(labelRenderer.domElement);
        }
      } catch (e) {
        // Element already removed
      }
    };
  }, [onCoinClick]);

  return <div ref={containerRef} className="w-full h-full" />;
}
