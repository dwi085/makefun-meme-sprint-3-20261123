// Meme Sprint 3: AI Agent Goes Rogue — entry program.
// Writes the meme image (meme.png, shipped in this repo) to
// /output/entry.png, honouring MAKEFUN_OUTPUT_DIR when set.
// Deterministic: the output is a byte-for-byte copy of meme.png,
// so two runs always produce identical files. No network, no writes
// outside the output directory.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const botDir = process.env.MAKEFUN_BOT_DIR
  ? process.env.MAKEFUN_BOT_DIR
  : dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const source = join(botDir, "meme.png");
const target = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Sanity check: the output must be the exact meme bytes, and a whole PNG.
const sourceBytes = readFileSync(source);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!sourceBytes.subarray(0, 8).equals(pngMagic)) {
  throw new Error("meme.png is not a PNG file");
}
const targetBytes = readFileSync(target);
if (!sourceBytes.equals(targetBytes)) {
  throw new Error("entry.png does not match meme.png");
}
const size = statSync(target).size;
if (size > 1048576) {
  throw new Error(`entry.png is ${size} bytes, over the 1 MiB gate`);
}
console.log(`Wrote ${target} (${size} bytes)`);
