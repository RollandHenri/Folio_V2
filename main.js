/* =========================================================================
   Portfolio Main Script
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
  } catch (e) {}
}

/* =========================================================================
   Navigation Mobile
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
   Fond Animé : Constellation
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
   Écran de Dévoilement et Cinématique Bento
   ========================================================================= */
const ANIMATIONS_DONE_KEY = "folioAnimationsDone";
const HERO_INTRO_CONFIG = {
  LOADER_PAUSE_BEFORE_INTRO: 800, // Réduit pour enchaîner instantanément
};

function releaseScrollLock() {
  document.documentElement.classList.remove("is-animating");
  document.body.classList.remove("is-animating");
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

  const bentoController = (() => {
    const bentoIntro = document.getElementById("bentoIntro");
    const bentoGrid = document.getElementById("bentoGrid");
    const scrollIndicator = document.getElementById("scrollIndicator");
    const centralFrame = document.getElementById("centralFrame");

    let currentProgress = 1;
    let targetProgress = 1;
    let isActive = false;
    let targetScale = 2.6;
    let rafId = null;
    const LERP_FACTOR = 0.08;
    const SCROLL_SENSITIVITY = 0.0009;

    const recalcScale = () => {
      if (!centralFrame || !bentoGrid) return;
      const prevTransform = bentoGrid.style.transform;
      bentoGrid.style.transform = "scale(1)";
      bentoGrid.style.transformOrigin = "center center";

      const gridRect = bentoGrid.getBoundingClientRect();
      const frameRect = centralFrame.getBoundingClientRect();

      bentoGrid.style.transform = prevTransform;

      if (
        gridRect.width > 0 &&
        gridRect.height > 0 &&
        frameRect.width > 0 &&
        frameRect.height > 0
      ) {
        const scaleX = window.innerWidth / frameRect.width;
        const scaleY = window.innerHeight / frameRect.height;
        targetScale = Math.max(scaleX, scaleY);

        const originX =
          ((frameRect.left + frameRect.width / 2 - gridRect.left) /
            gridRect.width) *
          100;
        const originY =
          ((frameRect.top + frameRect.height / 2 - gridRect.top) /
            gridRect.height) *
          100;
        bentoGrid.style.transformOrigin = `${originX}% ${originY}%`;
      }
    };

    const populateImages = () => {
      const cards = document.querySelectorAll(".card");
      const imgs = document.querySelectorAll(".bento-img");
      cards.forEach((card, index) => {
        const cardImg = card.querySelector(".card__img img");
        if (imgs[index] && cardImg && !imgs[index].src) {
          imgs[index].src = cardImg.getAttribute("src");
        }
      });
    };

    const render = () => {
      if (!bentoIntro || !bentoGrid) return;

      currentProgress += (targetProgress - currentProgress) * LERP_FACTOR;

      if (Math.abs(targetProgress - currentProgress) < 0.0001) {
        currentProgress = targetProgress;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        rafId = requestAnimationFrame(render);
      }

      if (scrollIndicator) {
        scrollIndicator.style.opacity = Math.max(0, 1 - currentProgress * 1.5);
      }

      const zoomProgress = Math.min(currentProgress / 0.82, 1);
      const easedZoom = Math.pow(zoomProgress, 1.8);
      const gridScale = 1 + easedZoom * (targetScale - 1);

      // Applique le zoom de la grille bento
      bentoGrid.style.transform = `scale(${gridScale})`;

      // Dès que le bento atteint 100% de sa course
      if (currentProgress >= 0.85) {
        isActive = false;
        bentoIntro.style.opacity = "0";
        bentoIntro.style.visibility = "hidden";
        bentoIntro.style.pointerEvents = "none";
        bentoIntro.classList.remove("is-visible");

        document.body.classList.remove("is-bento-intro");
        document.body.classList.add("is-loaded"); // <--- Déclenche le fondu CSS du héro instantanément ici
        releaseScrollLock();
      } else {
        isActive = true;
        bentoIntro.style.visibility = "visible";
        bentoIntro.style.pointerEvents = "auto";
        bentoIntro.classList.add("is-visible");

        if (currentProgress > 0.82) {
          // Disparition en douceur de la grille bento en fin de zoom
          const fadeProgress = (currentProgress - 0.82) / 0.18;
          bentoIntro.style.opacity = String(1 - fadeProgress);
        } else {
          bentoIntro.style.opacity = "1";
          document.body.classList.add("is-bento-intro");
          document.body.classList.remove("is-loaded");
        }
      }
    };

    const startLoop = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    };

    const openAtStart = () => {
      populateImages();
      currentProgress = 0;
      targetProgress = 0;
      isActive = true;
      window.scrollTo({ top: 0, behavior: "instant" });

      if (bentoIntro) {
        bentoIntro.style.visibility = "visible";
        bentoIntro.style.pointerEvents = "auto";
        bentoIntro.classList.add("is-visible");
      }

      recalcScale();
      startLoop();
    };

    const finishImmediately = () => {
      populateImages();
      currentProgress = 1;
      targetProgress = 1;
      isActive = false;
      render();
    };

    const onWheel = (e) => {
      if (!bentoIntro || !bentoGrid) return;

      if (isActive || currentProgress < 1) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "instant" });

        targetProgress = Math.min(
          1,
          Math.max(0, targetProgress + e.deltaY * SCROLL_SENSITIVITY),
        );
        startLoop();

        if (targetProgress >= 1) {
          notifyDone();
        }
        return;
      }

      if (window.scrollY <= 2 && e.deltaY < 0) {
        e.preventDefault();
        populateImages();
        recalcScale();

        if (targetProgress >= 1) {
          currentProgress = 0.95;
          targetProgress = 0.95;
        }

        targetProgress = Math.max(
          0,
          targetProgress + e.deltaY * SCROLL_SENSITIVITY,
        );
        startLoop();
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;

      if (isActive || currentProgress < 1) {
        e.preventDefault();
        targetProgress = Math.min(
          1,
          Math.max(0, targetProgress + deltaY * (SCROLL_SENSITIVITY * 2.5)),
        );
        startLoop();
        if (targetProgress >= 1) {
          notifyDone();
        }
        return;
      }

      if (window.scrollY <= 2 && deltaY < 0) {
        e.preventDefault();
        populateImages();
        recalcScale();
        if (targetProgress >= 1) {
          currentProgress = 0.95;
          targetProgress = 0.95;
        }
        targetProgress = Math.max(
          0,
          targetProgress + deltaY * (SCROLL_SENSITIVITY * 2.5),
        );
        startLoop();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", () => {
      recalcScale();
      if (isActive) startLoop();
    });

    return {
      openAtStart,
      finishImmediately,
    };
  })();

  const revealFallback = (error) => {
    if (revealed) return;
    revealed = true;
    clearTimeout(failsafeTimer);
    clearInterval(interval);

    try {
      const unveilScreen = document.getElementById("unveil-screen");
      if (unveilScreen) unveilScreen.remove();
      bentoController.finishImmediately();
      notifyDone();
    } catch (e) {}
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
      if (unveilScreen) unveilScreen.remove();
      safeSet(ANIMATIONS_DONE_KEY, "1");
      bentoController.finishImmediately();
      notifyDone();
      return;
    }

    const animationsAlreadyDone = safeGet(ANIMATIONS_DONE_KEY) === "1";
    if (animationsAlreadyDone) {
      const unveilScreen = document.getElementById("unveil-screen");
      if (unveilScreen) unveilScreen.remove();
      bentoController.finishImmediately();
      notifyDone();
      return;
    }

    document.documentElement.classList.add("is-animating");
    document.body.classList.add("is-animating");

    failsafeTimer = setTimeout(releaseScrollLock, 8000);

    const unveilScreen = document.getElementById("unveil-screen");
    const unveilCounter = document.getElementById("unveil-counter");
    const unveilFill = document.getElementById("unveil-fill");

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

      if (unveilScreen) {
        unveilScreen.classList.add("is-fading");

        // Déclenchement instantané du bento dès que le loader commence son fondu
        bentoController.openAtStart();

        setTimeout(() => {
          if (unveilScreen) unveilScreen.remove();
          safeSet(ANIMATIONS_DONE_KEY, "1");
        }, 500);
        return;
      }

      bentoController.openAtStart();
    };
  } catch (error) {
    revealFallback(error);
  }
}

