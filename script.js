(function () {
  function rest() { return 'var(--rest)'; }
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
      paint(cur);
      raf = Math.abs(target - cur) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    var kick = function () { if (!raf && !still) raf = requestAnimationFrame(tick); };
    paint(cur);
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    kick();
  }

  // Hero graphic: side buses (like the background traces) that plug into the central chip
  var mBus = document.getElementById('mBus');
  var busAnim = [];
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
      var sr = small ? 2 : Math.max(4, (cw - 1200) / 2 - 52);
      var xs = (small ? [sr + 8, sr + 8, sr + 8] : [sr + 6, sr + 13, sr + 20]).map(function (d) { return cw - d; });
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
      var gStart = [62, 12, -62], gFrac = [.62, .22, .18], gKs = [1, .86, 1.05], gXs = [];
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
      flash(bolt, [{ transform: 'translate(0px,335px) scale(1.45)', offset: 0 }, { transform: 'translate(0px,335px) scale(1.1)', offset: pulse }, { transform: 'translate(0px,335px) scale(1.1)', offset: 1 }], coreAt, 0);
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
    };
    build();
    var rt = 0;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 150); });
    window.addEventListener('load', build);
  }

  // Scroll-linked current: a fixed strip at the right edge (next to the text) carries the hero's current
  // down the page and branches into every section heading. Bright up to the reading position; pulses speed up
  // with scroll and surge in random bursts; a node lights (with a ring) as each heading is reached.
  var spine = document.createElement('canvas');
  spine.className = 'spine';
  spine.setAttribute('aria-hidden', 'true');
  document.body.appendChild(spine);
  var sctx = spine.getContext('2d');
  var PADL = 40, SW = 44, SH = 0, SR = 4, dpr = 1, strands = [34, 26, 18], stubEnd = 2;
  var marks = [], lit = [], litAt = [], startY = 0;
  var pulses = [], lastY = window.scrollY, vel = 0, last = 0, burst = 0, nextBurst = 2500;
  var rootEl = document.documentElement;
  function measure() {
    var small = window.innerWidth <= 720, cw = rootEl.clientWidth;
    SW = small ? 22 : 52; strands = small ? [SW - 8] : [SW - 6, SW - 13, SW - 20];
    SR = small ? 2 : Math.max(4, (cw - 1200) / 2 - 52);
    SH = window.innerHeight; dpr = window.devicePixelRatio || 1;
    spine.style.right = SR + 'px'; spine.style.width = (SW + PADL) + 'px'; spine.style.height = SH + 'px';
    spine.width = (SW + PADL) * dpr; spine.height = SH * dpr; sctx.setTransform(dpr, 0, 0, dpr, PADL * dpr, 0); // x = 0 is the strip's left edge; PADL px to its left are room for the rings
    var contentRight = cw / 2 + Math.min(1200, cw - (small ? 40 : 64)) / 2, gap = cw - contentRight;
    stubEnd = Math.max(small ? 7 : 9, SW - (gap - SR) + 2);
    var sy = window.scrollY, hero = document.querySelector('.hero');
    startY = hero ? hero.getBoundingClientRect().bottom + sy : 0;
    marks = [].map.call(document.querySelectorAll('main > section:not(.hero)'), function (sec) {
      var hd = sec.querySelector('.eyebrow, h2');
      var r = (hd || sec).getBoundingClientRect();
      return hd ? r.top + sy + Math.min(14, r.height / 2) : r.top + sy + 40;
    });
    lit = marks.map(function () { return false; }); litAt = marks.map(function () { return 0; });
  }
  function spawn(dir, anywhere) {
    var len = 50 + Math.random() * 70;
    pulses.push({ y: anywhere ? Math.random() * SH : (dir > 0 ? -len : SH + len), len: len, v: .55 + Math.random() * .9, s: Math.floor(Math.random() * strands.length) });
  }
  function frame(ts) {
    var dt = Math.min(64, ts - (last || ts)); last = ts;
    var sy = window.scrollY, still = rootEl.classList.contains('a11y-motion') || (window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);
    var inst = dt ? (sy - lastY) / dt * 1000 : 0; lastY = sy;
    vel += (inst - vel) * Math.min(1, dt / 140);
    nextBurst -= dt;
    if (nextBurst < 0) { burst = 1; nextBurst = 2200 + Math.random() * 3800; }
    burst = Math.max(0, burst - dt / 900);
    var dir = vel < -40 ? -1 : 1;
    var speed = 70 + Math.min(1400, Math.abs(vel) * .9) + (Math.sin(ts / 2300) * .5 + .5) * 60 + burst * burst * 650;
    var head = SH * .6; // reading position: the current is "charged" up to here
    sctx.clearRect(-PADL, 0, SW + PADL, SH);
    var top = Math.max(0, startY - sy); // the current starts where the hero ends
    sctx.save(); sctx.beginPath(); sctx.rect(-PADL, top, SW + PADL, Math.max(0, SH - top)); sctx.clip();
    strands.forEach(function (x) {
      sctx.lineWidth = 2; sctx.lineCap = 'round';
      sctx.strokeStyle = 'rgba(58,82,48,.95)'; sctx.beginPath(); sctx.moveTo(x, top); sctx.lineTo(x, SH); sctx.stroke();
      if (head > top) {
        var g = sctx.createLinearGradient(0, top, 0, head);
        g.addColorStop(0, 'rgba(122,185,41,.85)'); g.addColorStop(.7, 'rgba(122,185,41,.8)'); g.addColorStop(1, 'rgba(166,228,74,1)');
        sctx.strokeStyle = g; sctx.beginPath(); sctx.moveTo(x, top); sctx.lineTo(x, head); sctx.stroke();
      }
    });
    // a branch into every section heading
    var mid = strands[Math.floor(strands.length / 2)];
    marks.forEach(function (m, i) {
      var y = m - sy; if (y < -30 || y > SH + 30) { lit[i] = y < head; return; }
      var on = y < head;
      if (on && !lit[i]) litAt[i] = ts; lit[i] = on;
      var x2 = stubEnd, xs0 = strands[0];
      var col = on ? '#7AB929' : 'rgba(58,82,48,.95)';
      // a plain branch: one straight line from the strip to a round node at the heading
      sctx.strokeStyle = col; sctx.lineWidth = 2; sctx.lineCap = 'round';
      if (on) { sctx.shadowColor = 'rgba(122,185,41,.7)'; sctx.shadowBlur = 6; }
      sctx.beginPath(); sctx.moveTo(xs0, y); sctx.lineTo(x2, y); sctx.stroke(); sctx.shadowBlur = 0;
      strands.forEach(function (sx) { sctx.fillStyle = on ? '#A6E44A' : '#3A5230'; sctx.beginPath(); sctx.arc(sx, y, 2, 0, 7); sctx.fill(); });
      sctx.fillStyle = on ? '#A6E44A' : '#15171A'; sctx.strokeStyle = on ? '#D6FF9A' : '#5E8F2E'; sctx.lineWidth = 2;
      if (on) { sctx.shadowColor = '#7AB929'; sctx.shadowBlur = 10; }
      sctx.beginPath(); sctx.arc(x2, y, 5, 0, 7); sctx.fill(); sctx.stroke(); sctx.shadowBlur = 0;
      var age = (ts - litAt[i]) / 800;
      if (on && age < 1 && litAt[i]) {
        sctx.strokeStyle = 'rgba(166,228,74,' + (1 - age) * .9 + ')'; sctx.lineWidth = 2;
        sctx.beginPath(); sctx.arc(x2, y, 7 + age * 14, 0, 7); sctx.stroke();
        sctx.strokeStyle = 'rgba(166,228,74,' + (1 - age) * .5 + ')'; sctx.beginPath(); sctx.arc(x2, y, 7 + age * 22, 0, 7); sctx.stroke();
      }
    });
    // head spark
    var hx = strands[0] - 4;
    var hg = sctx.createRadialGradient(hx, head, 0, hx, head, 16);
    hg.addColorStop(0, 'rgba(166,228,74,.85)'); hg.addColorStop(1, 'rgba(166,228,74,0)');
    sctx.fillStyle = hg; sctx.fillRect(0, head - 16, SW, 32);
    // pulses
    if (!still) {
      while (pulses.length < 7) spawn(dir, pulses.length < 4);
      pulses.forEach(function (p) {
        p.y += dir * speed * p.v * dt / 1000;
        var x = strands[Math.min(p.s, strands.length - 1)], y0 = p.y - dir * p.len;
        var fast = Math.min(1, speed * p.v / 900), len2 = p.len * (1 + fast * 1.6);
        y0 = p.y - dir * len2;
        var g = sctx.createLinearGradient(0, p.y, 0, y0);
        g.addColorStop(0, 'rgba(210,255,140,1)'); g.addColorStop(.3, 'rgba(166,228,74,.7)'); g.addColorStop(1, 'rgba(166,228,74,0)');
        sctx.lineCap = 'round'; sctx.shadowColor = '#7AB929'; sctx.shadowBlur = 10 + fast * 10;
        sctx.strokeStyle = g; sctx.lineWidth = 3 + fast * 1.5;
        sctx.beginPath(); sctx.moveTo(x, p.y); sctx.lineTo(x, y0); sctx.stroke(); sctx.shadowBlur = 0;
        sctx.fillStyle = '#F2FFD6'; sctx.beginPath(); sctx.arc(x, p.y, 1.8 + fast, 0, 7); sctx.fill();
      });
      pulses = pulses.filter(function (p) { return dir > 0 ? p.y - p.len * 3 < SH : p.y + p.len * 3 > 0; });
    }
    sctx.restore();
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

  // Dark mode toggle (saved choice wins; otherwise the system preference applied in <head>)
  var tBtn = document.getElementById('themeBtn');
  var meta = document.querySelector('meta[name="theme-color"]');
  function paintTheme() {
    var dark = root.getAttribute('data-theme') === 'dark';
    if (tBtn) tBtn.setAttribute('aria-checked', String(dark));
    var cap = document.getElementById('swCap'); if (cap) cap.textContent = dark ? 'הדליקו את האור' : 'כבו את האור';
    if (meta) meta.setAttribute('content', dark ? '#0E1012' : '#ffffff');
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
