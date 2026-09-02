import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Beasties from 'beasties';

/**
 * Writes the rules the shell needs into the document beside it.
 *
 * index.html carries the home route's first screen as markup, so the document
 * is ready to draw the moment it lands. A browser will not draw a page whose
 * `<link rel="stylesheet">` is still in flight, though, so that screen waited
 * on a round trip and a download before any of it counted, and the photograph
 * behind the hero queued against the same sheet for the bandwidth.
 *
 * The rules the shell's own markup uses go into a `<style>` here. The sheet is
 * then asked for on a media query that matches nothing, which fetches it
 * without holding the paint, and switched on when it arrives. Nothing is
 * dropped from it: what lands late is only what the document has no element
 * for yet, which is every route other than the one the shell draws, and none of
 * those exist until the bundle has run.
 *
 * The states the page takes on afterwards are the exception, because none of
 * them is on an element at build time - the theme the root is stamped with
 * before the first paint, a details panel once it is open, a link once it is
 * current. Every rule keyed on a `data-` or `aria-` attribute rides along
 * regardless. The two font faces ride along too, or the files preloaded in the
 * head arrive with no `@font-face` naming them and the type is set twice.
 *
 * Runs after `vite build`, over the document Vite has just written.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'dist');
const document = resolve(outDir, 'index.html');

const html = await readFile(document, 'utf8');
if (!html.includes('rel="stylesheet"')) {
  throw new Error('dist/index.html carries no stylesheet to inline from');
}

const inlined = await new Beasties({
  path: outDir,
  publicPath: '/',
  preload: 'media',
  pruneSource: false,
  inlineFonts: true,
  preloadFonts: false,
  allowRules: [/\[(data|aria)-/],
  reduceInlineStyles: false,
  mergeStylesheets: false,
  logLevel: 'silent',
}).process(html);

// Beasties stamps the element it treated as the document; the page does not
// need to carry that.
await writeFile(document, inlined.replace(' data-beasties-container', ''), 'utf8');
