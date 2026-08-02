import { readFile, writeFile, mkdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { fal } from "/Users/ivan/projects/sana/node_modules/@fal-ai/client/src/index.js";

const ROOT = new URL(".", import.meta.url).pathname;
const SOURCE = join(ROOT, "assets/raw/ideogram-4.0-04.png");
const OUT = join(ROOT, "assets/raw");
const ENDPOINT = "ideogram/v4/image-to-image";

if (!process.env.FAL_KEY) throw new Error("FAL_KEY is not set");
fal.config({ credentials: process.env.FAL_KEY });

const common = `Create one world-class horizontal logo lockup for HUMAN ROUNDS, an international healthcare-operations platform. Use the supplied logo only as conceptual DNA: exactly three people in a human round, connected hand-to-hand through one continuous impossible band. Render "HUMAN ROUNDS" exactly once and spell it exactly. Warm cream field, black ink, flat vector-like mark, restrained editorial serif. The emblem must be memorable at 20px and richly constructed when enlarged. This must be a substantially new design, not a trace of the reference. No mockup, poster, extra text, chat bubbles, dots-and-lines network, brain, circuit, heart, cross, stethoscope, sparkle, gradient, shadow, or generic Celtic knot.`;

const directions = [
  {
    number: 7,
    slug: "human-triskelion",
    strength: 0.82,
    prompt: `${common}\nDirection: a circular threefold triskelion made from three softened geometric people facing inward. Each person's forearm becomes the next person's shoulder in a continuous loop. The center is a small calm roundtable-shaped opening. Exact rotational structure, with one hand-drawn irregularity.`,
  },
  {
    number: 8,
    slug: "escher-roundtable",
    strength: 0.84,
    prompt: `${common}\nDirection: an Escher-like impossible roundtable. Three simplified seated human presences surround a circular void; one black ribbon passes over and under itself in a physically impossible way and also becomes their joined arms. Readable people first, optical contradiction second.`,
  },
  {
    number: 9,
    slug: "matisse-cutout",
    strength: 0.88,
    prompt: `${common}\nDirection: a bold Matisse-inspired paper-cut emblem. Exactly three joyful, abstract human silhouettes dance in a connected circle, but one continuous black strip forms all three bodies. Sweeping hand-cut curves, generous negative space, deliberate imperfection, no anatomy details.`,
  },
  {
    number: 10,
    slug: "impossible-infinity",
    strength: 0.78,
    prompt: `${common}\nDirection: evolve the reference infinity into a sharper impossible geometry. Three unmistakable inward-facing heads occupy three lobes of a single round infinity band; their linked hands form the only crossing. Use one clean over-under paradox and remove every tiny facial detail.`,
  },
];

await mkdir(OUT, { recursive: true });
const sourceBytes = await readFile(SOURCE);
const sourceUrl = await fal.storage.upload(new Blob([sourceBytes], { type: "image/png" }), {
  lifecycle: { expiresIn: "1d" },
});
const manifest = { endpoint: ENDPOINT, source: basename(SOURCE), sourceUrl, generatedAt: new Date().toISOString(), outputs: [] };

for (let index = 0; index < directions.length; index += 1) {
  const direction = directions[index];
  process.stdout.write(`[${index + 1}/${directions.length}] ${direction.slug}\n`);
  const result = await fal.subscribe(ENDPOINT, {
    input: {
      prompt: direction.prompt,
      image_url: sourceUrl,
      strength: direction.strength,
      expansion_model: "Large",
      image_size: "landscape_4_3",
      rendering_speed: "QUALITY",
      num_images: 1,
      output_format: "png",
      enable_safety_checker: true,
    },
    logs: true,
  });
  const payload = result.data ?? result;
  const image = payload.images?.[0];
  if (!image?.url) throw new Error(`No image URL returned for ${direction.slug}`);
  const response = await fetch(image.url);
  if (!response.ok) throw new Error(`Download failed for ${direction.slug}: ${response.status}`);
  const filename = `ideogram-circle-${String(direction.number).padStart(2, "0")}-${direction.slug}.png`;
  await writeFile(join(OUT, filename), Buffer.from(await response.arrayBuffer()));
  manifest.outputs.push({ ...direction, filename, requestId: result.requestId ?? result.request_id ?? null, image });
}

await writeFile(join(ROOT, "manifest-ideogram-circle-round2.json"), `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write("Done.\n");
