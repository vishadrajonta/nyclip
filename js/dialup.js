(function () {
  var root = document.documentElement;
  var force = /(?:\?|&)dialup=1(?:&|$)/.test(location.search);
  var skip = /(?:\?|&)skipdial=1(?:&|$)/.test(location.search);
  try {
    if (skip) sessionStorage.setItem("nyc_exe_connected", "1");
    if (!force && (skip || sessionStorage.getItem("nyc_exe_connected"))) {
      root.classList.add("connected");
      var gone = document.getElementById("dialup");
      if (gone && gone.parentNode) gone.parentNode.removeChild(gone);
      return;
    }
  } catch (e) {}

  var overlay = document.getElementById("dialup");
  if (!overlay) return;
  var status = document.getElementById("dialstatus");
  var prog = document.getElementById("dialprog");
  var connectBtn = document.getElementById("dialconnect");
  var skip = document.getElementById("dialskip");
  var audio = document.getElementById("dialaudio");
  var lines = [
    "Initializing modem...",
    "Dialing 718-555-0199...",
    "Verifying username...",
    "Checking password...",
    "Negotiating handshake...",
    "Connected at 56,000 bps",
    "Welcome to NYC.exe"
  ];
  var started = false;

  function done() {
    try { sessionStorage.setItem("nyc_exe_connected", "1"); } catch (e) {}
    root.classList.add("connected");
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    if (audio) {
      try { audio.pause(); audio.currentTime = 0; } catch (e) {}
    }
  }

  function start() {
    if (started) return;
    started = true;
    if (connectBtn) connectBtn.disabled = true;
    if (audio) {
      try {
        audio.currentTime = 0;
        var p = audio.play();
        if (p && p.catch) p.catch(function () {});
      } catch (e) {}
    }
    var t0 = Date.now();
    var dur = 4200;
    function tick() {
      var elap = Date.now() - t0;
      var pct = Math.min(100, (elap / dur) * 100);
      if (prog) prog.style.width = pct + "%";
      var idx = Math.min(lines.length - 1, Math.floor((elap / dur) * lines.length));
      if (status) status.textContent = lines[idx];
      if (elap >= dur) { done(); return; }
      requestAnimationFrame(tick);
    }
    if (status) status.textContent = lines[0];
    tick();
  }

  if (connectBtn) connectBtn.addEventListener("click", start);
  if (skip) skip.addEventListener("click", function (e) {
    e.preventDefault();
    done();
  });
})();
