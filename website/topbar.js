/* Human Rounds topbar — the SINGLE source of the system header.
   Every page renders it the same way; only the values differ:
     <div class="topbar" data-topbar data-home="/demo" data-sub="Registro del paciente"></div>
   - omit data-home for an unlinked wordmark (mid-flow pages: intake, demo landing)
   - data-sub-id makes the subtitle addressable so a page script can set it live
     (intake/console write the questionnaire label into #qlabel)
   Edit the header HERE and every page updates — no per-page copies to keep in sync. */
(function () {
  function build(bar) {
    var home = bar.getAttribute('data-home');
    var sub = bar.getAttribute('data-sub') || '';
    var subId = bar.getAttribute('data-sub-id');
    var logo = home
      ? '<a class="logo" href="' + home + '">Human Rounds</a>'
      : '<span class="logo">Human Rounds</span>';
    var subEl = '<span class="sub"' + (subId ? ' id="' + subId + '"' : '') + '>' + sub + '</span>';
    bar.innerHTML = logo + subEl;
  }
  function init() {
    var bars = document.querySelectorAll('.topbar[data-topbar]');
    for (var i = 0; i < bars.length; i++) build(bars[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
