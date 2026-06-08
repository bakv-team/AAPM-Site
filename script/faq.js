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

    document.querySelectorAll(".faq-question").forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest(".faq-item");
            const isOpen = item?.classList.toggle("is-open");
            button.setAttribute("aria-expanded", String(isOpen));
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
});
