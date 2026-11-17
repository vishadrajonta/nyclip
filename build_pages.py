#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, html as htmllib

ROOT = os.path.dirname(os.path.abspath(__file__))

# Figma board copy is used verbatim for the four example games.
GAMES = [
    {
        "id": "subway-shuffle",
        "title": "Subway Shuffle",
        "blurb": "Don’t miss your stop",
        "playable": False,
        "col": "left",
    },
    {
        "id": "everything-bagel",
        "title": "Everything Bagel",
        "blurb": "You’re working rush hour at the trendy local bagel shop - catch toppings as they fall and don’t mess up any orders!",
        "playable": True,
        "col": "new",
        "script": "js/bagel.js",
        "hint": "Arrow keys or the mouse move the bagel. Catch only what the ticket says.",
    },
    {
        "id": "rooftop-run",
        "title": "Rooftop Run",
        "blurb": "Cross Midtown without touching the ground.",
        "playable": True,
        "col": "new",
        "script": "js/rooftop.js",
        "hint": "Space bar or click to jump. Don’t touch the street.",
    },
    {
        "id": "taxi-dash",
        "title": "Taxi Dash",
        "blurb": "A fare is waiting uptown and five other cabs want it. Get there first and step on it!",
        "playable": False,
        "col": "left",
    },
    {
        "id": "alternate-side",
        "title": "Alternate Side",
        "blurb": "Think you can find a parking spot before eleven? Move the car, dodge the sweeper, and hope the sign means what it says.",
        "playable": False,
        "col": "left",
    },
    {
        "id": "coffee-regular",
        "title": "Coffee Regular",
        "blurb": "A regular means milk and sugar. Say latte at the cart and you’re walking to the next one.",
        "playable": False,
        "col": "left",
    },
    {
        "id": "walk-up",
        "title": "Walk-Up",
        "blurb": "Five flights, a couch, and a roommate who forgot the other end. Mrs. Alvarez is listening.",
        "playable": False,
        "col": "more",
    },
    {
        "id": "scaffolding-maze",
        "title": "Scaffolding Maze",
        "blurb": "The sidewalk is a tunnel of plywood and mystery drips. Don’t look up.",
        "playable": False,
        "col": "more",
    },
    {
        "id": "stoop-sale",
        "title": "Stoop Sale",
        "blurb": "A lamp, a toaster, and a box of tapes. Haggle nicely. The neighbor is watching.",
        "playable": False,
        "col": "more",
    },
    {
        "id": "metrocard-swipe",
        "title": "MetroCard Swipe",
        "blurb": "The turnstile is hungry and your card is dying. Swipe it right, or get in line for a new one.",
        "playable": False,
        "col": "left",
    },
    {
        "id": "deli-counter",
        "title": "Deli Counter",
        "blurb": "Take a number. Know your order. Say “um” and you’re going to the back.",
        "playable": False,
        "col": "more",
    },
    {
        "id": "tourist-trap",
        "title": "Tourist Trap",
        "blurb": "Get through Times Square without a bus tour, a fake bag, or a flyer for a show you don’t want.",
        "playable": False,
        "col": "more",
    },
    {
        "id": "fire-escape",
        "title": "Fire Escape",
        "blurb": "Dinner on the fire escape. Don’t drop the fork, and wave to the pigeon like you live here.",
        "playable": False,
        "col": "more",
    },
    {
        "id": "crosswalk-chicken",
        "title": "Crosswalk Chicken",
        "blurb": "The light is orange and the taxi is rolling. Walk like you mean it.",
        "playable": False,
        "col": "more",
    },
    {
        "id": "laundromat-roulette",
        "title": "Laundromat Roulette",
        "blurb": "You were gone twenty minutes. Your wet clothes are on the table. Get them in the dryer.",
        "playable": False,
        "col": "more",
    },
]

BY_ID = {g["id"]: g for g in GAMES}

def esc(s):
    return htmllib.escape(s, quote=True)

