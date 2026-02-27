/* =========================================
   LATE NYT'S — script.js
   ========================================= */

/* ---- 1. PIXEL STARS ---- */
(function generatePixelStars() {
  const container = document.getElementById('pixelStars');
  if (!container) return;
  const count = 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'pixel-star';
    const size = Math.random() < 0.15 ? 3 : Math.random() < 0.4 ? 2 : 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = (1.5 + Math.random() * 3).toFixed(2);
    const delay = (Math.random() * 4).toFixed(2);
    star.style.cssText = `
      width:${size}px; height:${size}px;
      left:${x}%; top:${y}%;
      --dur:${dur}s; --delay:-${delay}s;
    `;
    container.appendChild(star);
  }
})();

/* ---- 2. Y2K SPARKLE EFFECT (on mouse move) ---- */
(function sparkleTrail() {
  const container = document.getElementById('sparkle-container');
  if (!container) return;

  const colors = ['', 'cyan', 'purple'];
  let lastSparkle = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkle < 80) return; // throttle
    lastSparkle = now;

    if (Math.random() > 0.6) return; // not every move

    const sparkle = document.createElement('span');
    sparkle.className = `sparkle ${colors[Math.floor(Math.random() * colors.length)]}`;
    const size = 8 + Math.random() * 14;
    sparkle.style.cssText = `
      left: ${e.clientX - size / 2}px;
      top: ${e.clientY - size / 2}px;
      width: ${size}px;
      height: ${size}px;
    `;
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1300);
  });

  // Also create random ambient sparkles
  function ambientSparkle() {
    const sparkle = document.createElement('span');
    sparkle.className = `sparkle ${colors[Math.floor(Math.random() * colors.length)]}`;
    const size = 6 + Math.random() * 10;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    sparkle.style.cssText = `
      left: ${x}px; top: ${y}px;
      width: ${size}px; height: ${size}px;
    `;
    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1300);
    setTimeout(ambientSparkle, 300 + Math.random() * 800);
  }
  setTimeout(ambientSparkle, 500);
})();

/* ---- 3. SIDEBAR TOGGLE (mobile) ---- */
(function sidebarToggle() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 200;
      if (window.scrollY >= top) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();

/* ---- 4. COUNTER ANIMATION ---- */
(function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  // Trigger when in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

/* ---- 5. SCROLL REVEAL ---- */
(function scrollReveal() {
  // Add reveal class to key elements
  const targets = [
    { selector: '.about-badge-wrap', delay: '' },
    { selector: '.about-text-col', delay: 'reveal-delay-2' },
    { selector: '.track-card:nth-child(1)', delay: '' },
    { selector: '.track-card:nth-child(2)', delay: 'reveal-delay-1' },
    { selector: '.track-card:nth-child(3)', delay: 'reveal-delay-2' },
    { selector: '.track-card:nth-child(4)', delay: 'reveal-delay-3' },
    { selector: '.vault-header', delay: '' },
    { selector: '.join-content', delay: '' },
  ];

  targets.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add('reveal');
    if (delay) el.classList.add(delay);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ---- 6. VHS GLITCH EFFECT (random) ---- */
(function vhsGlitch() {
  const overlay = document.querySelector('.vhs-overlay');
  if (!overlay) return;

  function triggerGlitch() {
    overlay.style.transform = `translateX(${(Math.random() - 0.5) * 6}px)`;
    overlay.style.opacity = '0.97';

    // Split color aberration briefly
    document.body.style.filter = `
      drop-shadow(${Math.random() * 4 - 2}px 0 0 rgba(255,0,127,0.4))
      drop-shadow(${Math.random() * -4 + 2}px 0 0 rgba(0,255,255,0.4))
    `;

    setTimeout(() => {
      overlay.style.transform = '';
      document.body.style.filter = '';
    }, 80 + Math.random() * 100);

    // Schedule next glitch
    const nextGlitch = 3000 + Math.random() * 8000;
    setTimeout(triggerGlitch, nextGlitch);
  }

  setTimeout(triggerGlitch, 4000);
})();

/* ---- 7. FOUR-POINT SPARKLE ICONS on hero hover ---- */
(function heroSparkles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('click', (e) => {
    // Burst of sparkles on click
    const container = document.getElementById('sparkle-container');
    const colors = ['', 'cyan', 'purple'];
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('span');
        sparkle.className = `sparkle ${colors[Math.floor(Math.random() * colors.length)]}`;
        const size = 10 + Math.random() * 20;
        const offsetX = (Math.random() - 0.5) * 80;
        const offsetY = (Math.random() - 0.5) * 80;
        sparkle.style.cssText = `
          left: ${e.clientX + offsetX - size / 2}px;
          top: ${e.clientY + offsetY - size / 2}px;
          width: ${size}px; height: ${size}px;
        `;
        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1400);
      }, i * 50);
    }
  });
})();

/* ---- 8. FORM SUBMIT ---- */
function handleJoin(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<span>★ You\'re In! Welcome, Night Owl.</span><span class="cta-shimmer"></span>';
  btn.style.background = 'linear-gradient(135deg, #00FFFF, #8A2BE2)';
  btn.style.boxShadow = '0 0 30px rgba(0,255,255,0.6)';
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    btn.style.boxShadow = '';
    e.target.reset();
  }, 3500);
}

