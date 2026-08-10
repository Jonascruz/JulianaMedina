/* ===================================================================
   JULIANA MEDINA PSICOPEDAGOGA — SCRIPT
   JavaScript puro, sem dependências externas.
   Módulos:
   Loader · Navbar · Scroll Reveal · Avaliações Google · FAQ
   Validação básica do formulário · Ano dinâmico no rodapé
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* -----------------------------------------------------------------
     1. LOADER
  ----------------------------------------------------------------- */
  const loader = document.getElementById('loader');

  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('is-hidden');
      }, 350);
    });

    setTimeout(() => {
      loader.classList.add('is-hidden');
    }, 2500);
  }

  /* -----------------------------------------------------------------
     2. NAVBAR
  ----------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navBurger = document.getElementById('navBurger');
  const navMenu = document.getElementById('navMenu');

  const handleScrollNavbar = () => {
    if (!navbar) return;

    if (window.scrollY > 24) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };

  handleScrollNavbar();
  window.addEventListener('scroll', handleScrollNavbar);

  if (navBurger && navMenu) {
    navBurger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navBurger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navBurger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* -----------------------------------------------------------------
     3. SCROLL REVEAL
  ----------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const delay = el.getAttribute('data-reveal-delay');

          if (delay) {
            el.style.transitionDelay = `${delay}ms`;
          }

          el.classList.add('is-visible');
          revealObserver.unobserve(el);
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

    /* -----------------------------------------------------------------
     4. AVALIAÇÕES GOOGLE — slider com dots, autoplay e touch/swipe
  ----------------------------------------------------------------- */
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const testimonialsDots = document.getElementById('testimonialsDots');

  if (testimonialsTrack && testimonialsDots) {
    const cards = Array.from(testimonialsTrack.querySelectorAll('.testimonial-card'));
    let activeIndex = 0;
    let autoplayTimer = null;
    let startX = 0;
    let isDragging = false;

    const goToReview = (index) => {
      if (!cards.length) return;

      activeIndex = (index + cards.length) % cards.length;

      cards.forEach((card) => {
        card.style.transform = `translateX(-${activeIndex * 100}%)`;
      });

      const dots = Array.from(testimonialsDots.querySelectorAll('button'));

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;

        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
        dot.setAttribute('tabindex', isActive ? '0' : '-1');
      });
    };

    const startAutoplay = () => {
      window.clearInterval(autoplayTimer);

      if (cards.length <= 1) return;

      autoplayTimer = window.setInterval(() => {
        goToReview(activeIndex + 1);
      }, 7000);
    };

    const stopAutoplay = () => {
      window.clearInterval(autoplayTimer);
    };

    // Suporte a Touch / Swipe
    testimonialsTrack.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      stopAutoplay();
    }, { passive: true });

    testimonialsTrack.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          goToReview(activeIndex + 1);
        } else {
          goToReview(activeIndex - 1);
        }
      }

      isDragging = false;
      startAutoplay();
    }, { passive: true });

    testimonialsDots.innerHTML = '';

    cards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ver avaliação ${index + 1}`);
      dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      dot.setAttribute('tabindex', index === 0 ? '0' : '-1');

      dot.addEventListener('click', () => {
        goToReview(index);
        startAutoplay();
      });

      testimonialsDots.appendChild(dot);
    });

    testimonialsTrack.addEventListener('mouseenter', stopAutoplay);
    testimonialsTrack.addEventListener('mouseleave', startAutoplay);

    goToReview(0);
    startAutoplay();
  }

  /* -----------------------------------------------------------------
     5. FAQ / ACCORDION
  ----------------------------------------------------------------- */
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      accordionItems.forEach((otherItem) => {
        const otherTrigger = otherItem.querySelector('.accordion__trigger');
        const otherPanel = otherItem.querySelector('.accordion__panel');

        if (!otherTrigger || !otherPanel) return;

        otherTrigger.setAttribute('aria-expanded', 'false');
        otherPanel.style.maxHeight = null;
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });

  /* -----------------------------------------------------------------
     6. FORMULÁRIO DE CONTATO
  ----------------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const validators = {
    respNome: (v) => v.trim().length >= 3 || 'Informe o nome completo do responsável.',
    respTelefone: (v) => /[\d\s()+-]{10,}$/.test(v.trim()) || 'Informe um telefone válido.',
    respWhatsapp: (v) =>
      v.trim() === '' ||
      /[\d\s()+-]{10,}$/.test(v.trim()) ||
      'Informe um WhatsApp válido ou deixe em branco.',
    respEmail: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ||
      'Informe um e-mail válido.',
    criancaNome: (v) => v.trim().length >= 2 || 'Informe o nome da criança.',
    criancaIdade: (v) =>
      (Number(v) >= 1 && Number(v) <= 18) ||
      'Informe uma idade entre 1 e 18 anos.',
    motivo: (v) => v.trim() !== '' || 'Selecione o motivo da busca.',
  };

  const getField = (fieldName) => form?.querySelector(`[name="${fieldName}"]`);

  const showFieldError = (fieldName, message) => {
    const field = getField(fieldName);
    const errorEl = document.getElementById(`err-${fieldName}`);

    if (field) {
      field.closest('.form-field')?.classList.add('has-error');
    }

    if (errorEl) {
      errorEl.textContent = message;
    }
  };

  const clearFieldError = (fieldName) => {
    const field = getField(fieldName);
    const errorEl = document.getElementById(`err-${fieldName}`);

    if (field) {
      field.closest('.form-field')?.classList.remove('has-error');
    }

    if (errorEl) {
      errorEl.textContent = '';
    }
  };

  const validateField = (fieldName) => {
    const field = getField(fieldName);

    if (!field || !validators[fieldName]) return true;

    const result = validators[fieldName](field.value);

    if (result === true) {
      clearFieldError(fieldName);
      return true;
    }

    showFieldError(fieldName, result);
    return false;
  };

  const maskPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  ['respTelefone', 'respWhatsapp'].forEach((fieldName) => {
    const field = getField(fieldName);

    if (!field) return;

    field.addEventListener('input', (e) => {
      e.target.value = maskPhone(e.target.value);
    });
  });

  Object.keys(validators).forEach((fieldName) => {
    const field = getField(fieldName);

    if (!field) return;

    field.addEventListener('blur', () => validateField(fieldName));

    field.addEventListener('input', () => {
      if (field.closest('.form-field')?.classList.contains('has-error')) {
        validateField(fieldName);
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isValid = Object.keys(validators).every((fieldName) => validateField(fieldName));

      if (!isValid) return;

      if (formSuccess) {
        formSuccess.textContent =
          'Mensagem registrada. Para agilizar o atendimento, você também pode chamar pelo WhatsApp.';
      }

      const whatsappMessage = encodeURIComponent(
        'Olá, Juliana! Gostaria de solicitar uma avaliação psicopedagógica.'
      );

      window.open(`https://wa.me/5521964038012?text=${whatsappMessage}`, '_blank', 'noopener');
    });
  }
  
    function abrir99Seguro(event) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    event.preventDefault();
    
    // Coordenadas e parâmetros completos da 99
    const dropoffLat = "-22.7885";
    const dropoffLng = "-43.3050";
    const dropoffTitle = encodeURIComponent("Juliana Medina Neuropsicopedagoga");

    // Tenta o esquema direto para abrir o app
    const appUrl = `taxis99://call?dropoff_latitude=${dropoffLat}&dropoff_longitude=${dropoffLng}&dropoff_title=${dropoffTitle}`;
    
    // Dispara a tentativa de abertura
    window.location.href = appUrl;

    // Fallback limpo: se o app não abrir em 2 segundos, direciona para a página oficial
    const timeOut = setTimeout(() => {
      window.location.href = "https://99app.com/passageiro/";
    }, 2000);

    // Cancela o timeout caso a página perca o foco (sinal de que o app 99 abriu com sucesso)
    window.addEventListener('pagehide', () => clearTimeout(timeOut), { once: true });
    window.addEventListener('blur', () => clearTimeout(timeOut), { once: true });
  }
}

  /*----------------------------------------------------------------- 
     7. ANO DINÂMICO NO RODAPÉ
  ----------------------------------------------------------------- */
  const footerYear = document.getElementById('footerYear');

  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});