def nav(here=""):
    links = [
        ("index.html", "Home", "home"),
        ("signup.html", "Sign Up", "signup"),
        ("games.html", "All Games", "games"),
        ("send.html", "Send To A Friend", "send"),
        ("about.html", "About Us", "about"),
    ]
    bits = []
    for href, label, key in links:
        cls = ' class="here"' if key == here else ""
        bits.append(f'<a href="{href}"{cls}>{label}</a>')
    return "\n      ".join(bits)

def header(here=""):
    return f'''  <tr>
    <td>
      <div class="header">
        <a href="index.html"><img class="logo" src="img/logo.png" alt="NYClip"></a>
        <div class="nav">
      {nav(here)}
        </div>
      </div>
    </td>
  </tr>'''

def footer():
    return '''  <tr>
    <td>
      <div class="footer">
        <span class="copy">&copy; 2026 NYClip</span>
        <a href="index.html">Home</a> -
        <a href="signup.html">Sign Up</a> -
        <a href="games.html">All Games</a> -
        <a href="about.html">About Us</a> -
        <a href="send.html">Send To A Friend</a>
      </div>
    </td>
  </tr>'''

def page(title, body, here="", extra_js=None):
    scripts = ""
    if extra_js:
        for s in extra_js:
            scripts += f'\n<script src="{s}"></script>'
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{esc(title)}</title>
  <meta name="description" content="NYClip: funny free games about life in New York City. Send them to your friends or put them on your website.">
  <meta name="viewport" content="width=780">
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" type="image/png" href="img/favicon.png">
</head>
<body>
<table class="page" cellspacing="0" cellpadding="0" align="center">
{header(here)}
  <tr>
    <td>
{body}
    </td>
  </tr>
{footer()}
</table>
{scripts}
</body>
</html>
'''

def game_row(g, show_send=True):
    send = f'<br><a class="sendlink" href="send.html?game={g["id"]}">send to a friend</a>' if show_send else ""
    tag = ' <span class="tag">play</span>' if g["playable"] else ""
    return f'''        <table class="gamerow" cellspacing="0" cellpadding="0">
          <tr>
            <td class="thumb"><a href="game.html?id={g["id"]}"><img src="img/thumbs/{g["id"]}.png" alt="{esc(g["title"])}"></a></td>
            <td>
              <a class="gtitle" href="game.html?id={g["id"]}">{esc(g["title"])}</a>{tag}
              <div class="blurb">{esc(g["blurb"])}</div>
              {send}
            </td>
          </tr>
        </table>'''

def all_games_list():
    items = []
    for g in GAMES:
        tag = ' <span class="tag">new / play</span>' if g["playable"] else ""
        items.append(f'          <li><a href="game.html?id={g["id"]}">{esc(g["title"])}</a>{tag}</li>')
    return "\n".join(items)

def index():
    left = [g for g in GAMES if g["col"] == "left"]
    news = [g for g in GAMES if g["col"] == "new"]
    left_html = "\n".join(game_row(g) for g in left)
    new_html = ""
    for g in news:
        new_html += f'''
          <div class="newwrap">
            <div class="newstar">NEW</div>
            <a class="new-oval" href="game.html?id={g["id"]}" title="{esc(g["title"])}">
              <img src="img/thumbs/{g["id"]}.png" alt="{esc(g["title"])}">
            </a>
          </div>'''
    more = [g for g in GAMES if g["col"] == "more"][:3]
    more_html = "\n".join(game_row(g) for g in more)
    body = f'''      <table class="cols" cellspacing="0" cellpadding="0">
        <tr>
          <td class="col-left">
            <div class="colhead">NYCLIPS</div>
{left_html}
            <div class="leftnote">
              <b>Enhance your website for FREE!</b><br><br>
              Put a NYClip on your website and improve the experience for all your users.
            </div>
          </td>
          <td class="col-mid">
            <div class="welcome">
              <h2>Welcome <span>to NYClip, where you’ll find funny free games about life in New York City, and clips to send to your friends or put on your website. Join our mailing list and receive all the new cool NYClips when they are released.</span></h2>
{new_html}
            </div>
            <div class="mail">
              <h3>Join Our FREE NYClip Mailing List</h3>
              <form action="signup.html" method="get" onsubmit="return checkMail(this);">
                <input type="email" name="email" placeholder="">
                <br>
                <input class="btn" type="submit" value="Submit">
              </form>
              <div class="fine">Enter your email address above and you’ll receive the newest FREE NYClip emails with funny games etc.</div>
            </div>
          </td>
          <td class="col-right">
            <div class="colhead-right">LIST ALL GAMES</div>
            <ul class="alllist">
{all_games_list()}
            </ul>
            <div class="colhead-right" style="margin-top:16px;">MORE NYCLIPS</div>
{more_html}
          </td>
        </tr>
      </table>
      <div class="clickhere">If you want your stuff on our website <a href="about.html">click here</a>.</div>
