/* ===================================================================
   JULIANA MEDINA PSICOPEDAGOGA — SCRIPT
   JavaScript puro (ES6+), sem dependências externas.
   Módulos: Loader · Navbar · Scroll Reveal · Stats animadas
   Certificados (carrossel) · Depoimentos (slider) · Accordion (FAQ)
   Validação de formulário de contato
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------------
     1. LOADER — esconde a tela de carregamento após o load
     ----------------------------------------------------------------- */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('is-hidden'), 350);
    });
    // Fallback de segurança: se 'load' demorar, esconde de qualquer forma
    setTimeout(() => loader.classList.add('is-hidden'), 2500);
  }

  /* -----------------------------------------------------------------
     2. NAVBAR — fundo ao rolar + menu mobile
     ----------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navBurger = document.getElementById('navBurger');
  const navMenu = document.getElementById('navMenu');

  const handleScrollNavbar = () => {
    if (window.scrollY > 24) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };
  handleScrollNavbar();
  window.addEventListener('scroll', handleScrollNavbar, { passive: true });

  if (navBurger && navMenu) {
    navBurger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navBurger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fecha o menu ao clicar em um link
    navMenu.querySelectorAll('.navbar__link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navBurger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* -----------------------------------------------------------------
     3. SCROLL REVEAL — observa elementos [data-reveal] e os revela
     ----------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) {
            el.style.transitionDelay = `${delay}ms`;
          }
          el.classList.add('is-visible');
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: navegadores sem suporte mostram tudo direto
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* -----------------------------------------------------------------
     4. ESTATÍSTICAS ANIMADAS — contagem ao entrar na viewport
     ----------------------------------------------------------------- */
  const statsGroup = document.getElementById('statsGroup');

  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutQuad para uma desaceleração suave
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(eased * target);
      el.textContent = `${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  if (statsGroup) {
    const numbers = statsGroup.querySelectorAll('.stats__number');
    if ('IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            numbers.forEach((num) => animateCount(num));
            obs.disconnect();
          }
        });
      }, { threshold: 0.4 });
      statsObserver.observe(statsGroup);
    } else {
      numbers.forEach((num) => animateCount(num));
    }
  }

  
  /* -----------------------------------------------------------------
     6. DEPOIMENTOS — slider simples com dots e auto-play
     ----------------------------------------------------------------- */
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const testimonialsDots = document.getElementById('testimonialsDots');

  if (testimonialsTrack && testimonialsDots) {
    const cards = Array.from(testimonialsTrack.children);
    let activeIndex = 0;
    let autoplayTimer = null;

    // Estiliza o track para comportamento de slider
    testimonialsTrack.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';

    // Cria os dots dinamicamente
    cards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ver depoimento ${index + 1}`);
      if (index === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToSlide(index));
      testimonialsDots.appendChild(dot);
    });

    const dots = Array.from(testimonialsDots.children);

    function goToSlide(index) {
      activeIndex = (index + cards.length) % cards.length;
      testimonialsTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === activeIndex));
      restartAutoplay();
    }

    function restartAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goToSlide(activeIndex + 1), 6000);
    }

    restartAutoplay();

    // Pausa o autoplay quando o usuário interage via swipe básico
    let touchStartX = 0;
    testimonialsTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    testimonialsTrack.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const delta = touchEndX - touchStartX;
      if (Math.abs(delta) > 40) {
        goToSlide(activeIndex + (delta < 0 ? 1 : -1));
      }
    }, { passive: true });
  }

  /* -----------------------------------------------------------------
     7. ACCORDION (FAQ) — abre um item por vez, com altura animada
     ----------------------------------------------------------------- */
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Fecha todos os outros itens (comportamento de accordion exclusivo)
      accordionItems.forEach((otherItem) => {
        const otherTrigger = otherItem.querySelector('.accordion__trigger');
        const otherPanel = otherItem.querySelector('.accordion__panel');
        otherTrigger.setAttribute('aria-expanded', 'false');
        otherPanel.style.maxHeight = null;
      });

      // Alterna o item clicado
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });

  /* -----------------------------------------------------------------
     8. FORMULÁRIO DE CONTATO — validação client-side
     ----------------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  // Regras de validação por campo
  const validators = {
    respNome: (v) => v.trim().length >= 3 || 'Informe o nome completo do responsável.',
    respTelefone: (v) => /^[\d\s()+-]{10,}$/.test(v.trim()) || 'Informe um telefone válido.',
    respWhatsapp: (v) => v.trim() === '' || /^[\d\s()+-]{10,}$/.test(v.trim()) || 'Informe um WhatsApp válido ou deixe em branco.',
    respEmail: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Informe um e-mail válido.',
    criancaNome: (v) => v.trim().length >= 2 || 'Informe o nome da criança.',
    criancaIdade: (v) => (Number(v) >= 1 && Number(v) <= 18) || 'Informe uma idade entre 1 e 18 anos.',
    motivo: (v) => v.trim() !== '' || 'Selecione o motivo da busca.',
  };

  const showFieldError = (fieldName, message) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    const errorEl = document.getElementById(`err-${fieldName}`);
    if (field) field.closest('.form-field').classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
  };

  const clearFieldError = (fieldName) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    const errorEl = document.getElementById(`err-${fieldName}`);
    if (field) field.closest('.form-field').classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
  };

  const validateField = (fieldName) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (!field || !validators[fieldName]) return true;

    const result = validators[fieldName](field.value);
    if (result === true) {
      clearFieldError(fieldName);
      return true;
    }
    showFieldError(fieldName, result);
    return false;
  };

  // Validação em tempo real ao sair do campo (blur)
  Object.keys(validators).forEach((fieldName) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.addEventListener('blur', () => validateField(fieldName));
      field.addEventListener('input', () => {
        if (field.closest('.form-field').classList.contains('has-error')) {
          validateField(fieldName);
        }
      });
    }
  });

  // Máscara simples de telefone: (00) 00000-0000
  const maskPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  ['respTelefone', 'respWhatsapp'].forEach((fieldName) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      field.addEventListener('input', (e) => {
        e.target.value = maskPhone(e.target.value);
      });
    }
  });

  // Envio do formulário
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fieldNames = Object.keys(validators);
      const results = fieldNames.map((name) => validateField(name));
      const isFormValid = results.every(Boolean);

      if (!isFormValid) {
        formSuccess.textContent = '';
        // Rola até o primeiro campo com erro para facilitar a correção
        const firstError = form.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Aqui entraria a chamada real (fetch) para um backend/serviço de e-mail.
      // Por ora, simulamos sucesso e exibimos confirmação ao responsável.
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      setTimeout(() => {
        formSuccess.textContent = 'Recebemos sua solicitação! Em breve entraremos em contato.';
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        form.reset();
      }, 900);
    });
  }

  /* -----------------------------------------------------------------
     9. ANO DINÂMICO NO RODAPÉ
     ----------------------------------------------------------------- */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

});