/* Slovak Cyber Team — main.js */
(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  const burger = document.querySelector('.nav-burger');
  const nav = document.querySelector('.site-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Hero terminal typing ---------- */
  const term = document.querySelector('.hero__term');
  if (term) {
    const phrases = () => {
      const lang = document.documentElement.lang || 'sk';
      return lang === 'sk'
        ? ['reprezentujeme Slovensko_', 'crypto / pwn / web / rev / forensics', 'TOP 4 v Európe 2025', './pridaj_sa --vek 15-25']
        : ['representing Slovakia_', 'crypto / pwn / web / rev / forensics', 'TOP 4 in Europe 2025', './join_us --age 15-25'];
    };
    const textNode = term.querySelector('.term-text');
    let pi = 0, ci = 0, deleting = false;
    const tick = () => {
      const list = phrases();
      const cur = list[pi % list.length];
      if (!deleting) {
        ci++;
        if (ci >= cur.length) { deleting = true; setTimeout(tick, 2200); textNode.textContent = cur; return; }
      } else {
        ci--;
        if (ci <= 0) { deleting = false; pi++; }
      }
      textNode.textContent = cur.slice(0, ci);
      setTimeout(tick, deleting ? 28 : 65);
    };
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTimeout(tick, 600);
    } else {
      textNode.textContent = phrases()[0];
      document.addEventListener('sct:lang', () => { textNode.textContent = phrases()[0]; });
    }
  }

  /* ---------- focus trap helper (modal + lightbox) ---------- */
  const trapTab = (container) => {
    container.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !container.classList.contains('open')) return;
      const focusables = container.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    });
  };

  /* ---------- Member modal ---------- */
  const modal = document.getElementById('member-modal');
  if (modal) {
    const mImg = modal.querySelector('img');
    const mName = modal.querySelector('.modal-name');
    const mRole = modal.querySelector('.modal-role');
    const mAffil = modal.querySelector('.modal-affil');
    const mBio = modal.querySelector('.modal-bio');
    let lastFocus = null;

    const openModal = (card) => {
      lastFocus = card;
      const photo = card.querySelector('.member__photo img');
      const name = card.querySelector('.member__name');
      const role = card.querySelector('.member__role');
      const affil = card.querySelector('.member__affil');
      const bio = card.querySelector('.member__bio');
      mImg.src = photo ? photo.src : '';
      mImg.alt = name ? name.textContent : '';
      mName.textContent = name ? name.textContent : '';
      mRole.textContent = role ? role.textContent : '';
      mAffil.textContent = affil ? affil.textContent : '';
      mBio.innerHTML = bio ? bio.innerHTML : '';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      modal.querySelector('.modal__close').focus();
    };
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    // only cards that actually carry a bio open the modal
    // (.filter instead of :has() — works in older Firefox/Safari too)
    Array.from(document.querySelectorAll('.member'))
      .filter((card) => card.querySelector('.member__bio'))
      .forEach((card) => {
        card.classList.add('member--clickable');
        card.setAttribute('tabindex', '0');
        card.addEventListener('click', () => openModal(card));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
        });
      });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    modal.querySelector('.modal__close').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
    trapTab(modal);
  }

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const links = Array.from(document.querySelectorAll('.gallery a'));
    let idx = 0;
    let lbLastFocus = null;
    const show = (i) => {
      idx = (i + links.length) % links.length;
      lbImg.src = links[idx].getAttribute('href');
      lbImg.alt = links[idx].querySelector('img').alt || '';
      if (!lightbox.classList.contains('open')) {
        lbLastFocus = document.activeElement;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('.lb-close').focus();
      }
    };
    const hide = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      if (lbLastFocus) lbLastFocus.focus();
    };
    links.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); show(i); }));
    lightbox.querySelector('.lb-close').addEventListener('click', hide);
    lightbox.querySelector('.lb-prev').addEventListener('click', () => show(idx - 1));
    lightbox.querySelector('.lb-next').addEventListener('click', () => show(idx + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) hide(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    trapTab(lightbox);
  }

  /* ---------- CTF easter egg ---------- */
  const FLAG = 'SCT{v1t4j_v_t1me_n4p1s_n4m}';
  console.log(
    '%c\n  ███ SLOVAK CYBER TEAM ███\n',
    'color:#e2251f;font-family:monospace;font-size:16px;font-weight:bold'
  );
  console.log(
    '%cZdravíme zvedavých. Presne takých hľadáme.\nGreetings, curious one. That\'s exactly who we\'re looking for.\n\n' + FLAG,
    'color:#1b5db4;font-family:monospace;font-size:12px'
  );

  // Konami code → brief matrix rain
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  document.addEventListener('keydown', (e) => {
    pos = (e.key === seq[pos]) ? pos + 1 : (e.key === seq[0] ? 1 : 0);
    if (pos === seq.length) { pos = 0; matrixRain(); }
  });
  function matrixRain() {
    if (document.getElementById('mrain')) return;
    const c = document.createElement('canvas');
    c.id = 'mrain';
    c.style.cssText = 'position:fixed;inset:0;z-index:999;pointer-events:none';
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    c.width = innerWidth; c.height = innerHeight;
    const cols = Math.floor(c.width / 16);
    const drops = Array(cols).fill(0);
    const chars = '01SCTECSC{}#$&@!<>/\\';
    const iv = setInterval(() => {
      ctx.fillStyle = 'rgba(10,20,40,0.12)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.font = '15px monospace';
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() > 0.92 ? '#e2251f' : '#2f7fe0';
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, y * 16);
        drops[i] = (y * 16 > c.height && Math.random() > 0.97) ? 0 : y + 1;
      });
    }, 50);
    setTimeout(() => { clearInterval(iv); c.remove(); }, 6000);
  }
})();
