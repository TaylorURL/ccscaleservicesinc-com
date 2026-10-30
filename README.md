<img src="public/brand/logo-297.webp" width="200" alt="">

# Compound Industrial Scale Services

Website for a scale calibration, repair and parts shop in Huffman, Texas.

[ccscaleservices.com](https://ccscaleservices.com)

<img src="https://img.shields.io/badge/version-2026.44.4-2850a0?style=for-the-badge" alt="Version 2026.44.4" />

There's no backend. Customers build a parts list like a cart, and when they send it the browser writes the email for them. Nothing about the customer gets stored anywhere.

The list lives in `QuoteProvider` and is mirrored to `localStorage`, so closing the tab doesn't lose it. The storage calls are wrapped because they throw when someone has site data blocked. `src/lib/request-email.js` turns the list into plain text and a `mailto:` link, and the text is shown on screen too, since a `mailto:` does nothing on a machine with no mail client.

Company details, services, parts and the FAQ are modules in `src/content/`. The pages read them, and so does `scripts/generate-crawl-files.mjs`, which writes the sitemap, `robots.txt`, `llms.txt`, the LocalBusiness JSON-LD and the shell's nav before every build. I don't keep any of that by hand.

## Load speed

`index.html` already has the home page's first screen in it, and every path rewrites to it. React mounts over that markup. After the build, `scripts/first-screen.mjs` inlines the whole stylesheet with Beasties. That's about 45 kB of CSS on the one request the page needs anyway, and it buys no blocking stylesheet and no layout shift when React takes over.

A tab left open across a deploy will ask for chunks that are gone. `src/lib/chunk-recovery.js` reloads once per tab, and an inline script covers the entry bundle itself not arriving.

## Running it

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # crawl files, vite build, then the stylesheet inline
```

Node 22. Set `VITE_SITE_URL` in `.env` if you serve it from somewhere other than production. Canonicals, Open Graph and the sitemap all read it.

React 19, React Router 7, Vite 7 and Tailwind CSS 3 on Vercel. Proprietary, see [LICENSE.md](LICENSE.md).

Built and maintained by [TaylorURL](https://www.taylorurl.com).
