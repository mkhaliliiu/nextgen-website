/* ===================================================
   NexGen Dubai — request-quote.js
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
  nav.style.opacity = '0';
  document.body.style.overflow = '';
  if (ham) ham.classList.remove('open');
  setTimeout(function(){
    nav.style.display = 'none';
    nav.querySelectorAll('.mobile-nav-item.open').forEach(function(el){ el.classList.remove('open'); });
  }, 350);
};

document.addEventListener('DOMContentLoaded', function() {

  /* ── Mobile nav ── */
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
  }, { threshold:0.1 });
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

  /* ── Marquee ── */
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
  var formWrap    = document.getElementById('rq-form-wrap');
  var successWrap = document.getElementById('rq-success');
  var form        = document.getElementById('rq-form');

  function getPanel(n)    { return document.getElementById('rq-step-'+n); }
  function getStepItem(n) { return document.getElementById('rq-si-'+n); }

  function updateStepUI(step) {
    for (var i=1; i<=TOTAL_STEPS; i++) {
      var item=getStepItem(i); if(!item) continue;
      item.classList.remove('active','done');
      if(i===step) item.classList.add('active');
      if(i<step)   item.classList.add('done');
    }
    document.querySelectorAll('.rq-step-line').forEach(function(line,idx){
      line.style.background = idx < step-1 ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.2)';
    });
  }

  function showStep(step) {
    for (var i=1; i<=TOTAL_STEPS; i++) { var p=getPanel(i); if(p) p.classList.remove('active'); }
    var target=getPanel(step);
    if(target) {
      target.classList.add('active');
      if(window.innerWidth < 900) {
        var card=document.querySelector('.rq-form-card');
        if(card) setTimeout(function(){ card.scrollIntoView({behavior:'smooth',block:'start'}); },80);
      }
    }
    updateStepUI(step);
    currentStep = step;
  }

  function validateStep(step) {
    var panel=getPanel(step); if(!panel) return true;
    var valid = true;

    panel.querySelectorAll('[required]').forEach(function(field){
      var errMsg = field.closest('.rq-field') ? field.closest('.rq-field').querySelector('.rq-error-msg') : null;
      field.classList.remove('error');
      if(errMsg) errMsg.classList.remove('show');
      if(!field.value || field.value.trim()==='') {
        field.classList.add('error');
        if(errMsg) errMsg.classList.add('show');
        valid = false;
      }
    });

    /* Require at least one service selected on step 1 */
    if(step === 1) {
      var anyChecked = panel.querySelector('.rq-check-opt.checked');
      if(!anyChecked) {
        var checkWrap = panel.querySelector('.rq-check-grid');
        if(checkWrap) {
          checkWrap.style.outline = '2px solid #ef4444';
          checkWrap.style.borderRadius = '10px';
          setTimeout(function(){ checkWrap.style.outline=''; }, 2000);
        }
        valid = false;
      }
    }

    /* Require budget on step 2 */
    if(step === 2) {
      var budgetSelected = panel.querySelector('.rq-budget-opt.selected');
      if(!budgetSelected) {
        var budgetWrap = panel.querySelector('.rq-budget-grid');
        if(budgetWrap) {
          budgetWrap.style.outline = '2px solid #ef4444';
          budgetWrap.style.borderRadius = '10px';
          setTimeout(function(){ budgetWrap.style.outline=''; }, 2000);
        }
        valid = false;
      }
    }

    return valid;
  }

  /* Next / Prev */
  document.querySelectorAll('.rq-btn-next').forEach(function(btn){
    btn.addEventListener('click', function(){ if(!validateStep(currentStep)) return; if(currentStep<TOTAL_STEPS) showStep(currentStep+1); });
  });
  document.querySelectorAll('.rq-btn-prev').forEach(function(btn){
    btn.addEventListener('click', function(){ if(currentStep>1) showStep(currentStep-1); });
  });

  /* Service checkboxes — prevent double-fire from label+input */
  document.querySelectorAll('.rq-check-opt').forEach(function(opt){
    opt.addEventListener('click', function(e){
      e.preventDefault();
      var cb = opt.querySelector('input[type="checkbox"]');
      var nowChecked = !opt.classList.contains('checked');
      opt.classList.toggle('checked', nowChecked);
      if(cb) cb.checked = nowChecked;
    });
  });

  /* Social media checkboxes — prevent double-fire from label+input */
  document.querySelectorAll('.rq-social-opt').forEach(function(opt){
    opt.addEventListener('click', function(e){
      e.preventDefault();
      var cb = opt.querySelector('input[type="checkbox"]');
      var nowChecked = !opt.classList.contains('checked');
      opt.classList.toggle('checked', nowChecked);
      if(cb) cb.checked = nowChecked;
    });
  });

  /* Budget cards — prevent double-fire from label+input */
  document.querySelectorAll('.rq-budget-opt').forEach(function(opt){
    opt.addEventListener('click', function(e){
      e.preventDefault();
      document.querySelectorAll('.rq-budget-opt').forEach(function(o){ o.classList.remove('selected'); });
      opt.classList.add('selected');
      var radio = opt.querySelector('input[type="radio"]');
      if(radio) radio.checked = true;
    });
  });

  /* Radio groups — prevent double-fire from label+input */
  document.querySelectorAll('.rq-radio-opt').forEach(function(opt){
    opt.addEventListener('click', function(e){
      e.preventDefault();
      var radio = opt.querySelector('input[type="radio"]');
      if(radio) radio.checked = true;
      var group = opt.closest('.rq-radio-group');
      if(group) group.querySelectorAll('.rq-radio-opt').forEach(function(o){ o.classList.remove('selected'); });
      opt.classList.add('selected');
    });
  });

  /* Clear errors */
  document.querySelectorAll('.rq-input,.rq-select,.rq-textarea').forEach(function(f){
    f.addEventListener('input',  function(){ f.classList.remove('error'); });
    f.addEventListener('change', function(){ f.classList.remove('error'); });
  });

  /* Live char counters */
  var projectTA  = document.getElementById('rq-project');
  var projectCnt = document.getElementById('rq-project-count');
  if(projectTA && projectCnt) {
    projectTA.addEventListener('input', function(){ projectCnt.textContent = projectTA.value.length+'/600'; });
  }
  var ideasTA  = document.getElementById('rq-ideas');
  var ideasCnt = document.getElementById('rq-ideas-count');
  if(ideasTA && ideasCnt) {
    ideasTA.addEventListener('input', function(){ ideasCnt.textContent = ideasTA.value.length+'/500'; });
  }

  /* Submit */
  if(form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!validateStep(currentStep)) return;
      var btn = form.querySelector('.rq-btn-submit');
      if(btn) { btn.disabled=true; btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Sending...'; }
      setTimeout(function(){
        if(formWrap) formWrap.style.display='none';
        if(successWrap) {
          successWrap.style.display='block';
          var icon=successWrap.querySelector('.rq-success-icon');
          if(icon){ icon.style.animation='none'; void icon.offsetWidth; icon.style.animation=''; }
        }
      }, 1800);
    });
  }

  /* Init */
  showStep(1);
});