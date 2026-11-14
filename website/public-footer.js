/* Shared public footer for the project site and the demo hub.

   The footer carries legal links and related projects. It does not repeat the
   header menu (GitHub, the Pinamar Turnos reference) and does not carry a
   language link, because the header already has the language toggle
   (Ivan, 2026-08-01: "don't copy the menu basically there"). */
(function () {
  var GITHUB = 'https://github.com/visualpharm/human-rounds';

  var copy = {
    en: {
      credit: '© 2026 Human Rounds. Icons by Icons8',
      legallabel: 'Legal links',
      privacy: 'Privacy',
      datadeletion: 'Data deletion',
      terms: 'Terms',
      license: 'License'
    },
    es: {
      credit: '© 2026 Human Rounds. Íconos de Icons8',
      legallabel: 'Enlaces legales',
      privacy: 'Privacidad',
      datadeletion: 'Borrar datos',
      terms: 'Términos',
      license: 'Licencia'
    }
  };

  function render(footer, lang) {
    // Merge translations from HR_COPY if available
    if (window.HR_COPY && window.HR_COPY[lang] && window.HR_COPY[lang].footer) {
      copy[lang] = Object.assign(copy[lang] || {}, window.HR_COPY[lang].footer);
    }

    var c = copy[lang] || copy.en;
    footer.className = 'public-footer';
    footer.innerHTML =
      '<div class="public-footer__inner">' +
        '<p class="public-footer__credit">' + c.credit + ' <a href="https://icons8.com" rel="noopener">Icons8</a></p>' +
        '<nav aria-label="' + c.legallabel + '">' +
          '<a href="/privacy">' + c.privacy + '</a>' +
          '<a href="/data-deletion">' + c.datadeletion + '</a>' +
          '<a href="/terms">' + c.terms + '</a>' +
          '<a href="' + GITHUB + '/blob/main/LICENSE" rel="noopener">' + c.license + '</a>' +
        '</nav>' +
        '<nav class="public-footer__projects" aria-label="' + (lang === 'es' ? 'Otros proyectos' : 'Other projects') + '">' +
          '<a href="https://usabruno.com">Bruno</a>' +
          '<a href="https://lira-voice.app">Lira</a>' +
          '<a href="https://inglesconjenny.com">Inglés con Jenny</a>' +
          '<a href="https://finda-capital.com">Finda Capital</a>' +
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
