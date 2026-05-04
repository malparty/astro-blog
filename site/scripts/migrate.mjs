#!/usr/bin/env node
// Migrate Astro blog posts + images into the Eleventy site/.
// Idempotent: re-running overwrites posts and skips images that already exist.

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SITE_ROOT, '..');

const SRC_BLOG = path.join(REPO_ROOT, 'src', 'content', 'blog', 'wordpress');
const SRC_HEROES = path.join(REPO_ROOT, 'src', 'assets', 'images');
const WP_BACKUP = 'C:\\Users\\ADMIN\\Source\\malparty.fr\\malparty.fr\\www\\wp-content\\uploads';

const DEST_POSTS = path.join(SITE_ROOT, 'src', 'posts');
const DEST_HEROES = path.join(SITE_ROOT, 'src', 'images', 'hero');
const DEST_WP = path.join(SITE_ROOT, 'src', 'images', 'wp');

const counts = {
  posts: 0,
  heroCopied: 0,
  heroMissing: 0,
  inlineCopied: 0,
  inlineSkipped: 0,
  inlineMissing: 0,
};
const missingFiles = [];

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else if (e.isFile() && e.name.endsWith('.md')) out.push(full);
  }
  return out;
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function copyIfMissing(src, dest) {
  try {
    await fs.access(dest);
    return 'exists';
  } catch {}
  try {
    await fs.access(src);
  } catch {
    return 'missing';
  }
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
  return 'copied';
}

const heroSeen = new Set();

async function migrateHero(heroImage) {
  if (!heroImage) return null;
  // strip any leading ../ segments and "assets/images/"
  const basename = path.basename(heroImage);
  const dest = path.join(DEST_HEROES, basename);
  const src = path.join(SRC_HEROES, basename);
  if (!heroSeen.has(basename)) {
    heroSeen.add(basename);
    const r = await copyIfMissing(src, dest);
    if (r === 'copied') counts.heroCopied++;
    else if (r === 'missing') {
      counts.heroMissing++;
      missingFiles.push(`hero: ${src}`);
    }
  }
  return `/images/hero/${basename}`;
}

const inlineSeen = new Map(); // url -> result

const WP_URL_RE = /https?:\/\/malparty\.fr\/wp-content\/uploads\/([^\s)"']+?\.(?:jpg|jpeg|png|gif|webp))/gi;

async function migrateInlineImage(rest) {
  // rest = "2013/08/buda_art_2-1024x768.jpg"
  const cached = inlineSeen.get(rest);
  if (cached !== undefined) return cached;
  const src = path.join(WP_BACKUP, rest.replace(/\//g, path.sep));
  const dest = path.join(DEST_WP, rest.replace(/\//g, path.sep));
  const r = await copyIfMissing(src, dest);
  let result;
  if (r === 'copied') {
    counts.inlineCopied++;
    result = `/images/wp/${rest}`;
  } else if (r === 'exists') {
    counts.inlineSkipped++;
    result = `/images/wp/${rest}`;
  } else {
    counts.inlineMissing++;
    missingFiles.push(`inline: ${src}`);
    result = null; // signal: leave URL untouched
  }
  inlineSeen.set(rest, result);
  return result;
}

async function rewriteBody(body) {
  // collect unique URLs first
  const matches = [...body.matchAll(WP_URL_RE)];
  const unique = new Set(matches.map((m) => m[1]));
  const map = new Map();
  for (const rest of unique) {
    const newPath = await migrateInlineImage(rest);
    if (newPath) map.set(rest, newPath);
  }
  return body.replace(WP_URL_RE, (full, rest) => {
    const replacement = map.get(rest);
    return replacement ? replacement : full;
  });
}

function normalizeDate(fm) {
  const d = fm.date || fm.pubDate;
  if (!d) return null;
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
}

async function migratePost(file) {
  const raw = await fs.readFile(file, 'utf8');
  const { data, content } = matter(raw);
  const date = normalizeDate(data);
  if (!date) {
    console.warn(`SKIP (no date): ${file}`);
    return;
  }
  const year = date.slice(0, 4);
  const slug = path.basename(file, '.md');
  const heroPath = await migrateHero(data.heroImage);
  const newBody = await rewriteBody(content);

  const fm = {
    title: data.title || slug,
    date,
    category: data.category || 'uncategorized',
    tags: Array.isArray(data.tags) ? data.tags : [],
    description: data.description || '',
  };
  if (heroPath) fm.heroImage = heroPath;

  const out = matter.stringify(newBody, fm);
  const destDir = path.join(DEST_POSTS, year);
  await ensureDir(destDir);
  await fs.writeFile(path.join(destDir, `${slug}.md`), out, 'utf8');
  counts.posts++;
}

async function main() {
  await ensureDir(DEST_POSTS);
  await ensureDir(DEST_HEROES);
  await ensureDir(DEST_WP);
  const files = await walk(SRC_BLOG);
  console.log(`Found ${files.length} posts to migrate.`);
  for (const f of files) {
    try {
      await migratePost(f);
    } catch (err) {
      console.error(`FAIL ${f}:`, err.message);
    }
  }
  console.log('\n=== Migration summary ===');
  console.log(`Posts migrated:        ${counts.posts}`);
  console.log(`Hero images copied:    ${counts.heroCopied}`);
  console.log(`Hero images missing:   ${counts.heroMissing}`);
  console.log(`Inline images copied:  ${counts.inlineCopied}`);
  console.log(`Inline images cached:  ${counts.inlineSkipped}`);
  console.log(`Inline images missing: ${counts.inlineMissing}`);
  if (missingFiles.length && missingFiles.length <= 30) {
    console.log('\nMissing files:');
    for (const m of missingFiles) console.log('  ' + m);
  } else if (missingFiles.length) {
    console.log(`\n(${missingFiles.length} missing files — first 20 shown)`);
    for (const m of missingFiles.slice(0, 20)) console.log('  ' + m);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