/* ---- 9. SMOOTH SCROLL for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- 10. DYNAMIC Y2K ELEMENT SPAWNER ---- */
(function spawnY2KElements() {
  const layer = document.getElementById('y2kLayer');
  if (!layer) return;

  // SVG templates for each of the 18 element types
  const elements = [
    // ① 4-pt star — pink
    { cls: 's-4pt', color: '#FF007F', svg: (c) => `<polygon points="50,2 53,47 98,50 53,53 50,98 47,53 2,50 47,47" fill="${c}" opacity="0.85"/><polygon points="50,20 51.5,48.5 80,50 51.5,51.5 50,80 48.5,51.5 20,50 48.5,48.5" fill="white" opacity="0.5"/>`, vb: '0 0 100 100' },
    // ② 4-pt star — cyan
    { cls: 's-4pt', color: '#00FFFF', svg: (c) => `<polygon points="50,2 53,47 98,50 53,53 50,98 47,53 2,50 47,47" fill="${c}" opacity="0.85"/><circle cx="50" cy="50" r="4" fill="white"/>`, vb: '0 0 100 100' },
    // ③ 4-pt star — pale purple
    { cls: 's-4pt', color: '#D2A8FF', svg: (c) => `<polygon points="50,2 53,47 98,50 53,53 50,98 47,53 2,50 47,47" fill="${c}" opacity="0.9"/>`, vb: '0 0 100 100' },
    // ④ 6-pt crystal — cyan
    { cls: 's-6pt', color: '#00FFFF', svg: (c) => `<polygon points="50,2 52,48 98,50 52,52 50,98 48,52 2,50 48,48" fill="${c}" opacity="0.8"/><polygon points="50,15 58.5,41.5 85,50 58.5,58.5 50,85 41.5,58.5 15,50 41.5,41.5" fill="none" stroke="white" stroke-width="0.6" opacity="0.5"/><circle cx="50" cy="50" r="4" fill="white" opacity="0.95"/>`, vb: '0 0 100 100' },
    // ⑤ 6-pt crystal — pink
    { cls: 's-6pt', color: '#FF007F', svg: (c) => `<polygon points="50,2 52,48 98,50 52,52 50,98 48,52 2,50 48,48" fill="${c}" opacity="0.75"/><circle cx="50" cy="50" r="5" fill="white" opacity="0.9"/><line x1="50" y1="5" x2="50" y2="95" stroke="white" stroke-width="0.4" opacity="0.4"/><line x1="5" y1="50" x2="95" y2="50" stroke="white" stroke-width="0.4" opacity="0.4"/>`, vb: '0 0 100 100' },
    // ⑥ Lens flare — white/purple
    { cls: 's-flare', color: '#D2A8FF', svg: (c) => `<circle cx="50" cy="50" r="45" fill="${c}" opacity="0.12"/><circle cx="50" cy="50" r="30" fill="${c}" opacity="0.18"/><line x1="50" y1="0" x2="50" y2="100" stroke="white" stroke-width="0.5" opacity="0.5"/><line x1="0" y1="50" x2="100" y2="50" stroke="white" stroke-width="0.5" opacity="0.5"/><circle cx="50" cy="50" r="4" fill="white"/><circle cx="12" cy="50" r="3" fill="${c}" opacity="0.6"/><circle cx="88" cy="50" r="2.5" fill="#FF007F" opacity="0.5"/>`, vb: '0 0 100 100' },
    // ⑦ Diamond — holographic gradient
    { cls: 's-diamond', color: '#fff', svg: () => `<defs><linearGradient id="dg${Math.random().toString(36).slice(2,6)}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fff"/><stop offset="33%" stop-color="#D2A8FF"/><stop offset="66%" stop-color="#00FFFF"/><stop offset="100%" stop-color="#FF007F"/></linearGradient></defs><polygon points="30,1 59,30 30,59 1,30" fill="url(#dg${Math.random().toString(36).slice(2,6)})" opacity="0.85"/><polygon points="30,10 50,30 30,50 10,30" fill="none" stroke="white" stroke-width="0.6" opacity="0.4"/><circle cx="30" cy="30" r="2.5" fill="white" opacity="0.8"/>`, vb: '0 0 60 60' },
    // ⑧ Starburst 8-pt
    { cls: 's-burst', color: '#FF007F', svg: (c) => `<polygon points="50,4 54,43 88,19 65,50 92,66 53,57 66,93 49,63 34,93 47,57 8,66 35,50 12,19 46,43 50,4" fill="${c}" opacity="0.7"/><circle cx="50" cy="50" r="12" fill="none" stroke="white" stroke-width="0.6" opacity="0.4"/><circle cx="50" cy="50" r="4" fill="white"/>`, vb: '0 0 100 100' },
    // ⑨ Holographic orb — cyan core
    { cls: 's-orb', color: '#00FFFF', svg: () => `<defs><radialGradient id="og${Math.random().toString(36).slice(2,6)}" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="white" stop-opacity="0.9"/><stop offset="25%" stop-color="#00FFFF" stop-opacity="0.7"/><stop offset="60%" stop-color="#8A2BE2" stop-opacity="0.4"/><stop offset="100%" stop-color="#FF007F" stop-opacity="0.1"/></radialGradient></defs><circle cx="40" cy="40" r="36" fill="url(#og${Math.random().toString(36).slice(2,6)})" opacity="0.8"/><ellipse cx="40" cy="40" rx="36" ry="9" fill="none" stroke="#00FFFF" stroke-width="0.7" opacity="0.4"/><ellipse cx="28" cy="28" rx="12" ry="6" fill="white" opacity="0.25" transform="rotate(-30,28,28)"/>`, vb: '0 0 80 80' },
    // ⑩ Holographic orb — pink core
    { cls: 's-orb', color: '#FF007F', svg: () => `<defs><radialGradient id="op${Math.random().toString(36).slice(2,6)}" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="white"/><stop offset="25%" stop-color="#FF007F" stop-opacity="0.8"/><stop offset="65%" stop-color="#8A2BE2" stop-opacity="0.5"/><stop offset="100%" stop-color="transparent" stop-opacity="0"/></radialGradient></defs><circle cx="40" cy="40" r="36" fill="url(#op${Math.random().toString(36).slice(2,6)})" opacity="0.8"/><ellipse cx="40" cy="40" rx="36" ry="9" fill="none" stroke="#FF007F" stroke-width="0.6" opacity="0.4"/><ellipse cx="28" cy="28" rx="12" ry="6" fill="white" opacity="0.2" transform="rotate(-30,28,28)"/>`, vb: '0 0 80 80' },
    // ⑪ Comet horizontal
    { cls: 's-comet', color: '#D2A8FF', svg: (c) => `<defs><linearGradient id="cg${Math.random().toString(36).slice(2,6)}" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="transparent"/><stop offset="65%" stop-color="${c}" stop-opacity="0.6"/><stop offset="100%" stop-color="white"/></linearGradient></defs><line x1="0" y1="10" x2="155" y2="10" stroke="url(#cg${Math.random().toString(36).slice(2,6)})" stroke-width="2"/><circle cx="158" cy="10" r="3" fill="white" opacity="0.95"/>`, vb: '0 0 160 20' },
    // ⑫ Comet diagonal
    { cls: 's-comet-diag', color: '#00FFFF', svg: (c) => `<defs><linearGradient id="cd${Math.random().toString(36).slice(2,6)}" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="transparent"/><stop offset="60%" stop-color="${c}" stop-opacity="0.5"/><stop offset="100%" stop-color="white"/></linearGradient></defs><line x1="10" y1="130" x2="130" y2="10" stroke="url(#cd${Math.random().toString(36).slice(2,6)})" stroke-width="1.5"/><circle cx="130" cy="10" r="3.5" fill="white" opacity="0.9"/>`, vb: '0 0 140 140' },
    // ⑬ Glitter cluster — pink tones
    { cls: 's-glitter', color: '#FF007F', svg: (c) => `<circle cx="40" cy="12" r="2.2" fill="${c}"/><circle cx="16" cy="32" r="1.5" fill="#00FFFF"/><circle cx="64" cy="26" r="2" fill="white"/><circle cx="70" cy="58" r="1.5" fill="#D2A8FF"/><circle cx="10" cy="62" r="2" fill="${c}"/><circle cx="50" cy="72" r="1.5" fill="#9E7AFF"/><polygon points="40,6 41,11 46,12 41,13 40,18 39,13 34,12 39,11" fill="white" opacity="0.9"/><polygon points="64,20 65,24.5 69.5,25.5 65,26.5 64,31 63,26.5 58.5,25.5 63,24.5" fill="#D2A8FF" opacity="0.9"/>`, vb: '0 0 80 80' },
    // ⑭ Glitter cluster — cyan tones
    { cls: 's-glitter', color: '#00FFFF', svg: (c) => `<circle cx="20" cy="15" r="2" fill="${c}"/><circle cx="58" cy="22" r="1.5" fill="#FF007F"/><circle cx="40" cy="42" r="2.5" fill="white" opacity="0.8"/><circle cx="68" cy="62" r="1.5" fill="#D2A8FF"/><circle cx="12" cy="66" r="2" fill="${c}"/><polygon points="20,9 21,14 26,15 21,16 20,21 19,16 14,15 19,14" fill="${c}" opacity="0.9"/><polygon points="58,16 59,20.5 63.5,21.5 59,22.5 58,27 57,22.5 52.5,21.5 57,20.5" fill="white" opacity="0.8"/>`, vb: '0 0 80 80' },
    // ⑮ Ring halo — purple
    { cls: 's-ring', color: '#D2A8FF', svg: (c) => `<circle cx="45" cy="45" r="40" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="4 3" opacity="0.6"/><circle cx="45" cy="45" r="30" fill="none" stroke="#FF007F" stroke-width="0.5" opacity="0.3"/><circle cx="45" cy="5" r="2.5" fill="${c}" opacity="0.9"/><circle cx="45" cy="85" r="2.5" fill="${c}" opacity="0.9"/><circle cx="5" cy="45" r="2.5" fill="#FF007F" opacity="0.9"/><circle cx="85" cy="45" r="2.5" fill="#FF007F" opacity="0.9"/><circle cx="16" cy="16" r="1.5" fill="white" opacity="0.7"/><circle cx="74" cy="16" r="1.5" fill="white" opacity="0.7"/><circle cx="16" cy="74" r="1.5" fill="white" opacity="0.7"/><circle cx="74" cy="74" r="1.5" fill="white" opacity="0.7"/>`, vb: '0 0 90 90' },
    // ⑯ Ring halo — cyan
    { cls: 's-ring', color: '#00FFFF', svg: (c) => `<circle cx="30" cy="30" r="26" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.55"/><circle cx="30" cy="30" r="18" fill="none" stroke="#8A2BE2" stroke-width="0.5" opacity="0.3"/><circle cx="30" cy="4" r="2" fill="${c}" opacity="0.85"/><circle cx="30" cy="56" r="2" fill="${c}" opacity="0.85"/><circle cx="4" cy="30" r="2" fill="#FF007F" opacity="0.85"/><circle cx="56" cy="30" r="2" fill="#FF007F" opacity="0.85"/>`, vb: '0 0 60 60' },
    // ⑰ Large 4-pt — pale/white (mega glint)
    { cls: 's-4pt large', color: 'white', svg: () => `<polygon points="50,1 53.5,46.5 99,50 53.5,53.5 50,99 46.5,53.5 1,50 46.5,46.5" fill="white" opacity="0.9"/><polygon points="50,18 51.5,48.5 82,50 51.5,51.5 50,82 48.5,51.5 18,50 48.5,48.5" fill="#D2A8FF" opacity="0.6"/><circle cx="50" cy="50" r="3.5" fill="white"/>`, vb: '0 0 100 100' },
    // ⑱ 6-pt crystal — pale purple (large)
    { cls: 's-6pt medium', color: '#9E7AFF', svg: (c) => `<polygon points="50,2 52,48 98,50 52,52 50,98 48,52 2,50 48,48" fill="${c}" opacity="0.8"/><line x1="50" y1="5" x2="50" y2="95" stroke="white" stroke-width="0.4" opacity="0.4"/><line x1="5" y1="50" x2="95" y2="50" stroke="white" stroke-width="0.4" opacity="0.4"/><line x1="18" y1="18" x2="82" y2="82" stroke="white" stroke-width="0.3" opacity="0.3"/><line x1="82" y1="18" x2="18" y2="82" stroke="white" stroke-width="0.3" opacity="0.3"/><circle cx="50" cy="50" r="5" fill="white" opacity="0.95"/>`, vb: '0 0 100 100' },
  ];

  // Zones (top% of page) — spread across all sections
  const zones = [
    { minT: 5,  maxT: 90,  minL: 5,  maxL: 90 },   // hero
    { minT: 95, maxT: 180, minL: 5,  maxL: 90 },   // about
    { minT: 180,maxT: 270, minL: 5,  maxL: 90 },   // vault
    { minT: 270,maxT: 360, minL: 5,  maxL: 90 },   // join
  ];

  elements.forEach((def, i) => {
    const zone = zones[i % zones.length];
    const t    = zone.minT + Math.random() * (zone.maxT - zone.minT);
    const l    = zone.minL + Math.random() * (zone.maxL - zone.minL);
    const dur  = (4 + Math.random() * 9).toFixed(2);
    const delay= -(Math.random() * 8).toFixed(2);
    const rot  = Math.floor(Math.random() * 360);

    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('viewBox', def.vb);
    svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgEl.innerHTML = def.svg(def.color);

    const wrapper = document.createElement('div');
    wrapper.className = `y2k-el ${def.cls}`;
    wrapper.style.cssText = `top:${t}%;left:${l}%;--dur:${dur}s;--delay:${delay}s;--rot:${rot}deg;`;
    wrapper.appendChild(svgEl);
    layer.appendChild(wrapper);
  });
})();

