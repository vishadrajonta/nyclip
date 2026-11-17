// Everything Bagel - catch the toppings on the ticket, don't mess up the order.
(function () {
  var canvas = document.getElementById("game");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var W = canvas.width;
  var H = canvas.height;

  var TOPPINGS = [
    { id: "sesame", label: "sesame", color: "#c8a060" },
    { id: "poppy", label: "poppy", color: "#222222" },
    { id: "onion", label: "onion", color: "#f0f0e0" },
    { id: "garlic", label: "garlic", color: "#eee8c8" },
    { id: "salt", label: "salt", color: "#ffffff" },
    { id: "scallion", label: "scallion schmear", color: "#8fdd7a" },
    { id: "plain", label: "plain schmear", color: "#fff6dc" },
    { id: "butter", label: "butter", color: "#ffe066" },
    { id: "lox", label: "lox", color: "#e07070" },
    { id: "tomato", label: "tomato", color: "#d84030" }
  ];
  var JUNK = [
    { id: "hair", label: "a hair", color: "#553311", junk: true },
    { id: "receipt", label: "a receipt", color: "#f5e6b8", junk: true }
  ];

  var ORDERS = [
    { name: "Everything, scallion schmear", need: ["sesame", "poppy", "onion", "garlic", "salt", "scallion"] },
    { name: "Sesame, butter", need: ["sesame", "butter"] },
    { name: "Poppy, plain schmear", need: ["poppy", "plain"] },
    { name: "Lox, tomato, plain schmear", need: ["lox", "tomato", "plain"] },
    { name: "Onion, scallion schmear", need: ["onion", "scallion"] },
    { name: "Everything, plain schmear", need: ["sesame", "poppy", "onion", "garlic", "salt", "plain"] },
    { name: "Garlic, butter", need: ["garlic", "butter"] },
    { name: "Sesame, lox, scallion schmear", need: ["sesame", "lox", "scallion"] }
  ];

  var state = "start"; // start | play | over
  var bagelX = W / 2;
  var keys = {};
  var falling = [];
  var order = null;
  var got = {};
  var score = 0;
  var lives = 3;
  var tick = 0;
  var spawnEvery = 50;
  var message = "";
  var messageT = 0;

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function newOrder() {
    order = pick(ORDERS);
    got = {};
    message = "Order up: " + order.name;
    messageT = 90;
  }

  function reset() {
    score = 0;
    lives = 3;
    falling = [];
    bagelX = W / 2;
    tick = 0;
    spawnEvery = 50;
    newOrder();
    state = "play";
  }

  function spawn() {
    var pool = TOPPINGS.slice();
    // lean toward things on the ticket, plus some wrong ones and junk
    if (order) {
      order.need.forEach(function (id) {
        var t = TOPPINGS.filter(function (x) { return x.id === id; })[0];
        if (t) { pool.push(t); pool.push(t); }
      });
    }
    if (Math.random() < 0.18) pool = pool.concat(JUNK);
    var t = pick(pool);
    falling.push({
      id: t.id,
      label: t.label,
      color: t.color,
      junk: !!t.junk,
      x: 30 + Math.random() * (W - 60),
      y: -16,
      vy: 1.4 + Math.random() * 1.2 + score * 0.08,
      r: t.junk ? 8 : 10
    });
  }

  function messUp(why) {
    lives -= 1;
    message = why || "You messed up the order!";
    messageT = 80;
    falling = [];
    if (lives <= 0) {
      state = "over";
    } else {
      newOrder();
    }
  }

  function complete() {
    score += 1;
    message = "Nice. Next.";
    messageT = 50;
    falling = [];
    spawnEvery = Math.max(28, 50 - score * 2);
    newOrder();
  }

  function neededLeft() {
    return order.need.filter(function (id) { return !got[id]; });
  }

  function update() {
    tick++;
    if (messageT > 0) messageT--;
    if (keys.ArrowLeft || keys.Left || keys.a) bagelX -= 5;
    if (keys.ArrowRight || keys.Right || keys.d) bagelX += 5;
    if (bagelX < 28) bagelX = 28;
    if (bagelX > W - 28) bagelX = W - 28;

    if (tick % spawnEvery === 0) spawn();

    var catchY = H - 36;
    for (var i = falling.length - 1; i >= 0; i--) {
      var f = falling[i];
      f.y += f.vy;
      var dx = f.x - bagelX;
      var dy = f.y - catchY;
      if (dx * dx + dy * dy < 28 * 28) {
        falling.splice(i, 1);
        if (f.junk) {
          messUp("That was " + f.label + ". You're dead to us.");
          return;
        }
        if (order.need.indexOf(f.id) === -1) {
          messUp("Wrong topping. Nobody asked for " + f.label + ".");
          return;
        }
        if (got[f.id]) {
          // already have it, let it slide
        } else {
          got[f.id] = true;
          if (neededLeft().length === 0) complete();
        }
      } else if (f.y > H + 20) {
        falling.splice(i, 1);
        // if a needed topping is missed too often we don't punish instantly
      }
    }
  }

  function drawBagel(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "#d2a45a";
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#8a5a22";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#22334a";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    // seeds
    ctx.fillStyle = "#3a2a10";
    for (var i = 0; i < 8; i++) {
      var a = i * 0.7;
      ctx.fillRect(Math.cos(a) * 14 - 1, Math.sin(a) * 12 - 1, 2, 2);
    }
    ctx.restore();
  }

  function drawFalling(f) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.fillStyle = f.color;
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;
    if (f.id === "receipt") {
      ctx.fillRect(-7, -9, 14, 16);
      ctx.strokeRect(-7, -9, 14, 16);
    } else if (f.id === "hair") {
      ctx.beginPath();
      ctx.moveTo(-6, -4);
      ctx.quadraticCurveTo(0, 8, 8, -2);
      ctx.strokeStyle = f.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, f.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = "#fff";
    ctx.font = "9px Verdana, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.strokeText(f.label, 0, 18);
    ctx.fillText(f.label, 0, 18);
    ctx.restore();
  }

  function draw() {
    // shop bg
    ctx.fillStyle = "#3a2a1c";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#c4a06a";
    ctx.fillRect(0, H - 22, W, 22);
    ctx.fillStyle = "#7a5a30";
    ctx.fillRect(0, H - 24, W, 3);

    if (state === "start") {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px Verdana, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Everything Bagel", W / 2, 70);
      ctx.font = "12px Verdana, Arial, sans-serif";
      ctx.fillText("You're on rush hour. Catch what the ticket says.", W / 2, 100);
      ctx.fillText("Wrong topping, or a hair in the schmear, and the order is shot.", W / 2, 118);
      ctx.fillText("Arrow keys or the mouse to move. Click to start.", W / 2, 150);
      ctx.font = "bold 13px Verdana, Arial, sans-serif";
      ctx.fillText("Click to start", W / 2, 200);
      return;
    }

    // ticket
    ctx.fillStyle = "#fff6d8";
    ctx.fillRect(8, 8, W - 16, 46);
    ctx.strokeStyle = "#333";
    ctx.strokeRect(8, 8, W - 16, 46);
    ctx.fillStyle = "#222";
    ctx.font = "bold 12px Verdana, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("NOW SERVING: " + (order ? order.name : ""), 16, 26);
    var left = neededLeft();
    ctx.font = "11px Verdana, Arial, sans-serif";
    ctx.fillText("Still need: " + (left.length ? left.join(", ") : "—") + "    score " + score + "    lives " + lives, 16, 44);

    falling.forEach(drawFalling);
    drawBagel(bagelX, H - 36);

    if (messageT > 0 && message) {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(40, H / 2 - 18, W - 80, 28);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 12px Verdana, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(message, W / 2, H / 2);
    }

    if (state === "over") {
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 18px Verdana, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("You messed up too many orders.", W / 2, 130);
      ctx.font = "13px Verdana, Arial, sans-serif";
      ctx.fillText("Filled " + score + " ticket" + (score === 1 ? "" : "s") + ".", W / 2, 156);
      ctx.fillText("Click to try again.", W / 2, 186);
    }
  }

  function loop() {
    if (state === "play") update();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener("keydown", function (e) {
    keys[e.key] = true;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ") e.preventDefault();
  });
  window.addEventListener("keyup", function (e) { keys[e.key] = false; });

  function pointerX(e) {
    var r = canvas.getBoundingClientRect();
    var src = e.touches ? e.touches[0] : e;
    return (src.clientX - r.left) * (W / r.width);
  }
  canvas.addEventListener("mousemove", function (e) {
    if (state === "play") bagelX = pointerX(e);
  });
  canvas.addEventListener("touchmove", function (e) {
    if (state === "play") {
      bagelX = pointerX(e);
      e.preventDefault();
    }
  }, { passive: false });
  function clickStart() {
    if (state === "start" || state === "over") reset();
  }
  canvas.addEventListener("click", clickStart);
  canvas.addEventListener("touchstart", function (e) {
    if (state === "start" || state === "over") {
      e.preventDefault();
      reset();
    }
  }, { passive: false });

  if (/\bautostart\b/.test(location.search)) reset();
  draw();
  requestAnimationFrame(loop);
})();
