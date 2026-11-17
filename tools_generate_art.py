#!/usr/bin/env python3
"""Simple cropped thumbs in a 2001 Flash-still style. Transparent backgrounds."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os, random

ROOT = os.path.dirname(os.path.abspath(__file__))
THUMBS = os.path.join(ROOT, "img", "thumbs")
HERO = os.path.join(ROOT, "img")
os.makedirs(THUMBS, exist_ok=True)

FONT_BI = "/usr/share/fonts/truetype/liberation/LiberationSans-BoldItalic.ttf"
FONT_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_COMIC = "/usr/share/fonts/truetype/sand-box/google/Comic Neue/ComicNeue-Bold.ttf"
FONT_COMICI = "/usr/share/fonts/truetype/sand-box/google/Comic Neue/ComicNeue-BoldItalic.ttf"

def font(path, size):
    return ImageFont.truetype(path, size)

def new(w, h):
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))

def circ(d, xy, fill, outline=None, width=2):
    d.ellipse(xy, fill=fill, outline=outline, width=width if outline else 0)

def rect(d, xy, fill, outline=None, width=2):
    d.rounded_rectangle(xy, radius=3, fill=fill, outline=outline, width=width if outline else 0)

def line(d, xy, fill, width=2):
    d.line(xy, fill=fill, width=width)

def text_stroke(d, xy, text, fnt, fill, stroke=(20, 20, 40, 230), sw=2):
    d.text(xy, text, font=fnt, fill=fill, stroke_width=sw, stroke_fill=stroke)

def title(im, lines, color, x, y, size=22, rot=0, anchor="mm"):
    """Paint a goofy game title onto the illustration."""
    fnt = font(FONT_COMICI, size)
    tmp = new(im.width, im.height)
    d = ImageDraw.Draw(tmp)
    yy = y
    for i, line in enumerate(lines if isinstance(lines, (list, tuple)) else [lines]):
        # measure
        bbox = d.textbbox((0, 0), line, font=fnt, stroke_width=3)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        text_stroke(d, (x, yy), line, fnt, color, stroke=(20, 20, 50, 240), sw=3)
        yy += th - 2
    if rot:
        tmp = tmp.rotate(rot, resample=Image.Resampling.BICUBIC, expand=False)
    im.alpha_composite(tmp)
    return im

def person(d, cx, cy, scale=1.0, skin=(255, 214, 170, 255), hair=(40, 28, 20, 255),
           shirt=(40, 90, 180, 255), pants=(40, 40, 60, 255), facing=1):
    """Very simple standing / running person."""
    s = scale
    # head
    circ(d, [cx - 10*s, cy - 28*s, cx + 10*s, cy - 8*s], skin, (60, 40, 30, 255), 1)
    # hair
    circ(d, [cx - 10*s, cy - 32*s, cx + 10*s, cy - 18*s], hair, None)
    # body
    rect(d, [cx - 11*s, cy - 8*s, cx + 11*s, cy + 16*s], shirt, (20, 20, 40, 200), 1)
    # legs
    rect(d, [cx - 10*s, cy + 15*s, cx - 1*s, cy + 32*s], pants, (20, 20, 40, 200), 1)
    rect(d, [cx + 1*s, cy + 15*s, cx + 10*s, cy + 32*s], pants, (20, 20, 40, 200), 1)
    # arms
    ax = cx + 14*s*facing
    line(d, [(cx + 8*s*facing, cy - 2*s), (ax, cy + 10*s)], shirt, max(2, int(3*s)))

def save(im, name, also_hero=True):
    # tight-ish crop already designed in frame; maybe a slight shadow
    path = os.path.join(THUMBS, name + ".png")
    im.save(path)
    print("wrote", path, im.size)
    return im

# ---------- individual games ----------

def subway_shuffle():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # subway car wall
    rect(d, [18, 30, 182, 150], (40, 160, 70, 255), (20, 80, 40, 255), 3)
    # window
    rect(d, [30, 42, 100, 100], (180, 210, 230, 255), (30, 60, 40, 255), 2)
    # tunnel dark in window
    rect(d, [34, 46, 96, 96], (30, 40, 50, 255))
    # a bit of tile / pole
    rect(d, [118, 30, 128, 150], (200, 200, 190, 255), (80, 80, 70, 255), 1)
    # packed people
    person(d, 55, 118, 1.0, shirt=(200, 50, 50, 255), hair=(30, 20, 15, 255))
    person(d, 80, 122, 0.95, shirt=(240, 220, 80, 255), hair=(90, 50, 20, 255), skin=(210, 160, 110, 255))
    person(d, 150, 120, 1.05, shirt=(50, 70, 160, 255), hair=(15, 15, 15, 255), facing=-1)
    # 6 train bullet
    circ(d, [150, 40, 182, 72], (0, 150, 80, 255), (255, 255, 255, 255), 2)
    text_stroke(d, (166, 56), "6", font(FONT_B, 22), (255, 255, 255, 255), (0, 80, 40, 255), 1)
    title(im, ["Subway", "Shuffle"], (255, 230, 60, 255), 70, 28, size=20, rot=-6)
    # the titles I drew with xy as center but text() isn't centered... fix by leaving as leftish
    return im

def everything_bagel():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # counter
    rect(d, [10, 130, 190, 170], (180, 140, 90, 255), (100, 70, 40, 255), 2)
    # bagel
    cx, cy, r = 100, 100, 48
    circ(d, [cx-r, cy-r, cx+r, cy+r], (210, 170, 90, 255), (140, 90, 40, 255), 3)
    circ(d, [cx-18, cy-18, cx+18, cy+18], (0, 0, 0, 0), (140, 90, 40, 255), 3)
    # punch hole with a manual clear
    hole = Image.new("L", im.size, 0)
    hd = ImageDraw.Draw(hole)
    hd.ellipse([cx-16, cy-16, cx+16, cy+16], fill=255)
    # actually keep a cream hole instead of transparent so it reads as a bagel
    circ(d, [cx-16, cy-16, cx+16, cy+16], (255, 245, 220, 255), (140, 90, 40, 255), 2)
    # seeds
    rnd = random.Random(3)
    for _ in range(40):
        ang = rnd.random() * 6.28
        rad = 22 + rnd.random() * 22
        x = cx + math.cos(ang) * rad
        y = cy + math.sin(ang) * rad
        col = rnd.choice([(40, 30, 20, 255), (80, 60, 30, 255), (220, 220, 210, 255), (200, 80, 40, 255)])
        d.ellipse([x-2, y-1, x+2, y+2], fill=col)
    # cream cheese smear
    d.pieslice([cx-30, cy-8, cx+10, cy+18], 200, 40, fill=(240, 240, 210, 255))
    # little green scallion flecks
    for _ in range(8):
        x = cx - 20 + rnd.random()*24
        y = cy - 4 + rnd.random()*14
        d.line([(x, y), (x+4, y-2)], fill=(40, 140, 50, 255), width=2)
    title(im, ["Everything", "Bagel"], (255, 80, 40, 255), 18, 8, size=22, rot=-4)
    return im

def rooftop_run():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # sky
    # buildings
    rect(d, [10, 80, 70, 170], (70, 70, 90, 255), (30, 30, 40, 255), 2)
    rect(d, [68, 100, 130, 170], (90, 85, 100, 255), (30, 30, 40, 255), 2)
    rect(d, [128, 70, 190, 170], (60, 65, 85, 255), (30, 30, 40, 255), 2)
    # windows
    for bx, by, bw, rows in [(16, 88, 48, 4), (74, 108, 50, 3), (134, 78, 50, 5)]:
        for r in range(rows):
            for c in range(3):
                x = bx + c*16
                y = by + r*16
                d.rectangle([x, y, x+8, y+8], fill=(255, 220, 120, 255) if (r+c)%3 else (40, 50, 70, 255))
    # water tower
    rect(d, [84, 48, 116, 102], (160, 90, 50, 255), (80, 40, 20, 255), 2)
    # tank
    d.ellipse([78, 28, 122, 62], fill=(150, 80, 45, 255), outline=(80, 40, 20, 255), width=2)
    # legs of tower already body
    # person leaping
    person(d, 50, 70, 0.9, shirt=(255, 60, 60, 255), pants=(30, 30, 50, 255), hair=(20, 15, 10, 255))
    # motion lines
    line(d, [(20, 70), (36, 68)], (255, 255, 255, 180), 2)
    title(im, ["Rooftop", "Run"], (80, 220, 255, 255), 20, 6, size=22, rot=3)
    return im

def taxi_dash():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # street
    rect(d, [0, 130, 200, 180], (60, 60, 65, 255))
    line(d, [(0, 150), (200, 150)], (255, 220, 60, 255), 3)
    # dashed
    for x in range(8, 200, 24):
        line(d, [(x, 150), (x+10, 150)], (60, 60, 65, 255), 3)
    # taxi body
    rect(d, [30, 80, 170, 128], (255, 200, 0, 255), (40, 30, 0, 255), 2)
    # hump
    d.ellipse([70, 58, 130, 100], fill=(255, 200, 0, 255), outline=(40, 30, 0, 255), width=2)
    rect(d, [70, 80, 130, 100], (255, 200, 0, 255))
    # windows
    rect(d, [78, 64, 122, 86], (140, 200, 230, 255), (40, 30, 0, 255), 1)
    # nyc taxi medallion light
    rect(d, [92, 50, 108, 62], (255, 255, 200, 255), (40, 30, 0, 255), 1)
    # wheels
    circ(d, [48, 116, 78, 146], (20, 20, 20, 255), (80, 80, 80, 255), 2)
    circ(d, [122, 116, 152, 146], (20, 20, 20, 255), (80, 80, 80, 255), 2)
    # TAXI text
    text_stroke(d, (70, 98), "TAXI", font(FONT_B, 16), (20, 20, 20, 255), (20, 20, 20, 0), 0)
    title(im, ["Taxi Dash"], (255, 255, 255, 255), 18, 8, size=24, rot=-3)
    return im

def alternate_side():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # street
    rect(d, [0, 120, 200, 180], (80, 80, 85, 255))
    # curb
    rect(d, [0, 110, 200, 122], (160, 160, 150, 255))
    # parked car
    rect(d, [20, 80, 120, 125], (30, 80, 160, 255), (10, 30, 60, 255), 2)
    d.ellipse([30, 58, 75, 95], fill=(30, 80, 160, 255), outline=(10, 30, 60, 255), width=2)
    rect(d, [38, 66, 70, 88], (160, 210, 230, 255), (10, 30, 60, 255), 1)
    circ(d, [32, 112, 56, 136], (20, 20, 20, 255))
    circ(d, [86, 112, 110, 136], (20, 20, 20, 255))
    # street sweeper
    rect(d, [130, 70, 190, 128], (255, 140, 0, 255), (80, 40, 0, 255), 2)
    circ(d, [138, 118, 160, 140], (20, 20, 20, 255))
    circ(d, [168, 118, 190, 140], (20, 20, 20, 255))
    # broom
    circ(d, [124, 120, 150, 146], (80, 80, 70, 255), (40, 40, 30, 255), 1)
    # sign
    rect(d, [168, 8, 176, 70], (180, 180, 180, 255))
    rect(d, [148, 8, 196, 48], (200, 40, 40, 255), (255, 255, 255, 255), 2)
    text_stroke(d, (152, 14), "NO", font(FONT_B, 11), (255, 255, 255, 255), (200, 40, 40, 0), 0)
    text_stroke(d, (150, 26), "PARK", font(FONT_B, 10), (255, 255, 255, 255), (0, 0, 0, 0), 0)
    title(im, ["Alternate", "Side"], (255, 230, 80, 255), 12, 8, size=20, rot=-5)
    return im

def coffee_regular():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # cart
    rect(d, [30, 70, 170, 140], (40, 80, 170, 255), (20, 30, 80, 255), 2)
    rect(d, [30, 60, 170, 80], (30, 50, 120, 255), (20, 30, 80, 255), 2)
    # umbrella
    d.pieslice([10, 8, 190, 90], 180, 0, fill=(220, 40, 40, 255), outline=(80, 10, 10, 255), width=2)
    line(d, [(100, 10), (100, 70)], (80, 60, 40, 255), 3)
    # cups
    for x in (50, 80, 110):
        rect(d, [x, 88, x+22, 118], (255, 255, 255, 255), (80, 80, 80, 255), 1)
        rect(d, [x+2, 88, x+20, 96], (40, 40, 40, 255))  # lid
    # steam
    for x, y in ((60, 70), (90, 66), (120, 72)):
        d.arc([x, y, x+10, y+16], 200, 20, fill=(255, 255, 255, 200), width=2)
    title(im, ["Coffee", "Regular"], (255, 255, 220, 255), 14, 100, size=20, rot=0)
    return im

def walk_up():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # brownstone
    rect(d, [40, 20, 170, 170], (150, 70, 45, 255), (80, 30, 20, 255), 2)
    # stoop
    for i, y in enumerate((140, 150, 160)):
        rect(d, [20-i*4, y, 80, y+12], (180, 90, 60, 255), (80, 30, 20, 255), 1)
    # door
    rect(d, [70, 80, 110, 150], (40, 30, 25, 255), (20, 15, 10, 255), 2)
    circ(d, [98, 110, 106, 118], (200, 170, 50, 255))
    # windows
    rect(d, [50, 36, 80, 70], (180, 210, 230, 255), (80, 30, 20, 255), 2)
    rect(d, [120, 36, 150, 70], (180, 210, 230, 255), (80, 30, 20, 255), 2)
    # person with couch
    rect(d, [8, 100, 55, 124], (120, 70, 40, 255), (40, 20, 10, 255), 2)  # couch arm
    person(d, 30, 128, 0.85, shirt=(80, 140, 200, 255), hair=(30, 20, 10, 255))
    title(im, ["Walk-Up"], (255, 240, 180, 255), 16, 8, size=24, rot=-4)
    return im

def scaffolding_maze():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # sidewalk shed
    # green pipes
    for x in (20, 70, 120, 170):
        rect(d, [x, 20, x+10, 170], (40, 140, 70, 255), (20, 70, 35, 255), 2)
    # crossbars
    for y in (30, 80, 140):
        rect(d, [16, y, 184, y+10], (40, 140, 70, 255), (20, 70, 35, 255), 1)
    # plywood roof
    rect(d, [10, 8, 190, 28], (180, 150, 90, 255), (80, 60, 30, 255), 2)
    # dark tunnel
    rect(d, [30, 40, 70, 170], (30, 40, 35, 200))
    rect(d, [80, 40, 120, 170], (25, 30, 30, 180))
    person(d, 100, 130, 0.9, shirt=(255, 80, 40, 255), hair=(20, 15, 10, 255))
    title(im, ["Scaffolding", "Maze"], (255, 230, 80, 255), 16, 36, size=20, rot=0)
    return im

def stoop_sale():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # stoop
    rect(d, [40, 40, 170, 80], (200, 90, 70, 255), (100, 40, 30, 255), 2)
    rect(d, [30, 80, 180, 110], (200, 90, 70, 255), (100, 40, 30, 255), 2)
    rect(d, [20, 110, 190, 145], (200, 90, 70, 255), (100, 40, 30, 255), 2)
    rect(d, [10, 145, 200, 175], (180, 80, 60, 255), (100, 40, 30, 255), 2)
    # door
    rect(d, [90, 10, 130, 80], (40, 25, 20, 255))
    # stuff
    # lamp
    circ(d, [40, 88, 70, 118], (255, 230, 120, 255), (80, 60, 20, 255), 2)
    line(d, [(55, 118), (55, 145)], (80, 60, 20, 255), 3)
    # toaster
    rect(d, [90, 120, 130, 145], (160, 160, 165, 255), (60, 60, 60, 255), 2)
    # tape box
    rect(d, [145, 118, 185, 150], (140, 90, 40, 255), (60, 40, 15, 255), 2)
    # price tag
    rect(d, [48, 70, 78, 88], (255, 255, 180, 255), (40, 40, 40, 255), 1)
    text_stroke(d, (52, 72), "$2", font(FONT_B, 12), (200, 0, 0, 255), (0, 0, 0, 0), 0)
    title(im, ["Stoop Sale"], (255, 255, 100, 255), 10, 4, size=22, rot=-6)
    return im

def metrocard_swipe():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # turnstile
    rect(d, [20, 40, 70, 170], (80, 90, 100, 255), (30, 30, 40, 255), 2)
    circ(d, [40, 20, 110, 90], (70, 80, 90, 255), (30, 30, 40, 255), 3)
    # arm
    line(d, [(75, 55), (150, 40)], (50, 50, 55, 255), 8)
    line(d, [(75, 55), (155, 80)], (50, 50, 55, 255), 8)
    line(d, [(75, 55), (130, 110)], (50, 50, 55, 255), 8)
    # yellow metrocard
    card = [(90, 100), (175, 85), (182, 125), (97, 140)]
    d.polygon(card, fill=(255, 220, 0, 255), outline=(80, 60, 0, 255))
    text_stroke(d, (108, 108), "MTA", font(FONT_B, 14), (0, 60, 150, 255), (0, 0, 0, 0), 0)
    title(im, ["MetroCard", "Swipe"], (80, 180, 255, 255), 14, 8, size=20, rot=4)
    return im

def deli_counter():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # case
    rect(d, [10, 90, 190, 160], (200, 200, 210, 255), (80, 80, 90, 255), 2)
    rect(d, [10, 80, 190, 100], (160, 200, 230, 180), (80, 80, 90, 255), 2)  # glass
    # meats / salads in case
    colors = [(180, 60, 60, 255), (200, 160, 80, 255), (80, 140, 70, 255), (220, 200, 160, 255), (160, 80, 60, 255)]
    for i, c in enumerate(colors):
        x = 20 + i*32
        d.ellipse([x, 108, x+28, 148], fill=c, outline=(80, 40, 30, 255), width=1)
    # ticket
    rect(d, [130, 20, 188, 80], (230, 80, 70, 255), (80, 20, 20, 255), 2)
    text_stroke(d, (142, 24), "NOW", font(FONT_B, 11), (255, 255, 255, 255), (0, 0, 0, 0), 0)
    text_stroke(d, (138, 42), "47", font(FONT_B, 28), (255, 255, 255, 255), (0, 0, 0, 0), 0)
    # sandwich
    rect(d, [30, 50, 90, 78], (230, 200, 140, 255), (120, 80, 40, 255), 2)
    rect(d, [32, 60, 88, 70], (80, 140, 60, 255))
    title(im, ["Deli", "Counter"], (255, 240, 180, 255), 14, 8, size=22, rot=-3)
    return im

def tourist_trap():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # bright billboards
    rect(d, [8, 8, 90, 70], (220, 30, 40, 255), (40, 0, 0, 255), 2)
    rect(d, [92, 8, 192, 55], (40, 80, 220, 255), (0, 0, 80, 255), 2)
    rect(d, [100, 58, 190, 100], (255, 200, 0, 255), (80, 60, 0, 255), 2)
    text_stroke(d, (18, 22), "LIVE", font(FONT_B, 20), (255, 255, 255, 255), (0, 0, 0, 0), 0)
    text_stroke(d, (102, 16), "SHOW", font(FONT_B, 16), (255, 255, 255, 255), (0, 0, 0, 0), 0)
    text_stroke(d, (108, 68), "TOURS", font(FONT_B, 14), (40, 20, 0, 255), (0, 0, 0, 0), 0)
    # red stairs / street
    rect(d, [0, 130, 200, 180], (50, 50, 55, 255))
    # tkts booth style red
    rect(d, [30, 100, 90, 150], (180, 20, 30, 255), (80, 0, 0, 255), 2)
    # tourist
    person(d, 130, 128, 1.0, shirt=(255, 255, 255, 255), pants=(40, 70, 140, 255), hair=(220, 180, 80, 255))
    # camera
    rect(d, [142, 100, 162, 114], (30, 30, 30, 255))
    title(im, ["Tourist", "Trap"], (255, 80, 180, 255), 16, 100, size=22, rot=4)
    return im

def fire_escape():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # brick wall
    rect(d, [20, 10, 180, 175], (150, 60, 50, 255), (80, 25, 20, 255), 2)
    # bricks suggested
    for y in range(14, 170, 14):
        line(d, [(22, y), (178, y)], (120, 45, 40, 180), 1)
    # window
    rect(d, [70, 30, 130, 90], (180, 210, 230, 255), (40, 20, 15, 255), 3)
    line(d, [(100, 30), (100, 90)], (40, 20, 15, 255), 2)
    # fire escape
    # landings
    rect(d, [40, 100, 160, 112], (30, 30, 30, 255), (10, 10, 10, 255), 1)
    rect(d, [40, 150, 160, 162], (30, 30, 30, 255), (10, 10, 10, 255), 1)
    # rails
    for x in (44, 156):
        line(d, [(x, 70), (x, 162)], (20, 20, 20, 255), 3)
    line(d, [(44, 78), (156, 78)], (20, 20, 20, 255), 3)
    # stairs
    line(d, [(50, 112), (140, 150)], (20, 20, 20, 255), 3)
    # plate of food
    circ(d, [80, 86, 110, 108], (240, 240, 230, 255), (80, 80, 80, 255), 1)
    d.ellipse([86, 90, 104, 104], fill=(200, 80, 40, 255))
    # pigeon
    d.ellipse([150, 88, 172, 102], fill=(160, 160, 165, 255), outline=(60, 60, 60, 255), width=1)
    d.ellipse([166, 86, 178, 96], fill=(160, 160, 165, 255))
    title(im, ["Fire Escape"], (255, 230, 100, 255), 16, 8, size=22, rot=-3)
    return im

def crosswalk_chicken():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # asphalt
    rect(d, [0, 40, 200, 180], (50, 50, 55, 255))
    # stripes
    for i in range(6):
        x = 20 + i*30
        rect(d, [x, 50, x+16, 170], (240, 240, 230, 255))
    # don't walk sign
    rect(d, [150, 4, 190, 50], (20, 20, 20, 255), (80, 80, 80, 255), 2)
    # orange hand / figure
    rect(d, [162, 12, 178, 42], (255, 80, 20, 255))
    circ(d, [160, 8, 180, 24], (255, 80, 20, 255))
    # taxi nose
    rect(d, [0, 70, 40, 115], (255, 200, 0, 255), (40, 30, 0, 255), 2)
    circ(d, [8, 105, 32, 128], (20, 20, 20, 255))
    # walker
    person(d, 100, 110, 1.15, shirt=(40, 40, 200, 255), pants=(30, 30, 30, 255), hair=(20, 15, 10, 255), facing=1)
    title(im, ["Crosswalk", "Chicken"], (255, 230, 40, 255), 10, 8, size=20, rot=-4)
    return im

def laundromat_roulette():
    im = new(200, 180)
    d = ImageDraw.Draw(im)
    # machines
    for i, x in enumerate((18, 78, 138)):
        rect(d, [x, 40, x+50, 160], (200, 200, 210, 255), (80, 80, 90, 255), 2)
        circ(d, [x+8, 70, x+42, 120], (40, 80, 140, 255), (40, 40, 50, 255), 3)
        # inner glass swirl
        d.arc([x+14, 76, x+36, 114], 20, 220, fill=(180, 220, 255, 255), width=3)
        # panel
        rect(d, [x+8, 46, x+42, 64], (40, 40, 50, 255))
        d.ellipse([x+14, 50, x+26, 62], fill=(40, 200, 60, 255) if i != 1 else (200, 40, 40, 255))
    # pile of clothes
    d.ellipse([70, 140, 140, 175], fill=(80, 120, 200, 255), outline=(30, 40, 80, 255), width=1)
    d.ellipse([90, 148, 150, 178], fill=(200, 60, 70, 255), outline=(80, 20, 20, 255), width=1)
    title(im, ["Laundromat", "Roulette"], (255, 100, 180, 255), 12, 4, size=18, rot=-3)
    return im

def make_logo():
    """NYClip wordmark, MiniClip-ish italic sans, transparent bg."""
    w, h = 320, 90
    im = new(w, h)
    d = ImageDraw.Draw(im)
    fnt = font(FONT_BI, 64)
    # slight shadow
    d.text((18, 8), "NY", font=fnt, fill=(0, 0, 0, 80))
    d.text((16, 6), "NY", font=fnt, fill=(255, 255, 255, 255))
    # measure NY
    ny = d.textbbox((16, 6), "NY", font=fnt)
    cx = ny[2] - 6
    d.text((cx+2, 8), "Clip", font=fnt, fill=(0, 0, 0, 80))
    d.text((cx, 6), "Clip", font=fnt, fill=(50, 170, 255, 255))
    # underline under NY, like the old MiniClip mark
    d.line([(18, ny[3] - 4), (ny[2] - 4, ny[3] - 4)], fill=(255, 255, 255, 230), width=3)
    im.save(os.path.join(HERO, "logo.png"))
    print("logo", im.size)
    # also a smaller nav-sized one is the same file
    # favicon
    fav = Image.new("RGBA", (32, 32), (0, 51, 102, 255))
    fd = ImageDraw.Draw(fav)
    ff = font(FONT_BI, 16)
    fd.text((2, 4), "NY", font=ff, fill=(255, 255, 255, 255))
    fav.save(os.path.join(HERO, "favicon.png"))
    # ico-less; we'll link png
    return im

GAMES = [
    ("subway-shuffle", subway_shuffle),
    ("everything-bagel", everything_bagel),
    ("rooftop-run", rooftop_run),
    ("taxi-dash", taxi_dash),
    ("alternate-side", alternate_side),
    ("coffee-regular", coffee_regular),
    ("walk-up", walk_up),
    ("scaffolding-maze", scaffolding_maze),
    ("stoop-sale", stoop_sale),
    ("metrocard-swipe", metrocard_swipe),
    ("deli-counter", deli_counter),
    ("tourist-trap", tourist_trap),
    ("fire-escape", fire_escape),
    ("crosswalk-chicken", crosswalk_chicken),
    ("laundromat-roulette", laundromat_roulette),
]

if __name__ == "__main__":
    random.seed(1)
    make_logo()
    for name, fn in GAMES:
        im = fn()
        save(im, name)
    print("done")
