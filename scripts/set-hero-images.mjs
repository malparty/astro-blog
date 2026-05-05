/**
 * Scans all posts and sets heroImage from the first in-content image
 * if the current heroImage is the default placeholder (or missing).
 *
 * Usage: node scripts/set-hero-images.mjs [--dry-run]
 */

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import matter from 'gray-matter';

const DEFAULT_HERO = '/images/hero/te.jpg';
const DRY_RUN = process.argv.includes('--dry-run');

// Matches: ![alt](url) — captures the URL group
const MD_IMAGE_RE = /!\[.*?\]\(([^)]+)\)/;

const files = globSync('src/posts/**/*.md', { cwd: process.cwd() });

let updated = 0;
let skipped = 0;

for (const file of files) {
  const raw = readFileSync(file, 'utf-8');
  const { data, content } = matter(raw);

  // Only process posts that still have the placeholder (or no heroImage)
  if (data.heroImage && data.heroImage !== DEFAULT_HERO) {
    skipped++;
    continue;
  }

  const match = MD_IMAGE_RE.exec(content);
  if (!match) {
    skipped++;
    continue;
  }

  // Use the src from the first image found in content
  let imgSrc = match[1].trim();

  // If the image is wrapped in a link [![alt](img)](link), the regex already
  // captured the inner img src because it matches the first ![ occurrence.

  data.heroImage = imgSrc;

  if (DRY_RUN) {
    console.log(`[dry-run] ${file}  →  ${imgSrc}`);
  } else {
    const output = matter.stringify(content, data);
    writeFileSync(file, output, 'utf-8');
    console.log(`Updated: ${file}  →  ${imgSrc}`);
  }
  updated++;
}

console.log(`\nDone. ${updated} updated, ${skipped} skipped.${DRY_RUN ? ' (dry-run, no files written)' : ''}`);
