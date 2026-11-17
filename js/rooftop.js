// Rooftop Run - cross Midtown without touching the ground.
(function () {
  var canvas = document.getElementById("game");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var W = canvas.width;
  var H = canvas.height;

  var GRAV = 0.45;
  var JUMP = -8.6;
  var RUN = 2.6;
  var state = "start";
  var cam = 0;
  var p, roofs, score, holding, ticks;

  var AVENUES = ["5th Ave", "Madison", "Park", "Lexington", "3rd Ave", "2nd Ave", "1st Ave", "York", "East River?"];

  function makeRoofs() {
    var list = [];
    var x = 40;
    // starting roof, nice and wide
    list.push({ x: 0, y: 210, w: 180, h: 90, tower: false });
    x = 180;
    for (var i = 0; i < 80; i++) {
      var gap = 36 + Math.random() * 48 + Math.min(30, i * 0.6);
      var w = 70 + Math.random() * 90;
      var y = 150 + Math.random() * 80;
      var tower = Math.random() < 0.28;
      if (tower) {
        w = 36 + Math.random() * 16;
        y = 120 + Math.random() * 50;
      }
      list.push({ x: x + gap, y: y, w: w, h: H - y, tower: tower });
      x = x + gap + w;
    }
    return list;
  }

  function reset() {
    p = { x: 70, y: 180, vx: RUN, vy: 0, on: true, w: 14, h: 24 };
    roofs = makeRoofs();
    cam = 0;
    score = 0;
    holding = false;
    ticks = 0;
    state = "play";
  }

  function currentRoof() {
    for (var i = 0; i < roofs.length; i++) {
      var r = roofs[i];
      if (p.x + p.w > r.x && p.x < r.x + r.w) {
        if (p.y + p.h <= r.y + 8 && p.y + p.h >= r.y - 14 && p.vy >= 0) return r;
      }
    }
    return null;
  }

  function update() {
    ticks++;
    p.vy += GRAV;
    if (holding && p.on && p.vy === 0) {
      // already jumped
    }
    p.x += p.vx;
    p.y += p.vy;

    var roof = currentRoof();
    if (roof && p.vy >= 0) {
      p.y = roof.y - p.h;
      p.vy = 0;
      p.on = true;
    } else {
      p.on = false;
    }

    if (p.y > H + 10) {
      state = "over";
    }

    cam = p.x - 80;
    if (cam < 0) cam = 0;
    score = Math.max(score, Math.floor((p.x - 70) / 220));
  }

  function jump() {
    if (state === "play" && p.on) {
      p.vy = JUMP;
      p.on = false;
    }
  }

  function drawBuilding(r, i) {
    var x = Math.round(r.x - cam);
    if (x > W || x + r.w < 0) return;
    ctx.fillStyle = r.tower ? "#8a4a28" : (i % 2 ? "#5a5a72" : "#4a4a64");
    ctx.fillRect(x, r.y, r.w, r.h + 40);
    if (r.tower) {
      ctx.beginPath();
      ctx.ellipse(x + r.w / 2, r.y + 4, r.w / 2 + 4, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#7a3e20";
      ctx.fill();
    } else {
      ctx.fillStyle = "#e8c85a";
      var cols = Math.max(1, Math.floor(r.w / 16));
      for (var c = 0; c < cols; c++) {
        for (var row = 0; row < 4; row++) {
          if ((c + row) % 3 === 0) continue;
          ctx.fillRect(x + 5 + c * 14, r.y + 8 + row * 16, 7, 8);
        }
      }
    }
  }

  function drawPerson() {
    var x = Math.round(p.x - cam);
    var y = Math.round(p.y);
    ctx.fillStyle = "#c88a5a";
    ctx.fillRect(x + 3, y, 8, 8); // head
    ctx.fillStyle = "#cc3333";
    ctx.fillRect(x + 1, y + 8, 12, 10); // body
    ctx.fillStyle = "#222244";
    ctx.fillRect(x + 2, y + 18, 4, 6);
    ctx.fillRect(x + 8, y + 18, 4, 6);
  }

  function avenueName() {
    return AVENUES[Math.min(score, AVENUES.length - 1)];
  }

  function draw() {
    // sky
    ctx.fillStyle = "#7aa7d4";
    ctx.fillRect(0, 0, W, H);

    if (state === "start") {
      ctx.fillStyle = "#3a3a40";
      ctx.fillRect(0, H - 18, W, 18);
      ctx.fillStyle = "#e8d056";
      for (var s = 0; s < 12; s++) ctx.fillRect(s * 50, H - 10, 22, 3);
      ctx.fillStyle = "#111111";
      ctx.font = "bold 20px Verdana, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Rooftop Run", W / 2, 80);
      ctx.font = "12px Verdana, Arial, sans-serif";
      ctx.fillText("Cross Midtown without touching the ground.", W / 2, 112);
      ctx.fillText("Space bar or click to jump. Don't look down.", W / 2, 132);
      ctx.font = "bold 13px Verdana, Arial, sans-serif";
      ctx.fillText("Click to start", W / 2, 180);
      return;
    }

    // far buildings
    ctx.fillStyle = "#3a5578";
    for (var i = 0; i < 10; i++) {
      var bx = ((i * 70) - (cam * 0.3) % 70);
      ctx.fillRect(bx, 80 + (i % 3) * 20, 50, 200);
    }
    // street / death
    ctx.fillStyle = "#3a3a40";
    ctx.fillRect(0, H - 18, W, 18);
    ctx.fillStyle = "#e8d056";
    for (var s = 0; s < 12; s++) {
      ctx.fillRect(s * 50 - (cam % 50), H - 10, 22, 3);
    }

    roofs.forEach(drawBuilding);
    drawPerson();

    ctx.fillStyle = "#111111";
    ctx.font = "bold 12px Verdana, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Blocks: " + score + "   near " + avenueName(), 10, 18);

    if (state === "over") {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px Verdana, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("You looked down.", W / 2, 120);
      ctx.font = "13px Verdana, Arial, sans-serif";
      ctx.fillText("You made it " + score + " block" + (score === 1 ? "" : "s") + ".", W / 2, 148);
      ctx.fillText("Click to try again.", W / 2, 176);
    }
  }

  function loop() {
    if (state === "play") update();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener("keydown", function (e) {
    if (e.key === " " || e.key === "ArrowUp") {
      e.preventDefault();
      if (state === "start" || state === "over") reset();
      else jump();
    }
  });
  function click() {
    if (state === "start" || state === "over") reset();
    else jump();
  }
  canvas.addEventListener("click", click);
  canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    click();
  }, { passive: false });

  if (/\bautostart\b/.test(location.search)) reset();
  draw();
  requestAnimationFrame(loop);
})();
