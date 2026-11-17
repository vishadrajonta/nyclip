#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, html as htmllib, json

ROOT = os.path.dirname(os.path.abspath(__file__))
V = "5"

def asset(path):
    return f"{path}?v={V}"


# Four Figma example blurbs stay verbatim. Two extras kept from the first draft.
GAMES = [
    {
        "id": "subway-shuffle",
        "title": "Subway Shuffle",
        "blurb": "Don’t miss your stop",
        "playable": False,
        "col": "left",
        "place": "on the 6",
        "thumb": "thumb-md",
    },
    {
        "id": "midtown-drive",
        "title": "Midtown Drive",
        "blurb": "Twenty-five blocks of Midtown, 33rd to 57th. Race the other cabs for a fare uptown, or take a free drive. These cabs are heavy, so don’t brake in the corner.",
        "playable": True,
        "col": "new",
        "place": "Midtown, 33rd to 57th",
        "page": "midtown-drive.html",
        "hint": "Opens in its own page. Arrow keys or WASD to drive.",
        "thumb": "thumb-lg",
    },
    {
        "id": "everything-bagel",
        "title": "Everything Bagel",
        "blurb": "You’re working rush hour at the trendy local bagel shop - catch toppings as they fall and don’t mess up any orders!",
        "playable": True,
        "col": "new",
        "place": "the bagel shop",
        "script": asset("js/bagel.js"),
        "hint": "Arrow keys or the mouse move the bagel. Catch only what the ticket says.",
        "thumb": "thumb-lg",
    },
    {
        "id": "rooftop-run",
        "title": "Rooftop Run",
        "blurb": "Cross Midtown without touching the ground.",
        "playable": True,
        "col": "new",
        "place": "Midtown",
        "script": asset("js/rooftop.js"),
        "hint": "Space bar or click to jump. Don’t touch the street.",
        "thumb": "thumb-md",
    },
    {
        "id": "taxi-dash",
        "title": "Taxi Dash",
        "blurb": "A fare is waiting uptown and five other cabs want it. Get there first and step on it!",
        "playable": False,
        "col": "left",
        "place": "uptown",
        "thumb": "thumb-lg",
    },
    {
        "id": "coffee-regular",
        "title": "Coffee Regular",
        "blurb": "A regular means milk and sugar. Say latte at the cart and you’re walking to the next one.",
        "playable": False,
        "col": "left",
        "place": "the corner cart",
        "thumb": "thumb-sm",
    },
    {
        "id": "metrocard-swipe",
        "title": "MetroCard Swipe",
        "blurb": "The turnstile is hungry and your card is dying. Swipe it right, or get in line for a new one.",
        "playable": False,
        "col": "left",
        "place": "every station",
        "thumb": "thumb-md",
    },
]

def esc(s):
    return htmllib.escape(s, quote=True)

def awning():
    # slightly uneven red / green bodega stripes
    widths = [18, 22, 16, 24, 19, 21, 17, 23, 20, 18, 22, 16, 25, 19, 21, 17, 23, 20, 18, 22, 16, 24, 19, 21, 20, 18, 22, 17, 23, 19, 21, 16, 24, 20]
    cells = []
    for i, w in enumerate(widths):
        color = "#cc1f2e" if i % 2 == 0 else "#1f7a3a"
        cells.append(f'<td bgcolor="{color}" width="{w}">&nbsp;</td>')
    return '<div class="awning"><table cellspacing="0" cellpadding="0"><tr>' + "".join(cells) + "</tr></table></div>"

NAV = [
    ("index.html", "Home", "home", "1", "b-1"),
    ("games.html", "All Games", "games", "6", "b-6"),
    ("signup.html", "Sign Up", "signup", "N", "b-N"),
    ("send.html", "Send", "send", "A", "b-A"),
    ("about.html", "About", "about", "7", "b-7"),
]

def nav(here=""):
    cells = []
    for href, label, key, letter, cls in NAV:
        mark = ' class="here"' if key == here else ""
        cells.append(
            f'<td><a href="{href}"{mark}><span class="bullet {cls}">{letter}</span><br>{label}</a></td>'
        )
    return '<table class="nav" align="center" cellspacing="0" cellpadding="0"><tr>' + "".join(cells) + "</tr></table>"

