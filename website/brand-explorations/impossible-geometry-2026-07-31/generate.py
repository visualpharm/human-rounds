#!/usr/bin/env python3
"""Generate the Human Rounds three-model logo benchmark through fal.ai."""

from __future__ import annotations

import concurrent.futures
import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parent
RAW = ROOT / "assets" / "raw"
FAL_KEY = os.environ.get("FAL_KEY", "").strip()

PROMPT = """Use case: logo-brand
Asset type: international healthcare technology identity
Primary request: Create one original, finished horizontal logo lockup for the exact brand name "HUMAN ROUNDS". The company is an international, open-source healthcare operations platform that removes administrative work so patients and care teams can talk to each other again.
Symbol: one compact emblem that suggests 3 human presences in conversation through a single continuous interwoven ribbon. Use impossible Escher-like geometry, ambiguous figure/ground, and controlled negative space. The human connection should emerge on a second look, never as literal faces, bodies, hands, speech bubbles, or connected dots.
Style/medium: flat vector-like identity design; precise geometry softened by imperfect curves and one deliberate contradiction; quiet, intelligent, editorial, humane; distinctive enough to own; not ornamental.
Composition/framing: one emblem beside one wordmark, centered on a plain warm-cream field with generous padding. The emblem must remain recognizable at 16-24 px and reveal richer internal structure when enlarged.
Typography: render the words "HUMAN ROUNDS" exactly once and spell them correctly. Create a confident monochrome custom wordmark with editorial character, drawing from a restrained serif or a highly customized sans. Alter one ligature, counter, cut, or join so typography participates in the idea. It must not look like a generic rounded lowercase SaaS wordmark.
Color palette: warm black and cream only. No gradient.
Constraints: original design; strong silhouette; balanced negative space; credible for a global healthcare institution; scalable; no mockup, no poster, no stationery, no multiple options, no explanation text, no watermark.
Avoid: similarity to the OpenAI, Perplexity, or Anthropic marks; sparkles; purple-blue gradients; blobs; brains; circuits; hexagons; orbiting dots; node networks; literal chatbot bubbles; crosses; hearts; stethoscopes; shields; hands; medical clip art; generic Celtic knot; flower rosette; camera aperture; extra letters or words."""


MODELS = {
    "gpt-image-2": {
        "endpoint": "fal-ai/gpt-image-2",
        "body": {
            "prompt": PROMPT,
            "image_size": "landscape_4_3",
            "quality": "high",
            "num_images": 4,
            "output_format": "png",
        },
    },
    "reve-2.1": {
        "endpoint": "reve/2.1/text-to-image",
        "body": {
            "prompt": PROMPT,
            "aspect_ratio": "4:3",
            "num_images": 4,
            "output_format": "png",
        },
    },
    "ideogram-4.0": {
        "endpoint": "ideogram/v4",
        "body": {
            "prompt": PROMPT,
            "image_size": "landscape_4_3",
            "rendering_speed": "QUALITY",
            "expansion_model": "Large",
            "acceleration": "none",
            "num_images": 4,
            "output_format": "png",
        },
    },
}


def _request(url: str, *, data: bytes | None = None, timeout: int = 120):
    request = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Key {FAL_KEY}",
            "Content-Type": "application/json",
        },
        method="POST" if data is not None else "GET",
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read())


def _download(url: str, path: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": "HumanRoundsBrandStudy/1.0"})
    with urllib.request.urlopen(request, timeout=180) as response:
        path.write_bytes(response.read())


def generate(name: str, config: dict) -> dict:
    submitted = _request(
        f"https://queue.fal.run/{config['endpoint']}",
        data=json.dumps(config["body"]).encode("utf-8"),
    )
    deadline = time.time() + 12 * 60
    while time.time() < deadline:
        status = _request(submitted["status_url"], timeout=60)
        state = status.get("status")
        if state == "COMPLETED":
            result = _request(submitted["response_url"], timeout=120)
            files = []
            for index, image in enumerate(result["images"], start=1):
                target = RAW / f"{name}-{index:02d}.png"
                _download(image["url"], target)
                files.append(str(target.relative_to(ROOT)))
            return {
                "model": name,
                "endpoint": config["endpoint"],
                "request_id": submitted.get("request_id"),
                "files": files,
                "result_metadata": {
                    key: value for key, value in result.items() if key != "images"
                },
            }
        if state in {"FAILED", "ERROR", "CANCELLED"}:
            raise RuntimeError(f"{name}: {state}: {status}")
        time.sleep(3)
    raise TimeoutError(f"{name}: generation timed out")


def main() -> None:
    if not FAL_KEY:
        raise SystemExit("FAL_KEY is not set")
    RAW.mkdir(parents=True, exist_ok=True)
    records = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        futures = {pool.submit(generate, name, config): name for name, config in MODELS.items()}
        for future in concurrent.futures.as_completed(futures):
            name = futures[future]
            try:
                record = future.result()
            except Exception as exc:
                print(f"FAIL {name}: {exc}", flush=True)
                raise
            records.append(record)
            print(f"OK {name}: {len(record['files'])} images", flush=True)

    manifest = {
        "brief": "Human Rounds impossible-geometry logo benchmark",
        "prompt": PROMPT,
        "models": sorted(records, key=lambda row: row["model"]),
    }
    (ROOT / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