<script>
function checkMail(f) {{
  var v = f.email.value || "";
  if (!/\\S+@\\S+\\.\\S+/.test(v)) {{
    alert("Please make sure your email address is in the format yourname@company.com.");
    return false;
  }}
  alert("Thanks! You’ll get the new NYClips when they drop.");
  return false;
}}
</script>'''
    return page("NYClip.com", body, here="home")

def about():
    body = '''      <div class="inner">
        <h1>About NYClip</h1>
        <p>NYClip is a free games site about everyday life in New York City. Funny little games, short blurbs, pictures you can send to a friend. The kind of site you might have left open in a browser window in 2001.</p>
        <p>It started as a school project: a sister site to the old MiniClip homepage. That first version had jokey copy next to each game and tightly cropped pictures of the characters. A later version of the site was mostly lists — latest, hot, A to Z, every game they had. This draft tries to keep both of those things, only every game is about life in the city.</p>
        <p>Some of the games you can play now. The rest are still in the shop.</p>
        <h2>A couple of questions</h2>
        <p>If you have a minute, I’d like to know:</p>
        <ul>
          <li>Does this feel like an old games site, or just a copy of one?</li>
          <li>Should more of the games be playable for the next draft?</li>
        </ul>
        <p>If you want your game on the site, send a note through the <a href="send.html">send to a friend</a> page and say so in the message. No promises, but we’ll look.</p>
      </div>'''
    return page("About Us - NYClip", body, here="about")

def signup():
    body = '''      <div class="inner">
        <h1>Sign Up</h1>
        <p>Join our free mailing list and we’ll tell you when the new NYClips are out.</p>
        <form class="form" onsubmit="return signUp(this);">
          <p><label>Your name</label><input type="text" name="name"></p>
          <p><label>Your email</label><input type="email" name="email"></p>
          <p><input class="btn" type="submit" value="Submit"></p>
        </form>
      </div>
<script>
function signUp(f) {
  var v = f.email.value || "";
  if (!/\\S+@\\S+\\.\\S+/.test(v)) {
    alert("Please make sure your email address is in the format yourname@company.com.");
    return false;
  }
  alert("Thanks! You’re on the list.");
  return false;
}
</script>'''
    return page("Sign Up - NYClip", body, here="signup")

def send_page():
    opts = "\n".join(f'            <option value="{g["id"]}">{esc(g["title"])}</option>' for g in GAMES)
    body = f'''      <div class="inner">
        <h1>Send To A Friend</h1>
        <p>Send a NYClip to a friend, the old fashioned way.</p>
        <form class="form" onsubmit="return sendClip(this);">
          <p><label>Your email</label><input type="email" name="from"></p>
          <p><label>Your friend’s email</label><input type="email" name="to"></p>
          <p><label>Which game?</label>
            <select name="game" id="gameSelect">
{opts}
            </select>
          </p>
          <p><label>A short message</label><textarea name="msg"></textarea></p>
          <p><input class="btn" type="submit" value="Send"></p>
        </form>
      </div>
