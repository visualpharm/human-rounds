#!/usr/bin/env python3
"""Generate targeted round-two Human Rounds logo directions."""

from __future__ import annotations

import concurrent.futures
import json

from generate import MODELS, ROOT, generate


COMMON = """Create one original, finished logo lockup for the exact brand name "HUMAN ROUNDS", an international open-source healthcare operations platform that returns time for patients and care teams to talk. Warm black on a plain warm-cream field. Flat vector-like identity design. Render "HUMAN ROUNDS" exactly once and spell it correctly. One lockup only, generous padding, strong silhouette, credible for a global healthcare institution, recognizable at 16-24 px. No mockup, poster, stationery, explanation text, extra words, watermark, gradient, medical cross, heart, shield, stethoscope, brain, circuit, sparkle, node network, connected dots, speech bubble, hands, faces, bodies, flower, camera aperture, triangle, triquetra, Celtic knot, or 3-fold rotational rosette. Do not resemble OpenAI, Perplexity, or Anthropic marks."""

PROMPTS = {
    "gpt-image-2": COMMON + """

Direction: impossible roundtable. Create a compact asymmetrical emblem from one open circular band with 3 concave bays that only indirectly suggest 3 presences sharing a conversation. Include exactly one Escher-like contradiction where the band passes both over and under itself, plus one memorable interruption. The emblem is not a closed knot and must not have rotational symmetry. Pair it with a quiet custom wordmark, restrained editorial serif or humanist sans, with one unusual counter or join. The result should feel inevitable, not decorative.""",
    "reve-2.1": COMMON + """

Direction: impossible typographic ligature. Build the identity around a custom H/R monogram in which the vertical of H and the bowl/leg of R become one continuous impossible ribbon. Use ambiguous figure/ground so 2 facing presences can be sensed only on a second look, without drawing profiles. Pair it with a strong editorial wordmark whose altered R or joined round counters echo the monogram. Avoid a separate generic icon beside stock type. Controlled imperfection and one optical contradiction; simple enough to redraw from memory.""",
    "ideogram-4.0": COMMON + """

Direction: distorted editorial wordmark as the symbol. Make "HUMAN ROUNDS" itself memorable: a custom black wordmark combining an intelligent editorial serif with hand-drawn distortion. One horizontal cut passes through selected letters, shifts their upper halves slightly, then reconnects impossibly through the counters of R/O/U. Create one compact HR monogram derived from the same cuts only if the lockup needs it. Keep distortion controlled and readable, closer to a cultural institution than an experimental poster. No generic icon.""",
}


def main() -> None:
    configs = {}
    for model, prompt in PROMPTS.items():
        config = {
            "endpoint": MODELS[model]["endpoint"],
            "body": dict(MODELS[model]["body"]),
        }
        config["body"]["prompt"] = prompt
        configs[f"round2-{model}"] = config

    records = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        futures = {
            pool.submit(generate, name, config): name
            for name, config in configs.items()
        }
        for future in concurrent.futures.as_completed(futures):
            record = future.result()
            records.append(record)
            print(f"OK {record['model']}: {len(record['files'])} images", flush=True)

    manifest = {
        "brief": "Human Rounds targeted logo iteration, round 2",
        "prompts": PROMPTS,
        "models": sorted(records, key=lambda row: row["model"]),
    }
    (ROOT / "manifest-round2.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
