# Unkad Labs — website

Website for [unkad.com](https://unkad.com), built with Next.js (App Router, TypeScript, static export). No CSS frameworks — one hand-written stylesheet. `next build` produces a fully static site in `out/` that deploys to any static host.

*Unkad* — Somali for creation from nothing; it shares a root with *unug*, the cell. The brand mark is a "U" of seven cells assembling from a single accent-colored seed.

The original Dhig Labs static-HTML version is preserved in `static-site/` for reference.

## Structure

```
app/layout.tsx              Shared shell: <head>, theme pre-paint script, Header, Footer
app/globals.css             The single stylesheet (design tokens at the top)
app/page.tsx                Home (animated mark, mission, why, workstreams)
app/research/page.tsx       Research agenda, publications, principles
app/platform/page.tsx       The Unkad Platform + email signup placeholder
app/about/page.tsx          Name, mission, people, partnerships, non-profit status
app/contact/page.tsx        Emails and contact guidance
app/articles/page.tsx       Articles index (generated from content/articles/)
app/articles/[slug]/        Article renderer (markdown → HTML at build time)
app/sitemap.ts              sitemap.xml (generated at build, includes all articles)
app/robots.ts               robots.txt (generated at build)
app/icon.svg                The Unkad mark as favicon
components/UnkadMark.tsx    The brand mark (optionally animated)
components/Header.tsx       Nav, active-link state, mobile menu (client component)
components/Footer.tsx       Footer with Somali flourish
components/ThemeToggle.tsx  Light/dark toggle persisted to localStorage
content/articles/*.md       Articles as markdown files with frontmatter
lib/articles.ts             Article loading, frontmatter parsing, date formatting
```

## Develop

```
npm install
npm run dev       # http://localhost:3000
```

## Build & deploy

```
npm run build     # static site written to out/
```

Deployed on Vercel; every push to `main` auto-deploys. Because `next.config.ts` sets `output: 'export'`, the build is plain HTML/CSS/JS and also works on Netlify, Cloudflare Pages, or GitHub Pages (publish directory `out`).

## Write an article

1. Create `content/articles/your-slug.md`:

   ```markdown
   ---
   title: "Your title"
   date: "2026-08-01"
   description: "One-sentence summary for search and social."
   ---

   Your article in markdown.
   ```

2. That's it. The URL (`/articles/your-slug`), the index, the sitemap, and the page metadata are all generated from the file at build time. Push to `main` to publish.

Somali passages should be wrapped in `<span lang="so">…</span>` (or `<p lang="so">`) and marked with `<!-- VERIFY SOMALI -->`.

## Placeholders to fill before launch

Grep for these:

| Marker | Where | What to do |
|---|---|---|
| `[SOMALI TRANSLATION` | `content/articles/unkad-creation-from-nothing.md` | Founders write the closing Somali paragraph |
| `VERIFY SOMALI` | JSX/markdown comments across pages | Founders verify every Somali phrase (`Unkad` gloss, `unug`, `Ereyada waa hanti`, dialect names) |
| `PLACEHOLDER` | JSX comments | Confirm GitHub / Hugging Face org URLs, unkad.com mailboxes, non-profit registration wording |
| `[X PROFILE URL]`, `[LINKEDIN PROFILE URL]` | `app/contact/page.tsx` | Social profiles |

The team section was intentionally removed for now; `app/about/page.tsx` has a "People" placeholder to expand later.

## Wire up the email signup

The form in `app/platform/page.tsx` posts to `#`. To make it live, replace the `action` attribute with a Formspree endpoint (`https://formspree.io/f/YOUR_FORM_ID`) or a Buttondown embed-subscribe URL. Instructions are in a comment above the form.

## Theming

Colors live as CSS custom properties at the top of `app/globals.css`. Dark mode follows the system preference (`prefers-color-scheme`); the header toggle overrides it and persists the choice in `localStorage`. An inline script in `app/layout.tsx` applies the saved theme before first paint. The exported HTML is fully readable with JavaScript disabled.
