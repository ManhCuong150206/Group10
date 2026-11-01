const carousel = document.querySelector('.carousel');
const slider = document.querySelector('.slider');
const items = [...slider.querySelectorAll('.item')];
const dotsContainer = document.querySelector('.dots');
const counter = document.querySelector('.counter');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const n = items.length;
let active = 0;

/* ---------- Vũ trụ: sao bay theo trục Z ---------- */
const canvas = Object.assign(document.createElement('canvas'), { id: 'space' });
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');
const DEPTH = 1200, FOCAL = 500;
const COLORS = ['255,255,255', '255,255,255', '190,220,255', '199,240,162'];
let W, H, boost = 0, drift = 0, mx = 0, my = 0, px = 0, py = 0;
let stars = [];

function spawn(s, far) {
  s.x = (Math.random() - .5) * W * 2.4;
  s.y = (Math.random() - .5) * H * 2.4;
  s.z = far ? DEPTH : Math.random() * DEPTH;
  s.pz = s.z;
  s.c = COLORS[(Math.random() * COLORS.length) | 0];
  s.r = .5 + Math.random() * 1.3;
  return s;
}
function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = W < 600 ? 200 : 420;
  while (stars.length < count) stars.push(spawn({}));
  stars.length = count;
}

// Mỗi lần chuyển thẻ: sao lao tới (warp) + trượt ngang theo hướng chuyển
function kick(steps, dir) {
  if (reduceMotion) return;
  boost = Math.min(boost + 26 * steps, 90);
  drift = -dir * 16;
}

