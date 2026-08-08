/* ===================================================================
   JULIANA MEDINA PSICOPEDAGOGA — HERO SCENE (Transformação)
   Isolado e defensivo. Respeita prefers-reduced-motion e simplifica no
   mobile. Coreografia de hi-five em CSS (recuo lento, batida rápida,
   estabilização). No ponto de contato (--hi-x/--hi-y) disparamos:
   • Flash radial rosa/dourado (CSS) ~480ms
   • Anel afiado (CSS) ~420ms
   • Raios curtos + partículas (JS, Web Animations API) ~320–520ms
   =================================================================== */
(function () {
  'use strict';

  const scene = document.getElementById('heroScene');
  if (!scene) return;

  const reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isMobile =
    window.matchMedia && window.matchMedia('(max-width: 768px)').matches;

  /* PONTO DE CONTATO DO HI-FIVE (em % da cena)
     Desktop: ~50%/50% (desktop), 50%/52% (mobile). Recalibrado para ficar
     "entre" a personagem (45%) e o cérebro (54%), em altura média. */
  const CONTACT = isMobile ? { x: 50, y: 52 } : { x: 50, y: 50 };
  scene.style.setProperty('--hi-x', CONTACT.x + '%');
  scene.style.setProperty('--hi-y', CONTACT.y + '%');

  if (reduceMotion) return; // versão estática mantida pelo CSS

  const flash = scene.querySelector('.burst--flash');
  const ring = scene.querySelector('.burst--ring');

  const COLORS = ['#FFFFFF', '#E7CF8A', '#D98FA6', '#C9A227', '#E9B7C7'];
  const RAYS = isMobile ? 8 : 12;       // raios curtos
  const DOTS = isMobile ? 10 : 14;      // pequenas partículas

  function sceneSize() {
    const r = scene.getBoundingClientRect();
    return Math.min(r.width, r.height) || 1;
  }

  function flashOnce() {
    [flash, ring].forEach((el) => {
      if (!el) return;
      el.classList.remove('is-flashing');
      void el.offsetWidth; // garante reinício da animação CSS
      el.classList.add('is-flashing');
    });

    const size = sceneSize();
    const R_MIN = size * 0.05;

    const RAY_LEN = size * (isMobile ? 0.030 : 0.034); // raios curtos, ~3.4%
    const DOT_LEN = size * (isMobile ? 0.012 : 0.014); // partículas leves

    // Raios curtos: linhas finas que saem rápido do ponto e desbotam
    for (let i = 0; i < RAYS; i++) {
      const el = document.createElement('span');
      el.className = 'hero-particle hero-particle--ray';
      el.style.setProperty('--len', (RAY_LEN * (0.7 + Math.random() * 0.6)).toFixed(1) + 'px');
      el.style.setProperty('--thick', (2 + Math.random() * 1.2).toFixed(1) + 'px');
      el.style.setProperty('--pcolor', COLORS[(Math.random() * COLORS.length) | 0]);
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%,-50%) rotate(0deg)';
      scene.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const r = R_MIN + Math.random() * size * 0.05;
      const len = RAY_LEN * (0.5 + Math.random() * 0.8);

      el.animate(
        [
          { transform: `translate(-50%,-50%) rotate(${(angle * 180 / Math.PI).toFixed(0)}deg) translateX(0px)`, opacity: 1 },
          { transform: `translate(-50%,-50%) rotate(${(angle * 180 / Math.PI).toFixed(0)}deg) translateX(${(r + len).toFixed(1)}px)`, opacity: 0 }
        ],
        { duration: 320 + Math.random() * 80, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      ).onfinish = function () { el.remove(); };
    }

    // Partículas: pontos que explodem e desaparecem
    for (let i = 0; i < DOTS; i++) {
      const el = document.createElement('span');
      el.className = 'hero-particle';
      el.style.setProperty('--size', (DOT_LEN * (0.9 + Math.random() * 0.6)).toFixed(1) + 'px');
      el.style.setProperty('--pcolor', COLORS[(Math.random() * COLORS.length) | 0]);
      el.style.opacity = '0';
      el.style.transform = 'translate(0px, 0px) scale(1)';
      scene.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const r = (R_MIN * (1.4 + Math.random() * 2.2)) + Math.random() * size * 0.06;
      const tx = Math.cos(angle) * r;
      const ty = Math.sin(angle) * r;

      el.animate(
        [
          { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
          { transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(0.12)`, opacity: 0 }
        ],
        { duration: 420 + Math.random() * 160, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      ).onfinish = function () { el.remove(); };
    }
  }

  /* Sincronia com a coreografia CSS:
     person ~4.32s · brain ~4.34s (estamos na "batida" do hi-five) */
  const FIRST_AT = 4320;
  const REPEAT_EVERY = 9000;

  let timeoutId = window.setTimeout(function tick() {
    flashOnce();
    timeoutId = window.setTimeout(tick, REPEAT_EVERY);
  }, FIRST_AT);

  // Higiene: remove timers se a cena sair do DOM
  const mo = new MutationObserver(() => {
    if (!document.contains(scene)) {
      window.clearTimeout(timeoutId);
      mo.disconnect();
    }
  });
  if (document.body) mo.observe(document.body, { childList: true, subtree: true });
})();
