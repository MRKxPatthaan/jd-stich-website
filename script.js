/* ═══════════════════════════════════════════════════════════════════
   JD STICH — LUXURY TAILORING STUDIO
   script.js — Full World-Class Animations & Interactions
═══════════════════════════════════════════════════════════════════ */
'use strict';

/* ──────────────────────────────────────────────────────────────────
   1. LOADER
────────────────────────────────────────────────────────────────── */
(function () {
  const loader  = document.getElementById('loader');
  const fill    = document.getElementById('loaderFill');
  if (!loader || !fill) return;

  document.body.style.overflow = 'hidden';

  let pct = 0;
  const interval = setInterval(() => {
    pct = Math.min(pct + Math.random() * 14, 95);
    fill.style.width = pct + '%';
  }, 80);

  const done = () => {
    clearInterval(interval);
    fill.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('out');
      document.body.style.overflow = '';
      triggerHeroCounters();
    }, 420);
  };

  if (document.readyState === 'complete') {
    setTimeout(done, 800);
  } else {
    window.addEventListener('load', () => setTimeout(done, 600));
  }
})();

/* ──────────────────────────────────────────────────────────────────
   2. SMOOTH CURSOR — zero-lag implementation
────────────────────────────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(max-width:960px)').matches) return;

  const dot  = document.getElementById('cDot');
  const ring = document.getElementById('cRing');
  if (!dot || !ring) return;

  /* Target position (follows mouse instantly) */
  let tx = -100, ty = -100;
  /* Ring position (lerps toward target) */
  let rx = -100, ry = -100;

  /* Move dot instantly on mousemove */
  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    dot.style.left = tx + 'px';
    dot.style.top  = ty + 'px';
  }, { passive: true });

  /* Lerp ring in rAF loop */
  const LERP = 0.14; /* 0.1=slow/smooth, 0.2=fast */
  const tick = () => {
    rx += (tx - rx) * LERP;
    ry += (ty - ry) * LERP;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  /* Hover states */
  const HOVERABLES = 'a, button, .mc, .wc, .gi, .svc, .rvc, .hv-step, .faq-q, .wed-card, .emb-card, .bulk-card, .pkg-card, .why-item, .wa-float, input, select';
  document.querySelectorAll(HOVERABLES).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('big'),    { passive: true });
    el.addEventListener('mouseleave', () => ring.classList.remove('big'), { passive: true });
  });
})();

/* ──────────────────────────────────────────────────────────────────
   3. PARTICLES — floating gold specks
────────────────────────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }, { passive: true });

  const COUNT = 55;
  const P = Array.from({ length: COUNT }, () => spawn(W, H, true));

  function spawn(w, h, rand) {
    return {
      x:       rand ? Math.random() * w : Math.random() * w,
      y:       rand ? Math.random() * h : h + 5,
      r:       Math.random() * 1.4 + 0.25,
      vx:      (Math.random() - 0.5) * 0.22,
      vy:      -(Math.random() * 0.4 + 0.08),
      life:    rand ? Math.random() : 0,
      maxLife: Math.random() * 0.65 + 0.35,
    };
  }

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    P.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life += 0.0028;
      if (p.life >= p.maxLife) Object.assign(p, spawn(W, H, false));
      const a = Math.sin((p.life / p.maxLife) * Math.PI) * 0.6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,169,110,${a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
})();

/* ──────────────────────────────────────────────────────────────────
   4. SCROLL PROGRESS BAR
────────────────────────────────────────────────────────────────── */
(function () {
  const bar = document.getElementById('scrollbar');
  if (!bar) return;
  const update = () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100).toFixed(2) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
})();

/* ──────────────────────────────────────────────────────────────────
   5. NAVBAR
────────────────────────────────────────────────────────────────── */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let last = 0;
  const update = () => {
    const y = window.scrollY;
    if (Math.abs(y - last) < 2) return;
    last = y;
    nav.classList.toggle('stuck', y > 50);
  };
  window.addEventListener('scroll', update, { passive: true });
})();

/* ──────────────────────────────────────────────────────────────────
   6. HAMBURGER / MOBILE MENU
────────────────────────────────────────────────────────────────── */
(function () {
  const btn  = document.getElementById('navHam');
  const menu = document.getElementById('navMob');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('show');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('show');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ──────────────────────────────────────────────────────────────────
   7. SCROLL REVEAL
────────────────────────────────────────────────────────────────── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); } });
  }, { threshold: 0.07, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.rv, .rv-left, .rv-right').forEach(el => obs.observe(el));
})();

