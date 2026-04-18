/* ===================================================
   NexGen Dubai — blog-post.js
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
  /* Mobile nav */
  var ham = document.getElementById('hamburger');
  var closeBtn = document.getElementById('mobile-nav-close');
  if (ham) ham.addEventListener('click', window.openMobileNav);
  if (closeBtn) closeBtn.addEventListener('click', window.closeMobileNav);
  var mobileNav = document.getElementById('mobile-nav');
  if (mobileNav) {
    mobileNav.querySelectorAll('a.no-dropdown,.mobile-dropdown a,.mobile-nav-footer a').forEach(function (l) { l.addEventListener('click', window.closeMobileNav); });
    document.querySelectorAll('.mobile-nav-item[data-dropdown]').forEach(function (item) {
      var t = item.querySelector('.mobile-nav-link'); if (!t) return;
      t.addEventListener('click', function () {
        var open = item.classList.contains('open');
        document.querySelectorAll('.mobile-nav-item[data-dropdown].open').forEach(function (el) { el.classList.remove('open'); });
        if (!open) item.classList.add('open');
      });
    });
  }
  /* Cursor */
  var cursor = document.querySelector('.cursor'), follower = document.querySelector('.cursor-follower');
  if (cursor && follower && !('ontouchstart' in window)) {
    var mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; cursor.style.transform = 'translate(' + (mx - 5) + 'px,' + (my - 5) + 'px)'; });
    (function loop() { fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12; follower.style.transform = 'translate(' + (fx - 18) + 'px,' + (fy - 18) + 'px)'; requestAnimationFrame(loop); })();
  } else { if (cursor) cursor.style.display = 'none'; if (follower) follower.style.display = 'none'; }
  /* Scroll */
  var prog = document.getElementById('scroll-progress'), backTop = document.getElementById('back-top'), navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    var st = window.scrollY, dh = document.documentElement.scrollHeight - window.innerHeight;
    if (prog) prog.style.width = ((st / dh) * 100) + '%';
    if (navbar) navbar.classList.toggle('scrolled', st > 80);
    if (backTop) backTop.classList.toggle('show', st > 400);
    highlightToc();
  }, { passive: true });
  if (backTop) backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  /* Reveal */
  var revObs = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } }); }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function (el) { revObs.observe(el); });
  /* TOC */
  var tocLinks = document.querySelectorAll('.bp-toc-link');
  function highlightToc() {
    if (!tocLinks.length) return;
    var scrollPos = window.scrollY + 140;
    var sections = document.querySelectorAll('.bp-article [id]');
    var active = null;
    sections.forEach(function (sec) { if (sec.offsetTop <= scrollPos) active = sec.id; });
    tocLinks.forEach(function (link) { link.classList.toggle('active', link.getAttribute('href') === '#' + active); });
  }
  tocLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 120, behavior: 'smooth' });
    });
  });
  /* Share buttons */
  document.querySelectorAll('.bp-share-btn[data-share]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.dataset.share;
      var url = encodeURIComponent(window.location.href);
      var title = encodeURIComponent(document.title);
      var shareUrl = '';
      if (type === 'fb') shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
      if (type === 'tw') shareUrl = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title;
      if (type === 'li') shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url;
      if (type === 'wa') shareUrl = 'https://wa.me/?text=' + title + '%20' + url;
      if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    });
  });
  /* Newsletter */
  var nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = nlForm.querySelector('input'), btn = nlForm.querySelector('button');
      if (inp && inp.value) { btn.textContent = '✓ Done!'; btn.style.background = '#1a7a3a'; inp.value = ''; setTimeout(function () { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000); }
    });
  }
});