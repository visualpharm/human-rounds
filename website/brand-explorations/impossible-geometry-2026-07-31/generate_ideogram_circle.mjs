import { readFile, writeFile, mkdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { fal } from "/Users/ivan/projects/sana/node_modules/@fal-ai/client/src/index.js";

const ROOT = new URL(".", import.meta.url).pathname;
const SOURCE = join(ROOT, "assets/raw/ideogram-4.0-04.png");
const OUT = join(ROOT, "assets/raw");
const ENDPOINT = "ideogram/v4/image-to-image";

if (!process.env.FAL_KEY) throw new Error("FAL_KEY is not set");
fal.config({ credentials: process.env.FAL_KEY });

const common = `Refine the supplied HUMAN ROUNDS healthcare-operations logo into one world-class horizontal identity lockup on a warm cream field. Preserve its best idea: exactly three people in intimate circular conversation, joined hand-to-hand inside one continuous infinity-like woven emblem. Keep the words "HUMAN ROUNDS" exactly once, spelled exactly, in a restrained editorial serif. Black ink only. Flat vector-like artwork, no mockup, no poster, no extra text. The emblem must remain legible at 20px and reveal richer structure when enlarged. Avoid literal chat bubbles, dots-and-lines networks, brains, circuits, hearts, medical crosses, stethoscopes, sparkles, gradients, shadows, 3D rendering, decorative borders, and corporate SaaS softness.`;

const directions = [
  {
    slug: "clarified-weave",
    strength: 0.42,
    prompt: `${common}\nDirection: a disciplined redraw of the reference. Retain the three heads, three hand-to-hand contacts, and infinity silhouette, but reduce each person to one confident organic contour. Make every face and hand unmistakable without tiny features. Use two calm stroke weights and generous negative space.`,
  },
  {
    slug: "negative-space-trinity",
    strength: 0.56,
    prompt: `${common}\nDirection: the people are discovered in negative space. Build one compact black woven loop with exactly three warm-cream human presences cut from it, facing inward. Their arms complete the loop; there are no drawn facial details. Human first, clever second.`,
  },
  {
    slug: "impossible-round",
    strength: 0.58,
    prompt: `${common}\nDirection: introduce one precise Escher-like contradiction. The continuous band is simultaneously three bodies and an impossible over-under loop, yet the three inward-facing people and joined hands remain immediately readable. One contradiction only; no generic Celtic knot.`,
  },
  {
    slug: "circle-symmetry",
    strength: 0.60,
    prompt: `${common}\nDirection: convert the infinity silhouette into a near-circular, threefold-symmetric emblem. Three softened geometric human forms rotate around a calm central opening, each holding the next person's hand. Symmetry is exact at first glance, with one humane imperfect notch that rewards close viewing.`,
  },
  {
    slug: "matisse-ribbon",
    strength: 0.62,
    prompt: `${common}\nDirection: Matisse-like economy interpreted as a modern identity, not an illustration. Three joyful human gestures are cut from one broad black paper ribbon and dance around the circle while remaining linked. Use sweeping hand-cut curves, controlled asymmetry, and no fine linework.`,
  },
  {
    slug: "soft-modular",
    strength: 0.57,
    prompt: `${common}\nDirection: a modular identity system. Construct the three people from three related soft geometric pieces that interlock into one round symbol; each piece works alone as a secondary mark, while together they form a single continuous human round. Add one deliberate optical interruption, not ornament.`,
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
    onQueueUpdate(update) {
      if (update.status === "IN_PROGRESS" && update.logs?.length) {
        process.stdout.write(`  ${update.logs.at(-1).message ?? "rendering"}\n`);
      }
    },
  });
  const payload = result.data ?? result;
  const image = payload.images?.[0];
  if (!image?.url) throw new Error(`No image URL returned for ${direction.slug}`);
  const response = await fetch(image.url);
  if (!response.ok) throw new Error(`Download failed for ${direction.slug}: ${response.status}`);
  const filename = `ideogram-circle-${String(index + 1).padStart(2, "0")}-${direction.slug}.png`;
  await writeFile(join(OUT, filename), Buffer.from(await response.arrayBuffer()));
  manifest.outputs.push({ ...direction, filename, requestId: result.requestId ?? result.request_id ?? null, image });
}

await writeFile(join(ROOT, "manifest-ideogram-circle.json"), `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write("Done.\n");
