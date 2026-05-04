# Malparty (Eleventy)

Static blog deployed to Cloudflare Pages at https://malparty.fr.

## Local development

```sh
cd site
npm install
node scripts/migrate.mjs   # one-time / when source content changes
npm run dev                # http://localhost:8080
npm run build              # writes to _site/
```

## Cloudflare Pages settings

- **Root directory**: `site`
- **Build command**: `npm run build`
- **Build output directory**: `_site`
- **Node version**: `20`
- **Custom domain**: `malparty.fr`

No `wrangler.toml` required for Pages static hosting. Push to `main` and Cloudflare builds + deploys automatically.

## Layout

```
site/
  .eleventy.js
  package.json
  scripts/migrate.mjs    # imports posts + images from ../src/content/blog and the WP backup
  src/
    _data/site.js
    _includes/           # base.njk, post.njk, home.njk
    css/style.css
    images/hero/         # hero images copied from Astro source
    images/wp/           # WP uploads referenced by posts (YYYY/MM/file.ext)
    posts/YYYY/<slug>.md
    index.njk            # paginated home
    category.njk         # /category/<slug>/
    tag.njk              # /tag/<slug>/
    categories.njk       # /categories/
    tags.njk             # /tags/
    feed.njk             # /feed.xml
    404.njk
```
