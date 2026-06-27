// ===== STARS =====
(function createStars() {
  const container = document.getElementById('starsBg');
  if (!container) return;
  const count = window.innerWidth < 600 ? 80 : 160;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = (Math.random() * 4 + 2).toFixed(2);
    const delay = (Math.random() * 6).toFixed(2);
    const minOp = (Math.random() * 0.3 + 0.1).toFixed(2);
    star.style.cssText = `
      width:${size}px;height:${size}px;
      left:${x}%;top:${y}%;
      --dur:${dur}s;--delay:${delay}s;--min-op:${minOp};
    `;
    container.appendChild(star);
  }
})();

// ===== NAVBAR SCROLL =====
(function navbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  function update() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
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
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

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
        if (p.id === target) {
          p.classList.add('active');
          // Re-trigger scroll-reveal inside new panel
          const reveals = p.querySelectorAll('.scroll-reveal');
          reveals.forEach(el => {
            el.classList.remove('revealed');
            setTimeout(() => el.classList.add('revealed'), 80);
          });
        } else {
          p.classList.remove('active');
        }
      });
    });
  });

  // Activate reveals in the first panel on load
  const firstPanel = document.querySelector('.horoscope-panel.active');
  if (firstPanel) {
    setTimeout(() => {
      firstPanel.querySelectorAll('.scroll-reveal').forEach(el => el.classList.add('revealed'));
    }, 300);
  }
})();

// ===== COUNTER ANIMATION =====
(function counterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ===== CONTACT FORM =====
(function contactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✦ Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      form.reset();
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1400);
  });
})();

// ===== SMOOTH ZODIAC CARD PARALLAX =====
(function zodiacCardTilt() {
  const cards = document.querySelectorAll('.zodiac-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ===== ACTIVE NAV LINK ON SCROLL =====
(function activeNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  function update() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? '#fff' : '';
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
