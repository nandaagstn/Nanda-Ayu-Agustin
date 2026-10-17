const deskripsi = document.querySelector("#deskripsi");
const tombolTeks = document.querySelector("#tombolTeks");
const tombolTema = document.querySelector("#tombolTema");

const daftarTeks = [
  "Hey! I'm Nanda, a first-semester Informatics Engineering student who's currently exploring web development. I'm curious about technology and enjoy learning new things, especially how digital ideas can turn into something useful."
  
];
let nomor = 0, ketikTimer = null;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ringan = matchMedia("(max-width:700px), (hover:none)").matches; // phones: fewer particles

// Typewriter effect for the description
function ketik(teks) {
  clearInterval(ketikTimer);
  if (reduce) { deskripsi.textContent = teks; return; }
  const huruf = Array.from(teks);
  let i = 0;
  deskripsi.textContent = "";
  deskripsi.classList.add("typing");
  ketikTimer = setInterval(() => {
    i += 2;
    deskripsi.textContent = huruf.slice(0, i).join("");
    if (i >= huruf.length) { clearInterval(ketikTimer); deskripsi.classList.remove("typing"); }
  }, 20);
}
tombolTeks.addEventListener("click", () => {
  nomor = (nomor + 1) % daftarTeks.length;
  ketik(daftarTeks[nomor]);
});

// Theme: light <-> Spider-Man (remembers choice)
function setTema(spidey, animate) {
  const b = document.body;
  b.classList.toggle("spidey", spidey);
  tombolTema.setAttribute("aria-pressed", spidey);
  if (spidey) {
    // restart the swing-in animation every time the theme is switched on
    b.classList.remove("enter"); void b.offsetWidth; b.classList.add("enter");
  } else b.classList.remove("enter");
  try { localStorage.setItem("tema", spidey ? "spidey" : "light"); } catch (e) {}
}
let simpan = null;
try { simpan = localStorage.getItem("tema"); } catch (e) {}
setTema(simpan === "spidey");
let berpindah = false;
tombolTema.addEventListener("click", () => {
  const target = !document.body.classList.contains("spidey");
  if (reduce) { setTema(target); return; }
  if (berpindah) return;
  berpindah = true;
  const r = tombolTema.getBoundingClientRect();
  const w = document.querySelector("#wipe");
  w.style.setProperty("--wx", (r.left + r.width / 2) + "px");
  w.style.setProperty("--wy", (r.top + r.height / 2) + "px");
  w.className = "wipe " + (target ? "red" : "light");
  void w.offsetWidth;
  w.classList.add("go");
  setTimeout(() => setTema(target), 520);
  setTimeout(() => { w.className = "wipe"; berpindah = false; }, 1100);
});

// Parallax: Spider-Man follows the mouse and the scroll
const sps = document.querySelectorAll(".sp");
let mx = 0, my = 0, sy = 0, ticking = false;
function paral() {
  sps.forEach(el => {
    const d = parseFloat(el.dataset.depth);
    el.style.setProperty("--px", (mx * -28 * d).toFixed(1) + "px");
    el.style.setProperty("--py", (my * -18 * d - sy * 0.06 * d).toFixed(1) + "px");
  });
  const lb = document.querySelector('.lightbg');
  if (lb) { lb.style.setProperty('--lx', (mx * -24).toFixed(1) + 'px'); lb.style.setProperty('--ly', (my * -16 - sy * 0.03).toFixed(1) + 'px'); }
  // Spider-Mans lean toward the cursor
  const one = document.querySelector(".sp.one img"), two = document.querySelector(".sp.two img");
  if (one) one.style.setProperty("--rot", (mx * -5).toFixed(1) + "deg");
  if (two) two.style.setProperty("--rot", (mx * 5).toFixed(1) + "deg");
  const fxl = document.querySelector("#lightfx");
  if (fxl) { fxl.style.setProperty("--fx", (mx * -20).toFixed(1) + "px"); fxl.style.setProperty("--fy", (my * -14).toFixed(1) + "px"); }
  const av = document.querySelector(".avatar");
  if (av) { av.style.setProperty("--ax", (mx * 8).toFixed(1) + "px"); av.style.setProperty("--ay", (my * 8).toFixed(1) + "px"); }
  ticking = false;
}
function req() { if (!ticking) { ticking = true; requestAnimationFrame(paral); } }
const glow = document.querySelector("#glow");
window.addEventListener("mousemove", e => {
  mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; req();
  glow.style.transform = "translate3d(" + e.clientX + "px," + e.clientY + "px,0)";
  glow.classList.add("on");
});
document.addEventListener("mouseleave", () => glow.classList.remove("on"));

