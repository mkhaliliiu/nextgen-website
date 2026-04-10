/* ===================================================
   NexGen Dubai — contact.js
=================================================== */
window.openMobileNav = function() {
  var nav = document.getElementById('mobile-nav');
  var ham = document.getElementById('hamburger');
  if (!nav) return;
  nav.style.display='flex'; nav.style.opacity='0';
  document.body.style.overflow='hidden';
  if (ham) ham.classList.add('open');
  setTimeout(function(){ nav.style.opacity='1'; },10);
};
window.closeMobileNav = function() {
  var nav = document.getElementById('mobile-nav');
  var ham = document.getElementById('hamburger');
  if (!nav) return;
  nav.style.opacity='0'; document.body.style.overflow='';
  if (ham) ham.classList.remove('open');
  setTimeout(function(){
    nav.style.display='none';
    nav.querySelectorAll('.mobile-nav-item.open').forEach(function(el){ el.classList.remove('open'); });
  },350);
};

document.addEventListener('DOMContentLoaded', function () {

  /* Mobile nav */
  var ham = document.getElementById('hamburger');
  var closeBtn = document.getElementById('mobile-nav-close');
  if (ham) ham.addEventListener('click', window.openMobileNav);
  if (closeBtn) closeBtn.addEventListener('click', window.closeMobileNav);
  var mobileNav = document.getElementById('mobile-nav');
  if (mobileNav) {
    mobileNav.querySelectorAll('a.no-dropdown,.mobile-dropdown a,.mobile-nav-footer a').forEach(function(l){ l.addEventListener('click', window.closeMobileNav); });
    document.querySelectorAll('.mobile-nav-item[data-dropdown]').forEach(function(item){
      var t=item.querySelector('.mobile-nav-link'); if(!t) return;
      t.addEventListener('click', function(){
        var open=item.classList.contains('open');
        document.querySelectorAll('.mobile-nav-item[data-dropdown].open').forEach(function(el){ el.classList.remove('open'); });
        if(!open) item.classList.add('open');
      });
    });
  }

  /* Custom Cursor */
  var cursor=document.querySelector('.cursor'), follower=document.querySelector('.cursor-follower');
  if (cursor && follower && !('ontouchstart' in window)) {
    var mx=0,my=0,fx=0,fy=0;
    document.addEventListener('mousemove', function(e){ mx=e.clientX; my=e.clientY; cursor.style.transform='translate('+(mx-5)+'px,'+(my-5)+'px)'; });
    (function loop(){ fx+=(mx-fx)*.12; fy+=(my-fy)*.12; follower.style.transform='translate('+(fx-18)+'px,'+(fy-18)+'px)'; requestAnimationFrame(loop); })();
  } else { if(cursor) cursor.style.display='none'; if(follower) follower.style.display='none'; }

  /* Scroll */
  var prog=document.getElementById('scroll-progress'), backTop=document.getElementById('back-top'), navbar=document.getElementById('navbar');
  window.addEventListener('scroll', function(){
    var st=window.scrollY, dh=document.documentElement.scrollHeight-window.innerHeight;
    if(prog)    prog.style.width=((st/dh)*100)+'%';
    if(navbar)  navbar.classList.toggle('scrolled', st>80);
    if(backTop) backTop.classList.toggle('show', st>400);
  },{passive:true});
  if(backTop) backTop.addEventListener('click', function(){ window.scrollTo({top:0,behavior:'smooth'}); });

  /* Scroll Reveal */
  var revObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  },{threshold:.08});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function(el){ revObs.observe(el); });

  /* Newsletter */
  var nlForm=document.getElementById('newsletter-form');
  if(nlForm) {
    nlForm.addEventListener('submit', function(e){
      e.preventDefault();
      var inp=nlForm.querySelector('input'), btn=nlForm.querySelector('button');
      if(inp&&inp.value){ btn.textContent='✓ Done!'; btn.style.background='#1a7a3a'; inp.value=''; setTimeout(function(){ btn.textContent='Subscribe'; btn.style.background=''; },3000); }
    });
  }

  /* ── Contact Form ── */
  var form = document.getElementById('ct-form');
  var formWrap = document.getElementById('ct-form-wrap');
  var successWrap = document.getElementById('ct-success');

  function validate() {
    var valid = true;
    form.querySelectorAll('[required]').forEach(function(f){
      var err = f.closest('.ct-field') ? f.closest('.ct-field').querySelector('.ct-error-msg') : null;
      f.classList.remove('error');
      if(err) err.classList.remove('show');
      if(!f.value || f.value.trim()==='') {
        f.classList.add('error');
        if(err) err.classList.add('show');
        valid = false;
      }
      /* Email check */
      if(f.type==='email' && f.value && !/\S+@\S+\.\S+/.test(f.value)) {
        f.classList.add('error');
        if(err) err.classList.add('show');
        valid = false;
      }
    });
    return valid;
  }

  /* Clear on input */
  if(form) {
    form.querySelectorAll('.ct-input,.ct-select,.ct-textarea').forEach(function(f){
      f.addEventListener('input', function(){ f.classList.remove('error'); });
      f.addEventListener('change', function(){ f.classList.remove('error'); });
    });

    /* Live char counter */
    var msgTA = form.querySelector('#ct-message');
    var msgCnt = form.querySelector('#ct-msg-count');
    if(msgTA && msgCnt) {
      msgTA.addEventListener('input', function(){ msgCnt.textContent = msgTA.value.length + '/600'; });
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!validate()) return;
      var btn = form.querySelector('.ct-btn-submit');
      if(btn){ btn.disabled=true; btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Sending…'; }
      setTimeout(function(){
        if(formWrap) formWrap.style.display='none';
        if(successWrap){
          successWrap.style.display='block';
          var icon=successWrap.querySelector('.ct-success-icon');
          if(icon){ icon.style.animation='none'; void icon.offsetWidth; icon.style.animation=''; }
        }
      },1800);
    });
  }

  /* ── Info card entrance stagger ── */
  document.querySelectorAll('.ct-info-card').forEach(function(c,i){
    c.style.opacity='0'; c.style.transform='translateY(32px)';
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          setTimeout(function(){ c.style.transition='opacity .65s ease,transform .65s ease,box-shadow .4s,border-color .4s'; c.style.opacity='1'; c.style.transform=''; },i*120);
          obs.unobserve(c);
        }
      });
    },{threshold:.1});
    obs.observe(c);
  });

  /* ── Social card entrance stagger ── */
  document.querySelectorAll('.ct-social-card').forEach(function(c,i){
    c.style.opacity='0'; c.style.transform='translateY(30px)';
    var obs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          setTimeout(function(){ c.style.transition='opacity .6s ease,transform .6s ease,box-shadow .4s,border-color .4s'; c.style.opacity='1'; c.style.transform=''; },i*100);
          obs.unobserve(c);
        }
      });
    },{threshold:.1});
    obs.observe(c);
  });

});