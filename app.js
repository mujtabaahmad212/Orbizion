/* Orbizion - High Performance Controller (Nov 2026) */

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initHeroVideo();
  initScrollExpandShowcase();
  initLucideIcons();
  initServiceModal();
  initPricingToggle();
  initFAQAccordion();
  initCounterStats();
});

/* -------------------------------------------------------------
 * 1. Lucide Icons Initializer
 * ------------------------------------------------------------- */
function initLucideIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* -------------------------------------------------------------
 * 2. Navigation Scroll & Mobile Menu Toggle
 * ------------------------------------------------------------- */
function initNavScroll() {
  const nav = document.querySelector('.top-glass-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const drawerOverlay = document.getElementById('drawer-overlay');

  if (mobileBtn && mobileMenu && drawerOverlay) {
    let isMenuOpen = false;

    const closeMenu = () => {
      isMenuOpen = false;
      mobileMenu.classList.add('translate-y-full', 'pointer-events-none');
      drawerOverlay.style.opacity = '0';
      drawerOverlay.classList.add('pointer-events-none');
    };

    const openMenu = () => {
      isMenuOpen = true;
      drawerOverlay.classList.remove('pointer-events-none');
      mobileMenu.classList.remove('pointer-events-none', 'translate-y-full');
      drawerOverlay.style.opacity = '1';
    };

    mobileBtn.addEventListener('click', () => {
      if (isMenuOpen) closeMenu();
      else openMenu();
    });

    drawerOverlay.addEventListener('click', closeMenu);

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }
}

/* -------------------------------------------------------------
 * 3. Hero Video Autoplay Assurance
 * ------------------------------------------------------------- */
function initHeroVideo() {
  const video = document.getElementById('hero-scroll-video');
  if (!video) return;

  video.muted = true;
  video.playsInline = true;
  video.loop = true;

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
}

/* -------------------------------------------------------------
 * 4. Pinned ScrollExpand Showcase
 * ------------------------------------------------------------- */
function initScrollExpandShowcase() {
  const section = document.getElementById('showcase');
  if (!section) return;

  const frame = section.querySelector('.scroll-expand__frame');
  const media = section.querySelector('.scroll-expand__media');
  const overlay = section.querySelector('.scroll-expand__overlay');
  const title = section.querySelector('.scroll-expand__title');
  const hint = section.querySelector('.scroll-expand__hint');
  const scrim = section.querySelector('.scroll-expand__scrim');

  if (!frame || !media) return;

  // Make sure video is playing
  if (media.tagName === 'VIDEO') {
    media.muted = true;
    media.playsInline = true;
    media.loop = true;
    const p = media.play();
    if (p !== undefined) p.catch(() => {});
  }

  let ticking = false;

  function update() {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;

    // Total scrollable distance while sticky
    const totalDist = sectionHeight - windowHeight;
    if (totalDist <= 0) return;

    // Progress 0 when section enters sticky point (rect.top <= 0)
    // Progress 1 when fully scrolled through totalDist
    const scrolled = -rect.top;
    let progress = scrolled / totalDist;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // Expand: start at 48vw x 56vh with 24px border-radius
    // Smoothly reach 100vw x 100vh with 0px radius at progress = 1
    const startW = 48; // vw
    const startH = 56; // vh
    const startR = 24; // px

    const currentW = startW + (100 - startW) * progress;
    const currentH = startH + (100 - startH) * progress;
    const currentR = startR * (1 - progress);

    frame.style.width = `${currentW}vw`;
    frame.style.height = `${currentH}vh`;
    frame.style.borderRadius = `${currentR}px`;

    // Slight scale zoom on media
    const mediaScale = 1.2 - 0.2 * progress;
    media.style.transform = `scale(${mediaScale})`;

    // Title fades out as media expands (fades out by 35% progress)
    if (title) {
      const titleProgress = Math.min(progress / 0.35, 1);
      const titleOpacity = 1 - titleProgress;
      const titleScale = 1 + titleProgress * 0.15;
      title.style.opacity = titleOpacity.toFixed(3);
      title.style.transform = `scale(${titleScale.toFixed(3)})`;
      title.style.pointerEvents = titleOpacity < 0.05 ? 'none' : 'auto';
    }

    // Hint fades out early (by 20% progress)
    if (hint) {
      const hintProgress = Math.min(progress / 0.2, 1);
      hint.style.opacity = (1 - hintProgress).toFixed(3);
    }

    // Content Overlay fades in smoothly from 50% to 100%
    if (overlay) {
      if (progress < 0.45) {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        overlay.style.transform = 'translateY(24px)';
      } else {
        const overlayProgress = (progress - 0.45) / 0.55;
        overlay.style.opacity = overlayProgress.toFixed(3);
        overlay.style.pointerEvents = overlayProgress > 0.75 ? 'auto' : 'none';
        overlay.style.transform = `translateY(${((1 - overlayProgress) * 24).toFixed(1)}px)`;
      }
    }

    if (scrim) {
      const scrimOpacity = 0.35 + 0.55 * progress;
      scrim.style.opacity = scrimOpacity.toFixed(3);
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* -------------------------------------------------------------
 * 5. Pricing Matrix Toggle Switch (Monthly / Annual)
 * ------------------------------------------------------------- */
function initPricingToggle() {
  const billingToggle = document.getElementById('billing-toggle');
  const priceElements = document.querySelectorAll('.price-val');
  const periodElements = document.querySelectorAll('.price-period');

  if (!billingToggle) return;

  billingToggle.addEventListener('change', () => {
    const isAnnual = billingToggle.checked;

    priceElements.forEach((el) => {
      const monthly = el.getAttribute('data-monthly');
      const annual = el.getAttribute('data-annual');
      el.textContent = isAnnual ? annual : monthly;
    });

    periodElements.forEach((el) => {
      el.textContent = isAnnual ? '/year' : '/month';
    });
  });
}

/* -------------------------------------------------------------
 * 6. FAQ Accordion
 * ------------------------------------------------------------- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (header && content) {
      header.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close all others
        faqItems.forEach((other) => {
          const otherContent = other.querySelector('.faq-content');
          const otherIcon = other.querySelector('.faq-icon');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        });

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });
}

/* -------------------------------------------------------------
 * 7. Real-time Animated Counter Stats
 * ------------------------------------------------------------- */
function initCounterStats() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endVal = parseFloat(target.getAttribute('data-target'));
          const decimals = parseInt(target.getAttribute('data-decimals') || '0', 10);
          const prefix = target.getAttribute('data-prefix') || '';
          const suffix = target.getAttribute('data-suffix') || '';

          const duration = 1600;
          const startTime = performance.now();

          function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentVal = endVal * eased;
            target.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              target.textContent = `${prefix}${endVal.toFixed(decimals)}${suffix}`;
            }
          }

          requestAnimationFrame(step);
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* -------------------------------------------------------------
 * 8. Service Communication Modal
 * ------------------------------------------------------------- */
function initServiceModal() {
  const modalOverlay = document.getElementById('service-modal-overlay');
  const modalCard = document.getElementById('service-modal-card');
  const modalTitle = document.getElementById('service-modal-title');
  const closeBtn = document.getElementById('close-service-modal');
  const waBtn = document.getElementById('service-modal-wa');
  const emailBtn = document.getElementById('service-modal-email');
  const callBtn = document.getElementById('service-modal-call');

  if (!modalOverlay || !modalCard) return;

  const openModal = (serviceName) => {
    const cleanServiceName = serviceName || 'Digital Services';
    if (modalTitle) modalTitle.textContent = cleanServiceName;

    const encodedText = encodeURIComponent(`Hello Orbizion, I am interested in your ${cleanServiceName} services.`);
    const encodedSubject = encodeURIComponent(`Inquiry about ${cleanServiceName}`);
    const encodedBody = encodeURIComponent(`Hello Orbizion Team,\n\nI would like to get more information about your ${cleanServiceName} services.`);

    if (waBtn) waBtn.href = `https://wa.me/923303785185?text=${encodedText}`;
    if (emailBtn) emailBtn.href = `mailto:orbizion.contact@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;
    if (callBtn) callBtn.href = `tel:+923303785185`;

    modalOverlay.classList.remove('pointer-events-none');
    modalOverlay.style.opacity = '1';
    modalCard.style.transform = 'scale(1)';
  };

  const closeModal = () => {
    modalOverlay.style.opacity = '0';
    modalCard.style.transform = 'scale(0.95)';
    modalOverlay.classList.add('pointer-events-none');
  };

  const serviceSection = document.getElementById('services');
  if (serviceSection) {
    serviceSection.addEventListener('click', (e) => {
      if (e.target.closest('a') && e.target.closest('.pt-4')) return;

      const card = e.target.closest('.bento-card, .glass-panel');
      if (card) {
        const titleEl = card.querySelector('h3');
        const serviceName = titleEl ? titleEl.textContent.trim() : 'Digital Services';
        openModal(serviceName);
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}
