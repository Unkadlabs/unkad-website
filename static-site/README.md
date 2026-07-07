# Dhig Labs — website

Static site for [dhiglabs.org](https://dhiglabs.org). Plain HTML + CSS + a few lines of vanilla JS. No build step, no frameworks, no dependencies.

## File structure

```
index.html              Home
research.html           Research agenda, publications, principles
platform.html           The Dhig Platform + email signup placeholder
about.html              Mission, team, partnerships, non-profit status
contact.html            Emails and contact guidance
blog/index.html         Blog index (reverse-chronological list)
blog/hello-world.html   First post — also the post template
css/style.css           The single stylesheet (design tokens at the top)
js/main.js              Theme toggle + mobile nav (site works without JS)
favicon.svg             Text "D" favicon in the accent color
sitemap.xml             All 7 URLs
robots.txt              Allows all crawlers, points to sitemap
```

All internal links are root-relative (`/css/style.css`), so the site must be served from a domain root — which is the case on Netlify, Cloudflare Pages, and GitHub Pages with a custom domain.

## Preview locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. (Opening files directly with `file://` will break the root-relative links.)

## Deploy

**GitHub Pages** — push this folder to a repo, then Settings → Pages → deploy from branch `main`, root folder. Add the custom domain `dhiglabs.org` in the same screen (root-relative links require the custom domain, not the `username.github.io/repo` subpath).

**Netlify** — drag the folder into the Netlify dashboard, or connect the repo. Build command: none. Publish directory: `/`.

**Cloudflare Pages** — connect the repo. Framework preset: none. Build command: none. Output directory: `/`.

## Add a blog post

1. Copy `blog/hello-world.html` to `blog/your-slug.html`.
2. Update the `<title>`, meta description, canonical URL, `og:*` tags, `<h1>`, `<time>`, and the article body. (A checklist comment sits at the top of the file.)
3. Add one `<li>` entry to the **top** of the list in `blog/index.html`.
4. Add one `<url>` entry to `sitemap.xml`.

## Placeholders to fill before launch

Grep for these:

| Marker | Where | What to do |
|---|---|---|
| `[NAME]` | `about.html` | Team member names |
| `[to be announced]` | `about.html` | Advisors |
| `[SOMALI TRANSLATION` | `blog/hello-world.html` | Founders write the closing Somali paragraph |
| `VERIFY SOMALI` | all pages (HTML comments) | Founders verify every Somali phrase (`Dhig` gloss, `Ereyada waa hanti`, dialect names) |
| `PLACEHOLDER` | HTML comments | Confirm GitHub / Hugging Face org URLs, research email, non-profit registration wording |
| `[X PROFILE URL]`, `[LINKEDIN PROFILE URL]` | `contact.html` | Social profiles |

## Wire up the email signup

The form in `platform.html` posts to `#`. To make it live, replace the `action` attribute with a Formspree endpoint (`https://formspree.io/f/YOUR_FORM_ID`) or a Buttondown embed-subscribe URL. Instructions are in a comment above the form.

## Theming

Colors live as CSS custom properties at the top of `css/style.css`. Dark mode follows the system preference (`prefers-color-scheme`); the header toggle overrides it and persists the choice in `localStorage`.
