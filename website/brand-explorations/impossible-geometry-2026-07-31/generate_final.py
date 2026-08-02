#!/usr/bin/env python3
"""Refine the strongest impossible-roundtable candidate with GPT Image 2."""

from __future__ import annotations

import json

from generate import ROOT, generate


REFERENCE_URL = "https://v3b.fal.media/files/b/0aa482a6/kMRF6onjKZkNdWiVDnuE3_Gta422e9.png"

PROMPT = """Image 1 is the selected Human Rounds identity direction. Treat it as a design source, not a scene.

Create exactly 1 polished refinement of this logo system in the image. Preserve the warm-black-on-cream horizontal lockup, the open circular band, the asymmetry, and the single impossible over/under contradiction. Keep the exact brand text "HUMAN ROUNDS" spelled correctly once.

Refine only these points:
1. Remove any residual chain-link, Celtic-knot, camera-aperture, or generic infinity association. Use no more than 2 crossings.
2. Shape 3 subtle concave bays around the central negative space so 3 people sharing a roundtable can be sensed only on a second look. Do not draw heads, faces, bodies, hands, dots, or speech bubbles.
3. Make the emblem survive at 16-24 px: consistent stroke logic, open counters, no hairline gaps, strong silhouette.
4. Replace the generic wordmark with a custom, intelligent humanist wordmark. Use restrained editorial character and alter one R, U, O counter, ligature, or join so it belongs to the emblem. Keep it calm and globally credible.
5. Add one deliberate tiny interruption or impossible join that rewards close inspection without harming micro legibility.

One finished logo lockup in the entire image, centered with generous padding. Do not show a grid, contact sheet, alternatives, rows, columns, or repeated lockups. Flat vector-like design only. No mockup, poster, stationery, extra text, watermark, gradient, 3D shading, medical cross, heart, shield, stethoscope, sparkles, nodes, or similarity to OpenAI, Perplexity, or Anthropic marks."""


def main() -> None:
    config = {
        "endpoint": "fal-ai/gpt-image-2/edit",
        "body": {
            "prompt": PROMPT,
            "image_urls": [REFERENCE_URL],
            "image_size": "landscape_4_3",
            "quality": "high",
            "num_images": 4,
            "output_format": "png",
        },
    }
    record = generate("final2-gpt-image-2", config)
    (ROOT / "manifest-final2.json").write_text(
        json.dumps(
            {
                "brief": "Human Rounds impossible-roundtable finalist refinement",
                "reference_local": "assets/raw/round2-gpt-image-2-01.png",
                "reference_url": REFERENCE_URL,
                "prompt": PROMPT,
                "model": record,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"OK final: {len(record['files'])} images", flush=True)


if __name__ == "__main__":
    main()
