/* ==========================================================================
   Main Orchestrator: Arun Kumar Aggarwal Portfolio
   Theme Toggle, Sound FX, Arcade Switcher, Scroll Spy, Toasts, PDF Modal
   ========================================================================== */

(function () {
  'use strict';

  // 1. Theme Switcher (Dark / Light) with LocalStorage
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark');
    setTheme(initialTheme);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#06080e' : '#f8fafc');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      if (window.playCyberSound) window.playCyberSound('click');
    });
  }

  initTheme();

  // 2. Sound Toggle Button
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (window.toggleCyberAudio) {
        window.toggleCyberAudio();
      }
    });
  }

  // 3. Cursor Glow Tracker
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
      if (!cursorGlow.classList.contains('is-active')) {
        cursorGlow.classList.add('is-active');
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('is-active');
    });
  }

  // 4. Scroll Progress & Sticky Nav Shadow
  const navProgress = document.getElementById('navProgress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    if (navProgress) {
      navProgress.style.transform = `scaleX(${progress})`;
    }
  }, { passive: true });

  // 5. Mobile Menu Drawer
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const mobileNavSheet = document.getElementById('mobileNavSheet');

  if (menuToggleBtn && mobileNavSheet) {
    menuToggleBtn.addEventListener('click', () => {
      const isOpen = mobileNavSheet.classList.toggle('is-open');
      menuToggleBtn.classList.toggle('is-active');
      menuToggleBtn.setAttribute('aria-expanded', isOpen);
      if (window.playCyberSound) window.playCyberSound('click');
    });

    mobileNavSheet.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNavSheet.classList.remove('is-open');
        menuToggleBtn.classList.remove('is-active');
        menuToggleBtn.setAttribute('aria-expanded', false);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavSheet.classList.contains('is-open')) {
        mobileNavSheet.classList.remove('is-open');
        menuToggleBtn.classList.remove('is-active');
        menuToggleBtn.setAttribute('aria-expanded', false);
      }
    });
  }

  // 6. Scroll Spy for Nav Links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // 7. Number Counter Animation
  const counterElements = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetNum = parseFloat(el.getAttribute('data-count'));
        const duration = 1600;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = (targetNum * eased).toFixed(targetNum % 1 !== 0 ? 1 : 0);
          el.textContent = current;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = targetNum;
          }
        }

        requestAnimationFrame(updateCount);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach(el => counterObserver.observe(el));

  // 8. Live IST Clock
  const clockEl = document.getElementById('istClock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeStr = now.toLocaleTimeString('en-US', options);
    clockEl.textContent = `Manesar, India: ${timeStr} IST`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 9. Toast Notification Utility
  const toastContainer = document.getElementById('toastContainer');
  window.showToast = function (message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  };

  // 10. Click to Copy Helper
  window.copyToClipboard = function (text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        window.showToast(`Copied ${label} to clipboard!`);
        if (window.playCyberSound) window.playCyberSound('click');
      }).catch(() => {
        fallbackCopy(text, label);
      });
    } else {
      fallbackCopy(text, label);
    }
  };

  function fallbackCopy(text, label) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    window.showToast(`Copied ${label} to clipboard!`);
    if (window.playCyberSound) window.playCyberSound('click');
  }

  // 11. Arcade Game Tabs Switcher
  const arcadeTabs = document.querySelectorAll('.arcade-tab-btn');
  const gameViews = document.querySelectorAll('.game-view');

  arcadeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      arcadeTabs.forEach(t => t.classList.remove('is-active'));
      gameViews.forEach(v => v.classList.remove('is-active'));

      tab.classList.add('is-active');
      const gameId = tab.dataset.game;
      const targetView = document.getElementById(`${gameId}View`);
      if (targetView) {
        targetView.classList.add('is-active');
      }
      if (window.playCyberSound) window.playCyberSound('click');
    });
  });

  // 12. PDF Fullscreen Modal Handler
  const resumeModal = document.getElementById('resumeModal');
  const openResumeModalBtn = document.getElementById('openResumeModalBtn');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');

  if (openResumeModalBtn && resumeModal) {
    openResumeModalBtn.addEventListener('click', () => {
      resumeModal.classList.add('is-active');
      if (window.playCyberSound) window.playCyberSound('click');
    });
  }

  if (closeResumeModalBtn && resumeModal) {
    closeResumeModalBtn.addEventListener('click', () => {
      resumeModal.classList.remove('is-active');
    });
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('is-active');
      }
    });
  }

  // 13. Contact Message Form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        window.showToast('Please fill in all required fields.');
        return;
      }

      const mailtoUrl = `mailto:aggarwal.arun26@gmail.com?subject=${encodeURIComponent(subject || `Portfolio Inquiry from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      
      window.showToast('Opening your default email client...');
      if (window.playCyberSound) window.playCyberSound('laser');
      window.location.href = mailtoUrl;
    });
  }
})();
