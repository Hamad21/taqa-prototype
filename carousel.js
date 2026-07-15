// Minimal vanilla replacement for the React-driven announcements carousel.
(function () {
  var track = document.getElementById('slidesContainerForAnnouncements');
  if (!track) return;
  var cards = Array.prototype.slice.call(track.children);
  if (cards.length < 2) return;
  var wrap = track.parentElement;
  var prev = document.querySelector('button[aria-label^="Previous group"]');
  var next = document.querySelector('button[aria-label^="Next group"]');
  var dots = Array.prototype.slice.call(document.querySelectorAll('.carouselDotButton_dot__QAmC2'));
  var idx = 0;

  function step() {
    var a = cards[0].getBoundingClientRect();
    var b = cards[1].getBoundingClientRect();
    return b.left - a.left;
  }
  function visibleCount() {
    return Math.max(1, Math.round(wrap.getBoundingClientRect().width / step()));
  }
  function maxIdx() {
    return Math.max(0, cards.length - visibleCount());
  }
  function setDisabled(btn, disabled) {
    if (!btn) return;
    btn.setAttribute('aria-disabled', String(disabled));
    btn.classList.toggle('button_disabled__eIwR3', disabled);
    btn.classList.toggle('customCarousel_disabledBtn__Shsaf', disabled);
  }
  function render() {
    var m = maxIdx();
    if (idx > m) idx = m;
    if (idx < 0) idx = 0;
    track.style.transition = 'transform .45s ease';
    track.style.transform = 'translate3d(' + (-idx * step()) + 'px, 0px, 0px)';
    setDisabled(prev, idx === 0);
    setDisabled(next, idx === m);
    var page = m === 0 ? 0 : Math.round(idx / visibleCount());
    dots.forEach(function (d, i) {
      d.classList.toggle('carouselDotButton_active__f_RLw', i === Math.min(page, dots.length - 1));
    });
  }
  if (prev) prev.addEventListener('click', function () { idx -= visibleCount(); render(); });
  if (next) next.addEventListener('click', function () { idx += visibleCount(); render(); });
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { idx = i * visibleCount(); render(); });
  });
  window.addEventListener('resize', render);
  render();
})();

// Prevent horizontal overflow from static carousel tracks (mobile):
// clip the carousel viewports themselves rather than the whole page.
(function () {
  var s = document.createElement('style');
  s.textContent = '.featuresCarousel_carouseltrackcontainer__g20yE{overflow:hidden}' +
    '.customCarousel_carousel__RG2l3{overflow:hidden}' +
    '@media (max-width:900px){.footer_footer__Im9Y3{overflow-x:hidden}.footer_footercontent__uEfx4{flex-wrap:wrap}}';
  document.head.appendChild(s);
})();

// Wire the features carousel dots (visible on mobile) to slide the track.
(function () {
  var track = document.querySelector('.featuresCarousel_carouseltrack__lAlJk');
  if (!track) return;
  var slides = Array.prototype.slice.call(track.children);
  var dots = Array.prototype.slice.call(document.querySelectorAll('.featuresCarousel_dot__Lrlfh'));
  if (slides.length < 2 || !dots.length) return;
  function step() {
    var a = slides[0].getBoundingClientRect();
    var b = slides[1].getBoundingClientRect();
    return b.left - a.left;
  }
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () {
      track.style.transition = 'transform .45s ease';
      track.style.transform = 'translateX(' + (-i * step()) + 'px)';
      dots.forEach(function (o, j) {
        o.classList.toggle('featuresCarousel_active__O0l_7', j === i);
      });
    });
  });
})();
