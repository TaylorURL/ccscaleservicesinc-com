<img src="public/brand/logo-297.webp" width="200" alt="">

# Compound Industrial Scale Services

Website for a scale calibration, repair and parts shop in Huffman, Texas.

[ccscaleservices.com](https://ccscaleservices.com)

<img src="https://img.shields.io/badge/version-2026.44.1-2850a0?style=for-the-badge" alt="Version 2026.44.1" />

Services, a parts catalog and a quote list that works like a cart. No backend. A quote or service request goes out as an email built in the browser. Nothing stores customer details.

## How it's built

- **Content is data.** Company details, services, parts and the FAQ are modules in `src/content/`. Pages render from them. So does `scripts/generate-crawl-files.mjs`, which writes the sitemap, `robots.txt`, `llms.txt`, the LocalBusiness JSON-LD and the shell's nav before every build. Nothing crawler-facing is kept by hand.
- **Quote list.** `QuoteProvider` holds parts, quantities and notes, mirrored to `localStorage` so the list survives a closed tab. Storage calls are wrapped because they throw when site data is blocked.
- **Requests are email.** `src/lib/request-email.js` builds the message as plain text and as a `mailto:` link. The text is also shown on screen, because a `mailto:` does nothing without a mail client.
- **Real first screen.** `index.html` carries the home page's first screen as markup, and every path rewrites to it. React mounts over it. Home ships in the entry bundle, every other route is a lazy chunk, and React sits in its own `framework` chunk.

<details>
<summary>Decisions and tradeoffs</summary>

- `scripts/first-screen.mjs` inlines the whole stylesheet into `index.html` with Beasties. About 45 kB of CSS on the one request the page can't start without. In return there's no blocking stylesheet request and no layout shift when React takes over.
- A tab left open across a deploy asks for chunks that no longer exist. `src/lib/chunk-recovery.js` reloads once per tab, then resets after a good load. An inline script in `index.html` covers the one case it can't: the entry bundle itself not arriving.
- Form errors say what's wrong and how to fix it. The email check only rejects addresses that can't reach anyone.
- Targets Chrome and Edge 107, Firefox 104 and Safari 16.
- Light, dark and gray themes, applied before first paint.
- Analytics load after the `load` event so they don't slow down the load they measure.
- `middleware.js` checks a TaylorURL status endpoint and shows a holding page if the site is paused. Fails open. `api/version.js` returns the deployed commit, uncached.
- The bottom footer bar is [`@taylorurl/split-rail`](https://github.com/TaylorURL/split-rail), pinned to a tag.

</details>

<details>
<summary>Running it locally</summary>

Needs Node 22.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # crawl files, vite build, then the stylesheet inline
npm run lint
npm run format:check
```

Copy `.env.example` to `.env` and set `VITE_SITE_URL` to the origin you serve from. Canonical tags, Open Graph URLs, the sitemap and the structured data all use it. Unset, it falls back to the production origin.

</details>

## Built with

React 19, React Router 7, Vite 7 and Tailwind CSS 3. Hosted on Vercel.

<details>
<summary>License</summary>

Proprietary. Copyright (c) 2026 TaylorURL LLC, all rights reserved. See [LICENSE.md](LICENSE.md).

</details>

Built and maintained by [TaylorURL](https://www.taylorurl.com).
