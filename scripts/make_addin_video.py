# Adapted from the earlier tool-walkthrough generator; renders public/videos/<slug>.mp4 from src/data/addins.js.
import json, math, subprocess, sys, textwrap, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

import imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe()
HERE = os.path.dirname(os.path.abspath(__file__))
# usage: python make_addin_video.py <index> <out.mp4> <tools.json>
TOOLS = json.load(open(sys.argv[3], encoding="utf8"))
IDX = int(sys.argv[1])
OUT = sys.argv[2]
T = TOOLS[IDX]
W, H, FPS = 1280, 720, 30

def font(names, size):
    for n in names:
        try: return ImageFont.truetype(n, size)
        except Exception: pass
    return ImageFont.load_default()
SANS = lambda s: font(["segoeui.ttf", "arial.ttf"], s)
SEMI = lambda s: font(["seguisb.ttf", "segoeuib.ttf", "arialbd.ttf"], s)
SERIF = lambda s: font(["georgiab.ttf", "georgia.ttf"], s)
MONO = lambda s: font(["consola.ttf", "cour.ttf"], s)

BG = (11, 16, 32); PANEL = (17, 26, 46); RAISED = (24, 35, 59); LINE = (40, 52, 78)
INK = (241, 245, 249); MUTED = (148, 163, 184); DIM = (100, 116, 139)
BLUE = (110, 168, 254); SKY = (125, 211, 252); INDIGO = (129, 140, 248)
MINT = (45, 212, 191); GREEN = (52, 211, 153); AMBER = (251, 191, 36); ROSE = (251, 113, 133)
KIND = {"actor": AMBER, "app": BLUE, "service": INDIGO, "data": MINT}

def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def ease(x): x = clamp(x); return 1 - (1 - x) ** 3
def lerp(a, b, k): return tuple(int(a[i] + (b[i] - a[i]) * clamp(k)) for i in range(3))

bg = Image.new("RGB", (W, H), BG)
gl = Image.new("RGB", (W, H), BG); g = ImageDraw.Draw(gl)
g.ellipse([-340, -460, 740, 320], fill=(20, 40, 90)); g.ellipse([800, -400, 1700, 260], fill=(34, 32, 84))
bg = Image.blend(bg, gl.filter(ImageFilter.GaussianBlur(110)), 0.55)

def rr(d, box, r, fill=None, outline=None, w=1): d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=w)
def txt(d, xy, s, f, fill, anchor="la"): d.text(xy, s, font=f, fill=fill, anchor=anchor)
_dm = ImageDraw.Draw(Image.new("RGB", (4, 4)))
def wrap(s, f, width):
    out, cur = [], ""
    for wd in s.split():
        trial = (cur + " " + wd).strip()
        if _dm.textlength(trial, font=f) <= width: cur = trial
        else: out.append(cur); cur = wd
    if cur: out.append(cur)
    return out

# ------------------------------------------------------------------ sections
steps = T["steps"]; decisions = T["decisions"]; outcome = T["outcome"]
S_TITLE = 4.0
S_PROB = 7.5
S_OUT = 3.0 + 2.6 * len(outcome)
S_ARCH = 2.0 + 4.6 * len(steps)
S_DEC = 2.0 + 3.8 * len(decisions)
S_BUILD = 9.0
S_OUTRO = 4.0
SECS = []
c = 0.0
for name, dur in [("title", S_TITLE), ("problem", S_PROB), ("outcome", S_OUT), ("arch", S_ARCH), ("dec", S_DEC), ("build", S_BUILD), ("outro", S_OUTRO)]:
    SECS.append((name, c, c + dur)); c += dur
DUR = c
LABELS = {"title": "", "problem": "The problem", "outcome": "What it does", "arch": "How it works", "dec": "Design decisions", "build": "Build it yourself", "outro": ""}

def header(d, sec, t):
    txt(d, (56, 34), f"ADD-IN TOOL {IDX + 1} OF {len(TOOLS)}", MONO(16), SKY)
    txt(d, (56, 58), T["name"], SEMI(22), INK)
    if LABELS[sec]:
        rr(d, [W - 290, 34, W - 56, 72], 19, outline=LINE, w=2)
        txt(d, (W - 173, 53), LABELS[sec].upper(), MONO(15), MUTED, "mm")
    # progress
    order = ["problem", "outcome", "arch", "dec", "build"]
    for i, k in enumerate(order):
        on = sec == k
        d.rounded_rectangle([56 + i * 34, 96, 56 + i * 34 + (26 if on else 12), 100], radius=2, fill=BLUE if on else (LINE if sec not in order[:i] else LINE))

