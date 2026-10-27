<p align="center"><img src="public/brand/logo-297.webp" width="200" alt=""></p>
<h1 align="center">Compound Industrial Scale Services</h1>
<p align="center">Website for a scale calibration, repair and parts shop in Huffman, Texas.</p>
<p align="center"><a href="https://ccscaleservices.com">ccscaleservices.com</a></p>
<p align="center">
  <img src="https://img.shields.io/badge/version-2026.44.0-2850a0?style=for-the-badge" alt="Version 2026.44.0" />
</p>

Compound Industrial Scale Services Inc calibrates, repairs, installs and maintains industrial scales, and sells the parts that go in them. The site lists the services and a parts catalog. Customers can build a list of the parts they need and send it to sales as a quote request.

## What's on the site

- Five services: calibration, repair and troubleshooting, preventive maintenance, installation and setup, and parts
- A searchable parts catalog in six categories (load cells, indicators, junction boxes and cable, printers, test weights, mounting hardware), with a page for each part
- A quote list where each part carries the make, model and capacity of the scale it's for
- Quote and service requests open as an email in the visitor's own mail app, so nothing is stored on a server
- Light, dark and gray themes

## Running it locally

You need Node 22.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # regenerates the sitemap, robots.txt and llms.txt, then builds to dist/
```

Nothing has to be configured to run it. `.env.example` has one optional variable, `VITE_SITE_URL`, the domain used for canonical links and the sitemap (it defaults to `https://ccscaleservices.com`). Copy it to `.env` if you need to change that.

Services, parts, categories, FAQ and the business details (phone, emails, address) are plain JS files in `src/content/`. Adding a part is a new entry in `src/content/parts.js`.

## Built with

React 19, React Router 7, Vite 7 and Tailwind CSS 3. Hosted on Vercel.

---

Built and maintained by [TaylorURL](https://www.taylorurl.com). Proprietary, see [LICENSE.md](LICENSE.md).
