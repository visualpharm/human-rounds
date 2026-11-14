// Marks the menu entry of the section being read.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.menu a'));
  var items = links.map(function (a) {
    return { a: a, s: document.getElementById(a.getAttribute('href').slice(1)) };
  }).filter(function (x) { return x.s; });
  function mark() {
    var line = window.innerHeight * 0.35, cur = items[0];
    items.forEach(function (x) { if (x.s.getBoundingClientRect().top <= line) cur = x; });
    items.forEach(function (x) { x.a.setAttribute('aria-current', x === cur ? 'true' : 'false'); });
    var m = cur.a.closest('.menu');
    if (m && m.scrollWidth > m.clientWidth) {
      m.scrollLeft = cur.a.offsetLeft - 16;
    }
  }
  window.addEventListener('scroll', mark, { passive: true });
  window.addEventListener('resize', mark);
  mark();
})();
