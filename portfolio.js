/* ===================================================
   NexGen Dubai — portfolio.js
=================================================== */
window.openMobileNav = function () {
  var nav = document.getElementById('mobile-nav');
  var ham = document.getElementById('hamburger');
  if (!nav) return;
  nav.style.display = 'flex'; nav.style.opacity = '0';
  document.body.style.overflow = 'hidden';
  if (ham) ham.classList.add('open');
  setTimeout(function () { nav.style.opacity = '1'; }, 10);
};
window.closeMobileNav = function () {
  var nav = document.getElementById('mobile-nav');
  var ham = document.getElementById('hamburger');
  if (!nav) return;
  nav.style.opacity = '0'; document.body.style.overflow = '';
  if (ham) ham.classList.remove('open');
  setTimeout(function () {
    nav.style.display = 'none';
    nav.querySelectorAll('.mobile-nav-item.open').forEach(function (el) { el.classList.remove('open'); });
  }, 350);
};

document.addEventListener('DOMContentLoaded', function () {

  /* ── Mobile nav ── */
  var ham = document.getElementById('hamburger');
  var closeBtn = document.getElementById('mobile-nav-close');
  if (ham) ham.addEventListener('click', window.openMobileNav);
  if (closeBtn) closeBtn.addEventListener('click', window.closeMobileNav);
  var mobileNav = document.getElementById('mobile-nav');
  if (mobileNav) {
    mobileNav.querySelectorAll('a.no-dropdown,.mobile-dropdown a,.mobile-nav-footer a')
      .forEach(function (l) { l.addEventListener('click', window.closeMobileNav); });
    document.querySelectorAll('.mobile-nav-item[data-dropdown]').forEach(function (item) {
      var t = item.querySelector('.mobile-nav-link'); if (!t) return;
      t.addEventListener('click', function () {
        var open = item.classList.contains('open');
        document.querySelectorAll('.mobile-nav-item[data-dropdown].open').forEach(function (el) { el.classList.remove('open'); });
        if (!open) item.classList.add('open');
      });
    });
  }

  /* ── Custom cursor ── */
  var cursor = document.querySelector('.cursor');
  var follower = document.querySelector('.cursor-follower');
  if (cursor && follower && !('ontouchstart' in window)) {
    var mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = 'translate(' + (mx - 5) + 'px,' + (my - 5) + 'px)';
    });
    (function loop() {
      fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
      follower.style.transform = 'translate(' + (fx - 18) + 'px,' + (fy - 18) + 'px)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('.pf-card,.btn,.pf-filter-btn,.nav-link').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('cursor--hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('cursor--hover'); });
    });
  } else {
    if (cursor) cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
  }

  /* ── Scroll progress + navbar + back-top ── */
  var prog = document.getElementById('scroll-progress');
  var backTop = document.getElementById('back-top');
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    var st = window.scrollY;
    var dh = document.documentElement.scrollHeight - window.innerHeight;
    if (prog) prog.style.width = ((st / dh) * 100) + '%';
    if (navbar) navbar.classList.toggle('scrolled', st > 80);
    if (backTop) backTop.classList.toggle('show', st > 400);
  }, { passive: true });
  if (backTop) backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ── Scroll reveal ── */
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });

  /* ── Animated stat counters ── */
  function animCounter(el, target) {
    var isFloat = String(target).includes('.');
    var inc = target / (1800 / 16), cur = 0;
    var t = setInterval(function () {
      cur = Math.min(cur + inc, target);
      el.textContent = isFloat ? cur.toFixed(0) : Math.floor(cur).toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 16);
  }
  var cObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animCounter(e.target, parseFloat(e.target.dataset.counter)); cObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(function (el) { cObs.observe(el); });

  /* ── Filter logic ── */
  var cards = document.querySelectorAll('.pf-card[data-cat]');
  var filterBtns = document.querySelectorAll('.pf-filter-btn');
  var countEl = document.getElementById('pf-count');
  var emptyEl = document.getElementById('pf-empty');
  var activeFilter = 'all';

  function applyFilter() {
    var visible = 0;
    cards.forEach(function (card, i) {
      var cats = (card.dataset.cat || '').split(' ');
      var show = activeFilter === 'all' || cats.indexOf(activeFilter) !== -1;
      if (show) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px) scale(.97)';
        setTimeout(function () {
          card.style.transition = 'opacity .55s ease,transform .55s ease,border-color .4s,box-shadow .4s';
          card.style.opacity = '1';
          card.style.transform = '';
        }, Math.min(i * 70, 420));
        visible++;
      } else {
        card.classList.add('hidden');
      }
    });
    if (countEl) countEl.textContent = visible + ' project' + (visible !== 1 ? 's' : '');
    if (emptyEl) emptyEl.classList.toggle('show', visible === 0);
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilter();
    });
  });

  /* ── Initial card entrance ── */
  cards.forEach(function (card, i) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(32px) scale(.98)';
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !card.classList.contains('hidden')) {
          setTimeout(function () {
            card.style.transition = 'opacity .7s ease, transform .7s ease, border-color .4s, box-shadow .4s';
            card.style.opacity = '1';
            card.style.transform = '';
          }, Math.min(i * 80, 560));
          obs.unobserve(card);
        }
      });
    }, { threshold: 0.05 });
    obs.observe(card);
  });

  /* Set initial count */
  if (countEl) countEl.textContent = cards.length + ' projects';

  /* ── Newsletter ── */
  var nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = nlForm.querySelector('input'), btn = nlForm.querySelector('button');
      if (inp && inp.value) {
        btn.textContent = '✓ Done!'; btn.style.background = '#1a7a3a';
        inp.value = '';
        setTimeout(function () { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
      }
    });
  }

  /* ── "Quote for project" CTA buttons inside cards ── */
  document.querySelectorAll('.pf-card-hover-cta').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  });
});