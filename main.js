/* ===================================================
   NexGen Dubai — main.js (v5 — Final)
=================================================== */

/* ── Mobile Nav — runs IMMEDIATELY, no DOMContentLoaded wait ── */
window.openMobileNav = function() {
  var nav = document.getElementById('mobile-nav');
  var ham = document.getElementById('hamburger');
  if (!nav) return;
  nav.style.display    = 'flex';
  nav.style.opacity    = '0';
  nav.style.visibility = 'visible';
  document.body.style.overflow = 'hidden';
  if (ham) ham.classList.add('open');
  /* tiny delay so display:flex is painted before opacity animates */
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
    nav.style.display    = 'none';
    nav.style.visibility = 'hidden';
    /* close any open accordions */
    var opens = nav.querySelectorAll('.mobile-nav-item.open');
    opens.forEach(function(el) { el.classList.remove('open'); });
  }, 350);
};

document.addEventListener('DOMContentLoaded', function() {

  /* ── Re-bind hamburger + close in case they were parsed late ── */
  var hamburger    = document.getElementById('hamburger');
  var mobileNav    = document.getElementById('mobile-nav');
  var closeBtn     = document.getElementById('mobile-nav-close');

  if (hamburger) {
    hamburger.addEventListener('click', window.openMobileNav);
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', window.closeMobileNav);
  }

  /* close when tapping a regular link inside the nav */
  if (mobileNav) {
    var plainLinks = mobileNav.querySelectorAll('a.no-dropdown, .mobile-dropdown a, .mobile-nav-footer a');
    plainLinks.forEach(function(link) {
      link.addEventListener('click', window.closeMobileNav);
    });
  }

  /* accordion dropdowns */
  document.querySelectorAll('.mobile-nav-item[data-dropdown]').forEach(function(item) {
    var trigger = item.querySelector('.mobile-nav-link');
    if (!trigger) return;
    trigger.addEventListener('click', function() {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.mobile-nav-item[data-dropdown].open')
        .forEach(function(el) { el.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Custom Cursor (desktop only) ──────────────────── */
  var cursor   = document.querySelector('.cursor');
  var follower = document.querySelector('.cursor-follower');
  var mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  if (cursor && follower && !('ontouchstart' in window)) {
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.transform = 'translate(' + (mouseX - 5) + 'px,' + (mouseY - 5) + 'px)';
    });
    (function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.transform = 'translate(' + (followerX - 18) + 'px,' + (followerY - 18) + 'px)';
      requestAnimationFrame(animateFollower);
    })();
  } else {
    /* hide on touch devices */
    if (cursor)   cursor.style.display   = 'none';
    if (follower) follower.style.display = 'none';
  }

  /* ── Scroll: progress bar + navbar + back-to-top ───── */
  var progressBar = document.getElementById('scroll-progress');
  var backTop     = document.getElementById('back-top');
  var navbar      = document.getElementById('navbar');

  window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 80);
    if (backTop) backTop.classList.toggle('show', scrollTop > 400);
  });

  if (backTop) {
    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Scroll Reveal ─────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  var revealObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function(el) { revealObs.observe(el); });

  /* ── Counter Animation ─────────────────────────────── */
  function animateCounter(el, target, duration) {
    duration = duration || 2000;
    var isDecimal = String(target).indexOf('.') !== -1;
    var increment = target / (duration / 16);
    var current = 0;
    var timer = setInterval(function() {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
    }, 16);
  }

  var counterEls = document.querySelectorAll('[data-counter]');
  var counterObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseFloat(entry.target.dataset.counter));
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(function(el) { counterObs.observe(el); });

  /* ── Testimonials Slider ───────────────────────────── */
  var track   = document.getElementById('testimonials-track');
  var dots    = document.querySelectorAll('.testimonial-dot');
  var prevBtn = document.getElementById('testimonial-prev');
  var nextBtn = document.getElementById('testimonial-next');
  var currentSlide = 0;
  var autoSlideTimer;

  function getCardsPerView() {
    var w = window.innerWidth;
    if (w >= 1100) return 3;
    if (w >= 768)  return 2;
    return 1;
  }

  function goToSlide(idx) {
    if (!track) return;
    var cards    = track.querySelectorAll('.testimonial-card');
    var total    = cards.length;
    var perView  = getCardsPerView();
    var maxSlide = Math.max(0, total - perView);
    if (idx < 0) idx = maxSlide;
    if (idx > maxSlide) idx = 0;
    currentSlide = idx;
    var cardWidth = cards[0].offsetWidth + 20;
    track.style.transform = 'translateX(-' + (currentSlide * cardWidth) + 'px)';
    dots.forEach(function(d, i) { d.classList.toggle('active', i === currentSlide); });
  }

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      clearInterval(autoSlideTimer); goToSlide(i); startAutoSlide();
    });
  });
  if (prevBtn) prevBtn.addEventListener('click', function() {
    clearInterval(autoSlideTimer); goToSlide(currentSlide - 1); startAutoSlide();
  });
  if (nextBtn) nextBtn.addEventListener('click', function() {
    clearInterval(autoSlideTimer); goToSlide(currentSlide + 1); startAutoSlide();
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(function() { goToSlide(currentSlide + 1); }, 5000);
  }
  startAutoSlide();

  if (track) {
    var startX = 0;
    track.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        clearInterval(autoSlideTimer);
        goToSlide(currentSlide + (diff > 0 ? 1 : -1));
        startAutoSlide();
      }
    });
  }

  window.addEventListener('resize', function() { goToSlide(currentSlide); });

  /* ── Marquee duplicate ─────────────────────────────── */
  var marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.parentElement.appendChild(marqueeTrack.cloneNode(true));
  }

  /* ── Service card tilt (desktop only) ─────────────── */
  if (!('ontouchstart' in window)) {
    document.querySelectorAll('.service-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var r = card.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width  - 0.5) *  8;
        var y = ((e.clientY - r.top)  / r.height - 0.5) * -8;
        card.style.transform = 'perspective(800px) rotateX(' + y + 'deg) rotateY(' + x + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function() { card.style.transform = ''; });
    });
  }

  /* ── Newsletter form ───────────────────────────────── */
  var nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = nlForm.querySelector('input');
      var btn   = nlForm.querySelector('button');
      if (input && input.value) {
        btn.textContent = '✓ Subscribed!';
        btn.style.background = '#1a7a3a';
        input.value = '';
        setTimeout(function() {
          btn.textContent = 'Subscribe';
          btn.style.background = '';
        }, 3000);
      }
    });
  }

  /* ── Active nav link on scroll ─────────────────────── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link[data-section]');
  var secObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function(l) {
          l.style.color = l.dataset.section === entry.target.id ? 'var(--blue)' : '';
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(function(s) { secObs.observe(s); });

  /* ── Parallax hero floats ──────────────────────────── */
  var heroFloats = document.querySelectorAll('.hero-float');
  window.addEventListener('scroll', function() {
    var s = window.scrollY;
    heroFloats.forEach(function(el, i) {
      el.style.transform = 'translateY(' + (s * (0.05 + i * 0.03)) + 'px)';
    });
  }, { passive: true });

});