const menu = document.querySelector('#menuBtn');
const nav = document.querySelector('#nav');
menu?.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  document.documentElement.classList.toggle('nav-open', expanded);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  document.documentElement.classList.remove('nav-open');
  menu?.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    document.documentElement.classList.remove('nav-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.focus();
  }
});
const video = document.querySelector('#demo');
document.querySelectorAll('[data-time]').forEach((button) => button.addEventListener('click', () => {
  if (!video) return;
  const seek = () => { video.currentTime = Number(button.dataset.time); video.play().catch(() => {}); };
  if (video.readyState >= 1) seek();
  else { video.addEventListener('loadedmetadata', seek, { once: true }); video.load(); }
  video.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
}));
