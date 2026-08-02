/* Shared public footer for the project site and the demo hub.

   The footer carries LEGAL and credit only. It deliberately does not repeat the
   header menu (GitHub, the Pinamar Turnos reference) and does not carry a
   language link, because the header already has the language toggle
   (Ivan, 2026-08-01: "don't copy the menu basically there"). */
(function () {
  var GITHUB = 'https://github.com/visualpharm/human-rounds';

  function render(footer, lang) {
    var es = lang === 'es';
    footer.className = 'public-footer';
    footer.innerHTML =
      '<div class="public-footer__inner">' +
        '<p class="public-footer__credit">© 2026 Human Rounds. ' +
          '<a href="https://icons8.com" rel="noopener">' + (es ? 'Íconos de Icons8' : 'Icons by Icons8') + '</a>' +
        '</p>' +
        '<nav aria-label="' + (es ? 'Enlaces legales' : 'Legal links') + '">' +
          '<a href="/privacy">' + (es ? 'Privacidad' : 'Privacy') + '</a>' +
          '<a href="/terms">' + (es ? 'Términos' : 'Terms') + '</a>' +
          '<a href="' + GITHUB + '/blob/main/LICENSE" rel="noopener">' + (es ? 'Licencia' : 'License') + '</a>' +
        '</nav>' +
      '</div>';
  }

  function init() {
    var footers = document.querySelectorAll('[data-public-footer]');
    for (var i = 0; i < footers.length; i++) {
      var lang = footers[i].getAttribute('data-lang') || document.documentElement.lang || 'en';
      render(footers[i], lang);
    }
  }

  window.addEventListener('human-rounds:language', function (event) {
    var footers = document.querySelectorAll('[data-public-footer]');
    for (var i = 0; i < footers.length; i++) render(footers[i], event.detail.lang);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
