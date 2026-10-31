const carousel = document.querySelector('.carousel');
const slider = document.querySelector('.slider');
const items = [...slider.querySelectorAll('.item')];
const dotsContainer = document.querySelector('.dots');
const counter = document.querySelector('.counter');
let active = 0;

const dots = items.map((item, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'dot';
  button.setAttribute('aria-label', `Xem thành viên ${index + 1}`);
  button.setAttribute('aria-controls', 'member-slider');
  button.addEventListener('click', () => show(index));
  dotsContainer.append(button);
  const link = item.querySelector('.portfolio-link');
  // Chỉ cần điền href trong index.html; trạng thái sẽ tự cập nhật.
  const hasLink = Boolean(link.getAttribute('href')?.trim());
  if (hasLink) {
    link.removeAttribute('aria-disabled');
    item.querySelector('.link-status').textContent = 'Khám phá portfolio';
  } else {
    link.addEventListener('click', event => event.preventDefault());
  }
  item.addEventListener('click', event => {
    if (index !== active && !event.target.closest('a')) show(index);
  });
  return button;
});

function show(index) {
  active = (index + items.length) % items.length;
  const spacing = window.innerWidth <= 600 ? 176 : Math.min(245, window.innerWidth * .24);
  items.forEach((item, itemIndex) => {
    let distance = (itemIndex - active + items.length) % items.length;
    if (distance > items.length / 2) distance -= items.length;
    const depth = Math.abs(distance);
    const isActive = distance === 0;
    item.style.setProperty('--offset', `${distance * spacing}px`);
    item.style.setProperty('--scale', String(1 - depth * .13));
    item.style.setProperty('--rotation', `${distance * -9}deg`);
    item.style.setProperty('--opacity', depth > 2 ? '0' : '1');
    item.style.backgroundColor = ['var(--card-paper)', 'var(--card-paper-near)', 'var(--card-paper-far)'][Math.min(depth, 2)];
    item.style.setProperty('--layer', String(10 - depth));
    item.style.pointerEvents = depth > 2 ? 'none' : 'auto';
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-hidden', String(!isActive));
    const link = item.querySelector('.portfolio-link');
    link.tabIndex = isActive && !link.hasAttribute('aria-disabled') ? 0 : -1;
    link.style.pointerEvents = isActive ? 'auto' : 'none';
    dots[itemIndex].setAttribute('aria-current', String(isActive));
  });
  counter.innerHTML = `${String(active + 1).padStart(2, '0')} <span>/ ${String(items.length).padStart(2, '0')}</span>`;
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
show(0);
