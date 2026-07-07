# Dhig Labs — website

Website for [dhiglabs.org](https://dhiglabs.org), built with Next.js (App Router, TypeScript, static export). No CSS frameworks — one hand-written stylesheet. `next build` produces a fully static site in `out/` that deploys to any static host.

The original zero-dependency HTML version is preserved in `static-site/` for reference.

## Structure

```
app/layout.tsx            Shared shell: <head>, theme pre-paint script, Header, Footer
app/globals.css           The single stylesheet (design tokens at the top)
app/page.tsx              Home
app/research/page.tsx     Research agenda, publications, principles
app/platform/page.tsx     The Dhig Platform + email signup placeholder
app/about/page.tsx        Mission, team, partnerships, non-profit status
app/contact/page.tsx      Emails and contact guidance
app/blog/page.tsx         Blog index (generated from lib/posts.ts)
app/blog/hello-world/     First post — also the post template
app/sitemap.ts            sitemap.xml (generated at build, includes all posts)
app/robots.ts             robots.txt (generated at build)
app/icon.svg              Text "D" favicon in the accent color
components/Header.tsx     Nav, active-link state, mobile menu (client component)
components/Footer.tsx     Footer with Somali flourish
components/ThemeToggle.tsx  Light/dark toggle persisted to localStorage
lib/posts.ts              The blog post list — one entry per post
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

Because `next.config.ts` sets `output: 'export'`, the build is plain HTML/CSS/JS — no Node server needed.

- **Netlify** — connect the repo. Build command `npm run build`, publish directory `out`.
- **Cloudflare Pages** — connect the repo. Framework preset Next.js (Static HTML Export), build command `npm run build`, output directory `out`.
- **GitHub Pages** — build in CI (e.g. the official Next.js GitHub Pages action) and publish `out/`. Use the custom domain `dhiglabs.org`.
- **Vercel** — connect the repo; zero config.

## Add a blog post

1. Copy `app/blog/hello-world/` to `app/blog/your-slug/`.
2. Edit the `metadata` export and the article content (a checklist comment sits at the top of the file).
3. Add an entry at the **top** of the array in `lib/posts.ts`. The blog index and sitemap update automatically.

## Placeholders to fill before launch

Grep for these:

| Marker | Where | What to do |
|---|---|---|
| `[NAME]` | `app/about/page.tsx` | Team member names |
| `[to be announced]` | `app/about/page.tsx` | Advisors |
| `[SOMALI TRANSLATION` | `app/blog/hello-world/page.tsx` | Founders write the closing Somali paragraph |
| `VERIFY SOMALI` | JSX comments across pages | Founders verify every Somali phrase (`Dhig` gloss, `Ereyada waa hanti`, dialect names) |
| `PLACEHOLDER` | JSX comments | Confirm GitHub / Hugging Face org URLs, research email, non-profit registration wording |
| `[X PROFILE URL]`, `[LINKEDIN PROFILE URL]` | `app/contact/page.tsx` | Social profiles |

## Wire up the email signup

The form in `app/platform/page.tsx` posts to `#`. To make it live, replace the `action` attribute with a Formspree endpoint (`https://formspree.io/f/YOUR_FORM_ID`) or a Buttondown embed-subscribe URL. Instructions are in a comment above the form.

## Theming

Colors live as CSS custom properties at the top of `app/globals.css`. Dark mode follows the system preference (`prefers-color-scheme`); the header toggle overrides it and persists the choice in `localStorage`. An inline script in `app/layout.tsx` applies the saved theme before first paint. The exported HTML is fully readable with JavaScript disabled (the menu and theme toggle are JS-only enhancements, hidden until hydration).
