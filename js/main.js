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

  /* ---------- Hero photo deck ---------- */
  const deck = document.getElementById('hero-deck');
  if (deck) {
    const cards = Array.from(deck.querySelectorAll('.deck-card'));
    const N = cards.length;
    let active = 0;
    const render = () => {
      cards.forEach((c, i) => {
        const k = (i - active + N) % N; // 0 = top of the deck
        c.style.zIndex = String(N - k);
        c.style.transform = 'rotate(' + (1.5 + k * 1.6) + 'deg) translate(' + (k * 8) + 'px, ' + (k * -6) + 'px)';
        c.style.filter = k ? 'brightness(' + Math.max(0.5, 1 - k * 0.16) + ')' : '';
      });
    };
    const setFromX = (clientX) => {
      const r = deck.getBoundingClientRect();
      const t = Math.min(Math.max((clientX - r.left) / r.width, 0), 0.999);
      const idx = Math.floor(t * N);
      if (idx !== active) { active = idx; render(); }
    };
    deck.addEventListener('mousemove', (e) => setFromX(e.clientX));
    deck.addEventListener('touchmove', (e) => setFromX(e.touches[0].clientX), { passive: true });
    deck.addEventListener('click', () => { active = (active + 1) % N; render(); });
    deck.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); active = (active + 1) % N; render(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); active = (active - 1 + N) % N; render(); }
    });
    render();
  }

  /* ---------- Achievements: collapse older entries ---------- */
  const tl = document.querySelector('#uspechy .timeline');
  const tlBtn = document.querySelector('.timeline-toggle');
  if (tl && tlBtn && tl.children.length > 5) {
    tl.classList.add('collapsed');
    tlBtn.hidden = false;
    tlBtn.addEventListener('click', () => {
      const open = !tl.classList.toggle('collapsed');
      tlBtn.setAttribute('aria-expanded', String(open));
    });
  }

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

  // Konami code → slot machine where the fruit is us (rosters 2022–2025)
  const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  document.addEventListener('keydown', (e) => {
    pos = (e.key === seq[pos]) ? pos + 1 : (e.key === seq[0] ? 1 : 0);
    if (pos === seq.length) { pos = 0; slotMachine(); }
  });

  // touch variant: swipe ↑↑↓↓←→←→, then flip the language twice (the B-A)
  const swipeSeq = ['U', 'U', 'D', 'D', 'L', 'R', 'L', 'R'];
  let sPos = 0, sLang = 0, sX = 0, sY = 0, sT = 0;
  let lastLang = document.documentElement.lang || 'sk';
  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    sX = t.clientX; sY = t.clientY; sT = Date.now();
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - sX, dy = t.clientY - sY;
    if (Date.now() - sT > 700 || Math.max(Math.abs(dx), Math.abs(dy)) < 48) return; // tap or slow drag
    const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'R' : 'L') : (dy > 0 ? 'D' : 'U');
    sPos = (dir === swipeSeq[sPos]) ? sPos + 1 : (dir === swipeSeq[0] ? 1 : 0);
    sLang = 0;
  }, { passive: true });
  document.addEventListener('sct:lang', (e) => {
    const lang = (e.detail && e.detail.lang) || document.documentElement.lang;
    if (lang === lastLang) return; // re-applying the active language doesn't count
    lastLang = lang;
    if (sPos === swipeSeq.length && ++sLang >= 2) { sPos = 0; sLang = 0; slotMachine(); }
  });

  // [photo, name, year] — one entry per roster spot; the same person in
  // different years counts as a match, so a jackpot can span three ročníky
  const SLOT_FACES = [
    ['seman22.jpg', 'Kevin Seman', 22],
    ['bittara22.jpg', 'Jakub Bittara', 22],
    ['csibrei22.jpg', 'Roland Csibrei', 22],
    ['geleta22.jpg', 'Marek Geleta', 22],
    ['kovacik22.jpg', 'Michal Kováčik', 22],
    ['lepies22.jpg', 'Ivan Lepieš', 22],
    ['loksa22.jpg', 'Tomáš Lokša', 22],
    ['marci22.jpg', 'Tomáš Marci', 22],
    ['melnicek22.jpg', 'Peter Melniček', 22],
    ['proks22.jpg', 'Tomáš Proks', 22],
    ['michalovic.jpg', 'Martin Mihalovič', 23],
    ['corba.jpg', 'Jakub Čorba', 23],
    ['geleta-1.jpg', 'Marek Geleta', 23],
    ['hadara.jpg', 'Adam Hadar', 23],
    ['janotkova.jpg', 'Tamara Janotková', 23],
    ['kolencik-1.jpg', 'Dušan Kolenčík', 23],
    ['las.jpg', 'Matej Laš', 23],
    ['lepies-1.jpg', 'Ivan Lepieš', 23],
    ['proks-1.jpg', 'Tomáš Proks', 23],
    ['zilincik-1.jpg', 'Richard Steven Žilinčík', 23],
    ['geleta.jpg', 'Marek Geleta', 24],
    ['hadar.jpg', 'Adam Hadar', 24],
    ['kolencik.jpg', 'Dušan Kolenčík', 24],
    ['lepies.jpg', 'Ivan Lepieš', 24],
    ['mandzak.jpg', 'Matúš Mandzák', 24],
    ['polan.jpg', 'Alex Polan', 24],
    ['proks.jpg', 'Tomáš Proks', 24],
    ['subjakova.jpg', 'Kristína Šubjaková', 24],
    ['zilincik.jpg', 'Richard Steven Žilinčík', 24],
    ['zuber.jpg', 'Jakub Ján Zuber', 24],
    ['geleta1.png', 'Marek Geleta', 25],
    ['andras1.png', 'Vladimír Andráš', 25],
    ['bohuslavskyi1.png', 'Nikita Bohuslavskyi', 25],
    ['hadar1.png', 'Adam Hadar', 25],
    ['kolencik1.png', 'Dušan Kolenčík', 25],
    ['lepies1.png', 'Ivan Lepieš', 25],
    ['lichvar1.png', 'Oliver Lichvár', 25],
    ['mandzak1.png', 'Matúš Mandzák', 25],
    ['subjakova1.png', 'Kristína Šubjaková', 25],
    ['varga1.png', 'Samuel Varga', 25],
  ];

  let slots = null;
  function slotMachine() {
    if (busted) { bluescreen(); return; } // cheaters don't get to play
    if (!slots) slots = buildSlotMachine();
    slots.open();
  }

  /* ---- skins (the cat in the sack) ---- */
  const SKIN_KEY = 'sct-skin';
  const SKINS = ['turbo', 'skin-matrix', 'skin-vapor'];
  const SKIN_NAMES = { 'turbo': 'GAMBA VEGAS', 'skin-matrix': 'MATRIX', 'skin-vapor': 'VAPORWAVE' };
  function applySkin(name) {
    SKINS.forEach((s) => document.documentElement.classList.remove(s));
    if (name) document.documentElement.classList.add(name);
    try {
      if (name) localStorage.setItem(SKIN_KEY, name);
      else localStorage.removeItem(SKIN_KEY);
    } catch (e) { /* private mode */ }
    let off = document.querySelector('.turbo-off');
    if (name && !off) {
      off = document.createElement('button');
      off.type = 'button';
      off.className = 'turbo-off';
      off.textContent = 'SKIN OFF';
      off.addEventListener('click', () => applySkin(null));
      document.body.appendChild(off);
    }
    if (!name && off) off.remove();
  }
  try { if (SKINS.indexOf(localStorage.getItem(SKIN_KEY)) !== -1) applySkin(localStorage.getItem(SKIN_KEY)); } catch (e) {}

  /* ---- banana coin bank — the balance sits right there in localStorage ---- */
  const BANK_KEY = 'sct-banana';
  const SEAL_KEY = 'sct-cache';
  const CHEAT_KEY = 'sct-telemetry';
  const MACKA_PRICE = 100;
  let bananas = 0;
  let busted = false;
  let skullsOn = false;
  const seal = (n) => {
    let h = 5381;
    const s = 'sct/banan/' + n;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  };
  const writeBank = (v) => {
    bananas = Math.max(0, v | 0);
    try {
      localStorage.setItem(BANK_KEY, String(bananas));
      localStorage.setItem(SEAL_KEY, seal(bananas));
    } catch (e) {}
  };
  try {
    const raw = localStorage.getItem(BANK_KEY);
    if (raw !== null) {
      const v = parseInt(raw, 10) || 0;
      if (localStorage.getItem(SEAL_KEY) === seal(v)) bananas = v;
      else if (v >= MACKA_PRICE) bust(); // walked in with a forged fortune
      else writeBank(0);
    }
  } catch (e) {}

  // the quiet part: a big balance jump that didn't come from the reels ends badly
  setInterval(() => {
    if (busted) return;
    try {
      const raw = localStorage.getItem(BANK_KEY);
      if (raw === String(bananas)) return;
      const v = parseInt(raw, 10) || 0;
      if (localStorage.getItem(SEAL_KEY) === seal(v)) { bananas = v; return; } // another tab, fair play
      if (Math.abs(v - bananas) >= MACKA_PRICE) bust();
      else writeBank(bananas); // small fiddling gets quietly reverted
    } catch (e) {}
  }, 1500);
  try { if (localStorage.getItem(CHEAT_KEY) === '1') { busted = true; skulls(); } } catch (e) {}

  function bust() {
    if (busted) return;
    busted = true;
    try { localStorage.setItem(CHEAT_KEY, '1'); } catch (e) {}
    skulls();
    bluescreen();
  }

  function skulls() {
    if (skullsOn || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    skullsOn = true;
    const holder = document.createElement('div');
    holder.className = 'skulls';
    document.body.appendChild(holder);
    setInterval(() => {
      if (holder.childElementCount >= 12) return;
      const s = document.createElement('span');
      const size = 22 + Math.random() * 26;
      s.style.top = (Math.random() * 92) + 'vh';
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.animationDuration = (3.5 + Math.random() * 5) + 's';
      s.addEventListener('animationend', () => s.remove());
      holder.appendChild(s);
    }, 650);
  }

  function bluescreen() {
    if (document.querySelector('.bsod')) return;
    const sk = (document.documentElement.lang || 'sk').startsWith('sk');
    const d = document.createElement('div');
    d.className = 'bsod';
    d.innerHTML =
      '<div class="bsod__inner"><div class="bsod__face">:(</div>' +
      '<p>' + (sk
        ? 'Tvoj automat narazil na fatálnu chybu a musel byť reštartovaný. Zbierame informácie o tvojom podvode…'
        : 'Your slot machine ran into a fatal problem and had to be restarted. We are collecting information about your cheating…') +
      ' <b class="bsod__pct">0%</b></p>' +
      '<p><code>STOP: 0xB4NAN — SKIBIDI_ANTICHEAT_VIOLATION</code></p>' +
      '<p class="bsod__hint">' + (sk ? 'Stlač čokoľvek. (Nepomôže to.)' : 'Press anything. (It will not help.)') + '</p></div>';
    document.body.appendChild(d);
    const pct = d.querySelector('.bsod__pct');
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + 1 + Math.floor(Math.random() * 9));
      pct.textContent = p + '%';
      if (p >= 100) clearInterval(iv);
    }, 220);
    const dismiss = () => {
      clearInterval(iv);
      d.remove();
      document.removeEventListener('keydown', dismiss, true);
    };
    setTimeout(() => {
      d.addEventListener('click', dismiss);
      document.addEventListener('keydown', dismiss, true);
    }, 1200);
  }

  function buildSlotMachine() {
    const L = SLOT_FACES.length;
    const BANANA = L; // special symbol index, never hit by the normal random pool
    const t = (skStr, enStr) =>
      (document.documentElement.lang || 'sk').startsWith('sk') ? skStr : enStr;
    const cellHTML = (i) => {
      if (i === BANANA) {
        return '<figure class="slots__cell slots__cell--banana"><img src="assets/img/banana.svg" alt="Banán">' +
          '<figcaption>TURBO</figcaption></figure>';
      }
      const f = SLOT_FACES[i];
      return '<figure class="slots__cell"><img src="assets/img/' + f[0] + '" alt="' + f[1] + '">' +
        '<figcaption>’' + f[2] + '</figcaption></figure>';
    };

    const el = document.createElement('div');
    el.className = 'slots';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Skibidi Cyberteam Gamba');
    const marqueeText = '★ GIGA VÝHRY ★ GIGA VÝHRY ★ GIGA VÝHRY ★ GIGA VÝHRY ';
    el.innerHTML =
      '<div class="slots__machine">' +
        '<div class="slots__lights" aria-hidden="true">' + '<i></i>'.repeat(14) + '</div>' +
        '<div class="slots__head"><span class="slots__title">SKIBIDI CYBERTEAM GAMBA</span><span class="slots__sub">2022–2025</span></div>' +
        '<div class="slots__reels">' + '<div class="slots__reel"><div class="slots__strip"></div></div>'.repeat(3) + '</div>' +
        '<div class="slots__marquee" aria-hidden="true"><span>' + marqueeText + '</span><span>' + marqueeText + '</span></div>' +
        '<div class="slots__bank">' +
          '<span class="slots__bal"><img src="assets/img/banana.svg" alt="Banánové coiny"><b>0</b></span>' +
          '<button type="button" class="slots__shop"></button>' +
        '</div>' +
        '<p class="slots__status" aria-live="polite"></p>' +
        '<button type="button" class="slots__spin"></button>' +
        '<button type="button" class="slots__lever" aria-label="Zatoč / Spin">' +
          '<span class="slots__lever-arm"></span><span class="slots__lever-base"></span>' +
        '</button>' +
        '<button type="button" class="slots__close" aria-label="Zavrieť / Close">✕</button>' +
      '</div>';
    document.body.appendChild(el);

    const machine = el.querySelector('.slots__machine');
    const reelEls = Array.from(el.querySelectorAll('.slots__reel'));
    const strips = reelEls.map((r) => r.querySelector('.slots__strip'));
    const statusEl = el.querySelector('.slots__status');
    const spinBtn = el.querySelector('.slots__spin');
    const balEl = el.querySelector('.slots__bal b');
    const shopBtn = el.querySelector('.slots__shop');
    const updateBank = () => {
      balEl.textContent = String(bananas);
      shopBtn.disabled = bananas < MACKA_PRICE;
    };
    const current = reelEls.map(() => Math.floor(Math.random() * L));
    let spinning = false;
    let lastFocus = null;

    SLOT_FACES.forEach((f) => { new Image().src = 'assets/img/' + f[0]; });
    new Image().src = 'assets/img/banana.svg';

    const setStill = (i) => {
      strips[i].style.transition = 'none';
      strips[i].style.transform = 'translateY(0)';
      strips[i].innerHTML = cellHTML(current[i]);
    };
    current.forEach((_, i) => setStill(i));

    // people with roster photos from more than one year → jackpot can be
    // the same face, three different ročníky
    const veterans = (() => {
      const count = {};
      SLOT_FACES.forEach((f) => { count[f[1]] = (count[f[1]] || 0) + 1; });
      return Object.keys(count).filter((n) => count[n] > 1);
    })();

    const pickTargets = () => {
      let targets;
      // every slot machine is rigged; this one in the player's favour
      if (Math.random() < 0.18) {
        const person = veterans[Math.floor(Math.random() * veterans.length)];
        const photos = SLOT_FACES.map((f, i) => (f[1] === person ? i : -1)).filter((i) => i >= 0);
        targets = reelEls.map(() => photos[Math.floor(Math.random() * photos.length)]);
      } else {
        targets = reelEls.map(() => Math.floor(Math.random() * L));
      }
      if (Math.random() < 0.01) targets[Math.floor(Math.random() * targets.length)] = BANANA;
      return targets;
    };

    const coinRain = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const holder = document.createElement('div');
      holder.className = 'slots__coins';
      for (let i = 0; i < 26; i++) {
        const s = document.createElement('span');
        s.style.left = (Math.random() * 100) + '%';
        s.style.animationDelay = (Math.random() * .9) + 's';
        s.style.fontSize = (16 + Math.random() * 22) + 'px';
        holder.appendChild(s);
      }
      el.appendChild(holder);
      setTimeout(() => holder.remove(), 3400);
    };

    const finish = (targets) => {
      if (targets.indexOf(BANANA) !== -1) {
        // pays exactly one cat in a sack
        machine.classList.add('slots--jackpot');
        writeBank(bananas + MACKA_PRICE);
        statusEl.textContent = t('BANÁN! +' + MACKA_PRICE + ' banánov!', 'BANANA! +' + MACKA_PRICE + ' bananas!');
        coinRain();
      } else {
        const names = targets.map((i) => SLOT_FACES[i][1]);
        if (names[0] === names[1] && names[0] === names[2]) {
          machine.classList.add('slots--jackpot');
          writeBank(bananas + 25);
          statusEl.textContent = '★ JACKPOT! 3× ' + names[0] + ' +25 ★';
          coinRain();
        } else if (names[0] === names[1] || names[0] === names[2] || names[1] === names[2]) {
          writeBank(bananas + 5);
          statusEl.textContent = t('Dvaja rovnakí! +5', 'Two of a kind! +5');
        } else {
          statusEl.textContent = targets
            .map((i) => SLOT_FACES[i][1].split(' ').pop() + ' ’' + SLOT_FACES[i][2])
            .join(' · ');
        }
      }
      updateBank();
      spinning = false;
      spinBtn.disabled = false;
    };

    const lever = el.querySelector('.slots__lever');
    const spin = () => {
      if (spinning) return;
      spinning = true;
      spinBtn.disabled = true;
      machine.classList.remove('slots--jackpot');
      lever.classList.add('is-pulled');
      setTimeout(() => lever.classList.remove('is-pulled'), 550);
      statusEl.textContent = '···';
      const targets = pickTargets();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        targets.forEach((tg, i) => { current[i] = tg; setStill(i); });
        finish(targets);
        return;
      }
      let landed = 0;
      targets.forEach((tg, i) => {
        const reel = reelEls[i];
        const strip = strips[i];
        const cellH = reel.clientHeight;
        const travel = (1 + i) * L + 13 + i * 7;
        const startFace = current[i] < L ? current[i] : Math.floor(L / 2);
        let html = cellHTML(current[i]);
        for (let k = 1; k < travel; k++) html += cellHTML((startFace + k) % L);
        html += cellHTML(tg);
        strip.innerHTML = html;
        strip.style.transition = 'none';
        strip.style.transform = 'translateY(0)';
        reel.classList.add('is-spinning');
        void strip.offsetHeight; // flush styles so the transition animates
        const dur = 1600 + i * 700;
        strip.style.transition = 'transform ' + dur + 'ms cubic-bezier(.15, .75, .2, 1)';
        strip.style.transform = 'translateY(' + (-travel * cellH) + 'px)';
        setTimeout(() => {
          current[i] = tg;
          reel.classList.remove('is-spinning');
          setStill(i);
          if (++landed === targets.length) finish(targets);
        }, dur + 80);
      });
    };

    const open = () => {
      if (el.classList.contains('open')) { spin(); return; } // Konami again = pull the lever
      lastFocus = document.activeElement;
      el.classList.add('open');
      document.body.style.overflow = 'hidden';
      statusEl.textContent = t('Traja rovnakí = JACKPOT', 'Three of a kind = JACKPOT');
      spinBtn.textContent = t('ŠTART', 'SPIN');
      shopBtn.textContent = t('MAČKA VO VRECI · 100', 'CAT IN A SACK · 100');
      updateBank();
      spinBtn.focus();
    };
    const close = () => {
      el.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    const buy = () => {
      if (busted || spinning || bananas < MACKA_PRICE) return;
      writeBank(bananas - MACKA_PRICE);
      const skin = SKINS[Math.floor(Math.random() * SKINS.length)];
      applySkin(skin);
      statusEl.textContent = t('MŇAU! Vo vreci bola: ', 'MEOW! The sack contained: ') + SKIN_NAMES[skin];
      updateBank();
      coinRain();
    };

    spinBtn.addEventListener('click', spin);
    lever.addEventListener('click', spin);
    shopBtn.addEventListener('click', buy);
    el.querySelector('.slots__close').addEventListener('click', close);
    el.addEventListener('click', (e) => { if (e.target === el) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.classList.contains('open')) close();
    });
    trapTab(el);

    return { open };
  }
})();
