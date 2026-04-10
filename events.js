/* ===================================================
   NexGen Dubai — events.js
=================================================== */

/* ── Global mobile nav ── */
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
  nav.style.opacity = '0';
  document.body.style.overflow = '';
  if (ham) ham.classList.remove('open');
  setTimeout(function(){
    nav.style.display = 'none';
    nav.querySelectorAll('.mobile-nav-item.open').forEach(function(el){ el.classList.remove('open'); });
  }, 350);
};

document.addEventListener('DOMContentLoaded', function() {

  /* ── Mobile nav bindings ── */
  var ham = document.getElementById('hamburger');
  var closeBtn = document.getElementById('mobile-nav-close');
  var mobileNav = document.getElementById('mobile-nav');
  if (ham)      ham.addEventListener('click', window.openMobileNav);
  if (closeBtn) closeBtn.addEventListener('click', window.closeMobileNav);
  if (mobileNav) {
    mobileNav.querySelectorAll('a.no-dropdown,.mobile-dropdown a,.mobile-nav-footer a').forEach(function(l){
      l.addEventListener('click', window.closeMobileNav);
    });
    document.querySelectorAll('.mobile-nav-item[data-dropdown]').forEach(function(item){
      var trigger = item.querySelector('.mobile-nav-link');
      if (!trigger) return;
      trigger.addEventListener('click', function(){
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.mobile-nav-item[data-dropdown].open').forEach(function(el){ el.classList.remove('open'); });
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ── Custom Cursor ── */
  var cursor = document.querySelector('.cursor');
  var follower = document.querySelector('.cursor-follower');
  if (cursor && follower && !('ontouchstart' in window)) {
    var mx=0, my=0, fx=0, fy=0;
    document.addEventListener('mousemove', function(e){
      mx=e.clientX; my=e.clientY;
      cursor.style.transform='translate('+(mx-5)+'px,'+(my-5)+'px)';
    });
    (function anim(){
      fx+=(mx-fx)*.12; fy+=(my-fy)*.12;
      follower.style.transform='translate('+(fx-18)+'px,'+(fy-18)+'px)';
      requestAnimationFrame(anim);
    })();
  } else {
    if(cursor) cursor.style.display='none';
    if(follower) follower.style.display='none';
  }

  /* ── Scroll: progress + navbar + back-to-top ── */
  var progressBar = document.getElementById('scroll-progress');
  var backTop     = document.getElementById('back-top');
  var navbar      = document.getElementById('navbar');
  window.addEventListener('scroll', function(){
    var st = window.scrollY;
    var dh = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = ((st/dh)*100)+'%';
    if (navbar)      navbar.classList.toggle('scrolled', st > 80);
    if (backTop)     backTop.classList.toggle('show', st > 400);
  }, { passive: true });
  if (backTop) backTop.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });

  /* ── Scroll Reveal ── */
  var revEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  var revObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  revEls.forEach(function(el){ revObs.observe(el); });

  /* ── Counters ── */
  function animCounter(el, target){
    var inc=target/(2000/16), cur=0;
    var t=setInterval(function(){
      cur=Math.min(cur+inc,target);
      el.textContent=Math.floor(cur).toLocaleString();
      if(cur>=target) clearInterval(t);
    },16);
  }
  var cObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ animCounter(e.target,parseFloat(e.target.dataset.counter)); cObs.unobserve(e.target); } });
  }, { threshold:0.5 });
  document.querySelectorAll('[data-counter]').forEach(function(el){ cObs.observe(el); });

  /* ── Marquee clone ── */
  var mq = document.querySelector('.marquee-track');
  if (mq) mq.parentElement.appendChild(mq.cloneNode(true));

  /* ── Hero event-type cards 3D tilt (desktop) ── */
  if (!('ontouchstart' in window)) {
    document.querySelectorAll('.ev-type-card, .ev-type-block').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var x = ((e.clientX-r.left)/r.width  - 0.5) * 8;
        var y = ((e.clientY-r.top) /r.height - 0.5) * -8;
        card.style.transform = 'perspective(800px) rotateX('+y+'deg) rotateY('+x+'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function(){ card.style.transform=''; });
    });
  }

  /* ── Parallax hero blobs ── */
  var heroGlows = document.querySelectorAll('.ev-hero-glow-1,.ev-hero-glow-2');
  window.addEventListener('scroll', function(){
    var s = window.scrollY;
    heroGlows.forEach(function(el,i){ el.style.transform = 'translateY('+(s*(0.05+i*.04))+'px)'; });
  }, { passive:true });

  /* ── Newsletter ── */
  var nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', function(e){
      e.preventDefault();
      var inp=nlForm.querySelector('input'), btn=nlForm.querySelector('button');
      if(inp&&inp.value){ btn.textContent='✓ Done!'; btn.style.background='#1a7a3a'; inp.value=''; setTimeout(function(){ btn.textContent='Subscribe'; btn.style.background=''; },3000); }
    });
  }

  /* ── Active nav section ── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link[data-section]');
  var secObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        navLinks.forEach(function(l){ l.style.color = l.dataset.section===e.target.id ? 'var(--blue)' : ''; });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(function(s){ secObs.observe(s); });

  /* ── Number pulse on process step hover ── */
  document.querySelectorAll('.ev-process-step').forEach(function(step){
    step.addEventListener('mouseenter', function(){
      var icon = step.querySelector('.ev-step-icon');
      if (!icon) return;
      icon.style.transform = 'scale(1.3)';
      icon.style.transition = 'transform .3s ease';
      setTimeout(function(){ icon.style.transform=''; }, 300);
    });
  });

});