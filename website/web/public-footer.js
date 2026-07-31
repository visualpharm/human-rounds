/* Shared public footer for the project site and the demo hub. */
(function () {
  var GITHUB = 'https://github.com/visualpharm/human-rounds';
  var DEMO = '/demo';

  function render(footer, lang) {
    var es = lang === 'es';
    footer.className = 'public-footer';
    footer.innerHTML =
      '<div class="public-footer__inner">' +
        '<p><strong>Human Rounds</strong><br>' +
          (es
            ? 'IA nativa y código abierto para una atención más humana.'
            : 'AI-native, open-source infrastructure for human care.') +
        '</p>' +
        '<nav aria-label="' + (es ? 'Enlaces del proyecto' : 'Project links') + '">' +
          '<a href="' + GITHUB + '" rel="noopener">GitHub</a>' +
          '<a href="' + DEMO + '">' + (es ? 'Referencia de Pinamar Turnos' : 'Pinamar Turnos reference') + '</a>' +
          '<a href="/' + (es ? 'en' : 'es') + '">' + (es ? 'English' : 'Español') + '</a>' +
        '</nav>' +
        '<p class="public-footer__note">' +
          (es
            ? 'La IA prepara y sugiere. La decisión y el vínculo siguen en manos del equipo de salud.'
            : 'AI prepares and suggests. Decisions and human contact stay with the care team.') +
        '</p>' +
        '<p class="public-footer__credit"><a href="https://icons8.com" rel="noopener">' +
          (es ? 'Íconos de Icons8' : 'Icons by Icons8') +
        '</a></p>' +
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
