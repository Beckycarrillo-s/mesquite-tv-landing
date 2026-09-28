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
     2. Hero: reloj en vivo del mockup
     ------------------------------------------------------------------------ */
  var clock = document.querySelector('[data-clock]');
  function tick() {
    var now = new Date();
    clock.textContent =
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0');
  }
  if (clock) {
    tick();
    setInterval(tick, 15000);
  }

  /* ------------------------------------------------------------------------
     6. Formulario de contacto: validación en cliente + confirmación
     ------------------------------------------------------------------------ */
  var form = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, message) {
    var field = input.closest('.field');
    var error = document.getElementById(input.id + '-error');
    field.classList.toggle('has-error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) {
      input.setAttribute('aria-describedby', error.id);
    } else {
      input.removeAttribute('aria-describedby');
    }
    error.textContent = message || '';
  }

  function validate() {
    var name = form.elements.nombre;
    var email = form.elements.correo;
    var firstInvalid = null;

    if (!name.value.trim()) {
      setError(name, 'Escribe tu nombre.');
      firstInvalid = firstInvalid || name;
    } else {
      setError(name, '');
    }

    var emailValue = email.value.trim();
    if (!emailValue) {
      setError(email, 'Escribe tu correo.');
      firstInvalid = firstInvalid || email;
    } else if (!EMAIL_RE.test(emailValue)) {
      setError(email, 'Revisa el formato del correo (ej. nombre@empresa.com).');
      firstInvalid = firstInvalid || email;
    } else {
      setError(email, '');
    }

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  // Limpia el error de un campo en cuanto el usuario lo corrige
  ['nombre', 'correo'].forEach(function (key) {
    form.elements[key].addEventListener('input', function () {
      if (this.closest('.field').classList.contains('has-error')) validate();
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var data = Object.fromEntries(new FormData(form));

    // TODO: Conectar el envío real antes de publicar.
    // Este sitio es estático y el formulario NO envía los datos a ningún lado.
    // Opciones: un servicio como Formspree, un webhook propio, o un endpoint
    // del backend de Mesquite TV que reenvíe por correo. Ejemplo:
    //
    //   fetch('https://formspree.io/f/XXXXXXX', {
    //     method: 'POST',
    //     headers: { 'Accept': 'application/json' },
    //     body: new FormData(form)
    //   }).then(function (res) { if (res.ok) showSuccess(); else ... });
    //
    // Mientras tanto solo se muestra la confirmación en pantalla.
    void data;
    showSuccess();
  });

  function showSuccess() {
    form.reset();
    form.hidden = true;
    success.hidden = false;
    success.focus();
  }

  /* ------------------------------------------------------------------------
     7. Footer: año actual
     ------------------------------------------------------------------------ */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