/* ---- 10c. NEON FLICKER on hover for certain elements ---- */
document.querySelectorAll('.track-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    // Spawn a couple sparkles near the card
    const container = document.getElementById('sparkle-container');
    const rect = card.getBoundingClientRect();
    const colors = ['', 'cyan', 'purple'];
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('span');
        sparkle.className = `sparkle ${colors[i]}`;
        const size = 8 + Math.random() * 12;
        sparkle.style.cssText = `
          left: ${rect.left + Math.random() * rect.width - size / 2}px;
          top:  ${rect.top + Math.random() * rect.height - size / 2}px;
          width: ${size}px; height: ${size}px;
        `;
        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1300);
      }, i * 120);
    }
  });
});

/* ---- 11. CURSOR TRAIL (four-point sparkle follows cursor) ---- */
(function cursorFourPoint() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
    <polygon points='10,0 11,9 20,10 11,11 10,20 9,11 0,10 9,9' fill='currentColor'/>
  </svg>`;

  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position:fixed; pointer-events:none; z-index:9999;
    width:20px; height:20px;
    color: #FF007F;
    filter: drop-shadow(0 0 4px #FF007F);
    transform: translate(-50%,-50%);
    opacity: 0;
    transition: opacity 0.3s, color 0.5s;
  `;
  cursor.innerHTML = svg;
  document.body.appendChild(cursor);

  let cx = 0, cy = 0;
  const colors = ['#FF007F', '#00FFFF', '#9E7AFF', '#D2A8FF', '#FF007F'];
  let colorIdx = 0;
  let colorTimer;

  document.addEventListener('mousemove', (e) => {
    cursor.style.opacity = '1';
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    clearTimeout(colorTimer);
    colorTimer = setTimeout(() => cursor.style.opacity = '0', 3000);
  });

  // Rotate cursor color
  setInterval(() => {
    colorIdx = (colorIdx + 1) % colors.length;
    cursor.style.color = colors[colorIdx];
    cursor.style.filter = `drop-shadow(0 0 4px ${colors[colorIdx]})`;
  }, 1500);

  // Spin the cursor
  let angle = 0;
  function spinCursor() {
    angle += 2;
    cursor.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
    requestAnimationFrame(spinCursor);
  }
  spinCursor();
})();