def header(here=""):
    return f'''  <tr>
    <td>
      {awning()}
      <div class="mast">
        <h1><a href="index.html">NYClip</a></h1>
        <div class="tag">funny free games about life in the city</div>
      </div>
      <div class="skyline">
        <img src="{asset('img/skyline.png')}" alt="New York skyline" width="800" height="100">
      </div>
      <div class="navwrap">
        {nav(here)}
      </div>
      <div class="marquee-bar">
        <table cellspacing="0" cellpadding="0"><tr>
          <td class="svc-label">SERVICE CHANGE</td>
          <td><marquee behavior="alternate" scrollamount="3">Stand clear of the closing doors, please. &nbsp;·&nbsp; Everything Bagel, Rooftop Run, and Midtown Drive are running. The other games are delayed. &nbsp;·&nbsp; The 6 is local. &nbsp;·&nbsp; Mind the gap.</marquee></td>
        </tr></table>
      </div>
    </td>
  </tr>'''

def footer():
    return '''  <tr>
    <td>
      <div class="bestview">Best viewed in 800×600 with Internet Explorer or Netscape Navigator.</div>
      <div class="footer">
        <span class="copy">&copy; 2026 NYClip</span>
        <a href="index.html">Home</a> &nbsp;·&nbsp;
        <a href="games.html">All Games</a> &nbsp;·&nbsp;
        <a href="signup.html">Sign Up</a> &nbsp;·&nbsp;
        <a href="about.html">About</a> &nbsp;·&nbsp;
        <a href="send.html">Send to a friend</a>
        <div class="please">Stand clear of the closing doors, please. Last updated November 17, 2026.</div>
      </div>
    </td>
  </tr>'''

def page(title, body, here=""):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{esc(title)}</title>
  <meta name="description" content="NYClip: funny free games about life in New York City. Send them to a friend or put them on your website.">
  <meta name="viewport" content="width=800">
  <link rel="stylesheet" href="{asset("css/nyc.css")}">
  <link rel="icon" type="image/png" href="{asset("img/favicon.png")}">
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
</body>
</html>
'''

def game_row(g, show_send=True):
    send = f'<br><a class="sendlink" href="send.html?game={g["id"]}">send to a friend</a>' if show_send else ""
    tag = ' <span class="tag">play!</span>' if g["playable"] else ""
    place = f'<div class="place">{esc(g["place"])}</div>' if g.get("place") else ""
    return f'''        <table class="gamerow" cellspacing="0" cellpadding="0">
          <tr>
            <td class="thumb {g.get("thumb","thumb-md")}"><a href="game.html?id={g["id"]}"><img src="{asset('img/thumbs/' + g['id'] + '.png')}" alt="{esc(g["title"])}"></a></td>
            <td>
              <a class="gtitle" href="game.html?id={g["id"]}">{esc(g["title"])}</a>{tag}
              {place}
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

def counter(num="002847"):
    imgs = "".join(f'<img src="{asset("img/digits/" + d + ".png")}" alt="{d}" width="14" height="22">' for d in num)
    return f'''            <div class="counter">
              You are visitor number<br>
              {imgs}
            </div>'''

