#!/usr/bin/env python3
"""Derives the tab-icon favicons from the flying-doctor master.

Master: `website/human-rounds-favicon-mark.png` — the single flying doctor,
not the three-figures-in-a-round brand mark (`website/human-rounds-mark.png`,
used as the header logo on every page). The three-figure mark reads fine as a
~55px header logo but turns into an illegible blob at 32px tab-icon size —
that's the whole reason this separate, simpler mark exists, purely for the
favicon. An earlier attempt (0062086) swapped the header logo itself to the
flying doctor and got reverted the same night: that changed the site's
persistent brand mark on every page, not just the tiny tab icon nobody
consciously looks at. This script only ever touches the three favicon PNGs,
never `human-rounds-mark.png`.

Ported from the equivalent script in the sister product repo (human-rounds/
turnos, scripts/build_brand_marks.py) which validated this exact approach
against the exact same two rendering bugs:

  1. The master is NOT a single-color silhouette — it has opaque BLACK ink
     and an opaque WHITE lab-coat detail. Naively flattening the alpha
     channel into one recolored fill merges the coat into the body, and at
     32px that reads as a shapeless blob. Fix: luminance decides — black
     (L=0) -> solid ink; white (L=255) -> transparent hole (reads as a gap,
     same as the browser tab background showing through); the antialiased
     grays in between interpolate for free because the multiply is
     continuous.
  2. A comfortable ~19% margin (occupancy 0.62) that looks right at 180px
     leaves the figure a tiny smudge at 32px. The favicon crop is near
     full-bleed (occupancy 0.96) instead.

Usage: python3 scripts/build_favicon.py
"""
import os

from PIL import Image, ImageChops

AQUI = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.join(os.path.dirname(AQUI), "website")

MASTER = os.path.join(WEB, "human-rounds-favicon-mark.png")

OCUPACION = 0.62
OCUPACION_PESTANIA = 0.96


def _recuadrar(im, lado, ocupacion=OCUPACION):
    caja = im.getchannel("A").getbbox()
    marca = im.crop(caja)
    objetivo = int(round(lado * ocupacion))
    escala = objetivo / max(marca.size)
    nuevo = (max(1, int(round(marca.width * escala))),
             max(1, int(round(marca.height * escala))))
    marca = marca.resize(nuevo, Image.LANCZOS)
    lienzo = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    lienzo.paste(marca, ((lado - nuevo[0]) // 2, (lado - nuevo[1]) // 2))
    return lienzo


def _pintar(im, rgb):
    """Recolors the ink to `rgb`; treats white (the lab coat) as a
    transparent hole rather than solid fill, so it never merges with the
    body into a blob."""
    tinta = ImageChops.invert(im.convert("L"))       # black->255, white->0
    alfa = ImageChops.multiply(im.getchannel("A"), tinta)
    solido = Image.new("RGBA", im.size, rgb + (255,))
    solido.putalpha(alfa)
    return solido


NEGRO = (17, 17, 17)
BLANCO = (255, 255, 255)


def main():
    master = Image.open(MASTER).convert("RGBA")
    salidas = []

    def guardar(nombre, im):
        ruta = os.path.join(WEB, nombre)
        im.save(ruta, optimize=True)
        salidas.append((nombre, im.size))

    pestania = _recuadrar(master, 32, OCUPACION_PESTANIA)
    guardar("human-rounds-mark-32.png", _pintar(pestania, NEGRO))
    guardar("human-rounds-mark-32-dark.png", _pintar(pestania, BLANCO))

    apple = Image.new("RGBA", (180, 180), BLANCO + (255,))
    apple.alpha_composite(_pintar(_recuadrar(master, 180), NEGRO))
    guardar("human-rounds-mark-180.png", apple)

    for nombre, tam in salidas:
        print("%-34s %dx%d" % (nombre, tam[0], tam[1]))


if __name__ == "__main__":
    main()
