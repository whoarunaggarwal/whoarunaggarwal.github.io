/* ==========================================================================
   SCADA Telemetry & PLC Simulation Console
   Real-Time Deterministic Scan Engine, 4-Axis Kinematics & Waveform Canvas
   ========================================================================== */

(function () {
  'use strict';

  const canvas = document.getElementById('scadaWaveformCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // DOM elements
  const scanTimeEl = document.getElementById('telemetryScanTime');
  const busCycleEl = document.getElementById('telemetryBusCycle');
  const taskStateEl = document.getElementById('telemetryTaskState');
  const axisXEl = document.getElementById('axisX');
  const axisYEl = document.getElementById('axisY');
  const axisZEl = document.getElementById('axisZ');
  const axisThetaEl = document.getElementById('axisTheta');
  const btnRun = document.getElementById('scadaBtnRun');
  const btnPause = document.getElementById('scadaBtnPause');
  const btnInspect = document.getElementById('scadaBtnInspect');
  const btnEstop = document.getElementById('scadaBtnEstop');
  const ledRun = document.getElementById('ledRun');
  const ledBus = document.getElementById('ledBus');
  const ledForce = document.getElementById('ledForce');
  const tabBtns = document.querySelectorAll('.scada-tab-btn');

  // State
  let isRunning = true;
  let isEstop = false;
  let activePlatform = 'beckhoff';
  let scanTimeBase = 1.20; // ms
  let waveData = [];
  const maxWavePoints = 80;

  // Kinematic coordinates target & current
  let currentPos = { x: 420.5, y: 185.2, z: 82.0, theta: 45.0 };
  let targetPos = { x: 420.5, y: 185.2, z: 82.0, theta: 45.0 };
  let stepTimer = 0;

  const trajectoryWaypoints = [
    { x: 420.5, y: 185.2, z: 82.0, theta: 45.0 },
    { x: 512.0, y: 220.4, z: 25.0, theta: 90.0 }, // Pickup
    { x: 310.2, y: 140.8, z: 120.0, theta: 0.0 },  // Inspection
    { x: 620.8, y: 280.0, z: 15.5, theta: 180.0 }  // Assembly place
  ];
  let waypointIndex = 0;

  // Initialize waveform buffer
  for (let i = 0; i < maxWavePoints; i++) {
    waveData.push(36);
  }

  // Resize canvas for crisp rendering on retina screens
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Animation Loop
  let lastTime = performance.now();

  function animate(now) {
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    if (isRunning && !isEstop) {
      stepTimer += delta;

      // Switch trajectory waypoint every 2.4 seconds
      if (stepTimer > 2.4) {
        stepTimer = 0;
        waypointIndex = (waypointIndex + 1) % trajectoryWaypoints.length;
        targetPos = trajectoryWaypoints[waypointIndex];
      }

      // Smooth kinematic lerp towards target
      currentPos.x += (targetPos.x - currentPos.x) * 0.08;
      currentPos.y += (targetPos.y - currentPos.y) * 0.08;
      currentPos.z += (targetPos.z - currentPos.z) * 0.08;
      currentPos.theta += (targetPos.theta - currentPos.theta) * 0.08;

      // Realistic deterministic jitter
      const jitter = (Math.random() - 0.5) * 0.04;
      const currentScan = (scanTimeBase + jitter).toFixed(2);
      if (scanTimeEl) scanTimeEl.textContent = `${currentScan} ms`;

      // Update kinematics readout
      if (axisXEl) axisXEl.textContent = currentPos.x.toFixed(1);
      if (axisYEl) axisYEl.textContent = currentPos.y.toFixed(1);
      if (axisZEl) axisZEl.textContent = currentPos.z.toFixed(1);
      if (axisThetaEl) axisThetaEl.textContent = `${currentPos.theta.toFixed(1)}°`;

      // Waveform amplitude calculation
      const waveValue = 36 + Math.sin(now * 0.012) * 16 + (Math.random() - 0.5) * 6;
      waveData.push(waveValue);
      if (waveData.length > maxWavePoints) waveData.shift();
    } else if (isEstop) {
      // Flatline waveform on ESTOP
      waveData.push(36);
      if (waveData.length > maxWavePoints) waveData.shift();
    }

    // Render Canvas
    renderWaveform();
    requestAnimationFrame(animate);
  }

  function renderWaveform() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Subtle Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < w; x += 30) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += 18) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Signal Line
    ctx.beginPath();
    const step = w / (maxWavePoints - 1);
    for (let i = 0; i < waveData.length; i++) {
      const x = i * step;
      const y = (waveData[i] / 72) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    if (isEstop) {
      ctx.strokeStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
    } else {
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
    }

    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Interactive Button Listeners
  if (btnRun) {
    btnRun.addEventListener('click', () => {
      isRunning = true;
      isEstop = false;
      if (taskStateEl) {
        taskStateEl.textContent = 'RUNNING';
        taskStateEl.style.color = 'var(--color-green)';
      }
      if (ledRun) ledRun.className = 'led-bulb is-green';
      if (ledForce) ledForce.className = 'led-bulb';
    });
  }

  if (btnPause) {
    btnPause.addEventListener('click', () => {
      isRunning = false;
      if (taskStateEl) {
        taskStateEl.textContent = 'PAUSED';
        taskStateEl.style.color = 'var(--color-amber)';
      }
      if (ledRun) ledRun.className = 'led-bulb is-amber';
    });
  }

  if (btnInspect) {
    btnInspect.addEventListener('click', () => {
      if (taskStateEl) {
        const prevText = taskStateEl.textContent;
        taskStateEl.textContent = 'AOI TRIGGERED: PASS';
        taskStateEl.style.color = 'var(--color-cyan)';
        setTimeout(() => {
          if (isRunning && !isEstop) {
            taskStateEl.textContent = 'RUNNING';
            taskStateEl.style.color = 'var(--color-green)';
          }
        }, 1600);
      }
    });
  }

  if (btnEstop) {
    btnEstop.addEventListener('click', () => {
      isEstop = !isEstop;
      if (isEstop) {
        isRunning = false;
        if (taskStateEl) {
          taskStateEl.textContent = 'ESTOP ACTIVATED';
          taskStateEl.style.color = 'var(--color-red)';
        }
        if (ledRun) ledRun.className = 'led-bulb';
        if (ledForce) ledForce.className = 'led-bulb is-amber';
        btnEstop.textContent = 'RESET ESTOP';
      } else {
        isRunning = true;
        if (taskStateEl) {
          taskStateEl.textContent = 'SYSTEM RESET: READY';
          taskStateEl.style.color = 'var(--color-green)';
        }
        if (ledRun) ledRun.className = 'led-bulb is-green';
        if (ledForce) ledForce.className = 'led-bulb';
        btnEstop.textContent = 'EMERGENCY STOP';
      }
    });
  }

  // Platform Tab Switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activePlatform = btn.dataset.platform;

      if (activePlatform === 'beckhoff') {
        scanTimeBase = 1.20;
        if (busCycleEl) busCycleEl.textContent = 'EtherCAT 250 µs';
      } else if (activePlatform === 'siemens') {
        scanTimeBase = 1.85;
        if (busCycleEl) busCycleEl.textContent = 'PROFINET IRT 1 ms';
      } else if (activePlatform === 'mitsubishi') {
        scanTimeBase = 1.45;
        if (busCycleEl) busCycleEl.textContent = 'CC-Link IE TSN';
      }
    });
  });

  requestAnimationFrame(animate);
})();
