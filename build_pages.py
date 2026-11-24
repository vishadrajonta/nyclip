#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, html as htmllib, json

ROOT = os.path.dirname(os.path.abspath(__file__))
V = "7"

def asset(path):
    return f"{path}?v={V}"


# Figma example blurbs for Subway Shuffle, Everything Bagel, and Rooftop Run stay verbatim.
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
        "id": "logo-builder",
        "title": "Logo Builder",
        "blurb": "The Yankees N is on the floor and the Y is upside down. Put the logo back together and we’ll tell you how close you got.",
        "playable": True,
        "col": "new",
        "place": "the merch table",
        "script": asset("js/logo-builder.js"),
        "dom": True,
        "hint": "Drag the pieces. Click one, then rotate (Q / E) and scale (− / =). Press Done when you think you’ve got it.",
        "thumb": "thumb-lg",
    },
    {
        "id": "midtown-drive",
        "title": "Midtown Drive",
        "blurb": "Twenty-five blocks of Midtown, 33rd to 57th. Race the other cabs for a fare uptown, or take a free drive. These cabs are heavy, so don’t brake in the corner.",
        "playable": True,
        "col": "new",
        "place": "Midtown, 33rd to 57th",
        "embed": "midtown-drive.html",
        "hint": "Click the game, then use arrow keys or WASD. Space is the hand brake.",
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
        "id": "coffee-regular",
        "title": "Coffee Regular",
        "blurb": "A regular means milk and sugar. Say latte at the cart and you’re walking to the next one.",
        "playable": False,
        "col": "left",
        "place": "the corner cart",
        "thumb": "thumb-sm",
    },
]

def esc(s):
    return htmllib.escape(s, quote=True)

def awning():
    # slightly uneven blue / orange stripes
    widths = [18, 22, 16, 24, 19, 21, 17, 23, 20, 18, 22, 16, 25, 19, 21, 17, 23, 20, 18, 22, 16, 24, 19, 21, 20, 18, 22, 17, 23, 19, 21, 16, 24, 20]
    cells = []
    for i, w in enumerate(widths):
        color = "#003da5" if i % 2 == 0 else "#ff6600"
        cells.append(f'<td bgcolor="{color}" width="{w}">&nbsp;</td>')
    return '<div class="awning"><table cellspacing="0" cellpadding="0"><tr>' + "".join(cells) + "</tr></table></div>"

