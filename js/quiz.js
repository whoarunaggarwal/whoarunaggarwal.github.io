/* ==========================================================================
   Industrial Automation & Control Software MCQ Arena
   Randomized 5-Question Stepped Wizard from Extensive Question Bank
   ========================================================================== */

(function () {
  'use strict';

  // Comprehensive Question Bank spanning TwinCAT, TIA Portal, EtherCAT, PROFINET, ST, Robotics & Safety
  const questionPool = [
    {
      domain: 'Beckhoff TwinCAT 3',
      question: 'In Beckhoff TwinCAT 3, what is the primary role of the ADS (Automation Device Specification) Router?',
      options: [
        'A) It compiles Structured Text into machine binary code',
        'B) It provides a device-independent software communication bus routing messages via AMS Net ID',
        'C) It converts 24V digital I/O signals into 5V TTL logic',
        'D) It configures IP addresses for Ethernet switches automatically'
      ],
      correct: 1,
      explanation: 'The TwinCAT ADS Router manages message routing between distinct software modules and external devices using unique AMS Net IDs over TCP/IP, independent of hardware fieldbuses.'
    },
    {
      domain: 'Industrial Fieldbus',
      question: 'How does EtherCAT achieve sub-microsecond synchronization across distributed servo drive axes?',
      options: [
        'A) Using NTP time servers over WAN connections',
        'B) Through hardware-based Distributed Clocks (DC) where slaves adjust their local clocks based on propagation delay',
        'C) By polling each drive serially with Modbus RTU at 9600 baud',
        'D) By sending UDP broadcast ping packets every 10 seconds'
      ],
      correct: 1,
      explanation: 'EtherCAT Distributed Clocks (DC) measure precise physical transmission delays between nodes during startup and continuously adjust slave hardware timers, achieving synchronization jitter below 1 microsecond.'
    },
    {
      domain: 'Structured Text (IEC 61131-3)',
      question: 'Which statement accurately describes the difference between a FUNCTION (FUN) and a FUNCTION BLOCK (FB) in IEC 61131-3?',
      options: [
        'A) A FUNCTION has internal persistent memory (instance data), while a FUNCTION BLOCK is stateless',
        'B) A FUNCTION is stateless and produces identical outputs for given inputs; a FUNCTION BLOCK maintains internal state across PLC scan cycles',
        'C) Only FUNCTION BLOCKS can be written in Ladder Logic',
        'D) FUNCTIONS can only be executed once during machine power-on'
      ],
      correct: 1,
      explanation: 'In IEC 61131-3, a FUNCTION has no internal memory and returns a single result. A FUNCTION BLOCK requires an instance data block (DB) to retain internal variables between execution cycles.'
    },
    {
      domain: 'Siemens TIA Portal',
      question: 'In Siemens SIMATIC S7-1500 controllers, what is the key advantage of using "Optimized Block Access" for Data Blocks (DB)?',
      options: [
        'A) It forces fixed byte offsets like DB1.DBX0.0 to guarantee legacy compatibility',
        'B) The compiler automatically arranges tags by data type to optimize memory alignment and accelerate CPU execution speed',
        'C) It disables all communication security on the CPU',
        'D) It reduces the CPU clock speed to save battery power'
      ],
      correct: 1,
      explanation: 'Optimized DBs allow the CPU to organize variables based on their data type alignment rather than fixed byte offsets, significantly accelerating read/write access and preventing fragmentation.'
    },
    {
      domain: 'PROFINET',
      question: 'What is the fundamental difference between PROFINET RT (Real-Time) and PROFINET IRT (Isochronous Real-Time)?',
      options: [
        'A) PROFINET RT uses standard Ethernet switches, while IRT reserves synchronized time slices via specialized ASIC hardware for deterministic motion control',
        'B) PROFINET RT is only for wireless sensors, while IRT is for pneumatic valves',
        'C) IRT does not support fiber optic cables',
        'D) RT operates at 10 Gbps while IRT operates at 1 Mbps'
      ],
      correct: 0,
      explanation: 'PROFINET RT bypasses the TCP/IP stack to prioritize I/O frames (1-10 ms). PROFINET IRT splits the bus cycle into deterministic isochronous time slots with sub-millisecond precision for multi-axis motion.'
    },
    {
      domain: 'Machine Safety (ISO 13849 / IEC 62061)',
      question: 'To achieve Performance Level e (PL e) / SIL 3 in safety control systems, which architecture requirement is mandatory?',
      options: [
        'A) Single-channel wiring without diagnostic coverage',
        'B) Dual-channel redundant architecture (Category 3 or 4) with high Diagnostic Coverage (DC >= 99%)',
        'C) Standard commercial non-safety software running on Windows',
        'D) A single mechanical fuse connected in series'
      ],
      correct: 1,
      explanation: 'PL e / SIL 3 requires dual-channel redundancy (e.g. Cat 4) with cross-monitoring and high diagnostic coverage so that a single fault does not cause loss of the safety function.'
    },
    {
      domain: 'Robotics & Kinematics',
      question: 'When calibrating a 6-axis industrial robot for vision-guided pick-and-place, what does the Tool Center Point (TCP) define?',
      options: [
        'A) The weight of the robot pedestal on the shop floor',
        'B) The exact Cartesian origin (X, Y, Z, Yaw, Pitch, Roll) of the working tool tip relative to the robot flange coordinate system',
        'C) The network IP address of the vision controller',
        'D) The speed of the primary joint motor 1'
      ],
      correct: 1,
      explanation: 'The TCP establishes the focal coordinate reference point at the tip of the gripper or tool, allowing the robot controller to calculate linear and circular trajectory pathing with zero positional error.'
    },
    {
      domain: 'Machine Vision & AOI',
      question: 'Why are Telecentric Lenses preferred over standard lenses in Automated Optical Inspection (AOI) systems?',
      options: [
        'A) They are significantly cheaper and made of plastic',
        'B) They eliminate perspective magnification error so the object appears the exact same size regardless of its distance from the lens',
        'C) They can only see red light',
        'D) They do not require any camera sensor'
      ],
      correct: 1,
      explanation: 'Telecentric lenses maintain constant magnification over a specific depth of field, eliminating parallax distortion and ensuring micro-connector pins are measured with sub-pixel dimensional accuracy.'
    },
    {
      domain: 'Motion Control & Servo Drives',
      question: 'What is "Following Error" (Lag Error) in a closed-loop servo motion control system?',
      options: [
        'A) The time it takes for an operator to press the start button',
        'B) The instantaneous difference between the commanded setpoint position and the actual encoder feedback position',
        'C) The total distance a motor shaft has rotated since manufacture',
        'D) The ambient temperature rise in the electrical cabinet'
      ],
      correct: 1,
      explanation: 'Following Error is the instantaneous discrepancy between the position target commanded by the motion controller and the real-time position reported by the encoder. High following error triggers servo fault interlocks.'
    },
    {
      domain: 'Mitsubishi MELSEC',
      question: 'In Mitsubishi GX Works3, what is the function of CC-Link IE TSN (Time Sensitive Networking)?',
      options: [
        'A) It sends SMS text alerts to maintenance phones',
        'B) It combines deterministic motion control, standard Ethernet communications, and safety data on a single unified gigabit Ethernet cable',
        'C) It acts as an analog 0-10V signal converter',
        'D) It formats hard drives on industrial PCs'
      ],
      correct: 1,
      explanation: 'CC-Link IE TSN uses IEEE 802.1 Time Sensitive Networking standards to execute deterministic motion synchronization while simultaneously carrying high-bandwidth vision streams and IT data on the same physical link.'
    }
  ];

  let currentQuiz = [];
  let currentStep = 0;
  let userAnswers = [];
  let score = 0;

  const quizContainer = document.getElementById('quizWizard');
  if (!quizContainer) return;

  function pickRandom5() {
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    currentQuiz = shuffled.slice(0, 5);
    currentStep = 0;
    userAnswers = new Array(5).fill(null);
    score = 0;
  }

  function renderQuiz() {
    if (!quizContainer) return;

    if (currentStep < 5) {
      const q = currentQuiz[currentStep];
      const isAnswered = userAnswers[currentStep] !== null;

      quizContainer.innerHTML = `
        <div class="quiz-card">
          <!-- Quiz Top Progress Bar -->
          <div class="quiz-header">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <span class="quiz-badge">${q.domain}</span>
              <span class="quiz-counter">QUESTION ${currentStep + 1} OF 5</span>
            </div>
            <div class="quiz-progress-track">
              <div class="quiz-progress-fill" style="width: ${((currentStep + 1) / 5) * 100}%"></div>
            </div>
          </div>

          <!-- Question Body -->
          <div class="quiz-body">
            <h3 class="quiz-question">${q.question}</h3>

            <!-- Options Grid -->
            <div class="quiz-options-grid">
              ${q.options.map((opt, idx) => {
                let extraClass = '';
                if (isAnswered) {
                  if (idx === q.correct) extraClass = 'is-correct';
                  else if (userAnswers[currentStep] === idx) extraClass = 'is-incorrect';
                }
                return `
                  <button class="quiz-option-btn ${extraClass}" data-idx="${idx}" type="button" ${isAnswered ? 'disabled' : ''}>
                    ${opt}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Explanation & Next Button -->
            ${isAnswered ? `
              <div class="quiz-explanation ${userAnswers[currentStep] === q.correct ? 'exp-correct' : 'exp-incorrect'}">
                <strong>${userAnswers[currentStep] === q.correct ? '✓ Correct Answer!' : '✗ Engineering Note:'}</strong>
                <p style="margin-top: 4px;">${q.explanation}</p>
              </div>
              <div style="display: flex; justify-content: flex-end; margin-top: 18px;">
                <button class="btn btn-primary" id="quizNextBtn" type="button">
                  ${currentStep === 4 ? 'View Final Results 🏆' : 'Next Question ▹'}
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      // Option click handlers
      const optionBtns = quizContainer.querySelectorAll('.quiz-option-btn');
      optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const chosenIdx = parseInt(btn.dataset.idx, 10);
          userAnswers[currentStep] = chosenIdx;
          if (chosenIdx === q.correct) {
            score++;
            if (window.playCyberSound) window.playCyberSound('click');
          } else {
            if (window.playCyberSound) window.playCyberSound('chess-capture');
          }
          renderQuiz();
        });
      });

      // Next button handler
      const nextBtn = document.getElementById('quizNextBtn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentStep++;
          if (window.playCyberSound) window.playCyberSound('laser');
          renderQuiz();
        });
      }
    } else {
      // Final Results Screen
      renderFinalResults();
    }
  }

  function renderFinalResults() {
    const percentage = Math.round((score / 5) * 100);
    let verdict = 'Automation Control Software Master';
    let badgeClass = 'verdict-gold';
    if (percentage < 60) {
      verdict = 'Engineering Associate – Keep Reviewing PLC Standards';
      badgeClass = 'verdict-bronze';
    } else if (percentage < 80) {
      verdict = 'Senior Control Software Engineer';
      badgeClass = 'verdict-silver';
    }

    quizContainer.innerHTML = `
      <div class="quiz-card quiz-results-card">
        <div style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 14px;">
          <span class="status-pill" style="font-weight: 800;">MCQ CERTIFICATION COMPLETE</span>
          <div class="results-score-circle">
            <span class="results-num">${score}/5</span>
            <span class="results-pct">${percentage}% ACCURACY</span>
          </div>
          <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--color-text-primary);">${verdict}</h3>
          <p style="color: var(--color-text-secondary); max-width: 540px; font-size: 0.95rem;">
            Questions were algorithmically randomized from the industrial automation core question pool. Roll a new set to challenge yourself again!
          </p>
          <div style="display: flex; gap: 12px; margin-top: 10px;">
            <button class="btn btn-primary" id="quizRollNewBtn" type="button">
              Roll 5 New Questions 🎲
            </button>
            <a class="btn btn-secondary" href="#skills">Review Skills Matrix ▹</a>
          </div>
        </div>
      </div>
    `;

    if (window.playCyberSound) window.playCyberSound('win');

    const rollBtn = document.getElementById('quizRollNewBtn');
    if (rollBtn) {
      rollBtn.addEventListener('click', () => {
        pickRandom5();
        renderQuiz();
        if (window.playCyberSound) window.playCyberSound('laser');
      });
    }
  }

  // Initial random selection
  pickRandom5();
  renderQuiz();
})();
