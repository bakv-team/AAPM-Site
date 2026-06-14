(() => {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const siteNav = document.querySelector("[data-site-nav]");

  navToggle?.addEventListener("click", () => {
    siteNav?.classList.toggle("open");
  });

  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      item?.classList.toggle("open");
    });
  });

  document.querySelectorAll(".tilt-card, .service-card, .associate-pass").forEach((card) => {
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

  initCarousel();
  initSiteParticles();
})();
