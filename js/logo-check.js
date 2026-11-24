(function () {
  var root = document.getElementById("logogame");
  if (!root) return;

  var SIZE = 150;
  var TOTAL = 10;

  function ny(ctx, x, y, s, color, gap, flip) {
    ctx.save();
    ctx.translate(x, y);
    if (flip) ctx.scale(-1, 1);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(5, s * 0.16);
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    var g = gap || 0;
    // interlocking NY, amateur but readable
    ctx.beginPath();
    ctx.moveTo(-s * 0.42, -s * 0.46);
    ctx.lineTo(-s * 0.42, s * 0.48);
    ctx.moveTo(-s * 0.42, -s * 0.46);
    ctx.lineTo(s * 0.05 + g, s * 0.48);
    ctx.moveTo(-s * 0.08, -s * 0.46);
    ctx.lineTo(-s * 0.08, s * 0.48);
    // Y
    ctx.moveTo(s * 0.02 + g, -s * 0.46);
    ctx.lineTo(s * 0.28 + g, 0.02 * s);
    ctx.lineTo(s * 0.52 + g, -s * 0.46);
    ctx.moveTo(s * 0.28 + g, 0.02 * s);
    ctx.lineTo(s * 0.28 + g, s * 0.48);
    ctx.stroke();
    ctx.restore();
  }

  function word(ctx, text, x, y, size, color, font, rot) {
    ctx.save();
    ctx.translate(x, y);
    if (rot) ctx.rotate(rot);
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold " + size + "px Arial, Helvetica, sans-serif";
    if (font) ctx.font = font;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  function circle(ctx, x, y, r, fill, stroke, sw) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw || 3; ctx.stroke(); }
  }

  function shield(ctx, x, y, w, h, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y - h * 0.45);
    ctx.lineTo(x + w / 2, y - h * 0.45);
    ctx.lineTo(x + w / 2, y + h * 0.1);
    ctx.quadraticCurveTo(x + w * 0.35, y + h * 0.45, x, y + h * 0.52);
    ctx.quadraticCurveTo(x - w * 0.35, y + h * 0.45, x - w / 2, y + h * 0.1);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.stroke(); }
  }

  function oval(ctx, x, y, rx, ry, fill, stroke, sw) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = sw || 3; ctx.stroke(); }
  }

  var TEAMS = [
    {
      id: "yankees",
      name: "New York Yankees",
      draw: function (ctx, v) {
        var bg = "#ffffff";
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, SIZE, SIZE);
        var col = "#0c2340";
        var gap = 0, flip = false, label = "NY";
        if (v === "color") col = "#ff6600";
        if (v === "flip") flip = true;
        if (v === "shift") gap = 18;
        if (v === "letter") { label = "YN"; gap = 0; }
        if (label === "YN") {
          word(ctx, "YN", SIZE / 2, SIZE / 2, 72, col);
        } else {
          ny(ctx, SIZE / 2, SIZE / 2, 52, col, gap, flip);
        }
      }
    },
    {
      id: "mets",
      name: "New York Mets",
      draw: function (ctx, v) {
        var c = SIZE / 2;
        var fill = "#002d72", stitch = "#ff5910", nycol = "#ff5910";
        if (v === "color") { fill = "#1a7a3a"; stitch = "#ffd200"; nycol = "#ffd200"; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        circle(ctx, c, c, 66, fill, stitch, 6);
        if (v !== "noring") {
          ctx.save();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 5]);
          ctx.beginPath();
          ctx.arc(c, c, 58, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        if (v === "letter") word(ctx, "NY", c, c, 54, nycol);
        else if (v === "flip") { ny(ctx, c, c + 2, 44, nycol, 0, true); }
        else { ny(ctx, c, c + 2, 44, nycol, 0, false); }
      }
    },
    {
      id: "knicks",
      name: "New York Knicks",
      draw: function (ctx, v) {
        var c = SIZE / 2;
        var ball = "#f58426", line = "#003da5", text = "#ffffff";
        if (v === "color") { ball = "#2e8b57"; line = "#0a3"; text = "#fff"; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        circle(ctx, c, c, 64, ball, line, 5);
        ctx.strokeStyle = line;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(c, c, 64, 0, Math.PI * 2);
        ctx.stroke();
        // basketball seams
        ctx.beginPath();
        ctx.moveTo(c, c - 64); ctx.lineTo(c, c + 64);
        ctx.moveTo(c - 64, c); ctx.lineTo(c + 64, c);
        ctx.stroke();
        ctx.beginPath();
        var shift = v === "shift" ? 16 : 0;
        ctx.arc(c - 70 + shift, c, 70, -0.8, 0.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(c + 70 - shift, c, 70, Math.PI - 0.8, Math.PI + 0.8);
        ctx.stroke();
        var t = v === "letter" ? "KNICS" : "KNICKS";
        word(ctx, t, c, c + (v === "shift" ? 14 : 0), t.length > 5 ? 22 : 26, text);
        word(ctx, "NEW YORK", c, c - 22, 11, text);
      }
    },
    {
      id: "nets",
      name: "Brooklyn Nets",
      draw: function (ctx, v) {
        var c = SIZE / 2;
        var fill = "#000000", ink = "#ffffff";
        if (v === "color") { fill = "#ff6600"; ink = "#ffffff"; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.save();
        if (v === "flip") { ctx.translate(c, c); ctx.scale(-1, 1); ctx.translate(-c, -c); }
        circle(ctx, c, c, 64, fill, ink, 4);
        // ball lines
        ctx.strokeStyle = ink;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(c, c, 48, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(c, c - 48); ctx.lineTo(c, c + 48);
        ctx.stroke();
        var t = v === "letter" ? "NATS" : "NETS";
        word(ctx, t, c, c, 28, ink);
        word(ctx, v === "letter" ? "NEW YORK" : "BROOKLYN", c, c + 28, 10, ink);
        ctx.restore();
      }
    },
    {
      id: "rangers",
      name: "New York Rangers",
      draw: function (ctx, v) {
        var c = SIZE / 2;
        var sh = "#0038a8", text = "#ffffff", red = "#ce1126";
        if (v === "color") { sh = "#1a7a3a"; red = "#f5c800"; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.save();
        if (v === "flip") { ctx.translate(c, c); ctx.scale(-1, 1); ctx.translate(-c, -c); }
        shield(ctx, c, c, 112, 128, sh, "#ffffff");
        ctx.save();
        var rot = v === "shift" ? 0 : -0.7;
        ctx.translate(c, c);
        ctx.rotate(rot);
        ctx.fillStyle = red;
        ctx.fillRect(-70, -16, 140, 32);
        var t = v === "letter" ? "RANGARS" : "RANGERS";
        word(ctx, t, 0, 1, t.length > 7 ? 16 : 20, "#ffffff");
        ctx.restore();
        ctx.restore();
      }
    },
    {
      id: "islanders",
      name: "New York Islanders",
      draw: function (ctx, v) {
        var c = SIZE / 2;
        var fill = "#00539b", ring = "#f47d30", map = "#f47d30";
        if (v === "color") { fill = "#5a2d82"; ring = "#ffd200"; map = "#ffd200"; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        circle(ctx, c, c, 66, fill, ring, 7);
        ctx.save();
        if (v === "flip") { ctx.translate(c, c); ctx.scale(-1, 1); ctx.translate(-c, -c); }
        // Long Island silhouette under the letters
        ctx.fillStyle = map;
        ctx.beginPath();
        if (v !== "shift") {
          ctx.moveTo(c - 54, c + 18);
          ctx.bezierCurveTo(c - 20, c + 4, c + 16, c + 10, c + 58, c + 22);
          ctx.bezierCurveTo(c + 44, c + 36, c + 8, c + 34, c - 28, c + 28);
          ctx.lineTo(c - 48, c + 24);
          ctx.closePath();
        } else {
          ctx.ellipse(c, c + 44, 46, 10, 0, 0, Math.PI * 2);
        }
        ctx.fill();
        var t = v === "letter" ? "NJ" : "NY";
        word(ctx, t, c, c - 10, 36, "#ffffff");
        ctx.restore();
      }
    },
    {
      id: "giants",
      name: "New York Giants",
      draw: function (ctx, v) {
        var c = SIZE / 2;
        var col = "#0b2265", under = "#a71930";
        if (v === "color") { col = "#ff6600"; under = "#0b2265"; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.save();
        if (v === "flip") { ctx.translate(c, c); ctx.scale(-1, 1); ctx.translate(-c, -c); }
        var t = v === "letter" ? "nj" : "ny";
        word(ctx, t, c, c - 6, 86, col, "bold 86px Arial, Helvetica, sans-serif");
        if (v !== "shift") {
          ctx.strokeStyle = under;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(c - 52, c + 42);
          ctx.lineTo(c + 52, c + 42);
          ctx.stroke();
        }
        ctx.restore();
      }
    },
    {
      id: "jets",
      name: "New York Jets",
      draw: function (ctx, v) {
        var c = SIZE / 2;
        var fill = "#125740", ink = "#ffffff";
        if (v === "color") { fill = "#003da5"; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        if (v === "shift") circle(ctx, c, c, 62, fill, ink, 4);
        else oval(ctx, c, c, 70, 44, fill, ink, 4);
        var t = v === "letter" ? "JETZ" : "JETS";
        ctx.save();
        if (v === "flip") { ctx.translate(c, c); ctx.scale(-1, 1); ctx.translate(-c, -c); }
        word(ctx, t, c, c, 36, ink, "italic bold 36px Arial, Helvetica, sans-serif");
        ctx.restore();
      }
    },
    {
      id: "liberty",
      name: "New York Liberty",
      draw: function (ctx, v) {
        var c = SIZE / 2;
        var fill = "#6eceb2", ink = "#000000", flame = "#f58426";
        if (v === "color") { fill = "#003da5"; flame = "#ffffff"; ink = "#ffffff"; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        circle(ctx, c, c, 66, fill, ink, 4);
        ctx.save();
        if (v === "flip") { ctx.translate(c, c); ctx.scale(-1, 1); ctx.translate(-c, -c); }
        // torch
        var tx = v === "shift" ? c + 22 : c;
        ctx.fillStyle = flame;
        ctx.beginPath();
        ctx.moveTo(tx, c - 54);
        ctx.lineTo(tx + 14, c - 28);
        ctx.lineTo(tx - 14, c - 28);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = ink;
        ctx.fillRect(tx - 6, c - 28, 12, 36);
        ctx.fillRect(tx - 16, c + 6, 32, 8);
        var t = v === "letter" ? "LIBERTE" : "LIBERTY";
        word(ctx, t, c, c + 36, t.length > 7 ? 14 : 16, ink);
        ctx.restore();
      }
    },
    {
      id: "nycfc",
      name: "New York City FC",
      draw: function (ctx, v) {
        var c = SIZE / 2;
        var fill = "#6cace4", ring = "#002d72", ink = "#002d72";
        if (v === "color") { fill = "#ff6600"; ring = "#002d72"; ink = "#002d72"; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.save();
        if (v === "flip") { ctx.translate(c, c); ctx.scale(-1, 1); ctx.translate(-c, -c); }
        circle(ctx, c, c, 66, fill, ring, 6);
        var top = v === "letter" ? "NYC" : "NYC";
        var bot = v === "letter" ? "FD" : "FC";
        if (v === "shift") { top = "NY"; bot = "FC"; }
        word(ctx, top, c, c - 12, 32, ink);
        word(ctx, bot, c, c + 20, 28, ink);
        ctx.restore();
      }
    },
    {
      id: "redbulls",
      name: "New York Red Bulls",
      draw: function (ctx, v) {
        var c = SIZE / 2;
        var bull = "#ed1c24", ink = "#001e50";
        if (v === "color") { bull = "#003da5"; ink = "#001e50"; }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        function oneBull(x, y, dir) {
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(dir, 1);
          ctx.fillStyle = bull;
          // body
          ctx.beginPath();
          ctx.ellipse(0, 8, 22, 14, -0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(18, -4, 12, 10, -0.2, 0, Math.PI * 2);
          ctx.fill();
          // horn
          ctx.beginPath();
          ctx.moveTo(20, -12);
          ctx.lineTo(32, -26);
          ctx.lineTo(18, -10);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        if (v === "flip") {
          oneBull(c - 22, c + 4, 1);
          oneBull(c + 22, c + 4, 1);
        } else if (v === "shift") {
          oneBull(c, c + 4, 1);
        } else {
          oneBull(c - 22, c + 4, 1);
          oneBull(c + 22, c + 4, -1);
        }
        var t = v === "letter" ? "NEW JERSEY" : "NEW YORK";
        word(ctx, t, c, c + 48, 12, ink);
      }
    },
    {
      id: "devils",
      name: "New Jersey Devils",
      draw: function (ctx, v) {
        var c = SIZE / 2;
        var col = "#c8102e";
        if (v === "color") col = "#1a7a3a";
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.save();
        if (v === "flip") { ctx.translate(c, c); ctx.scale(-1, 1); ctx.translate(-c, -c); }
        ctx.fillStyle = col;
        ctx.strokeStyle = col;
        // horns
        if (v !== "shift") {
          ctx.beginPath();
          ctx.moveTo(c - 36, c - 8);
          ctx.lineTo(c - 48, c - 48);
          ctx.lineTo(c - 10, c - 20);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(c + 36, c - 8);
          ctx.lineTo(c + 48, c - 48);
          ctx.lineTo(c + 10, c - 20);
          ctx.closePath();
          ctx.fill();
        }
        var t = v === "letter" ? "NY" : "NJ";
        word(ctx, t, c, c + 8, 64, col);
        // tail
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(c + 40, c + 30);
        ctx.quadraticCurveTo(c + 64, c + 20, c + 58, c + 48);
        ctx.stroke();
        ctx.restore();
      }
    }
  ];

  var FAKES = ["color", "flip", "letter", "shift"];
  var FAKE_LABELS = {
    color: "A",
    flip: "B",
    letter: "C",
    shift: "D",
    real: "Real"
  };

  var YES = [
    "Legit. That one would actually get you in the building.",
    "Correct. The guy packing the duffel bag just sighed.",
    "That's the one. No extra letters, no surprise colors.",
    "You picked the real one. Canal Street is slightly disappointed.",
    "Good eye. That logo has paid for itself in merch.",
    "Yes. The other two came off a folding table."
  ];
  var NO = [
    "Bootleg. Look again — something's off.",
    "That's the $10 version. The real one is the other one.",
    "Nice try. That letter is doing something it shouldn't.",
    "Counterfeit. The vendor would have given you a wink.",
    "Wrong. That one would not survive a close-up.",
    "Bootleg. Pretty close, though, which is the whole business model."
  ];
  var ENDS = [
    "You'd last maybe four minutes on Canal Street.",
    "Respectable. You can tell a hat from a hat-shaped object.",
    "Solid. You may accompany someone to the official team store.",
    "Very good. The folding table is folding itself up now.",
    "Perfect score. Are you a graphic designer or just lucky?"
  ];

  function shuffle(a) {
    var i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pickFakes() {
    var f = FAKES.slice();
    shuffle(f);
    return f.slice(0, 2);
  }

  var deck, round, score, locked;

  function setup() {
    deck = TEAMS.slice();
    shuffle(deck);
    deck = deck.slice(0, TOTAL);
    round = 0;
    score = 0;
    showRound();
  }

  function paint(team, variant) {
    var c = document.createElement("canvas");
    c.width = SIZE;
    c.height = SIZE;
    team.draw(c.getContext("2d"), variant);
    return c;
  }

  function showRound() {
    locked = false;
    var team = deck[round];
    var fakes = pickFakes();
    var opts = [{ v: "real", canvas: paint(team, "real") }];
    var i;
    for (i = 0; i < fakes.length; i++) {
      opts.push({ v: fakes[i], canvas: paint(team, fakes[i]) });
    }
    shuffle(opts);
    var letters = ["A", "B", "C"];
    var html = "";
    html += '<div class="lg-top"><div class="lg-round">Round ' + (round + 1) + " of " + TOTAL + " &nbsp;·&nbsp; Score: " + score + "</div>";
    html += '<div class="lg-q">Which one is legit?</div>';
    html += '<div class="lg-team">' + team.name + "</div></div>";
    html += '<div class="choices"></div>';
    html += '<div class="lg-fb" id="lgfb"></div>';
    root.innerHTML = html;
    var box = root.querySelector(".choices");
    opts.forEach(function (opt, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.setAttribute("data-v", opt.v);
      btn.appendChild(opt.canvas);
      var lab = document.createElement("div");
      lab.className = "lbl";
      lab.textContent = "Logo " + letters[idx];
      btn.appendChild(lab);
      btn.addEventListener("click", function () { pick(btn, opt.v, team); });
      box.appendChild(btn);
    });
  }

  function pick(btn, v, team) {
    if (locked) return;
    locked = true;
    var ok = v === "real";
    if (ok) score++;
    var buttons = root.querySelectorAll(".choice");
    Array.prototype.forEach.call(buttons, function (b) {
      if (b.getAttribute("data-v") === "real") b.className += " correct";
      else if (b === btn) b.className += " wrong";
    });
    var fb = document.getElementById("lgfb");
    var line = ok ? YES[Math.floor(Math.random() * YES.length)] : NO[Math.floor(Math.random() * NO.length)];
    if (!ok) {
      if (v === "color") line = "Bootleg. The colors took a wrong turn in Queens.";
      if (v === "flip") line = "Bootleg. That logo is looking in the other direction.";
      if (v === "letter") line = "Bootleg. Read the letters again, slowly.";
      if (v === "shift") line = "Bootleg. Somebody moved a piece and hoped you wouldn't notice.";
    }
    fb.textContent = line;
    setTimeout(function () {
      round++;
      if (round >= TOTAL) end();
      else showRound();
    }, 1100);
  }

  function end() {
    var idx = 0;
    if (score >= 10) idx = 4;
    else if (score >= 8) idx = 3;
    else if (score >= 6) idx = 2;
    else if (score >= 4) idx = 1;
    else idx = 0;
    root.innerHTML =
      '<div class="lg-score">' + score + " out of " + TOTAL + "</div>" +
      '<div class="lg-fb">' + ENDS[idx] + "</div>" +
      '<div class="lg-again"><button type="button" class="btn" id="lgagain">Play again</button></div>';
    document.getElementById("lgagain").addEventListener("click", setup);
  }

  setup();
})();