// Scroll progress bar
const prog = document.querySelector("#progress");
function updProg() {
  const h = document.documentElement.scrollHeight - innerHeight;
  prog.style.setProperty("--p", h > 0 ? (scrollY / h).toFixed(3) : 0);
}
window.addEventListener("scroll", updProg, { passive: true });
window.addEventListener("resize", updProg);
updProg();
if (!ringan) window.addEventListener("scroll", () => { sy = scrollY; req(); }, { passive: true }); // no scroll-parallax on phones

// Web shot: click anywhere in Spider-Man theme to shoot a web from the nearest top corner
const webs = document.querySelector("#webs");
document.addEventListener("click", e => {
  if (!document.body.classList.contains("spidey") || e.target.closest("a,button")) return;
  const x = e.clientX / innerWidth * 100, y = e.clientY / innerHeight * 100;
  const sx = x < 50 ? 0 : 100;
  const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const len = Math.hypot((x - sx) * innerWidth / 100, y * innerHeight / 100);
  ln.setAttribute("x1", sx); ln.setAttribute("y1", 85); ln.setAttribute("x2", x); ln.setAttribute("y2", y);
  ln.setAttribute("vector-effect", "non-scaling-stroke"); ln.setAttribute("class", "shot");
  ln.style.setProperty("--len", len);
  webs.appendChild(ln); setTimeout(() => ln.remove(), 1500);
  const rp = document.createElement("span");
  rp.className = "sense"; rp.style.left = e.clientX + "px"; rp.style.top = e.clientY + "px";
  document.body.appendChild(rp); setTimeout(() => rp.remove(), 900);
});

// Profile photo: show initials if foto.jpg is missing
const foto = document.querySelector("#foto");
const avatar = foto.closest(".avatar");
foto.addEventListener("error", () => avatar.classList.add("noimg"));
avatar.addEventListener("click", () => {
  avatar.classList.remove("flip"); void avatar.offsetWidth; avatar.classList.add("flip");
});
avatar.addEventListener("animationend", e => { if (e.animationName === "flip") avatar.classList.remove("flip"); });

// Fade-in on scroll
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); const t = en.target; setTimeout(() => { t.style.transitionDelay = ""; }, 1000); }
}), { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + "ms"; io.observe(el); });

// Floating red embers in the Spider-Man theme
const emb = document.createElement("div");
emb.className = "embers";
for (let i = 0; i < (ringan ? 10 : 24); i++) {
  const sp = document.createElement("span");
  sp.style.setProperty("--x", (Math.random() * 100).toFixed(1) + "%");
  sp.style.setProperty("--s", (2 + Math.random() * 4).toFixed(1) + "px");
  sp.style.setProperty("--d", (7 + Math.random() * 9).toFixed(1) + "s");
  sp.style.setProperty("--dl", (-Math.random() * 14).toFixed(1) + "s");
  sp.style.setProperty("--dx", ((Math.random() - .5) * 160).toFixed(0) + "px");
  emb.appendChild(sp);
}
document.querySelector(".stage").appendChild(emb);

// Button ripple
document.querySelectorAll(".btn").forEach(b => b.addEventListener("click", e => {
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
  const sp = document.createElement("span");
  sp.className = "rp";
  sp.style.width = sp.style.height = d + "px";
  sp.style.left = (e.clientX - r.left - d / 2) + "px";
  sp.style.top = (e.clientY - r.top - d / 2) + "px";
  b.appendChild(sp); setTimeout(() => sp.remove(), 700);
}));

