/* ===================================================
   NexGen Dubai — partners.js
   Partners & Programs page
=================================================== */

/* ── Mobile Nav global functions ── */
window.openMobileNav = function() {
  var nav = document.getElementById('mobile-nav');
  var ham = document.getElementById('hamburger');
  if (!nav) return;
  nav.style.display = 'flex';
  nav.style.opacity = '0';
  document.body.style.overflow = 'hidden';
  if (ham) ham.classList.add('open');
  setTimeout(function() { nav.style.opacity = '1'; }, 10);
};
window.closeMobileNav = function() {
  var nav = document.getElementById('mobile-nav');
  var ham = document.getElementById('hamburger');
  if (!nav) return;
  nav.style.opacity = '0';
  document.body.style.overflow = '';
  if (ham) ham.classList.remove('open');
  setTimeout(function() {
    nav.style.display = 'none';
    nav.style.visibility = 'hidden';
    nav.querySelectorAll('.mobile-nav-item.open').forEach(function(el) { el.classList.remove('open'); });
  }, 350);
};

document.addEventListener('DOMContentLoaded', function() {

  /* ── Mobile nav bindings ── */
  var ham      = document.getElementById('hamburger');
  var closeBtn = document.getElementById('mobile-nav-close');
  var mobileNav = document.getElementById('mobile-nav');
  if (ham) ham.addEventListener('click', window.openMobileNav);
  if (closeBtn) closeBtn.addEventListener('click', window.closeMobileNav);
  if (mobileNav) {
    mobileNav.querySelectorAll('a.no-dropdown, .mobile-dropdown a, .mobile-nav-footer a').forEach(function(l) {
      l.addEventListener('click', window.closeMobileNav);
    });
    document.querySelectorAll('.mobile-nav-item[data-dropdown]').forEach(function(item) {
      var trigger = item.querySelector('.mobile-nav-link');
      if (!trigger) return;
      trigger.addEventListener('click', function() {
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.mobile-nav-item[data-dropdown].open').forEach(function(el) { el.classList.remove('open'); });
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── Custom Cursor (desktop only) ── */
  var cursor = document.querySelector('.cursor');
  var follower = document.querySelector('.cursor-follower');
  if (cursor && follower && !('ontouchstart' in window)) {
    var mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', function(e) {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = 'translate(' + (mx-5) + 'px,' + (my-5) + 'px)';
    });
    (function anim() {
      fx += (mx-fx)*.12; fy += (my-fy)*.12;
      follower.style.transform = 'translate(' + (fx-18) + 'px,' + (fy-18) + 'px)';
      requestAnimationFrame(anim);
    })();
  } else {
    if (cursor) cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
  }

  /* ── Scroll: progress + navbar + back-to-top ── */
  var progressBar = document.getElementById('scroll-progress');
  var backTop     = document.getElementById('back-top');
  var navbar      = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    var st = window.scrollY;
    var dh = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = ((st/dh)*100) + '%';
    if (navbar)      navbar.classList.toggle('scrolled', st > 80);
    if (backTop)     backTop.classList.toggle('show', st > 400);
  }, { passive: true });
  if (backTop) backTop.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ── Scroll Reveal ── */
  var revEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  var revObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  revEls.forEach(function(el) { revObs.observe(el); });

  /* ── Counter Animation ── */
  function animCounter(el, target) {
    var inc = target / (2000/16);
    var cur = 0;
    var t = setInterval(function() {
      cur = Math.min(cur + inc, target);
      el.textContent = Math.floor(cur).toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 16);
  }
  var cObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { animCounter(e.target, parseFloat(e.target.dataset.counter)); cObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(function(el) { cObs.observe(el); });

  /* ── Marquee clone ── */
  var mq = document.querySelector('.marquee-track');
  if (mq) mq.parentElement.appendChild(mq.cloneNode(true));

  /* ══════════════════════════════════════════════════
     UNIVERSITY ACCORDION
  ══════════════════════════════════════════════════ */
  var uniCards = document.querySelectorAll('.pp-uni-card');

  uniCards.forEach(function(card) {
    var header = card.querySelector('.pp-uni-header');
    if (!header) return;

    header.addEventListener('click', function() {
      var isOpen = card.classList.contains('open');

      /* close all */
      uniCards.forEach(function(c) {
        c.classList.remove('open');
      });

      /* open clicked (unless it was already open) */
      if (!isOpen) {
        card.classList.add('open');
        /* Smooth scroll so the card is visible */
        setTimeout(function() {
          var rect = card.getBoundingClientRect();
          var scrollTop = window.scrollY + rect.top - 100;
          window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }, 80);
      }
    });

    /* ── Program level tabs (Undergrad / Postgrad) ── */
    var progTabs = card.querySelectorAll('.pp-prog-tab');
    var progPanels = card.querySelectorAll('.pp-prog-panel');

    progTabs.forEach(function(tab) {
      tab.addEventListener('click', function(e) {
        e.stopPropagation(); /* don't toggle accordion */
        progTabs.forEach(function(t) { t.classList.remove('pp-active'); });
        progPanels.forEach(function(p) { p.classList.remove('pp-active'); });
        tab.classList.add('pp-active');
        var target = card.querySelector('#' + tab.dataset.target);
        if (target) target.classList.add('pp-active');
      });
    });
  });

  /* ══════════════════════════════════════════════════
     FILTER TABS (All / Canada / UAE / Europe / Asia)
  ══════════════════════════════════════════════════ */
  var filterTabs = document.querySelectorAll('.pp-filter-tab');
  filterTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      filterTabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var filter = tab.dataset.filter;
      uniCards.forEach(function(card) {
        var region = card.dataset.region || 'all';
        if (filter === 'all' || region === filter) {
          card.style.display = '';
          setTimeout(function() { card.style.opacity = '1'; card.style.transform = ''; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(function() { card.style.display = 'none'; }, 300);
        }
        /* close all when filtering */
        card.classList.remove('open');
      });
    });
  });

  /* ── Newsletter form ── */
  var nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = nlForm.querySelector('input');
      var btn = nlForm.querySelector('button');
      if (input && input.value) {
        btn.textContent = '✓ Done!';
        btn.style.background = '#1a7a3a';
        input.value = '';
        setTimeout(function() { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
      }
    });
  }

});