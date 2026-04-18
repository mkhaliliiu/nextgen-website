/* ===================================================
   NexGen Dubai — services.js
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

  /* ── Mobile nav dropdowns ── */
  var ham = document.getElementById('hamburger');
  var closeBtn = document.getElementById('mobile-nav-close');
  if (ham) ham.addEventListener('click', window.openMobileNav);
  if (closeBtn) closeBtn.addEventListener('click', window.closeMobileNav);
  var mobileNav = document.getElementById('mobile-nav');
  if (mobileNav) {
    mobileNav.querySelectorAll('a.no-dropdown, .mobile-dropdown a, .mobile-nav-footer a')
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
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) { revObs.observe(el); });

  /* ── Marquee clone ── */
  var mq = document.querySelector('.marquee-track');
  if (mq) mq.parentElement.appendChild(mq.cloneNode(true));

  /* ── Hero pill filter → scroll to pillar ── */
  document.querySelectorAll('.sv-hero-pill[data-target]').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.sv-hero-pill').forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      var target = document.querySelector(pill.dataset.target);
      if (target) window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
    });
  });

  /* ── Hero tab click → scroll ── */
  document.querySelectorAll('.sv-hero-tab[data-target]').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.sv-hero-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var target = document.querySelector(tab.dataset.target);
      if (target) window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
    });
  });

  /* ── Active tab on scroll ── */
  var pillars = document.querySelectorAll('.sv-pillar[id]');
  var tabs = document.querySelectorAll('.sv-hero-tab[data-target]');
  window.addEventListener('scroll', function () {
    var scrollPos = window.scrollY + 140;
    var activeId = null;
    pillars.forEach(function (p) { if (p.offsetTop <= scrollPos) activeId = p.id; });
    tabs.forEach(function (t) {
      t.classList.toggle('active', t.dataset.target === '#' + activeId);
    });
  }, { passive: true });

  /* ── Card stagger ── */
  document.querySelectorAll('.sv-cards-grid').forEach(function (grid) {
    var cards = grid.querySelectorAll('.sv-card');
    var gridObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          cards.forEach(function (card, i) {
            setTimeout(function () {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, i * 90);
          });
          gridObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    cards.forEach(function (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(32px)';
      card.style.transition = 'opacity .6s ease, transform .6s ease, box-shadow .4s, border-color .4s, transform .4s';
    });
    gridObs.observe(grid);
  });

  /* ── 3-D tilt on service cards ── */
  if (!('ontouchstart' in window)) {
    document.querySelectorAll('.sv-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width - 0.5) * 8;
        var y = ((e.clientY - r.top) / r.height - 0.5) * -8;
        card.style.transform = 'perspective(800px) rotateX(' + y + 'deg) rotateY(' + x + 'deg) translateY(-7px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ── Why-cards entrance ── */
  document.querySelectorAll('.sv-why-card').forEach(function (card, i) {
    card.style.opacity = '0'; card.style.transform = 'translateY(28px)';
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          setTimeout(function () {
            card.style.transition = 'opacity .65s ease, transform .65s ease, background .3s, border-color .3s, box-shadow .3s';
            card.style.opacity = '1'; card.style.transform = '';
          }, i * 110);
          obs.unobserve(card);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(card);
  });

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
});