/* ──────────────────────────────────────────────────────────────────
   8. COUNTER ANIMATION
────────────────────────────────────────────────────────────────── */
function countUp(el, target, ms) {
  const start = performance.now();
  const step  = now => {
    const t = Math.min((now - start) / ms, 1);
    const ease = 1 - Math.pow(1 - t, 4);
    const val  = Math.round(ease * target);
    el.textContent = target >= 1000 && val >= 1000
      ? (val / 1000).toFixed(1).replace('.0', '') + 'K'
      : val;
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target >= 1000 ? (target / 1000).toFixed(1).replace('.0', '') + 'K' : target;
  };
  requestAnimationFrame(step);
}

function triggerHeroCounters() {
  document.querySelectorAll('.hc-num').forEach(el => {
    const v = parseInt(el.dataset.val, 10);
    if (!isNaN(v)) countUp(el, v, 2000);
  });
}

/* About counters — trigger on scroll */
(function () {
  const wrap = document.querySelector('.about-stats');
  if (!wrap) return;
  let fired = false;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !fired) {
        fired = true;
        wrap.querySelectorAll('.as-n').forEach(el => {
          const v = parseInt(el.dataset.val, 10);
          if (!isNaN(v)) countUp(el, v, 2200);
        });
      }
    });
  }, { threshold: 0.4 });
  obs.observe(wrap);
})();

/* ──────────────────────────────────────────────────────────────────
   9. SMOOTH SCROLL
────────────────────────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = (document.getElementById('nav')?.offsetHeight || 72) + 8;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });
})();

/* ──────────────────────────────────────────────────────────────────
   10. HERO PARALLAX
────────────────────────────────────────────────────────────────── */
(function () {
  const bg = document.querySelector('.hero-img');
  if (!bg) return;
  let raf = false;
  window.addEventListener('scroll', () => {
    if (!raf) {
      requestAnimationFrame(() => {
        if (window.scrollY < window.innerHeight) {
          bg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
        }
        raf = false;
      });
      raf = true;
    }
  }, { passive: true });
})();

/* ──────────────────────────────────────────────────────────────────
   11. ACTIVE NAV LINKS
────────────────────────────────────────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => {
          l.classList.toggle('act', l.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => obs.observe(s));
})();

/* ──────────────────────────────────────────────────────────────────
   12. CARD TILT — subtle 3D on hover
────────────────────────────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(max-width:960px)').matches) return;

  document.querySelectorAll('.mc, .wc, .hv-step, .pkg-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `perspective(1000px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateY(-5px) scale(1.015)`;
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ──────────────────────────────────────────────────────────────────
   13. GALLERY LIGHTBOX
────────────────────────────────────────────────────────────────── */
(function () {
  const items    = Array.from(document.querySelectorAll('.gi'));
  const lb       = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbCap    = document.getElementById('lbCaption');
  const lbClose  = document.getElementById('lbClose');
  const lbPrev   = document.getElementById('lbPrev');
  const lbNext   = document.getElementById('lbNext');
  if (!lb || !lbImg) return;

  let cur = 0;
  const imgs = items.map(i => ({ src: i.querySelector('img')?.src || '', lbl: i.dataset.lbl || '' }));

  const open = i => {
    cur = i;
    lbImg.src = imgs[i].src;
    if (lbCap) lbCap.textContent = imgs[i].lbl;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  const prev  = () => { cur = (cur - 1 + imgs.length) % imgs.length; lbImg.src = imgs[cur].src; if (lbCap) lbCap.textContent = imgs[cur].lbl; };
  const next  = () => { cur = (cur + 1) % imgs.length; lbImg.src = imgs[cur].src; if (lbCap) lbCap.textContent = imgs[cur].lbl; };

  items.forEach((it, i) => it.addEventListener('click', () => open(i)));
  lbClose?.addEventListener('click', close);
  lbPrev?.addEventListener('click', prev);
  lbNext?.addEventListener('click', next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
})();

/* ──────────────────────────────────────────────────────────────────
   14. FAQ ACCORDION
────────────────────────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      /* Close all */
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      /* Open clicked if it was closed */
      if (!wasOpen) item.classList.add('open');
    });
  });
})();

