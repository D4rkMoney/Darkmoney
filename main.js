/* main.js — particles, typing rotator, scroll reveal, faq, video UX, subtle interactions */

/* ---------- Particles background (purple/red, subtle) ---------- */
(function particles(){
  const el = document.getElementById('bg-fixed');
  if(!el) return;
  const canvas = document.createElement('canvas');
  el.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  let parts = [];
  const count = Math.max(28, Math.round((w*h)/150000));

  function rand(min,max){ return Math.random()*(max-min)+min; }
  function init(){
    parts = [];
    for(let i=0;i<count;i++){
      parts.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: rand(0.6,3.5),
        vx: rand(-0.03,0.03),
        vy: rand(-0.02,0.02),
        hue: Math.random()>0.5?270:340,
        a: rand(0.03,0.22)
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    // vignette
    const g = ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'rgba(0,0,0,0)');
    g.addColorStop(1,'rgba(0,0,0,0.28)');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

    parts.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -10) p.x = w + 10;
      if(p.x > w + 10) p.x = -10;
      if(p.y < -10) p.y = h + 10;
      if(p.y > h + 10) p.y = -10;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue},85%,60%,${p.a})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; init(); }
  window.addEventListener('resize', resize);
  init(); draw();
})();

/* ---------- Rotating promises (appear -> erase -> next) ---------- */
(function rotator(){
  const el = document.getElementById('rotatingText');
  if(!el) return;
  const phrases = [
    'Canal dark montado e lucrando sem você aparecer.',
    '+10.000 cortes virais prontos para postar e vender.',
    'Páginas, funis e automações que convertem diariamente.'
  ];
  let i = 0;

  function showPhrase(index){
    el.classList.remove('fade-in','fade-out');
    el.textContent = phrases[index];
    el.classList.add('fade-in');
    setTimeout(()=> {
      el.classList.remove('fade-in');
      el.classList.add('fade-out');
      setTimeout(()=> {
        i = (i+1) % phrases.length;
        showPhrase(i);
      }, 420);
    }, 2200);
  }

  showPhrase(0);
})();

/* ---------- Scroll reveal (fade-in sections) ---------- */
(function reveal(){
  const els = document.querySelectorAll('.section, .feature, .final-card, .pack-image, .video-wrap');
  const obs = new IntersectionObserver((entries, o)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('visible'); o.unobserve(entry.target); }
    });
  }, {threshold:0.18, rootMargin: "0px 0px -60px 0px"});
  els.forEach(e=> obs.observe(e));
})();

/* ---------- Video UX: ensure autoplay muted loop & small brightness pulse ---------- */
(function videoPulse(){
  const vid = document.getElementById('heroVideo');
  if(!vid) return;
  vid.play().catch(()=>{ /* autoplay blocked — user will click */ });
  // subtle brightness pulse overlay
  const wrap = document.getElementById('videoWrap');
  if(!wrap) return;
  let pulse = true;
  setInterval(()=> {
    wrap.style.filter = pulse ? 'brightness(1.06) saturate(1.05)' : 'brightness(0.96) saturate(0.95)';
    pulse = !pulse;
  }, 2800);
})();

/* ---------- Small interaction: hover reflect on background (mouse move) ---------- */
(function mouseGlow(){
  const bg = document.querySelector('.bg-overlay');
  if(!bg) return;
  window.addEventListener('mousemove', e=>{
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    bg.style.background = `
      radial-gradient(circle at ${x*100}% ${y*100}%, rgba(138,43,226,0.07), transparent 6%),
      radial-gradient(circle at ${100-(x*100)}% ${100-(y*100)}%, rgba(255,0,102,0.05), transparent 8%),
      linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.78))
    `;
  });
})();

/* ---------- FAQ toggle ---------- */
(function faq(){
  document.querySelectorAll('.faq-item .q').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const parent = btn.closest('.faq-item');
      const a = parent.querySelector('.a');
      const open = a.style.display === 'block';
      document.querySelectorAll('.faq-item .a').forEach(x=>x.style.display='none');
      document.querySelectorAll('.faq-item .q span').forEach(s=>s.style.transform='rotate(0deg)');
      if(!open){ a.style.display='block'; btn.querySelector('span').style.transform='rotate(180deg)'; }
      else { a.style.display='none'; btn.querySelector('span').style.transform='rotate(0deg)'; }
    });
  });
})();

/* ---------- Final card subtle float ---------- */
(function finalFloat(){
  const final = document.getElementById('finalCard');
  if(!final) return;
  let up = true;
  setInterval(()=>{
    final.style.transform = up ? 'translateY(-12px)' : 'translateY(-10px)';
    up = !up;
  }, 3000);
})();

/* Respect reduced motion */
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('*').forEach(n => n.style.animation = 'none');
}


// === SCRIPT DE ESCASSEZ ===
let vagas = 100;
const vagasCount = document.getElementById('vagasCount');

function reduzirVaga() {
  if (vagas > 1) {
    vagas--;
    vagasCount.textContent = vagas;

    // Efeito visual quando a vaga diminui
    vagasCount.style.color = '#ff003c';
    vagasCount.style.transform = 'scale(1.3)';
    setTimeout(() => {
      vagasCount.style.transform = 'scale(1)';
      vagasCount.style.color = '#ff003c';
    }, 400);
  } else if (vagas === 1) {
    vagas = 0;
    vagasCount.textContent = '0';
    vagasCount.style.color = '#999';
    document.querySelector('.vagas-alert').textContent = "⚠️ Últimas vagas encerradas";
  }
}

// A cada 30 segundos, diminui uma vaga
setInterval(reduzirVaga, 2000);
