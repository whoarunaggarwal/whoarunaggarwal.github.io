/**
 * ARUN AI ? Engineering Intelligence Assistant
 * Deterministic conversational AI trained on Arun Aggarwal's verified professional resume,
 * technical accomplishments, architecture case studies, and engineering philosophy.
 */

(function () {
  'use strict';

  const KNOWLEDGE_BASE = [
    {
      keywords: ['who', 'about', 'background', 'intro', 'overview', 'arun', 'identity'],
      response: "I am Arun Aggarwal, a Technical Lead (Manager) ? Control Software with over 7+ years of experience (started in January 2019) architecting and commissioning industrial automation, 6-axis robotics, PLC/SCADA systems, and motion control infrastructure. Currently leading a dedicated engineering team of 8 control software professionals at VVDN Technologies, my background spans Tier-1 automotive manufacturing, automated assembly SPMs, and advanced IPC-to-host integrations."
    },
    {
      keywords: ['twincat', 'beckhoff', 'ipc', 'ads', 'structured text'],
      response: "Arun has deep expertise in Beckhoff TwinCAT 2 and TwinCAT 3 (XAE/XAR) programming in IEC 61131-3 Structured Text (ST). His experience includes configuring real-time cyclic tasks down to 250 ?s, deterministic EtherCAT distributed clocks (DC), NC PTP point-to-point motion, electronic camming, and bidirectional ADS (Automation Device Specification) protocol routing for multi-tier IPC communication."
    },
    {
      keywords: ['appleagent', 'apple', 'mac', 'dut', 'validation', 'device under test'],
      response: "In the Automated DUT Handling & Validation Cell for the world's largest mobile manufacturing client in India, Arun architected the communication bridge between the Beckhoff IPC running TwinCAT 3 and a Mac Mini running AppleAgent validation software. The integration used high-speed TwinCAT ADS and TCP/IP sockets to exchange JSON payloads, coordinating 6-axis robotic pick-and-place with vision-guided micro-alignment, pneumatics, and SIL 3 safety interlocks."
    },
    {
      keywords: ['plc', 'platforms', 'siemens', 'mitsubishi', 'rockwell', 'allen bradley'],
      response: "Arun is proficient across all major industrial PLC platforms:\n? Beckhoff TwinCAT 2/3 (Structured Text, NC Motion, ADS)\n? Siemens TIA Portal (S7-1500, S7-1200, PROFINET IRT, WinCC)\n? Mitsubishi MELSEC (iQ-R, Q, and F Series using GX Works2/3 and CC-Link IE)\n? Rockwell Automation (ControlLogix & CompactLogix via Studio 5000)\nHe emphasizes hardware abstraction layers so control logic remains modular and maintainable."
    },
    {
      keywords: ['robotics', 'robot', 'motion', 'kinematics', 'servo', 'axis'],
      response: "Arun's robotics and motion control capabilities include:\n? 6-Axis Industrial Robotics integration with vision coordinate offsets\n? Cartesian 3-Axis high-payload gantry pick-and-place systems\n? Multi-axis servo synchronization in Cyclic Synchronous Position (CSP) mode\n? Electronic camming, gearing, and S-curve motion profiling to eliminate mechanical vibration\n? Deterministic fieldbus motion over EtherCAT and PROFINET IRT."
    },
    {
      keywords: ['lead', 'leadership', 'team', 'vvdn', 'manager', 'management'],
      response: "At VVDN Technologies (September 2023 ? Present), Arun serves as Technical Lead (Manager) ? Control Software, leading an engineering team of 8 automation and control software engineers. He directs foresight studies, machine automation architecture, technical code reviews, SDLC compliance, and cross-functional hardware bringup while mentoring junior and senior engineers."
    },
    {
      keywords: ['career', 'journey', 'experience', 'companies', 'timeline', 'history'],
      response: "Arun's verified career progression:\n1. VVDN Technologies (Sep 2023 ? Present): Technical Lead ? Control Software (Leading 8 engineers, Beckhoff TwinCAT 3, Siemens, Robotics, AppleAgent)\n2. BorgWarner Emission Systems (Apr 2023 ? Sep 2023): Junior Engineer ? Control Software (EGR & Turbocharger automation, KAIZEN, 5-Why)\n3. Mindarika / UNO Minda (Feb 2023 ? Apr 2023): Senior Executive ? Automation (Tier-1 automotive assembly lines)\n4. Authentic Engineers (Jan 2019 ? Feb 2023): Application Engineer ? Automation Solutions (Commissioning SPMs for Maruti Suzuki, Honda, Lumax, Hella, Spark Minda)."
    },
    {
      keywords: ['projects', 'case studies', 'smart meter', 'pcb', 'connector', 'spm'],
      response: "Arun's landmark engineering projects include:\n? Automated DUT Handling & Validation Cell: AppleAgent Mac integration via ADS/TCP/IP with 6-axis robot and SIL 3 safety.\n? Automated PCB Connector Placement (HP): Vision-guided 30-connector tray insertion over PROFINET IRT at sub-millimeter tolerances.\n? Automated Rotary Smart Meter SPM (IntelliSmart): Synchronized 52-station dual-core rotary dial machine with continuous parallel execution.\n? Automotive EOL Leakage & Calibration Rig (BorgWarner): Sub-micron travel and differential pressure calibration for EGR valves."
    },
    {
      keywords: ['education', 'degree', 'mba', 'btech', 'university', 'college'],
      response: "Arun's educational qualifications:\n? MBA ? Information Technology, University of Delhi (Expected 2027)\n? B.Tech ? Electronics & Communications Engineering, Panipat Institute of Engineering and Technology (PIET, 2013?2017)\nThis blend of technical electronics engineering and IT business administration equips him to lead both software development and organizational execution."
    },
    {
      keywords: ['contact', 'email', 'phone', 'hire', 'reach', 'connect', 'linkedin'],
      response: "You can connect directly with Arun Aggarwal via:\n? Email: aggarwal.arun26@gmail.com\n? Phone: +91-7015261054 / +91-8950385004\n? LinkedIn: linkedin.com/in/arunkumar-aggarwal-258079140\n? GitHub: github.com/whoarunaggarwal\n? Location: Manesar, Gurugram (Delhi NCR), India."
    },
    {
      keywords: ['opportunities', 'goals', 'roles', 'interests', 'looking for'],
      response: "Arun is interested in Technical Leadership, Control Software Architecture, and Industrial Automation Management roles where he can lead high-impact engineering teams, design next-generation intelligent manufacturing cells, and pioneer the convergence of industrial control systems with edge computing and AI."
    }
  ];

  const DEFAULT_RESPONSE = "I am trained on Arun Aggarwal's verified engineering portfolio and resume. You can ask me about his Beckhoff TwinCAT 3 experience, the AppleAgent integration project, his 6-axis robotics work, PLC platforms (Siemens, Mitsubishi, Rockwell), his team leadership at VVDN Technologies, or his career timeline since 2019!";

  function findAnswer(query) {
    const q = query.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');
    const tokens = q.split(/\s+/).filter(Boolean);
    let bestMatch = null;
    let maxScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (q.includes(kw)) score += 3;
        for (const token of tokens) {
          if (token === kw) score += 2;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    return maxScore >= 2 ? bestMatch.response : DEFAULT_RESPONSE;
  }

  function initArunAI() {
    const chatContainer = document.getElementById('aiChatMessages');
    const inputField = document.getElementById('aiChatInput');
    const sendButton = document.getElementById('aiChatSend');
    const promptPills = document.querySelectorAll('.ai-prompt-pill');

    if (!chatContainer || !inputField || !sendButton) return;

    function appendMessage(text, isUser = false) {
      const msgDiv = document.createElement('div');
      msgDiv.className = isUser ? 'ai-msg ai-msg-user' : 'ai-msg ai-msg-bot';

      const avatar = document.createElement('div');
      avatar.className = 'ai-msg-avatar';
      avatar.textContent = isUser ? 'YOU' : 'AI';

      const content = document.createElement('div');
      content.className = 'ai-msg-content';

      msgDiv.appendChild(avatar);
      msgDiv.appendChild(content);
      chatContainer.appendChild(msgDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      if (isUser) {
        content.textContent = text;
        return;
      }

      // Typing effect for bot
      let charIndex = 0;
      const formatted = text.replace(/\\n/g, '<br>');
      const rawText = text;
      content.textContent = '';
      
      const interval = setInterval(() => {
        if (charIndex < rawText.length) {
          const chunk = rawText.slice(0, charIndex + 3);
          content.innerHTML = chunk.replace(/\n/g, '<br>');
          charIndex += 3;
          chatContainer.scrollTop = chatContainer.scrollHeight;
        } else {
          content.innerHTML = formatted;
          clearInterval(interval);
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 12);
    }

    function handleSend() {
      const query = inputField.value.trim();
      if (!query) return;

      appendMessage(query, true);
      inputField.value = '';

      // Typing indicator
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'ai-msg ai-msg-bot ai-typing-indicator';
      typingIndicator.innerHTML = '<div class="ai-msg-avatar">AI</div><div class="ai-msg-content"><span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span></div>';
      chatContainer.appendChild(typingIndicator);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      setTimeout(() => {
        if (typingIndicator.parentNode) {
          typingIndicator.parentNode.removeChild(typingIndicator);
        }
        const answer = findAnswer(query);
        appendMessage(answer, false);
      }, 350);
    }

    sendButton.addEventListener('click', handleSend);
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });

    promptPills.forEach(pill => {
      pill.addEventListener('click', () => {
        inputField.value = pill.textContent.trim();
        handleSend();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArunAI);
  } else {
    initArunAI();
  }
})();