def scene_title(d, t):
    d.rectangle([0, 0, 14, H], fill=SKY)
    txt(d, (90, 160), f"ADD-IN TOOL {IDX + 1} OF {len(TOOLS)}  |  {T['kind'].upper()}", MONO(22), SKY)
    for i, line in enumerate(wrap(T["name"], SERIF(84), 1000)):
        txt(d, (90, 210 + i * 100), line, SERIF(84), INK)
    y = 210 + len(wrap(T["name"], SERIF(84), 1000)) * 100 + 14
    a = ease((t - 0.2) / 0.6)
    for line in wrap(T["tagline"], SANS(30), 1000):
        txt(d, (90, y), line, SANS(30), lerp(BG, MUTED, max(a, 1.0 if t == 0 else a))); y += 42
    x = 90; y += 24
    for s in T["stack"]:
        f = MONO(19); w = _dm.textlength(s, font=f) + 30
        rr(d, [x, y, x + w, y + 40], 20, fill=PANEL, outline=LINE, w=2); txt(d, (x + w / 2, y + 20), s, f, SKY, "mm"); x += w + 12
    txt(d, (90, H - 70), "Animated walkthrough  |  no client information", MONO(17), DIM)

def bullets(d, items, t, y0, size=28, gap=16, step=0.9, width=1050):
    y = y0
    for i, s in enumerate(items):
        a = ease((t - i * step) / 0.5)
        lines = wrap(s, SANS(size), width)
        col = lerp(BG, INK, a)
        d.ellipse([56, y + 12, 70, y + 26], fill=lerp(BG, BLUE, a))
        for j, l in enumerate(lines):
            txt(d, (92, y + j * (size + 10)), l, SANS(size), col)
        y += len(lines) * (size + 10) + gap

def scene_problem(d, t):
    header(d, "problem", t)
    lines = wrap(T["problem"], SANS(32), 1040)
    bot = 190 + len(lines) * 50 + 30
    rr(d, [56, 150, W - 56, bot], 20, fill=PANEL, outline=LINE, w=2)
    d.rectangle([56, 172, 62, bot - 22], fill=ROSE)
    for i, l in enumerate(lines):
        a = ease((t - 0.3 - i * 0.55) / 0.6)
        txt(d, (100, 190 + i * 50), l, SANS(32), lerp(PANEL, INK, a))

def scene_outcome(d, t):
    header(d, "outcome", t)
    tl = wrap(T["tagline"], SEMI(28), 1150)[:2]
    for j, l in enumerate(tl):
        txt(d, (56, 150 + j * 38), l, SEMI(28), SKY)
    y0 = 150 + len(tl) * 38 + 44
    size = 30
    for cand in (30, 28, 26, 24, 22):
        need = sum(len(wrap(o, SANS(cand), 1050)) * (cand + 10) + 20 for o in outcome)
        size = cand
        if y0 + need <= H - 30:
            break
    bullets(d, outcome, t - 0.6, y0, size=size, gap=20, step=2.4)

def box_geom():
    nodes = T["diagram"]["nodes"]; cols = T["diagram"]["cols"]; rows = T["diagram"]["rows"]
    ax0, ax1, ay0, ay1 = 70, W - 70, 130, 440
    cw = (ax1 - ax0) / cols; rh = (ay1 - ay0) / rows
    g = {}
    for n in nodes:
        cx = ax0 + cw * (n["col"] + 0.5); cy = ay0 + rh * (n["row"] + 0.5)
        w = min(cw - 30, 240); h = 104
        g[n["id"]] = (cx, cy, w, h)
    return g

def edge_pts(a, b):
    ax, ay, aw, ah = a; bx, by, bw, bh = b
    dx, dy = bx - ax, by - ay
    def clip(cx, cy, w, h, dx, dy):
        sx = (w / 2) / abs(dx) if dx else 1e9
        sy = (h / 2) / abs(dy) if dy else 1e9
        k = min(sx, sy)
        return cx + dx * k, cy + dy * k
    p1 = clip(ax, ay, aw + 10, ah + 10, dx, dy)
    p2 = clip(bx, by, bw + 10, bh + 10, -dx, -dy)
    return p1, p2