NAV = [
    ("index.html", "Home", "home", "1", "b-1"),
    ("games.html", "All Games", "games", "6", "b-6"),
    ("guestbook.html", "Guestbook", "guestbook", "G", "b-G"),
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
        <h1><a href="index.html">NYC.exe</a></h1>
        <div class="tag">nothing's equivalent to the N.Y. state of mind &mdash; Nas</div>
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
          <td><marquee behavior="scroll" direction="left" scrollamount="3">Stand clear of the closing doors, please. &nbsp;·&nbsp; Logo Builder, Midtown Drive, Everything Bagel, and Rooftop Run are running. The other games are delayed. &nbsp;·&nbsp; The 6 is local. &nbsp;·&nbsp; Mind the gap.</marquee></td>
        </tr></table>
      </div>
    </td>
  </tr>'''

def footer():
    return '''  <tr>
    <td>
      <div class="bestview">Best viewed in 800×600 with Internet Explorer or Netscape Navigator.</div>
      <div class="footer">
        <span class="copy">&copy; 2026 NYC.exe</span>
        <a href="index.html">Home</a> &nbsp;·&nbsp;
        <a href="games.html">All Games</a> &nbsp;·&nbsp;
        <a href="guestbook.html">Guestbook</a> &nbsp;·&nbsp;
        <a href="signup.html">Sign Up</a> &nbsp;·&nbsp;
        <a href="about.html">About</a> &nbsp;·&nbsp;
        <a href="send.html">Send to a friend</a>
        <div class="please">Stand clear of the closing doors, please. Last updated November 24, 2026.</div>
      </div>
    </td>
  </tr>'''

def page(title, body, here="", extra_head=""):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{esc(title)}</title>
  <meta name="description" content="NYC.exe: funny free games about life in New York City. Send them to a friend or put them on your website.">
  <meta name="viewport" content="width=800">
  <link rel="stylesheet" href="{asset("css/nyc.css")}">
  <link rel="icon" type="image/png" href="{asset("img/favicon.png")}">
{extra_head}</head>
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
            <td class="thumb {g.get("thumb","thumb-md")}"><a href="game.html?id={g["id"]}"><img src="{asset("img/thumbs/" + g["id"] + ".png")}" alt="{esc(g["title"])}"></a></td>
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

def dialup_overlay():
    return f'''<div id="dialup" class="dialup">
  <div class="dialwin">
    <div class="dialtitle">Connecting to NYC.exe</div>
    <div class="dialbody">
      <p class="dialfine">New York Online  •  Local access: 718</p>
      <p id="dialstatus">Ready to dial the city.<br>Click Connect when you hear the modem. Or say you do.</p>
      <div class="dialbar"><div id="dialprog"></div></div>
      <div class="dialbtns">
        <a href="#" id="dialskip">Skip</a>
        <button type="button" id="dialconnect">Connect</button>
      </div>
    </div>
  </div>
  <audio id="dialaudio" src="{asset("audio/modem.wav")}" preload="auto"></audio>
</div>
<script src="{asset("js/dialup.js")}"></script>
'''

def index():
    left = [g for g in GAMES if g["col"] == "left"]
    news = [g for g in GAMES if g["col"] == "new"]
    left_html = "\n".join(game_row(g) for g in left)
    new_html = ""
    for g in news:
        new_html += f'''
          <div class="newblock">
            <div class="newflag">NEW!</div>
            <a href="game.html?id={g["id"]}"><img src="{asset("img/thumbs/" + g["id"] + ".png")}" alt="{esc(g["title"])}"></a><br>
            <a class="gtitle" href="game.html?id={g["id"]}">{esc(g["title"])}</a>
            <div class="place">{esc(g["place"])}</div>
          </div>'''
    body = f'''      {dialup_overlay()}
      <table class="cols" cellspacing="0" cellpadding="0">
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
              <h2>Welcome to NYC.exe</h2>
              <p>Funny free games about life in New York City. Send them to your friends or put them on your website. Mind the gap.</p>
            </div>
{new_html}
            <div class="mail">
              <h3>Join the FREE mailing list</h3>
              <form action="signup.html" method="get" onsubmit="return checkMail(this);">
                <input type="text" name="email" size="18">
                <br>
                <input type="submit" value="Submit" class="btn">
              </form>
              <div class="fine">We’ll tell you when the new NYC.exe games are out. No spam, we barely have time to swipe in.</div>
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
  var v = f.email.value;
  if (!v || v.indexOf("@") < 0) {{ alert("Please type a real email address."); return false; }}
  alert("Thanks! You’ll get the new NYC.exe games when they drop.");
  return false;
}}
</script>'''
    extra = '''  <script>
  (function(){
    var q = /(?:\\?|&)dialup=1(?:&|$)/.test(location.search);
    var skip = /(?:\\?|&)skipdial=1(?:&|$)/.test(location.search);
    try {
      if (skip) sessionStorage.setItem("nyc_exe_connected", "1");
      if ((skip || sessionStorage.getItem("nyc_exe_connected")) && !q) {
        document.documentElement.className += " connected";
      }
    } catch (e) {}
  })();
  </script>
'''
    return page("NYC.exe", body, here="home", extra_head=extra)

def about():
    body = '''      <div class="inner">
        <div class="stationsign"><span class="bullet b-7">7</span>ABOUT</div>
        <h1>About NYC.exe</h1>
        <p>NYC.exe is a free games site about everyday life in New York City. Funny little games, short blurbs, pictures you can send to a friend. The kind of site you might have left open in a browser window in 2001.</p>
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
    return page("About Us - NYC.exe", body, here="about")

