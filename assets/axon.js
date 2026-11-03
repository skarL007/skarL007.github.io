// Axon Voice case study: accessible responsive navigation, no media-player dependencies.
const menu = document.querySelector('#menuBtn');
const nav = document.querySelector('#nav');
function closeMenu() {
  document.documentElement.classList.remove('nav-open');
  menu?.setAttribute('aria-expanded', 'false');
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  document.documentElement.classList.toggle('nav-open', open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
if ('IntersectionObserver' in window && nav) {
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      links.forEach(link => {
        if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }
  }, {rootMargin:'-20% 0px -60% 0px', threshold:0});
  sections.forEach(section => observer.observe(section));
}