function frame() {
  boost *= .94; drift *= .93;
  px += (mx - px) * .06; py += (my - py) * .06;
  const v = (reduceMotion ? 0 : 1.1) + boost;
  const cx = W / 2 - px * 70, cy = H / 2 - py * 45;
  ctx.clearRect(0, 0, W, H);

  if (boost > 1) { // quầng sáng ở tâm khi đang lao
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * .55);
    g.addColorStop(0, `rgba(199,240,162,${Math.min(boost / 450, .2)})`);
    g.addColorStop(1, 'rgba(199,240,162,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }

  ctx.lineCap = 'round';
  for (const s of stars) {
    s.pz = s.z; s.z -= v; s.x += drift * (1.3 - s.z / DEPTH);
    const k = FOCAL / s.z, kp = FOCAL / s.pz;
    const sx = cx + s.x * k, sy = cy + s.y * k;
    if (s.z < 2 || sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) { spawn(s, true); continue; }
    const near = 1 - s.z / DEPTH;
    ctx.strokeStyle = `rgba(${s.c},${.15 + near * .85})`;
    ctx.lineWidth = s.r * (.4 + near * 1.6);
    ctx.beginPath();
    ctx.moveTo(cx + s.x * kp, cy + s.y * kp);
    ctx.lineTo(sx, sy);
    ctx.stroke();
  }
  // Parallax: điểm nhìn của khối 3D lệch nhẹ theo chuột
  if (!reduceMotion) slider.style.perspectiveOrigin = `${50 + px * 18}% ${50 + py * 30}%`;
  if (!reduceMotion) requestAnimationFrame(frame);
}
addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
addEventListener('resize', resize);
resize();
frame();

/* ---------- Dots + link trạng thái (giữ nguyên) ---------- */
const dots = items.map((item, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'dot';
  button.setAttribute('aria-label', `Xem thành viên ${index + 1}`);
  button.setAttribute('aria-controls', 'member-slider');
  button.addEventListener('click', () => show(index));
  dotsContainer.append(button);
  const words = item.querySelector('h2').textContent.trim().split(/\s+/);
  const avatar = Object.assign(document.createElement('div'), { className: 'avatar', textContent: words[0][0] + words[words.length - 1][0] });
  avatar.setAttribute('aria-hidden', 'true');
  item.style.setProperty('--hue', String(150 + index * 24));
  item.style.setProperty('--i', String(index));
  item.querySelector('.member-info').before(avatar);
  const link = item.querySelector('.portfolio-link');
  // Chỉ cần điền href trong index.html; trạng thái sẽ tự cập nhật.
  const hasLink = Boolean(link.getAttribute('href')?.trim());
  if (hasLink) {
    link.removeAttribute('aria-disabled');
    item.classList.add('has-link');
    item.querySelector('.link-status').textContent = 'Khám phá portfolio';
  } else {
    link.addEventListener('click', event => event.preventDefault());
  }
  item.addEventListener('click', event => {
    if (index !== active && !event.target.closest('a')) show(index);
  });
  return button;
});

/* ---------- Băng chuyền 3D: các thẻ xếp thành đường hầm theo trục Z ---------- */
function show(index) {
  const prev = active;
  active = (index + n) % n;
  let step = (active - prev + n) % n;
  if (step > n / 2) step -= n;
  if (step) kick(Math.abs(step), Math.sign(step));

  const k = innerWidth <= 600 ? .55 : 1;
  items.forEach((item, i) => {
    let d = (i - active + n) % n;           // 0 = thẻ trước mặt, >0 = phía sau, <0 = đã bay qua camera
    if (d > n / 2) d -= n;
    const depth = Math.max(d, 0), side = depth % 2 ? 1 : -1, isActive = d === 0;
    const set = (name, value) => item.style.setProperty(name, value);
    set('--x', d < 0 ? '0px' : `${side * (depth ? 80 + depth * 60 : 0) * k}px`);
    set('--y', `${-depth * 14}px`);
    set('--z', d < 0 ? `${500 - d * 200}px` : `${-depth * 420}px`);
    set('--ry', d < 0 ? '0deg' : `${-side * Math.min(depth, 1) * 16}deg`);
    set('--opacity', d < 0 ? '0' : String(Math.max(0, 1 - depth * .28)));
    set('--dim', String(1 - depth * .2));
    set('--blur', d < 0 ? '6px' : `${depth * .7}px`);
    set('--delay', d < 0 ? '0ms' : `${depth * 35}ms`);
    set('--layer', String(d < 0 ? 30 : 20 - depth));
    item.style.pointerEvents = d < 0 ? 'none' : 'auto';
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-hidden', String(!isActive));
    const link = item.querySelector('.portfolio-link');
    link.tabIndex = isActive && !link.hasAttribute('aria-disabled') ? 0 : -1;
    link.style.pointerEvents = isActive ? 'auto' : 'none';
    dots[i].setAttribute('aria-current', String(isActive));
  });
  counter.innerHTML = `${String(active + 1).padStart(2, '0')} <span>/ ${String(n).padStart(2, '0')}</span>`;
}

document.getElementById('next').addEventListener('click', () => show(active + 1));
document.getElementById('prev').addEventListener('click', () => show(active - 1));
carousel.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    show(active + (event.key === 'ArrowRight' ? 1 : -1));
    if (event.target.closest('.portfolio-link')) dots[active].focus();
  }
});

let wheelLock = 0;
slider.addEventListener('wheel', event => {
  const now = performance.now();
  if (Math.abs(event.deltaY) < 20 || now - wheelLock < 700) return;
  wheelLock = now;
  show(active + (event.deltaY > 0 ? 1 : -1));
}, { passive: true });

let pointerStart = null;
let suppressClick = false;
slider.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || event.target.closest('a')) return;
  pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
});
window.addEventListener('pointerup', event => {
  if (!pointerStart || event.pointerId !== pointerStart.id) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
    show(active + (dx < 0 ? 1 : -1));
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
  }
  pointerStart = null;
});
window.addEventListener('pointercancel', () => { pointerStart = null; });
slider.addEventListener('click', event => {
  if (suppressClick) { event.preventDefault(); event.stopPropagation(); }
}, true);
window.addEventListener('resize', () => show(active));

carousel.classList.add('is-ready');
document.querySelector('.carousel-controls').hidden = false;
void slider.offsetWidth;   // chốt trạng thái ban đầu để các thẻ bay vào từ xa khi tải trang
show(0);
kick(3, 1);