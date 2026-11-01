/* ==========================================================================
   Skills Filtering & Protocol Inspector
   Interactive Category Filtering, Real-Time Search & Protocol Topology Modal
   ========================================================================== */

(function () {
  'use strict';

  const filterBtns = document.querySelectorAll('.skills-filter-btn');
  const searchInput = document.getElementById('skillsSearchInput');
  const skillCards = document.querySelectorAll('.skill-card');
  const protocolModal = document.getElementById('protocolModal');
  const protocolModalClose = document.getElementById('protocolModalClose');
  const protocolModalTitle = document.getElementById('protocolModalTitle');
  const protocolModalBody = document.getElementById('protocolModalBody');

  // Protocol Deep Dive Knowledge Base (Extracted directly from industrial standards & Arun's experience)
  const protocolData = {
    'EtherCAT': {
      title: 'EtherCAT (Ethernet for Control Automation Technology)',
      layer: 'Data Link Layer (IEC 61158 / Type 12)',
      cycleTime: '250 µs – 1 ms (Sub-microsecond jitter via Distributed Clocks)',
      topology: 'Line, Star, Tree, Daisy-Chain with Flying Processing (Processing on the fly)',
      arunDeployment: 'Primary deterministic fieldbus in Beckhoff TwinCAT 3 architectures at VVDN Technologies. Used for synchronizing multi-axis servo drives and real-time robotic kinematics with zero communication overhead.',
      keyAdvantages: ['Frame processing on-the-fly without CPU packet parsing delay', 'Hardware-based Distributed Clocks (DC) synchronization < 1 µs', 'Standard Ethernet cabling (Cat5e) without expensive switch hardware']
    },
    'PROFINET': {
      title: 'PROFINET (Process Field Net - RT & IRT)',
      layer: 'Application Layer over IEEE 802.3 Ethernet',
      cycleTime: '250 µs (IRT - Isochronous Real-Time) / 1–10 ms (RT)',
      topology: 'Star, Line, Ring (Media Redundancy Protocol - MRP)',
      arunDeployment: 'Deployed on HP PCB Connector Placement & Verification System to transmit real-time (X, Y, Z, Theta) coordinate data from vision inspection cameras directly to Siemens/Mitsubishi PLCs and robotic placement heads.',
      keyAdvantages: ['Seamless interoperability across Siemens S7-1500 and third-party peripherals', 'Built-in MRP ring redundancy ensuring 0 downtime on cable rupture', 'Integrated diagnostic channels and GSDML device configuration']
    },
    'Modbus': {
      title: 'Modbus TCP / RTU (RS-485 & Ethernet)',
      layer: 'Application Layer / Master-Slave (Client-Server)',
      cycleTime: '10 ms – 50 ms (Polling based)',
      topology: 'Point-to-Point, Multi-drop (RS-485 2-wire), Star (TCP/IP)',
      arunDeployment: 'Standardized utility, energy meter, and sensor telemetry across automotive manufacturing lines (Maruti Suzuki, Honda, BorgWarner). Facilitated telemetry data exchange between PLCs and plant MES.',
      keyAdvantages: ['Ubiquitous vendor support across all industrial transmitters and sensors', 'Extremely lightweight protocol stack', 'Easy debugging and packet capturing with Wireshark and serial analyzers']
    },
    'Beckhoff ADS': {
      title: 'Beckhoff ADS (Automation Device Specification)',
      layer: 'TwinCAT Router / Client-Server Protocol over TCP/IP',
      cycleTime: 'Real-time synchronous/asynchronous (< 1 ms local / < 5 ms remote)',
      topology: 'Point-to-point router communication via AMS Net ID',
      arunDeployment: 'Central backbone of the Automated DUT Handling & Validation Process for the world’s largest mobile manufacturing client. Integrated custom Mac UI test stations with TwinCAT 3 PLC routines for deterministic recipe execution.',
      keyAdvantages: ['Direct symbolic addressing of TwinCAT PLC variables from external C++/C#/Python/Mac UI', 'Device-independent routing between control software cores', 'Integrated notification callbacks on variable value changes']
    }
  };

  // Filter functionality
  function filterSkills() {
    const activeBtn = document.querySelector('.skills-filter-btn.is-active');
    const selectedCategory = activeBtn ? activeBtn.dataset.category : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    skillCards.forEach(card => {
      const cardCategory = card.dataset.category;
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = (selectedCategory === 'all' || cardCategory === selectedCategory);
      const matchesSearch = (!query || cardText.includes(query));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Event Listeners for Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      filterSkills();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterSkills);
  }

  // Protocol Card Click Handlers
  window.openProtocolModal = function (protocolKey) {
    const data = protocolData[protocolKey];
    if (!data || !protocolModal) return;

    if (protocolModalTitle) protocolModalTitle.textContent = data.title;
    if (protocolModalBody) {
      protocolModalBody.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 18px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-text-tertiary); text-transform: uppercase;">Protocol Layer</span>
              <p style="font-family: var(--font-mono); font-weight: 700; color: var(--color-cyan); font-size: 0.88rem; margin-top: 4px;">${data.layer}</p>
            </div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-text-tertiary); text-transform: uppercase;">Cycle Determinism</span>
              <p style="font-family: var(--font-mono); font-weight: 700; color: var(--color-amber); font-size: 0.88rem; margin-top: 4px;">${data.cycleTime}</p>
            </div>
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-subtle);">
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-text-tertiary); text-transform: uppercase;">Network Topology</span>
              <p style="font-family: var(--font-mono); font-weight: 700; color: var(--color-green); font-size: 0.88rem; margin-top: 4px;">${data.topology}</p>
            </div>
          </div>

          <div style="background: rgba(0, 240, 255, 0.05); border-left: 3px solid var(--color-cyan); padding: 14px 18px; border-radius: 0 8px 8px 0;">
            <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-cyan); margin-bottom: 6px;">Arun's Production Implementation:</h4>
            <p style="font-size: 0.92rem; color: var(--color-text-secondary); line-height: 1.6;">${data.arunDeployment}</p>
          </div>

          <div>
            <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 10px; font-family: var(--font-mono);">Key Architectural Strengths:</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
              ${data.keyAdvantages.map(adv => `<li style="position: relative; padding-left: 20px; font-size: 0.88rem; color: var(--color-text-secondary);"><span style="position: absolute; left: 0; color: var(--color-cyan);">▹</span>${adv}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    protocolModal.classList.add('is-active');
  };

  if (protocolModalClose) {
    protocolModalClose.addEventListener('click', () => {
      protocolModal.classList.remove('is-active');
    });
  }

  if (protocolModal) {
    protocolModal.addEventListener('click', (e) => {
      if (e.target === protocolModal) {
        protocolModal.classList.remove('is-active');
      }
    });
  }
})();
