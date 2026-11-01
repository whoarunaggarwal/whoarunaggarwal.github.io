/**
 * Interactive 3D Engineering Lab (Virtual Manufacturing Cell)
 * Built with Three.js for Arun Aggarwal's Portfolio.
 * Features articulated 6-axis robot, conveyor with workpiece, AOI vision scanner,
 * Beckhoff IPC cabinet, safety light curtains, clickable hotspots, and cycle simulation.
 */

(function () {
  'use strict';

  let scene, camera, renderer, container;
  let robotBase, shoulder, upperArm, elbow, forearm, wrist, toolhead;
  let conveyor, workpiece, visionCam, visionBeam, ipcCabinet;
  let safetyBeams = [];
  let sparks = [];
  let isSimulating = false;
  let simulationStep = 0;
  let simTimer = 0;
  let mouse = { x: 0, y: 0, isDown: false, prevX: 0, prevY: 0 };
  let camTarget = { x: 0, y: 3.5, z: 0 };
  let camRadius = 14;
  let camTheta = Math.PI / 4;
  let camPhi = Math.PI / 3;

  const HOTSPOTS_DATA = {
    robot: {
      title: "6-Axis Articulated Industrial Robot Arm",
      category: "Robotics & Motion Control",
      specs: [
        { label: "Kinematics", val: "6 Rotary Axes with Spherical Wrist" },
        { label: "Repeatability", val: "? 0.02 mm Position Accuracy" },
        { label: "Motion Bus", val: "EtherCAT Servo Drives (CSP Mode)" },
        { label: "Max Reach", val: "850 mm Radial Envelope" }
      ],
      desc: "High-precision articulated robot arm programmed for high-speed pick-and-place, vision-guided component alignment, and continuous laser/welding toolpaths."
    },
    vision: {
      title: "AOI Machine Vision Inspection System",
      category: "Optical Metrology & Sensing",
      specs: [
        { label: "Sensor Resolution", val: "5.0 MP High-Speed CMOS" },
        { label: "Field of View", val: "120 mm ? 90 mm" },
        { label: "Coordinate Output", val: "Real-time (X, Y, Z, ?) Offsets" },
        { label: "Interface", val: "PROFINET IRT / TCP/IP Sockets" }
      ],
      desc: "High-resolution Automated Optical Inspection (AOI) camera computing sub-millimeter component alignment and defect verification before robotic pick."
    },
    ipc: {
      title: "Beckhoff Industrial PC & Fieldbus Master",
      category: "Real-Time Control Architecture",
      specs: [
        { label: "Kernel", val: "TwinCAT 3 Real-Time (XAR)" },
        { label: "Scan Task", val: "250 ?s Cycle Time (Deterministic)" },
        { label: "Distributed Clocks", val: "< 1 ?s Fieldbus Jitter" },
        { label: "Host Protocol", val: "TwinCAT ADS & JSON REST / MQTT" }
      ],
      desc: "Ruggedized DIN-rail IPC executing IEC 61131-3 Structured Text control algorithms and orchestrating distributed servo drives and safety I/O."
    },
    safety: {
      title: "Optical Safety Light Curtain Interlock",
      category: "Functional Safety & SIL 3",
      specs: [
        { label: "Safety Level", val: "SIL 3 (IEC 62061) / PL-e (ISO 13849)" },
        { label: "Resolution", val: "14 mm Finger Protection" },
        { label: "Response Time", val: "< 12 ms Hard Stop Trigger" },
        { label: "Circuit", val: "Dual-Channel PNP with EDM Monitoring" }
      ],
      desc: "Category 4 optical safety barrier integrated directly into the safety PLC logic to enforce instant emergency stoppage upon intrusion."
    },
    conveyor: {
      title: "Synchronized Indexing Conveyor",
      category: "Material Handling & Transport",
      specs: [
        { label: "Drive System", val: "Servo-Driven Timing Belt" },
        { label: "Positioning", val: "Absolute Encoder Feedback" },
        { label: "Throughput", val: "1,200 Units / Hour" },
        { label: "Sensors", val: "Diffuse Optical Part Present Detect" }
      ],
      desc: "Automated infeed and outfeed conveyor indexing components into the robotic workcell with synchronized S-curve acceleration."
    }
  };

  function initEngineeringLab() {
    container = document.getElementById('labViewport');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080e);
    scene.fog = new THREE.FogExp2(0x06080e, 0.035);

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    updateCamera();

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (container.firstChild) container.removeChild(container.firstChild);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x223344, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xddeeff, 2.0);
    dirLight.position.set(10, 18, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 3.0, 18);
    cyanPoint.position.set(0, 4, 0);
    scene.add(cyanPoint);

    const blueSpot = new THREE.SpotLight(0x3b82f6, 4.0, 25, Math.PI / 4, 0.4);
    blueSpot.position.set(-6, 12, 6);
    scene.add(blueSpot);

    // Floor and Grid
    buildFloorAndGrid();

    // Workcell Components
    buildRobot();
    buildConveyor();
    buildVisionCamera();
    buildIpcCabinet();
    buildSafetyCurtains();
    buildSparkParticles();

    // Controls and Interaction
    setupInteractions();

    // Render Loop
    let lastTime = performance.now();
    function animate(currentTime) {
      requestAnimationFrame(animate);
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      updateSimulation(delta);
      updateSparks(delta);

      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);

    window.addEventListener('resize', onWindowResize);
  }

  function updateCamera() {
    camera.position.x = camTarget.x + camRadius * Math.sin(camPhi) * Math.sin(camTheta);
    camera.position.y = camTarget.y + camRadius * Math.cos(camPhi);
    camera.position.z = camTarget.z + camRadius * Math.sin(camPhi) * Math.cos(camTheta);
    camera.lookAt(camTarget.x, camTarget.y, camTarget.z);
  }

  function buildFloorAndGrid() {
    // Floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.85,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Coordinate Grid
    const gridHelper = new THREE.GridHelper(24, 24, 0x00f0ff, 0x172238);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Central Workcell Pedestal
    const pedGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.4, 32);
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x111726,
      roughness: 0.5,
      metalness: 0.6
    });
    const ped = new THREE.Mesh(pedGeo, pedMat);
    ped.position.y = 0.2;
    ped.receiveShadow = true;
    scene.add(ped);

    // Glowing Pedestal Ring
    const ringGeo = new THREE.RingGeometry(3.3, 3.45, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.41;
    scene.add(ring);
  }

  function buildRobot() {
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1a2130, roughness: 0.4, metalness: 0.8 });
    const cyanMetal = new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.3, metalness: 0.7, emissive: 0x004455 });
    const jointMat = new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.5, metalness: 0.5 });

    // Base
    robotBase = new THREE.Group();
    robotBase.position.set(0, 0.4, 0);
    scene.add(robotBase);

    const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 0.6, 24), darkMetal);
    baseCyl.position.y = 0.3;
    baseCyl.castShadow = true;
    robotBase.add(baseCyl);

    // Shoulder (Axis 1 - Yaw)
    shoulder = new THREE.Group();
    shoulder.position.set(0, 0.6, 0);
    robotBase.add(shoulder);

    const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.8, 20, 20), jointMat);
    shoulderJoint.position.y = 0.5;
    shoulder.add(shoulderJoint);

    // Upper Arm (Axis 2 - Pitch)
    upperArm = new THREE.Group();
    upperArm.position.set(0, 0.5, 0);
    shoulder.add(upperArm);

    const armGeo = new THREE.CylinderGeometry(0.45, 0.55, 3.2, 16);
    const armMesh = new THREE.Mesh(armGeo, cyanMetal);
    armMesh.position.y = 1.6;
    armMesh.castShadow = true;
    upperArm.add(armMesh);

    // Elbow (Axis 3 - Pitch)
    elbow = new THREE.Group();
    elbow.position.set(0, 3.2, 0);
    upperArm.add(elbow);

    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), jointMat);
    elbow.add(elbowJoint);

    // Forearm
    forearm = new THREE.Group();
    elbow.add(forearm);

    const foreGeo = new THREE.CylinderGeometry(0.35, 0.42, 2.8, 16);
    const foreMesh = new THREE.Mesh(foreGeo, darkMetal);
    foreMesh.position.y = 1.4;
    foreMesh.castShadow = true;
    forearm.add(foreMesh);

    // Wrist (Axis 4 & 5)
    wrist = new THREE.Group();
    wrist.position.set(0, 2.8, 0);
    forearm.add(wrist);

    const wristJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.5, 16), cyanMetal);
    wristJoint.position.y = 0.25;
    wrist.add(wristJoint);

    // Toolhead (Vacuum Gripper & Laser Emitter)
    toolhead = new THREE.Group();
    toolhead.position.set(0, 0.5, 0);
    wrist.add(toolhead);

    const toolBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.5), darkMetal);
    toolhead.add(toolBase);

    // Vacuum Cups
    for (const [x, z] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.04, 0.3, 12), cyanMetal);
      cup.position.set(x, 0.25, z);
      toolhead.add(cup);
    }

    // Default Pose
    upperArm.rotation.z = -0.4;
    elbow.rotation.z = 0.9;
    forearm.rotation.z = 0.3;
    wrist.rotation.z = -0.8;
  }

  function buildConveyor() {
    conveyor = new THREE.Group();
    conveyor.position.set(0, 0, 4.5);
    scene.add(conveyor);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.6 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });

    // Conveyor Bed
    const bed = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.6, 1.2), bodyMat);
    bed.position.y = 1.2;
    bed.castShadow = true;
    conveyor.add(bed);

    // Belt
    const belt = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.08, 1.0), beltMat);
    belt.position.y = 1.54;
    conveyor.add(belt);

    // Legs
    for (const x of [-3.5, 0, 3.5]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.2, 12), bodyMat);
      leg.position.set(x, 0.6, 0);
      conveyor.add(leg);
    }

    // Workpiece Puck (DUT / Smart Meter Core)
    const puckMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.2, metalness: 0.9, emissive: 0x003344 });
    workpiece = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.6), puckMat);
    workpiece.position.set(-2.5, 1.75, 0);
    workpiece.castShadow = true;
    conveyor.add(workpiece);
  }

  function buildVisionCamera() {
    visionCam = new THREE.Group();
    visionCam.position.set(0, 5.2, 4.5);
    scene.add(visionCam);

    const camMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
    const lensMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.1, metalness: 0.9 });

    // Arm Mount
    const mount = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 0.2), camMat);
    mount.position.set(0, 1.25, 0);
    visionCam.add(mount);

    // Camera Housing
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.7), camMat);
    visionCam.add(body);

    // Lens
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.4, 16), lensMat);
    lens.position.y = -0.5;
    visionCam.add(lens);

    // Optical Inspection Frustum Beam
    const beamGeo = new THREE.ConeGeometry(1.6, 3.4, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    });
    visionBeam = new THREE.Mesh(beamGeo, beamMat);
    visionBeam.position.y = -2.2;
    visionCam.add(visionBeam);
  }

  function buildIpcCabinet() {
    ipcCabinet = new THREE.Group();
    ipcCabinet.position.set(-5.5, 0, -2.5);
    scene.add(ipcCabinet);

    const cabMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.6 });
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.8, 4.0, 1.2), cabMat);
    cab.position.y = 2.0;
    cab.castShadow = true;
    ipcCabinet.add(cab);

    // Glass Door
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.25, roughness: 0.1 });
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.6, 0.05), doorMat);
    door.position.set(0, 2.0, 0.62);
    ipcCabinet.add(door);

    // Internal Status LEDs
    for (let y = 1.0; y < 3.2; y += 0.4) {
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.05), new THREE.MeshBasicMaterial({ color: Math.random() > 0.3 ? 0x10b981 : 0x00f0ff }));
      led.position.set(-0.4, y, 0.58);
      ipcCabinet.add(led);
    }
  }

  function buildSafetyCurtains() {
    const postMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.45 });

    // 2 Safety Posts
    for (const x of [-4.5, 4.5]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.8, 0.25), postMat);
      post.position.set(x, 1.9, 2.2);
      scene.add(post);
    }

    // Infrared Beams
    for (let y = 0.6; y < 3.6; y += 0.4) {
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 9.0, 8), beamMat);
      beam.rotation.z = Math.PI / 2;
      beam.position.set(0, y, 2.2);
      scene.add(beam);
      safetyBeams.push(beam);
    }
  }

  function buildSparkParticles() {
    const count = 60;
    const sparkGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) positions[i] = 0;

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffdd44,
      size: 0.18,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const sparkSystem = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkSystem);

    for (let i = 0; i < count; i++) {
      sparks.push({
        x: 0, y: 0, z: 0,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 5 + 2,
        vz: (Math.random() - 0.5) * 4,
        life: 0,
        maxLife: Math.random() * 0.4 + 0.2
      });
    }

    sparkSystem.userData = { geometry: sparkGeo, list: sparks };
  }

  function triggerSparksAt(pos) {
    for (const s of sparks) {
      s.x = pos.x;
      s.y = pos.y;
      s.z = pos.z;
      s.vx = (Math.random() - 0.5) * 6;
      s.vy = Math.random() * 6 + 2;
      s.vz = (Math.random() - 0.5) * 6;
      s.life = s.maxLife;
    }
  }

  function updateSparks(delta) {
    const sparkSystem = scene.children.find(c => c.isPoints);
    if (!sparkSystem) return;

    const posAttr = sparkSystem.userData.geometry.attributes.position;
    const list = sparkSystem.userData.list;

    for (let i = 0; i < list.length; i++) {
      const s = list[i];
      if (s.life > 0) {
        s.life -= delta;
        s.x += s.vx * delta;
        s.y += s.vy * delta;
        s.z += s.vz * delta;
        s.vy -= 9.8 * delta; // gravity
        posAttr.setXYZ(i, s.x, s.y, s.z);
      } else {
        posAttr.setXYZ(i, 0, -999, 0);
      }
    }
    posAttr.needsUpdate = true;
  }

  function updateSimulation(delta) {
    if (!isSimulating) {
      // Idle breathing
      const t = performance.now() * 0.001;
      shoulder.rotation.y = Math.sin(t * 0.5) * 0.2;
      elbow.rotation.z = 0.9 + Math.cos(t * 0.7) * 0.1;
      return;
    }

    simTimer += delta;

    // Multi-step Machine Cycle:
    // Step 0: Conveyor advances workpiece to pick position
    // Step 1: Vision Camera flashes scan beam
    // Step 2: Robot dips, picks workpiece
    // Step 3: Robot swings to assembly target & triggers sparks
    // Step 4: Workpiece deposited, cycle reset

    if (simulationStep === 0) {
      workpiece.position.x += 1.8 * delta;
      if (workpiece.position.x >= 0) {
        workpiece.position.x = 0;
        simulationStep = 1;
        simTimer = 0;
      }
    } else if (simulationStep === 1) {
      visionBeam.material.opacity = 0.4 + Math.sin(simTimer * 20) * 0.2;
      if (simTimer > 1.0) {
        visionBeam.material.opacity = 0.18;
        simulationStep = 2;
        simTimer = 0;
      }
    } else if (simulationStep === 2) {
      shoulder.rotation.y = THREE.MathUtils.lerp(shoulder.rotation.y, 0, delta * 3);
      upperArm.rotation.z = THREE.MathUtils.lerp(upperArm.rotation.z, -0.6, delta * 3);
      elbow.rotation.z = THREE.MathUtils.lerp(elbow.rotation.z, 1.2, delta * 3);

      if (simTimer > 1.2) {
        // Picked up
        simulationStep = 3;
        simTimer = 0;
      }
    } else if (simulationStep === 3) {
      shoulder.rotation.y = THREE.MathUtils.lerp(shoulder.rotation.y, Math.PI / 2.2, delta * 2.5);
      upperArm.rotation.z = THREE.MathUtils.lerp(upperArm.rotation.z, -0.2, delta * 2.5);
      elbow.rotation.z = THREE.MathUtils.lerp(elbow.rotation.z, 0.7, delta * 2.5);

      workpiece.position.x = Math.sin(shoulder.rotation.y) * 2.8;
      workpiece.position.z = Math.cos(shoulder.rotation.y) * 2.8 + 1.2;
      workpiece.position.y = 2.4;

      if (simTimer > 1.5) {
        triggerSparksAt(new THREE.Vector3(workpiece.position.x, 1.8, workpiece.position.z));
        simulationStep = 4;
        simTimer = 0;
      }
    } else if (simulationStep === 4) {
      if (simTimer > 1.0) {
        // Reset cycle
        workpiece.position.set(-3.5, 1.75, 0);
        isSimulating = false;
        simulationStep = 0;
        const btn = document.getElementById('labSimulateBtn');
        if (btn) btn.textContent = 'Run Machine Cycle Simulation ?';
      }
    }
  }

  function setupInteractions() {
    container.addEventListener('mousedown', (e) => {
      mouse.isDown = true;
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
    });

    window.addEventListener('mouseup', () => { mouse.isDown = false; });

    container.addEventListener('mousemove', (e) => {
      if (!mouse.isDown) return;
      const dx = e.clientX - mouse.prevX;
      const dy = e.clientY - mouse.prevY;
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;

      camTheta -= dx * 0.007;
      camPhi = Math.max(0.2, Math.min(Math.PI / 2.1, camPhi - dy * 0.007));
      updateCamera();
    });

    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      camRadius = Math.max(7, Math.min(22, camRadius + e.deltaY * 0.015));
      updateCamera();
    }, { passive: false });

    // Touch support for mobile
    let touchStartDist = 0;
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        mouse.isDown = true;
        mouse.prevX = e.touches[0].clientX;
        mouse.prevY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });

    container.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && mouse.isDown) {
        const dx = e.touches[0].clientX - mouse.prevX;
        const dy = e.touches[0].clientY - mouse.prevY;
        mouse.prevX = e.touches[0].clientX;
        mouse.prevY = e.touches[0].clientY;
        camTheta -= dx * 0.008;
        camPhi = Math.max(0.2, Math.min(Math.PI / 2.1, camPhi - dy * 0.008));
        updateCamera();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = touchStartDist - dist;
        camRadius = Math.max(7, Math.min(22, camRadius + diff * 0.02));
        touchStartDist = dist;
        updateCamera();
      }
    });

    container.addEventListener('touchend', () => { mouse.isDown = false; });

    // Simulation Button
    const simBtn = document.getElementById('labSimulateBtn');
    if (simBtn) {
      simBtn.addEventListener('click', () => {
        isSimulating = true;
        simulationStep = 0;
        simTimer = 0;
        simBtn.textContent = 'Executing Machine Cycle... ?';
      });
    }

    // Reset Camera Button
    const resetBtn = document.getElementById('labResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        camRadius = 14;
        camTheta = Math.PI / 4;
        camPhi = Math.PI / 3;
        updateCamera();
      });
    }

    // Hotspot UI Buttons
    const hotspotBtns = document.querySelectorAll('.lab-hotspot-btn');
    hotspotBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-hotspot');
        showHotspotDetail(id);
      });
    });

    const modal = document.getElementById('labHotspotModal');
    const closeBtn = document.getElementById('labModalClose');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.hidden = true;
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }

  function showHotspotDetail(id) {
    const data = HOTSPOTS_DATA[id];
    if (!data) return;

    const modal = document.getElementById('labHotspotModal');
    const titleEl = document.getElementById('labHotspotTitle');
    const catEl = document.getElementById('labHotspotCategory');
    const descEl = document.getElementById('labHotspotDesc');
    const specsEl = document.getElementById('labHotspotSpecs');

    if (titleEl) titleEl.textContent = data.title;
    if (catEl) catEl.textContent = data.category;
    if (descEl) descEl.textContent = data.desc;

    if (specsEl) {
      specsEl.innerHTML = '';
      data.specs.forEach(s => {
        const row = document.createElement('div');
        row.className = 'lab-spec-row';
        row.innerHTML = `<span class="lab-spec-label">${s.label}</span><span class="lab-spec-val">${s.val}</span>`;
        specsEl.appendChild(row);
      });
    }

    if (modal) {
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngineeringLab);
  } else {
    initEngineeringLab();
  }
})();
