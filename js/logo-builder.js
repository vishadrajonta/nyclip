(function () {
  var root = document.getElementById("logogame");
  if (!root) return;

  var BOARD_W = 640;
  var BOARD_H = 380;
  var CX = 320;
  var CY = 192;

  function svg(vb, w, h, inner) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" width="' + w + '" height="' + h + '" aria-hidden="true">' + inner + "</svg>";
  }

  var NY = "#0c2340";
  var METS_B = "#002d72";
  var METS_O = "#ff5910";
  var KNICK_O = "#f58426";
  var KNICK_B = "#006bb6";
  var RNG_B = "#0038a8";
  var RNG_R = "#ce1126";
  var GNT_B = "#0b2265";
  var GNT_R = "#a71930";
  var JET_G = "#125740";

  var TEAMS = [
    {
      id: "yankees",
      name: "New York Yankees",
      pieces: [
        {
          id: "n",
          label: "N",
          w: 86, h: 140,
          tx: CX - 28, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 86 140", 86, 140,
            '<g fill="none" stroke="' + NY + '" stroke-width="14" stroke-linejoin="miter" stroke-linecap="butt">' +
            '<path d="M15 8 L15 132"/>' +
            '<path d="M15 8 L68 132"/>' +
            '<path d="M52 8 L52 132"/>' +
            "</g>")
        },
        {
          id: "y",
          label: "Y",
          w: 86, h: 140,
          tx: CX + 30, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 86 140", 86, 140,
            '<g fill="none" stroke="' + NY + '" stroke-width="14" stroke-linejoin="miter" stroke-linecap="butt">' +
            '<path d="M8 8 L43 70 L78 8"/>' +
            '<path d="M43 70 L43 132"/>' +
            "</g>")
        }
      ]
    },
    {
      id: "mets",
      name: "New York Mets",
      pieces: [
        {
          id: "ball",
          label: "ball",
          w: 188, h: 188,
          tx: CX, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 188 188", 188, 188,
            '<circle cx="94" cy="94" r="88" fill="' + METS_B + '"/>')
        },
        {
          id: "stitches",
          label: "stitches",
          w: 188, h: 188,
          tx: CX, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 188 188", 188, 188,
            '<circle cx="94" cy="94" r="74" fill="none" stroke="' + METS_O + '" stroke-width="5" stroke-dasharray="7 6"/>' +
            '<circle cx="94" cy="94" r="86" fill="none" stroke="' + METS_O + '" stroke-width="6"/>')
        },
        {
          id: "n",
          label: "N",
          w: 70, h: 110,
          tx: CX - 22, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 70 110", 70, 110,
            '<g fill="none" stroke="' + METS_O + '" stroke-width="12">' +
            '<path d="M12 8 L12 102"/><path d="M12 8 L56 102"/><path d="M56 8 L56 102"/>' +
            "</g>")
        },
        {
          id: "y",
          label: "Y",
          w: 70, h: 110,
          tx: CX + 26, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 70 110", 70, 110,
            '<g fill="none" stroke="' + METS_O + '" stroke-width="12">' +
            '<path d="M6 8 L35 54 L64 8"/><path d="M35 54 L35 102"/>' +
            "</g>")
        }
      ]
    },
    {
      id: "knicks",
      name: "New York Knicks",
      pieces: [
        {
          id: "ball",
          label: "ball",
          w: 200, h: 200,
          tx: CX, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 200 200", 200, 200,
            '<circle cx="100" cy="100" r="92" fill="' + KNICK_O + '" stroke="' + KNICK_B + '" stroke-width="6"/>' +
            '<g fill="none" stroke="' + KNICK_B + '" stroke-width="5">' +
            '<path d="M100 8 L100 192"/><path d="M8 100 L192 100"/>' +
            '<path d="M28 28 Q100 70 172 28"/><path d="M28 172 Q100 130 172 172"/>' +
            "</g>")
        },
        {
          id: "ny",
          label: "NEW YORK",
          w: 170, h: 28,
          tx: CX, ty: CY - 28, tr: 0, ts: 1,
          svg: svg("0 0 170 28", 170, 28,
            '<text x="85" y="21" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="16" fill="#fff">NEW YORK</text>')
        },
        {
          id: "knicks",
          label: "KNICKS",
          w: 190, h: 36,
          tx: CX, ty: CY + 10, tr: 0, ts: 1,
          svg: svg("0 0 190 36", 190, 36,
            '<text x="95" y="28" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="26" fill="#fff">KNICKS</text>')
        }
      ]
    },
    {
      id: "rangers",
      name: "New York Rangers",
      pieces: [
        {
          id: "shield",
          label: "shield",
          w: 150, h: 180,
          tx: CX, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 150 180", 150, 180,
            '<path d="M8 18 L142 18 L142 100 Q142 148 75 172 Q8 148 8 100 Z" fill="' + RNG_B + '" stroke="#fff" stroke-width="4"/>')
        },
        {
          id: "stripe",
          label: "stripe",
          w: 168, h: 40,
          tx: CX, ty: CY + 2, tr: -38, ts: 1,
          svg: svg("0 0 168 40", 168, 40,
            '<rect x="2" y="4" width="164" height="32" fill="' + RNG_R + '"/>')
        },
        {
          id: "word",
          label: "RANGERS",
          w: 168, h: 36,
          tx: CX, ty: CY + 2, tr: -38, ts: 1,
          svg: svg("0 0 168 36", 168, 36,
            '<text x="84" y="26" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="20" fill="#fff">RANGERS</text>')
        }
      ]
    },
    {
      id: "giants",
      name: "New York Giants",
      pieces: [
        {
          id: "n",
          label: "n",
          w: 80, h: 100,
          tx: CX - 30, ty: CY - 8, tr: 0, ts: 1,
          svg: svg("0 0 80 100", 80, 100,
            '<text x="40" y="86" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="96" fill="' + GNT_B + '">n</text>')
        },
        {
          id: "y",
          label: "y",
          w: 80, h: 100,
          tx: CX + 32, ty: CY - 8, tr: 0, ts: 1,
          svg: svg("0 0 80 100", 80, 100,
            '<text x="40" y="86" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="96" fill="' + GNT_B + '">y</text>')
        },
        {
          id: "line",
          label: "underline",
          w: 168, h: 16,
          tx: CX, ty: CY + 52, tr: 0, ts: 1,
          svg: svg("0 0 168 16", 168, 16,
            '<rect x="4" y="4" width="160" height="8" fill="' + GNT_R + '"/>')
        }
      ]
    },
    {
      id: "jets",
      name: "New York Jets",
      pieces: [
        {
          id: "oval",
          label: "oval",
          w: 220, h: 130,
          tx: CX, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 220 130", 220, 130,
            '<ellipse cx="110" cy="65" rx="104" ry="58" fill="' + JET_G + '" stroke="#fff" stroke-width="5"/>')
        },
        {
          id: "j",
          label: "J",
          w: 40, h: 56,
          tx: CX - 54, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 40 56", 40, 56,
            '<text x="20" y="44" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-style="italic" font-weight="800" font-size="42" fill="#fff">J</text>')
        },
        {
          id: "e",
          label: "E",
          w: 40, h: 56,
          tx: CX - 18, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 40 56", 40, 56,
            '<text x="20" y="44" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-style="italic" font-weight="800" font-size="42" fill="#fff">E</text>')
        },
        {
          id: "t",
          label: "T",
          w: 40, h: 56,
          tx: CX + 18, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 40 56", 40, 56,
            '<text x="20" y="44" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-style="italic" font-weight="800" font-size="42" fill="#fff">T</text>')
        },
        {
          id: "s",
          label: "S",
          w: 40, h: 56,
          tx: CX + 54, ty: CY, tr: 0, ts: 1,
          svg: svg("0 0 40 56", 40, 56,
            '<text x="20" y="44" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-style="italic" font-weight="800" font-size="42" fill="#fff">S</text>')
        }
      ]
    }
  ];

  var ROUND_LINES = [
    "Not bad. The merch table would still make you pay full price.",
    "Close. A tourist would buy it. A season-ticket holder would not.",
    "The letters made it home. The rest of the logo is still on the 7.",
    "It's in the zip code. Not necessarily the right borough.",
    "The team would like their shapes back, but they have seen worse.",
    "You built a logo. Whether it is their logo is a longer conversation."
  ];
  var END_LINES = [
    "You may have a job in the merch warehouse.",
    "Respectable. You can tell a hat from a hat-shaped object.",
    "It's a logo. It's in the neighborhood. The neighborhood is Queens.",
    "The folding table on Canal Street just offered you a job.",
    "That's a new franchise. They play in New Jersey now."
  ];

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function angDiff(a, b) {
    var d = Math.abs(a - b) % 360;
    if (d > 180) d = 360 - d;
    return d;
  }
  function posScore(dx, dy) {
    var d = Math.hypot(dx, dy);
    return clamp(1 - (d - 6) / 110, 0, 1);
  }
  function rotScore(a, b) {
    var d = angDiff(a, b);
    return clamp(1 - (d - 4) / 70, 0, 1);
  }
  function scaleScore(s, t) {
    var r = Math.abs(s - t) / (t || 1);
    return clamp(1 - (r - 0.03) / 0.42, 0, 1);
  }
  function pieceScore(p) {
    return 0.5 * posScore(p.x - p.fitX, p.y - p.fitY) +
           0.3 * rotScore(p.rot, p.tr) +
           0.2 * scaleScore(p.scale, p.ts);
  }
  function shuffle(a) {
    var i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function lineFor(pct) {
    if (pct >= 90) return "That's the one they hang in the rafters.";
    if (pct >= 78) return ROUND_LINES[0];
    if (pct >= 66) return ROUND_LINES[1];
    if (pct >= 54) return ROUND_LINES[2];
    if (pct >= 40) return ROUND_LINES[3];
    if (pct >= 25) return ROUND_LINES[4];
    return ROUND_LINES[5];
  }
  function endLine(avg) {
    if (avg >= 88) return END_LINES[0];
    if (avg >= 74) return END_LINES[1];
    if (avg >= 58) return END_LINES[2];
    if (avg >= 40) return END_LINES[3];
    return END_LINES[4];
  }

  var round, scores, team, pieces, selected, dragging, zTop;
  var boardEl, statusEl, scaleEl;

  function applyTransform(p) {
    if (!p.el) return;
    p.el.style.left = p.x + "px";
    p.el.style.top = p.y + "px";
    p.el.style.transform = "translate(-50%,-50%) rotate(" + p.rot + "deg) scale(" + p.scale + ")";
  }

  function select(p) {
    selected = p;
    pieces.forEach(function (x) {
      x.el.classList.toggle("on", x === p);
    });
    if (p) {
      p.el.style.zIndex = String(++zTop);
      if (scaleEl) scaleEl.value = String(Math.round(p.scale * 100));
    }
  }

  function scatterSlots(n) {
    var slots = [
      { x: 90, y: 52 }, { x: 550, y: 52 }, { x: 90, y: 330 }, { x: 550, y: 330 },
      { x: 230, y: 44 }, { x: 410, y: 44 }, { x: 70, y: 190 }, { x: 570, y: 190 },
      { x: 200, y: 336 }, { x: 440, y: 336 }
    ];
    shuffle(slots);
    return slots.slice(0, n);
  }

  function startRound() {
    team = TEAMS[round];
    zTop = 10;
    selected = null;
    dragging = null;
    var slots = scatterSlots(team.pieces.length);
    pieces = team.pieces.map(function (src, i) {
      var p = {
        id: src.id, label: src.label, svg: src.svg, w: src.w, h: src.h,
        tx: src.tx, ty: src.ty, tr: src.tr, ts: src.ts,
        x: slots[i].x, y: slots[i].y,
        rot: Math.round((Math.random() * 280 - 140) / 5) * 5,
        scale: Math.round((0.7 + Math.random() * 0.55) * 20) / 20
      };
      return p;
    });
    renderPlay();
  }

  function renderPlay() {
    root.innerHTML =
      '<div class="lg-top">' +
        '<div class="lg-round">Round ' + (round + 1) + " of " + TEAMS.length +
        (scores.length ? " &nbsp;·&nbsp; So far: " + Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) + "%" : "") +
        "</div>" +
        '<div class="lg-q">Build the ' + team.name + " logo</div>" +
        '<div class="lg-team">Drag the pieces into the box. Rotate and scale until it looks right.</div>' +
      "</div>" +
      '<div class="lg-board" id="lgboard" tabindex="0">' +
        '<div class="lg-frame" aria-hidden="true">build it here</div>' +
      "</div>" +
      '<div class="lg-tools">' +
        '<button type="button" class="btn" id="lgccw" title="Q">↺ Rotate</button>' +
        '<button type="button" class="btn" id="lgcw" title="E">Rotate ↻</button>' +
        '<label class="lg-scale">Scale <input id="lgscale" type="range" min="50" max="160" value="100"></label>' +
        '<button type="button" class="btn" id="lgdone">Done</button>' +
      "</div>";
    boardEl = document.getElementById("lgboard");
    scaleEl = document.getElementById("lgscale");
    statusEl = null;
    pieces.forEach(function (p, i) {
      var el = document.createElement("div");
      el.className = "lg-piece";
      el.innerHTML = p.svg;
      el.setAttribute("data-id", p.id);
      el.setAttribute("aria-label", p.label);
      el.style.width = p.w + "px";
      el.style.height = p.h + "px";
      el.style.zIndex = String(i + 1);
      p.el = el;
      applyTransform(p);
      boardEl.appendChild(el);
      bindPiece(p);
    });
    document.getElementById("lgccw").addEventListener("click", function () { rotate(-15); });
    document.getElementById("lgcw").addEventListener("click", function () { rotate(15); });
    scaleEl.addEventListener("input", function () {
      if (!selected) select(pieces[0]);
      selected.scale = parseInt(scaleEl.value, 10) / 100;
      applyTransform(selected);
    });
    document.getElementById("lgdone").addEventListener("click", finishRound);
    boardEl.addEventListener("pointerdown", function (e) {
      if (e.target === boardEl || e.target.classList.contains("lg-frame")) select(null);
      boardEl.focus({ preventScroll: true });
    });
  }

  function bindPiece(p) {
    var el = p.el;
    el.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      select(p);
      var rect = boardEl.getBoundingClientRect();
      dragging = {
        p: p,
        ox: e.clientX - rect.left - p.x,
        oy: e.clientY - rect.top - p.y
      };
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      boardEl.focus({ preventScroll: true });
    });
  }

  function onMove(e) {
    if (!dragging) return;
    e.preventDefault();
    var rect = boardEl.getBoundingClientRect();
    var p = dragging.p;
    p.x = clamp(e.clientX - rect.left - dragging.ox, 16, BOARD_W - 16);
    p.y = clamp(e.clientY - rect.top - dragging.oy, 16, BOARD_H - 16);
    applyTransform(p);
  }
  function onUp() { dragging = null; }

  function rotate(deg) {
    if (!selected) {
      if (pieces[0]) select(pieces[0]);
      else return;
    }
    selected.rot = Math.round((selected.rot + deg) * 10) / 10;
    applyTransform(selected);
  }
  function nudgeScale(d) {
    if (!selected) {
      if (pieces[0]) select(pieces[0]);
      else return;
    }
    selected.scale = clamp(Math.round((selected.scale + d) * 20) / 20, 0.5, 1.6);
    if (scaleEl) scaleEl.value = String(Math.round(selected.scale * 100));
    applyTransform(selected);
  }

  function onKey(e) {
    if (!root.contains(document.activeElement) && document.activeElement !== boardEl && document.activeElement !== scaleEl) {
      // still allow keys if the user is mid-game and last clicked a piece (body may have focus)
      if (!selected && !boardEl) return;
    }
    var k = e.key;
    if (k === "q" || k === "Q" || k === "[") { rotate(e.shiftKey ? -5 : -15); e.preventDefault(); }
    else if (k === "e" || k === "E" || k === "]") { rotate(e.shiftKey ? 5 : 15); e.preventDefault(); }
    else if (k === "-" || k === "_") { nudgeScale(-0.05); e.preventDefault(); }
    else if (k === "=" || k === "+") { nudgeScale(0.05); e.preventDefault(); }
    else if (k === "ArrowLeft") { if (selected) { selected.x = clamp(selected.x - (e.shiftKey ? 1 : 4), 16, BOARD_W - 16); applyTransform(selected); e.preventDefault(); } }
    else if (k === "ArrowRight") { if (selected) { selected.x = clamp(selected.x + (e.shiftKey ? 1 : 4), 16, BOARD_W - 16); applyTransform(selected); e.preventDefault(); } }
    else if (k === "ArrowUp") { if (selected) { selected.y = clamp(selected.y - (e.shiftKey ? 1 : 4), 16, BOARD_H - 16); applyTransform(selected); e.preventDefault(); } }
    else if (k === "ArrowDown") { if (selected) { selected.y = clamp(selected.y + (e.shiftKey ? 1 : 4), 16, BOARD_H - 16); applyTransform(selected); e.preventDefault(); } }
    else if (k === "Enter" && !e.repeat && document.activeElement !== scaleEl) { finishRound(); e.preventDefault(); }
  }

  function bestFit() {
    var mx = 0, my = 0;
    pieces.forEach(function (p) {
      mx += p.x - p.tx;
      my += p.y - p.ty;
    });
    mx /= pieces.length;
    my /= pieces.length;
    pieces.forEach(function (p) {
      p.fitX = p.tx + mx;
      p.fitY = p.ty + my;
    });
  }

  function scoreNow() {
    bestFit();
    var sum = 0;
    pieces.forEach(function (p) { sum += pieceScore(p); });
    return Math.round((sum / pieces.length) * 100);
  }

  function paintMini(el, official) {
    el.innerHTML = "";
    var scale = 0.58;
    var wrap = document.createElement("div");
    wrap.className = "lg-mini-inner";
    wrap.style.width = BOARD_W + "px";
    wrap.style.height = BOARD_H + "px";
    wrap.style.transform = "scale(" + scale + ")";
    wrap.style.transformOrigin = "top left";
    team.pieces.forEach(function (src, i) {
      var p = pieces[i];
      var d = document.createElement("div");
      d.className = "lg-piece frozen";
      d.innerHTML = src.svg;
      d.style.width = src.w + "px";
      d.style.height = src.h + "px";
      if (official) {
        d.style.left = src.tx + "px";
        d.style.top = src.ty + "px";
        d.style.transform = "translate(-50%,-50%) rotate(" + src.tr + "deg) scale(" + src.ts + ")";
      } else {
        d.style.left = p.x + "px";
        d.style.top = p.y + "px";
        d.style.transform = "translate(-50%,-50%) rotate(" + p.rot + "deg) scale(" + p.scale + ")";
      }
      wrap.appendChild(d);
    });
    var holder = document.createElement("div");
    holder.className = "lg-mini-clip";
    holder.style.width = (BOARD_W * scale) + "px";
    holder.style.height = (BOARD_H * scale) + "px";
    holder.appendChild(wrap);
    el.appendChild(holder);
  }

  function finishRound() {
    if (!pieces) return;
    var pct = scoreNow();
    scores.push(pct);
    showResults(pct);
  }

  function showResults(pct) {
    var more = round < TEAMS.length - 1;
    root.innerHTML =
      '<div class="lg-top">' +
        '<div class="lg-round">Round ' + (round + 1) + " of " + TEAMS.length + " &nbsp;·&nbsp; " + team.name + "</div>" +
        '<div class="lg-score">' + pct + "%</div>" +
        '<div class="lg-fb">' + lineFor(pct) + "</div>" +
      "</div>" +
      '<div class="lg-compare">' +
        '<div class="lg-pane"><div class="lg-pane-h">Yours</div><div class="lg-mini" id="lgyours"></div></div>' +
        '<div class="lg-pane"><div class="lg-pane-h">The real one</div><div class="lg-mini" id="lgreal"></div></div>' +
      "</div>" +
      '<div class="lg-again">' +
        (more
          ? '<button type="button" class="btn" id="lgnext">Next team</button>'
          : '<button type="button" class="btn" id="lgnext">See your average</button>') +
      "</div>";
    paintMini(document.getElementById("lgyours"), false);
    paintMini(document.getElementById("lgreal"), true);
    document.getElementById("lgnext").addEventListener("click", function () {
      if (more) { round++; startRound(); }
      else showEnd();
    });
  }

  function showEnd() {
    var avg = Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length);
    var rows = TEAMS.map(function (t, i) {
      return '<li><span>' + t.name + "</span><b>" + scores[i] + "%</b></li>";
    }).join("");
    root.innerHTML =
      '<div class="lg-top">' +
        '<div class="lg-round">Final score</div>' +
        '<div class="lg-score">' + avg + "% average</div>" +
        '<div class="lg-fb">' + endLine(avg) + "</div>" +
      "</div>" +
      '<ul class="lg-list">' + rows + "</ul>" +
      '<div class="lg-again"><button type="button" class="btn" id="lgagain">Play again</button></div>';
    document.getElementById("lgagain").addEventListener("click", setup);
  }

  function setup() {
    round = 0;
    scores = [];
    startRound();
  }

  document.addEventListener("pointermove", onMove, { passive: false });
  document.addEventListener("pointerup", onUp);
  document.addEventListener("pointercancel", onUp);
  document.addEventListener("keydown", onKey);

  // Screenshot / demo hooks
  var shot = (location.search.match(/shot=([^&]+)/) || [])[1];
  if (shot === "results" || shot === "end") {
    round = 0;
    scores = [];
    team = TEAMS[0];
    pieces = team.pieces.map(function (src) {
      return {
        id: src.id, label: src.label, svg: src.svg, w: src.w, h: src.h,
        tx: src.tx, ty: src.ty, tr: src.tr, ts: src.ts,
        x: src.tx + (src.id === "n" ? -22 : 18),
        y: src.ty + (src.id === "y" ? 20 : -14),
        rot: src.tr + (src.id === "n" ? -22 : 16),
        scale: src.ts * (src.id === "y" ? 1.18 : 0.88)
      };
    });
    var pct = scoreNow();
    if (shot === "end") {
      scores = [pct, 81, 64, 73, 58, 70];
      showEnd();
    } else {
      scores = [pct];
      showResults(pct);
    }
  } else {
    setup();
  }
})();
