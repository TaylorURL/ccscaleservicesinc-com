import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Writes every crawler-facing file from the same content modules the pages
 * render: public/sitemap.xml, public/robots.txt, public/llms.txt, and both the
 * LocalBusiness JSON-LD block and the nav panels' destination lists inside
 * index.html. A part added to the catalog is in the sitemap, llms.txt, and the
 * shell's own navigation on the next build, and a phone number changed in
 * company.js reaches the static structured data without a second edit. Any of
 * these maintained by hand goes stale the first time someone forgets, and a
 * stale one is worse than none, because it points crawlers at claims the site
 * no longer makes.
 *
 * robots.txt is generated here rather than kept as a static file so its
 * `Sitemap:` line cannot name a different domain than the sitemap it points
 * at. Both read the same origin, which comes from VITE_SITE_URL when the host
 * sets one.
 *
 * Runs as the `prebuild` script, ahead of Vite copying `public/` into `dist/`.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const { company, addressLine } = await import(
  pathToFileURL(resolve(root, 'src/content/company.js'))
);
const { parts, partCategories } = await import(
  pathToFileURL(resolve(root, 'src/content/parts.js'))
);
const { services } = await import(pathToFileURL(resolve(root, 'src/content/services.js')));
const { localBusinessSchema } = await import(
  pathToFileURL(resolve(root, 'src/lib/structured-data.js'))
);

/**
 * Vite rewrites `import.meta.env` for the bundle, but this script runs in plain
 * Node, so the same variable has to be read off `process.env` here. Without this
 * the generated files would keep the fallback origin while the pages used the
 * configured one.
 */
const siteUrl = (process.env.VITE_SITE_URL || company.url).replace(/\/$/, '');

/** `changefreq` and `priority` are hints; the ordering below reflects how often each page changes. */
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/parts', priority: '0.9', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'yearly' },
  { path: '/contact', priority: '0.8', changefreq: 'yearly' },
  { path: '/privacy', priority: '0.2', changefreq: 'yearly' },
  { path: '/terms', priority: '0.2', changefreq: 'yearly' },
];

const partRoutes = parts.map((part) => ({
  path: `/parts/${part.slug}`,
  priority: '0.7',
  changefreq: 'monthly',
}));

const lastmod = new Date().toISOString().slice(0, 10);

const body = [...staticRoutes, ...partRoutes]
  .map(
    (route) =>
      `  <url>\n    <loc>${siteUrl}${route.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

/**
 * Crawlers that only collect training data. Named and refused so the stance is
 * a decision rather than a default: a citation in an AI answer sends a customer
 * here, so the fetchers behind those answers stay allowed, while inclusion in a
 * training set sends nothing back. Blocking Google-Extended does not affect
 * Search, and blocking GPTBot does not stop ChatGPT citing the site.
 */
const trainingCrawlers = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Bytespider',
  'CCBot',
  'Applebot-Extended',
  'meta-externalagent',
];

/**
 * The other half of the same decision. Each of these fetches a page because
 * somebody asked a question it answers, and the answer carries a link back, so
 * each is named and allowed rather than left to the wildcard. Naming both lists
 * is what makes the file a position on every crawler that matters, instead of a
 * list of refusals and silence for the rest.
 */
const citationCrawlers = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User'];

const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  ...citationCrawlers.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
  ...trainingCrawlers.flatMap((agent) => [`User-agent: ${agent}`, 'Disallow: /', '']),
  `Sitemap: ${siteUrl}/sitemap.xml`,
  '',
].join('\n');

/** The site's shape in one fetch, for readers that take llms.txt over a crawl. */
const llms = [
  `# ${company.name}`,
  '',
  `> ${company.legalName} calibrates, repairs, and maintains industrial and commercial scales from ${addressLine || 'Huffman, Texas'}, and supplies the load cells, indicators, and hardware that go into them. Parts are quoted against the scale make and model rather than priced flat. Phone: ${company.phone}. Email: ${company.email.sales}.`,
  '',
  '## Pages',
  '',
  `- [Services](${siteUrl}/services): ${services.map((service) => service.name).join(', ')}`,
  `- [Parts catalog](${siteUrl}/parts): ${partCategories.map((category) => category.name).join(', ')}`,
  `- [Quote request](${siteUrl}/quote): collect parts into one list and send it with the scale details`,
  `- [About](${siteUrl}/about): who does the work and how it is done`,
  `- [Contact](${siteUrl}/contact): request service, or call ${company.phone}`,
  `- [Privacy](${siteUrl}/privacy): what the site stores and what it sends`,
  `- [Terms of use](${siteUrl}/terms): what a request is, and how the pages may be used`,
  '',
  '## Parts',
  '',
  ...parts.map((part) => `- [${part.name}](${siteUrl}/parts/${part.slug}): ${part.summary}`),
  '',
].join('\n');

