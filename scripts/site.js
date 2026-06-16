(() => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const siteNav = document.querySelector("[data-site-nav]");

  navToggle?.addEventListener("click", () => {
    siteNav?.classList.toggle("open");
  });

  siteNav?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      siteNav.querySelectorAll("a").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      item?.classList.toggle("open");
    });
  });

  document.querySelectorAll("[data-feedback-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const buttonText = form.querySelector("button span");
      form.reset();
      if (!buttonText) return;
      const originalText = buttonText.textContent;
      buttonText.textContent = "Mensagem enviada";
      window.setTimeout(() => {
        buttonText.textContent = originalText;
      }, 1800);
    });
  });

  document.querySelectorAll(".tilt-card, .service-card, .impact-card, .impact-photo-card, .associate-pass").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
      card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  function initScrollTriggers() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = [
      ...document.querySelectorAll([
        ".page-hero > *",
        ".section",
        ".intro-copy",
        ".stats-row > div",
        ".word-carousel-band",
        ".section-head",
        ".carousel",
        ".feature-band > *",
        ".impact-panel .section-head",
        ".impact-photo-card",
        ".impact-card",
        ".leadership-panel .section-head",
        ".leader-badge",
        ".associate-cta",
        ".associate-benefits span",
        ".service-card",
        ".process-panel",
        ".process-steps > div",
        ".faq-item",
        ".contact-card",
        ".associate-pass",
        ".site-footer",
      ].join(",")),
    ];

    const uniqueItems = [...new Set(revealItems)];
    uniqueItems.forEach((item, index) => {
      item.classList.add("scroll-reveal");
      item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);

      if (item.matches(".intro-copy, .feature-band > :first-child, .contact-card, .leader-badge:first-child")) {
        item.classList.add("from-left");
      }

      if (item.matches(".stats-row, .feature-band > :last-child, .associate-pass, .leader-badge:nth-child(2)")) {
        item.classList.add("from-right");
      }
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      uniqueItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.12,
    });

    uniqueItems.forEach((item) => observer.observe(item));
  }

  function initScrollSpy() {
    const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (navLinks.length === 0 || sections.length === 0) return;

    function setActive(id) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }

    let ticking = false;

    function updateActiveSection() {
      const marker = window.scrollY + 140;
      const current = sections.reduce((active, section) => {
        return section.offsetTop <= marker ? section : active;
      }, sections[0]);

      if (current?.id) setActive(current.id);
      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveSection);
    }, { passive: true });

    updateActiveSection();
  }

  function initBadgeScrollSway() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const badges = [...document.querySelectorAll(".leader-badge")];
    if (reduceMotion || badges.length === 0) return;

    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let impulse = 0;
    let angle = 0;
    let velocity = 0;

    window.addEventListener("scroll", () => {
      const now = performance.now();
      const delta = window.scrollY - lastScrollY;
      const elapsed = Math.max(16, now - lastTime);
      const scrollVelocity = delta / elapsed;

      impulse += Math.max(-8, Math.min(8, scrollVelocity * 48));
      lastScrollY = window.scrollY;
      lastTime = now;
    }, { passive: true });

    function tick() {
      velocity += impulse * 0.09;
      impulse *= 0.7;

      const pullBack = angle * -0.04;
      velocity += pullBack;
      velocity *= 0.945;
      angle += velocity;
      angle = Math.max(-19, Math.min(19, angle));

      const now = performance.now();
      const idle = Math.sin(now / 1600) * 0.58 + Math.sin(now / 860) * 0.22;

      badges.forEach((badge, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const isHovering = badge.matches(":hover");
        const swayZ = isHovering ? 0 : (angle * direction + idle * direction);
        const swayX = isHovering ? 0 : (Math.abs(angle) * 0.46 + Math.abs(idle) * 0.78);
        const swayY = isHovering ? 0 : (angle * -0.42 * direction);

        badge.style.setProperty("--badge-sway-z", `${swayZ.toFixed(3)}deg`);
        badge.style.setProperty("--badge-sway-x", `${swayX.toFixed(3)}deg`);
        badge.style.setProperty("--badge-sway-y", `${swayY.toFixed(3)}deg`);
      });

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function initCarousel() {
    const carousel = document.querySelector("[data-carousel]");
    if (!carousel) return;

    const slides = [...carousel.querySelectorAll(".carousel-slide")];
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    let active = 0;
    let timer = null;

    const dots = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Ir para imagem ${index + 1}`);
      dot.addEventListener("click", () => show(index, true));
      dotsWrap?.appendChild(dot);
      return dot;
    });

    function show(index, manual = false) {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === active));
      dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === active));
      if (manual) restart();
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(() => show(active + 1), 5200);
    }

    prev?.addEventListener("click", () => show(active - 1, true));
    next?.addEventListener("click", () => show(active + 1, true));
    show(0);
    restart();
  }

  function initSiteParticles() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.className = "site-particles";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      const count = Math.min(80, Math.max(34, Math.floor(window.innerWidth / 18)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: (Math.random() * 2.4 + 0.8) * window.devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.18 * window.devicePixelRatio,
        vy: (Math.random() * 0.22 + 0.06) * window.devicePixelRatio,
        hue: Math.random() > 0.55 ? "45, 123, 255" : "241, 124, 32",
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > height + 20) p.y = -20;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.hue}, 0.36)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();
    frame();
  }

  function initHeroCanvas() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.querySelector("[data-hero-canvas]");
    const hero = canvas?.closest(".hero");
    const ctx = canvas?.getContext("2d");
    if (!canvas || !hero || !ctx) return;

    let width = 0;
    let height = 0;
    let points = [];
    const pointer = { x: 0, y: 0, active: false };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      height = canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const count = Math.min(34, Math.max(18, Math.floor(rect.width / 46)));
      points = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        ox: Math.random() * width,
        oy: Math.random() * height,
        r: (index % 3 === 0 ? 2.6 : 1.7) * ratio,
        phase: Math.random() * Math.PI * 2,
        hue: index % 2 === 0 ? "255, 180, 87" : "78, 145, 255",
      }));
    }

    hero.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      pointer.x = (event.clientX - rect.left) * ratio;
      pointer.y = (event.clientY - rect.top) * ratio;
      pointer.active = true;
    }, { passive: true });

    hero.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    function frame(time) {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = Math.max(1, window.devicePixelRatio || 1);

      points.forEach((point) => {
        const driftX = Math.cos(time / 1400 + point.phase) * 18;
        const driftY = Math.sin(time / 1700 + point.phase) * 14;
        let targetX = point.ox + driftX;
        let targetY = point.oy + driftY;

        if (pointer.active) {
          const dx = pointer.x - point.x;
          const dy = pointer.y - point.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 190 * (window.devicePixelRatio || 1)) {
            const pull = (1 - dist / (190 * (window.devicePixelRatio || 1))) * 24;
            targetX -= (dx / Math.max(dist, 1)) * pull;
            targetY -= (dy / Math.max(dist, 1)) * pull;
          }
        }

        point.x += (targetX - point.x) * 0.035;
        point.y += (targetY - point.y) * 0.035;
      });

      points.forEach((a, index) => {
        points.slice(index + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          const max = 130 * (window.devicePixelRatio || 1);
          if (dist > max) return;
          ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / max) * 0.14})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        });
      });

      if (pointer.active) {
        const pulse = 18 + Math.sin(time / 240) * 3;
        ctx.strokeStyle = "rgba(255, 180, 87, 0.24)";
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, pulse * (window.devicePixelRatio || 1), 0, Math.PI * 2);
        ctx.stroke();
      }

      points.forEach((point) => {
        ctx.fillStyle = `rgba(${point.hue}, 0.58)`;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();
    requestAnimationFrame(frame);
  }

  initScrollTriggers();
  initScrollSpy();
  initBadgeScrollSway();
  initCarousel();
  initSiteParticles();
  initHeroCanvas();
})();
