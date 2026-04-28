# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About the site

Tāwhaowhao Stories (twmstories.com) is a static photography/videography portfolio site for Simon Kurth, based in Arroyo Grande, CA. No build system, no package manager, no framework — pure HTML and CSS deployed as static files.

## Local preview

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Any static file server works. Paths are root-relative (`/assets/...`, `/blog/...`), so opening HTML files directly via `file://` will break asset paths.

## Architecture

**No build step.** All files are served as-is.

### File layout

```
index.html                    # Homepage (monolithic, ~3MB)
style.css                     # Design tokens + theme for homepage only
base.css                      # CSS reset shared by homepage only
assets/                       # All images (JPG/PNG)
blog/
  index.html                  # Blog listing
  what-is-a-senior-memory-film.html
friday-night-stories/
  index.html                  # Stories hub
  the-kick/index.html         # Story article
sitemap.xml
robots.txt
```

### CSS strategy

`index.html` uses `style.css` (design tokens, light/dark themes) + `base.css` (reset). Sub-pages (`blog/`, `friday-night-stories/`) are **self-contained** — all CSS is inlined in `<style>` tags; they do not link `style.css` or `base.css`.

Sub-pages use a fixed dark cinematic palette directly in their `<style>`:
- Background: `#141210`
- Gold accent: `#C8A96A`
- Text: `#F2EDE4`

The homepage has both light and dark themes toggled via `data-theme` on `<html>`. The `style.css` token system uses CSS custom properties (e.g., `--color-primary`, `--font-display`).

### Fonts

Zodiak (display/headings) + Satoshi (body) loaded from `api.fontshare.com`. The homepage uses a deferred load pattern (`media="print" onload="this.media='all'"`); sub-pages use a synchronous `<link>`.

### Third-party embeds

- Videos: Bunny.net (`iframe.mediadelivery.net`)
- Galleries: Pixieset (`images.pixieset.com`) and Behold (`w.behold.so`)

### SEO / structured data

Every page has: canonical URL, Open Graph tags, Twitter Card tags, and Schema.org JSON-LD. The homepage uses `LocalBusiness` schema; blog posts use `BlogPosting`. Keep all of these in sync when adding or renaming pages, and update `sitemap.xml` accordingly.

## Content sections (homepage anchors)

`#seniors`, `#portraits`, `#motion`, `#mediaday`, `#about`, `#contact` — referenced in `sitemap.xml`.

## When adding a new page

1. Create `page-name/index.html` (or `page-name.html` for blog posts).
2. Inline all CSS in a `<style>` block — do not link `style.css`/`base.css`.
3. Use the dark cinematic palette tokens (`--bg: #141210`, `--gold: #C8A96A`, `--light: #F2EDE4`).
4. Add full SEO head: `<title>`, `<meta name="description">`, canonical, OG tags, Schema.org JSON-LD.
5. Add the URL to `sitemap.xml`.
