/**
 * The six groups the catalog is filed under.
 *
 * They are a separate module from the catalog because they are read in
 * different places at different times. The header's parts menu and the home
 * page's grid name the categories on every visit, so they are in the bundle the
 * first screen loads; the parts themselves are only ever read by /parts and
 * /parts/:slug, which are chunks of their own. Held in one file with the
 * catalog, a category name asked for on the home page brought every part's
 * description, quote fields, and search keywords with it.
 *
 * `slug` is a permanent URL: it is what /parts filters on. `name` is Title
 * Case, because it renders as a filter button and a heading. `blurb` is a
 * sentence.
 */

export const partCategories = [
  {
    slug: 'load-cells',
    name: 'Load Cells',
    blurb: 'The sensor under the scale. Most accuracy problems trace back to one of these.',
  },
  {
    slug: 'indicators',
    name: 'Indicators and Displays',
    blurb:
      'The head that reads the cells and drives the printer, the remote display, and the host system.',
  },
  {
    slug: 'junction-boxes-and-cable',
    name: 'Junction Boxes and Cable',
    blurb:
      'Where the signals from several cells are combined, and the wiring that carries them to the indicator.',
  },
  {
    slug: 'printers-and-supplies',
    name: 'Printers and Supplies',
    blurb: 'Ticket printers and the consumables that keep them running.',
  },
  {
    slug: 'test-weights',
    name: 'Test Weights',
    blurb: 'Certified weights for calibration, and for your own accuracy checks between visits.',
  },
  {
    slug: 'mounting-and-hardware',
    name: 'Mounting and Hardware',
    blurb: 'Mounting kits, check rods, and the hardware that holds a weighbridge square.',
  },
];

/** Lookup for the category heading and blurb shown above a filtered list. */
export const categoryBySlug = Object.fromEntries(
  partCategories.map((category) => [category.slug, category])
);
