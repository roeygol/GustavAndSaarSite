(function () {
  function rest() { return 'var(--rest)'; }
  // Keep anchor scroll offset equal to the sticky nav height
  var navEl = document.querySelector('.nav');
  function setNavH() {
    if (navEl) document.documentElement.style.setProperty('--nav-h', navEl.offsetHeight + 'px');
  }
  setNavH();
  window.addEventListener('resize', setNavH);
  window.addEventListener('load', setNavH);
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

  // About: a wall-mounted electrical panel (3D, door open) that starts apart and assembles as it scrolls into the viewport centre
  var ex = document.getElementById('explode');
  if (ex) {
    var scene = document.getElementById('scene');
    var W = 300, H = 420, D = 80;
    scene.style.width = W + 'px';
    scene.style.height = H + 'px';
    var parts = [];
    var mk = function (parent, css, cls) {
      var d = document.createElement('div');
      d.style.cssText = css;
      if (cls) d.className = cls;
      parent.appendChild(d);
      return d;
    };
    var rnd = function (n) { var v = Math.sin(n * 91.7) * 10000; return v - Math.floor(v) - 0.5; };
    var add = function (el, st, b, e, r, o) { parts.push({ el: el, st: st, b: b, e: e, r: r || [0, 0, 0], o: o || '50% 50%' }); };
    var seq = 1;
    var pop = function (el, st, z, spread) {
      var k = spread || 1;
      add(el, st, [0, 0, 0], [rnd(seq) * 70 * k, rnd(seq + 1) * 60 * k, z + rnd(seq + 5) * 30], [rnd(seq + 2) * 50, rnd(seq + 3) * 50, rnd(seq + 4) * 60]);
      seq += 6;
    };
    // small cuboid, back at z=0, front at z=d, with left/right/top walls
    var cube = function (parent, x, y, w, h, d, front, side, top) {
      var c = mk(parent, 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px', 'part');
      var f = mk(c, 'inset:0;background:' + front + ';transform:translateZ(' + d + 'px)');
      mk(c, 'left:' + (w - d) / 2 + 'px;top:0;width:' + d + 'px;height:' + h + 'px;background:' + side + ';transform:translateZ(' + d / 2 + 'px) rotateY(90deg) translateZ(' + w / 2 + 'px)');
      mk(c, 'left:' + (w - d) / 2 + 'px;top:0;width:' + d + 'px;height:' + h + 'px;background:' + side + ';transform:translateZ(' + d / 2 + 'px) rotateY(-90deg) translateZ(' + w / 2 + 'px)');
      mk(c, 'left:0;top:' + (h - d) / 2 + 'px;width:' + w + 'px;height:' + d + 'px;background:' + top + ';transform:translateZ(' + d / 2 + 'px) rotateX(90deg) translateZ(' + h / 2 + 'px)');
      c._f = f;
      return c;
    };

    // enclosure shell (open front): back wall + four walls
    var shell = mk(scene, 'left:0;top:0;width:' + W + 'px;height:' + H + 'px', 'part');
    mk(shell, 'inset:0;background:#b8bcbd');
    mk(shell, 'left:' + (-D / 2) + 'px;top:0;width:' + D + 'px;height:' + H + 'px;background:#cfd3d4;transform:translateZ(' + D / 2 + 'px) rotateY(-90deg)');
    mk(shell, 'left:' + (W - D / 2) + 'px;top:0;width:' + D + 'px;height:' + H + 'px;background:#b3b8b9;transform:translateZ(' + D / 2 + 'px) rotateY(90deg)');
    mk(shell, 'left:0;top:' + (-D / 2) + 'px;width:' + W + 'px;height:' + D + 'px;background:#e9ebeb;transform:translateZ(' + D / 2 + 'px) rotateX(90deg)');
    mk(shell, 'left:0;top:' + (H - D / 2) + 'px;width:' + W + 'px;height:' + D + 'px;background:#9fa4a6;transform:translateZ(' + D / 2 + 'px) rotateX(-90deg)');
    add(shell, 0, [0, 0, 0], [0, 0, -90]);

    // mounting plate
    var plate = mk(scene, 'left:14px;top:14px;width:' + (W - 28) + 'px;height:' + (H - 28) + 'px;background:#ece8dc;box-shadow:inset 0 0 0 2px rgba(0,0,0,.12);transform:translateZ(8px)', 'part');
    add(plate, 1, [0, 0, 8], [0, 0, -30]);

    // rails and devices (rows from top to bottom)
    var rail = function (y, st) {
      var r = mk(scene, 'left:24px;top:' + (y + 62) + 'px;width:' + (W - 48) + 'px;height:10px;background:linear-gradient(#e2e5e6,#8d9499)', 'part');
      add(r, st, [0, 0, 14], [0, rnd(y) * 20, -6]);
    };
    // row 1: white MCBs with black toggles
    rail(24, 1);
    for (var i = 0; i < 12; i++) {
      var m = cube(scene, 28 + i * 20.5, 24, 19, 64, 28, '#f3f4f4', '#c7cbcc', '#dcdfdf');
      mk(m._f, 'left:5px;top:10px;width:9px;height:15px;background:#15171A;border-radius:2px');
      mk(m._f, 'left:3px;bottom:6px;right:3px;height:4px;background:#9aa0a3');
      add(m, 2 + (i % 2), [0, 0, 14], [rnd(seq) * 60, -50 - (i % 4) * 14, 70 + (i % 5) * 18], [rnd(seq + 1) * 40, rnd(seq + 2) * 50, rnd(seq + 3) * 40]);
      seq += 4;
    }
    // row 2: black contactors
    rail(118, 2);
    for (i = 0; i < 6; i++) {
      var k = cube(scene, 28 + i * 42, 118, 38, 70, 34, '#26292d', '#16181b', '#3a3f45');
      mk(k._f, 'left:6px;top:8px;width:26px;height:10px;background:#f3f4f4');
      for (var j = 0; j < 3; j++) mk(k._f, 'left:' + (8 + j * 9) + 'px;bottom:6px;width:6px;height:6px;border-radius:50%;background:#aeb3b6');
      add(k, 3, [0, 0, 14], [rnd(seq) * 70, rnd(seq + 1) * 40, 90 + (i % 3) * 22], [rnd(seq + 2) * 50, rnd(seq + 3) * 60, rnd(seq + 4) * 50]);
      seq += 5;
    }
    // row 3: dark contactors with red tops
    rail(212, 3);
    for (i = 0; i < 6; i++) {
      var k2 = cube(scene, 28 + i * 42, 212, 38, 68, 34, '#2b2e32', '#16181b', '#b23a32');
      mk(k2._f, 'left:6px;top:8px;width:26px;height:10px;background:#e9ebeb');
      mk(k2._f, 'left:8px;bottom:8px;width:22px;height:8px;background:#b23a32');
      add(k2, 4, [0, 0, 14], [rnd(seq) * 70, rnd(seq + 1) * 40, 80 + (i % 3) * 24], [rnd(seq + 2) * 50, rnd(seq + 3) * 60, rnd(seq + 4) * 50]);
      seq += 5;
    }
    // terminal strip
    var term = cube(scene, 28, 318, 244, 30, 24, '#c9b98e', '#8a7d58', '#e0d3a8');
    for (i = 0; i < 16; i++) mk(term._f, 'left:' + (6 + i * 15) + 'px;top:6px;width:10px;height:18px;background:#9a8a5e;border-radius:2px');
    add(term, 4, [0, 0, 14], [0, 60, 60], [-20, 0, 0]);
    // wire duct
    var duct = cube(scene, 28, 292, 244, 18, 20, '#f2f3f3', '#c9cdce', '#fff');
    mk(duct._f, 'inset:5px 4px;background:repeating-linear-gradient(90deg,#b7bcbe 0 10px,transparent 10px 14px)');
    add(duct, 5, [0, 0, 14], [0, -40, 110], [0, 0, 8]);
    // wires
    [[46, '#d8433a'], [110, '#d8433a'], [176, '#e9ecec'], [240, '#d8433a']].forEach(function (w, wi) {
      var wr = mk(scene, 'left:' + w[0] + 'px;top:90px;width:3px;height:230px;background:' + w[1] + ';border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.3)', 'part');
      add(wr, 5, [0, 0, 44], [(wi - 1.5) * 50, 10, 70 + wi * 14], [0, 0, (wi - 1.5) * 10]);
    });

    // door: hinged on the right edge, standing open; its inner face carries the pilot lamps
    var door = mk(scene, 'left:0;top:0;width:' + W + 'px;height:' + H + 'px', 'part');
    mk(door, 'inset:0;background:linear-gradient(90deg,#e6e8e8,#cfd3d4);border:1px solid #a9aeb0;backface-visibility:hidden');
    var inner = mk(door, 'inset:0;background:#dcdfdf;border:1px solid #a9aeb0;box-shadow:inset 0 0 0 6px #eceeee;transform:rotateY(180deg);backface-visibility:hidden');
    var lamp = function (x, y, sz, ring) {
      var l = mk(inner, 'left:' + x + 'px;top:' + y + 'px;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:radial-gradient(circle,#fff 0 40%,' + ring + ' 42%);box-shadow:0 2px 3px rgba(0,0,0,.35)');
      pop(l, 3, 50, 0.6);
    };
    for (var r = 0; r < 3; r++) for (var c = 0; c < 6; c++) lamp(34 + c * 38, 40 + r * 34, 24, '#15171A');
    for (r = 0; r < 4; r++) for (c = 0; c < 6; c++) lamp(32 + c * 38, 168 + r * 44, 30, '#5a1c1c');
    var dd = mk(inner, 'left:20px;top:140px;width:250px;height:22px;background:#f4f5f5;border-radius:11px;transform:rotate(-4deg);box-shadow:0 2px 4px rgba(0,0,0,.3)');
    pop(dd, 2, 70, 0.5);
    var latch = mk(inner, 'left:6px;top:200px;width:10px;height:26px;background:#9da3a6;border-radius:3px');
    pop(latch, 2, 60, 0.5);
    add(door, 0, [0, 0, D], [20, 0, 60], [0, 18, 0], '100% 50%');
    door.dataset.open = '1';

    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cur = still ? 0 : 1, raf = 0;
    var smooth = function (t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
    var OPEN = 105;
    var paint = function (p) {
      scene.style.transform = 'rotateX(-5deg) rotateY(' + (20 - smooth(p) * 14) + 'deg)';
      parts.forEach(function (o) {
        var q = smooth(p * 1.6 - o.st * 0.09);
        o.el.style.transformOrigin = o.o;
        var ry = o.r[1] * q + (o.el === door ? OPEN : 0);
        o.el.style.transform = 'translate3d(' + (o.b[0] + o.e[0] * q) + 'px,' + (o.b[1] + o.e[1] * q) + 'px,' + (o.b[2] + o.e[2] * q) + 'px) rotateX(' + o.r[0] * q + 'deg) rotateY(' + ry + 'deg) rotateZ(' + o.r[2] * q + 'deg)';
      });
    };
    // fully apart at the edges of the viewport, assembled when the panel sits in the middle
    var tick = function () {
      var rect = ex.getBoundingClientRect(), vh = window.innerHeight;
      var d = Math.abs(rect.top + rect.height / 2 - vh / 2) / vh;
      var target = smooth((d - 0.06) / 0.4);
      cur += (target - cur) * 0.12;
      if (calm()) { cur = 0; paint(0); raf = 0; return; }
      paint(cur);
      raf = Math.abs(target - cur) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    var calm = function () { return still || document.documentElement.classList.contains('a11y-motion'); };
    var kick = function () { if (!raf && !calm()) raf = requestAnimationFrame(tick); };
    paint(cur);
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    kick();
    document.addEventListener('a11y-motion', function () { if (calm()) { cur = 0; paint(0); } else kick(); });
  }

  function applyMotion() {
    var off = document.documentElement.classList.contains('a11y-motion');
    if (!document.getAnimations) return;
    document.getAnimations().forEach(function (a) {
      if ((window.CSSAnimation && a instanceof CSSAnimation) || (window.CSSTransition && a instanceof CSSTransition)) return;
      if (off) a.pause(); else if (a.playState === 'paused') a.play();
    });
  }

  // Hero graphic: side buses (like the background traces) that plug into the central chip
  var mBus = document.getElementById('mBus');
  // geometry of the scroll strip at the right edge: wide screens get a wider strip with room for more lines
  function stripGeom() {
    var small = window.innerWidth <= 720, cw = document.documentElement.clientWidth, gap = Math.max(0, (cw - 1200) / 2);
    var SW = small ? 22 : Math.max(52, Math.min(92, Math.floor(gap - 4)));
    return { small: small, SW: SW, SR: small ? 2 : Math.max(4, gap - SW), max: small ? 1 : Math.max(3, Math.min(5, Math.floor((SW - 30) / 10) + 1)) };
  }
  var busAnim = [], heroArrive = []; // heroArrive[i]: ms into the cycle when output line i's pulse reaches the bottom of the hero
  if (mBus) {
    var NSB = 'http://www.w3.org/2000/svg';
    var baseL = [[-700, 190], [-380, 190], [-320, 250], [-320, 300], [-284, 336], [-74, 336]];
    var baseR = [[250, -90], [250, 236], [150, 336], [74, 336]];
    [-1, 1].forEach(function (side) {
      [0, 1, 2].forEach(function (k) {
        var pts = side < 0
          ? baseL.map(function (p) { return [p[0] - 8 * k, p[1] + 8 * k]; })
          : baseR.map(function (p) { return [p[0] + 8 * k, p[1] + 8 * k]; });
        if (side < 0) { pts[0][0] = -700; pts[5][0] = -74; } else { pts[3][0] = 74; }
        var d = 'M' + pts.map(function (p) { return p.join(' '); }).join(' L');
        var b = document.createElementNS(NSB, 'path'); b.setAttribute('class', side > 0 ? 'b rt' : 'b'); b.setAttribute('d', d); mBus.appendChild(b);
        var len = 0; for (var i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        var u = document.createElementNS(NSB, 'path'); u.setAttribute('class', side > 0 ? 'pu rt' : 'pu'); u.setAttribute('d', d); u.style.strokeDasharray = '46 ' + len; mBus.appendChild(u);
        busAnim.push({ el: u, len: len, k: k, dim: side > 0 ? 0.6 : 1 });
      });
    });
  }

  // Hero graphic: one continuous pulse per stage runs input -> chip -> bus -> core -> output
  var flow = document.getElementById('mFlow');
  if (flow && flow.ownerSVGElement && window.matchMedia && !window.matchMedia('(prefers-reduced-motion:reduce)').matches && flow.ownerSVGElement.animate) {
    var NS = 'http://www.w3.org/2000/svg', F = -800, D = 4800, HEAD = 70;
    var stages = [
      { y0: -36, pts: [[130, 14], [130, 62], [130, 110], [44, 196], [44, 300], [44, 322], [24, 346], [24, 370], [24, 386], [50, 412]], ex: 50, ti: 0, chip: 0, core: 4, pad: 10, padEl: 2, delay: 0 },
      { y0: -20, pts: [[0, 14], [0, 62], [0, 300], [0, 370]], ex: 0, ti: 1, chip: 0, core: 2, pad: 4, padEl: 1, delay: 450 },
      { y0: -4, pts: [[-130, 14], [-130, 62], [-130, 110], [-44, 196], [-44, 300], [-44, 322], [-24, 346], [-24, 370], [-24, 386], [-50, 412]], ex: -50, ti: 2, chip: 0, core: 4, pad: 10, padEl: 0, delay: 900 }
    ];
    var chips = flow.ownerSVGElement.querySelectorAll('.m-src rect');
    var coreRect = flow.ownerSVGElement.querySelector('.m-core rect:not(.pin)');
    var bolt = flow.ownerSVGElement.querySelector('.m-core .bolt');
    var halo = flow.ownerSVGElement.querySelector('.halo');
    var pads = flow.ownerSVGElement.querySelectorAll('.m-pads circle');
    var anims = [];
    var flash = function (el, frames, at, dur) { anims.push(el.animate(frames, { duration: D, delay: at, iterations: Infinity, easing: 'ease-out' })); };
    // where the three output lines meet the scroll strip at the bottom of the hero (in svg units)
    var targets = function () {
      var svg = flow.ownerSVGElement, ctm = svg.getScreenCTM();
      if (!ctm) return null;
      var inv = ctm.inverse(), small = window.innerWidth <= 720, cw = document.documentElement.clientWidth;
      var sr = stripGeom().SR;
      var xs = (small ? [sr + 8, sr + 8, sr + 8] : [sr + 6, sr + 16, sr + 26]).map(function (d) { return cw - d; });
      var hb = document.querySelector('.hero').getBoundingClientRect().bottom, pt = svg.createSVGPoint();
      var cta = document.querySelector('.cta-row'), ctaY = 0;
      if (cta) { pt.x = 0; pt.y = cta.getBoundingClientRect().bottom; ctaY = pt.matrixTransform(inv).y; }
      var res = xs.map(function (x) { pt.x = x; pt.y = hb; var q = pt.matrixTransform(inv); return { x: q.x, y: q.y }; });
      var y0 = Math.min(505, Math.max(470, ctaY + 24));
      res.forEach(function (r, i) { r.h = y0 + i * 16; });
      return res;
    };
    var outBase = [['M50 446V458L62 470', 0], ['M0 446V482L12 494', 1], ['M-50 446V506L-38 518', 2]];
    var build = function () {
    anims.forEach(function (a) { a.cancel(); }); anims = [];
    flow.textContent = '';
    var T = targets() || [{ x: 800, y: 600, h: 470 }, { x: 800, y: 600, h: 486 }, { x: 800, y: 600, h: 502 }];
    [].forEach.call(flow.ownerSVGElement.querySelectorAll('.m-ext .m-base path'), function (p) {
      outBase.forEach(function (o) {
        if ((p.getAttribute('d') || '').indexOf(o[0]) === 0 || p.dataset.o === String(o[1])) {
          var t = T[o[1]], ex = [50, 0, -50][o[1]], dx = [12, 12, 12][o[1]] * (ex < 0 ? -1 : 1);
          p.dataset.o = o[1];
          p.setAttribute('d', 'M' + ex + ' 446V' + (t.h - 12) + 'L' + (ex + dx) + ' ' + t.h + 'H' + t.x.toFixed(1) + 'V' + t.y.toFixed(1));
        }
      });
    });
    var ksw = document.getElementById('themeBtn');
    if (ksw) {
      // scatter one spark gap on each output trace, at hand-picked arbitrary spots along it
      var gStart = [62, 12, -62], gFrac = [.2, .8, .46], gKs = [1, .86, 1.05], gXs = [];
      var gB = (T[0].x - 50) < 260 ? .8 : 1;
      [0, 1, 2].forEach(function (i) {
        var lo = gStart[i] + 56 * gB + 8, hi = T[i].x - 52 * gB, gx = lo + Math.max(0, hi - lo) * gFrac[i], k = gKs[i] * gB;
        var sg = ksw.querySelectorAll('.sg')[i], cut = document.getElementById('gapCut' + i);
        gXs.push(gx);
        if (sg) sg.setAttribute('transform', 'translate(' + gx.toFixed(1) + ',' + T[i].h.toFixed(1) + ') scale(' + k.toFixed(2) + ')');
        if (cut) { cut.setAttribute('x', (gx - 43 * k).toFixed(1)); cut.setAttribute('width', (86 * k).toFixed(1)); cut.setAttribute('y', (T[i].h - 8).toFixed(1)); cut.setAttribute('height', 16); }
      });
      var hit = ksw.querySelector('.ksw-hit'), gx0 = Math.min.apply(null, gXs) - 56, gx1 = Math.max.apply(null, gXs) + 56;
      if (hit) { hit.setAttribute('x', gx0.toFixed(1)); hit.setAttribute('width', (gx1 - gx0).toFixed(1)); hit.setAttribute('y', (T[0].h - 26).toFixed(1)); hit.setAttribute('height', (T[2].h - T[0].h + 52).toFixed(1)); }
    }
    var pulse = 0.18, midCoreAt = 0; // pulse: fraction of the cycle a flash lasts
    stages.forEach(function (st, i) {
      var x = st.pts[0][0];
      var tt = T[st.ti];
      var pts = [[F, st.y0], [x - (14 - st.y0), st.y0]].concat(st.pts, [[st.ex, 446], [st.ex, tt.h - 12], [st.ex + (st.ex < 0 ? -12 : 12), tt.h], [tt.x, tt.h], [tt.x, tt.y]]);
      var cum = [0];
      for (var k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
      var L = cum[cum.length - 1];
      var el = document.createElementNS(NS, 'path');
      el.setAttribute('d', 'M' + pts.map(function (p) { return p.join(' '); }).join(' L'));
      el.style.strokeDasharray = HEAD + ' ' + L;
      flow.appendChild(el);
      var run = 0.8; // fraction of the cycle the pulse travels
      heroArrive[st.ti] = st.delay + run * D * L / (L + HEAD);
      anims.push(el.animate([
        { strokeDashoffset: HEAD, opacity: 1, offset: 0 },
        { strokeDashoffset: -L, opacity: 1, offset: run },
        { strokeDashoffset: -L, opacity: 0, offset: run + 0.001 },
        { strokeDashoffset: -L, opacity: 0, offset: 1 }
      ], { duration: D, delay: st.delay, iterations: Infinity, easing: 'linear' }));
      // arrival times of the pulse at each part
      var at = function (idx) { return st.delay + (cum[idx + 2] / L) * run * D; };
      var chipAt = at(0), coreAt = at(st.core), padAt = at(st.pad);
      if (i === 1) midCoreAt = coreAt;
      flash(chips[i], [{ fill: '#6FA82B', stroke: '#A6E44A', offset: 0 }, { fill: 'var(--chip)', stroke: '#7AB929', offset: pulse }, { fill: 'var(--chip)', stroke: '#7AB929', offset: 1 }], chipAt, 0);
      flash(coreRect, [{ filter: 'drop-shadow(0 0 14px #7AB929)', offset: 0 }, { filter: 'none', offset: pulse }, { filter: 'none', offset: 1 }], coreAt, 0);
      flash(bolt, [{ transform: 'translate(0px,335px) scale(1.2)', offset: 0 }, { transform: 'translate(0px,335px) scale(0.9)', offset: pulse }, { transform: 'translate(0px,335px) scale(0.9)', offset: 1 }], coreAt, 0);
      flash(halo, [{ opacity: 1, offset: 0 }, { opacity: .4, offset: pulse * 1.5 }, { opacity: .4, offset: 1 }], coreAt, 0);
      flash(pads[st.padEl], [{ fill: '#A6E44A', stroke: '#A6E44A', offset: 0 }, { fill: rest(), stroke: '#5E8F2E', offset: pulse }, { fill: rest(), stroke: '#5E8F2E', offset: 1 }], padAt, 0);
    });
    busAnim.forEach(function (bA) {
      var run = bA.len > 600 ? 0.42 : 0.3, dl = ((midCoreAt - run * D + bA.k * 90) % D + D) % D;
      anims.push(bA.el.animate([
        { strokeDashoffset: 46, opacity: bA.dim, offset: 0 },
        { strokeDashoffset: -bA.len, opacity: bA.dim, offset: run },
        { strokeDashoffset: -bA.len, opacity: 0, offset: run + 0.001 },
        { strokeDashoffset: -bA.len, opacity: 0, offset: 1 }
      ], { duration: D, delay: dl, iterations: Infinity, easing: 'linear' }));
    });
    // pin every animation to the document timeline so the strip below can stay in phase with them (also survives rebuilds)
    anims.forEach(function (a) { a.startTime = 0; });
    };
    build();
    applyMotion();
    var rt = 0;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { build(); applyMotion(); }, 150); });
    window.addEventListener('load', build);
    // the hero can change height after first paint (fonts, wrapping): re-aim the output lines at the strip
    if (window.ResizeObserver) new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(function () { build(); applyMotion(); }, 100); }).observe(document.querySelector('.hero'));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { build(); applyMotion(); });
  }

  // Scroll-linked current: a fixed strip at the right edge (next to the text) carries the hero's current
  // down the page and branches into every section heading. Bright up to the reading position; pulses speed up
  // with scroll and surge in random bursts; a node lights (with a ring) as each heading is reached.
  var spine = document.createElement('canvas');
  spine.className = 'spine';
  spine.setAttribute('aria-hidden', 'true');
  document.body.appendChild(spine);
  var sctx = spine.getContext('2d');
  var PADL = 260, PADR = 14, maxLanes = 3, markNode = [], SW = 44, SH = 0, SR = 4, dpr = 1, strands = [34, 26, 18], stubEnd = 2;
  var marks = [], lit = [], litAt = [], startY = 0, link = null;
  var rings = [], seeded = false, handed = [], pulses = [], lastY = window.scrollY, vel = 0, last = 0, burst = 0, nextBurst = 2500;
  var rootEl = document.documentElement;
  function measure() {
    var small = window.innerWidth <= 720, cw = rootEl.clientWidth;
    var G = stripGeom(); SW = G.SW; SR = G.SR; maxLanes = G.max;
    strands = small ? [SW - 8] : [SW - 6, SW - 16, SW - 26];
    SH = window.innerHeight; dpr = window.devicePixelRatio || 1;
    spine.style.right = (SR - PADR) + 'px'; spine.style.width = (SW + PADL + PADR) + 'px'; spine.style.height = SH + 'px';
    spine.width = (SW + PADL + PADR) * dpr; spine.height = SH * dpr; sctx.setTransform(dpr, 0, 0, dpr, PADL * dpr, 0); // x = 0 is the strip's left edge; PADL px to its left are room for the rings
    var contentRight = cw / 2 + Math.min(1200, cw - (small ? 40 : 64)) / 2, gap = cw - contentRight;
    stubEnd = Math.max(small ? 7 : 9, SW - (gap - SR) + 2);
    var sy = window.scrollY, hero = document.querySelector('.hero');
    startY = hero ? hero.getBoundingClientRect().bottom + sy - 2 : 0;
    markNode = [];
    var stripLeft = cw - SR - SW, rg = document.createRange();
    marks = [].map.call(document.querySelectorAll('main > section:not(.hero)'), function (sec) {
      var hd = sec.querySelector('.eyebrow, h2');
      var r = (hd || sec).getBoundingClientRect();
      if (hd) { rg.selectNodeContents(hd); markNode.push(rg.getBoundingClientRect().right + 16 - stripLeft); } else markNode.push(null);
      return hd ? r.top + sy + Math.min(14, r.height / 2) : r.top + sy + 40;
    });
    // the process timeline (the line above the four steps) gets a trace from the strip into its end
    link = null;
    var stepsEl = document.querySelector('.steps');
    if (stepsEl && !small && window.innerWidth > 1000) {
      var sr2 = stepsEl.getBoundingClientRect();
      link = { y: sr2.top + sy + 6, x: sr2.right - stripLeft };
    }
    lit = marks.map(function () { return false; }); litAt = marks.map(function () { return 0; });
    buildLanes();
  }
  // Lane model: lines run down the strip in numbered slots (0 = rightmost). The bundle grows and shrinks at its left
  // end: a new line splits off the leftmost one, or the leftmost line merges back. At most headings the leftmost
  // line peels off, bends 45 degrees and runs straight to a node right next to the heading's name; the others get a tap.
  var PLAN = [[3, 0], [4, 1], [5, 1], [3, 0], [4, 1], [2, 0], [3, 1], [5, 1], [4, 0], [3, 1], [2, 0], [4, 1]];
  var lanes = [], branches = [], splits = [], merges = [], peels = [], burstT = [], stubs = [], evY = [], extras = [];
  function buildLanes() {
    var n = strands.length, end = rootEl.scrollHeight + 200, SP = 10, J = 10;
    var sx = function (k) { return strands[0] - SP * k; };
    lanes = []; branches = []; splits = []; merges = []; peels = []; stubs = []; evY = []; extras = [];
    burstT = marks.map(function () { return 0; });
    var open = [], slotLane = [], a = n;
    var openLane = function (pts) { lanes.push([pts]); return lanes.length - 1; };
    strands.forEach(function (x0, k) { open[k] = [[startY, x0]]; slotLane[k] = openLane(open[k]); });
    var transition = function (target, y0, y1) {
      target = Math.max(Math.min(2, n), Math.min(maxLanes, target));
      var cnt = Math.abs(target - a); if (!cnt || y1 - y0 < 40 * cnt) return;
      for (var i = 1; i <= cnt; i++) {
        var y = y0 + (y1 - y0) * i / (cnt + 1);
        if (target > a) {
          var np = [[y, sx(a - 1)], [y + J, sx(a)]], id = openLane(np);
          evY.push(y); splits.push({ y: y, parent: slotLane[a - 1], child: id }); open[a] = np; slotLane[a] = id; a++;
        } else {
          open[a - 1].push([y, sx(a - 1)], [y + J, sx(a - 2)]);
          evY.push(y); merges.push({ lane: slotLane[a - 1], into: slotLane[a - 2] }); a--;
        }
      }
    };
    // the last two headings always sit on exactly three lines
    var plan = function (j) { return j >= marks.length - 2 ? [3, 0] : PLAN[j % PLAN.length]; };
    if (n >= 3 && marks.length) transition(plan(0)[0], startY + 60, marks[0] - 60);
    marks.forEach(function (m, j) {
      var pl = plan(j), lx = sx(a - 1), peel = n >= 3 && pl[1] && a > 2;
      var nodeX = markNode[j] == null ? stubEnd : Math.max(-PADL + 12, Math.min(markNode[j], lx - 14));
      if (markNode[j] == null || markNode[j] > lx - 14) nodeX = Math.min(stubEnd, lx);
      if (n >= 3 && j === marks.length - 1 && a >= 3) {
        // finale at the last heading: the outer-left line bends 45 degrees into a big node; the other two carry on down the page
        var px = Math.max(nodeX + 6, Math.min(nodeX + 24, lx - 8)), paths = [];
        for (var k = 2; k < a; k++) {
          var xk = sx(k), yk = m - (xk - px);
          open[k].push([yk, xk]); peels.push({ lane: slotLane[k], y: yk, mark: j });
          paths.push([[xk, yk], [px, m], [nodeX, m]]);
        }
        branches.push(paths[0]); extras[j] = paths.slice(1); a = 2; return;
      }
      var e = peel ? Math.max(0, Math.min(14, lx - nodeX - 2)) : 0;
      if (e) nodeX = Math.min(nodeX, lx - e);
      var bp = e ? [[lx, m - e], [lx - e, m], [nodeX, m]] : [[lx, m], [nodeX, m]];
      branches.push(bp);
      if (peel) {
        open[a - 1].push([m - e, lx]); peels.push({ lane: slotLane[a - 1], y: m - e, mark: j }); a--;
      }
      if (n >= 3 && j + 1 < marks.length) transition(plan(j + 1)[0], m + 50, marks[j + 1] - 60);
    });
    open.forEach(function (pts, k) { if (k < a) pts.push([end, pts[pts.length - 1][1]]); });
    // loose stubs that end in a dot, scattered between headings: bright ones off the outer line, dim ones from any line, sized to the screen
    var rnd = function (i) { var q = Math.sin(i * 127.1 + 311.7) * 43758.5453; return q - Math.floor(q); };
    var cwv = rootEl.clientWidth, limitX = stubEnd + 6;
    if (link) {
      var alive2 = [];
      lanes.forEach(function (_, id) { var x = laneX(id, link.y); if (isFinite(x) && laneX(id, link.y + 50) >= 0 && laneX(id, link.y - 50) >= 0) alive2.push([x, id]); });
      alive2.sort(function (u, v) { return u[0] - v[0]; });
      if (alive2.length && alive2[0][0] - link.x >= 12) {
        var lx2 = alive2[0][0], e2 = Math.min(14, lx2 - link.x - 4);
        stubs.push({ pts: [[lx2, link.y - e2], [lx2 - e2, link.y], [link.x, link.y]], lane: alive2[0][1], ty: link.y - e2, b: 1, t: 0 });
      }
    }
    for (var g = 0; g < marks.length; g++) {
      var y0 = g ? marks[g - 1] + 90 : startY + 130, y1 = marks[g] - 90;
      if (y1 - y0 < 180) continue;
      var specs = [{ f: .28 + .14 * rnd(g), b: 1 }, { f: .62 + .14 * rnd(g + 9), b: 0 }];
      if (g % 2) specs.push({ f: .8, b: 1 });
      specs.forEach(function (sp, si) {
        var y = y0 + (y1 - y0) * sp.f;
        if (evY.some(function (ey) { return Math.abs(ey - y) < 70; })) return;
        var alive = [];
        lanes.forEach(function (_, id) { var x = laneX(id, y); if (isFinite(x) && laneX(id, y + 40) >= 0 && laneX(id, y - 40) >= 0) alive.push([x, id]); });
        if (alive.length < 2) return;
        alive.sort(function (u, v) { return u[0] - v[0]; });
        var host = sp.b ? alive[0] : alive[Math.floor(rnd(g * 7 + si) * alive.length)];
        var lx = host[0], lenH = (0.03 + 0.04 * rnd(g * 3 + si + 5)) * cwv, dotX = Math.max(limitX, lx - 12 - lenH);
        if (lx - dotX < 22) return;
        var e = rnd(g + si * 13) > .45 ? Math.min(12, (lx - dotX) * .5) : 0;
        stubs.push({ pts: e ? [[lx, y - e], [lx - e, y], [dotX, y]] : [[lx, y], [dotX, y]], lane: host[1], ty: y - e, b: sp.b, t: 0 });
      });
    }
  }
  // The hand-off from the hero to the strip, kept minimal: a solder dot on each line, a slim chip the lines run
  // through, and one test point on a short elbowed trace. It lights up when a hero pulse arrives.
  function drawSeam(sy, ts) {
    var sY = startY - sy + 2; if (sY < -90 || sY > SH + 40) return;
    var n = strands.length, glow = 0;
    rings.forEach(function (r) { glow = Math.max(glow, 1 - (ts - r.t) / 700); });
    var edge = glow > 0 ? '#9BE33A' : '#5E8F2E', trace = glow > 0 ? 'rgba(122,185,41,' + (.5 + glow * .4) + ')' : 'rgba(58,82,48,.95)';
    sctx.lineCap = 'round'; sctx.lineJoin = 'round';
    strands.forEach(function (x) {
      sctx.fillStyle = '#15171A'; sctx.strokeStyle = edge; sctx.lineWidth = 1.8;
      sctx.beginPath(); sctx.arc(x, sY, 3.4, 0, 7); sctx.fill(); sctx.stroke();
    });
    if (n < 3) return;
    var xl = strands[n - 1], xr = strands[0], cy = sY + 30, cx = (xl + xr) / 2, hw = (xr - xl) / 2 + 8;
    // test point: one trace to the left with a single elbow, ending in a ring
    var L = Math.max(30, Math.min(80, rootEl.clientWidth * .035)), ex = cx - hw - L, ey = cy + 14;
    sctx.strokeStyle = trace; sctx.lineWidth = 1.8;
    sctx.beginPath(); sctx.moveTo(cx - hw, cy); sctx.lineTo(cx - hw - L + 14, cy); sctx.lineTo(ex, ey); sctx.stroke();
    sctx.fillStyle = '#15171A'; sctx.strokeStyle = edge; sctx.lineWidth = 1.8;
    sctx.beginPath(); sctx.arc(ex, ey, 6, 0, 7); sctx.fill(); sctx.stroke();
    sctx.fillStyle = edge; sctx.beginPath(); sctx.arc(ex, ey, 2.2, 0, 7); sctx.fill();
    // slim chip
    sctx.fillStyle = '#15171A'; sctx.strokeStyle = edge; sctx.lineWidth = 1.8;
    sctx.beginPath(); sctx.rect(cx - hw, cy - 6, hw * 2, 12); sctx.fill(); sctx.stroke();
    sctx.fillStyle = glow > 0 ? 'rgba(210,255,140,' + (.5 + glow * .5) + ')' : 'rgba(94,143,46,.6)';
    if (glow > 0) { sctx.shadowColor = '#A6E44A'; sctx.shadowBlur = 10 * glow; }
    sctx.beginPath(); sctx.arc(cx, cy, 2.2, 0, 7); sctx.fill(); sctx.shadowBlur = 0;
  }
  function pointOn(pts, f) {
    var tot = 0, L = [], k;
    for (k = 1; k < pts.length; k++) { L.push(Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1])); tot += L[k - 1]; }
    var d = f * tot; k = 0; while (k < L.length - 1 && d > L[k]) { d -= L[k]; k++; }
    var u = L[k] ? Math.min(1, d / L[k]) : 1;
    return [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * u, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * u];
  }
  function spark(pts, f, sy) {
    var q = pointOn(pts, f);
    sctx.fillStyle = '#F2FFD6'; sctx.shadowColor = '#A6E44A'; sctx.shadowBlur = 12;
    sctx.beginPath(); sctx.arc(q[0], q[1] - sy, 3, 0, 7); sctx.fill(); sctx.shadowBlur = 0;
  }
  function segX(seg, y) {
    for (var i = 1; i < seg.length; i++) {
      if (y <= seg[i][0]) { var a = seg[i - 1], b = seg[i]; return a[1] + (b[1] - a[1]) * (y - a[0]) / (b[0] - a[0] || 1); }
    }
    return seg[seg.length - 1][1];
  }
  function laneX(l, y) {
    var segs = lanes[l];
    for (var k = 0; k < segs.length; k++) if (y >= segs[k][0][0] && y <= segs[k][segs[k].length - 1][0]) return segX(segs[k], y);
    return NaN;
  }
  function strokeLane(l, sy, ya, yb) {
    lanes[l].forEach(function (seg) {
      var lo = Math.max(ya, seg[0][0] - sy), hi = Math.min(yb, seg[seg.length - 1][0] - sy);
      if (hi <= lo) return;
      sctx.beginPath(); sctx.moveTo(segX(seg, lo + sy), lo);
      for (var i = 0; i < seg.length; i++) if (seg[i][0] - sy > lo && seg[i][0] - sy < hi) sctx.lineTo(seg[i][1], seg[i][0] - sy);
      sctx.lineTo(segX(seg, hi + sy), hi); sctx.stroke();
    });
  }
  // pulses always flow down from the hero: they enter at the top of the strip and never reverse when scrolling up
  function spawn(anywhere, top) {
    var len = 50 + Math.random() * 70;
    pulses.push({ y: anywhere ? top + Math.random() * Math.max(0, SH - top) : Math.max(top, -len) - Math.random() * 260, len: len, v: .55 + Math.random() * .9, s: Math.floor(Math.random() * strands.length) });
  }
  function frame(ts) {
    var dt = Math.min(64, ts - (last || ts)); last = ts;
    var sy = window.scrollY, still = rootEl.classList.contains('a11y-motion') || (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);
    var inst = dt ? (sy - lastY) / dt * 1000 : 0; lastY = sy;
    vel += (inst - vel) * Math.min(1, dt / 140);
    nextBurst -= dt;
    if (nextBurst < 0) { burst = 1; nextBurst = 2200 + Math.random() * 3800; }
    burst = Math.max(0, burst - dt / 900);
    var dir = 1;
    var speed = 70 + Math.min(1400, Math.abs(vel) * .9) + (Math.sin(ts / 2300) * .5 + .5) * 60 + burst * burst * 650;
    var head = SH * .6; // reading position: the current is "charged" up to here
    sctx.clearRect(-PADL, 0, SW + PADL + PADR, SH);
    var top = Math.max(0, startY - sy); // the current starts where the hero ends
    sctx.save(); sctx.beginPath(); sctx.rect(-PADL, top, SW + PADL + PADR, Math.max(0, SH - top)); sctx.clip();
    sctx.lineWidth = 2; sctx.lineCap = 'round'; sctx.lineJoin = 'round';
    // below the hero the lines pick up where the hero's output lines left off: same colour, then they brighten gradually
    var bg = sctx.createLinearGradient(0, top, 0, top + 90);
    bg.addColorStop(0, 'rgba(58,82,48,.7)'); bg.addColorStop(1, 'rgba(58,82,48,.95)');
    stubs.forEach(function (st) {
      var ys = st.pts[0][1] - sy; if (ys < -40 || ys > SH + 40) return;
      var on = ys < head, np = st.pts[st.pts.length - 1];
      sctx.lineCap = 'round'; sctx.lineJoin = 'round';
      sctx.strokeStyle = st.b ? (on ? '#7AB929' : 'rgba(58,82,48,.95)') : (on ? 'rgba(122,185,41,.5)' : 'rgba(58,82,48,.45)');
      sctx.lineWidth = st.b ? 2 : 1.5;
      sctx.beginPath(); st.pts.forEach(function (q, k) { sctx[k ? 'lineTo' : 'moveTo'](q[0], q[1] - sy); }); sctx.stroke();
      var r = st.b ? 4 : 2.5;
      sctx.fillStyle = on ? (st.b ? '#A6E44A' : 'rgba(166,228,74,.6)') : (st.b ? '#15171A' : 'rgba(58,82,48,.6)');
      sctx.strokeStyle = on ? '#D6FF9A' : (st.b ? '#5E8F2E' : 'rgba(58,82,48,.6)'); sctx.lineWidth = st.b ? 2 : 1.2;
      if (on && st.b) { sctx.shadowColor = '#7AB929'; sctx.shadowBlur = 8; }
      sctx.beginPath(); sctx.arc(np[0], np[1] - sy, r, 0, 7); sctx.fill(); sctx.stroke(); sctx.shadowBlur = 0;
      if (st.t) { var tb = (ts - st.t) / 350; if (tb < 1) spark(st.pts, tb, sy); else if (tb < 1.8) {
        sctx.strokeStyle = 'rgba(166,228,74,' + (1 - (tb - 1) / .8) * .9 + ')'; sctx.lineWidth = 2;
        sctx.beginPath(); sctx.arc(np[0], np[1] - sy, r + 2 + (tb - 1) * 10, 0, 7); sctx.stroke(); } }
    });
    sctx.strokeStyle = bg; sctx.lineWidth = 2.5;
    lanes.forEach(function (_, l) { strokeLane(l, sy, top, SH); });
    sctx.lineWidth = 2;
    if (head > top) {
      var g = sctx.createLinearGradient(0, top, 0, head), span = Math.max(1, head - top);
      g.addColorStop(0, 'rgba(122,185,41,0)'); g.addColorStop(Math.min(1, 140 / span), 'rgba(122,185,41,.8)'); g.addColorStop(1, 'rgba(166,228,74,1)');
      sctx.strokeStyle = g;
      lanes.forEach(function (_, l) { strokeLane(l, sy, top, head); });
    }
    // a branch into every section heading (a tap, or the line that peeled off the bundle)
    marks.forEach(function (m, i) {
      var y = m - sy; if (y < -90 || y > SH + 30) { lit[i] = y < head; return; }
      var on = y < head, bp = branches[i];
      if (on && !lit[i]) litAt[i] = ts; lit[i] = on;
      var np = bp[bp.length - 1], x2 = np[0];
      sctx.strokeStyle = on ? '#7AB929' : 'rgba(58,82,48,.95)'; sctx.lineWidth = 2; sctx.lineCap = 'round'; sctx.lineJoin = 'round';
      if (on) { sctx.shadowColor = 'rgba(122,185,41,.7)'; sctx.shadowBlur = 6; }
      var paths = [bp].concat(extras[i] || []);
      paths.forEach(function (pp) { sctx.beginPath(); pp.forEach(function (q, k) { sctx[k ? 'lineTo' : 'moveTo'](q[0], q[1] - sy); }); sctx.stroke(); });
      sctx.shadowBlur = 0;
      lanes.forEach(function (_, l) {
        var lx = laneX(l, m); if (!isFinite(lx)) return;
        sctx.fillStyle = on ? '#A6E44A' : '#3A5230'; sctx.beginPath(); sctx.arc(lx, y, 2, 0, 7); sctx.fill();
      });
      // a spark runs along the branch into the node the moment it is reached
      var age = (ts - litAt[i]) / 800, tr = (ts - litAt[i]) / 450;
      if (on && litAt[i] && tr < 1) paths.forEach(function (pp) { spark(pp, tr, sy); });
      var bt = burstT[i], tb = bt ? (ts - bt) / 450 : 9;
      if (tb < 1) paths.forEach(function (pp) { spark(pp, tb, sy); });
      sctx.fillStyle = on ? '#A6E44A' : '#15171A'; sctx.strokeStyle = on ? '#D6FF9A' : '#5E8F2E'; sctx.lineWidth = 2;
      if (on) { sctx.shadowColor = '#7AB929'; sctx.shadowBlur = 10; }
      var fin = !!extras[i], R = fin ? 8 : 5;
      if (fin) {
        sctx.save(); sctx.lineWidth = 1.5;
        [13, 19].forEach(function (rr, q) {
          var br = on ? .5 + .5 * Math.sin(ts / 420 - q * 1.1) : 0;
          sctx.strokeStyle = on ? 'rgba(166,228,74,' + (.15 + br * .45) + ')' : 'rgba(94,143,46,.35)';
          sctx.beginPath(); sctx.arc(x2, y, rr + br * 2, 0, 7); sctx.stroke();
        });
        sctx.restore();
      }
      sctx.beginPath(); sctx.arc(x2, y, R, 0, 7); sctx.fill(); sctx.stroke(); sctx.shadowBlur = 0;
      if (tb >= 1 && tb < 1.8) {
        sctx.strokeStyle = 'rgba(166,228,74,' + (1 - (tb - 1) / .8) * .9 + ')'; sctx.lineWidth = 2;
        sctx.beginPath(); sctx.arc(x2, y, 7 + (tb - 1) * 22, 0, 7); sctx.stroke();
      }
      if (on && age < 1 && litAt[i]) {
        sctx.strokeStyle = 'rgba(166,228,74,' + (1 - age) * .9 + ')'; sctx.lineWidth = 2;
        sctx.beginPath(); sctx.arc(x2, y, 7 + age * 14, 0, 7); sctx.stroke();
        sctx.strokeStyle = 'rgba(166,228,74,' + (1 - age) * .5 + ')'; sctx.beginPath(); sctx.arc(x2, y, 7 + age * 22, 0, 7); sctx.stroke();
      }
    });
    // head spark: a soft glow on the middle line
    var hx = strands[Math.floor(strands.length / 2)];
    var hg = sctx.createRadialGradient(hx, head, 0, hx, head, 14);
    hg.addColorStop(0, 'rgba(166,228,74,.7)'); hg.addColorStop(1, 'rgba(166,228,74,0)');
    sctx.fillStyle = hg; sctx.fillRect(hx - 14, head - 14, 28, 28);
    // pulses
    // each time a hero pulse reaches the bottom of its output line, that same pulse carries on down the matching strip line
    if (!still && lanes.length > 1) lanes.forEach(function (_, l) {
      if (heroArrive[l] === undefined) return;
      var cyc = Math.floor((ts - heroArrive[l]) / 4800);
      if (handed[l] === undefined) handed[l] = cyc;
      if (cyc > handed[l]) { handed[l] = cyc; pulses.push({ y: top, len: 70, v: 1, s: l, boost: 1 }); rings.push({ l: l, t: ts }); }
    });
    if (!still) {
      while (pulses.length < 7) { spawn(!seeded && pulses.length < 4, top); } seeded = true;
      var forks = [];
      pulses.forEach(function (p) {
        var pv = speed * p.v, prev = p.y;
        if (p.boost) { pv = pv * (1 - p.boost) + 420 * p.boost; p.boost = Math.max(0, p.boost - dt / 900); }
        p.y += dir * pv * dt / 1000;
        var lane = p.s, ln = lanes[lane];
        if (!ln) { p.dead = 1; return; }
        var fast = Math.min(1, speed * p.v / 900), len2 = p.len * (1 + fast * 1.6), y0 = p.y - dir * len2;
        var crossed = function (yy) { return prev < yy - sy && p.y >= yy - sy; };
        splits.forEach(function (sp) { if (sp.parent === lane && !p.nf && crossed(sp.y) && Math.random() < .75) forks.push({ y: sp.y - sy, len: p.len, v: p.v, s: sp.child, nf: 1 }); });
        peels.forEach(function (pe) { if (pe.lane === lane && crossed(pe.y)) burstT[pe.mark] = ts; });
        stubs.forEach(function (st) { if (st.b && st.lane === lane && crossed(st.ty)) st.t = ts; });
        var endY = ln[0][ln[0].length - 1][0] - sy;
        if (p.y > endY) {
          var mg = null; merges.forEach(function (m) { if (m.lane === lane) mg = m; });
          if (mg) { p.s = mg.into; lane = p.s; } else if (y0 > endY) { p.dead = 1; return; }
        }
        var g = sctx.createLinearGradient(0, p.y, 0, y0);
        g.addColorStop(0, 'rgba(210,255,140,1)'); g.addColorStop(.3, 'rgba(166,228,74,.7)'); g.addColorStop(1, 'rgba(166,228,74,0)');
        sctx.lineCap = 'round'; sctx.shadowColor = '#7AB929'; sctx.shadowBlur = 10 + fast * 10;
        sctx.strokeStyle = g; sctx.lineWidth = 3 + fast * 1.5;
        strokeLane(lane, sy, Math.min(p.y, y0), Math.max(p.y, y0)); sctx.shadowBlur = 0;
        var hx2 = laneX(lane, p.y + sy);
        if (isFinite(hx2)) { sctx.fillStyle = '#F2FFD6'; sctx.beginPath(); sctx.arc(hx2, p.y, 1.8 + fast, 0, 7); sctx.fill(); }
      });
      pulses = pulses.filter(function (p) { return !p.dead && p.y - p.len * 3 < SH; }).concat(forks);
    }
    sctx.restore();
    drawSeam(sy, ts);
    // a shock ring opens on the line where the hero pulse crosses into the strip
    rings = rings.filter(function (r) { return ts - r.t < 700; });
    rings.forEach(function (r) {
      var age = (ts - r.t) / 700, ry = startY - sy + 2, rx = laneX(r.l, startY + 2);
      if (!isFinite(rx) || ry < -30 || ry > SH + 30) return;
      sctx.strokeStyle = 'rgba(166,228,74,' + (1 - age) * .9 + ')'; sctx.lineWidth = 2;
      sctx.beginPath(); sctx.arc(rx, ry, 3 + age * 11, 0, 7); sctx.stroke();
      sctx.fillStyle = 'rgba(210,255,140,' + (1 - age) + ')'; sctx.shadowColor = '#A6E44A'; sctx.shadowBlur = 10;
      sctx.beginPath(); sctx.arc(rx, ry, 2.4 * (1 - age) + .6, 0, 7); sctx.fill(); sctx.shadowBlur = 0;
    });
    requestAnimationFrame(frame);
  }
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  requestAnimationFrame(frame);

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
    if (st) { size = st.size || 0; (st.on || []).forEach(function (k) { if (toggles[k]) root.classList.add(toggles[k]); }); applySize(); sync(); applyMotion(); }
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
    applySize(); sync(); save(); applyMotion(); document.dispatchEvent(new Event('a11y-motion'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !aPanel.hidden) { aPanel.hidden = true; aBtn.setAttribute('aria-expanded', 'false'); aBtn.focus(); }
  });

  // Dark mode toggle (saved choice wins; otherwise the system preference applied in <head>)
  var tBtn = document.getElementById('themeBtn');
  var meta = document.querySelector('meta[name="theme-color"]');
  function paintTheme() {
    var dark = root.getAttribute('data-theme') === 'dark';
    if (tBtn) tBtn.setAttribute('aria-checked', String(dark));
    var cap = document.getElementById('swCap'); if (cap) cap.textContent = dark ? 'הדליקו את האור' : 'כבו את האור';
    if (meta) meta.setAttribute('content', dark ? '#23272C' : '#ffffff');
  }
  paintTheme();
  function themeBurst(dark, src) {
    if (root.classList.contains('a11y-motion') || (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) || !document.body.animate) return;
    var r = (src || tBtn).getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var flash = document.createElement('div');
    flash.className = 'theme-flash';
    flash.style.background = 'radial-gradient(circle at ' + cx + 'px ' + cy + 'px,' + (dark ? 'rgba(166,228,74,.55)' : 'rgba(255,255,255,.95)') + ',rgba(0,0,0,0) 65%)';
    document.body.appendChild(flash);
    flash.animate([{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 0 }], { duration: 650, easing: 'ease-out' }).onfinish = function () { flash.remove(); };
    for (var i = 0; i < 16; i++) {
      var p = document.createElement('i');
      p.className = 'spark';
      p.style.left = cx + 'px'; p.style.top = cy + 'px';
      document.body.appendChild(p);
      var ang = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 110;
      p.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + Math.cos(ang) * dist + 'px,' + (Math.sin(ang) * dist + 30) + 'px) scale(.2)', opacity: 0 }], { duration: 450 + Math.random() * 350, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = (function (el) { return function () { el.remove(); }; })(p);
    }
  }
  if (tBtn) tBtn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tBtn.dispatchEvent(new Event('click')); } });
  function toggleTheme(src) {
    var dark = root.getAttribute('data-theme') !== 'dark';
    themeBurst(dark, src || tBtn);
    root.classList.add('theme-fade');
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
    paintTheme();
    setTimeout(function () { root.classList.remove('theme-fade'); }, 400);
  }
  if (tBtn) tBtn.addEventListener('click', function () { toggleTheme(tBtn); });
  var boltEl = document.querySelector('.bolt-hit');
  if (boltEl) boltEl.addEventListener('click', function () { toggleTheme(boltEl); });
  // the bolt's own pointer area also catches clicks on the glyph
  var boltGlyph = document.querySelector('.bolt');
  if (boltGlyph) boltGlyph.addEventListener('click', function () { toggleTheme(boltEl || boltGlyph); });

  // Contact form
  var form = document.getElementById('contactForm');
  var msg = document.getElementById('formMsg');
  // energize the wire along the top as the key fields are filled
  var req = ['f-name', 'f-phone', 'f-type', 'f-msg'].map(function (id) { return document.getElementById(id); });
    function energize() {
    var n = req.filter(function (el) { return el.value.trim(); }).length;
    form.classList.toggle('live', n > 0);
    form.classList.toggle('full', n === req.length);
    form.style.setProperty('--p', n / req.length);
  }
  form.addEventListener('input', energize);
  form.addEventListener('change', energize);
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
        form.classList.add('sent');
        setTimeout(function () { form.classList.remove('sent'); energize(); }, 1200);
        msg.textContent = 'תודה! קיבלנו את הפנייה ונחזור אליכם בהקדם.';
      })
      .catch(function () {
        msg.textContent = 'השליחה נכשלה. נסו שוב או התקשרו אלינו.';
        msg.classList.add('err');
      })
      .then(function () { submit.disabled = false; });
  });
})();

/* process: energize the line when it scrolls into view; replays on re-entry */
(function () {
  var steps = document.querySelector('.steps');
  if (!steps) return;
  if (!('IntersectionObserver' in window)) { steps.classList.add('go'); return; }
  new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) steps.classList.add('go');
      else if (e.boundingClientRect.top > 0) steps.classList.remove('go');
    });
  }, { threshold: 0.45 }).observe(steps);
})();

/* contact headline: ignite once visible */
(function () {
  var el = document.getElementById('ignite');
  if (!el) return;
  if (!('IntersectionObserver' in window)) { el.classList.add('on'); return; }
  var io = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { el.classList.add('on'); io.disconnect(); }
  }, { threshold: 0.6 });
  io.observe(el);
})();
