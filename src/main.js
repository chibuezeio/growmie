const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

const PLAY_URL = "https://play.google.com/store/apps/details?id=com.growmie.app";
const APPLE_URL = "https://apps.apple.com/us/app/growmie/id6746710801";

const paths = {
  learner: [
    ["01", "Download and set up", "Create a learner account and tell Growmie what you want to learn."],
    ["02", "Browse live classes", "Explore sessions across design, cooking, business, languages, and more."],
    ["03", "Enroll and join live", "Pay securely, show up on time, and learn in a real interactive room."],
    ["04", "Keep growing", "Build skills with instructors around the world — not just recordings."],
  ],
  creator: [
    ["01", "Become a creator", "Set up your profile, add your expertise, and open your classroom."],
    ["02", "Publish your class", "Create the content, set your fee, and schedule live sessions."],
    ["03", "Teach in real time", "Host interactive classes and keep students engaged as you go."],
    ["04", "Get paid in 24 hours", "Keep 70% of every sale. Payouts land after a class is completed."],
  ],
};

function renderPath(role) {
  const list = document.querySelector("[data-path-list]");
  if (!list) return;
  list.innerHTML = paths[role]
    .map(
      ([n, title, copy]) => `
      <article class="path-item">
        <span class="path-n">${n}</span>
        <div>
          <strong>${title}</strong>
          <p>${copy}</p>
        </div>
      </article>`
    )
    .join("");
}

function initNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  const drawer = document.querySelector(".drawer");
  if (!nav) return;

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const close = () => {
    drawer?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", () => {
    const open = !drawer.classList.contains("is-open");
    drawer.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  drawer?.addEventListener("click", (event) => {
    if (event.target === drawer || event.target.closest("a")) close();
  });
}

function initPaths() {
  const buttons = document.querySelectorAll("[data-path]");
  if (!buttons.length) return;
  renderPath("learner");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const role = button.dataset.path;
      buttons.forEach((b) => {
        const on = b === button;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      renderPath(role);
    });
  });
}

function initMotion() {
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".hero-copy, .hero-stage", {
      y: 18,
      duration: 0.75,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "transform",
    });
  });

  mm.add("(max-width: 960px) and (prefers-reduced-motion: no-preference)", () => {
    const section = document.querySelector(".screens");
    const row = document.querySelector(".screen-row");
    if (!section || !row) return;

    const navH =
      getComputedStyle(document.documentElement).getPropertyValue("--nav-h").trim() ||
      "72px";

    const travel = () => {
      const stage = section.querySelector(".wrap");
      const visible = stage ? stage.clientWidth : window.innerWidth;
      return Math.max(0, row.scrollWidth - visible);
    };

    gsap.to(row, {
      x: () => -travel(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: () => `top ${navH}`,
        end: () => `+=${travel() + window.innerHeight * 0.55}`,
        pin: true,
        scrub: 0.65,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    row.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });
  });
}

document.querySelectorAll("[data-store='android']").forEach((el) => {
  el.href = PLAY_URL;
});
document.querySelectorAll("[data-store='ios']").forEach((el) => {
  el.href = APPLE_URL;
});

initNav();
initPaths();
initMotion();
