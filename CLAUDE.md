# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The Unkad Labs website (`unkad.com`) — a non-profit AI research lab. Next.js App
Router, TypeScript, **static export**, one hand-written stylesheet, no CSS framework and no UI
libraries. Runtime deps are only `next`, `react`, `gray-matter`, `marked`, `@vercel/analytics`.

Note the directory name is `dhiblabs` (the lab's former name) but the package is `unkad-site` and
the git remote is `Unkadlabs/unkad-website`. The sibling repo `../unkad-platform` is the corpus
platform at `qor.unkad.com`.

*Unkad* — Somali for creation from nothing; shares a root with *unug*, the cell. The brand mark is
a "U" of seven cells assembling from a single accent-colored seed (`components/UnkadMark.tsx`).

## Commands

```bash
npm run dev      # http://localhost:3000 (or port 3742 via .claude/launch.json)
npm run build    # static site → out/  — also the only real typecheck
npm run start    # serve a production build
```

`npm run lint` exists but **no ESLint config or dependency is committed**, so it will trigger
Next's interactive setup. There is no test suite; `npm run build` (or `npx tsc --noEmit`) is the
verification step. Because `next.config.ts` sets `output: 'export'`, nothing server-side is
available at runtime — no server actions, no route handlers, no dynamic rendering. Data must be
resolved at build time or fetched client-side.

## Architecture

**Pages are the content.** Each route under `app/` is a static server component holding its own
copy as JSX — there is no CMS and no i18n layer. The only generated content is articles.

- `content/articles/*.md` → `lib/articles.ts` → `app/articles/[slug]/`. Publishing an article is
  dropping in a markdown file: the filename becomes the slug, and the index, sitemap
  (`app/sitemap.ts`), page metadata, OG image (`app/articles/[slug]/opengraph-image.tsx`), table
  of contents (from `h2`s, ids slugified at build), and reading time all derive from the file.
  Frontmatter: `title`, `date`, `description`, optional `topics` (display chips), `keywords`
  (SEO), `image`.
- `app/globals.css` — the single stylesheet (~1000 lines), design tokens at the top. Dark mode is
  `prefers-color-scheme` plus a `[data-theme]` manual override that wins in both directions;
  `app/layout.tsx` pre-paints the saved theme before first paint to avoid a flash. The platform
  repo shares these tokens (same teal accent, Charter serif, mono apparatus, `--measure: 42rem`).
- `components/LiveStats.tsx` — the one client-side data path: fetches
  `https://qor.unkad.com/api/stats` and renders **nothing** if the fetch fails, so the static page
  degrades cleanly. Keep that property.
- `static-site/` — the original Dhig Labs hand-written HTML site, preserved for reference only.
  Not built, not deployed.
- `docs/` — prospectus, strategy, experiment designs, and article drafts. Substantive research
  planning lives here, not in code.

Deployed on Vercel; every push to `main` auto-deploys. The build is plain HTML/CSS/JS in `out/`,
so it also works on Netlify, Cloudflare Pages, or GitHub Pages.

## Somali text

Somali passages must be wrapped in `<span lang="so">…</span>` (or `<p lang="so">`) and marked
with a `<!-- VERIFY SOMALI -->` comment. Founders verify every Somali phrase before it ships —
don't silently rewrite or "correct" Somali copy; flag it instead.

## Placeholders still open before launch

Grep for these; the README table has the full detail:

| Marker | Where |
|---|---|
| `[SOMALI TRANSLATION` | `content/articles/unkad-creation-from-nothing.md` closing paragraph |
| `VERIFY SOMALI` | JSX/markdown comments across pages |
| `PLACEHOLDER` | GitHub / Hugging Face org URLs, unkad.com mailboxes, non-profit wording |
| `[X PROFILE URL]`, `[LINKEDIN PROFILE URL]` | `app/contact/page.tsx` |

The email signup in `app/platform/page.tsx` still posts to `#`; a comment above the form explains
swapping in a Formspree or Buttondown endpoint. `app/about/page.tsx` has a "People" placeholder —
the team section was intentionally removed for now.

## Known rough edges

- `.claude/launch.json` points its `unkad-platform` config at `/Users/khalidyusufdahir/research/unkad-platform`,
  which is stale — both repos now live under `research/unkad/`.