def signup():
    body = '''      <div class="inner">
        <div class="stationsign"><span class="bullet b-N">N</span>SIGN UP</div>
        <h1>Sign Up</h1>
        <p>Join the free mailing list and we’ll tell you when the new NYC.exe games are out.</p>
        <form class="form" onsubmit="return signUp(this);">
          <p><label>Your name</label><input type="text" name="name"></p>
          <p><label>Email</label><input type="text" name="email"></p>
          <p><input type="submit" value="Sign me up" class="btn"></p>
        </form>
      </div>
<script>
function signUp(f) {
  if (!f.email.value || f.email.value.indexOf("@") < 0) { alert("Please type a real email address."); return false; }
  alert("Thanks! You’ll get the new NYC.exe games when they drop.");
  return false;
}
</script>'''
    return page("Sign Up - NYC.exe", body, here="signup")

def send_page():
    opts = "\n".join(f'            <option value="{g["id"]}">{esc(g["title"])}</option>' for g in GAMES)
    body = f'''      <div class="inner">
        <div class="stationsign"><span class="bullet b-A">A</span>SEND TO A FRIEND</div>
        <h1>Send To A Friend</h1>
        <p>Send a game from NYC.exe to a friend, the old fashioned way.</p>
        <form class="form" onsubmit="return sendIt(this);">
          <p><label>Your name</label><input type="text" name="from"></p>
          <p><label>Friend’s email</label><input type="text" name="to"></p>
          <p><label>Which game</label>
            <select name="game">
{opts}
            </select>
          </p>
          <p><label>A short note</label><textarea name="note"></textarea></p>
          <p><input type="submit" value="Send" class="btn"></p>
        </form>
      </div>
<script>
(function(){{
  var q = location.search.match(/game=([^&]+)/);
  if (q) {{
    var sel = document.querySelector("select[name=game]");
    if (sel) sel.value = decodeURIComponent(q[1]);
  }}
}})();
function sendIt(f) {{
  if (!f.to.value || f.to.value.indexOf("@") < 0) {{ alert("Please type a real email address."); return false; }}
  alert("Your NYC.exe game has been sent! (Or it would have been, if this were 2001.)");
  return false;
}}
</script>'''
    return page("Send To A Friend - NYC.exe", body, here="send")