def index():
    left = [g for g in GAMES if g["col"] == "left"]
    news = [g for g in GAMES if g["col"] == "new"]
    left_html = "\n".join(game_row(g) for g in left)
    new_html = ""
    for g in news:
        new_html += f'''
          <div class="newblock">
            <div class="newflag">NEW!</div>
            <a href="game.html?id={g["id"]}"><img src="{asset('img/thumbs/' + g['id'] + '.png')}" alt="{esc(g["title"])}"></a><br>
            <a class="gtitle" href="game.html?id={g["id"]}">{esc(g["title"])}</a>
            <div class="place">{esc(g["place"])}</div>
          </div>'''
    body = f'''      <table class="cols" cellspacing="0" cellpadding="0">
        <tr>
          <td class="col-left">
            <div class="stationsign"><span class="bullet b-6">6</span>GAMES</div>
{left_html}
            <div class="leftnote">
              <b>Got a game?</b><br>
              If you want your stuff on this website, <a href="about.html">click here</a>.
            </div>
          </td>
          <td class="col-mid">
            <div class="welcome">
              <h2>Welcome to NYClip</h2>
              <p>Funny free games about life in New York City. Send them to your friends or put them on your website. Mind the gap.</p>
            </div>
{new_html}
            <div class="mail">
              <h3>Join the FREE mailing list</h3>
              <form action="signup.html" method="get" onsubmit="return checkMail(this);">
                <input type="email" name="email">
                <br>
                <input class="btn" type="submit" value="Submit">
              </form>
              <div class="fine">We’ll tell you when the new NYClips are out. No spam, we barely have time to swipe in.</div>
            </div>
          </td>
          <td class="col-right">
            <div class="stationsign"><span class="bullet b-A">A</span>ALL GAMES</div>
            <ul class="alllist">
{all_games_list()}
            </ul>
{counter()}
          </td>
        </tr>
      </table>
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
        <div class="stationsign"><span class="bullet b-7">7</span>ABOUT</div>
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
        <div class="stationsign"><span class="bullet b-N">N</span>SIGN UP</div>
        <h1>Sign Up</h1>
        <p>Join the free mailing list and we’ll tell you when the new NYClips are out.</p>
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
        <div class="stationsign"><span class="bullet b-A">A</span>SEND TO A FRIEND</div>
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
    rows = []
    for i in range(0, len(GAMES), 2):
        cells = []
        for g in GAMES[i:i+2]:
            tag = " <span class=\"tag\">you can play this one</span>" if g["playable"] else ""
            place = f'<div class="place">{esc(g["place"])}</div>' if g.get("place") else ""
            cells.append(f'''          <td>
            <a href="game.html?id={g["id"]}"><img src="{asset('img/thumbs/' + g['id'] + '.png')}" alt="{esc(g["title"])}"></a>
            <a class="gtitle" href="game.html?id={g["id"]}">{esc(g["title"])}</a>{tag}
            {place}
            <span class="blurb">{esc(g["blurb"])}</span>
            <div class="clear"></div>
          </td>''')
        if len(cells) == 1:
            cells.append("          <td></td>")
        rows.append("        <tr>\n" + "\n".join(cells) + "\n        </tr>")
    body = f'''      <div class="inner">
        <div class="stationsign"><span class="bullet b-6">6</span>ALL GAMES</div>
        <h1>All Games</h1>
        <p>The full list. Three of them you can play right now. The others are delayed. Check back.</p>
        <table class="gamelist" cellspacing="0" cellpadding="0">
{"".join(rows)}
        </table>
      </div>'''
    return page("All Games - NYClip", body, here="games")

def game_pages_js():
    data = json.dumps([
        {
            "id": g["id"],
            "title": g["title"],
            "blurb": g["blurb"],
            "place": g.get("place", ""),
            "playable": g["playable"],
            "script": g.get("script", ""),
            "page": g.get("page", ""),
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
  if (g.page) {{
    play = '<div class="playbox"><div class="coming"><b>This one needs the whole window.</b><br><br><a href="' + g.page + '" style="white-space:nowrap">Play ' + g.title + '</a><div class="hint" style="margin-top:8px">' + g.hint + '</div></div></div>';
  }} else if (g.playable) {{
    play = '<div class="playbox"><canvas id="game" width="520" height="340"></canvas><div class="hint">' + g.hint + '</div></div>';
  }} else {{
    play = '<div class="playbox"><div class="coming"><b>This game is still in the shop.</b><br><br>The picture and the blurb are here. The game itself is coming in a later draft. In the meantime, try <a href="game.html?id=everything-bagel" style="white-space:nowrap">Everything Bagel</a>, <a href="game.html?id=rooftop-run" style="white-space:nowrap">Rooftop Run</a>, or <a href="game.html?id=midtown-drive" style="white-space:nowrap">Midtown Drive</a>.</div></div>';
  }}
  var place = g.place ? '<div class="place">' + g.place + '</div>' : '';
  box.innerHTML =
    '<div class="stationsign"><span class="bullet b-6">6</span>NOW PLAYING</div>' +
    '<table class="gamehead" cellspacing="0" cellpadding="0"><tr>' +
    '<td style="width:140px"><img src="img/thumbs/' + g.id + '.png?v={V}" alt=""></td>' +
    '<td><h1>' + g.title + '</h1>' + place + '<div class="blurb-lg">' + g.blurb + '</div>' +
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
