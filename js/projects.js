/* ==========================================================================
   Project Architecture Visualizers & Interactive Diagrams
   DUT Validation Pipeline, PCB Vision-ProfiNet-Robot, IntelliSmart Dual-Core SPM
   ========================================================================== */

(function () {
  'use strict';

  // Interactive Hover and Signal Pulse Effects on SVG Diagrams
  const diagramPanels = document.querySelectorAll('.project-diagram-panel');

  diagramPanels.forEach(panel => {
    const nodes = panel.querySelectorAll('.arch-node');
    const signalPills = panel.querySelectorAll('.arch-signal');

    nodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        const targetFlow = node.dataset.flow;
        if (targetFlow) {
          panel.querySelectorAll(`.flow-${targetFlow}`).forEach(flow => {
            flow.classList.add('is-active-flow');
          });
        }
      });

      node.addEventListener('mouseleave', () => {
        panel.querySelectorAll('.is-active-flow').forEach(flow => {
          flow.classList.remove('is-active-flow');
        });
      });
    });
  });

  // Global helper to view expanded engineering schematics
  window.expandProjectDiagram = function (projectId) {
    const modal = document.getElementById('diagramModal');
    const modalTitle = document.getElementById('diagramModalTitle');
    const modalContent = document.getElementById('diagramModalContent');
    if (!modal || !modalTitle || !modalContent) return;

    if (projectId === 'dut-handling') {
      modalTitle.textContent = 'System Architecture: Automated DUT Handling & Validation';
      modalContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <p style="color: var(--color-text-secondary); line-height: 1.6;">
            <strong>Control Architecture Breakdown:</strong> Beckhoff TwinCAT 3 real-time kernel runs deterministic motion control and safety routines. A custom Mac UI application interfaces via Beckhoff ADS over TCP/IP to deliver test recipes and capture parametric DUT measurements.
          </p>
          <div style="background: rgba(10, 15, 24, 0.95); border: 1px solid var(--border-medium); border-radius: 12px; padding: 24px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
              <div style="border-left: 2px solid var(--color-cyan); padding-left: 12px;">
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-text-tertiary);">HIGH-LEVEL EXECUTIVE</span>
                <h5 style="color: var(--color-text-primary); font-size: 0.95rem; margin-top: 4px;">Mac OS Test Station</h5>
                <p style="font-size: 0.84rem; color: var(--color-text-secondary); margin-top: 4px;">Recipe generation, test result aggregation, telemetry push to plant MES.</p>
              </div>
              <div style="border-left: 2px solid var(--color-green); padding-left: 12px;">
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-text-tertiary);">CONTROL LAYER</span>
                <h5 style="color: var(--color-text-primary); font-size: 0.95rem; margin-top: 4px;">Beckhoff TwinCAT 3 (ST)</h5>
                <p style="font-size: 0.84rem; color: var(--color-text-secondary); margin-top: 4px;">1.0 ms cycle task. ADS router handles non-blocking variable exchange with Mac UI.</p>
              </div>
              <div style="border-left: 2px solid var(--color-amber); padding-left: 12px;">
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-text-tertiary);">PERCEPTION & ROBOTICS</span>
                <h5 style="color: var(--color-text-primary); font-size: 0.95rem; margin-top: 4px;">AOI Vision & 6-Axis Robot</h5>
                <p style="font-size: 0.84rem; color: var(--color-text-secondary); margin-top: 4px;">Automated optical inspection checks connector pins and cosmetic defects before tray deposit.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (projectId === 'pcb-connector') {
      modalTitle.textContent = 'System Architecture: PCB Connector Placement & Verification';
      modalContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <p style="color: var(--color-text-secondary); line-height: 1.6;">
            <strong>Real-time Coordinate Transformation:</strong> 30-connector carrier tray is scanned via telecentric machine vision. Calculated position offsets (ΔX, ΔY, ΔZ, Δθ) are packed into PROFINET cyclic I/O words and sent to the PLC controller, which commands robot trajectory dynamically.
          </p>
          <div style="background: rgba(10, 15, 24, 0.95); border: 1px solid var(--border-medium); border-radius: 12px; padding: 24px;">
            <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-cyan); margin-bottom: 12px;">
              PROFINET Cyclic I/O Frame Structure:
            </div>
            <pre style="background: rgba(0, 0, 0, 0.6); padding: 14px; border-radius: 8px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-text-secondary); overflow-x: auto;">
[Header: Station 0x04] -> [Payload: Tray_ID (WORD), Slot_Idx (BYTE)] -> [Offsets: ΔX (DINT), ΔY (DINT), ΔZ (DINT), ΔTheta (REAL)] -> [CRC16: Validated]
            </pre>
          </div>
        </div>
      `;
    } else if (projectId === 'rotary-spm') {
      modalTitle.textContent = 'System Architecture: IntelliSmart Dual-Core 52-Station SPM';
      modalContent.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <p style="color: var(--color-text-secondary); line-height: 1.6;">
            <strong>Parallel Twin Rotary Synchronization:</strong> Designed with two independent 26-station rotary tables operating synchronously to eliminate indexing bottlenecks. Station operations run simultaneously while parts transfer between core A and core B.
          </p>
          <div style="background: rgba(10, 15, 24, 0.95); border: 1px solid var(--border-medium); border-radius: 12px; padding: 24px;">
            <p style="font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.6;">
              <strong style="color: var(--color-green);">Cycle Time Advantage:</strong> Single-core machines were limited to ~18s per unit due to serial screwdriving and laser marking. The synchronized dual-core architecture partitioned long-duration processes across 52 parallel stations, cutting overall cycle time by > 45%.
            </p>
          </div>
        </div>
      `;
    }

    modal.classList.add('is-active');
  };

  const diagramModal = document.getElementById('diagramModal');
  const diagramModalClose = document.getElementById('diagramModalClose');

  if (diagramModalClose) {
    diagramModalClose.addEventListener('click', () => {
      diagramModal.classList.remove('is-active');
    });
  }

  if (diagramModal) {
    diagramModal.addEventListener('click', (e) => {
      if (e.target === diagramModal) {
        diagramModal.classList.remove('is-active');
      }
    });
  }
})();