<script>
(function() {{
  var q = new URLSearchParams(location.search);
  var id = q.get("game");
  if (id) {{
    var s = document.getElementById("gameSelect");
    if (s) s.value = id;
  }}
}})();
function sendClip(f) {{
  var a = f.from.value || "";
  var b = f.to.value || "";
  var ok = /\\S+@\\S+\\.\\S+/;
  if (!ok.test(a) || !ok.test(b)) {{
    alert("Please make sure both email addresses are in the format yourname@company.com.");
    return false;
  }}
  alert("Your NYClip has been sent! (Or it would have been, if this were 2001.)");
  return false;
}}
</script>'''
    return page("Send To A Friend - NYClip", body, here="send")

def games_page():
    # two-column list of every game
    rows = []
    for i in range(0, len(GAMES), 2):
        cells = []
        for g in GAMES[i:i+2]:
            tag = " <i>you can play this one</i>" if g["playable"] else ""
            cells.append(f'''          <td>
            <a href="game.html?id={g["id"]}"><img src="img/thumbs/{g["id"]}.png" alt="{esc(g["title"])}"></a>
            <a class="gtitle" href="game.html?id={g["id"]}">{esc(g["title"])}</a>{tag}<br>
            <span class="blurb">{esc(g["blurb"])}</span>
            <div class="clear"></div>
          </td>''')
        if len(cells) == 1:
            cells.append("          <td></td>")
        rows.append("        <tr>\n" + "\n".join(cells) + "\n        </tr>")
    body = f'''      <div class="inner">
        <h1>All Games</h1>
        <p>The full list. Two of them you can play right now. The others are still warming up.</p>
        <table class="gamelist" cellspacing="0" cellpadding="0">
{"".join(rows)}
        </table>
      </div>'''
    return page("All Games - NYClip", body, here="games")

def game_pages_js():
    """Single template page that fills in from a query string."""
    # embed game data as JS
    import json
    data = json.dumps([
        {
            "id": g["id"],
            "title": g["title"],
            "blurb": g["blurb"],
            "playable": g["playable"],
            "script": g.get("script", ""),
            "hint": g.get("hint", ""),
        }
        for g in GAMES
    ], ensure_ascii=False)
    body = f'''      <div class="inner" id="gamepage">
        <p>Loading…</p>
      </div>
<script>
var GAMES = {data};
(function () {{
  var q = new URLSearchParams(location.search);
  var id = q.get("id");
  var g = null;
  for (var i = 0; i < GAMES.length; i++) if (GAMES[i].id === id) g = GAMES[i];
  var box = document.getElementById("gamepage");
  if (!g) {{
    box.innerHTML = "<h1>Game not found</h1><p>That clip isn’t on the site. See the <a href=\\"games.html\\">full list</a>.</p>";
    document.title = "Game not found - NYClip";
    return;
  }}
  document.title = g.title + " - NYClip";
  var play;
  if (g.playable) {{
    play = '<div class="playbox"><canvas id="game" width="520" height="340"></canvas><div class="hint">' + g.hint + '</div></div>';
  }} else {{
    play = '<div class="playbox"><div class="coming"><b>This game is still in the shop.</b><br><br>The picture and the blurb are here. The game itself is coming in a later draft. In the meantime, try <a href="game.html?id=everything-bagel" style="white-space:nowrap">Everything Bagel</a> or <a href="game.html?id=rooftop-run" style="white-space:nowrap">Rooftop Run</a>.</div></div>';
  }}
  box.innerHTML =
    '<table class="gamehead" cellspacing="0" cellpadding="0"><tr>' +
    '<td style="width:140px"><img src="img/thumbs/' + g.id + '.png" alt=""></td>' +
    '<td><h1>' + g.title + '</h1><div class="blurb-lg">' + g.blurb + '</div>' +
    '<a class="sendlink" href="send.html?game=' + g.id + '">send to a friend</a>' +
    ' &nbsp; <a class="sendlink" href="games.html">list all games</a></td></tr></table>' +
    play;
  if (g.script) {{
    var s = document.createElement("script");
    s.src = g.script;
    document.body.appendChild(s);
  }}
}})();
</script>'''
    return page("Game - NYClip", body, here="games")

def write(name, content):
    path = os.path.join(ROOT, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("wrote", name)

if __name__ == "__main__":
    write("index.html", index())
    write("about.html", about())
    write("signup.html", signup())
    write("send.html", send_page())
    write("games.html", games_page())
    write("game.html", game_pages_js())
    print("pages done")
