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
      mk(c, 'left:-1px;top:2px;right:-4px;bottom:-5px;background:rgba(20,22,24,.5);border-radius:3px;filter:blur(3px);transform:translateZ(-5px);pointer-events:none');
      var f = mk(c, 'inset:0;background:' + front + ';transform:translateZ(' + d + 'px)', 'fx');
      mk(c, 'left:' + (w - d) / 2 + 'px;top:0;width:' + d + 'px;height:' + h + 'px;background:linear-gradient(90deg,rgba(0,0,0,.25),transparent 60%),' + side + ';transform:translateZ(' + d / 2 + 'px) rotateY(90deg) translateZ(' + w / 2 + 'px)');
      mk(c, 'left:' + (w - d) / 2 + 'px;top:0;width:' + d + 'px;height:' + h + 'px;background:linear-gradient(-90deg,rgba(0,0,0,.35),transparent 60%),' + side + ';transform:translateZ(' + d / 2 + 'px) rotateY(-90deg) translateZ(' + w / 2 + 'px)');
      mk(c, 'left:0;top:' + (h - d) / 2 + 'px;width:' + w + 'px;height:' + d + 'px;background:' + top + ';transform:translateZ(' + d / 2 + 'px) rotateX(90deg) translateZ(' + h / 2 + 'px)');
      c._f = f;
      return c;
    };

    // enclosure shell (open front): back wall + four walls
    var shell = mk(scene, 'left:0;top:0;width:' + W + 'px;height:' + H + 'px', 'part');
    mk(shell, 'inset:0;background:radial-gradient(ellipse at 40% 30%,#c6caca,#a9aeb0 80%)');
    mk(shell, 'left:' + (-D / 2) + 'px;top:0;width:' + D + 'px;height:' + H + 'px;background:linear-gradient(90deg,#d9dddd,#c3c8c9);transform:translateZ(' + D / 2 + 'px) rotateY(-90deg)');
    mk(shell, 'left:' + (W - D / 2) + 'px;top:0;width:' + D + 'px;height:' + H + 'px;background:linear-gradient(90deg,#b3b8b9,#9ea4a6);transform:translateZ(' + D / 2 + 'px) rotateY(90deg)');
    mk(shell, 'left:0;top:' + (-D / 2) + 'px;width:' + W + 'px;height:' + D + 'px;background:#e9ebeb;transform:translateZ(' + D / 2 + 'px) rotateX(90deg)');
    mk(shell, 'left:0;top:' + (H - D / 2) + 'px;width:' + W + 'px;height:' + D + 'px;background:#9fa4a6;transform:translateZ(' + D / 2 + 'px) rotateX(-90deg)');
    // front lip of the enclosure and a ventilation slot band on the left wall
    mk(shell, 'left:-1px;top:-1px;width:' + (W + 2) + 'px;height:' + (H + 2) + 'px;border:7px solid #d4d8d9;box-sizing:border-box;transform:translateZ(' + D + 'px);pointer-events:none');
    mk(shell, 'left:' + (-D / 2 + 14) + 'px;top:150px;width:' + (D - 28) + 'px;height:110px;background:repeating-linear-gradient(0deg,#5d6366 0 3px,transparent 3px 9px);transform:translateZ(' + D / 2 + 'px) rotateY(-90deg) translateZ(1px)');
    add(shell, 0, [0, 0, 0], [0, 0, -90]);

    // mounting plate with corner screws
    var plate = mk(scene, 'left:14px;top:14px;width:' + (W - 28) + 'px;height:' + (H - 28) + 'px;background:radial-gradient(ellipse at 30% 20%,#f4f1e6,#e3dfd0 70%),#ece8dc;box-shadow:inset 0 0 0 2px rgba(0,0,0,.12),inset 0 0 30px rgba(0,0,0,.12);transform:translateZ(8px)', 'part');
    add(plate, 1, [0, 0, 8], [0, 0, -30]);
    [[20, 20], [W - 28, 20], [20, H - 28], [W - 28, H - 28]].forEach(function (p) {
      var s = mk(scene, 'left:' + p[0] + 'px;top:' + p[1] + 'px;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff,#8d9499 70%);box-shadow:0 1px 2px rgba(0,0,0,.4)', 'part');
      mk(s, 'left:3px;top:1px;width:2px;height:6px;background:#555b5f');
      add(s, 1, [0, 0, 10], [rnd(seq) * 30, rnd(seq + 1) * 30, 40], [0, 0, rnd(seq + 2) * 90]);
      seq += 3;
    });

    // rails and devices (rows from top to bottom)
    var rail = function (y, st, x0, w) {
      var r = mk(scene, 'left:' + (x0 || 24) + 'px;top:' + (y + 62) + 'px;width:' + (w || W - 48) + 'px;height:10px;background:linear-gradient(#e2e5e6,#8d9499)', 'part');
      mk(r, 'left:0;right:0;top:4px;height:2px;background:repeating-linear-gradient(90deg,#4d5357 0 6px,transparent 6px 14px)');
      add(r, st, [0, 0, 14], [0, rnd(y) * 20, -6]);
    };
    var txt = function (parent, css, str) { return mk(parent, 'font:700 8px/1 Arial,sans-serif;text-align:center;' + css, null).appendChild(document.createTextNode(str)).parentNode; };
    var led = function (parent, css, color) { return mk(parent, css + ';border-radius:50%;background:' + color + ';color:' + color, 'led'); };
    var screw = function (parent, css) {
      var sc = mk(parent, css + ';border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#aeb4b8 55%,#6d7377);box-shadow:0 0 0 1px rgba(0,0,0,.35)');
      mk(sc, 'left:15%;right:15%;top:44%;height:1.5px;background:#3a3f45;transform:rotate(35deg)');
      return sc;
    };
    var MCB_ON = '21px', MCB_OFF = '30px';
    var devs = { led: [], tog: [], win: [], ov: [], gauge: [] };

    // row 1: main breaker + white MCBs with black toggles and rating labels
    rail(24, 1);
    var main = cube(scene, 28, 24, 50, 64, 34, '#2a2d31', '#16181b', '#3a3f45');
    mk(main._f, 'left:5px;top:5px;width:40px;height:10px;background:#f3f4f4');
    txt(main._f, 'left:5px;top:6px;width:40px;color:#15171A;letter-spacing:1px', 'MAIN');
    var mhandle = mk(main._f, 'left:9px;top:19px;width:32px;height:30px;background:linear-gradient(90deg,#7d848a,#b9bec0 40%,#7d848a);border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,.5);transition:top .15s');
    mk(mhandle, 'left:3px;top:3px;width:26px;height:10px;background:#b5524a;border-radius:2px');
    main._f.classList.add('play');
    txt(main._f, 'left:5px;bottom:5px;width:40px;color:#9aa0a3', 'I   O');
    for (var sx = 0; sx < 3; sx++) { screw(main._f, 'left:' + (7 + sx * 13) + 'px;top:-1px;width:9px;height:9px'); screw(main._f, 'left:' + (7 + sx * 13) + 'px;bottom:-1px;width:9px;height:9px'); }
    add(main, 2, [0, 0, 14], [-30, -60, 100], [20, -30, -10]);
    devs.main = main;
    var rate = ['C10', 'C16', 'C16', 'C20', 'C10', 'C25', 'C16', 'C20', 'C32'];
    var tag = ['#e4e6e6', '#d3e6b0', '#e4e6e6', '#e4e6e6', '#d3e6b0', '#e4e6e6', '#e4e6e6', '#d3e6b0', '#e4e6e6'];
    devs.mcb = [];
    for (var i = 0; i < 9; i++) {
      var m = cube(scene, 84 + i * 20.9, 24, 19, 64, 28, 'linear-gradient(90deg,#dfe2e2,#fbfbfb 35%,#fbfbfb 65%,#d9dcdc)', '#c7cbcc', '#dcdfdf');
      screw(m._f, 'left:4px;top:1px;width:11px;height:7px;border-radius:2px');
      screw(m._f, 'left:4px;bottom:1px;width:11px;height:7px;border-radius:2px');
      txt(m._f, 'left:1px;top:10px;width:17px;font-size:6px;color:#2a2d31', rate[i]);
      mk(m._f, 'left:3px;top:18px;width:13px;height:24px;background:linear-gradient(90deg,#1b1e21,#33383d);border-radius:2px;box-shadow:inset 0 0 3px #000');
      var mtog = mk(m._f, 'left:5px;top:' + MCB_ON + ';width:9px;height:11px;background:linear-gradient(90deg,#4a5157,#15171A 50%,#2a2d31);border-radius:2px;box-shadow:0 1px 2px rgba(0,0,0,.6);transition:top .15s');
      mk(mtog, 'left:1px;top:1px;width:7px;height:1.5px;background:#8d9499');
      m._f.classList.add('play');
      devs.tog.push(mtog);
      mk(m._f, 'left:2px;top:45px;width:15px;height:8px;background:' + tag[i] + ';border:1px solid #b8bcbd');
      mk(m._f, 'left:5px;top:47px;width:9px;height:1px;background:#6d7377');
      mk(m._f, 'left:5px;top:50px;width:6px;height:1px;background:#6d7377');
      add(m, 2 + (i % 2), [0, 0, 14], [rnd(seq) * 60, -50 - (i % 4) * 14, 70 + (i % 5) * 18], [rnd(seq + 1) * 40, rnd(seq + 2) * 50, rnd(seq + 3) * 40]);
      seq += 4;
      devs.mcb.push(m);
    }

    // three phase busbars (brown / black / grey) on insulating supports
    var bars = ['#6b5a4d', '#2b2e31', '#9ba1a4'];
    devs.bus = [];
    bars.forEach(function (c, bi) {
      var b = cube(scene, 28, 92 + bi * 8, 244, 5, 8, 'linear-gradient(#fff3,#0003),' + c, c, c);
      add(b, 3, [0, 0, 18], [0, -20 - bi * 14, 80 + bi * 16], [0, 0, (bi - 1) * 4]);
      devs.bus.push(b);
    });
    [58, 148, 240].forEach(function (x, si) {
      var sp = cube(scene, x, 89, 10, 26, 14, '#2f3438', '#1b1e21', '#454c52');
      add(sp, 3, [0, 0, 14], [rnd(seq) * 20, 10, 40 + si * 12], [0, 0, 0]);
      seq += 1;
    });

    // row 2: black contactors with window, aux block and status LED
    rail(118, 2);
    devs.con = [];
    for (i = 0; i < 6; i++) {
      var k = cube(scene, 28 + i * 42, 118, 38, 70, 34, 'linear-gradient(90deg,#1b1e21,#2f3438 30%,#2f3438 70%,#1b1e21)', '#16181b', '#3a3f45');
      for (var j = 0; j < 3; j++) {
        screw(k._f, 'left:' + (4 + j * 11) + 'px;top:2px;width:9px;height:9px');
        screw(k._f, 'left:' + (4 + j * 11) + 'px;bottom:2px;width:9px;height:9px');
        txt(k._f, 'left:' + (3 + j * 11) + 'px;top:12px;width:11px;font-size:4.5px;color:#9aa0a3', 'L' + (j + 1));
        txt(k._f, 'left:' + (3 + j * 11) + 'px;top:51px;width:11px;font-size:4.5px;color:#9aa0a3', 'T' + (j + 1));
      }
      mk(k._f, 'left:5px;top:19px;width:28px;height:10px;background:#eef0f0;border-radius:1px');
      txt(k._f, 'left:5px;top:21px;width:28px;color:#15171A;font-size:6px', 'K' + (i + 1));
      devs.win.push(mk(k._f, 'left:6px;top:32px;width:13px;height:8px;background:#6e767d;border:1px solid #0d0f10;border-radius:1px;transition:background .2s'));
      k._f.classList.add('play');
      mk(k._f, 'right:5px;top:31px;width:9px;height:19px;background:linear-gradient(90deg,#4f5a63,#6b7782);border-radius:1px');
      mk(k._f, 'right:7px;top:34px;width:5px;height:1px;background:#cfd3d4');
      mk(k._f, 'right:7px;top:38px;width:5px;height:1px;background:#cfd3d4');
      devs.led.push(led(k._f, 'left:10px;top:43px;width:6px;height:6px', '#5be05b'));
      add(k, 3, [0, 0, 14], [rnd(seq) * 70, rnd(seq + 1) * 40, 90 + (i % 3) * 22], [rnd(seq + 2) * 50, rnd(seq + 3) * 60, rnd(seq + 4) * 50]);
      seq += 5;
      devs.con.push(k);
    }

    // row 3: three overload relays (red tops), a PLC and a power supply
    rail(212, 3);
    for (i = 0; i < 3; i++) {
      var k2 = cube(scene, 28 + i * 42, 212, 38, 68, 34, 'linear-gradient(90deg,#24272b,#3a4046 30%,#3a4046 70%,#24272b)', '#16181b', '#4a5157');
      for (var j2 = 0; j2 < 3; j2++) {
        screw(k2._f, 'left:' + (4 + j2 * 11) + 'px;top:2px;width:9px;height:8px');
        screw(k2._f, 'left:' + (4 + j2 * 11) + 'px;bottom:2px;width:9px;height:8px');
      }
      mk(k2._f, 'left:5px;top:13px;width:28px;height:9px;background:#eef0f0;border-radius:1px');
      txt(k2._f, 'left:5px;top:15px;width:28px;color:#15171A;font-size:6px', 'F' + (i + 1));
      mk(k2._f, 'left:6px;top:25px;width:20px;height:20px;border-radius:50%;background:repeating-conic-gradient(from -120deg,#e9ebeb 0 1.5deg,#2b2e32 0 9deg);box-shadow:0 0 0 1px #0d0f10');
      mk(k2._f, 'left:9px;top:28px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle,#4a5157 0 35%,#d8dcdd 37% 60%,#8d9499 62%)');
      var optr = mk(k2._f, 'left:15px;top:27px;width:2px;height:9px;background:#d33a2c;border-radius:1px;transform-origin:50% 9px;transition:transform .25s');
      mk(k2._f, 'left:28px;top:26px;width:7px;height:7px;border-radius:50%;background:#8d9499;box-shadow:0 0 0 1px #0d0f10');
      mk(k2._f, 'left:28px;top:36px;width:7px;height:7px;border-radius:50%;background:#e9ebeb;box-shadow:0 0 0 1px #0d0f10');
      var obar = mk(k2._f, 'left:7px;top:48px;width:24px;height:6px;background:#a8453d;border-radius:1px;transition:background .2s,box-shadow .2s');
      k2._f.classList.add('play');
      devs.ov.push({ f: k2._f, ptr: optr, bar: obar });
      add(k2, 4, [0, 0, 14], [rnd(seq) * 70, rnd(seq + 1) * 40, 80 + (i % 3) * 24], [rnd(seq + 2) * 50, rnd(seq + 3) * 60, rnd(seq + 4) * 50]);
      seq += 5;
    }
    var plc = cube(scene, 158, 212, 80, 68, 30, '#3a4046', '#16181b', '#4c545b');
    var lcdbox = mk(plc._f, 'left:6px;top:6px;width:68px;height:22px;background:#0c2210;border:2px solid #1b1e21;box-shadow:inset 0 0 6px #000;transition:background .2s');
    plc._f.classList.add('play');
    for (j = 0; j < 4; j++) mk(plc._f, 'left:' + (11 + j * 15) + 'px;top:' + (11 + (j % 2) * 7) + 'px;width:' + (10 + (j % 3) * 4) + 'px;height:2px;background:#7fe05a;opacity:.85', 'lcd');
    txt(plc._f, 'left:6px;top:32px;width:30px;color:#cfd3d4;text-align:left;font-size:7px', 'PLC');
    for (j = 0; j < 8; j++) led(plc._f, 'left:' + (8 + j * 8.5) + 'px;top:44px;width:5px;height:5px', j % 4 === 3 ? '#d8c76a' : '#5be05b');
    for (j = 0; j < 8; j++) mk(plc._f, 'left:' + (7 + j * 8.5) + 'px;bottom:5px;width:7px;height:7px;background:radial-gradient(circle at 35% 35%,#fff,#8d9499);border-radius:1px');
    add(plc, 4, [0, 0, 14], [30, 30, 110], [-20, 25, 15]);
    devs.plc = plc;
    var psu = cube(scene, 242, 212, 30, 68, 30, '#d9dcdd', '#9da3a6', '#eceeee');
    mk(psu._f, 'left:3px;top:6px;width:24px;height:10px;background:#8ABD36');
    var psuKnob = mk(psu._f, 'left:7px;top:24px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle,#777 0 30%,#2b2e32 32%)', 'play');
    var psuPtr = mk(psuKnob, 'left:7px;top:1px;width:2px;height:7px;background:#f3f4f4;transform-origin:50% 7px;transition:transform .2s');
    led(psu._f, 'left:12px;top:46px;width:6px;height:6px', '#5be05b');
    add(psu, 4, [0, 0, 14], [40, -10, 70], [10, 40, 0]);

    // wire duct, terminal strip, PE bar and data plate
    var duct = cube(scene, 28, 292, 244, 18, 20, '#f2f3f3', '#c9cdce', '#fff');
    mk(duct._f, 'inset:5px 4px;background:repeating-linear-gradient(90deg,#9ea4a7 0 10px,#3a3f43 10px 14px);box-shadow:inset 0 2px 3px rgba(0,0,0,.4)');
    for (i = 0; i < 6; i++) mk(duct._f, 'left:' + (14 + i * 40) + 'px;top:' + (i % 2 ? 11 : 3) + 'px;width:3px;height:6px;background:' + ['#8f4a43', '#2b2e31', '#9ba1a4', '#8f4a43', '#c9cdce', '#2b2e31'][i] + ';border-radius:1px');
    devs.duct = duct;
    duct._f.classList.add('play');
    add(duct, 5, [0, 0, 14], [0, -40, 110], [0, 0, 8]);
    var term = cube(scene, 28, 318, 244, 30, 24, '#c9b98e', '#8a7d58', '#e0d3a8');
    var tc = ['#9a8a5e', '#9a8a5e', '#9a8a5e', '#7a8288', '#9a8a5e', '#9a8a5e'];
    for (i = 0; i < 16; i++) {
      var tt = mk(term._f, 'left:' + (6 + i * 15) + 'px;top:6px;width:10px;height:18px;background:' + tc[i % 6] + ';border-radius:2px');
      screw(tt, 'left:2px;top:2px;width:6px;height:6px');
      mk(tt, 'left:2px;top:9px;width:6px;height:3px;background:#2b2e31;border-radius:1px');
      txt(tt, 'left:0;bottom:1px;width:10px;font-size:5px;color:#fff', String(i + 1));
    }
    add(term, 4, [0, 0, 14], [0, 60, 60], [-20, 0, 0]);
    devs.term = term;
    var pe = cube(scene, 28, 354, 244, 10, 12, 'repeating-linear-gradient(90deg,#5b8f55 0 9px,#d6c85a 9px 18px)', '#5b8f55', '#d6c85a');
    for (i = 0; i < 8; i++) mk(pe._f, 'left:' + (14 + i * 30) + 'px;top:2px;width:6px;height:6px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff,#6d7377)');
    add(pe, 5, [0, 0, 14], [0, 80, 40], [10, 0, 0]);
    var np = mk(scene, 'left:28px;top:372px;width:244px;height:28px;background:linear-gradient(#e2e5e6,#b9bec0);border:1px solid #8d9499;border-radius:2px', 'part');
    mk(np, 'right:6px;top:6px;width:108px;height:14px;color:#2a2d31;font:700 8px/14px Arial,sans-serif;direction:rtl;text-align:right').appendChild(document.createTextNode('גוסטב את סער'));
    mk(np, 'right:6px;top:15px;width:140px;height:10px;color:#4d5357;font:6px/10px Arial,sans-serif;direction:rtl;text-align:right').appendChild(document.createTextNode('לוח חשמל · תכנון, ייצור, בדיקה'));
    mk(np, 'left:6px;top:4px;width:20px;height:20px;background:conic-gradient(#222 25%,#fff 0 50%,#222 0 75%,#fff 0) 0 0/6px 6px');
    add(np, 5, [0, 0, 12], [0, 100, 30], [0, 0, -4]);
    // loose looms behind the devices (so they only peek out between them)
    [[46, '#8f4a43'], [78, '#6d7377'], [110, '#8f4a43'], [143, '#2b2e31'], [176, '#c9cdce'], [208, '#6d7377'], [240, '#8f4a43']].forEach(function (w, wi) {
      var wr = mk(scene, 'left:' + w[0] + 'px;top:90px;width:2px;height:230px;background:' + w[1] + ';border-radius:2px;box-shadow:0 0 0 .5px rgba(0,0,0,.35)', 'part');
      add(wr, 5, [0, 0, 10], [(wi - 3) * 34, 10, 60 + (wi % 4) * 14], [0, 0, (wi - 3) * 8]);
    });
    // neat jumpers: contactor -> overload relay -> terminal strip, in phase colours
    var phase = ['#6b5a4d', '#2b2e31', '#9ba1a4'];
    [0, 1, 2].forEach(function (ci) {
      [0, 1, 2].forEach(function (pj) {
        var jx = 28 + ci * 42 + 8.5 + pj * 11;
        [[183, 218], [270, 326]].forEach(function (seg) {
          var jw = mk(scene, 'left:' + jx + 'px;top:' + seg[0] + 'px;width:2.5px;height:' + (seg[1] - seg[0]) + 'px;background:linear-gradient(90deg,' + phase[pj] + ',#ffffff55 50%,' + phase[pj] + ');border-radius:1px;box-shadow:0 0 0 .5px rgba(0,0,0,.45)', 'part');
          add(jw, 5, [0, 0, 47], [rnd(seq) * 30, 24, 60 + pj * 10], [0, 0, rnd(seq + 1) * 12]);
          seq += 2;
        });
      });
    });
    // door: hinged on the right edge, standing open; its inner face carries the controls
    var door = mk(scene, 'left:0;top:0;width:' + W + 'px;height:' + H + 'px', 'part');
    var outer = mk(door, 'inset:0;background:linear-gradient(90deg,#e6e8e8,#cfd3d4);border:1px solid #a9aeb0;backface-visibility:hidden');
    mk(outer, 'left:30px;bottom:30px;width:240px;height:44px;background:repeating-linear-gradient(0deg,#8d9499 0 3px,#dfe2e3 3px 9px)');
    mk(outer, 'left:112px;top:40px;width:76px;height:66px;background:#cfc25a;clip-path:polygon(50% 0,100% 100%,0 100%)');
    txt(outer, 'left:112px;top:70px;width:76px;font-size:30px;color:#15171A', '⚡');
    var inner = mk(door, 'inset:0;background:#dcdfdf;border:1px solid #a9aeb0;box-shadow:inset 0 0 0 6px #eceeee;transform:rotateY(180deg);backface-visibility:hidden');
    inner.classList.add('door-in');
    outer.classList.add('door-out');
    var dpart = function (el, st, z) { pop(el, st, z || 50, 0.6); return el; };
    // nameplate
    var head = mk(inner, 'left:20px;top:22px;width:260px;height:26px;background:#1b1e21;border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,.35)');
    mk(head, 'inset:0;color:#A6E44A;font:700 14px/26px Arial,sans-serif;direction:rtl;text-align:center;letter-spacing:.5px').appendChild(document.createTextNode('גוסטב את סער'));
    dpart(head, 2);
    // HMI screen with live bars
    var hmi = mk(inner, 'left:22px;top:72px;width:256px;height:78px;background:#0a180d;border:5px solid #2b2f33;border-radius:5px;box-shadow:inset 0 0 12px #000,0 2px 4px rgba(0,0,0,.4);overflow:hidden', 'play');
    for (i = 0; i < 16; i++) {
      var hb = mk(hmi, 'left:' + (10 + i * 14.5) + 'px;bottom:6px;width:9px;height:' + (20 + Math.abs(rnd(i + 40)) * 80) + 'px;max-height:50px;background:linear-gradient(#b8ff7a,#3d8f1e);transform-origin:50% 100%;animation-delay:' + (-i * 0.23).toFixed(2) + 's', 'hbar');
    }
    mk(hmi, 'left:8px;top:6px;width:90px;height:3px;background:#7fe05a;opacity:.7');
    mk(hmi, 'left:8px;top:13px;width:56px;height:3px;background:#7fe05a;opacity:.45');
    mk(hmi, 'inset:0;background:linear-gradient(115deg,rgba(255,255,255,.2) 0,rgba(255,255,255,0) 38%);pointer-events:none');
    dpart(hmi, 3, 70);
    // two analogue meters
    var gauge = function (x, y, label, phase) {
      var g = mk(inner, 'left:' + x + 'px;top:' + y + 'px;width:78px;height:78px;border-radius:50%;background:radial-gradient(circle,#fff 0 60%,#e6e8e8);border:5px solid #25282b;box-shadow:0 3px 5px rgba(0,0,0,.4),inset 0 0 6px rgba(0,0,0,.25);box-sizing:border-box');
      mk(g, 'inset:4px;border-radius:50%;background:conic-gradient(from -115deg,#6fae45 0 105deg,#cfc26a 0 150deg,#c4584e 0 230deg,transparent 0);-webkit-mask:radial-gradient(circle,transparent 0 62%,#000 64%);mask:radial-gradient(circle,transparent 0 62%,#000 64%)');
      mk(g, 'inset:9px;border-radius:50%;background:repeating-conic-gradient(from -115deg,#15171A 0 1.2deg,transparent 0 11.5deg);-webkit-mask:radial-gradient(circle,transparent 0 78%,#000 80%);mask:radial-gradient(circle,transparent 0 78%,#000 80%);clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,0 100%)');
      var nd = mk(g, 'left:32px;top:8px;width:2px;height:27px;background:#d33a2c;transform-origin:50% 100%;border-radius:1px;animation-delay:' + phase + 's', 'needle');
      g.classList.add('play');
      devs.gauge.push({ g: g, n: nd });
      mk(g, 'left:29px;top:32px;width:8px;height:8px;border-radius:50%;background:#25282b');
      txt(g, 'left:0;bottom:7px;width:68px;font-size:10px;color:#15171A', label);
      mk(g, 'inset:0;border-radius:50%;background:radial-gradient(ellipse at 30% 22%,rgba(255,255,255,.55),rgba(255,255,255,0) 45%);pointer-events:none');
      return dpart(g, 3, 60);
    };
    gauge(30, 190, 'A', 0);
    gauge(122, 190, 'V', -1.3);
    // emergency stop
    var es = mk(inner, 'left:214px;top:193px;width:72px;height:72px;border-radius:50%;background:radial-gradient(circle,#cfc25a 0 60%,#a99f3e);box-shadow:0 3px 5px rgba(0,0,0,.45)');
    var mush = mk(es, 'left:10px;top:8px;width:52px;height:52px;border-radius:50%;background:radial-gradient(circle at 38% 32%,#ff9b8f,#e0291c 45%,#8f130a);box-shadow:0 5px 5px rgba(0,0,0,.5);transition:transform .15s,box-shadow .15s', 'play');
    dpart(es, 4, 95);
    // selector switches and push buttons
    var knob = function (x, y) {
      var kn = mk(inner, 'left:' + x + 'px;top:' + y + 'px;width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 38% 32%,#4a5157,#15171A);box-shadow:0 3px 4px rgba(0,0,0,.5),0 0 0 4px #b9bec0', 'play');
      var ptr = mk(kn, 'left:17px;top:3px;width:4px;height:16px;background:#f3f4f4;border-radius:2px;transform-origin:50% 16px;transition:transform .2s');
      dpart(kn, 3, 75);
      return ptr;
    };
    var knobA = knob(34, 308), knobB = knob(88, 308);
    // three pilot lamps
    var lamps = [];
    ['#8ee05a', '#d9625a', '#d8c76a'].forEach(function (c, li) {
      var lp = mk(inner, 'left:' + (160 + li * 42) + 'px;top:313px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff 0,' + c + ' 45%,#222 130%);color:' + c + ';box-shadow:0 0 0 4px #2b2f33,0 3px 5px rgba(0,0,0,.45);animation-delay:' + (-li * .7) + 's', 'led lamp');
      dpart(lp, 2, 70);
      lamps.push(lp);
    });
    var dd = mk(inner, 'left:6px;top:190px;width:16px;height:46px;background:#9da3a6;border-radius:4px', 'play');
    mk(outer, 'left:14px;top:190px;width:12px;height:40px;background:linear-gradient(90deg,#6d7377,#c4c9cb,#6d7377);border-radius:4px;box-shadow:0 2px 3px rgba(0,0,0,.4)');
    outer.classList.add('play');
    pop(dd, 2, 60, 0.5);
    mk(door, 'left:-3px;top:0;width:6px;height:' + H + 'px;background:linear-gradient(90deg,#8d9499,#d4d8d9);transform:translateZ(-3px) rotateY(90deg)');
    [40, 190, 340].forEach(function (hy) {
      var hg = mk(scene, 'left:' + (W - 2) + 'px;top:' + hy + 'px;width:9px;height:30px;border-radius:3px;background:linear-gradient(90deg,#6d7377,#e2e5e6 45%,#6d7377);box-shadow:0 1px 2px rgba(0,0,0,.5)', 'part');
      add(hg, 0, [0, 0, D - 2], [30, 0, 60], [0, 0, 0]);
    });
    add(door, 0, [0, 0, D], [20, 0, 60], [0, 18, 0], '100% 50%');
    door.dataset.open = '1';

    // play: breakers, main switch, emergency stop and selector knobs actually do something
    var ps = { main: true, stop: false, mcb: devs.tog.map(function () { return true; }), ka: 2, kb: 2, con: devs.win.map(function () { return true; }), trip: [false, false, false], plc: 0, psu: 0, view: 0, duct: false };
    var KPOS = [-40, 0, 40];
    var sync = function () {
      var dead = ps.stop || !ps.main;
      ex.classList.toggle('dead', dead);
      ex.classList.toggle('fast', ps.kb === 0);
      mhandle.style.top = ps.main ? '19px' : '29px';
      devs.tog.forEach(function (t, i) { t.style.top = ps.mcb[i] ? MCB_ON : MCB_OFF; });
      devs.led.forEach(function (l, i) { l.classList.toggle('off', dead || !ps.mcb[i]); });
      mush.style.transform = ps.stop ? 'translateY(4px) scale(.93)' : '';
      mush.style.boxShadow = ps.stop ? '0 1px 2px rgba(0,0,0,.5)' : '';
      knobA.style.transform = 'rotate(' + KPOS[ps.ka] + 'deg)';
      knobB.style.transform = 'rotate(' + KPOS[ps.kb] + 'deg)';
      lamps[0].classList.toggle('off', dead);
      lamps[1].classList.toggle('off', !ps.stop);
      lamps[2].classList.toggle('off', ps.ka !== 2 || dead);
      devs.led.forEach(function (l, i) { l.classList.toggle('off', dead || !ps.mcb[i] || !ps.con[i] || !!ps.trip[i]); });
      devs.win.forEach(function (w, i) { w.style.background = (!dead && ps.mcb[i] && ps.con[i] && !ps.trip[i]) ? '#6e767d' : '#2b2e32'; });
      devs.ov.forEach(function (o, i) {
        o.ptr.style.transform = ps.trip[i] ? 'rotate(70deg)' : '';
        o.bar.style.background = ps.trip[i] ? '#ff5a4a' : '#a8453d';
        o.bar.style.boxShadow = ps.trip[i] ? '0 0 8px 2px rgba(255,90,74,.7)' : '';
      });
      var lc = [['#0c2210', '#7fe05a'], ['#0c2210', '#cfd3d4'], ['#a9c98a', '#14301a']][ps.plc];
      lcdbox.style.background = lc[0];
      lcdbox.querySelectorAll('.lcd').forEach(function (l, i) {
        l.style.background = lc[1];
        l.style.width = (ps.plc === 1 ? 52 - i * 9 : 10 + (i % 3) * 4) + 'px';
      });
      psuPtr.style.transform = 'rotate(' + ps.psu * 60 + 'deg)';
      ex.classList.toggle('mono', ps.view === 1);
      ex.classList.toggle('line', ps.view === 2);
      devs.duct._f.style.background = ps.duct ? '#3a3f45' : '#f2f3f3';
      devs.duct._f.firstElementChild.style.opacity = ps.duct ? 0 : 1;
    };
    var press = function (el, fn) {
      el.addEventListener('click', function () { fn(); sync(); });
    };
    press(main._f, function () { ps.main = !ps.main; });
    devs.mcb.forEach(function (m, i) { press(m._f, function () { ps.mcb[i] = !ps.mcb[i]; }); });
    press(mush, function () { ps.stop = !ps.stop; });
    press(knobA.parentNode, function () { ps.ka = (ps.ka + 1) % 3; });
    press(knobB.parentNode, function () { ps.kb = (ps.kb + 1) % 3; });
    devs.con.forEach(function (k, i) { press(k._f, function () { ps.con[i] = !ps.con[i]; }); });
    devs.ov.forEach(function (o, i) { press(o.f, function () { ps.trip[i] = !ps.trip[i]; }); });
    press(plc._f, function () { ps.plc = (ps.plc + 1) % 3; });
    press(psuKnob, function () { ps.psu = (ps.psu + 1) % 6; });
    press(hmi, function () { ps.view = (ps.view + 1) % 3; });
    press(devs.duct._f, function () { ps.duct = !ps.duct; });
    devs.gauge.forEach(function (o) {
      press(o.g, function () {
        o.n.style.animation = 'needleKick .9s ease-out';
        setTimeout(function () { o.n.style.animation = ''; }, 900);
      });
    });
    press(dd, function () { dt = 0; kick(); });
    inner.classList.add('play-bg');
    inner.addEventListener('click', function (e) { if (e.target === inner) { dt = 0; kick(); } });
    press(outer, function () { dt = dt ? 0 : 105; kick(); });
    sync();

    var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cur = still ? 0 : 1, raf = 0, tiltX = 0, tiltY = 0, tiltTX = 0, tiltTY = 0, held = false;
    var smooth = function (t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
    var da = 105, dt = 105;
    var paint = function (p) {
      scene.style.transform = 'rotateX(' + (-5 + tiltY * 2) + 'deg) rotateY(' + (20 - smooth(p) * 14 + tiltX * 6) + 'deg)';
      ex.classList.toggle('on', p < 0.08);
      parts.forEach(function (o) {
        var q = smooth(p * 1.6 - o.st * 0.09);
        o.el.style.transformOrigin = o.o;
        var ry = o.r[1] * q + (o.el === door ? da : 0);
        o.el.style.transform = 'translate3d(' + (o.b[0] + o.e[0] * q) + 'px,' + (o.b[1] + o.e[1] * q) + 'px,' + (o.b[2] + o.e[2] * q) + 'px) rotateX(' + o.r[0] * q + 'deg) rotateY(' + ry + 'deg) rotateZ(' + o.r[2] * q + 'deg)';
      });
    };
    // fully apart at the edges of the viewport, assembled when the panel sits in the middle
    var tick = function () {
      var rect = ex.getBoundingClientRect(), vh = window.innerHeight;
      var d = Math.abs(rect.top + rect.height / 2 - vh / 2) / vh;
      var target = smooth((d - 0.06) / 0.4);
      cur += (target - cur) * 0.12;
      da += (dt - da) * 0.14;
      tiltX += (tiltTX - tiltX) * 0.1;
      tiltY += (tiltTY - tiltY) * 0.1;
      if (calm()) { cur = 0; tiltX = tiltY = 0; da = dt; paint(0); raf = 0; return; }
      paint(cur);
      raf = Math.abs(target - cur) > 0.002 || Math.abs(dt - da) > 0.2 || Math.abs(tiltTX - tiltX) > 0.002 || Math.abs(tiltTY - tiltY) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    var calm = function () { return still || document.documentElement.classList.contains('a11y-motion'); };
    var kick = function () { if (!raf && !calm()) raf = requestAnimationFrame(tick); };
    paint(cur);
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    // gentle parallax: the panel turns towards the pointer
    // hold the tilt while the pointer rests on a part, so a click lands where it was aimed
    ex.addEventListener('pointerdown', function () { tiltTX = tiltX; tiltTY = tiltY; held = true; });
    ex.addEventListener('pointerup', function () { setTimeout(function () { held = false; }, 250); });
    ex.addEventListener('pointermove', function (e) {
      if (held) return;
      var r = ex.getBoundingClientRect();
      tiltTX = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
      tiltTY = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
      kick();
    });
    ex.addEventListener('pointerleave', function () { tiltTX = tiltTY = 0; kick(); });
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
