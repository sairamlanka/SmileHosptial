(() => {
  "use strict";

  const SPLASH_MS = 2000;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Splash: show the logo for 2 seconds ---------- */
  const splash = document.getElementById("splash");
  const start = performance.now();
  const hideSplash = () => {
    const wait = Math.max(0, SPLASH_MS - (performance.now() - start));
    setTimeout(() => {
      splash.classList.add("is-done");
      body.classList.remove("is-loading");
      body.classList.add("is-ready");
      setTimeout(() => splash.remove(), 1000);
    }, wait);
  };
  if (document.readyState === "complete") hideSplash();
  else window.addEventListener("load", hideSplash, { once: true });
  // Safety net: never trap the visitor behind the splash.
  setTimeout(() => !body.classList.contains("is-ready") && hideSplash(), SPLASH_MS + 3000);

  /* ---------- Year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Nav ---------- */
  const nav = document.getElementById("nav");
  const navLinks = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    navLinks.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    body.style.overflow = open ? "hidden" : "";
  };
  navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("is-open")));
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // Active link on scroll
  const sectionLinks = [...navLinks.querySelectorAll('a[href^="#"]:not(.btn)')];
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        sectionLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sectionLinks.forEach((l) => {
    const s = document.querySelector(l.getAttribute("href"));
    if (s) spy.observe(s);
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal, .journey").forEach((el) => io.observe(el));

  /* ---------- Counters ---------- */
  const countIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || "";
        const dur = reduceMotion ? 1 : 1600;
        const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

  /* ---------- Tilt + spotlight ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".tilt").forEach((el) => {
      const max = el.classList.contains("hero__card") ? 10 : 7;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateY(-4px)`;
        el.style.setProperty("--mx", x * 100 + "%");
        el.style.setProperty("--my", y * 100 + "%");
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });

    // Magnetic buttons
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });

    // Cursor glow
    const glow = document.querySelector(".cursor-glow");
    let gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener("pointermove", (e) => { gx = e.clientX; gy = e.clientY; }, { passive: true });
    const loop = () => {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Hero particle network ---------- */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, pts = [];
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, (w * h) / 22000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.6 + 0.6,
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
    const draw = () => {
      if (visible) {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(91,155,255,0.7)";
          ctx.fill();
          for (let j = i + 1; j < pts.length; j++) {
            const q = pts[j];
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 130) {
              ctx.strokeStyle = `rgba(56,125,240,${(1 - d / 130) * 0.25})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- Department details modal ---------- */
  const DEPTS = {
    ortho: {
      num: "01 · Department",
      title: "Orthopedics",
      intro: "Complete care for bones, joints, muscles and the spine, from emergency fracture management to planned joint surgery and rehabilitation.",
      conditions: ["Fractures & dislocations", "Knee, hip & shoulder pain", "Arthritis & joint stiffness", "Back & neck pain, slipped disc", "Sports & ligament injuries", "Osteoporosis"],
      services: ["Fracture fixation & plaster care", "Total knee & hip replacement", "Arthroscopic (keyhole) surgery", "Spine care", "Physiotherapy & rehabilitation", "Trauma care, 24/7"],
      book: "Orthopedics",
    },
    medicine: {
      num: "02 · Department",
      title: "General Medicine",
      intro: "Your first stop for diagnosis and long-term management of everyday and chronic illnesses, for adults of every age.",
      conditions: ["Fever, viral & seasonal infections", "Diabetes", "High blood pressure", "Thyroid disorders", "Asthma & breathing problems", "Stomach & digestion issues"],
      services: ["OPD consultations", "Health check-up packages", "Lab tests & diagnostics", "Chronic disease management", "In-patient care", "Vaccinations"],
      book: "General Medicine",
    },
    surgery: {
      num: "03 · Department",
      title: "General Surgery",
      intro: "Safe, modern surgical care with a focus on minimally invasive techniques for smaller scars, less pain and faster recovery.",
      conditions: ["Hernia", "Gallbladder stones", "Appendicitis", "Piles, fissure & fistula", "Lumps, cysts & abscesses", "Wounds & injuries"],
      services: ["Laparoscopic (keyhole) surgery", "Hernia repair", "Gallbladder removal", "Appendix surgery", "Day-care procedures", "Post-operative care"],
      book: "General Surgery",
    },
    gyno: {
      num: "04 · Department",
      title: "Gynecology & Obstetrics",
      intro: "Compassionate care for women through every stage of life, from adolescence and pregnancy to menopause.",
      conditions: ["Irregular or painful periods", "PCOD / PCOS", "Pregnancy care", "Infertility concerns", "Fibroids & ovarian cysts", "Menopause problems"],
      services: ["Antenatal & postnatal care", "Normal & C-section delivery", "Laparoscopic gynec surgery", "Family planning", "Pap smear & screening", "Adolescent health"],
      book: "Gynecology & Obstetrics",
    },
  };

  const modal = document.getElementById("modal");
  const $ = (id) => document.getElementById(id);
  let lastFocus = null;
  let currentDept = null;

  const fillList = (ul, items) => {
    ul.innerHTML = "";
    items.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      ul.appendChild(li);
    });
  };

  const openModal = (key) => {
    const d = DEPTS[key];
    if (!d) return;
    currentDept = d;
    $("modalNum").textContent = d.num;
    $("modalTitle").textContent = d.title;
    $("modalIntro").textContent = d.intro;
    fillList($("modalConditions"), d.conditions);
    fillList($("modalServices"), d.services);
    lastFocus = document.activeElement;
    modal.hidden = false;
    body.style.overflow = "hidden";
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("is-open")));
    modal.querySelector(".modal__close").focus();
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    body.style.overflow = "";
    setTimeout(() => (modal.hidden = true), 450);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };

  document.querySelectorAll(".dept").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.dept));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card.dataset.dept); }
    });
  });
  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", () => {
      if (el.hasAttribute("data-book") && currentDept) {
        const sel = $("f-dept");
        [...sel.options].forEach((o) => (o.selected = o.textContent === currentDept.book));
      }
      closeModal();
    })
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  /* ---------- Appointment form (static: no backend yet) ---------- */
  const form = document.getElementById("apptForm");
  const dateInput = $("f-date");
  dateInput.min = new Date().toISOString().split("T")[0];

  const toast = $("toast");
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove("is-show"), 4200);
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach((input) => {
      const field = input.closest(".field");
      const valid = input.checkValidity();
      field.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      showToast("Please fill in your name, phone, department and date.");
      return;
    }
    const name = $("f-name").value.trim().split(" ")[0];
    showToast(`Thank you, ${name}! Our team will call you shortly to confirm.`);
    form.reset();
  });
  form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("is-invalid"));
})();