/* =========================================================================
   Initialisation Principale de la Page
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo({ top: 0, behavior: "instant" });

  initIntro();

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

      const firstRect = card.getBoundingClientRect();

      if (dataNode) {
        modalTitle.textContent = dataNode.dataset.title || "";
        const cardImg = card.querySelector(".card__img");
        const cardImgEl = cardImg ? cardImg.querySelector("img") : null;
        const imgSrc = cardImgEl ? cardImgEl.currentSrc || cardImgEl.src : "";

        if (imgSrc) {
          modalImage.style.backgroundImage = `url("${imgSrc}")`;
          modalImage.style.backgroundColor = "";
        } else {
          modalImage.style.backgroundImage = "";
          modalImage.style.backgroundColor = cardImg
            ? getComputedStyle(cardImg).backgroundColor
            : "";
        }
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

      const wrapperRect = document
        .querySelector(".projects-wrapper")
        .getBoundingClientRect();
      const targetWidth = Math.min(wrapperRect.width * 0.85, 900);
      const targetHeight = targetWidth * 0.9;
      const targetTop = Math.max(20, (wrapperRect.height - targetHeight) / 2);
      const targetLeft = (wrapperRect.width - targetWidth) / 2;

      expandedCard.style.width = `${targetWidth}px`;
      expandedCard.style.height = `${targetHeight}px`;

      const cardXInWrapper = firstRect.left - wrapperRect.left;
      const cardYInWrapper = firstRect.top - wrapperRect.top;
      const scaleX = firstRect.width / targetWidth;
      const scaleY = firstRect.height / targetHeight;
      const translateX = cardXInWrapper - targetLeft;
      const translateY = cardYInWrapper - targetTop;

      flipState = { translateX, translateY, scaleX, scaleY };

      // Rendre le modal et son contenu visibles AVANT l'animation,
      // surtout à la toute première ouverture (sinon le modal reste blanc pendant le déploiement)
      expandedCard.style.opacity = "1";
      expandedCard.style.visibility = "visible";

      const expandedContent = expandedCard.querySelector(".expanded-content");
      if (expandedContent) {
        expandedContent.style.opacity = "1";
        expandedContent.style.transition = "none";
      }

      expandedCard.style.transition = "none";
      expandedCard.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`;
      expandedCard.style.top = `${targetTop}px`;
      expandedCard.style.left = `${targetLeft}px`;
      expandedCard.style.borderRadius = `${12 / scaleX}px`;

      card.classList.add("ghost");
      modalOverlay.classList.add("active");
      expandedCard.classList.add("active");

      expandedCard.offsetHeight;

      // Restaure la transition fluide sur le contenu pour l'animation qui suit
      if (expandedContent) {
        expandedContent.style.transition = "";
      }

      expandedCard.style.transition =
        "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), border-radius 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
      expandedCard.style.transform = "translate3d(0, 0, 0) scale(1, 1)";
      expandedCard.style.borderRadius = "16px";

      handleDocClick = (e) => {
        if (!expandedCard.contains(e.target)) {
          closeModal();
        }
      };
      document.addEventListener("click", handleDocClick);

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

  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  initNav();
  initConstellation();

  const langBtns = document.querySelectorAll(".lang-btn");
  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      langBtns.forEach((b) => b.classList.remove("lang-btn--active"));
      btn.classList.add("lang-btn--active");
    });
  });
});
