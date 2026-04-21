import { animate, inView, stagger } from "https://esm.sh/framer-motion@11.0.8";

// ========== MENU MOBILE ==========
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const line3 = document.getElementById("line3");
const mobileLinks = document.querySelectorAll(".mobile-link");

let isMenuOpen = false;

function toggleMenu() {
  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    document.body.style.overflow = "hidden";
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.add("flex");
    line1.style.transform = "translateY(8px) rotate(45deg)";
    line2.style.opacity = "0";
    line3.style.transform = "translateY(-8px) rotate(-45deg)";

    animate(mobileMenu, { opacity: [0, 1] }, { duration: 0.3 });
    animate(
      mobileLinks,
      { y: [20, 0], opacity: [0, 1] },
      { delay: stagger(0.1), duration: 0.4 }
    );
  } else {
    document.body.style.overflow = "";
    line1.style.transform = "none";
    line2.style.opacity = "1";
    line3.style.transform = "none";

    animate(mobileMenu, { opacity: [1, 0] }, { duration: 0.3 }).then(() => {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
    });
  }
}

menuBtn.addEventListener("click", toggleMenu);
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (isMenuOpen) toggleMenu();
  });
});

// ========== HEADER SCROLL EFFECT ==========
window.addEventListener("scroll", () => {
  const header = document.getElementById("navbar");
  if (window.scrollY > 20) {
    header.classList.add("py-2");
    header.classList.remove("py-4");
  } else {
    header.classList.add("py-4");
    header.classList.remove("py-2");
  }
});

// ========== FRAMER MOTION ANIMATIONS ==========

// Hero
animate(
  ".hero-item",
  { opacity: [0, 1], y: [30, 0] },
  { duration: 0.8, delay: stagger(0.2) }
);
animate(
  ".hero-image",
  { opacity: [0, 1], scale: [0.9, 1] },
  { duration: 1, delay: 0.4 }
);

// Serviços
inView(
  ".block-servicos",
  () => {
    animate(
      ".service-card",
      { opacity: [0, 1], y: [40, 0] },
      { delay: stagger(0.15), duration: 0.6 }
    );
  },
  { margin: "-100px" }
);

// Features
inView(
  ".block-features",
  () => {
    animate(
      ".feature-item",
      { opacity: [0, 1], scale: [0.9, 1] },
      { delay: stagger(0.15), duration: 0.5 }
    );
  },
  { margin: "-100px" }
);

// Profissionais
inView(
  ".block-profissionais",
  () => {
    animate(
      ".pro-card",
      { opacity: [0, 1], y: [40, 0] },
      { delay: stagger(0.2), duration: 0.6 }
    );
  },
  { margin: "-100px" }
);

// CTA
inView(
  ".block-cta",
  () => {
    animate(
      ".cta-content",
      { opacity: [0, 1], scale: [0.95, 1], y: [40, 0] },
      { duration: 0.8 }
    );
  },
  { margin: "-100px" }
);

// Footer
inView(
  ".block-footer",
  () => {
    animate(
      ".footer-item",
      { opacity: [0, 1], y: [20, 0] },
      { delay: stagger(0.1), duration: 0.6 }
    );
  },
  { margin: "-50px" }
);
