/* ===================================================
   NexGen Dubai — media-services.js  (v2)
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

  /* Cursor */
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

  /* Reveal */
  var revObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  },{threshold:.08});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function(el){ revObs.observe(el); });

  /* Counters */
  function animCounter(el, target) {
    var isFloat=String(target).indexOf('.')!==-1, inc=target/(2200/16), cur=0;
    var t=setInterval(function(){ cur=Math.min(cur+inc,target); el.textContent=isFloat?cur.toFixed(0):Math.floor(cur).toLocaleString(); if(cur>=target) clearInterval(t); },16);
  }
  var cObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ animCounter(e.target,parseFloat(e.target.dataset.counter)); cObs.unobserve(e.target); } });
  },{threshold:.5});
  document.querySelectorAll('[data-counter]').forEach(function(el){ cObs.observe(el); });

  /* Marquee clone */
  var mq=document.querySelector('.marquee-track');
  if(mq) mq.parentElement.appendChild(mq.cloneNode(true));

  /* Hero card stagger */
  document.querySelectorAll('.ms-hcard').forEach(function(c,i){
    c.style.opacity='0'; c.style.transform='translateX(40px)';
    setTimeout(function(){ c.style.transition='opacity .6s ease,transform .6s ease'; c.style.opacity='1'; c.style.transform=''; },600+i*130);
  });

  /* 3D tilt on service cards */
  if(!('ontouchstart' in window)) {
    document.querySelectorAll('.ms-scard,.ms-why-card,.ms-result-box').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r=card.getBoundingClientRect();
        var x=((e.clientX-r.left)/r.width-.5)*7, y=((e.clientY-r.top)/r.height-.5)*-7;
        card.style.transform='perspective(900px) rotateX('+y+'deg) rotateY('+x+'deg) translateY(-8px)';
      });
      card.addEventListener('mouseleave', function(){ card.style.transform=''; });
    });
  }

  /* Platform card hover glow */
  document.querySelectorAll('.ms-platform-card').forEach(function(card){
    card.addEventListener('mouseenter', function(){
      var icon=card.querySelector('.ms-platform-icon');
      if(icon){ icon.style.transform='scale(1.25) rotate(-8deg)'; icon.style.transition='transform .3s ease'; }
    });
    card.addEventListener('mouseleave', function(){
      var icon=card.querySelector('.ms-platform-icon');
      if(icon){ icon.style.transform=''; }
    });
  });

  /* Process step icon bounce */
  document.querySelectorAll('.ms-pstep').forEach(function(step){
    step.addEventListener('mouseenter', function(){
      var icon=step.querySelector('.ms-pstep-icon');
      if(!icon) return;
      icon.style.transform='scale(1.4) rotate(6deg)'; icon.style.transition='transform .3s ease';
      setTimeout(function(){ icon.style.transform=''; },350);
    });
  });

  /* Parallax glows on hero scroll */
  var heroGlows=document.querySelectorAll('.ms-hero-glow-a,.ms-hero-glow-b');
  window.addEventListener('scroll', function(){
    var s=window.scrollY;
    heroGlows.forEach(function(el,i){ el.style.transform='translateY('+(s*(0.06+i*.04))+'px)'; });
  },{passive:true});

  /* Newsletter */
  var nlForm=document.getElementById('newsletter-form');
  if(nlForm) {
    nlForm.addEventListener('submit', function(e){
      e.preventDefault();
      var inp=nlForm.querySelector('input'), btn=nlForm.querySelector('button');
      if(inp&&inp.value){ btn.textContent='✓ Done!'; btn.style.background='#1a7a3a'; inp.value=''; setTimeout(function(){ btn.textContent='Subscribe'; btn.style.background=''; },3000); }
    });
  }
});