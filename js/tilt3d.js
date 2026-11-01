/* ==========================================================================
   3D Tilt & Parallax Reflection Engine
   Smooth 60fps card tilt with dynamic holographic sheen
   ========================================================================== */

(function () {
  'use strict';

  function init3DTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
      let isHovered = false;
      const maxTilt = parseFloat(el.getAttribute('data-tilt-max') || '12');

      // Create sheen overlay if not present
      let sheen = el.querySelector('.tilt-sheen');
      if (!sheen) {
        sheen = document.createElement('div');
        sheen.className = 'tilt-sheen';
        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.appendChild(sheen);
      }

      el.addEventListener('mouseenter', () => {
        isHovered = true;
        el.style.transition = 'transform 120ms ease-out, box-shadow 120ms ease-out';
      });

      el.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;

        const rotX = -dy * maxTilt;
        const rotY = dx * maxTilt;

        el.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

        // Update sheen position
        if (sheen) {
          sheen.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.18) 0%, transparent 60%)`;
          sheen.style.opacity = '1';
        }
      });

      el.addEventListener('mouseleave', () => {
        isHovered = false;
        el.style.transition = 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 400ms ease';
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        if (sheen) {
          sheen.style.opacity = '0';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DTilt);
  } else {
    init3DTilt();
  }
})();
