import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Beasties from 'beasties';

/**
 * Writes the site's stylesheet into the document that carries the first screen.
 *
 * index.html carries the home route's first screen as markup, so the document
 * is ready to draw the moment it lands. A browser will not draw a page whose
 * `<link rel="stylesheet">` is still in flight, though, so that screen waited
 * on a round trip and a download before any of it counted, and the photograph
 * behind the hero queued against the same sheet for the bandwidth.
 *
 * Anything that lets the document draw before the sheet applies puts the sheet
 * in a race with the bundle, and the bundle is what makes losing it expensive.
 * The shell is laid out against whatever rules the document itself carries, but
 * React replaces the shell with the page it stands in for as soon as the bundle
 * runs, and that page is laid out against the same rules. A sheet still in
 * flight at that moment leaves the column with no widths, no padding and no
 * grid; when it lands, the whole column relays out under the reader, a shift
 * the height of the viewport on however many loads the sheet happens to lose.
 *
 * So the sheet is taken whole into the document and the link that asked for it
 * comes out. It is 45 kB of CSS, around 9 kB on the wire, on the one request
 * the page cannot begin without, and it buys back both the round trip and the
 * ordering. Nothing about the page arrives late afterwards, because there is
 * nothing left to arrive: the rules for every route are in the document before
 * the parser reaches the body, the two font faces are declared beside the files
 * the head preloads, and the states the page takes on later - the theme the
 * root is stamped with before the first paint, a details panel once it is open,
 * a link once it is current - are ordinary rules in the same sheet.
 *
 * Vite still writes the sheet to `/assets/` under its content hash. Nothing
 * asks for it.
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
  // Beasties is built to cut a sheet down to the rules the document's own
  // markup uses and leave the remainder outside on a link. A threshold no sheet
  // can be larger than is what takes the file whole instead, link and all.
  inlineThreshold: Number.POSITIVE_INFINITY,
  logLevel: 'silent',
}).process(html);

// Beasties stamps the element it treated as the document; the page does not
// need to carry that.
const output = inlined.replace(' data-beasties-container', '');

// The threshold is the whole of the mechanism, so the document is read back for
// what it was supposed to produce: a sheet that stayed external leaves the
// first screen racing the bundle, and it would ship looking fine.
if (/<link[^>]+rel="stylesheet"/.test(output)) {
  throw new Error('dist/index.html still links a stylesheet; the sheet was not taken whole');
}

await writeFile(document, output, 'utf8');
