/* =========================================================================
   1. STOCKAGE DE SESSION SÉCURISÉ (storage.js)
   ========================================================================= */
function safeGet(key) {
  try {
    return sessionStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeSet(key, val) {
  try {
    sessionStorage.setItem(key, val);
  } catch (e) {
    // Échec silencieux si le stockage est désactivé
  }
}

/* =========================================================================
   2. DONNÉES DES PROJETS (projects.js)
   ========================================================================= */
const projectsData = {
  1: {
    title: {
      fr: "Atlas — Plateforme e-commerce",
      en: "Atlas — E-commerce platform",
    },
    desc: {
      fr: "Boutique headless complète : catalogue performant, paiement sécurisé et back-office unifié.",
      en: "Headless storefront: unified catalogue, checkout and back-office.",
    },
    tech: ["React", "Node.js", "Stripe", "PostgreSQL"],
    link: "https://example.com/atlas",
    colors: ["#ff4d00", "#c43500", "#ff6b35"],
    captions: {
      fr: [
        "Aperçu de la boutique headless Atlas",
        "Catalogue et filtres de recherche",
        "Tunnel de paiement sécurisé",
      ],
      en: [
        "Preview of the Atlas headless store",
        "Catalogue and search filters",
        "Secure checkout tunnel",
      ],
    },
    caption: {
      fr: "Aperçu de la boutique headless Atlas",
      en: "Preview of the Atlas headless store",
    },
  },
  2: {
    title: {
      fr: "Pulse — Tableau de bord temps réel",
      en: "Pulse — Real-time dashboard",
    },
    desc: {
      fr: "Suivi d'indicateurs live et graphiques analytiques haute performance dédiés aux équipes ops.",
      en: "Live KPI tracking and high-performance analytics for ops teams.",
    },
    tech: ["Vue", "D3.js", "WebSocket", "Redis"],
    link: "https://example.com/pulse",
    colors: ["#10b981", "#059669", "#34d399"],
    captions: {
      fr: [
        "Tableau de bord Pulse en temps réel",
        "Graphiques analytiques en direct",
        "Vue des alertes ops",
      ],
      en: [
        "The Pulse dashboard in real time",
        "Live analytics charts",
        "Ops alerts view",
      ],
    },
    caption: {
      fr: "Tableau de bord Pulse en temps réel",
      en: "The Pulse dashboard in real time",
    },
  },
  3: {
    title: {
      fr: "Flux — Application collaborative",
      en: "Flux — Collaborative app",
    },
    desc: {
      fr: "Outil de gestion de projet collaboratif en temps réel conçu pour les équipes distribuées.",
      en: "Real-time collaborative project management built for distributed teams.",
    },
    tech: ["React", "Firebase", "TypeScript", "Tailwind"],
    link: "https://example.com/flux",
    colors: ["#3b82f6", "#2563eb", "#60a5fa"],
    captions: {
      fr: [
        "Interface collaborative Flux",
        "Édition en temps réel",
        "Vue équipe distribuée",
      ],
      en: [
        "The Flux collaborative interface",
        "Real-time editing",
        "Distributed team view",
      ],
    },
    caption: {
      fr: "Interface collaborative Flux",
      en: "The Flux collaborative interface",
    },
  },
  4: {
    title: {
      fr: "Nebula — Plateforme de streaming",
      en: "Nebula — Streaming platform",
    },
    desc: {
      fr: "Diffusion vidéo haute définition avec recommandation IA.",
      en: "High-definition video delivery with AI recommendations.",
    },
    tech: ["React", "Node.js", "AWS", "Python"],
    link: "https://example.com/nebula",
    colors: ["#a855f7", "#9333ea", "#c084fc"],
    captions: {
      fr: [
        "Lecteur vidéo Nebula",
        "Catalogue et recommandations",
        "Lecture haute définition",
      ],
      en: [
        "The Nebula video player",
        "Catalogue and recommendations",
        "High-definition playback",
      ],
    },
    caption: { fr: "Lecteur vidéo Nebula", en: "The Nebula video player" },
  },
  5: {
    title: {
      fr: "Orbit — Outil de productivité",
      en: "Orbit — Productivity tool",
    },
    desc: {
      fr: "Organisation de tâches et collaboration en équipe simplifiée.",
      en: "Simplified task management and team collaboration.",
    },
    tech: ["Vue", "Nuxt", "Supabase", "JavaScript"],
    link: "https://example.com/orbit",
    colors: ["#f59e0b", "#d97706", "#fbbf24"],
    captions: {
      fr: [
        "Tableau de bord Orbit",
        "Gestion des tâches",
        "Vue collaboration d'équipe",
      ],
      en: ["The Orbit dashboard", "Task management", "Team collaboration view"],
    },
    caption: { fr: "Tableau de bord Orbit", en: "The Orbit dashboard" },
  },
  6: {
    title: { fr: "Zen — Application bien-être", en: "Zen — Wellness app" },
    desc: {
      fr: "Méditation guidée et suivi du sommeil personnalisé.",
      en: "Guided meditation and personalised sleep tracking.",
    },
    tech: ["React Native", "Expo", "Node.js", "MongoDB"],
    link: "https://example.com/zen",
    colors: ["#14b8a6", "#0d9488", "#5eead4"],
    captions: {
      fr: [
        "Interface Zen bien-être",
        "Sessions de méditation guidée",
        "Suivi du sommeil",
      ],
      en: [
        "The Zen wellness interface",
        "Guided meditation sessions",
        "Sleep tracking",
      ],
    },
    caption: {
      fr: "Interface Zen bien-être",
      en: "The Zen wellness interface",
    },
  },
};

/* =========================================================================
   4. NAVIGATION MOBILE (nav.js)
   ========================================================================= */
function initNav() {
  const toggle = document.querySelector(".nav__toggle");
  const list = document.getElementById("nav-list");

  if (!toggle || !list) return;

  function closeNav() {
    list.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = list.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  list.addEventListener("click", (event) => {
    if (event.target.closest(".nav__link")) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && list.classList.contains("is-open")) {
      closeNav();
    }
  });

  const desktopQuery = window.matchMedia("(min-width: 701px)");
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) closeNav();
  });
}

