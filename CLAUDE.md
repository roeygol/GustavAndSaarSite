# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site ("תדמית") for גוסטב את סער, a family-owned (father and son) electrical-panel engineering business. Hebrew, RTL, mobile + desktop. Deployed to Cloudflare Pages.

## Stack and commands

Plain static site: no build step, no dependencies.

- Run locally: `python3 -m http.server 8000` (or `npx wrangler pages dev . --kv VISITS_KV` to also run the Functions at `/api/contact` and `/api/visit`; without `RESEND_API_KEY`/`CONTACT_TO` set they only log, no mail is sent).
- Deploy: Cloudflare Pages, build command empty, output directory `/` (repo root). `wrangler.toml` (`pages_build_output_dir = "."`) declares the `VISITS_KV` binding, so Pages reads bindings from that file.

## Email setup (contact form + visit notifications)

Both emails go to Saar via Resend and share `functions/_lib/email.js`. One-time setup, not yet done:
1. `npx wrangler kv namespace create VISITS_KV`, then replace `REPLACE_WITH_KV_NAMESPACE_ID` in `wrangler.toml`.
2. In the Pages project, set `RESEND_API_KEY` (secret), `CONTACT_TO` (Saar's address; comma-separated for several) and `CONTACT_FROM` (sender on a domain verified in Resend).

Until those exist `/api/contact` returns 500 and `/api/visit` silently skips sending (it still returns the GIF). This mirrors the AlonSite project (`../AlonSite/functions/`), except AlonSite deploys as a Worker with Static Assets and sends to different recipients; keep the two email templates visually consistent if either changes.

## Architecture

- `index.html`: single page; sections are anchored (`#about`, `#services`, `#process`, `#projects`, `#contact`).
- `styles.css`: all styling. Brand colors come from the logo (green `--g` #7AB929 / `--g2` #9BE33A on charcoal `--ink`); text on green uses the dark ink color for contrast. Breakpoints: 1000px (tablet), 720px (mobile).
- `script.js`: mobile menu toggle, project filters, accessibility toolbar and contact-form validation/submit via `fetch` to `/api/contact`.
- `functions/api/contact.js`: Cloudflare Pages Function that emails form submissions (incl. project type) to Saar through Resend. Needs env vars `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` set in the Pages project; it returns 500 until they exist.
- `functions/api/visit.js` + `functions/_lib/email.js`: visit notifications, ported from the AlonSite project. A 1×1 beacon `<img src="/api/visit?page=...">` at the top of every page's `<body>` emails Saar (`CONTACT_TO`) once per visit; dedup by cookie (`gs_visited`) + IP in Workers KV (`VISITS_KV`, 60s TTL, declared in `wrangler.toml` — replace the placeholder id). The email includes Cloudflare edge geo/ISP/device data (IP-based, approximate). `_lib/email.js` also builds the contact-form email. New pages must include the beacon with their own `page=` name.
- `assets/logo.png`: the company's original logo. Do NOT redraw or alter it; the owner wants this exact artwork. It is raster with a white background, so it is shown on a white rounded plate (`.brand`) and also used as the favicon.
- `privacy.html`, `accessibility.html`: legal page templates with `[placeholders]`; they need legal review before launch.
- `docs/competitor-analysis.md`: analysis of the competitor adpsystem.co.il (structure, strengths/weaknesses, what we add). Consult and update it when planning content/sections.
- Accessibility toolbar (`#a11y` in `index.html`, logic in `script.js`) toggles `a11y-*` classes on `<html>`; its state is stored in localStorage.

## Tone

The owner asked to downplay the "family business / father and son" angle in site copy. Keep messaging focused on engineering, quality and service; at most a light mention.

## SEO

The goal is to rank the site in Google (Hebrew, Israel market) for electrical-panel engineering searches. On-page SEO is implemented: meta/canonical/OG tags, JSON-LD graph (`ElectricalContractor`, `Service`, `FAQPage`) in `index.html`, `robots.txt`, `sitemap.xml`, and `noindex` on the legal pages. The domain `https://gustav-saar.co.il` is the real domain, used in canonical/OG/sitemap/robots and JSON-LD; fill the `[...]` NAP values in the JSON-LD. Also 4 static service landing pages (`services/*.html`, generated from one template, linked from the index service rows, each with its own title/description/canonical/BreadcrumbList+Service JSON-LD and a `page=` beacon); internal links and canonicals use extensionless URLs (Cloudflare Pages strips `.html`), so preview them with `wrangler pages dev` rather than `http.server`. Their copy is draft and generic (no invented standards/claims); confirm with the owners. `_headers` sets asset caching. New pages must be added to `sitemap.xml`. Still open: a 1200×630 OG image, keyword research, project photos with `alt`, Search Console. When touching pages or content, keep these in mind:
- Per-page `<title>`, meta description, canonical URL, `lang="he"`/`dir="rtl"`, and Open Graph/Twitter tags.
- Structured data (JSON-LD): `LocalBusiness`/`Organization`, plus `Service` entries for the offered services.
- `sitemap.xml` and `robots.txt` at the repo root (served as-is by Cloudflare Pages).
- Semantic headings (a single `h1`, logical `h2`/`h3`), descriptive `alt` text on images, and Hebrew keyword-rich copy that stays natural.
- Performance and mobile (Core Web Vitals): optimized/lazy-loaded images, no render-blocking assets.
- Real NAP details (name, address, phone) replacing the placeholders, consistent across the site; Google Business Profile and Search Console setup after launch.
- Keep `docs/` as the place for keyword research and SEO notes.

## Content status

Copy in square brackets (`[X]+`, `[שם הפרויקט]`, phone, email, address, the about-story) and the striped `.ph` blocks are placeholders awaiting real content and photos. Service descriptions and process steps are draft copy to be confirmed with the owners. The `tel:`/`mailto:` hrefs in the contact section are dummies.

The visual design was prototyped as a Claude Design artifact (desktop + mobile boards); the code here is the implementation.
