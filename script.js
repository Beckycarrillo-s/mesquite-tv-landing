/* ==========================================================================
   Mesquite TV · Landing page
   JS vanilla, sin dependencias.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Nav: borde al hacer scroll + menú móvil
     ------------------------------------------------------------------------ */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  toggle.addEventListener('click', function () {
    setMenu(!menu.classList.contains('is-open'));
  });

  // Cierra el menú al elegir un enlace o al presionar Escape
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ------------------------------------------------------------------------
     Tema claro/oscuro. Claro por defecto; la elección se recuerda en este
     navegador (el <head> la aplica antes de pintar).
     ------------------------------------------------------------------------ */
  var root = document.documentElement;
  var themeBtn = document.querySelector('.theme-toggle');

  function syncThemeButton() {
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
  }

  themeBtn.addEventListener('click', function () {
    var dark = root.getAttribute('data-theme') !== 'dark';
    if (dark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    try { localStorage.setItem('mesquite-theme', dark ? 'dark' : 'light'); } catch (e) {}
    syncThemeButton();
  });
  syncThemeButton();

  /* ------------------------------------------------------------------------
     Animación de aparición al hacer scroll
     Los elementos con .reveal aparecen al entrar en pantalla. Los que están
     en un mismo grid (funciones, galería, estadísticas, hero) entran
     escalonados. Al terminar se quita .reveal para no interferir con el hover.
     ------------------------------------------------------------------------ */
  var revealItems = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function finishReveal(el) {
    el.classList.remove('reveal', 'is-visible');
    el.style.removeProperty('--reveal-delay');
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // Sin animación: se muestra todo de inmediato
    revealItems.forEach(finishReveal);
  } else {
    // Retraso escalonado según la posición dentro de su contenedor
    var groups = document.querySelectorAll('.hero__copy, .stats__grid, .features, .gallery');
    groups.forEach(function (group) {
      var index = 0;
      Array.prototype.forEach.call(group.children, function (child) {
        if (!child.classList.contains('reveal')) return;
        child.style.setProperty('--reveal-delay', Math.min(index, 6) * 90 + 'ms');
        index++;
      });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        observer.unobserve(el);
        el.addEventListener('transitionend', function onEnd(e) {
          if (e.target !== el) return;
          el.removeEventListener('transitionend', onEnd);
          finishReveal(el);
        });
        el.classList.add('is-visible');
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------------
     6. Footer: año actual
     ------------------------------------------------------------------------ */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
