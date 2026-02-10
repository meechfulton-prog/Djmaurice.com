// Smooth reveal on scroll
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) e.target.classList.add("on");
  }
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// Theme toggle (saved)
const themeBtn = document.getElementById("themeBtn");
const saved = localStorage.getItem("mf_theme");
if (saved) document.documentElement.setAttribute("data-theme", saved);

themeBtn?.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "light" ? "" : "light";
  if (next) document.documentElement.setAttribute("data-theme", next);
  else document.documentElement.removeAttribute("data-theme");
  localStorage.setItem("mf_theme", next || "");
});

// Count-up animation
function animateCount(el) {
  const target = Number(el.dataset.count || 0);
  const dur = 1100;
  const start = performance.now();
  const fmt = new Intl.NumberFormat();

  function tick(t) {
    const p = Math.min(1, (t - start) / dur);
    const v = Math.floor(target * (0.08 + 0.92 * p));
    el.textContent = fmt.format(v);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counter = document.querySelector("[data-count]");
if (counter) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0]?.isIntersecting) {
      animateCount(counter);
      counterObserver.disconnect();
    }
  }, { threshold: 0.3 });
  counterObserver.observe(counter);
}

// Contact form (front-end demo)
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  note.textContent = "Saved locally (demo). Connect Formspree/Netlify for real email delivery.";
  note.style.opacity = "1";
  form.reset();
});

// Copy email
document.getElementById("copyEmail")?.addEventListener("click", async () => {
  const email = document.getElementById("artistEmail")?.textContent?.trim() || "";
  try {
    await navigator.clipboard.writeText(email);
    if (note) note.textContent = "Email copied.";
  } catch {
    if (note) note.textContent = "Copy blocked by browser. Manually select the email.";
  }
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Subtle abstract canvas motion (safe, lightweight)
const canvas = document.getElementById("flow");
const ctx = canvas.getContext("2d", { alpha: true });
let w, h, t = 0;

function resize() {
  w = canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
  h = canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
}
window.addEventListener("resize", resize);
resize();

function draw() {
  t += 0.006;
  ctx.clearRect(0, 0, w, h);

  const circles = 16;
  for (let i = 0; i < circles; i++) {
    const p = i / circles;
    const x = (0.12 + 0.78 * p) * w + Math.sin(t + i) * 0.05 * w;
    const y = (0.18 + 0.64 * (1 - p)) * h + Math.cos(t * 1.1 + i * 1.7) * 0.06 * h;
    const r = (0.06 + 0.12 * Math.abs(Math.sin(t + p * 6))) * Math.min(w, h);

    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(167,139,250,0.18)");
    g.addColorStop(0.45, "rgba(255,184,107,0.10)");
    g.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();
