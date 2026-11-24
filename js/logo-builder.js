/* NYC.exe — Logo Builder (Yankees interlocking NY) */
(function () {
  const SHAPES = {"ref":{"w":506,"h":498},"N":{"d":"M47.00,3.83 L3.83,44.00 L24.50,72.00 L36.17,92.00 L44.50,114.00 L50.50,144.00 L52.50,185.00 L48.50,215.00 L44.17,232.00 L30.17,270.00 L10.50,308.00 L15.50,318.00 L47.50,358.00 L55.00,365.17 L64.17,350.00 L78.17,317.00 L90.50,275.00 L96.50,243.00 L100.50,204.00 L100.50,160.00 L98.50,150.00 L98.50,141.00 L100.00,139.50 L174.00,207.50 L180.17,214.00 L181.50,221.00 L219.00,257.50 L224.00,258.83 L232.00,265.50 L351.00,373.17 L366.00,359.50 L380.00,349.50 L384.83,344.00 L384.83,342.00 L367.17,310.00 L358.50,286.00 L354.50,269.00 L350.50,243.00 L348.50,213.00 L348.50,180.00 L350.50,159.00 L358.50,124.00 L368.83,95.00 L384.17,64.00 L400.17,39.00 L399.50,37.00 L382.00,19.50 L363.00,3.83 L353.50,14.00 L342.83,30.00 L325.17,66.00 L310.50,113.00 L302.50,163.00 L301.50,218.00 L302.50,240.00 L306.50,265.00 L305.00,268.17 L224.00,195.50 L217.50,186.00 L178.00,149.50 L168.00,140.50 L162.00,138.50 L150.00,127.50 L109.50,87.00 L89.50,63.00 L48.00,3.83 L47.00,3.83 Z","vb":[0,0,405,378],"origin":[202.5,189.0],"refOrigin":[249.5,295.0]},"Y":{"d":"M205.00,3.83 L203.50,5.00 L197.50,31.00 L177.17,91.00 L149.17,161.00 L134.00,191.50 L132.00,190.75 L126.17,180.00 L103.83,130.00 L77.83,61.00 L59.00,5.25 L56.00,5.50 L3.50,60.00 L32.50,98.00 L59.83,142.00 L81.17,182.00 L95.50,218.00 L93.50,227.00 L101.50,286.00 L111.50,297.00 L111.50,414.00 L105.50,442.00 L98.25,460.00 L170.00,459.50 L171.17,458.00 L162.17,442.00 L155.50,413.00 L152.50,342.00 L155.50,339.00 L160.50,283.00 L150.17,272.00 L149.50,258.00 L171.83,203.00 L205.83,135.00 L230.50,94.00 L244.50,75.00 L257.50,61.00 L205.25,4.00 L205.00,3.83 Z","vb":[0,0,262,465],"origin":[131.0,232.5],"refOrigin":[247.0,256.5]}};

  const root = document.getElementById("logogame");
  if (!root) return;

  const NAVY = "#172446";
  const TARGET = 250;

  const pieces = {
    N: {
      id: "N",
      x: 0, y: 0, s: 0.4, r: 0,
      d: SHAPES.N.d,
      vb: SHAPES.N.vb,
      origin: SHAPES.N.origin,
      refOrigin: SHAPES.N.refOrigin
    },
    Y: {
      id: "Y",
      x: 0, y: 0, s: 0.4, r: 0,
      d: SHAPES.Y.d,
      vb: SHAPES.Y.vb,
      origin: SHAPES.Y.origin,
      refOrigin: SHAPES.Y.refOrigin
    }
  };

  let selected = null;
  let locked = false;
  let drag = null; // {mode, id, ox, oy, startX, startY, startS, startR, ang0}

  const els = {};

  function angDiff(a, b) {
    let d = ((a - b + 180) % 360 + 360) % 360 - 180;
    return Math.abs(d);
  }
  function circMean(a, b) {
    const r1 = a * Math.PI / 180, r2 = b * Math.PI / 180;
    return Math.atan2(Math.sin(r1) + Math.sin(r2), Math.cos(r1) + Math.cos(r2)) * 180 / Math.PI;
  }
  function gauss(err, sigma) {
    return Math.exp(-((err / sigma) * (err / sigma)));
  }

  function scorePair(n, y) {
    const nS = Math.max(0.001, n.s), yS = Math.max(0.001, y.s);
    const ratioErr = Math.abs(nS / yS - 1);
    const ratioScore = gauss(ratioErr, 0.18);

    const relErr = angDiff(n.r, y.r);
    const relScore = gauss(relErr, 18);

    const mean = circMean(n.r, y.r);
    const upErr = Math.abs(mean);
    const upScore = gauss(upErr, 18);

    const dx = y.x - n.x, dy = y.y - n.y;
    const cr = Math.cos(n.r * Math.PI / 180), sr = Math.sin(n.r * Math.PI / 180);
    const ax = (cr * dx + sr * dy) / nS;
    const ay = (-sr * dx + cr * dy) / nS;
    const ex = y.refOrigin[0] - n.refOrigin[0];
    const ey = y.refOrigin[1] - n.refOrigin[1];
    const posErr = Math.hypot(ax - ex, ay - ey);
    const posScore = gauss(posErr, 22);

    const total = 100 * (0.25 * ratioScore + 0.30 * posScore + 0.25 * relScore + 0.20 * upScore);
    return {
      total: Math.max(0, Math.min(100, total)),
      ratio: ratioScore, pos: posScore, rel: relScore, up: upScore,
      posErr: posErr, relErr: relErr, upErr: upErr, ratioErr: ratioErr
    };
  }

  function verdict(pct) {
    if (pct >= 97) return "Stadium official. They’d sell this behind home plate.";
    if (pct >= 90) return "Gift shop material. Not the dugout, but nobody’s asking for a receipt.";
    if (pct >= 80) return "Almost. A tourist would buy it. A season-ticket holder would squint.";
    if (pct >= 65) return "Canal Street, mid-block. The letters know each other, they just aren’t married.";
    if (pct >= 45) return "Canal Street, under the table. That’s an NY if you already knew it was one.";
    if (pct >= 25) return "Two letters having an argument on the 4 train. Not interlocking.";
    return "I’ve seen better NYs on a bootleg umbrella in the rain.";
  }

  /* ——— layout ——— */
  function render() {
    root.innerHTML = "";
    root.className = "logogame";

    const top = document.createElement("div");
    top.className = "lg-top";
    top.innerHTML = '<div class="lg-q">Put the interlocking NY back together.</div>';
    root.appendChild(top);

    const board = document.createElement("div");
    board.className = "lg-board";
    board.tabIndex = 0;
    els.board = board;

    const target = document.createElement("div");
    target.className = "lg-target";
    target.setAttribute("aria-hidden", "true");
    board.appendChild(target);
    els.target = target;

    const handles = document.createElement("div");
    handles.className = "lg-handles";
    board.appendChild(handles);
    els.handles = handles;

    ["N", "Y"].forEach(function (id) {
      const p = pieces[id];
      const el = document.createElement("div");
      el.className = "lg-piece";
      el.dataset.id = id;
      el.innerHTML =
        '<div class="lg-spin">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + p.vb[2] + ' ' + p.vb[3] +
          '" width="' + p.vb[2] + '" height="' + p.vb[3] + '">' +
          '<path d="' + p.d + '" fill="#ffffff"></path></svg>' +
        "</div>";
      board.appendChild(el);
      els[id] = el;
      el.addEventListener("pointerdown", onPieceDown);
    });

    board.addEventListener("pointerdown", function (e) {
      if (e.target === board || e.target === els.target) {
        if (!locked) select(null);
      }
    });
    root.appendChild(board);

    const tools = document.createElement("div");
    tools.className = "lg-tools";
    tools.innerHTML =
      '<label class="lg-scale">Rotate <input id="lg-rot" type="range" min="-180" max="180" step="0.1" value="0" disabled> <span id="lg-rotv">0.0°</span></label>' +
      '<label class="lg-scale">Scale <input id="lg-scl" type="range" min="0.15" max="1.6" step="0.005" value="0.4" disabled> <span id="lg-sclv">0.40</span></label>' +
      '<button type="button" class="btn" id="lg-check">Check</button>' +
      '<button type="button" class="btn" id="lg-again" hidden>Try again</button>';
    root.appendChild(tools);

    els.rot = tools.querySelector("#lg-rot");
    els.rotv = tools.querySelector("#lg-rotv");
    els.scl = tools.querySelector("#lg-scl");
    els.sclv = tools.querySelector("#lg-sclv");
    els.check = tools.querySelector("#lg-check");
    els.again = tools.querySelector("#lg-again");

    els.rot.addEventListener("input", function () {
      if (!selected || locked) return;
      pieces[selected].r = parseFloat(els.rot.value);
      els.rotv.textContent = pieces[selected].r.toFixed(1) + "°";
      paint();
    });
    els.scl.addEventListener("input", function () {
      if (!selected || locked) return;
      pieces[selected].s = parseFloat(els.scl.value);
      els.sclv.textContent = pieces[selected].s.toFixed(2);
      paint();
    });
    els.check.addEventListener("click", onCheck);
    els.again.addEventListener("click", function () {
      scramble();
    });

    const fb = document.createElement("div");
    fb.className = "lg-fb";
    fb.id = "lg-fb";
    root.appendChild(fb);
    els.fb = fb;

    const compare = document.createElement("div");
    compare.className = "lg-compare";
    compare.hidden = true;
    compare.classList.remove('show');
    compare.innerHTML =
      '<div class="lg-pane"><div class="lg-pane-h">Yours</div><div class="lg-mini" id="lg-yours"></div></div>' +
      '<div class="lg-pane"><div class="lg-pane-h">The real one</div><div class="lg-mini" id="lg-real"></div></div>';
    root.appendChild(compare);
    els.compare = compare;
    els.yours = compare.querySelector("#lg-yours");
    els.real = compare.querySelector("#lg-real");

    board.addEventListener("pointermove", onMove);
    board.addEventListener("pointerup", onUp);
    board.addEventListener("pointercancel", onUp);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

  function boardPoint(e) {
    const r = els.board.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
  }

  function paint() {
    const br = els.board.getBoundingClientRect();
    ["N", "Y"].forEach(function (id) {
      const p = pieces[id], el = els[id];
      el.style.left = p.x + "px";
      el.style.top = p.y + "px";
      el.classList.toggle("on", selected === id && !locked);
      const spin = el.querySelector(".lg-spin");
      spin.style.transform =
        "translate(-50%, -50%) rotate(" + p.r + "deg) scale(" + p.s + ")";
    });
    paintHandles();
    if (selected && !locked) {
      els.rot.disabled = false;
      els.scl.disabled = false;
      els.rot.value = clamp(pieces[selected].r, -180, 180);
      els.scl.value = clamp(pieces[selected].s, 0.15, 1.6);
      els.rotv.textContent = pieces[selected].r.toFixed(1) + "°";
      els.sclv.textContent = pieces[selected].s.toFixed(2);
    } else {
      els.rot.disabled = true;
      els.scl.disabled = true;
    }
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function paintHandles() {
    const box = els.handles;
    box.innerHTML = "";
    if (!selected || locked) return;
    const p = pieces[selected];
    const w = p.vb[2] * p.s, h = p.vb[3] * p.s;
    const rad = p.r * Math.PI / 180, c = Math.cos(rad), s = Math.sin(rad);
    function at(lx, ly) {
      return { x: p.x + lx * c - ly * s, y: p.y + lx * s + ly * c };
    }
    const corners = [
      at(-w / 2, -h / 2), at(w / 2, -h / 2),
      at(w / 2, h / 2), at(-w / 2, h / 2)
    ];
    corners.forEach(function (pt, i) {
      const d = document.createElement("div");
      d.className = "lg-h lg-h-sc";
      d.style.left = pt.x + "px";
      d.style.top = pt.y + "px";
      d.dataset.mode = "scale";
      d.dataset.corner = String(i);
      d.addEventListener("pointerdown", onHandleDown);
      box.appendChild(d);
    });
    const top = at(0, -h / 2 - 22 / p.s * 0); // 22px in board space, not scaled with letter? use 22 board px along local up
    const rotPt = at(0, -h / 2 - 24);
    const rd = document.createElement("div");
    rd.className = "lg-h lg-h-rot";
    rd.style.left = rotPt.x + "px";
    rd.style.top = rotPt.y + "px";
    rd.dataset.mode = "rotate";
    rd.addEventListener("pointerdown", onHandleDown);
    box.appendChild(rd);
    const line = document.createElement("div");
    line.className = "lg-h-line";
    const mid = at(0, -h / 2);
    const x1 = mid.x, y1 = mid.y, x2 = rotPt.x, y2 = rotPt.y;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    line.style.left = x1 + "px";
    line.style.top = y1 + "px";
    line.style.width = len + "px";
    line.style.transform = "rotate(" + ang + "deg)";
    box.appendChild(line);
  }

  function select(id) {
    selected = id;
    if (id) {
      els.board.appendChild(els[id]); // raise
      els.board.appendChild(els.handles);
    }
    paint();
  }

  function onPieceDown(e) {
    if (locked) return;
    e.preventDefault();
    e.stopPropagation();
    const id = e.currentTarget.dataset.id;
    select(id);
    const pt = boardPoint(e);
    drag = {
      mode: "move",
      id: id,
      dx: pt.x - pieces[id].x,
      dy: pt.y - pieces[id].y,
      pointer: e.pointerId
    };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  }

  function onHandleDown(e) {
    if (locked || !selected) return;
    e.preventDefault();
    e.stopPropagation();
    const pt = boardPoint(e);
    const p = pieces[selected];
    drag = {
      mode: e.currentTarget.dataset.mode,
      id: selected,
      startX: pt.x,
      startY: pt.y,
      startS: p.s,
      startR: p.r,
      ang0: Math.atan2(pt.y - p.y, pt.x - p.x) * 180 / Math.PI - p.r,
      dist0: Math.hypot(pt.x - p.x, pt.y - p.y) / p.s,
      pointer: e.pointerId
    };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
  }

  function onMove(e) {
    if (!drag || locked) return;
    const pt = boardPoint(e);
    const p = pieces[drag.id];
    if (drag.mode === "move") {
      p.x = pt.x - drag.dx;
      p.y = pt.y - drag.dy;
    } else if (drag.mode === "rotate") {
      const ang = Math.atan2(pt.y - p.y, pt.x - p.x) * 180 / Math.PI;
      p.r = ang - drag.ang0;
      // normalize to -180..180 for the slider
      p.r = ((p.r + 180) % 360 + 360) % 360 - 180;
    } else if (drag.mode === "scale") {
      const dist = Math.hypot(pt.x - p.x, pt.y - p.y);
      p.s = clamp(dist / Math.max(8, drag.dist0), 0.15, 1.6);
    }
    paint();
  }

  function onUp(e) {
    if (!drag) return;
    drag = null;
    paint();
  }

  function scramble(preset) {
    locked = false;
    selected = null;
    els.compare.classList.remove('show');
    els.compare.hidden = true;
    els.fb.innerHTML = "";
    els.check.hidden = false;
    els.again.hidden = true;
    const r = els.board.getBoundingClientRect();
    const w = r.width, h = r.height;
    const cx = w / 2, cy = h / 2;
    if (preset === "start") {
      pieces.N.s = 0.24;
      pieces.N.r = -32;
      pieces.Y.s = 0.22;
      pieces.Y.r = 48;
      var nReach = Math.hypot(pieces.N.vb[2], pieces.N.vb[3]) / 2 * pieces.N.s;
      var yReach = Math.hypot(pieces.Y.vb[2], pieces.Y.vb[3]) / 2 * pieces.Y.s;
      pieces.N.x = Math.max(nReach + 10, (cx - TARGET / 2) / 2);
      pieces.Y.x = Math.min(w - yReach - 10, cx + TARGET / 2 + (w - (cx + TARGET / 2)) / 2);
      pieces.N.y = cy + 36;
      pieces.Y.y = cy - 20;
    } else if (preset === "near") {
      placeCorrect(0.40, 0, cx, cy);
      // nudge: a few degrees, a slight offset, tiny scale mismatch
      pieces.N.r = -2.4;
      pieces.Y.r = 1.8;
      pieces.Y.x += 3;
      pieces.Y.y -= 2;
      pieces.N.s = 0.39;
      pieces.Y.s = 0.41;
    } else {
      // random, clearly outside the square
      const nLeft = Math.random() < 0.5;
      const margin = 70;
      pieces.N.x = nLeft
        ? margin + Math.random() * Math.max(20, cx - TARGET / 2 - margin - 10)
        : w - margin - Math.random() * Math.max(20, cx - TARGET / 2 - margin - 10);
      pieces.Y.x = nLeft
        ? w - margin - Math.random() * Math.max(20, cx - TARGET / 2 - margin - 10)
        : margin + Math.random() * Math.max(20, cx - TARGET / 2 - margin - 10);
      pieces.N.y = 60 + Math.random() * (h - 120);
      pieces.Y.y = 60 + Math.random() * (h - 120);
      // keep them out of the target if they landed inside
      bumpOut(pieces.N, cx, cy, w, h);
      bumpOut(pieces.Y, cx, cy, w, h);
      pieces.N.s = 0.20 + Math.random() * 0.16;
      pieces.Y.s = 0.18 + Math.random() * 0.16;
      // different scales
      if (Math.abs(pieces.N.s - pieces.Y.s) < 0.06) pieces.Y.s = clamp(pieces.Y.s + 0.10, 0.18, 0.40);
      pieces.N.r = Math.random() * 360 - 180;
      pieces.Y.r = Math.random() * 360 - 180;
    }
    paint();
  }

  function bumpOut(p, cx, cy, w, h) {
    const half = TARGET / 2 + 8;
    if (Math.abs(p.x - cx) < half && Math.abs(p.y - cy) < half) {
      // push horizontally toward the nearer side
      p.x = p.x < cx ? cx - half - 30 : cx + half + 30;
      p.x = clamp(p.x, 40, w - 40);
    }
  }

  function placeCorrect(s, r, cx, cy) {
    // Place the pair upright (or rotated by r) centered on (cx,cy) at scale s.
    // Logo ref center ≈ average of ref origins? Better: bounding box of both.
    const nO = pieces.N.refOrigin, yO = pieces.Y.refOrigin;
    // Use the reference image center (W/2, H/2) as logo center
    const lx = SHAPES.ref.w / 2, ly = SHAPES.ref.h / 2;
    const rad = r * Math.PI / 180, c = Math.cos(rad), sn = Math.sin(rad);
    function pos(ref) {
      const dx = (ref[0] - lx) * s, dy = (ref[1] - ly) * s;
      return { x: cx + dx * c - dy * sn, y: cy + dx * sn + dy * c };
    }
    const pn = pos(nO), py = pos(yO);
    pieces.N.x = pn.x; pieces.N.y = pn.y; pieces.N.s = s; pieces.N.r = r;
    pieces.Y.x = py.x; pieces.Y.y = py.y; pieces.Y.s = s; pieces.Y.r = r;
  }

  function onCheck() {
    const sc = scorePair(pieces.N, pieces.Y);
    const pct = Math.round(sc.total);
    locked = true;
    selected = null;
    drag = null;
    els.check.hidden = true;
    els.again.hidden = false;
    els.fb.innerHTML =
      '<div class="lg-score">' + pct + "%</div>" +
      '<div class="lg-verdict">' + verdict(sc.total) + "</div>";
    els.compare.classList.add('show');
    els.compare.hidden = false;
    drawCompare();
    paint();
  }

  function drawCompare() {
    const W = 200, H = 200;
    function pane(host, n, y, official) {
      host.innerHTML = "";
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "180");
      const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bg.setAttribute("width", W); bg.setAttribute("height", H);
      bg.setAttribute("fill", NAVY);
      svg.appendChild(bg);

      let np = { x: n.x, y: n.y, s: n.s, r: n.r, d: n.d, vb: n.vb, origin: n.origin, refOrigin: n.refOrigin };
      let yp = { x: y.x, y: y.y, s: y.s, r: y.r, d: y.d, vb: y.vb, origin: y.origin, refOrigin: y.refOrigin };
      if (official) {
        // official upright, same overall size as the player's average scale, centered
        const s = (n.s + y.s) / 2;
        const tmpN = { x: 0, y: 0, s: s, r: 0, refOrigin: n.refOrigin };
        const tmpY = { x: 0, y: 0, s: s, r: 0, refOrigin: y.refOrigin };
        // reuse placeCorrect math into temps
        const lx = SHAPES.ref.w / 2, ly = SHAPES.ref.h / 2;
        tmpN.x = (n.refOrigin[0] - lx) * s;
        tmpN.y = (n.refOrigin[1] - ly) * s;
        tmpY.x = (y.refOrigin[0] - lx) * s;
        tmpY.y = (y.refOrigin[1] - ly) * s;
        np = Object.assign({}, n, tmpN, { r: 0, s: s });
        yp = Object.assign({}, y, tmpY, { r: 0, s: s });
      }
      // fit both into the pane
      function corners(p) {
        const rad = p.r * Math.PI / 180, c = Math.cos(rad), sn = Math.sin(rad);
        const w = p.vb[2] * p.s, h = p.vb[3] * p.s;
        const pts = [[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]];
        return pts.map(function (q) {
          return [p.x + q[0]*c - q[1]*sn, p.y + q[0]*sn + q[1]*c];
        });
      }
      const pts = corners(np).concat(corners(yp));
      let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
      pts.forEach(function (q) {
        if (q[0] < minx) minx = q[0];
        if (q[1] < miny) miny = q[1];
        if (q[0] > maxx) maxx = q[0];
        if (q[1] > maxy) maxy = q[1];
      });
      const pad = 12;
      const bw = Math.max(40, maxx - minx), bh = Math.max(40, maxy - miny);
      const sc = Math.min((W - pad * 2) / bw, (H - pad * 2) / bh);
      const ox = (W - bw * sc) / 2 - minx * sc;
      const oy = (H - bh * sc) / 2 - miny * sc;

      function drawPiece(p) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        // board (x,y) is origin (bbox center). SVG local origin is 0,0 of viewBox, origin at p.origin
        const t =
          "translate(" + (p.x * sc + ox) + "," + (p.y * sc + oy) + ") " +
          "rotate(" + p.r + ") scale(" + (p.s * sc) + ") " +
          "translate(" + (-p.origin[0]) + "," + (-p.origin[1]) + ")";
        g.setAttribute("transform", t);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", p.d);
        path.setAttribute("fill", "#ffffff");
        g.appendChild(path);
        svg.appendChild(g);
      }
      drawPiece(np);
      drawPiece(yp);
      host.appendChild(svg);
    }
    pane(els.yours, pieces.N, pieces.Y, false);
    pane(els.real, pieces.N, pieces.Y, true);
  }

  /* ——— numeric tests ——— */
  function runTests() {
    const n0 = { x: 200, y: 200, s: 0.5, r: 0, refOrigin: pieces.N.refOrigin };
    const y0 = {
      x: 200 + 0.5 * (pieces.Y.refOrigin[0] - pieces.N.refOrigin[0]),
      y: 200 + 0.5 * (pieces.Y.refOrigin[1] - pieces.N.refOrigin[1]),
      s: 0.5, r: 0, refOrigin: pieces.Y.refOrigin
    };
    const perfect = scorePair(n0, y0);
    // translated + uniformly scaled + still upright
    const n1 = { x: 410, y: 80, s: 0.31, r: 0, refOrigin: pieces.N.refOrigin };
    const y1 = {
      x: 410 + 0.31 * (pieces.Y.refOrigin[0] - pieces.N.refOrigin[0]),
      y: 80 + 0.31 * (pieces.Y.refOrigin[1] - pieces.N.refOrigin[1]),
      s: 0.31, r: 0, refOrigin: pieces.Y.refOrigin
    };
    const moved = scorePair(n1, y1);
    // whole logo rotated 90° (relatively correct, not upright)
    const r = 90, rad = r * Math.PI / 180, c = Math.cos(rad), sn = Math.sin(rad);
    const ex = pieces.Y.refOrigin[0] - pieces.N.refOrigin[0];
    const ey = pieces.Y.refOrigin[1] - pieces.N.refOrigin[1];
    const n2 = { x: 200, y: 200, s: 0.5, r: r, refOrigin: pieces.N.refOrigin };
    const y2 = {
      x: 200 + 0.5 * (ex * c - ey * sn),
      y: 200 + 0.5 * (ex * sn + ey * c),
      s: 0.5, r: r, refOrigin: pieces.Y.refOrigin
    };
    const sideways = scorePair(n2, y2);
    // random
    let randSum = 0, randMin = 100, randMax = 0;
    for (let i = 0; i < 40; i++) {
      const nr = {
        x: Math.random() * 500, y: Math.random() * 400,
        s: 0.2 + Math.random() * 0.9, r: Math.random() * 360 - 180,
        refOrigin: pieces.N.refOrigin
      };
      const yr = {
        x: Math.random() * 500, y: Math.random() * 400,
        s: 0.2 + Math.random() * 0.9, r: Math.random() * 360 - 180,
        refOrigin: pieces.Y.refOrigin
      };
      const sc = scorePair(nr, yr).total;
      randSum += sc;
      if (sc < randMin) randMin = sc;
      if (sc > randMax) randMax = sc;
    }
    const out = {
      perfect: +perfect.total.toFixed(2),
      moved: +moved.total.toFixed(2),
      sideways: +sideways.total.toFixed(2),
      randomAvg: +(randSum / 40).toFixed(2),
      randomMin: +randMin.toFixed(2),
      randomMax: +randMax.toFixed(2)
    };
    console.log("logo-builder score tests", out);
    return out;
  }

  render();
  const params = new URLSearchParams(location.search);
  const shot = params.get("shot");
  // wait a frame so the board has a size
  requestAnimationFrame(function () {
    if (shot === "1") scramble("start");
    else if (shot === "2") {
      scramble("near");
      onCheck();
    } else {
      scramble();
    }
    const tests = runTests();
    window.__logoTests = tests;
  });
})();