def arrow(d, p, q, col, w):
    d.line([p, q], fill=col, width=w)
    ang = math.atan2(q[1] - p[1], q[0] - p[0])
    for s in (-0.5, 0.5):
        d.line([q, (q[0] - 16 * math.cos(ang + s), q[1] - 16 * math.sin(ang + s))], fill=col, width=w)

def scene_arch(d, t):
    header(d, "arch", t)
    G = box_geom(); nodes = {n["id"]: n for n in T["diagram"]["nodes"]}; edges = T["diagram"]["edges"]
    intro = 2.0
    si = -1 if t < intro else min(len(steps) - 1, int((t - intro) // 4.6))
    local = 0 if si < 0 else (t - intro) - si * 4.6
    active_n = set(steps[si]["nodes"]) if si >= 0 else set()
    active_e = set(steps[si]["edges"]) if si >= 0 else set()
    for ei, e in enumerate(edges):
        p, q = edge_pts(G[e["from"]], G[e["to"]])
        on = ei in active_e
        arrow(d, p, q, SKY if on else LINE, 4 if on else 2)
        if e.get("both"): arrow(d, q, p, SKY if on else LINE, 4 if on else 2)
        if e.get("label") and math.hypot(q[0] - p[0], q[1] - p[1]) > _dm.textlength(e["label"], font=MONO(14)) + 40:
            mx, my = (p[0] + q[0]) / 2, (p[1] + q[1]) / 2
            f = MONO(14); w = _dm.textlength(e["label"], font=f) + 16
            rr(d, [mx - w / 2, my - 12, mx + w / 2, my + 12], 12, fill=BG, outline=SKY if on else LINE, w=1)
            txt(d, (mx, my), e["label"], f, SKY if on else DIM, "mm")
        if on:
            k = (local * 0.5) % 1.0
            px, py = p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k
            d.ellipse([px - 7, py - 7, px + 7, py + 7], fill=AMBER)
    for i, (nid, (cx, cy, w, h)) in enumerate(G.items()):
        n = nodes[nid]
        a = ease((t - i * 0.18) / 0.5)
        on = nid in active_n
        col = KIND[n["kind"]]
        box = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2]
        if on:
            rr(d, [box[0] - 6, box[1] - 6, box[2] + 6, box[3] + 6], 20, outline=lerp(BG, SKY, 0.55 + 0.3 * math.sin(t * 6)), w=3)
        rr(d, box, 16, fill=lerp(BG, RAISED if on else PANEL, a), outline=lerp(BG, col if on else LINE, a), w=2)
        d.rounded_rectangle([box[0], box[1], box[2], box[1] + 6], radius=3, fill=lerp(BG, col, a * (1 if on else 0.55)))
        lab = wrap(n["label"], SEMI(20), w - 20)[:2]
        yy = cy - 22 - (len(lab) - 1) * 12
        for l in lab:
            txt(d, (cx, yy), l, SEMI(20), lerp(BG, INK if on else MUTED, a), "mm"); yy += 25
        for l in wrap(n.get("sub", ""), SANS(16), w - 16)[:2]:
            txt(d, (cx, yy + 4), l, SANS(16), lerp(BG, MUTED if on else DIM, a), "mm"); yy += 19
    # caption
    rr(d, [56, 470, W - 56, 690], 20, fill=PANEL, outline=LINE, w=2)
    if si < 0:
        txt(d, (90, 520), "Click to result: how the pieces fit together", SEMI(30), INK)
        txt(d, (90, 570), "Amber = person  |  Blue = app  |  Indigo = service  |  Mint = data", SANS(22), MUTED)
    else:
        s = steps[si]; a = ease(local / 0.4)
        rr(d, [90, 496, 90 + 128, 532], 18, fill=lerp(PANEL, BLUE, 0.25)); txt(d, (154, 514), f"STEP {si + 1} OF {len(steps)}", MONO(15), lerp(PANEL, SKY, a), "mm")
        txt(d, (238, 514), s["title"], SEMI(28), lerp(PANEL, INK, a), "lm")
        for j, l in enumerate(wrap(s["text"], SANS(22), 1080)[:4]):
            txt(d, (90, 552 + j * 30), l, SANS(22), lerp(PANEL, MUTED, a))

def scene_dec(d, t):
    header(d, "dec", t)
    txt(d, (56, 140), "Why it is built this way", SEMI(30), SKY)
    for i, dc in enumerate(decisions):
        a = ease((t - 0.5 - i * 3.8) / 0.5)
        if a <= 0: continue
        cur = i == min(len(decisions) - 1, int(max(0, t - 0.5) // 3.8))
        y = 196 + i * 124
        rr(d, [56, y, W - 56, y + 118], 16, fill=lerp(BG, RAISED if cur else PANEL, a), outline=lerp(BG, BLUE if cur else LINE, a), w=2)
        txt(d, (86, y + 12), dc["t"], SEMI(25), lerp(BG, INK, a))
        for j, l in enumerate(wrap(dc["d"], SANS(20), 1110)[:3]):
            txt(d, (86, y + 46 + j * 26), l, SANS(20), lerp(BG, MUTED if cur else DIM, a))

def scene_build(d, t):
    header(d, "build", t)
    txt(d, (56, 140), "If you want to build something like this", SEMI(32), INK)
    txt(d, (56, 190), "Stack: " + "  |  ".join(T["stack"]), MONO(19), SKY)
    order = ["Set up the project and reference the host API", *[s["title"] for s in steps], "Test on sample data, then a copy of a real project"]
    y = 250
    for i, s in enumerate(order[:8]):
        a = ease((t - 0.6 - i * 0.6) / 0.4)
        if a <= 0: continue
        d.ellipse([56, y, 92, y + 36], fill=lerp(BG, BLUE, a)); txt(d, (74, y + 18), str(i + 1), SEMI(20), BG, "mm")
        txt(d, (112, y + 18), s, SANS(26), lerp(BG, INK, a), "lm")
        y += 52

def scene_outro(d, t):
    a = ease(t / 0.6)
    nxt = TOOLS[(IDX + 1) % len(TOOLS)]
    txt(d, (W // 2, 210), f"Add-in tool {IDX + 1} of {len(TOOLS)} done", MONO(22), lerp(BG, SKY, a), "mm")
    txt(d, (W // 2, 290), T["name"], SERIF(52), lerp(BG, INK, a), "mm")
    d.line([W // 2 - 160, 350, W // 2 + 160, 350], fill=lerp(BG, BLUE, ease((t - 0.4) / 0.5)), width=3)
    txt(d, (W // 2, 420), "Next: " + nxt["name"], SEMI(34), lerp(BG, INK, ease((t - 0.7) / 0.6)), "mm")
    txt(d, (W // 2, 510), "Architecture and walkthrough: kuldeep3618x.github.io/roshan-cv", MONO(20), lerp(BG, SKY, ease((t - 1.0) / 0.6)), "mm")
    txt(d, (W // 2, 560), "Roshan Kerketta  |  BIM Manager", SANS(24), lerp(BG, MUTED, ease((t - 1.2) / 0.6)), "mm")

FUNCS = {"title": scene_title, "problem": scene_problem, "outcome": scene_outcome, "arch": scene_arch, "dec": scene_dec, "build": scene_build, "outro": scene_outro}

def render(t):
    for i, (name, a, b) in enumerate(SECS):
        if a <= t < b or i == len(SECS) - 1:
            im = bg.copy(); d = ImageDraw.Draw(im); FUNCS[name](d, t - a)
            if i > 0 and t - a < 0.3:
                pn, pa, pb = SECS[i - 1]
                pim = bg.copy(); pd = ImageDraw.Draw(pim); FUNCS[pn](pd, t - pa)
                im = Image.blend(pim, im, ease((t - a) / 0.3))
            return im
    return bg

if len(sys.argv) > 3 and sys.argv[3] == "probe":
    for name, a, b in SECS: print(name, round(a, 1), round(b, 1))
    print("DUR", DUR); sys.exit()

p = subprocess.Popen([FF, "-y", "-hide_banner", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                      "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "24", "-preset", "medium", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
for i in range(int(DUR * FPS)):
    p.stdin.write(render(i / FPS).tobytes())
p.stdin.close(); p.wait()
print("wrote", OUT, round(DUR, 1), "s")
