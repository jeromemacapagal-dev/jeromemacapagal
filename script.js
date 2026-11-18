(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Mobile menu
  const nav = $('#nav'), mb = $('#menuBtn');
  const setMenu = o => { nav.classList.toggle('open', o); mb.setAttribute('aria-expanded', o); };
  mb.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Active nav link (scroll spy)
  const links = $$('#nav a[data-s]');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.dataset.s === e.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  $$('main section[id]').forEach(s => io.observe(s));

  // Service "Learn more" -> prefill contact message
  const msg = $('#message');
  $$('[data-svc]').forEach(b => b.addEventListener('click', () => {
    msg.value = `I'm interested in ${b.dataset.svc}.`;
    $('#contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => msg.focus({ preventScroll: true }), 500);
  }));

  // Project viewer (also used by "View All Work")
  const projs = $$('.proj'), lb = $('#lightbox'); let cur = 0;
  const show = i => {
    cur = (i + projs.length) % projs.length;
    const p = projs[cur], im = $('img', p);
    $('#lbImg').src = im.src; $('#lbImg').alt = im.alt;
    $('#lbCap').textContent = `${$('h3', p).textContent} — ${$('span', p).textContent}`;
  };
  const openLb = i => { show(i); lb.showModal(); };
  projs.forEach((p, i) => p.addEventListener('click', e => { e.preventDefault(); openLb(i); }));
  $('#viewAll').addEventListener('click', () => openLb(0));
  $('#lbPrev').addEventListener('click', () => show(cur - 1));
  $('#lbNext').addEventListener('click', () => show(cur + 1));
  $('#lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });

  // Contact form validation + demo submit (no backend)
  const f = $('#contactForm'), st = $('#formStatus');
  const rules = {
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
    message: v => v.trim().length >= 10 || 'Message must be at least 10 characters.'
  };
  const check = el => {
    const r = rules[el.name](el.value), fld = el.closest('.field');
    fld.classList.toggle('err', r !== true);
    $('.msg', fld).textContent = r === true ? '' : r;
    el.setAttribute('aria-invalid', r !== true);
    return r === true;
  };
  const fields = $$('input, textarea', f);
  fields.forEach(el => {
    el.addEventListener('blur', () => check(el));
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('err')) check(el); });
  });
  f.addEventListener('submit', e => {
    e.preventDefault();
    st.className = 'status';
    if (!fields.map(check).every(Boolean)) {
      st.textContent = 'Please fix the highlighted fields.'; st.classList.add('bad');
      $('[aria-invalid="true"]', f).focus(); return;
    }
    const b = $('.send', f); b.disabled = true; st.textContent = 'Sending…';
    setTimeout(() => { // DEMO ONLY: replace with a real endpoint (fetch POST) for production
      f.reset(); b.disabled = false;
      st.textContent = 'Thanks! Your message was received (demo: no backend connected).'; st.classList.add('ok');
    }, 900);
  });
})();
