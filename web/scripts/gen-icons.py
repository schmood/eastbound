#!/usr/bin/env python3
"""Generate Eastbound PWA icons — a coral route winding across a spruce field.
   Run once; the PNGs are committed so the Docker build needs no rasterizer.
   Requires Pillow:  pip install Pillow"""
import os
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "icons")
os.makedirs(OUT, exist_ok=True)

SPRUCE      = (47, 125, 68)    # --spruce
SPRUCE_DEEP = (29, 84, 48)     # --spruce-deep
CORAL       = (207, 95, 55)    # --coral
CREAM       = (247, 243, 236)  # --paper

def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))

def render(size, full_bleed=True):
    # supersample for smooth edges
    S = size * 4
    img = Image.new("RGB", (S, S), SPRUCE)
    d = ImageDraw.Draw(img)

    # diagonal spruce gradient
    for y in range(S):
        d.line([(0, y), (S, y)], fill=lerp(SPRUCE, SPRUCE_DEEP, y / S))

    # subtle highlight bloom, top-right
    bloom = Image.new("L", (S, S), 0)
    bd = ImageDraw.Draw(bloom)
    bd.ellipse([S * 0.30, -S * 0.45, S * 1.45, S * 0.70], fill=46)
    bloom = bloom.filter(ImageFilter.GaussianBlur(S * 0.06))
    img.paste(Image.new("RGB", (S, S), (255, 255, 255)), (0, 0), bloom)

    # the route — a gentle S across the safe zone
    pts = [
        (S * 0.24, S * 0.78),
        (S * 0.40, S * 0.56),
        (S * 0.34, S * 0.40),
        (S * 0.52, S * 0.30),
        (S * 0.76, S * 0.22),
    ]
    lw = int(S * 0.052)
    d.line(pts, fill=CORAL, width=lw, joint="curve")
    # round the line caps
    for (x, y) in (pts[0], pts[-1]):
        r = lw / 2
        d.ellipse([x - r, y - r, x + r, y + r], fill=CORAL)

    # waypoint dots — cream with a coral ring at the destination
    for i, (x, y) in enumerate(pts):
        r = S * (0.050 if i in (0, len(pts) - 1) else 0.034)
        d.ellipse([x - r, y - r, x + r, y + r], fill=CREAM)
    # accent the final waypoint with a coral core
    fx, fy = pts[-1]
    rc = S * 0.024
    d.ellipse([fx - rc, fy - rc, fx + rc, fy + rc], fill=CORAL)

    return img.resize((size, size), Image.LANCZOS)

for size in (192, 512):
    render(size).save(os.path.join(OUT, f"icon-{size}.png"))
render(180).save(os.path.join(OUT, "apple-touch-icon.png"))
render(32).save(os.path.join(OUT, "favicon-32.png"))
print("icons written to", os.path.normpath(OUT))