// Cards: 3D tilt + moving glare that follow the cursor
document.querySelectorAll(".card").forEach(c => {
  c.addEventListener("mousemove", e => {
    const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    c.style.setProperty("--ry", ((px - .5) * 14).toFixed(1) + "deg");
    c.style.setProperty("--rx", ((.5 - py) * 14).toFixed(1) + "deg");
    c.style.setProperty("--mx", (px * 100).toFixed(0) + "%");
    c.style.setProperty("--my", (py * 100).toFixed(0) + "%");
  });
  c.addEventListener("mouseleave", () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
});

// Spider-Mans shoot webs on their own from their hands every few seconds (dark theme only)
function autoWeb() {
  if (document.body.classList.contains("spidey") && !document.hidden && !reduce && !ringan) {
    const fromLeft = Math.random() < .5;
    const sx = fromLeft ? 8 : 90, sy = fromLeft ? 58 : 62;
    const x = 25 + Math.random() * 50, y = 15 + Math.random() * 65;
    const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const len = Math.hypot((x - sx) * innerWidth / 100, (y - sy) * innerHeight / 100);
    ln.setAttribute("x1", sx); ln.setAttribute("y1", sy); ln.setAttribute("x2", x); ln.setAttribute("y2", y);
    ln.setAttribute("vector-effect", "non-scaling-stroke"); ln.setAttribute("class", "shot auto");
    ln.style.setProperty("--len", len);
    webs.appendChild(ln); setTimeout(() => ln.remove(), 1500);
  }
  setTimeout(autoWeb, 2500 + Math.random() * 2500);
}
setTimeout(autoWeb, 3500);

// ---- Light theme: floating code symbols + sparkle trail ----
const lightfx = document.querySelector("#lightfx");
const simbol = ["</>", "{ }", "#", "01", "=>", "( )", "[ ]", "&&", "++", "fn()", "<div>", "//", "0x", "if", "AI", "</p>"];
for (let i = 0; i < (ringan ? 10 : 24); i++) {
  const s = document.createElement("span");
  s.textContent = simbol[i % simbol.length];
  s.style.setProperty("--x", (Math.random() * 100).toFixed(1) + "%");
  s.style.setProperty("--sz", (14 + Math.random() * 26).toFixed(0) + "px");
  s.style.setProperty("--d", (14 + Math.random() * 16).toFixed(1) + "s");
  s.style.setProperty("--dl", (-Math.random() * 28).toFixed(1) + "s");
  s.style.setProperty("--dx", ((Math.random() - .5) * 140).toFixed(0) + "px");
  s.style.setProperty("--r", ((Math.random() - .5) * 60).toFixed(0) + "deg");
  if (i % 3 === 1) s.className = "lm";
  lightfx.appendChild(s);
}
let lastSpark = 0;
const warnaSpark = ["#6a2fd8", "#a8d400", "#ff5cb8", "#8f5cff"];
window.addEventListener("mousemove", e => {
  if (document.body.classList.contains("spidey") || reduce) return;
  const t = performance.now();
  if (t - lastSpark < 45) return;
  lastSpark = t;
  const sp = document.createElement("span");
  sp.className = "spark";
  sp.textContent = Math.random() < .5 ? "\u2726" : "\u2727";
  sp.style.left = e.clientX + "px"; sp.style.top = e.clientY + "px";
  sp.style.setProperty("--sz", (10 + Math.random() * 14).toFixed(0) + "px");
  sp.style.setProperty("--c", warnaSpark[Math.floor(Math.random() * warnaSpark.length)]);
  sp.style.setProperty("--dx", ((Math.random() - .5) * 50).toFixed(0) + "px");
  sp.style.setProperty("--dy", (20 + Math.random() * 40).toFixed(0) + "px");
  document.body.appendChild(sp);
  setTimeout(() => sp.remove(), 950);
});