console.log('%c🎵 LATE NYT\'S — WHERE THE NIGHT NEVER ENDS 🎵', 'color:#FF007F; font-size:18px; font-family:monospace; text-shadow: 0 0 10px #FF007F;');

/* =====================================================
   NYAN CAT VIRTUAL PET SYSTEM
   ===================================================== */
(function() {
  'use strict';

  /* ---- DOM refs ---- */
  const wrap       = document.getElementById('nyanWrap');
  const nyanSvg    = document.getElementById('nyanSvg');
  const speech     = document.getElementById('nyanSpeech');
  const zzzWrap    = document.getElementById('nyanZzzWrap');
  const sparkRing  = document.getElementById('nyanSparkleRing');
  const hud        = document.getElementById('petHUD');
  const hudToggle  = document.getElementById('hudToggle');
  const hudPanel   = document.getElementById('hudPanel');
  const petNameEl  = document.getElementById('petName');
  const petLevelEl = document.getElementById('petLevel');
  const xpFillEl   = document.getElementById('xpFill');
  const xpLabelEl  = document.getElementById('xpLabel');
  const moodDotEl  = document.getElementById('moodDot');
  const moodIconEl = document.getElementById('moodIcon');
  const moodTextEl = document.getElementById('moodText');
  const hungerFillEl = document.getElementById('hungerFill');
  const happyFillEl  = document.getElementById('happyFill');
  const energyFillEl = document.getElementById('energyFill');
  const hungerValEl  = document.getElementById('hungerVal');
  const happyValEl   = document.getElementById('happyVal');
  const energyValEl  = document.getElementById('energyVal');
  const petMsgEl     = document.getElementById('petMessage');

  if (!wrap) return; // guard

  /* ---- Trail canvas ---- */
  const canvas = document.getElementById('nyanTrailCanvas');
  const ctx    = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  /* ---- Synthwave rainbow stripe colours ---- */
  const RAINBOW = [
    '#FF007F',  // hot pink
    '#FF66AA',  // candy pink
    '#8A2BE2',  // purple
    '#9E7AFF',  // lavender
    '#00FFFF',  // cyan
    '#5F5FB4',  // slate-blue
  ];

  /* ======== PET STATE ======== */
  const state = {
    name: 'PIXEL',
    hunger:    80,
    happiness: 85,
    energy:    90,
    xp:        0,
    level:     1,
    /* position (center of cat) */
    x: window.innerWidth  * 0.65,
    y: window.innerHeight * 0.38,
    vx: 2.8,
    vy: 1.2,
    targetX: 0,
    targetY: 0,
    facingRight: true,
    mood: 'HAPPY',
    isZoomies: false,
    zoomiesTimer: null,
    lastDecay: Date.now(),
    lastTargetChange: Date.now(),
    speechTimer: null,
    ambientTimer: null,
    trail: [],           // {x,y} history for trail
    TRAIL_MAX: 50,
  };

  /* ======== MOOD CONFIG ======== */
  const MOODS = {
    HAPPY:   { icon:'✦',  label:'HAPPY',    color:'#FF007F', speed:2.8,  eyeClass:'normal',  mouthClass:'happy',  bobSpeed:1.1,  tailSpeed:0.75, pawSpeed:0.38 },
    HUNGRY:  { icon:'🍕', label:'HUNGRY',   color:'#FF9500', speed:1.6,  eyeClass:'ded',     mouthClass:'sad',    bobSpeed:1.8,  tailSpeed:1.4,  pawSpeed:0.65 },
    SLEEPY:  { icon:'💤', label:'SLEEPY',   color:'#9E7AFF', speed:0.85, eyeClass:'sleepy',  mouthClass:'flat',   bobSpeed:3.0,  tailSpeed:2.2,  pawSpeed:1.2  },
    EXCITED: { icon:'✨', label:'EXCITED',  color:'#00FFFF', speed:3.8,  eyeClass:'excited', mouthClass:'open',   bobSpeed:0.75, tailSpeed:0.5,  pawSpeed:0.22 },
    ZOOMIES: { icon:'⚡', label:'ZOOMIES!', color:'#00FFFF', speed:8.5,  eyeClass:'zoomies', mouthClass:'open',   bobSpeed:0.4,  tailSpeed:0.28, pawSpeed:0.13 },
    GRUMPY:  { icon:'😾', label:'GRUMPY',   color:'#8A2BE2', speed:1.9,  eyeClass:'grumpy',  mouthClass:'grumpy', bobSpeed:2.0,  tailSpeed:1.6,  pawSpeed:0.75 },
  };

  /* ======== SPEECH LINES ======== */
  const SPEECH = {
    HAPPY:   ['NYA~', 'PURR~', '✦ NYA ✦', '♪ NYA~♪', '≧◡≦', 'MEOW!'],
    HUNGRY:  ['FEED ME!', 'HUNGRY!', 'nyan???', '>_< FOOD', '...nyan'],
    SLEEPY:  ['ZZZ...', 'zzz~', 'sleepy...', '...nya', 'yawn~'],
    EXCITED: ['NYA NYA!', 'WOO!!', '✦✦NYA✦✦', 'YAAAY~', 'WEEEE!'],
    ZOOMIES: ['ZOOM!', 'WEEEEEE~', "CAN'T STOP!", '>>NYA>>', '⚡⚡⚡'],
    GRUMPY:  ['hmph.', '...nyan.', 'leave me.', '>:3', 'NOT NOW.'],
    FED:     ['NOM NOM!', 'YUM~', '♪ NOM ♪', 'TASTY!!', 'THANK U~'],
    PETTED:  ['PURR~', '^.^', '♥ NYA ♥', 'UWU~', 'SO SOFT~'],
    PLAY:    ["LET'S GO!", 'PLAY TIME!', '⚡ YASS!', 'WOOHOO!', 'FUN FUN!'],
    LEVELUP: ['LEVEL UP!', 'I EVOLVED!', '✦ POWER UP ✦', 'STRONGER!'],
  };

  /* ======== HELPERS ======== */
  function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ---- Show speech bubble ---- */
  function showSpeech(type, customText) {
    const text = customText || rnd(SPEECH[type] || SPEECH.HAPPY);
    speech.textContent = text;
    speech.classList.remove('nyan-hidden');
    // Reset animation
    speech.style.animation = 'none';
    void speech.offsetWidth; // force reflow
    speech.style.animation = '';

    clearTimeout(state.speechTimer);
    state.speechTimer = setTimeout(() => speech.classList.add('nyan-hidden'), 2500);
  }

  /* ---- Apply mood visuals to SVG ---- */
  function applyMoodVisuals(mood) {
    const m = MOODS[mood];
    if (!m) return;

    // Eyes
    wrap.querySelectorAll('.mood-eyes').forEach(g => g.classList.add('nyan-hidden'));
    const eyeEl = wrap.querySelector(`.mood-eyes-${m.eyeClass}`);
    if (eyeEl) eyeEl.classList.remove('nyan-hidden');

    // Mouth
    wrap.querySelectorAll('.mood-mouth').forEach(g => g.classList.add('nyan-hidden'));
    const mouthEl = wrap.querySelector(`.mood-mouth-${m.mouthClass}`);
    if (mouthEl) mouthEl.classList.remove('nyan-hidden');

    // Animation speeds via CSS custom properties
    wrap.style.setProperty('--paw-speed',  m.pawSpeed  + 's');
    wrap.style.setProperty('--tail-speed', m.tailSpeed + 's');
    wrap.style.setProperty('--bob-speed',  m.bobSpeed  + 's');

    // ZZZ particles for SLEEPY
    if (mood === 'SLEEPY') { zzzWrap.classList.remove('nyan-hidden'); }
    else                   { zzzWrap.classList.add('nyan-hidden');    }

    // Orbit ring for EXCITED / ZOOMIES
    if (mood === 'EXCITED' || mood === 'ZOOMIES') { sparkRing.classList.remove('nyan-hidden'); }
    else                                          { sparkRing.classList.add('nyan-hidden');    }

    // HUD mood display
    if (moodDotEl)  { moodDotEl.style.background = m.color; moodDotEl.style.boxShadow = `0 0 8px ${m.color}`; }
    if (moodIconEl) moodIconEl.textContent = m.icon;
    if (moodTextEl) { moodTextEl.textContent = m.label; moodTextEl.style.color = m.color; }
  }

  /* ---- Derive mood from stats ---- */
  function calcMood() {
    if (state.isZoomies)          return 'ZOOMIES';
    if (state.energy    < 18)     return 'SLEEPY';
    if (state.hunger    < 18)     return 'HUNGRY';
    if (state.happiness < 25)     return 'GRUMPY';
    if (state.happiness > 82 && state.energy > 65) return 'EXCITED';
    return 'HAPPY';
  }

  /* ---- Update HUD bars ---- */
  function updateHUD() {
    const h  = Math.round(state.hunger);
    const ha = Math.round(state.happiness);
    const e  = Math.round(state.energy);

    hungerFillEl.style.width = h  + '%';
    happyFillEl.style.width  = ha + '%';
    energyFillEl.style.width = e  + '%';
    hungerValEl.textContent  = h;
    happyValEl.textContent   = ha;
    energyValEl.textContent  = e;

    // Low-stat warning
    hungerFillEl.classList.toggle('low', h  < 25);
    happyFillEl.classList.toggle ('low', ha < 25);
    energyFillEl.classList.toggle('low', e  < 25);

    const xpNeeded = state.level * 100;
    const pct = (state.xp / xpNeeded) * 100;
    xpFillEl.style.width   = pct + '%';
    xpLabelEl.textContent  = `XP ${state.xp} / ${xpNeeded}`;
    petLevelEl.textContent = `✦ LVL ${state.level}`;
  }

  /* ---- XP + level up ---- */
  function addXP(amount) {
    state.xp += amount;
    const needed = state.level * 100;
    if (state.xp >= needed) {
      state.xp -= needed;
      state.level++;
      showSpeech('LEVELUP');
      // Visual flash
      wrap.classList.remove('nyan-level-up');
      void wrap.offsetWidth;
      wrap.classList.add('nyan-level-up');
      setTimeout(() => wrap.classList.remove('nyan-level-up'), 750);
      // Confetti burst
      spawnConfettiBurst(16);
    }
    updateHUD();
  }

  /* ---- Confetti / sparkle burst ---- */
  function spawnConfettiBurst(count) {
    const container = document.getElementById('sparkle-container');
    if (!container) return;
    const colors = ['', 'cyan', 'purple'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('span');
        el.className = `sparkle ${colors[i % colors.length]}`;
        const size = 10 + Math.random() * 16;
        el.style.cssText = `
          left:  ${state.x + (Math.random() - 0.5) * 120}px;
          top:   ${state.y + (Math.random() - 0.5) * 120}px;
          width: ${size}px; height: ${size}px;`;
        container.appendChild(el);
        setTimeout(() => el.remove(), 1400);
      }, i * 55);
    }
  }

  /* ---- Heart burst for petted ---- */
  function spawnHearts() {
    const container = document.getElementById('sparkle-container');
    if (!container) return;
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'sparkle';
        el.innerHTML = '♥';
        el.style.cssText = `
          left:  ${state.x + (Math.random() - 0.5) * 90}px;
          top:   ${state.y + (Math.random() - 0.5) * 90}px;
          width: 16px; height: 16px;
          color: #FF007F; font-size: 14px;
          display: flex; align-items: center; justify-content: center;`;
        container.appendChild(el);
        setTimeout(() => el.remove(), 1400);
      }, i * 90);
    }
  }

  /* ---- Pizza emoji burst for fed ---- */
  function spawnPizzas() {
    const container = document.getElementById('sparkle-container');
    if (!container) return;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'sparkle';
        el.innerHTML = ['🍕','⭐','🌟'][i % 3];
        el.style.cssText = `
          left:  ${state.x + (Math.random() - 0.5) * 80}px;
          top:   ${state.y + (Math.random() - 0.5) * 80}px;
          width: 18px; height: 18px;
          font-size: 14px;
          display: flex; align-items: center; justify-content: center;`;
        container.appendChild(el);
        setTimeout(() => el.remove(), 1400);
      }, i * 80);
    }
  }

  /* ======== PUBLIC ACTIONS ======== */
  function feed() {
    state.hunger    = clamp(state.hunger    + 28, 0, 100);
    state.happiness = clamp(state.happiness + 5,  0, 100);
    addXP(12);
    showSpeech('FED');
    spawnPizzas();
    setMsg('Nom nom nom~ 🍕 Hunger +28!');
    updateHUD();
  }

  function petCat() {
    state.happiness = clamp(state.happiness + 22, 0, 100);
    state.energy    = clamp(state.energy    + 5,  0, 100);
    addXP(9);
    showSpeech('PETTED');
    spawnHearts();
    setMsg('Purring intensifies~ 💖 Happiness +22!');
    updateHUD();
  }

  function play() {
    if (state.energy < 15) {
      showSpeech('SLEEPY', 'too tired zzz');
      setMsg('Too tired to play... rest first! 💤');
      return;
    }
    state.happiness = clamp(state.happiness + 18, 0, 100);
    state.energy    = clamp(state.energy    - 18, 0, 100);
    state.hunger    = clamp(state.hunger    - 10, 0, 100);
    addXP(18);
    showSpeech('PLAY');
    setMsg('ZOOMIES MODE: ACTIVATED ⚡ (5 sec!)');
    // Trigger zoomies
    state.isZoomies = true;
    state.vx = (Math.random() > 0.5 ? 1 : -1) * 9;
    state.vy = (Math.random() > 0.5 ? 1 : -1) * 7;
    clearTimeout(state.zoomiesTimer);
    state.zoomiesTimer = setTimeout(() => { state.isZoomies = false; }, 5200);
    updateHUD();
  }

  function setMsg(txt) {
    if (petMsgEl) petMsgEl.textContent = txt;
  }

  /* ======== STAT DECAY ======== */
  function decayStats() {
    const now     = Date.now();
    const elapsed = (now - state.lastDecay) / 1000;
    if (elapsed < 18) return; // every 18 seconds
    state.lastDecay = now;

    state.hunger    = clamp(state.hunger    - 2.2, 0, 100);
    state.happiness = clamp(state.happiness - 1.8, 0, 100);
    state.energy    = clamp(state.energy    - 1.2, 0, 100);
    updateHUD();
  }

  /* ======== WANDER TARGETING ======== */
  function pickNewTarget() {
    const sideW = 90; // stay out of sidebar
    const pad   = 55;
    state.targetX = sideW + pad + Math.random() * (window.innerWidth  - sideW - pad * 2);
    state.targetY = pad + Math.random() * (window.innerHeight - pad * 2);
    state.lastTargetChange = Date.now();
  }
  pickNewTarget();

  /* ======== DRAW RAINBOW TRAIL ======== */
  function drawTrail() {
    // Fade canvas slowly — mix-blend-mode: screen means we draw dark to fade
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.045)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (state.trail.length < 3) return;

    const stripeH   = 6;
    const totalH    = stripeH * RAINBOW.length;
    const offsetY0  = -totalH / 2 + stripeH / 2;

    ctx.globalCompositeOperation = 'screen';
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';

    for (let ci = 0; ci < RAINBOW.length; ci++) {
      const yo = offsetY0 + ci * stripeH;
      ctx.strokeStyle = RAINBOW[ci];
      ctx.lineWidth   = stripeH - 0.5;

      ctx.beginPath();
      for (let i = 1; i < state.trail.length; i++) {
        const alpha = (i / state.trail.length) * 0.9;
        ctx.globalAlpha = alpha;
        const prev = state.trail[i - 1];
        const curr = state.trail[i];
        ctx.moveTo(prev.x, prev.y + yo);
        ctx.lineTo(curr.x, curr.y + yo);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ======== MAIN ANIMATION LOOP ======== */
  let lastRAFTime = 0;

  function loop(time) {
    const dt = Math.min(time - lastRAFTime, 48);
    lastRAFTime = time;

    /* --- Mood update --- */
    const newMood = calcMood();
    if (newMood !== state.mood) {
      state.mood = newMood;
      applyMoodVisuals(state.mood);
    }

    const m = MOODS[state.mood] || MOODS.HAPPY;

    /* --- Target following --- */
    const dx   = state.targetX - state.x;
    const dy   = state.targetY - state.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 55 || Date.now() - state.lastTargetChange > 3800) {
      pickNewTarget();
    }

    const angle   = Math.atan2(dy, dx);
    const wantVX  = Math.cos(angle) * m.speed;
    const wantVY  = Math.sin(angle) * m.speed;
    const smooth  = state.isZoomies ? 0.10 : 0.04;
    state.vx     += (wantVX - state.vx) * smooth;
    state.vy     += (wantVY - state.vy) * smooth;

    state.x += state.vx;
    state.y += state.vy;

    /* --- Boundary bounce --- */
    const sideW  = 95;
    const padY   = 50;
    const padX   = 50;
    const maxX   = window.innerWidth  - padX;
    const maxY   = window.innerHeight - padY;

    if (state.x < sideW + padX) {
      state.x = sideW + padX; state.vx = Math.abs(state.vx) * 0.8;
      state.targetX = state.x + 220;
    }
    if (state.x > maxX) {
      state.x = maxX; state.vx = -Math.abs(state.vx) * 0.8;
      state.targetX = state.x - 220;
    }
    if (state.y < padY) {
      state.y = padY; state.vy = Math.abs(state.vy) * 0.8;
      state.targetY = state.y + 160;
    }
    if (state.y > maxY) {
      state.y = maxY; state.vy = -Math.abs(state.vy) * 0.8;
      state.targetY = state.y - 160;
    }

    /* --- Facing direction (flip SVG) --- */
    const newFacing = state.vx > 0;
    if (newFacing !== state.facingRight) {
      state.facingRight = newFacing;
      nyanSvg.style.transform = newFacing ? 'scaleX(1)' : 'scaleX(-1)';
    }

    /* --- Record trail --- */
    state.trail.push({ x: state.x, y: state.y });
    if (state.trail.length > state.TRAIL_MAX) state.trail.shift();

    /* --- Draw trail --- */
    drawTrail();

    /* --- Position wrapper --- */
    wrap.style.left = (state.x - 74) + 'px';
    wrap.style.top  = (state.y - 45) + 'px';

    /* --- Stat decay --- */
    decayStats();

    requestAnimationFrame(loop);
  }

  /* ======== HUD TOGGLE ======== */
  hudToggle.addEventListener('click', () => {
    const open = hud.classList.toggle('hud-open');
    hudToggle.setAttribute('aria-expanded', open);
    hudPanel.setAttribute('aria-hidden', !open);
    if (open) setMsg('Floating through the synthwave cosmos~');
  });

  /* ======== CLICK THE CAT ======== */
  wrap.addEventListener('click', () => {
    const mood = calcMood();
    showSpeech(mood);
    state.happiness = clamp(state.happiness + 3, 0, 100);
    updateHUD();
    hud.classList.add('hud-open');
    hudToggle.setAttribute('aria-expanded', 'true');
    hudPanel.setAttribute('aria-hidden', 'false');
    setMsg('Click the buttons below to interact ✦');
  });

  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') wrap.click();
  });

  /* ======== ACTION BUTTONS ======== */
  document.getElementById('feedBtn').addEventListener('click', feed);
  document.getElementById('petBtn').addEventListener('click', petCat);
  document.getElementById('playBtn').addEventListener('click', play);

  /* ======== AMBIENT SPEECH (random) ======== */
  function scheduleAmbient() {
    const delay = 10000 + Math.random() * 16000;
    state.ambientTimer = setTimeout(() => {
      if (Math.random() < 0.45) showSpeech(state.mood);
      scheduleAmbient();
    }, delay);
  }
  scheduleAmbient();

  /* ======== INIT ======== */
  applyMoodVisuals('HAPPY');
  updateHUD();
  wrap.style.left = (state.x - 74) + 'px';
  wrap.style.top  = (state.y - 45) + 'px';
  requestAnimationFrame(loop);

  // Welcome message with a short delay
  setTimeout(() => showSpeech('HAPPY', 'NYA~ ✦'), 1800);

  // Expose globally for HUD button onclick attributes (safety fallback)
  window.NyanPet = { feed, pet: petCat, play };

})();
