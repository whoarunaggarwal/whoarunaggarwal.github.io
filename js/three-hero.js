/* ==========================================================================
   Three.js 3D Articulated Robotic Arm & Holographic Cyber Stage
   Interactive 3D Inverse Kinematics, Wireframe Rings, Laser Pulse Shockwaves
   ========================================================================== */

(function () {
  'use strict';

  function initThreeHero() {
    const container = document.getElementById('threeHeroContainer');
    if (!container || typeof THREE === 'undefined') return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 14);
    camera.lookAt(0, 2.5, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointCyan = new THREE.PointLight(0x00f0ff, 3, 25);
    pointCyan.position.set(5, 8, 5);
    scene.add(pointCyan);

    const pointAmber = new THREE.PointLight(0xf59e0b, 2.5, 20);
    pointAmber.position.set(-6, 2, 4);
    scene.add(pointAmber);

    // Materials
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8
    });
    const cyanWireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const neonCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const neonAmberMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const neonGreenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    // ROBOT ARM HIERARCHY
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);
    robotGroup.position.set(0, 0, 0);

    // 1. Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.8, 0.6, 24);
    const baseMesh = new THREE.Mesh(baseGeo, darkMat);
    const baseWire = new THREE.Mesh(baseGeo, cyanWireMat);
    const baseGroup = new THREE.Group();
    baseGroup.add(baseMesh);
    baseGroup.add(baseWire);
    robotGroup.add(baseGroup);

    // Base glowing ring
    const baseRingGeo = new THREE.TorusGeometry(2.9, 0.06, 8, 36);
    const baseRingMesh = new THREE.Mesh(baseRingGeo, neonCyanMat);
    baseRingMesh.rotation.x = Math.PI / 2;
    baseRingMesh.position.y = 0.1;
    robotGroup.add(baseRingMesh);

    // 2. Shoulder Pivot
    const shoulderPivot = new THREE.Group();
    shoulderPivot.position.y = 0.5;
    robotGroup.add(shoulderPivot);

    const shoulderGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.2, 16);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, darkMat);
    shoulderMesh.rotation.x = Math.PI / 2;
    shoulderPivot.add(shoulderMesh);

    // 3. Upper Arm Link
    const upperArmGroup = new THREE.Group();
    upperArmGroup.position.y = 0.6;
    shoulderPivot.add(upperArmGroup);

    const arm1Geo = new THREE.BoxGeometry(0.8, 3.6, 0.8);
    const arm1Mesh = new THREE.Mesh(arm1Geo, darkMat);
    arm1Mesh.position.y = 1.8;
    const arm1Wire = new THREE.Mesh(arm1Geo, cyanWireMat);
    arm1Wire.position.y = 1.8;
    upperArmGroup.add(arm1Mesh);
    upperArmGroup.add(arm1Wire);

    // 4. Elbow Joint
    const elbowPivot = new THREE.Group();
    elbowPivot.position.y = 3.6;
    upperArmGroup.add(elbowPivot);

    const elbowGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.9, 16);
    const elbowMesh = new THREE.Mesh(elbowGeo, darkMat);
    elbowMesh.rotation.z = Math.PI / 2;
    const elbowGlowRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.05, 8, 24), neonAmberMat);
    elbowPivot.add(elbowMesh);
    elbowPivot.add(elbowGlowRing);

    // 5. Forearm Link
    const forearmGroup = new THREE.Group();
    elbowPivot.add(forearmGroup);

    const arm2Geo = new THREE.BoxGeometry(0.65, 3.0, 0.65);
    const arm2Mesh = new THREE.Mesh(arm2Geo, darkMat);
    arm2Mesh.position.y = 1.5;
    const arm2Wire = new THREE.Mesh(arm2Geo, cyanWireMat);
    arm2Wire.position.y = 1.5;
    forearmGroup.add(arm2Mesh);
    forearmGroup.add(arm2Wire);

    // 6. Wrist & Tool Flange
    const wristPivot = new THREE.Group();
    wristPivot.position.y = 3.0;
    forearmGroup.add(wristPivot);

    const wristGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const wristMesh = new THREE.Mesh(wristGeo, darkMat);
    const wristRing = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.04, 8, 24), neonCyanMat);
    wristPivot.add(wristMesh);
    wristPivot.add(wristRing);

    // 7. Gripper Fingers
    const gripperGroup = new THREE.Group();
    gripperGroup.position.y = 0.6;
    wristPivot.add(gripperGroup);

    const fingerGeo = new THREE.BoxGeometry(0.18, 0.9, 0.3);
    const fingerLeft = new THREE.Mesh(fingerGeo, neonCyanMat);
    fingerLeft.position.set(-0.35, 0.45, 0);
    const fingerRight = new THREE.Mesh(fingerGeo, neonCyanMat);
    fingerRight.position.set(0.35, 0.45, 0);
    gripperGroup.add(fingerLeft);
    gripperGroup.add(fingerRight);

    // Laser Emitter Tip
    const laserTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), neonGreenMat);
    laserTip.position.y = 0.9;
    gripperGroup.add(laserTip);

    // HOLOGRAPHIC SURROUND RINGS
    const holoGroup = new THREE.Group();
    scene.add(holoGroup);
    holoGroup.position.set(0, 3, 0);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.03, 8, 64), cyanWireMat);
    ring1.rotation.x = Math.PI / 3;
    holoGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(6.4, 0.03, 8, 64), new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.4 }));
    ring2.rotation.y = Math.PI / 4;
    holoGroup.add(ring2);

    // FLOATING DATA PARTICLES
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 16;
      posArray[i + 1] = Math.random() * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.7
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // SHOCKWAVE SYSTEM (Triggered on Click)
    const shockwaves = [];
    function spawnShockwave() {
      const shockGeo = new THREE.RingGeometry(0.2, 0.35, 32);
      const shockMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
      });
      const shock = new THREE.Mesh(shockGeo, shockMat);
      // Position at gripper tip in world space
      const tipWorldPos = new THREE.Vector3();
      laserTip.getWorldPosition(tipWorldPos);
      shock.position.copy(tipWorldPos);
      shock.lookAt(camera.position);
      scene.add(shock);
      shockwaves.push({ mesh: shock, scale: 1, opacity: 1 });

      if (window.playCyberSound) {
        window.playCyberSound('laser');
      }
    }

    container.addEventListener('click', spawnShockwave);

    // MOUSE TRACKING
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetArmPitch = -0.3;
    let targetElbowPitch = 0.6;

    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      const y = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1);
      mouseX = x;
      mouseY = y;

      targetRotY = x * 1.2;
      targetArmPitch = -0.2 + y * 0.5;
      targetElbowPitch = 0.5 - y * 0.4;
    });

    // RESIZE LISTENER
    function onResize() {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    // ANIMATION LOOP
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth Kinematic Lerp
      shoulderPivot.rotation.y += (targetRotY - shoulderPivot.rotation.y) * 0.08;
      upperArmGroup.rotation.x += (targetArmPitch - upperArmGroup.rotation.x) * 0.08;
      elbowPivot.rotation.x += (targetElbowPitch - elbowPivot.rotation.x) * 0.08;
      wristPivot.rotation.z = Math.sin(elapsed * 2) * 0.3;

      // Gripper breathing
      const gripOffset = 0.28 + Math.sin(elapsed * 4) * 0.08;
      fingerLeft.position.x = -gripOffset;
      fingerRight.position.x = gripOffset;

      // Holographic Rings Rotation
      ring1.rotation.z += 0.005;
      ring2.rotation.x += 0.007;
      holoGroup.rotation.y += 0.003;

      // Particles float
      const positions = particleGeo.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(elapsed + i) * 0.005;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Shockwave expansions
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.scale += delta * 8;
        sw.opacity -= delta * 1.5;
        sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
        sw.mesh.material.opacity = Math.max(0, sw.opacity);

        if (sw.opacity <= 0) {
          scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          sw.mesh.material.dispose();
          shockwaves.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeHero);
  } else {
    initThreeHero();
  }
})();
