/* Shared public footer for the project site and the demo hub. */
(function () {
  var GITHUB = 'https://github.com/visualpharm/sana-health';
  var DEMO = 'https://demo.sana.brieflysites.com/';

  function render(footer, lang) {
    var es = lang === 'es';
    footer.className = 'public-footer';
    footer.innerHTML =
      '<div class="public-footer__inner">' +
        '<p><strong>SANA</strong><br>' +
          (es
            ? 'Infraestructura abierta para la salud pública.'
            : 'Open infrastructure for public healthcare.') +
        '</p>' +
        '<nav aria-label="' + (es ? 'Enlaces del proyecto' : 'Project links') + '">' +
          '<a href="' + GITHUB + '" rel="noopener">GitHub</a>' +
          '<a href="' + DEMO + '">' + (es ? 'Demo en vivo' : 'Live demo') + '</a>' +
          '<a href="/' + (es ? 'en' : 'es') + '">' + (es ? 'English' : 'Español') + '</a>' +
        '</nav>' +
        '<p class="public-footer__note">' +
          (es
            ? 'Los datos de la demo son ficticios. Ninguna sugerencia clínica reemplaza la decisión profesional.'
            : 'Demo data is fictional. Clinical suggestions never replace professional judgment.') +
        '</p>' +
      '</div>';
  }

  function init() {
    var footers = document.querySelectorAll('[data-public-footer]');
    for (var i = 0; i < footers.length; i++) {
      var lang = footers[i].getAttribute('data-lang') || document.documentElement.lang || 'en';
      render(footers[i], lang);
    }
  }

  window.addEventListener('sana:language', function (event) {
    var footers = document.querySelectorAll('[data-public-footer]');
    for (var i = 0; i < footers.length; i++) render(footers[i], event.detail.lang);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
