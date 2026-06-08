document.addEventListener("DOMContentLoaded", () => {
    if (window.lucide) {
        window.lucide.createIcons();
    }

    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");

    menuToggle?.addEventListener("click", () => {
        const isOpen = nav?.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".main-nav a").forEach((link) => {
        link.addEventListener("click", () => {
            nav?.classList.remove("is-open");
            menuToggle?.setAttribute("aria-expanded", "false");
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    document.querySelectorAll(".reveal").forEach((element) => {
        revealObserver.observe(element);
    });

    const animateCounter = (element) => {
        const target = Number(element.dataset.counter);
        const duration = 1300;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.floor(eased * target);

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                element.textContent = target;
            }
        };

        requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 });

    document.querySelectorAll("[data-counter]").forEach((counter) => {
        counterObserver.observe(counter);
    });

    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.dataset.tab;
            tabButtons.forEach((tab) => tab.classList.toggle("is-active", tab === button));
            tabPanels.forEach((panel) => {
                panel.classList.toggle("is-active", panel.id === target);
            });
        });
    });

    const form = document.querySelector("#joinForm");
    const message = document.querySelector(".form-message");

    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const nome = String(data.get("nome") || "").trim().split(" ")[0];
        message.textContent = `${nome || "Obrigado"}! Seu interesse foi registrado para contato da AAPM.`;
        form.reset();
    });
});