/* ──────────────────────────────────────────────────────────────────
   15. SERVICE LINE ANIMATION
────────────────────────────────────────────────────────────────── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const ln = e.target.querySelector('.svc-ln');
        if (ln) setTimeout(() => { ln.style.width = '48px'; }, 280);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.svc').forEach(s => obs.observe(s));
})();

/* ──────────────────────────────────────────────────────────────────
   16. MAGNETIC BUTTON EFFECT
────────────────────────────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(max-width:960px)').matches) return;
  document.querySelectorAll('.btn-gold, .btn-dark-solid, .nav-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width  / 2);
      const y = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
    }, { passive: true });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

/* ──────────────────────────────────────────────────────────────────
   17. IMAGE FADE-IN ON LOAD
────────────────────────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.55s ease';
    if (img.complete && img.naturalWidth) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load',  () => { img.style.opacity = '1'; });
      img.addEventListener('error', () => { img.style.opacity = '0.2'; img.style.filter = 'grayscale(1)'; });
    }
  });
})();

/* ──────────────────────────────────────────────────────────────────
   18. STAGGER CARD REVEAL ON SCROLL
────────────────────────────────────────────────────────────────── */
(function () {
  const grids = document.querySelectorAll('.mgrid, .wgrid');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.mc, .wc').forEach((card, i) => {
        if (!card.classList.contains('rv')) {
          setTimeout(() => {
            card.style.opacity   = '1';
            card.style.transform = 'none';
          }, i * 55);
        }
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.04 });
  grids.forEach(g => {
    g.querySelectorAll('.mc, .wc').forEach(c => {
      if (!c.classList.contains('rv')) {
        c.style.opacity   = '0';
        c.style.transform = 'translateY(28px)';
        c.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      }
    });
    obs.observe(g);
  });
})();

/* ──────────────────────────────────────────────────────────────────
   19. LOGO DOUBLE-CLICK → SCROLL TO TOP
────────────────────────────────────────────────────────────────── */
document.querySelector('.nav-logo')?.addEventListener('dblclick', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ──────────────────────────────────────────────────────────────────
   20. WHATSAPP TOOLTIP AUTO-SHOW
────────────────────────────────────────────────────────────────── */
(function () {
  const wa = document.querySelector('.wa-float');
  if (!wa) return;
  /* Bounce after 5 seconds to attract attention */
  setTimeout(() => {
    wa.style.animation = 'none';
    wa.style.transform = 'scale(1.18)';
    setTimeout(() => { wa.style.transform = ''; wa.style.animation = ''; }, 400);
  }, 5000);
})();

/* ──────────────────────────────────────────────────────────────────
   21. RESIZE — reinitialise on resize
────────────────────────────────────────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    /* Re-observe reveals that may have appeared */
    document.querySelectorAll('.rv:not(.in), .rv-left:not(.in), .rv-right:not(.in)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) el.classList.add('in');
    });
  }, 200);
}, { passive: true });

/* ──────────────────────────────────────────────────────────────────
   22. HERO STATS — also trigger when hero stats are visible
────────────────────────────────────────────────────────────────── */
(function () {
  const hc = document.querySelector('.hero-counters');
  if (!hc) return;
  let fired = false;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !fired) {
        fired = true;
        hc.querySelectorAll('.hc-num').forEach(el => {
          const v = parseInt(el.dataset.val, 10);
          if (!isNaN(v)) countUp(el, v, 1800);
        });
      }
    });
  }, { threshold: 0.5 });
  obs.observe(hc);
})();

/* ──────────────────────────────────────────────────────────────────
   23. SMOOTH PAGE TRANSITIONS (fade on link out)
────────────────────────────────────────────────────────────────── */
/* (Internal links use smooth scroll, external links open in _blank — no transition needed) */

/* ──────────────────────────────────────────────────────────────────
   24. PRELOAD WHATSAPP
────────────────────────────────────────────────────────────────── */
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    const link = document.createElement('link');
    link.rel = 'preconnect'; link.href = 'https://wa.me';
    document.head.appendChild(link);
  });
}

/* ──────────────────────────────────────────────────────────────────
   25. CONSOLE BRANDING
────────────────────────────────────────────────────────────────── */
console.log('%c JD STICH ', 'background:#c9a96e;color:#1a130a;font-family:Georgia,serif;font-size:16px;font-style:italic;padding:8px 20px;border-radius:2px;font-weight:700;');
console.log('%c Luxury Tailoring Studio · Sector 45 Noida · +91 99105 49820 ', 'color:#c9a96e;font-size:11px;font-family:monospace;');