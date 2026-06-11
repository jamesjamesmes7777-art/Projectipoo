---
name: Sourcing real web media (photos + official video links)
description: How to source genuine, properly-licensed images and verified official video links when a user rejects AI-generated media.
---

# Sourcing real web media

When a user demands *real* brand/subject media (not AI-generated) for an artifact:

## Photos — prefer public-domain, host locally
- Use `imageSearch` but filter results to `upload.wikimedia.org` and `nasa.gov` — these are public domain (safe to download + commit). Avoid getty/istock (watermarked/paid) and news CDNs (e.g. futurecdn/space.com) which are copyrighted.
- **Wikimedia `upload.wikimedia.org` rate-limits aggressively.** Rapid sequential `fetch`es return `429`, and some User-Agents get `403`.
  - **Why:** Wikimedia enforces a strict UA policy + per-IP throttling.
  - **How to apply:** Use a browser-like UA (`Mozilla/5.0 (compatible; <App>/1.0)`), space requests ~3–4s apart, and retry with backoff. A contact-style UA (`<App>/1.0 (https://...; contact@...)`) got `403` in practice — the plain Mozilla-compatible UA worked.
- Downloads are often huge (6–8 MB). Optimize with ImageMagick (already in the Replit runtime) before committing: `magick in.jpg -resize '1600x1600>' -strip -quality 82 out.jpg` → typically <220 KB.

## Official video links — verify authorship before linking
- `webSearch` cannot fetch YouTube pages, but its result snippets surface YouTube watch URLs. Extract IDs with `/[?&]v=([\w-]{11})/`.
- **Verify a video is from the official channel via the YouTube oEmbed endpoint** (NOT blocked, unlike the watch page):
  `https://www.youtube.com/oembed?format=json&url=<encoded watch url>` → JSON with `author_name`, `title`, `thumbnail_url`. Pick entries where `author_name` exactly matches the official account (e.g. `"SpaceX"`); search titles alone lie (many reposts by Spaceflight Now / AP / NASASpaceflight).
- Poster thumbnails: `https://img.youtube.com/vi/<id>/maxresdefault.jpg` (404s for some videos → fall back to `hqdefault.jpg`, always present but only 480×360).

## Clickable video tile pattern (open real video on press)
- Render the tile as a poster `<img>` + a full-card overlay `<a href={watchUrl} target="_blank" rel="noopener noreferrer" aria-label=...>` absolutely positioned `inset-0 z-20`. Avoids ref-type juggling between div/anchor and keeps the whole card clickable + keyboard-focusable.