def games_page():
    rows = []
    for i in range(0, len(GAMES), 2):
        cells = []
        for g in GAMES[i:i+2]:
            tag = " <span class=\"tag\">you can play this one</span>" if g["playable"] else ""
            place = f'<div class="place">{esc(g["place"])}</div>' if g.get("place") else ""
            cells.append(f'''          <td>
            <a href="game.html?id={g["id"]}"><img src="{asset("img/thumbs/" + g["id"] + ".png")}" alt="{esc(g["title"])}"></a>
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
        <p>The full list. Four of them you can play right now. The others are delayed. Check back.</p>
        <table class="gamelist" cellspacing="0" cellpadding="0">
{"".join(rows)}
        </table>
      </div>'''
    return page("All Games - NYC.exe", body, here="games")

GUESTBOOK = [
    ("Mar 14, 2001", "xXstoopkingXx", "Bushwick",
     "Finally a games site that understands the emotional journey of waiting for the 4 and 5 while the 6 comes three times. I rated Subway Shuffle 10/10 and then missed my stop in real life."),
    ("May 2, 2001", "RegularEddie", "Gramercy",
     "A regular is milk and sugar. I don't care what they started charging on 2nd Avenue. If I wanted foam I would have moved to Seattle. The cart on my corner still gets it, and so does this website."),
    ("Jun 18, 2001", "landlady72", "Upper West Side",
     "To the tenant in 4B: the rent is the rent. The heat is a luxury. Stop leaving notes on the boiler. It can read. Also please stop printing this site at the copy shop on Amsterdam. Ink is not included."),
    ("Aug 9, 2001", "sir_ratscroft", "Chinatown",
     "Saw a rat take the F train one stop and get off at East Broadway like he paid. He had a transfer. I did not. Respect is a two-way street and only one of us is winning."),
    ("Nov 3, 2001", "floor12broker", "Midtown",
     "Great site. Quick question, is the banner inventory available for a publicly traded elevator company? We are disrupting vertical transit. Synergies. Please advise. Also I live in the office now. The plants are doing fine."),
    ("Jan 22, 2002", "staten_ferry_dave", "St. George",
     "Before you ask, yes I am from Staten Island, no I will not fight you, yes the ferry is free, no I am not bringing a car, and Midtown Drive doesn't even go over the bridge, which is honestly on brand."),
    ("Apr 4, 2002", "bodegaCatManagement", "East Village",
     "The cat does not work here. The cat is middle management. You will receive your bacon egg and cheese when he says so. He has been with the company longer than the register, and the register still has prices from 1996."),
    ("Jul 19, 2002", "missed_the_L", "Williamsburg",
     "Does anyone else's loft have a skylight, a DJ, and no kitchen? Asking for a roommate who is a brand. He is 24 and already retiring from being 24. He said this site is 'so now' and then asked what year it is."),
    ("Sep 1, 2002", "path_not_mta", "Jersey City",
     "I will not apologize for the Devils. I will apologize for the PATH at 1 a.m. Different crimes. If Logo Builder has me putting the Devils logo together I am taking the tunnel anyway."),
    ("Feb 14, 2003", "swipe_mystic", "Jackson Heights",
     "Swiped three times, the turnstile said please enjoy your trip, and then it didn't open. This is between me and God and the 7 train. I am signing the guestbook from the booth, where a man is selling me a new card that is also dying."),
    ("Jun 29, 2003", "midtownFare", "Hell's Kitchen",
     "Played Midtown Drive. Hit every yellow cab on 11th Avenue on purpose. In this economy they would have cut me off anyway. The fare was going to JFK in their mind and to 57th Street in mine."),
    ("Oct 11, 2003", "canal.wholesale", "Chinatown",
     "Those Yankees hats on the table are real. The realness is a sliding scale. $10 cash, I don't make change, I don't take questions, I was never here, and if you pick the wrong one in the game that is a you problem."),
    ("Mar 8, 2004", "not_a_tourist", "Times Square",
     "If anyone needs directions I can point you to the museum that is actually a store, the store that is actually a museum, and a two-hour line for a pretzel that costs as much as my first apartment, which was also a store."),
    ("Aug 21, 2004", "alternateSideAngel", "Park Slope",
     "Moved the car at 8:59, circled until 11, found a legal spot in another borough, and still got a ticket from a sign that was facing the trees. 10/10 authentic New York gaming. Would play again, already have to tomorrow."),
]

def guestbook():
    rows = []
    for i, (when, who, where, msg) in enumerate(GUESTBOOK):
        alt = ' class="alt"' if i % 2 else ""
        rows.append(
            f'        <tr{alt}><td class="when">{esc(when)}</td><td><div class="who">{esc(who)}</div>'
            f'<div class="where">{esc(where)}</div></td><td>{esc(msg)}</td></tr>'
        )
    body = f'''      <div class="inner">
        <div class="stationsign"><span class="bullet b-G">G</span>GUESTBOOK</div>
        <h1>Guestbook</h1>
        <p>People keep leaving notes. We keep them in the order they arrived, more or less. Frank downstairs says he is “watching the inbox.”</p>
        <table class="gbook" cellspacing="0" cellpadding="0">
          <tr><th>Date</th><th>From</th><th>Message</th></tr>
{chr(10).join(rows)}
        </table>
        <div class="powered">Powered by GuestWorld 3.1 &nbsp;·&nbsp; You are visitor number 002847 &nbsp;·&nbsp; Please keep it clean (Frank’s rule, not ours)</div>
        <div class="gbsign">
          <h2>Sign the guestbook</h2>
          <form class="form" onsubmit="return signGuest(this);">
            <p><label>Handle</label><input type="text" name="handle"></p>
            <p><label>Neighborhood</label><input type="text" name="place"></p>
            <p><label>Your message</label><textarea name="msg"></textarea></p>
            <p><input type="submit" value="Sign the book" class="btn"></p>
          </form>
        </div>
      </div>
<script>
function signGuest(f) {{
  alert("Thanks. Your entry has been sent to a guy named Frank who hasn't checked this inbox since 2002. Try again never.");
  return false;
}}
</script>'''
    return page("Guestbook - NYC.exe", body, here="guestbook")

def game_pages_js():
    data = json.dumps([
        {
            "id": g["id"],
            "title": g["title"],
            "blurb": g["blurb"],
            "playable": g["playable"],
            "place": g.get("place", ""),
            "script": g.get("script", ""),
            "hint": g.get("hint", ""),
            "embed": g.get("embed", ""),
            "dom": g.get("dom", False),
        }
        for g in GAMES
    ])
    body = f'''      <div class="inner" id="box"></div>
<script>
var GAMES = {data};
(function(){{
  var q = location.search.match(/id=([^&]+)/);
  var id = q ? decodeURIComponent(q[1]) : "";
  var g = null, i;
  for (i = 0; i < GAMES.length; i++) if (GAMES[i].id === id) g = GAMES[i];
  var box = document.getElementById("box");
  if (!g) {{
    document.title = "Game not found - NYC.exe";
    box.innerHTML = '<div class="stationsign"><span class="bullet b-6">6</span>NOW PLAYING</div><p>We cannot find that game. It may still be in the shop. <a href="games.html">List all games</a>.</p>';
    return;
  }}
  document.title = g.title + " - NYC.exe";
  var play;
  if (g.embed) {{
    play = '<div class="playbox"><iframe id="gameframe" class="driveframe" src="' + g.embed + '" width="640" height="420" tabindex="0" title="' + g.title + '"></iframe><div class="hint">' + g.hint + '</div></div>';
  }} else if (g.playable && g.dom) {{
    play = '<div class="playbox"><div id="logogame" class="logogame"></div><div class="hint">' + g.hint + '</div></div>';
  }} else if (g.playable) {{
    play = '<div class="playbox"><canvas id="game" width="520" height="340"></canvas><div class="hint">' + g.hint + '</div></div>';
  }} else {{
    play = '<div class="playbox"><div class="coming"><b>This game is still in the shop.</b><br><br>The picture and the blurb are here. The game itself is coming in a later draft. In the meantime, try <a href="game.html?id=logo-builder" style="white-space:nowrap">Logo Builder</a>, <a href="game.html?id=midtown-drive" style="white-space:nowrap">Midtown Drive</a>, <a href="game.html?id=everything-bagel" style="white-space:nowrap">Everything Bagel</a>, or <a href="game.html?id=rooftop-run" style="white-space:nowrap">Rooftop Run</a>.</div></div>';
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
  if (g.embed) {{
    var fr = document.getElementById("gameframe");
    function focusDrive() {{ try {{ fr.contentWindow.focus(); }} catch (e) {{}} }}
    if (fr) {{
      fr.addEventListener("load", focusDrive);
      fr.addEventListener("pointerdown", focusDrive);
      box.addEventListener("click", focusDrive);
    }}
  }}
  if (g.script) {{
    var s = document.createElement("script");
    s.src = g.script;
    document.body.appendChild(s);
  }}
}})();
</script>'''
    return page("Game - NYC.exe", body, here="games")

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
    write("guestbook.html", guestbook())
    print("pages done")
