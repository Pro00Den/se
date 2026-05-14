/* ============================================================
   JS-triggered reveal animations & interactions
   ============================================================ */

"use strict";

// ── Nav: add .scrolled class on scroll ──────────────────────
const nav = document.getElementById("nav");
window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  },
  { passive: true },
);

// ── Scroll Reveal (IntersectionObserver) ────────────────────
const revealEls = document.querySelectorAll(
  ".reveal-up, .reveal-left, .reveal-right, .reveal-scale",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

revealEls.forEach((el) => revealObserver.observe(el));

// ── Animated counters ────────────────────────────────────────
const statNumbers = document.querySelectorAll(".stat__number[data-target]");

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.round(eased * target).toLocaleString("ru-RU");
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 },
);

statNumbers.forEach((el) => countObserver.observe(el));

// ── Showcase drag-to-scroll ──────────────────────────────────
const scroller = document.getElementById("showcase-scroll");
if (scroller) {
  let isDown = false,
    startX,
    scrollLeft;

  scroller.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - scroller.offsetLeft;
    scrollLeft = scroller.scrollLeft;
    scroller.style.userSelect = "none";
  });
  document.addEventListener("mouseup", () => {
    isDown = false;
    scroller.style.userSelect = "";
  });
  scroller.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    const x = e.pageX - scroller.offsetLeft;
    scroller.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

// ── Burger menu (mobile) ─────────────────────────────────────
const burger = document.getElementById("nav-burger");
const navLinks = document.getElementById("nav-links");
const navElem = document.getElementById("nav");

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    const isActive = navLinks.classList.toggle("is-active");
    burger.classList.toggle("is-active");
    if (navElem) navElem.classList.toggle("is-active");
    burger.setAttribute("aria-expanded", isActive);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-active");
      burger.classList.remove("is-active");
      if (navElem) navElem.classList.remove("is-active");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

// ── FAQ Accordion ────────────────────────────────────────────
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  if (question && answer) {
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("is-active");

      // Close all
      faqItems.forEach((el) => {
        el.classList.remove("is-active");
        el.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("is-active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  }
});

// ── Viewers Counter ──────────────────────────────────────────
function startViewersCounter() {
  const counterEl = document.getElementById("live-viewers-count");
  if (!counterEl) return;

  let currentViewers = 4789;

  function updateCounter() {
    const add = Math.floor(Math.random() * 4) + 1;
    currentViewers += add;
    counterEl.innerText = currentViewers.toLocaleString("ru-RU");
    setTimeout(updateCounter, Math.random() * 2000 + 500);
  }

  setTimeout(updateCounter, 1500);
}

// Start viewer counter
document.addEventListener("DOMContentLoaded", () => {
  startViewersCounter();
});

// ── Ticker Duplication ───────────────────────────────────────
const tickerTrack = document.querySelector(".ticker__track");
const tickerGroup = document.querySelector(".ticker__group");

if (tickerTrack && tickerGroup) {
  const clone = tickerGroup.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  tickerTrack.appendChild(clone);
}
