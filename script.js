(function () {
  // Mobile menu
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Demo distribution board
  var mods = [
    { label: 'ראשי', rate: '63A', main: true },
    { label: 'תאורה', rate: 'C10', a: 3.2 },
    { label: 'מיזוג', rate: 'C20', a: 6.5 },
    { label: 'מנוע', rate: 'C25', a: 7.8 },
    { label: 'תקשורת', rate: 'C10', a: 1.2 },
    { label: 'חירום', rate: 'C10', a: 0.8 },
    { label: 'בקרה', rate: 'C10', a: 1.5 }
  ];
  var on = [true, true, true, false, true, false, true];
  var tripped = mods.map(function () { return false; });
  var row = document.getElementById('mcbRow');
  var bar = document.getElementById('loadBar');
  var txt = document.getElementById('loadTxt');
  var amps = document.getElementById('amps');
  var pnlMsg = document.getElementById('pnlMsg');
  var tripBtn = document.getElementById('tripBtn');
  var els = mods.map(function (m, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'mcb' + (m.main ? ' main' : '');
    b.innerHTML = '<span class="mcb-body"><span class="mcb-led"></span><span class="mcb-handle"></span><span class="mcb-rate"></span></span><span class="mcb-lbl"></span><span class="mcb-wire"></span>';
    b.querySelector('.mcb-rate').textContent = m.rate;
    b.querySelector('.mcb-lbl').textContent = m.label;
    b.addEventListener('click', function () {
      if (tripped[i]) { tripped[i] = false; on[i] = true; note('המפסק "' + m.label + '" אופס והקו חזר לפעולה.'); }
      else { on[i] = !on[i]; note(''); }
      render();
    });
    row.appendChild(b);
    return b;
  });
  function note(t, warn) {
    pnlMsg.textContent = t || (tripped.some(Boolean) ? pnlMsg.textContent : 'כל הקווים תקינים.');
    pnlMsg.classList.toggle('warn', !!warn);
  }
  tripBtn.addEventListener('click', function () {
    var cand = [];
    mods.forEach(function (m, i) { if (!m.main && on[i] && !tripped[i] && on[0]) cand.push(i); });
    if (!cand.length) { note('אין קו פעיל להדגמה. הדליקו מפסק.'); return; }
    var i = cand[Math.floor(Math.random() * cand.length)];
    tripped[i] = true;
    note('תקלה בקו "' + mods[i].label + '": ההגנה פעלה והקו נותק. שאר הלוח ממשיך לעבוד. לחצו על המפסק לאיפוס.', true);
    render();
  });
  function render() {
    var total = 0, max = 0;
    els.forEach(function (b, i) {
      var m = mods[i];
      var live = on[i] && !tripped[i] && (m.main || on[0]);
      b.setAttribute('aria-pressed', String(on[i] && !tripped[i]));
      b.setAttribute('aria-label', m.label + (tripped[i] ? ' – נותק בגלל תקלה, לחצו לאיפוס' : on[i] ? ' – דלוק' : ' – כבוי'));
      b.classList.toggle('live', live);
      b.classList.toggle('trip', tripped[i]);
      if (!m.main) { max += m.a; if (live) total += m.a; }
    });
    if (!tripped.some(Boolean) && pnlMsg.classList.contains('warn')) note('', false);
    var anyTrip = tripped.some(Boolean);
    var okEl = document.querySelector('.pl.ok'), alEl = document.querySelector('.pl.al');
    if (okEl) { okEl.classList.toggle('on', on[0] && !anyTrip); alEl.classList.toggle('on', anyTrip); }
    amps.textContent = total.toFixed(1);
    var pct = Math.round(total / max * 100);
    bar.style.width = pct + '%';
    txt.textContent = pct + '%';
  }
  render();

  // Subtle tilt + light sheen on the board (fine pointers only)
  var pnl = document.querySelector('.pnl');
  var plate = document.querySelector('.pnl-plate');
  if (pnl && window.matchMedia('(hover:hover) and (pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    pnl.addEventListener('mousemove', function (e) {
      var r = pnl.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      pnl.style.transform = 'perspective(1100px) rotateX(' + (-y * 5).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg)';
      plate.style.setProperty('--sx', (50 + x * 90).toFixed(0) + '%');
    });
    pnl.addEventListener('mouseleave', function () { pnl.style.transform = ''; plate.style.removeProperty('--sx'); });
  }

  // Project filters
  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('#projGrid .proj');
  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      filters.forEach(function (x) { x.classList.toggle('on', x === f); });
      cards.forEach(function (c) {
        c.hidden = f.dataset.f !== 'all' && c.dataset.c !== f.dataset.f;
      });
    });
  });

  // Accessibility toolbar (state kept in localStorage when available)
  var root = document.documentElement;
  var aBtn = document.getElementById('a11yBtn');
  var aPanel = document.getElementById('a11yPanel');
  var toggles = { contrast: 'a11y-contrast', links: 'a11y-links', motion: 'a11y-motion' };
  var size = 0;
  function save() { try { localStorage.setItem('a11y', JSON.stringify({ size: size, on: Object.keys(toggles).filter(function (k) { return root.classList.contains(toggles[k]); }) })); } catch (e) {} }
  function applySize() { root.classList.toggle('a11y-lg', size > 0); root.classList.toggle('a11y-sm', size < 0); }
  function sync() { aPanel.querySelectorAll('[data-a]').forEach(function (b) { var k = b.dataset.a; if (toggles[k]) b.setAttribute('aria-pressed', String(root.classList.contains(toggles[k]))); }); }
  try {
    var st = JSON.parse(localStorage.getItem('a11y') || 'null');
    if (st) { size = st.size || 0; (st.on || []).forEach(function (k) { if (toggles[k]) root.classList.add(toggles[k]); }); applySize(); sync(); }
  } catch (e) {}
  aBtn.addEventListener('click', function () {
    var open = aPanel.hidden;
    aPanel.hidden = !open;
    aBtn.setAttribute('aria-expanded', String(open));
  });
  aPanel.addEventListener('click', function (e) {
    var k = e.target.dataset && e.target.dataset.a;
    if (!k) return;
    if (k === 'lg') size = Math.min(size + 1, 1);
    else if (k === 'sm') size = Math.max(size - 1, -1);
    else if (k === 'reset') { size = 0; Object.keys(toggles).forEach(function (t) { root.classList.remove(toggles[t]); }); }
    else root.classList.toggle(toggles[k]);
    applySize(); sync(); save();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !aPanel.hidden) { aPanel.hidden = true; aBtn.setAttribute('aria-expanded', 'false'); aBtn.focus(); }
  });

  // Contact form
  var form = document.getElementById('contactForm');
  var msg = document.getElementById('formMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = false;
    ['f-name', 'f-phone', 'f-msg'].forEach(function (id) {
      var el = document.getElementById(id);
      var empty = !el.value.trim();
      el.classList.toggle('bad', empty);
      if (empty) bad = true;
    });
    msg.className = 'form-msg';
    if (bad) {
      msg.textContent = 'נא למלא שם, טלפון והודעה.';
      msg.classList.add('err');
      return;
    }
    var submit = form.querySelector('.submit');
    submit.disabled = true;
    msg.textContent = 'שולח...';
    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        msg.textContent = 'תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.';
      })
      .catch(function () {
        msg.textContent = 'השליחה נכשלה. נסו שוב או התקשרו אלינו.';
        msg.classList.add('err');
      })
      .then(function () { submit.disabled = false; });
  });
})();