/* =========================================================================
   5. FOND ANIMÉ : CONSTELLATION (constellation.js)
   ========================================================================= */
function initConstellation() {
  try {
    const canvas = document.getElementById("constellation-bg");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height;
    let stars = [];
    let mouse = { x: -9999, y: -9999 };

    const STAR_COUNT = 56;
    const CONNECT_DIST = 280;
    const CAPTURE_DIST = 60;
    const MAX_CAPTURED = 10;
    const ATTRACTION_SPEED = 0.08;
    const EXPLODE_FORCE = 25;
    const EXPLODE_DAMPING = 0.92;
    const RETURN_SPEED = 0.06;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          baseX: Math.random() * width,
          baseY: Math.random() * height,
          radius: Math.random() * 1.5 + 1.5,
          alpha: Math.random() * 0.4 + 0.4,
          explodeVx: 0,
          explodeVy: 0,
          explodeTimer: 0,
          captured: false,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      const capturedStars = [];
      stars.forEach((star) => {
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CAPTURE_DIST && star.explodeTimer === 0) {
          star.captured = true;
          capturedStars.push(star);
        } else {
          star.captured = false;
        }
      });

      if (capturedStars.length >= MAX_CAPTURED) {
        capturedStars.forEach((star) => {
          const angle = Math.atan2(star.y - mouse.y, star.x - mouse.x);
          star.explodeVx = Math.cos(angle) * EXPLODE_FORCE;
          star.explodeVy = Math.sin(angle) * EXPLODE_FORCE;
          star.explodeTimer = 30;
          star.captured = false;
        });
      }

      stars.forEach((star, i) => {
        if (star.explodeTimer > 0) {
          star.x += star.explodeVx;
          star.y += star.explodeVy;
          star.explodeVx *= EXPLODE_DAMPING;
          star.explodeVy *= EXPLODE_DAMPING;
          star.explodeTimer--;

          const dx = star.baseX - star.x;
          const dy = star.baseY - star.y;
          star.x += dx * RETURN_SPEED;
          star.y += dy * RETURN_SPEED;
        } else if (star.captured) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          star.x += dx * ATTRACTION_SPEED;
          star.y += dy * ATTRACTION_SPEED;
        } else {
          star.x += star.vx;
          star.y += star.vy;

          if (star.x < 0 || star.x > width) star.vx *= -1;
          if (star.y < 0 || star.y > height) star.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 77, 0, ${star.alpha})`;
        ctx.fill();

        if (!star.captured) {
          for (let j = i + 1; j < stars.length; j++) {
            const other = stars[j];
            if (other.captured || other.explodeTimer > 0) continue;

            const ddx = other.x - star.x;
            const ddy = other.y - star.y;
            const d = Math.sqrt(ddx * ddx + ddy * ddy);

            if (d < CONNECT_DIST) {
              const opacity = 1 - d / CONNECT_DIST;
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(255, 77, 0, ${opacity * 0.4})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    let resizeRafId = null;
    window.addEventListener("resize", () => {
      if (resizeRafId !== null) return;
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        resize();
      });
    });

    resize();
    draw();
  } catch (e) {
    console.warn("Constellation désactivée :", e);
  }
}

/* =========================================================================
   6. ÉCRAN DE DÉVOILEMENT ET INTRO HERO (intro.js)
   ========================================================================= */
const ANIMATIONS_DONE_KEY = "folioAnimationsDone";

const HERO_INTRO_CONFIG = {
  LOADER_PAUSE_BEFORE_INTRO: 500,
  EJECT_DISTANCE: 900,
  IMAGE_ZOOM_MAX: 3.5,
  IMAGE_EJECT_DURATION: 1300,
  IMAGE_STAGGER_DELAY: 200,
  H1_ZOOM_START: 0.1,
  H1_ZOOM_MAX: 18.0,
  H1_ZOOM_DURATION: 950,
  BLANK_PAUSE: 150,
  HERO_APPEAR_DELAY: 300,
  HERO_FADE_TO_H1_DROP_DELAY: 400,
  EJECT_ANGLES: [-135, -45, 135, 45, -90, 90],
};

function releaseScrollLock() {
  document.documentElement.classList.remove("is-animating");
  document.body.classList.remove("is-animating");
  window.scrollTo({ top: 0, behavior: "instant" });
}

function initIntro({ onDone } = {}) {
  const done = typeof onDone === "function" ? onDone : () => {};

  let revealed = false;
  let failsafeTimer;
  let interval;

  const notifyDone = () => {
    try {
      done();
    } catch (e) {}
  };

  const revealFallback = (error) => {
    if (revealed) return;
    revealed = true;
    clearTimeout(failsafeTimer);
    clearInterval(interval);
    console.warn(
      "Séquence d'intro interrompue, site révélé en secours :",
      error,
    );

    try {
      const unveilScreen = document.getElementById("unveil-screen");
      const heroIntroOverlay = document.getElementById("hero-intro-overlay");
      if (unveilScreen) unveilScreen.remove();
      if (heroIntroOverlay) heroIntroOverlay.remove();
      document.body.classList.add("is-loaded");
      releaseScrollLock();
    } catch (e) {}

    notifyDone();
  };

  const guarded =
    (fn) =>
    (...args) => {
      try {
        fn(...args);
      } catch (error) {
        revealFallback(error);
      }
    };

  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const unveilScreen = document.getElementById("unveil-screen");
      const heroIntroOverlay = document.getElementById("hero-intro-overlay");
      if (unveilScreen) unveilScreen.remove();
      if (heroIntroOverlay) heroIntroOverlay.remove();
      document.body.classList.add("is-loaded");
      safeSet(ANIMATIONS_DONE_KEY, "1");
      releaseScrollLock();

      document.querySelectorAll(".hero-fade-item").forEach((item) => {
        item.classList.add("is-visible");
      });
      const heroTitle = document.getElementById("hero-title");
      if (heroTitle) {
        heroTitle.classList.remove("is-hidden-initial");
      }

      notifyDone();
      return;
    }

    const animationsAlreadyDone = safeGet(ANIMATIONS_DONE_KEY) === "1";
    if (animationsAlreadyDone) {
      const unveilScreen = document.getElementById("unveil-screen");
      const heroIntroOverlay = document.getElementById("hero-intro-overlay");
      if (unveilScreen) unveilScreen.remove();
      if (heroIntroOverlay) heroIntroOverlay.remove();
      document.body.classList.add("is-loaded");
      releaseScrollLock();

      document.querySelectorAll(".hero-fade-item").forEach((item) => {
        item.classList.add("is-visible");
      });
      const heroTitle = document.getElementById("hero-title");
      if (heroTitle) {
        heroTitle.classList.remove("is-hidden-initial");
      }

      notifyDone();
      return;
    }

    document.documentElement.classList.add("is-animating");
    document.body.classList.add("is-animating");

    failsafeTimer = setTimeout(releaseScrollLock, 8000);

    const unveilScreen = document.getElementById("unveil-screen");
    const unveilCounter = document.getElementById("unveil-counter");
    const unveilFill = document.getElementById("unveil-fill");
    const heroIntroOverlay = document.getElementById("hero-intro-overlay");

    let progress = 0;

    interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 4;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        if (unveilCounter) unveilCounter.textContent = "100";
        if (unveilFill) unveilFill.style.width = "100%";

        setTimeout(
          guarded(completeSequence),
          HERO_INTRO_CONFIG.LOADER_PAUSE_BEFORE_INTRO,
        );
        return;
      }

      if (unveilCounter)
        unveilCounter.textContent = progress.toString().padStart(2, "0");
      if (unveilFill) unveilFill.style.width = `${progress}%`;
    }, 40);

    const completeSequence = () => {
      if (revealed) return;
      revealed = true;
      clearTimeout(failsafeTimer);
      if (unveilScreen) unveilScreen.remove();
      if (heroIntroOverlay) heroIntroOverlay.remove();
      document.body.classList.add("is-loaded");
      releaseScrollLock();
      safeSet(ANIMATIONS_DONE_KEY, "1");

      document.querySelectorAll(".hero-fade-item").forEach((item) => {
        item.classList.add("is-visible");
      });

      const heroTitle = document.getElementById("hero-title");
      if (heroTitle) {
        heroTitle.classList.remove("is-hidden-initial");
      }

      notifyDone();
    };
  } catch (error) {
    revealFallback(error);
  }
}

/* =========================================================================
   7. INITIALISATION PRINCIPALE DE LA PAGE
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo({ top: 0, behavior: "instant" });

  initIntro();

  // --- Gestion des cartes Projets & Animation FLIP Modal ---
  const cardGrid = document.getElementById("cardGrid");
  const cards = document.querySelectorAll(".card");
  const modalOverlay = document.getElementById("modalOverlay");
  const expandedCard = document.getElementById("expandedCard");
  const btnBack = document.getElementById("btnBack");

  const modalTitle = document.getElementById("modalTitle");
  const modalImage = document.getElementById("modalImage");
  const modalDescription = document.getElementById("modalDescription");
  const modalTechs = document.getElementById("modalTechs");
  const btnVisit = document.getElementById("btnVisit");

  let activeCard = null;
  let flipState = null;
  let pendingTimeouts = [];
  let handleDocClick = null;

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      pendingTimeouts.forEach((id) => clearTimeout(id));
      pendingTimeouts = [];

      expandedCard.classList.remove("active", "fading-out");
      modalOverlay.classList.remove("active");
      expandedCard.style.transition = "";
      expandedCard.style.transform = "";
      expandedCard.style.top = "";
      expandedCard.style.left = "";
      expandedCard.style.width = "";
      expandedCard.style.height = "";
      expandedCard.style.borderRadius = "";
      activeCard = null;
      flipState = null;

      activeCard = card;
      const dataNode = card.querySelector(".card-detail-data");

      cardGrid.classList.add("no-hover");

      // FIRST
      const firstRect = card.getBoundingClientRect();

      if (dataNode) {
        modalTitle.textContent = dataNode.dataset.title || "";
        const cardImg = card.querySelector('.card__img');
        const bgColor = cardImg ? getComputedStyle(cardImg).backgroundColor : '';
        modalImage.style.backgroundImage = '';
        modalImage.style.backgroundColor = bgColor;
        modalDescription.textContent = dataNode.dataset.description || "";
        btnVisit.href = dataNode.dataset.url || "#";

        modalTechs.replaceChildren();
        const techArray = (dataNode.dataset.techs || "").split(",");
        techArray.forEach((tech) => {
          if (tech.trim()) {
            const badge = document.createElement("span");
            badge.className = "tech-badge";
            badge.textContent = tech.trim();
            modalTechs.appendChild(badge);
          }
        });
      }

      // LAST
      const wrapperRect = document.querySelector('.projects-wrapper').getBoundingClientRect();
      const targetWidth = Math.min(wrapperRect.width * 0.85, 900);
      const targetHeight = targetWidth * 0.9;
      const targetTop = Math.max(20, (wrapperRect.height - targetHeight) / 2);
      const targetLeft = (wrapperRect.width - targetWidth) / 2;

      expandedCard.style.width = `${targetWidth}px`;
      expandedCard.style.height = `${targetHeight}px`;

      // INVERT : positionner la carte déployée sur la carte cliquée (coordonnées relatives au wrapper)
      const cardXInWrapper = firstRect.left - wrapperRect.left;
      const cardYInWrapper = firstRect.top - wrapperRect.top;
      const scaleX = firstRect.width / targetWidth;
      const scaleY = firstRect.height / targetHeight;
      const translateX = cardXInWrapper - targetLeft;
      const translateY = cardYInWrapper - targetTop;

      flipState = { translateX, translateY, scaleX, scaleY };

      expandedCard.style.transition = "none";
      expandedCard.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`;
      expandedCard.style.top = `${targetTop}px`;
      expandedCard.style.left = `${targetLeft}px`;
      expandedCard.style.borderRadius = `${12 / scaleX}px`;

      card.classList.add("ghost");
      modalOverlay.classList.add("active");
      expandedCard.classList.add("active");
      expandedCard.style.opacity = "1";
      expandedCard.style.visibility = "visible";

      expandedCard.offsetHeight;

      // Fermeture en cliquant n'importe où en dehors de la carte
      handleDocClick = (e) => {
        if (!expandedCard.contains(e.target)) {
          closeModal();
        }
      };
      document.addEventListener("click", handleDocClick);

      // PLAY
      expandedCard.style.transition =
        "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), border-radius 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
      expandedCard.style.transform = "translate3d(0, 0, 0) scale(1, 1)";
      expandedCard.style.borderRadius = "16px";

      cardGrid.classList.add("blurred");
    });
  });

  function closeModal() {
    if (!activeCard || !flipState) return;

    if (handleDocClick) {
      document.removeEventListener("click", handleDocClick);
      handleDocClick = null;
    }

    modalOverlay.classList.remove("active");

    expandedCard.style.opacity = "";
    expandedCard.style.visibility = "";

    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.style.display = "none";

    expandedCard.style.transition =
      "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), border-radius 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
    expandedCard.style.transform = `translate3d(${flipState.translateX}px, ${flipState.translateY}px, 0) scale(${flipState.scaleX}, ${flipState.scaleY})`;
    expandedCard.style.borderRadius = `${12 / flipState.scaleX}px`;

    cardGrid.classList.remove("blurred", "no-hover");

    pendingTimeouts.push(
      setTimeout(() => {
        expandedCard.classList.add("fading-out");
      }, 700),
    );

    pendingTimeouts.push(
      setTimeout(() => {
        document
          .querySelectorAll(".card")
          .forEach((c) => c.classList.remove("ghost"));
      }, 400),
    );

    pendingTimeouts.push(
      setTimeout(() => {
        expandedCard.classList.remove("active", "fading-out");
        activeCard = null;
        flipState = null;
      }, 1500),
    );
  }

  if (btnBack) btnBack.addEventListener("click", closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (!expandedCard.contains(e.target)) {
        closeModal();
      }
    });
  }

  // --- Mettre à jour l'année du footer ---
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // --- Initialisation des modules ---
  initNav();
  initConstellation();

  // --- Sélecteur de langue : indicateur visuel uniquement ---
  const langBtns = document.querySelectorAll(".lang-btn");
  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      langBtns.forEach((b) => b.classList.remove("lang-btn--active"));
      btn.classList.add("lang-btn--active");
    });
  });
});
