// ===== BACKGROUND MUSIC =====
(function bgMusic() {
  const audio = document.getElementById('bgMusic');
  const btn   = document.getElementById('musicBtn');
  const icon  = document.getElementById('musicIcon');
  if (!audio || !btn) return;

  let playing = false;

  function setPlaying(state) {
    playing = state;
    btn.classList.toggle('is-playing', state);
    icon.classList.toggle('muted', !state);
    btn.title = state ? 'Mute music' : 'Play music';
    if (state) {
      audio.volume = 0.35;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  // Try autoplay on load
  audio.volume = 0.35;
  const tryAutoplay = audio.play();
  if (tryAutoplay !== undefined) {
    tryAutoplay.then(() => {
      playing = true;
      btn.classList.add('is-playing');
      icon.classList.remove('muted');
      btn.title = 'Mute music';
    }).catch(() => {
      // Autoplay blocked — wait for first user interaction
      playing = false;
      icon.classList.add('muted');
      btn.title = 'Play music';

      const startOnInteraction = () => {
        if (!playing) {
          audio.play().then(() => {
            setPlaying(true);
          }).catch(() => {});
        }
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('keydown', startOnInteraction);
        document.removeEventListener('touchstart', startOnInteraction);
      };

      document.addEventListener('click', startOnInteraction, { once: true });
      document.addEventListener('keydown', startOnInteraction, { once: true });
      document.addEventListener('touchstart', startOnInteraction, { once: true });
    });
  }

  // Toggle on button click
  btn.addEventListener('click', e => {
    e.stopPropagation();
    setPlaying(!playing);
  });
})();

// ===== ZODIAC CANVAS ANIMATION =====
(function zodiacCanvas() {
  const canvas = document.getElementById('zodiacCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const signs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  const names = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];

  let W, H, cx, cy, radius, angle = 0;
  let raf;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cx = W / 2;
    cy = H / 2;
    radius = Math.min(W, H) * 0.38;
  }

  function drawStar(x, y, r, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.5 + 0.1,
    speed: Math.random() * 0.02 + 0.005,
    phase: Math.random() * Math.PI * 2
  }));

  function drawStars(t) {
    stars.forEach(s => {
      const a = s.alpha * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase)));
      drawStar(s.x * W, s.y * H, s.r, '#fff', a);
    });
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    drawStars(t);

    const speed = 0.00055;
    angle = t * speed;

    // Outer decorative ring
    ctx.save();
    ctx.strokeStyle = 'rgba(212,168,67,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Main ring
    ctx.save();
    ctx.strokeStyle = 'rgba(212,168,67,0.10)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Inner ring
    ctx.save();
    ctx.strokeStyle = 'rgba(212,168,67,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Centre symbol
    ctx.save();
    ctx.font = `${radius * 0.2}px serif`;
    ctx.fillStyle = 'rgba(212,168,67,0.08)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⊕', cx, cy);
    ctx.restore();

    // 12 Zodiac signs
    const count = signs.length;
    for (let i = 0; i < count; i++) {
      const theta = angle + (i / count) * Math.PI * 2;
      const x = cx + radius * Math.cos(theta);
      const y = cy + radius * Math.sin(theta);

      // Dot on ring
      ctx.save();
      ctx.fillStyle = 'rgba(212,168,67,0.35)';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Spoke
      ctx.save();
      ctx.strokeStyle = 'rgba(212,168,67,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.restore();

      // Glyph
      const glyphSize = Math.max(14, radius * 0.095);
      ctx.save();
      ctx.font = `${glyphSize}px serif`;
      ctx.fillStyle = `rgba(212,168,67,${0.45 + 0.25 * Math.sin(t * 0.001 + i)})`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(signs[i], x, y - glyphSize * 1.1);
      ctx.restore();

      // Name
      const nameSize = Math.max(9, radius * 0.045);
      ctx.save();
      ctx.font = `${nameSize}px 'Cinzel', serif`;
      ctx.fillStyle = `rgba(212,168,67,0.18)`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(names[i].toUpperCase(), x, y + glyphSize * 0.8);
      ctx.restore();
    }

    raf = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  raf = requestAnimationFrame(draw);
})();

// ===== NAVBAR SCROLL =====
(function navbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  navbar.classList.toggle('scrolled', window.scrollY > 40);
})();

