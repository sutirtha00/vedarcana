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
      `✦ *${type} Request — AstroArcana* ✦`,
      '━━━━━━━━━━━━━━━━━━━━━━',
      `👤 *Name:* ${name}`,
      `📱 *Phone:* ${phone}`,
      `🎂 *Date of Birth:* ${dobFormatted}`,
    ];
    if (tobFormatted) lines.push(`🕐 *Time of Birth:* ${tobFormatted}`);
    if (pob) lines.push(`📍 *Place of Birth:* ${pob}`);
    lines.push('━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('_Sent via AstroArcana website_');

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
      '✦ *New Consultation Request — AstroArcana* ✦',
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
    lines.push('_Sent via AstroArcana website_');

    const message = lines.join('\n');
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();

// ===== FREE TAROT CARD READING =====
(function freeTarot() {
  const IMG = 'https://www.sacred-texts.com/tarot/pkt/img/';

  const DECK = [
    // ── MAJOR ARCANA ──
    { name:'The Fool', img:'ar00.jpg', suit:'Major Arcana · 0', keys:['New Beginnings','Spontaneity','Leap of Faith','Adventure'], meaning:'The Fool invites you to embrace the unknown with an open heart and a spirit of wonder. A bold new chapter begins — trust the journey, even if you cannot see where the path leads.' },
    { name:'The Magician', img:'ar01.jpg', suit:'Major Arcana · I', keys:['Willpower','Manifestation','Skill','Action'], meaning:'The Magician reminds you that you already possess every tool you need to shape your reality. Channel your focus, harness your talents, and take deliberate action toward your goals.' },
    { name:'The High Priestess', img:'ar02.jpg', suit:'Major Arcana · II', keys:['Intuition','Inner Wisdom','Mystery','Patience'], meaning:'The High Priestess urges you to turn inward and trust the quiet voice of your intuition. Not everything needs to be revealed at once — sit with the mystery and let wisdom arise naturally.' },
    { name:'The Empress', img:'ar03.jpg', suit:'Major Arcana · III', keys:['Fertility','Abundance','Nurturing','Creativity'], meaning:'The Empress signals a time of flourishing — in relationships, creative work, or material comfort. Allow yourself to receive abundance fully; tend to what you love and watch it bloom.' },
    { name:'The Emperor', img:'ar04.jpg', suit:'Major Arcana · IV', keys:['Authority','Structure','Stability','Leadership'], meaning:'The Emperor calls you to build solid foundations and exercise disciplined authority over your domain. Order and responsibility are your allies — lead with clarity and protect what matters most.' },
    { name:'The Hierophant', img:'ar05.jpg', suit:'Major Arcana · V', keys:['Tradition','Spiritual Guidance','Convention','Mentorship'], meaning:'The Hierophant points toward established wisdom, spiritual institutions, or a trusted teacher. Seek guidance within proven systems and align your actions with your deepest values and beliefs.' },
    { name:'The Lovers', img:'ar06.jpg', suit:'Major Arcana · VI', keys:['Love','Choice','Alignment','Partnership'], meaning:'The Lovers is not only about romance — it is about the choices that define who you are. Make a heartfelt decision rooted in your values, and align yourself with relationships that reflect your authentic self.' },
    { name:'The Chariot', img:'ar07.jpg', suit:'Major Arcana · VII', keys:['Determination','Victory','Control','Momentum'], meaning:'The Chariot signals that victory is within reach — but only through focused willpower and mastery of opposing forces. Drive forward with confidence; do not let contradictions derail you from your path.' },
    { name:'Strength', img:'ar08.jpg', suit:'Major Arcana · VIII', keys:['Courage','Patience','Inner Strength','Compassion'], meaning:'Strength reveals that your greatest power lies not in force, but in gentle, patient courage. Face your fears and challenges with a calm heart — you have more resilience than you realise.' },
    { name:'The Hermit', img:'ar09.jpg', suit:'Major Arcana · IX', keys:['Solitude','Introspection','Inner Guide','Wisdom'], meaning:'The Hermit calls you inward for a period of quiet reflection and self-discovery. Withdraw from the noise of the world, hold your lantern of truth, and illuminate the path only you can walk.' },
    { name:'Wheel of Fortune', img:'ar10.jpg', suit:'Major Arcana · X', keys:['Cycles','Fate','Turning Point','Opportunity'], meaning:'The Wheel of Fortune announces a significant turning point — the universe is shifting in your favour. Embrace the change; cycles of fortune rise and fall, and this moment marks an upswing.' },
    { name:'Justice', img:'ar11.jpg', suit:'Major Arcana · XI', keys:['Truth','Fairness','Balance','Accountability'], meaning:'Justice demands honesty with yourself and the world. Decisions and consequences are in alignment now — act with integrity, seek balance, and trust that what is right will ultimately prevail.' },
    { name:'The Hanged Man', img:'ar12.jpg', suit:'Major Arcana · XII', keys:['Surrender','New Perspective','Pause','Letting Go'], meaning:'The Hanged Man asks you to pause, release control, and see your situation from an entirely new angle. What feels like a sacrifice may in fact be the key to your liberation and deeper wisdom.' },
    { name:'Death', img:'ar13.jpg', suit:'Major Arcana · XIII', keys:['Transformation','Endings','Transition','Release'], meaning:'Death heralds profound transformation — an old chapter is closing so a new one can begin. Release what no longer serves you; this ending carries the seed of necessary and beautiful renewal.' },
    { name:'Temperance', img:'ar14.jpg', suit:'Major Arcana · XIV', keys:['Balance','Moderation','Patience','Harmony'], meaning:'Temperance invites you to blend opposing energies with grace and find the perfect middle path. Flow gently between extremes, practise patience, and allow healing and equilibrium to restore you.' },
    { name:'The Devil', img:'ar15.jpg', suit:'Major Arcana · XV', keys:['Shadow Self','Attachment','Illusion','Materialism'], meaning:'The Devil exposes the chains of habit, addiction, or false belief that keep you bound. Look clearly at what holds you captive — the key to freedom lies in acknowledging and then releasing those shadows.' },
    { name:'The Tower', img:'ar16.jpg', suit:'Major Arcana · XVI', keys:['Sudden Change','Revelation','Upheaval','Breakthrough'], meaning:'The Tower signals an abrupt revelation that shatters structures built on unstable ground. Though the disruption feels alarming, it clears the way for something far more authentic to be built.' },
    { name:'The Star', img:'ar17.jpg', suit:'Major Arcana · XVII', keys:['Hope','Renewal','Inspiration','Serenity'], meaning:'The Star appears after the storm to offer hope, healing, and renewed faith in the future. Trust in the universe\'s guiding light — you are being restored and guided toward a luminous path.' },
    { name:'The Moon', img:'ar18.jpg', suit:'Major Arcana · XVIII', keys:['Illusion','Subconscious','Dreams','Uncertainty'], meaning:'The Moon illuminates the landscape of your subconscious — but its light also casts deceptive shadows. Tread carefully through confusion and fear; trust your intuition rather than surface appearances.' },
    { name:'The Sun', img:'ar19.jpg', suit:'Major Arcana · XIX', keys:['Joy','Vitality','Success','Clarity'], meaning:'The Sun is one of the most radiant cards in the deck — heralding joy, clarity, and joyful success. Celebrate your achievements, step into the warmth of your full potential, and let your light shine freely.' },
    { name:'Judgement', img:'ar20.jpg', suit:'Major Arcana · XX', keys:['Awakening','Rebirth','Reflection','Calling'], meaning:'Judgement calls you to rise from the past with total forgiveness and clarity of purpose. This is a moment of profound awakening — hear your soul\'s calling and answer it without hesitation.' },
    { name:'The World', img:'ar21.jpg', suit:'Major Arcana · XXI', keys:['Completion','Integration','Achievement','Wholeness'], meaning:'The World marks the triumphant conclusion of a great cycle — all elements are in harmony and your goals have been reached. Celebrate this wholeness, then stand ready for the next magnificent journey.' },

    // ── WANDS ──
    { name:'Ace of Wands', img:'wa01.jpg', suit:'Wands', keys:['Inspiration','New Spark','Creative Fire','Potential'], meaning:'The Ace of Wands delivers a burst of creative inspiration and fiery new beginnings. Seize this potent energy and plant the seed of your most passionate vision — the moment to begin is now.' },
    { name:'Two of Wands', img:'wa02.jpg', suit:'Wands', keys:['Planning','Future Vision','Expansion','Confidence'], meaning:'You stand at the threshold between what is familiar and an exciting new frontier. Plan boldly, claim your vision, and know that the world is wide enough for everything you dare to imagine.' },
    { name:'Three of Wands', img:'wa03.jpg', suit:'Wands', keys:['Expansion','Foresight','Waiting','Opportunity'], meaning:'Your plans have been set in motion and you now await their results on the horizon. Expand your vision beyond local borders — international or far-reaching opportunities are drawing near.' },
    { name:'Four of Wands', img:'wa04.jpg', suit:'Wands', keys:['Celebration','Harmony','Home','Milestone'], meaning:'The Four of Wands heralds a joyful celebration — a milestone reached, a homecoming, or a happy gathering of community. Relish this moment of achievement; you have earned this harmony.' },
    { name:'Five of Wands', img:'wa05.jpg', suit:'Wands', keys:['Competition','Conflict','Challenge','Diversity'], meaning:'The Five of Wands shows a field of competing ideas and energies — the friction is creative, not destructive. Engage with the challenge, assert your perspective clearly, and let the best idea win.' },
    { name:'Six of Wands', img:'wa06.jpg', suit:'Wands', keys:['Victory','Recognition','Leadership','Confidence'], meaning:'Public recognition and well-deserved success arrive with the Six of Wands. Accept the acknowledgement gracefully and use this moment of confidence to inspire and lead others forward.' },
    { name:'Seven of Wands', img:'wa07.jpg', suit:'Wands', keys:['Courage','Perseverance','Defense','Standing Firm'], meaning:'You hold the high ground — now defend it. The Seven of Wands urges you to stand firm in your convictions despite opposition and hold your position with confident, resolute courage.' },
    { name:'Eight of Wands', img:'wa08.jpg', suit:'Wands', keys:['Speed','Action','Movement','Communication'], meaning:'The Eight of Wands brings swift movement — messages arrive, travel begins, and events accelerate dramatically. Ride this momentum; everything is moving in the right direction at great speed.' },
    { name:'Nine of Wands', img:'wa09.jpg', suit:'Wands', keys:['Resilience','Last Effort','Courage','Boundaries'], meaning:'You are weary but almost at the finish line. The Nine of Wands asks for one final surge of courage and resilience — you have come too far to give up now.' },
    { name:'Ten of Wands', img:'wa10.jpg', suit:'Wands', keys:['Burden','Responsibility','Overwhelm','Delegation'], meaning:'The Ten of Wands reveals that you are carrying more than your fair share of responsibility. Assess what you can release, delegate, or restructure — you cannot pour from an empty vessel.' },
    { name:'Page of Wands', img:'wapa.jpg', suit:'Wands', keys:['Enthusiasm','Exploration','Free Spirit','New Ideas'], meaning:'The Page of Wands arrives with youthful fire and an explorer\'s spirit — eager to try, daring to begin. Approach your situation with fresh eyes, curiosity, and the courage to act on new ideas.' },
    { name:'Knight of Wands', img:'wakn.jpg', suit:'Wands', keys:['Adventure','Passion','Energy','Impulsiveness'], meaning:'The Knight of Wands is bold, passionate, and unstoppable — acting on impulse with infectious confidence. Channel this fiery energy purposefully; let your passion drive you forward without burning out.' },
    { name:'Queen of Wands', img:'waqu.jpg', suit:'Wands', keys:['Charisma','Determination','Warmth','Independence'], meaning:'The Queen of Wands is a magnetic, courageous leader who knows exactly who she is. Stand in your power with warmth and confidence — you have the creative fire and the will to make things happen.' },
    { name:'King of Wands', img:'waki.jpg', suit:'Wands', keys:['Leadership','Vision','Entrepreneurship','Boldness'], meaning:'The King of Wands is a visionary leader who turns grand ideas into bold realities. Claim your authority, lead by inspiration, and pursue your long-term vision with unflinching determination.' },

    // ── CUPS ──
    { name:'Ace of Cups', img:'cu01.jpg', suit:'Cups', keys:['New Emotion','Love','Compassion','Intuition'], meaning:'The Ace of Cups pours forth an overflowing well of emotional new beginnings — love, compassion, and deep intuition. Open your heart fully to receive this gift; a profound emotional connection is at hand.' },
    { name:'Two of Cups', img:'cu02.jpg', suit:'Cups', keys:['Partnership','Mutual Attraction','Union','Balance'], meaning:'The Two of Cups heralds a deep and harmonious partnership — romantic or otherwise — built on mutual respect and understanding. Two souls are recognising each other\'s worth and choosing to walk together.' },
    { name:'Three of Cups', img:'cu03.jpg', suit:'Cups', keys:['Celebration','Friendship','Community','Joy'], meaning:'The Three of Cups calls for joyful celebration among friends and community. Cherish the bonds you share, lift each other up, and allow yourself to revel in the abundance of heartfelt connection.' },
    { name:'Four of Cups', img:'cu04.jpg', suit:'Cups', keys:['Contemplation','Apathy','Reevaluation','Withdrawal'], meaning:'The Four of Cups asks you to look up from your discontent — a quiet offer is being extended that you may be overlooking. Reflect inwardly on what truly matters before you dismiss what is being given.' },
    { name:'Five of Cups', img:'cu05.jpg', suit:'Cups', keys:['Loss','Grief','Regret','Resilience'], meaning:'The Five of Cups acknowledges your grief and loss with full compassion. Yet two cups remain standing behind you — shift your gaze to what endures, and allow yourself to begin gently moving forward.' },
    { name:'Six of Cups', img:'cu06.jpg', suit:'Cups', keys:['Nostalgia','Innocence','Past','Reunion'], meaning:'The Six of Cups invites you to revisit cherished memories, reconnect with your inner child, or welcome someone from your past. Let the sweetness of innocent joy be a balm for the present moment.' },
    { name:'Seven of Cups', img:'cu07.jpg', suit:'Cups', keys:['Fantasy','Illusion','Choices','Wishful Thinking'], meaning:'The Seven of Cups presents a dazzling array of possibilities — but not all are real or wise. Ground yourself in discernment; not every glittering vision deserves your energy. Choose with clarity.' },
    { name:'Eight of Cups', img:'cu08.jpg', suit:'Cups', keys:['Withdrawal','Moving On','Disappointment','Seeking Meaning'], meaning:'Something emotionally fulfilling is no longer satisfying at the deepest level. The Eight of Cups grants you the courage to walk away and seek what truly resonates with your soul\'s authentic path.' },
    { name:'Nine of Cups', img:'cu09.jpg', suit:'Cups', keys:['Contentment','Wishes Fulfilled','Satisfaction','Gratitude'], meaning:'The Nine of Cups is the wish card — a sign that your heartfelt desires are manifesting beautifully. Allow yourself to feel genuine satisfaction and savour this moment of emotional fulfilment.' },
    { name:'Ten of Cups', img:'cu10.jpg', suit:'Cups', keys:['Joy','Family','Harmony','Completion'], meaning:'The Ten of Cups is the card of lasting happiness, loving family, and emotional wholeness. Your relationships are blessed and your heart\'s deepest dream of harmony is being fulfilled.' },
    { name:'Page of Cups', img:'cupa.jpg', suit:'Cups', keys:['Sensitivity','Intuition','Creativity','Messages'], meaning:'The Page of Cups brings surprising, whimsical emotional messages and creative inspiration. Stay open to unexpected intuitive nudges and allow your imagination to carry you toward something magical.' },
    { name:'Knight of Cups', img:'cukn.jpg', suit:'Cups', keys:['Romance','Charm','Idealism','Following the Heart'], meaning:'The Knight of Cups is a romantic idealist who follows the call of the heart across any terrain. A beautiful invitation or heartfelt offer may arrive — be open to love and inspired creative pursuits.' },
    { name:'Queen of Cups', img:'cuqu.jpg', suit:'Cups', keys:['Empathy','Compassion','Intuition','Emotional Depth'], meaning:'The Queen of Cups is a deeply intuitive, nurturing presence who flows with emotional intelligence. Trust your empathic gifts, listen to your heart\'s wisdom, and offer compassion freely to yourself and others.' },
    { name:'King of Cups', img:'cuki.jpg', suit:'Cups', keys:['Emotional Mastery','Wisdom','Compassion','Diplomacy'], meaning:'The King of Cups has mastered the realm of emotion — calm, wise, and deeply compassionate under pressure. Lead with emotional intelligence, balance feeling with reason, and offer wise counsel to those around you.' },

    // ── SWORDS ──
    { name:'Ace of Swords', img:'sw01.jpg', suit:'Swords', keys:['Clarity','Truth','Breakthrough','Mental Power'], meaning:'The Ace of Swords cuts cleanly through confusion with the force of truth and clarity. A breakthrough moment arrives — speak your truth boldly, think clearly, and cut to the heart of any matter.' },
    { name:'Two of Swords', img:'sw02.jpg', suit:'Swords', keys:['Indecision','Stalemate','Blocked Emotion','Truce'], meaning:'The Two of Swords shows a mind blocked by indecision and a refusal to look at the full truth. Remove your blindfold — gather the facts you have been avoiding and make a clear, courageous decision.' },
    { name:'Three of Swords', img:'sw03.jpg', suit:'Swords', keys:['Heartbreak','Grief','Betrayal','Healing'], meaning:'The Three of Swords acknowledges real pain — heartbreak, loss, or a truth that pierces deeply. Allow yourself to grieve honestly; this wound, though sharp, contains the seeds of profound healing and clarity.' },
    { name:'Four of Swords', img:'sw04.jpg', suit:'Swords', keys:['Rest','Recovery','Contemplation','Retreat'], meaning:'The Four of Swords commands you to stop and rest before the next battle. Solitude, meditation, and deliberate recovery are not weakness — they are the strategic foundation for your next move.' },
    { name:'Five of Swords', img:'sw05.jpg', suit:'Swords', keys:['Conflict','Defeat','Loss','Hollow Victory'], meaning:'The Five of Swords warns that winning at all costs can leave everyone — including you — diminished. Consider whether the battle is truly worth the collateral damage, and choose peace over empty triumph.' },
    { name:'Six of Swords', img:'sw06.jpg', suit:'Swords', keys:['Transition','Moving On','Calm Waters','Relief'], meaning:'The Six of Swords carries you away from turbulent waters toward calmer shores. Although the journey is quiet and the grief is real, you are moving toward a safer and more peaceful chapter.' },
    { name:'Seven of Swords', img:'sw07.jpg', suit:'Swords', keys:['Deception','Strategy','Cunning','Avoidance'], meaning:'The Seven of Swords urges you to examine where deception — yours or another\'s — is at play. A strategic retreat may be necessary, but beware of dishonesty as a long-term strategy; truth always surfaces.' },
    { name:'Eight of Swords', img:'sw08.jpg', suit:'Swords', keys:['Restriction','Victimhood','Mental Blocks','Self-Limitation'], meaning:'The Eight of Swords reveals that you are more free than you believe — the bindings are largely self-imposed. Challenge the limiting beliefs that blind you; one courageous step toward truth will unravel the rest.' },
    { name:'Nine of Swords', img:'sw09.jpg', suit:'Swords', keys:['Anxiety','Nightmares','Fear','Mental Anguish'], meaning:'The Nine of Swords speaks to the anguish of a restless mind in the small hours of the night. Your fears are amplified by darkness — bring them into the light and seek the compassionate support you deserve.' },
    { name:'Ten of Swords', img:'sw10.jpg', suit:'Swords', keys:['Painful Endings','Betrayal','Rock Bottom','New Dawn'], meaning:'The Ten of Swords marks a definitive, painful ending — but the darkest hour precedes the dawn. Once you accept that this cycle is complete, the sunrise of an entirely new beginning awaits you.' },
    { name:'Page of Swords', img:'swpa.jpg', suit:'Swords', keys:['Curiosity','Vigilance','Mental Agility','Truth-Seeker'], meaning:'The Page of Swords is sharp-minded, inquisitive, and eager to uncover the truth at any cost. Question everything, gather information wisely, and communicate with both honesty and thoughtful precision.' },
    { name:'Knight of Swords', img:'swkn.jpg', suit:'Swords', keys:['Ambition','Action','Directness','Impulsivity'], meaning:'The Knight of Swords charges forward with fearless determination and razor-sharp focus. Act decisively on your convictions — but take a breath first to ensure your strategy is as sharp as your intentions.' },
    { name:'Queen of Swords', img:'swqu.jpg', suit:'Swords', keys:['Clarity','Independence','Directness','Perceptiveness'], meaning:'The Queen of Swords sees through illusion with unerring clarity and speaks truth without apology. Honour your own discernment, cut through pretence with grace, and lead with your brilliant, independent mind.' },
    { name:'King of Swords', img:'swki.jpg', suit:'Swords', keys:['Authority','Truth','Logic','Decisiveness'], meaning:'The King of Swords rules with intellectual authority, impartiality, and clear ethical standards. Use your formidable mind to cut to the truth, apply logic rigorously, and lead by the strength of sound judgment.' },

    // ── PENTACLES ──
    { name:'Ace of Pentacles', img:'pe01.jpg', suit:'Pentacles', keys:['Opportunity','Prosperity','New Venture','Manifestation'], meaning:'The Ace of Pentacles offers a golden seed of material opportunity — a new job, investment, or financial fresh start. Plant it with care, nurture it patiently, and watch prosperity take root in solid ground.' },
    { name:'Two of Pentacles', img:'pe02.jpg', suit:'Pentacles', keys:['Balance','Adaptability','Juggling','Time Management'], meaning:'The Two of Pentacles asks you to manage multiple demands with graceful flexibility. Life is in flux — stay nimble, prioritise wisely, and trust your ability to maintain balance amid the beautiful chaos.' },
    { name:'Three of Pentacles', img:'pe03.jpg', suit:'Pentacles', keys:['Teamwork','Craftsmanship','Collaboration','Learning'], meaning:'The Three of Pentacles celebrates the power of skilled collaboration and apprenticeship. Your efforts are being recognised — work with others, refine your craft, and take pride in building something of lasting value.' },
    { name:'Four of Pentacles', img:'pe04.jpg', suit:'Pentacles', keys:['Security','Control','Possessiveness','Stability'], meaning:'The Four of Pentacles signals a need to examine your relationship with security and control. True abundance flows — holding too tightly to what you have may prevent the richer life that is waiting for you.' },
    { name:'Five of Pentacles', img:'pe05.jpg', suit:'Pentacles', keys:['Hardship','Scarcity','Isolation','Resilience'], meaning:'The Five of Pentacles walks through hardship, yet the light of sanctuary glows just beside you. Reach out for support — spiritual, practical, or communal — and know that this difficult passage will not last.' },
    { name:'Six of Pentacles', img:'pe06.jpg', suit:'Pentacles', keys:['Generosity','Charity','Giving','Receiving'], meaning:'The Six of Pentacles speaks of the graceful exchange of resources — giving and receiving in equal measure. Whether you are the benefactor or the recipient, engage in this cycle with gratitude and open hands.' },
    { name:'Seven of Pentacles', img:'pe07.jpg', suit:'Pentacles', keys:['Patience','Investment','Long-term Vision','Harvest'], meaning:'The Seven of Pentacles asks you to pause and assess the long-term investment you have been tending. You have worked hard — trust the process, be patient with slow growth, and know the harvest is coming.' },
    { name:'Eight of Pentacles', img:'pe08.jpg', suit:'Pentacles', keys:['Diligence','Skill','Mastery','Dedication'], meaning:'The Eight of Pentacles is the card of devoted craftsmanship — the daily practice of getting better. Invest fully in your skill development right now; mastery is achieved one focused, intentional repetition at a time.' },
    { name:'Nine of Pentacles', img:'pe09.jpg', suit:'Pentacles', keys:['Abundance','Independence','Self-sufficiency','Luxury'], meaning:'The Nine of Pentacles celebrates the fruits of your patient labour — financial independence, refined taste, and elegant self-sufficiency. You have earned this comfort; allow yourself to enjoy it fully and without guilt.' },
    { name:'Ten of Pentacles', img:'pe10.jpg', suit:'Pentacles', keys:['Legacy','Family Wealth','Stability','Fulfilment'], meaning:'The Ten of Pentacles represents the pinnacle of material and familial achievement — lasting wealth, a loving home, and a meaningful legacy. What you build now will bless generations beyond your own.' },
    { name:'Page of Pentacles', img:'pepa.jpg', suit:'Pentacles', keys:['Ambition','Diligence','New Opportunity','Study'], meaning:'The Page of Pentacles is a diligent, ambitious student eager to learn a practical skill or begin a new material venture. Set your goals concretely, study your craft carefully, and take your first grounded step forward.' },
    { name:'Knight of Pentacles', img:'pekn.jpg', suit:'Pentacles', keys:['Responsibility','Hard Work','Reliability','Methodical'], meaning:'The Knight of Pentacles is slow and steady — methodical, reliable, and utterly committed to the task at hand. Trust the process, honour your commitments, and know that consistent effort always wins in the end.' },
    { name:'Queen of Pentacles', img:'pequ.jpg', suit:'Pentacles', keys:['Nurturing','Practicality','Abundance','Security'], meaning:'The Queen of Pentacles creates a sanctuary of warmth, comfort, and practical abundance for all she loves. Tend to your home, body, and finances with loving attention — you thrive when you nurture what grounds you.' },
    { name:'King of Pentacles', img:'peki.jpg', suit:'Pentacles', keys:['Wealth','Stability','Discipline','Provider'], meaning:'The King of Pentacles has mastered the material world through patience, discipline, and sound judgment. You are — or are becoming — a steady, generous provider whose security is built on enduring foundations.' }
  ];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const step1 = document.getElementById('ftStep1');
  const step2 = document.getElementById('ftStep2');
  const step3 = document.getElementById('ftStep3');
  const shuffleBtn = document.getElementById('ftShuffleBtn');
  const spread = document.getElementById('ftSpread');
  const drawAgainBtn = document.getElementById('ftDrawAgainBtn');

  if (!shuffleBtn) return;

  function goTo(step) {
    [step1, step2, step3].forEach(s => { if(s){ s.classList.remove('ft-active'); s.style.display=''; } });
    if (step) { step.classList.add('ft-active'); step.style.display='flex'; }
  }

  function buildSpread() {
    const shuffled = shuffle(DECK);
    const cards = shuffled.slice(0, 9);
    spread.innerHTML = '';
    cards.forEach((card, i) => {
      const el = document.createElement('div');
      el.className = 'ft-spread-card';
      el.title = 'Click to draw this card';
      el.style.animationDelay = (i * 0.06) + 's';
      el.addEventListener('click', () => revealCard(card, el));
      spread.appendChild(el);
    });
  }

  function revealCard(card, clickedEl) {
    // Grey out other cards
    spread.querySelectorAll('.ft-spread-card').forEach(c => {
      if (c !== clickedEl) c.classList.add('ft-picked');
    });
    clickedEl.style.transform = 'scale(1.12)';
    clickedEl.style.borderColor = 'var(--gold)';
    clickedEl.style.boxShadow = '0 0 30px rgba(212,168,67,0.6)';

    setTimeout(() => {
      // Populate reveal step — use Bengali data if language is set to Bengali
      const isBn = localStorage.getItem('aa-lang') === 'bn';
      const bn = isBn && window.TAROT_BN && window.TAROT_BN[card.name];
      const display = bn ? bn : card;

      const img = document.getElementById('ftCardImg');
      img.src = IMG + card.img;
      img.alt = display.name;
      img.className = '';
      img.onerror = function() {
        this.className = 'ft-img-error';
        this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="290" viewBox="0 0 180 290"><rect width="180" height="290" fill="%230d0b2a"/><text x="90" y="145" text-anchor="middle" fill="%23d4a843" font-size="14" font-family="serif">' + encodeURIComponent(display.name) + '</text></svg>';
      };

      document.getElementById('ftSuitBadge').textContent = display.suit;
      document.getElementById('ftCardName').textContent = display.name;

      const kwRow = document.getElementById('ftKeywordsRow');
      kwRow.innerHTML = display.keys.map(k => `<span class="ft-keyword">${k}</span>`).join('');

      document.getElementById('ftCardMeaning').textContent = display.meaning;

      // Reset card flip
      const inner = document.getElementById('ftCardInner');
      inner.classList.remove('ft-flipped');

      goTo(step3);

      // Trigger flip after paint
      requestAnimationFrame(() => {
        setTimeout(() => inner.classList.add('ft-flipped'), 120);
      });
    }, 500);
  }

  shuffleBtn.addEventListener('click', () => {
    shuffleBtn.textContent = localStorage.getItem('aa-lang') === 'bn' ? '✦ শাফল করা হচ্ছে...' : '✦ Shuffling...';
    shuffleBtn.disabled = true;
    setTimeout(() => {
      buildSpread();
      goTo(step2);
      step2.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  });

  drawAgainBtn.addEventListener('click', () => {
    shuffleBtn.textContent = localStorage.getItem('aa-lang') === 'bn' ? '✦ কার্ড শাফল করুন' : '✦ Shuffle & Spread the Cards';
    shuffleBtn.disabled = false;
    goTo(step1);
    step1.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
