#!/usr/bin/env python3
"""Farol Desk: regenerate the screenshots and the link preview used by the case study.

This is a build tool, not part of the site. Run it again whenever the captures in the
Farol Desk repository (still named nexo-assist) change:

    python tools/farol-shots.py                 # sources in ../nexo-assist, next to this checkout
    python tools/farol-shots.py --src D:/path/to/nexo-assist
    FAROL_SRC=D:/path/to/nexo-assist python tools/farol-shots.py

It reads   <src>/docs/capturas/<name>.png      (expected 1440x900)
           <src>/src/app/opengraph-image.png   (expected 1200x630)
and writes assets/shots/farol-<name>-960.webp
           assets/shots/farol-<name>-1600.webp
           assets/shots/farol-og.jpg

The file names never change, so the pages need no edit after a re-run.

"-960" and "-1600" are width caps. A 1440 px capture is reduced to 960 and enlarged to 1600
(11%, the size the pages' srcset announces). A capture narrower than a cap is never enlarged by
more than MAX_UPSCALE: it is written at its own size under both names (today that is the case
of 04-decisao-e-telemetria, a 592 px crop of the "por quê?" panel). The pages size every image
with CSS (width:100%; height:auto), so a capture that comes back with another size or
proportion still renders correctly; only the width/height attributes in the HTML, which
reserve the space before the image loads, would then be slightly off.

Requires Pillow (pip install pillow).
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Pillow is missing: pip install pillow")

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "assets" / "shots"

SHOTS = [
    "01-login",
    "02-chat-funcionaria",
    "03-console-fila",
    "04-decisao-e-telemetria",
    "05-relatorio",
    "06-indicadores",
    "08-rascunho",
]
WIDTHS = (960, 1600)
EXPECTED = (1440, 900)
MAX_UPSCALE = 1.12          # 1440 -> 1600 is allowed; anything beyond keeps its own size
WEBP_QUALITY = 88
OG_SOURCE = Path("src") / "app" / "opengraph-image.png"
OG_EXPECTED = (1200, 630)
OG_QUALITY = 88


def kb(path: Path) -> str:
    return f"{path.stat().st_size / 1024:.0f} KB"


def convert_shot(src: Path, name: str) -> list[str]:
    notes = []
    im = Image.open(src).convert("RGB")
    if im.size != EXPECTED:
        notes.append(f"{name}: source is {im.width}x{im.height}, expected {EXPECTED[0]}x{EXPECTED[1]}")
    for cap in WIDTHS:
        if cap <= im.width * MAX_UPSCALE:
            w, h = cap, round(im.height * cap / im.width)
            out_im = im.resize((w, h), Image.LANCZOS) if w != im.width else im
        else:
            out_im = im  # too small for this cap: keep the native size, never blow it up
        out = OUT / f"farol-{name}-{cap}.webp"
        out_im.save(out, "WEBP", quality=WEBP_QUALITY, method=6)
        print(f"  {out.name:44s} {out_im.width}x{out_im.height}  {kb(out)}")
    return notes


def convert_og(src: Path) -> list[str]:
    notes = []
    im = Image.open(src).convert("RGB")
    if im.size != OG_EXPECTED:
        notes.append(f"opengraph-image: source is {im.width}x{im.height}, expected "
                     f"{OG_EXPECTED[0]}x{OG_EXPECTED[1]} (the pages declare og:image:width/height)")
    out = OUT / "farol-og.jpg"
    im.save(out, "JPEG", quality=OG_QUALITY, optimize=True, progressive=True)
    print(f"  {out.name:44s} {im.width}x{im.height}  {kb(out)}")
    return notes


def main() -> int:
    ap = argparse.ArgumentParser(description="Regenerate the Farol Desk screenshots for the portfolio.")
    ap.add_argument("--src", default=os.environ.get("FAROL_SRC") or str(REPO.parent / "nexo-assist"),
                    help="checkout of the Farol Desk repository (default: ../nexo-assist or $FAROL_SRC)")
    args = ap.parse_args()
    src = Path(args.src).resolve()
    shots_dir = src / "docs" / "capturas"
    if not shots_dir.is_dir():
        print(f"captures folder not found: {shots_dir}\nPass --src or set FAROL_SRC.", file=sys.stderr)
        return 2
    OUT.mkdir(parents=True, exist_ok=True)

    notes, missing = [], []
    print(f"from {shots_dir}")
    for name in SHOTS:
        png = shots_dir / f"{name}.png"
        if not png.is_file():
            missing.append(str(png))
            continue
        notes += convert_shot(png, name)
    og = src / OG_SOURCE
    if og.is_file():
        notes += convert_og(og)
    else:
        missing.append(str(og))

    for n in notes:
        print(f"note: {n}")
    for m in missing:
        print(f"MISSING: {m}", file=sys.stderr)
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
