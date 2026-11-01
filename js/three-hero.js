/* ==========================================================================
   Three.js 3D Industrial Robotic Digital Twin & Hologram Stage
   High-detail 6-Axis Kinematics, Welder Sparks, Interactive Modes & Camera
   ========================================================================== */

(function () {
  'use strict';

  function initThreeHero() {
    const container = document.getElementById('threeHeroContainer');
    if (!container || typeof THREE === 'undefined') return;

    // Clear any previous canvas
    container.innerHTML = '';

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 6, 13);
    camera.lookAt(0, 2.5, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Advanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f0ff, 2.5);
    keyLight.position.set(6, 12, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf59e0b, 1.8);
    fillLight.position.set(-8, 6, -4);
    scene.add(fillLight);

    const weldLight = new THREE.PointLight(0x00f0ff, 0, 15);
    scene.add(weldLight);

    // High-Tech Industrial Materials
    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.25
    });
    const orangeJointMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.7,
      roughness: 0.3
    });
    const cyanNeonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const greenNeonMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.35 });

    // 1. Cyber Pedestal & Turntable
    const workcellGroup = new THREE.Group();
    scene.add(workcellGroup);

    // Ground Cyber Grid Disk
    const gridDiskGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.3, 36);
    const gridDisk = new THREE.Mesh(gridDiskGeo, darkChassisMat);
    const gridWire = new THREE.Mesh(gridDiskGeo, wireMat);
    workcellGroup.add(gridDisk);
    workcellGroup.add(gridWire);

    // Concentric Neon Turntable Rings
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.04, 8, 48), cyanNeonMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.16;
    workcellGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.03, 8, 36), orangeJointMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 0.17;
    workcellGroup.add(ring2);

    // 2. Base Joint (J1)
    const j1Group = new THREE.Group();
    j1Group.position.y = 0.3;
    workcellGroup.add(j1Group);

    const j1Base = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 0.8, 24), darkChassisMat);
    j1Base.position.y = 0.4;
    j1Group.add(j1Base);

    // 3. Shoulder Joint (J2)
    const j2Group = new THREE.Group();
    j2Group.position.y = 0.9;
    j1Group.add(j2Group);

    const j2Pivot = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 1.4, 20), orangeJointMat);
    j2Pivot.rotation.z = Math.PI / 2;
    j2Pivot.position.y = 0.5;
    j2Group.add(j2Pivot);

    // 4. Upper Arm Link
    const upperArm = new THREE.Group();
    upperArm.position.set(0, 0.5, 0);
    j2Group.add(upperArm);

    const link1Mesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.4, 0.9), darkChassisMat);
    link1Mesh.position.y = 1.7;
    const link1Wire = new THREE.Mesh(new THREE.BoxGeometry(0.92, 3.42, 0.92), wireMat);
    link1Wire.position.y = 1.7;
    upperArm.add(link1Mesh);
    upperArm.add(link1Wire);

    // 5. Elbow Joint (J3)
    const j3Group = new THREE.Group();
    j3Group.position.y = 3.4;
    upperArm.add(j3Group);

    const j3Pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.2, 18), orangeJointMat);
    j3Pivot.rotation.z = Math.PI / 2;
    j3Group.add(j3Pivot);

    // 6. Forearm Link (J4)
    const forearm = new THREE.Group();
    j3Group.add(forearm);

    const link2Mesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.8, 0.7), darkChassisMat);
    link2Mesh.position.y = 1.4;
    const link2Wire = new THREE.Mesh(new THREE.BoxGeometry(0.72, 2.82, 0.72), wireMat);
    link2Wire.position.y = 1.4;
    forearm.add(link2Mesh);
    forearm.add(link2Wire);

    // 7. Wrist & Gripper Flange (J5/J6)
    const wristGroup = new THREE.Group();
    wristGroup.position.y = 2.8;
    forearm.add(wristGroup);

    const wristMesh = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), darkChassisMat);
    wristGroup.add(wristMesh);

    // High-Precision Laser Gripper
    const gripperBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.8), orangeJointMat);
    gripperBase.position.y = 0.45;
    wristGroup.add(gripperBase);

    const fingerLeft = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.25), cyanNeonMat);
    fingerLeft.position.set(-0.32, 0.85, 0);
    const fingerRight = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.25), cyanNeonMat);
    fingerRight.position.set(0.32, 0.85, 0);
    wristGroup.add(fingerLeft);
    wristGroup.add(fingerRight);

    // Laser Emitter Tool Center Point (TCP)
    const tcpTip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), greenNeonMat);
    tcpTip.position.y = 1.3;
    wristGroup.add(tcpTip);

    // Dynamic Toolpath Laser Beam
    const laserBeamGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.5, 8);
    const laserBeamMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.85 });
    const laserBeam = new THREE.Mesh(laserBeamGeo, laserBeamMat);
    laserBeam.position.y = 3.0;
    wristGroup.add(laserBeam);

    // 8. PHYSICAL SPARKS PARTICLE SYSTEM
    const maxSparks = 200;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(maxSparks * 3);
    const sparkVelocities = [];

    for (let i = 0; i < maxSparks; i++) {
      sparkPositions[i * 3] = 0;
      sparkPositions[i * 3 + 1] = -100; // start hidden
      sparkPositions[i * 3 + 2] = 0;
      sparkVelocities.push(new THREE.Vector3(0, 0, 0));
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));

    const sparkMat = new THREE.PointsMaterial({
      size: 0.16,
      color: 0x00f0ff,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const sparkParticles = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkParticles);

    function triggerSparkBurst() {
      const tipPos = new THREE.Vector3();
      tcpTip.getWorldPosition(tipPos);

      // Flash light
      weldLight.position.copy(tipPos);
      weldLight.intensity = 4;

      const positions = sparkGeo.attributes.position.array;
      for (let i = 0; i < maxSparks; i++) {
        positions[i * 3] = tipPos.x;
        positions[i * 3 + 1] = tipPos.y;
        positions[i * 3 + 2] = tipPos.z;

        sparkVelocities[i].set(
          (Math.random() - 0.5) * 8,
          Math.random() * 6 + 2,
          (Math.random() - 0.5) * 8
        );
      }
      sparkGeo.attributes.position.needsUpdate = true;

      if (window.playCyberSound) window.playCyberSound('laser');
    }

    container.addEventListener('click', triggerSparkBurst);

    // 9. INTERACTIVE CONTROLS (Mode Switching)
    let currentMode = 'auto'; // 'auto' | 'manual' | 'weld'

    const modeBtnAuto = document.getElementById('threeModeAuto');
    const modeBtnWeld = document.getElementById('threeModeWeld');
    const modeBtnJog = document.getElementById('threeModeJog');

    if (modeBtnAuto) {
      modeBtnAuto.addEventListener('click', () => {
        currentMode = 'auto';
        updateModeBtns(modeBtnAuto);
      });
    }
    if (modeBtnWeld) {
      modeBtnWeld.addEventListener('click', () => {
        currentMode = 'weld';
        updateModeBtns(modeBtnWeld);
        triggerSparkBurst();
      });
    }
    if (modeBtnJog) {
      modeBtnJog.addEventListener('click', () => {
        currentMode = 'manual';
        updateModeBtns(modeBtnJog);
      });
    }

    function updateModeBtns(activeBtn) {
      document.querySelectorAll('.three-mode-pill').forEach(b => b.classList.remove('is-active'));
      activeBtn.classList.add('is-active');
      if (window.playCyberSound) window.playCyberSound('click');
    }

    // MOUSE TRACKING
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / container.clientHeight) * 2 - 1);
    });

    // RESIZE
    window.addEventListener('resize', () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // 10. ANIMATION CLOCK & LOOP
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Fade weld light
      if (weldLight.intensity > 0) {
        weldLight.intensity = Math.max(0, weldLight.intensity - delta * 6);
      }

      // Turntable slow rotation
      gridDisk.rotation.y += 0.003;

      if (currentMode === 'auto') {
        // Smooth cinematic toolpath trajectory
        j1Group.rotation.y = Math.sin(elapsed * 1.2) * 0.8;
        upperArm.rotation.x = -0.3 + Math.sin(elapsed * 1.5) * 0.35;
        j3Group.rotation.x = 0.6 + Math.cos(elapsed * 1.5) * 0.45;
        wristGroup.rotation.z = Math.sin(elapsed * 2.5) * 0.6;
        laserBeam.material.opacity = 0.5 + Math.sin(elapsed * 10) * 0.4;
      } else if (currentMode === 'manual') {
        // Inverse kinematics mouse follow
        j1Group.rotation.y += (mouseX * 1.4 - j1Group.rotation.y) * 0.08;
        upperArm.rotation.x += ((-0.2 + mouseY * 0.6) - upperArm.rotation.x) * 0.08;
        j3Group.rotation.x += ((0.5 - mouseY * 0.5) - j3Group.rotation.x) * 0.08;
      } else if (currentMode === 'weld') {
        // High-speed industrial welding weaving motion
        j1Group.rotation.y = Math.sin(elapsed * 3) * 0.3;
        upperArm.rotation.x = -0.4 + Math.sin(elapsed * 6) * 0.1;
        wristGroup.rotation.z = Math.sin(elapsed * 8) * 0.2;
        laserBeam.material.opacity = 0.9;

        // Periodic sparks
        if (Math.random() < 0.2) {
          triggerSparkBurst();
        }
      }

      // Update Sparks Physics
      const positions = sparkGeo.attributes.position.array;
      for (let i = 0; i < maxSparks; i++) {
        if (positions[i * 3 + 1] > -50) {
          positions[i * 3] += sparkVelocities[i].x * delta;
          positions[i * 3 + 1] += sparkVelocities[i].y * delta;
          positions[i * 3 + 2] += sparkVelocities[i].z * delta;

          // Gravity
          sparkVelocities[i].y -= 9.8 * delta;

          // Floor bounce
          if (positions[i * 3 + 1] <= 0.2) {
            positions[i * 3 + 1] = 0.2;
            sparkVelocities[i].y *= -0.4;
          }
        }
      }
      sparkGeo.attributes.position.needsUpdate = true;

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