/**
 * The static copy of the LocalBusiness block, replaced inside index.html so the
 * shell states the business identity to fetchers that never run the app. The
 * script tag's id is the anchor; everything between its tags is rewritten.
 */
const indexPath = resolve(root, 'index.html');
const indexHtml = await readFile(indexPath, 'utf8');
const block = JSON.stringify(localBusinessSchema(), null, 2).replace(/^/gm, '      ');
let synced = indexHtml.replace(
  /(<script type="application\/ld\+json" id="local-business">)[\s\S]*?(<\/script>)/,
  `$1\n${block}\n    $2`
);
if (synced === indexHtml && !indexHtml.includes('id="local-business"')) {
  throw new Error('index.html has no <script id="local-business"> block to sync');
}

/** Names and blurbs are authored prose, so they are escaped before going into markup. */
const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * One row of a shell nav panel: an anchor, a name, and a one-line description.
 * The description is not decoration - past six destinations a reader picks by
 * it rather than by the name, and a column of bare anchors reads as a sitemap.
 *
 * The indentation is baked into the strings because the result is spliced into
 * index.html, which Prettier formats; a row at the wrong depth shows up as a
 * diff on every build.
 */
const shellRows = (items) =>
  items
    .map(
      (item) =>
        '                    <li>\n' +
        `                      <a class="block rounded-md px-3 py-2" href="${item.href}">\n` +
        '                        <span class="font-display text-sm font-bold text-ink-inverse"\n' +
        `                          >${escape(item.name)}</span\n` +
        '                        >\n' +
        '                        <span class="block text-xs leading-snug text-ink-inverse-muted"\n' +
        `                          >${escape(item.blurb)}</span\n` +
        '                        >\n' +
        '                      </a>\n' +
        '                    </li>'
    )
    .join('\n');

/**
 * The destination lists inside the shell's two nav panels, keyed by the id of
 * the `<ul>` each one replaces. They come from the same arrays the app's own
 * panels map over, so a service or a category added to the catalog cannot be
 * missing from the markup a fetcher that runs no scripts is served.
 *
 * Parts has its own destination in the bar, so the service entry pointing at it
 * is dropped here for the reason the app drops it.
 */
const shellPanels = {
  'shell-services': services
    .filter((service) => service.slug !== 'parts')
    .map((service) => ({
      href: `/services#${service.slug}`,
      name: service.name,
      blurb: service.summary,
    })),
  'shell-parts': partCategories.map((category) => ({
    href: `/parts#${category.slug}`,
    name: category.name,
    blurb: category.blurb,
  })),
};

for (const [id, items] of Object.entries(shellPanels)) {
  const anchor = new RegExp(`(<ul class="flex flex-col" id="${id}">)[\\s\\S]*?(</ul>)`);
  if (!anchor.test(synced)) {
    throw new Error(`index.html has no <ul id="${id}"> to sync`);
  }
  synced = synced.replace(anchor, `$1\n${shellRows(items)}\n                  $2`);
}

await mkdir(resolve(root, 'public'), { recursive: true });
await writeFile(resolve(root, 'public/sitemap.xml'), sitemap, 'utf8');
await writeFile(resolve(root, 'public/robots.txt'), robots, 'utf8');
await writeFile(resolve(root, 'public/llms.txt'), llms, 'utf8');
await writeFile(indexPath, synced, 'utf8');

process.stdout.write(
  `${staticRoutes.length + partRoutes.length} urls written for ${siteUrl}; robots, llms.txt, ` +
    `the business block, and the shell's ${Object.values(shellPanels).flat().length} nav ` +
    'destinations are in step\n'
);
