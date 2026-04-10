/* ===================================================
   NexGen Dubai — education.js
=================================================== */

/* ── Mobile Nav (global, runs before DOMContentLoaded) ── */
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

  /* ── Bind hamburger & close ── */
  var hamburger = document.getElementById('hamburger');
  var closeBtn  = document.getElementById('mobile-nav-close');
  var mobileNav = document.getElementById('mobile-nav');
  if (hamburger) hamburger.addEventListener('click', window.openMobileNav);
  if (closeBtn)  closeBtn.addEventListener('click', window.closeMobileNav);
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

  /* ── Custom Cursor ── */
  var cursor   = document.querySelector('.cursor');
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
    if (cursor)   cursor.style.display   = 'none';
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
  }, { passive:true });
  if (backTop) backTop.addEventListener('click', function() { window.scrollTo({ top:0, behavior:'smooth' }); });

  /* ── Scroll Reveal ── */
  var revEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  var revObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revEls.forEach(function(el) { revObs.observe(el); });

  /* ── Counter Animation ── */
  function animCounter(el, target) {
    var isFloat = String(target).indexOf('.') !== -1;
    var inc = target / (2000/16);
    var cur = 0;
    var t = setInterval(function() {
      cur = Math.min(cur + inc, target);
      el.textContent = isFloat ? cur.toFixed(1) : Math.floor(cur).toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 16);
  }
  var cEls = document.querySelectorAll('[data-counter]');
  var cObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { animCounter(e.target, parseFloat(e.target.dataset.counter)); cObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  cEls.forEach(function(el) { cObs.observe(el); });

  /* ── Marquee clone ── */
  var mq = document.querySelector('.marquee-track');
  if (mq) mq.parentElement.appendChild(mq.cloneNode(true));

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var answer = btn.nextElementSibling;
      var isOpen = btn.classList.contains('open');
      /* close all */
      document.querySelectorAll('.faq-question.open').forEach(function(q) {
        q.classList.remove('open');
        q.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  /* ── Application Form ── */
  var appForm = document.getElementById('edu-apply-form');
  var appSuccess = document.getElementById('edu-form-success');
  if (appForm) {
    appForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = appForm.querySelector('.form-submit');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      setTimeout(function() {
        appForm.style.display = 'none';
        if (appSuccess) appSuccess.style.display = 'block';
      }, 1500);
    });
  }

  /* ── Newsletter form ── */
  var nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = nlForm.querySelector('input');
      var btn   = nlForm.querySelector('button');
      if (input && input.value) {
        btn.textContent = '✓ Done!';
        btn.style.background = '#1a7a3a';
        input.value = '';
        setTimeout(function() { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
      }
    });
  }

  /* ── Partner card tilt (desktop) ── */
  if (!('ontouchstart' in window)) {
    document.querySelectorAll('.edu-partner-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var r = card.getBoundingClientRect();
        var x = ((e.clientX-r.left)/r.width  - 0.5) *  6;
        var y = ((e.clientY-r.top) /r.height - 0.5) * -6;
        card.style.transform = 'perspective(900px) rotateX('+y+'deg) rotateY('+x+'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function() { card.style.transform = ''; });
    });
  }

  /* ── Active nav link ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link[data-section]');
  var secObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        navLinks.forEach(function(l) {
          l.style.color = l.dataset.section === e.target.id ? 'var(--blue)' : '';
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(function(s) { secObs.observe(s); });

  /* ── Numbers count-up for hero stats ── */
  var heroStats = document.querySelectorAll('.edu-hero-stat-num[data-counter]');
  var heroObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { animCounter(e.target, parseFloat(e.target.dataset.counter)); heroObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  heroStats.forEach(function(el) { heroObs.observe(el); });

});