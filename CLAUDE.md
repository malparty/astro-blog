# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Stack

Eleventy (11ty) v3 static site, plain CSS, Nunjucks templates, npm. Deployed to Cloudflare Pages at https://malparty.fr.

## Commands

- `npm run dev` — Eleventy dev server at http://localhost:8080
- `npm run build` — build to `_site/`
- `npm run clean` — remove `_site/`

## Layout

- `.eleventy.js` — config (collections, passthrough copy, plugins)
- `src/_data/site.js` — site metadata (title, url, paginationSize, …)
- `src/_includes/` — `base.njk`, `post.njk`, `home.njk`
- `src/posts/YYYY/<slug>.md` — posts (frontmatter: title, date, category, tags, description, heroImage, layout)
- `src/posts/posts.json` — directory data (permalink pattern, default layout/tags)
- `src/images/hero/` and `src/images/wp/` — passthrough-copied to `/images/`
- `src/css/style.css` — plain CSS, system font, light/dark via `prefers-color-scheme`
- `src/{index,category,tag,categories,tags,feed,404}.njk` — pages

## Conventions

- Single category per post (string), multiple tags (array).
- `heroImage` is a site-absolute path like `/images/hero/te.jpg`.
- Inline images in body markdown use `/images/wp/YYYY/MM/file.ext`.
- Permalinks: `/YYYY/<slug>/` driven by `src/posts/posts.json`.

## Deploy

Cloudflare Pages: build `npm run build`, output `_site`, Node 20. Push to `main` triggers deploy.