// ===== HAMBURGER MENU =====
(function hamburgerMenu() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// ===== SCROLL REVEAL =====
(function scrollReveal() {
  const items = document.querySelectorAll('.scroll-reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();

// ===== HOROSCOPE TABS =====
(function horoscopeTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.horoscope-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      panels.forEach(p => {
        p.classList.toggle('active', p.id === target);
        if (p.id === target) {
          p.querySelectorAll('.scroll-reveal').forEach(el => {
            el.classList.remove('revealed');
            setTimeout(() => el.classList.add('revealed'), 80);
          });
        }
      });
    });
  });

  const firstPanel = document.querySelector('.horoscope-panel.active');
  if (firstPanel) setTimeout(() => firstPanel.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('revealed')), 300);
})();

// ===== COUNTER ANIMATION =====
(function counterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(easeOut(p) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ===== ZODIAC CARD TILT =====
(function zodiacCardTilt() {
  document.querySelectorAll('.zodiac-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

// ===== ACTIVE NAV ON SCROLL =====
(function activeNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function update() {
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 120) current = sec.id; });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ===== QUICK READING FORM (HOME PAGE) =====
(function quickReadingForm() {
  const form = document.getElementById('quickReadingForm');
  if (!form) return;

  const WA_NUMBER = '919038414366';

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name  = document.getElementById('qrName').value.trim();
    const phone = document.getElementById('qrPhone').value.trim();
    const dob   = document.getElementById('qrDob').value;
    const tob   = document.getElementById('qrTob').value;
    const pob   = document.getElementById('qrPob').value.trim();
    const typeEl = form.querySelector('input[name="qrType"]:checked');
    const type  = typeEl ? typeEl.value : '';

    if (!name) { document.getElementById('qrName').focus(); return; }
    if (!phone) { document.getElementById('qrPhone').focus(); return; }
    if (!dob) { document.getElementById('qrDob').focus(); return; }
    if (!type) { form.querySelector('input[name="qrType"]').focus(); return; }

    const dobFormatted = dob ? new Date(dob + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : dob;

    let tobFormatted = tob;
    if (tob) {
      const [h, m] = tob.split(':').map(Number);
      tobFormatted = `${String(h % 12 || 12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
    }

    const lines = [
      `✦ *${type} Request — VedArcana* ✦`,
      '━━━━━━━━━━━━━━━━━━━━━━',
      `👤 *Name:* ${name}`,
      `📱 *Phone:* ${phone}`,
      `🎂 *Date of Birth:* ${dobFormatted}`,
    ];
    if (tobFormatted) lines.push(`🕐 *Time of Birth:* ${tobFormatted}`);
    if (pob) lines.push(`📍 *Place of Birth:* ${pob}`);
    lines.push('━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('_Sent via VedArcana website_');

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();

// ===== WHATSAPP BOOKING FORM =====
(function whatsappForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const WA_NUMBER = '919038414366';

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('clientName').value.trim();
    const phone   = document.getElementById('clientPhone').value.trim();
    const dob     = document.getElementById('clientDob').value;
    const tob     = document.getElementById('clientTob').value;
    const pob     = document.getElementById('clientPob').value.trim();
    const service = document.getElementById('serviceType').value;
    const query   = document.getElementById('clientQuery').value.trim();

    if (!name || !phone || !dob || !tob || !pob) {
      const firstEmpty = [
        ['clientName', name],
        ['clientPhone', phone],
        ['clientDob', dob],
        ['clientTob', tob],
        ['clientPob', pob]
      ].find(([, v]) => !v);
      if (firstEmpty) document.getElementById(firstEmpty[0]).focus();
      return;
    }

    // Format DOB nicely
    const dobFormatted = dob ? new Date(dob + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : dob;

    // Format TOB nicely
    let tobFormatted = tob;
    if (tob) {
      const [h, m] = tob.split(':').map(Number);
      const ampm = h >= 12 ? 'PM' : 'AM';
      tobFormatted = `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
    }

    const lines = [
      '✦ *New Consultation Request — VedArcana* ✦',
      '━━━━━━━━━━━━━━━━━━━━━━',
      `👤 *Name:* ${name}`,
      `📱 *Phone:* ${phone}`,
      `🎂 *Date of Birth:* ${dobFormatted}`,
      `🕐 *Time of Birth:* ${tobFormatted}`,
      `📍 *Place of Birth:* ${pob}`,
    ];

    if (service) lines.push(`🔮 *Service:* ${service}`);
    if (query)   lines.push(`💬 *Query:* ${query}`);

    lines.push('━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('_Sent via VedArcana website_');

    const message = lines.join('\n');
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();
