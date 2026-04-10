/* ===================================================
   NexGen Dubai — legal.js
   Shared script for faq.html + privacy.html
=================================================== */
window.openMobileNav = function() {
  var nav = document.getElementById('mobile-nav');
  var ham = document.getElementById('hamburger');
  if (!nav) return;
  nav.style.display = 'flex'; nav.style.opacity = '0';
  document.body.style.overflow = 'hidden';
  if (ham) ham.classList.add('open');
  setTimeout(function(){ nav.style.opacity = '1'; }, 10);
};
window.closeMobileNav = function() {
  var nav = document.getElementById('mobile-nav');
  var ham = document.getElementById('hamburger');
  if (!nav) return;
  nav.style.opacity = '0'; document.body.style.overflow = '';
  if (ham) ham.classList.remove('open');
  setTimeout(function(){
    nav.style.display = 'none';
    nav.querySelectorAll('.mobile-nav-item.open').forEach(function(el){ el.classList.remove('open'); });
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
    mobileNav.querySelectorAll('a.no-dropdown,.mobile-dropdown a,.mobile-nav-footer a').forEach(function(l){ l.addEventListener('click', window.closeMobileNav); });
    document.querySelectorAll('.mobile-nav-item[data-dropdown]').forEach(function(item){
      var t = item.querySelector('.mobile-nav-link');
      if (!t) return;
      t.addEventListener('click', function(){
        var open = item.classList.contains('open');
        document.querySelectorAll('.mobile-nav-item[data-dropdown].open').forEach(function(el){ el.classList.remove('open'); });
        if (!open) item.classList.add('open');
      });
    });
  }

  /* ── Custom Cursor ── */
  var cursor = document.querySelector('.cursor');
  var follower = document.querySelector('.cursor-follower');
  if (cursor && follower && !('ontouchstart' in window)) {
    var mx=0,my=0,fx=0,fy=0;
    document.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; cursor.style.transform='translate('+(mx-5)+'px,'+(my-5)+'px)'; });
    (function loop(){ fx+=(mx-fx)*.12; fy+=(my-fy)*.12; follower.style.transform='translate('+(fx-18)+'px,'+(fy-18)+'px)'; requestAnimationFrame(loop); })();
  } else { if(cursor) cursor.style.display='none'; if(follower) follower.style.display='none'; }

  /* ── Scroll ── */
  var prog = document.getElementById('scroll-progress');
  var backTop = document.getElementById('back-top');
  var navbar  = document.getElementById('navbar');
  window.addEventListener('scroll', function(){
    var st = window.scrollY, dh = document.documentElement.scrollHeight - window.innerHeight;
    if (prog)    prog.style.width = ((st/dh)*100)+'%';
    if (navbar)  navbar.classList.toggle('scrolled', st > 80);
    if (backTop) backTop.classList.toggle('show', st > 400);
    highlightToc();
  }, { passive: true });
  if (backTop) backTop.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });

  /* ── Scroll Reveal ── */
  var revEls = document.querySelectorAll('.reveal');
  var revObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  }, { threshold:.08 });
  revEls.forEach(function(el){ revObs.observe(el); });

  /* ── Newsletter ── */
  var nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e){
      e.preventDefault();
      var inp=nlForm.querySelector('input'), btn=nlForm.querySelector('button');
      if(inp&&inp.value){ btn.textContent='✓ Done!'; btn.style.background='#1a7a3a'; inp.value=''; setTimeout(function(){ btn.textContent='Subscribe'; btn.style.background=''; },3000); }
    });
  }

  /* ════════════════════════════════════════════
     FAQ — Accordion + Filter + Search
  ════════════════════════════════════════════ */
  var faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {

    /* Accordion */
    faqItems.forEach(function(item){
      var q  = item.querySelector('.faq-q');
      var a  = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.addEventListener('click', function(){
        var isOpen = item.classList.contains('open');
        /* Close all others */
        faqItems.forEach(function(i){
          i.classList.remove('open');
          var ia = i.querySelector('.faq-a'); if(ia) ia.style.maxHeight = '0';
        });
        if (!isOpen) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    });

    /* Category filter */
    var filterBtns = document.querySelectorAll('.faq-filter-btn');
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.dataset.cat;
        var sections = document.querySelectorAll('.faq-section[data-cat]');
        sections.forEach(function(sec){
          if (cat === 'all' || sec.dataset.cat === cat) {
            sec.classList.remove('hidden');
          } else {
            sec.classList.add('hidden');
          }
        });
        /* Reset search */
        var si = document.getElementById('faq-search');
        if (si) si.value = '';
        faqItems.forEach(function(i){ i.style.display=''; });
        checkEmpty();
      });
    });

    /* Search */
    var searchInput = document.getElementById('faq-search');
    if (searchInput) {
      searchInput.addEventListener('input', function(){
        var q = searchInput.value.trim().toLowerCase();
        /* Reset category filter */
        filterBtns.forEach(function(b){ b.classList.remove('active'); });
        var allBtn = document.querySelector('.faq-filter-btn[data-cat="all"]');
        if (allBtn) allBtn.classList.add('active');
        document.querySelectorAll('.faq-section[data-cat]').forEach(function(sec){ sec.classList.remove('hidden'); });
        faqItems.forEach(function(item){
          if (!q) { item.style.display=''; return; }
          var text = (item.querySelector('.faq-q-text') ? item.querySelector('.faq-q-text').textContent : '')
                   + ' ' + (item.querySelector('.faq-a') ? item.querySelector('.faq-a').textContent : '');
          item.style.display = text.toLowerCase().includes(q) ? '' : 'none';
        });
        checkEmpty();
      });
    }

    function checkEmpty() {
      var emptyMsg = document.getElementById('faq-empty');
      if (!emptyMsg) return;
      var anyVisible = Array.from(faqItems).some(function(i){ return i.style.display !== 'none'; });
      emptyMsg.style.display = anyVisible ? 'none' : 'block';
    }

    /* Open first item by default */
    var firstItem = document.querySelector('.faq-item');
    if (firstItem) {
      firstItem.classList.add('open');
      var firstA = firstItem.querySelector('.faq-a');
      if (firstA) { setTimeout(function(){ firstA.style.maxHeight = firstA.scrollHeight+'px'; }, 80); }
    }
  }

  /* ════════════════════════════════════════════
     PRIVACY — sticky TOC highlight
  ════════════════════════════════════════════ */
  var tocLinks = document.querySelectorAll('.privacy-toc-link');
  function highlightToc() {
    if (!tocLinks.length) return;
    var scrollPos = window.scrollY + 140;
    var sections = document.querySelectorAll('.privacy-section[id]');
    var active = null;
    sections.forEach(function(sec){
      if (sec.offsetTop <= scrollPos) active = sec.id;
    });
    tocLinks.forEach(function(link){
      link.classList.toggle('active', link.getAttribute('href') === '#'+active);
    });
  }
  /* Smooth scroll on TOC click */
  tocLinks.forEach(function(link){
    link.addEventListener('click', function(e){
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 120, behavior: 'smooth' });
    });
  });

});