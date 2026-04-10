/* ===================================================
   NexGen Dubai — join-network.js
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
  if (ham) ham.addEventListener('click', window.openMobileNav);
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
    var mx=0,my=0,fx=0,fy=0;
    document.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; cursor.style.transform='translate('+(mx-5)+'px,'+(my-5)+'px)'; });
    (function anim(){ fx+=(mx-fx)*.12; fy+=(my-fy)*.12; follower.style.transform='translate('+(fx-18)+'px,'+(fy-18)+'px)'; requestAnimationFrame(anim); })();
  } else { if(cursor) cursor.style.display='none'; if(follower) follower.style.display='none'; }

  /* ── Scroll ── */
  var progressBar = document.getElementById('scroll-progress');
  var backTop = document.getElementById('back-top');
  var navbar  = document.getElementById('navbar');
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
    var t=setInterval(function(){ cur=Math.min(cur+inc,target); el.textContent=Math.floor(cur).toLocaleString(); if(cur>=target) clearInterval(t); },16);
  }
  var cObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ animCounter(e.target,parseFloat(e.target.dataset.counter)); cObs.unobserve(e.target); } });
  },{ threshold:0.5 });
  document.querySelectorAll('[data-counter]').forEach(function(el){ cObs.observe(el); });

  /* ── Marquee clone ── */
  var mq = document.querySelector('.marquee-track');
  if (mq) mq.parentElement.appendChild(mq.cloneNode(true));

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
     MULTI-STEP FORM
  ════════════════════════════════════════════ */
  var TOTAL_STEPS = 3;
  var currentStep = 1;
  var formWrap    = document.getElementById('jn-form-wrap');
  var successWrap = document.getElementById('jn-success');
  var form        = document.getElementById('jn-form');

  function getPanel(n)    { return document.getElementById('jn-step-' + n); }
  function getStepItem(n) { return document.getElementById('jn-si-' + n); }

  function updateStepUI(step) {
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var item = getStepItem(i);
      if (!item) continue;
      item.classList.remove('active','done');
      if (i === step) item.classList.add('active');
      if (i < step)   item.classList.add('done');
    }
    document.querySelectorAll('.jn-step-line').forEach(function(line, idx){
      line.style.background = idx < step - 1 ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.2)';
    });
  }

  function showStep(step) {
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var p = getPanel(i); if(p) p.classList.remove('active');
    }
    var target = getPanel(step);
    if (target) {
      target.classList.add('active');
      if (window.innerWidth < 900) {
        var card = document.querySelector('.jn-form-card');
        if (card) setTimeout(function(){ card.scrollIntoView({behavior:'smooth',block:'start'}); },80);
      }
    }
    updateStepUI(step);
    currentStep = step;
  }

  function validateStep(step) {
    var panel = getPanel(step);
    if (!panel) return true;
    var valid = true;
    panel.querySelectorAll('[required]').forEach(function(field){
      var errMsg = field.closest('.jn-field') ? field.closest('.jn-field').querySelector('.jn-error-msg') : null;
      field.classList.remove('error');
      if (errMsg) errMsg.classList.remove('show');
      if (!field.value || field.value.trim() === '') {
        field.classList.add('error');
        if (errMsg) errMsg.classList.add('show');
        valid = false;
      }
    });
    return valid;
  }

  /* ── Next / Prev ── */
  document.querySelectorAll('.jn-btn-next').forEach(function(btn){
    btn.addEventListener('click', function(){
      if (!validateStep(currentStep)) return;
      if (currentStep < TOTAL_STEPS) showStep(currentStep + 1);
    });
  });
  document.querySelectorAll('.jn-btn-prev').forEach(function(btn){
    btn.addEventListener('click', function(){ if(currentStep > 1) showStep(currentStep - 1); });
  });

  /* ── Checkbox multi-select ── */
  document.querySelectorAll('.jn-checkbox-opt').forEach(function(opt){
    opt.addEventListener('click', function(){
      opt.classList.toggle('checked');
      var input = opt.querySelector('input[type="checkbox"]');
      if (input) input.checked = !input.checked;
    });
  });

  /* ── Radio toggle ── */
  document.querySelectorAll('.jn-radio-opt').forEach(function(opt){
    opt.addEventListener('click', function(){
      var radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      var group = opt.closest('.jn-radio-group');
      if (group) group.querySelectorAll('.jn-radio-opt').forEach(function(o){ o.classList.remove('selected'); });
      opt.classList.add('selected');
    });
  });

  /* ── Clear error on input ── */
  document.querySelectorAll('.jn-input,.jn-select,.jn-textarea').forEach(function(f){
    f.addEventListener('input', function(){ f.classList.remove('error'); });
    f.addEventListener('change', function(){ f.classList.remove('error'); });
  });

  /* ── Live char counter ── */
  var visionTA  = document.getElementById('jn-vision');
  var visionCnt = document.getElementById('jn-vision-count');
  if (visionTA && visionCnt) {
    visionTA.addEventListener('input', function(){ visionCnt.textContent = visionTA.value.length + '/600'; });
  }

  /* ── Submit ── */
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!validateStep(currentStep)) return;
      var btn = form.querySelector('.jn-btn-submit');
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...'; }
      setTimeout(function(){
        if (formWrap) formWrap.style.display = 'none';
        if (successWrap) {
          successWrap.style.display = 'block';
          var icon = successWrap.querySelector('.jn-success-icon');
          if (icon) { icon.style.animation='none'; void icon.offsetWidth; icon.style.animation=''; }
        }
      }, 1800);
    });
  }

  /* Init */
  showStep(1);
});