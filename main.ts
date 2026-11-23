// "WASTED vs BOUNTY PASSED" - a GTA 6 launch-week meme entry for make.fun's gta6-meme-x-01 bounty.
//
// The entry itself is a post on X (named in POST.json). This program only has to hand that address to the
// grader: it reads POST.json from the repository, checks it names an x.com/twitter.com status, and writes a
// normalised copy to the output directory. Node 22, standard library only, no network.
//
// Local run: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(msg: string): never {
  console.error(`gta6-meme: ${msg}`);
  process.exit(1);
}

let raw: string;
try {
  raw = readFileSync(join(botDir, 'POST.json'), 'utf8');
} catch (err) {
  fail(`cannot read POST.json in ${botDir}: ${(err as Error).message}`);
}

let post: { url?: unknown };
try {
  post = JSON.parse(raw);
} catch {
  fail('POST.json is not valid JSON');
}

const url = typeof post.url === 'string' ? post.url.trim() : '';
const statusRe = /^https:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})\/status\/(\d{5,25})(?:[/?#].*)?$/;
const m = statusRe.exec(url);
if (!m) fail(`POST.json url is not an X post address: ${JSON.stringify(url)}`);

// Normalise to the canonical x.com form, dropping tracking query strings.
const clean = `https://x.com/${m[1]}/status/${m[2]}`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'POST.json'), JSON.stringify({ url: clean }) + '\n');
console.log(`post: ${clean}`);
