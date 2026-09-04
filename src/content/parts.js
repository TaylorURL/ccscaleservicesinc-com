/**
 * The parts catalog. Each entry becomes a browsable page at /parts/:slug, so the
 * catalog doubles as the site's long-tail search surface: someone typing "shear
 * beam load cell replacement" is looking for one of these pages.
 *
 * Parts are quoted, not priced. Capacity, output, and cable length all move the
 * number, and a customer rarely knows all three when they start. `askFor` is the
 * list of details a quote needs. The part page prints it and the quote request
 * repeats it per line item, which turns a vague "I need a load cell" into
 * something sales can price without a phone call.
 *
 * `slug` is a permanent URL. Retire a part by removing it and letting the page
 * 404. Renaming a slug breaks every link already pointing at it.
 *
 * `name` is Title Case, because it renders as a filter button, a card heading,
 * an `h1`, and a line in a quote email. `summary` and `description` are sentence
 * case; they are prose.
 *
 * `category` names one of the groups in part-categories.js, which is its own
 * module because the header and the home page read it on every visit and this
 * file is read only by the two parts routes.
 */

export const parts = [
  {
    slug: 'shear-beam-load-cell',
    name: 'Shear Beam Load Cell',
    category: 'load-cells',
    summary: 'The standard cell under floor scales, tank scales, and most bench platforms.',
    description:
      'A shear beam bolts down at one end and takes the load at the other, which makes it the usual choice for floor and platform scales between 1,000 and 10,000 lb. Replace one when a corner reads low, when the cell sits out of tolerance at zero, or when the cable jacket has been cut or crushed.',
    askFor: [
      'Scale make and model',
      'Cell capacity',
      'Number of cells on the scale',
      'Cable length needed',
    ],
    keywords: ['shear beam', 'floor scale load cell', 'platform scale sensor'],
  },
  {
    slug: 'single-point-load-cell',
    name: 'Single-Point Load Cell',
    category: 'load-cells',
    summary: 'One cell carrying a whole platform, used in bench and counting scales.',
    description:
      "A single-point cell holds up the platform by itself and reads the same wherever the load sits on the pan. It's what you find in bench, counting, and checkweighing scales. When a small scale weighs differently depending on where you set the item down, this is the part.",
    askFor: ['Scale make and model', 'Cell capacity', 'Platform size'],
    keywords: [
      'single point',
      'single-point load cell',
      'bench scale load cell',
      'off center load',
    ],
  },
  {
    slug: 'compression-canister-load-cell',
    name: 'Compression Canister Load Cell',
    category: 'load-cells',
    summary: 'Sealed high-capacity cells for truck scales and tank weighing.',
    description:
      "Canister cells take the load straight down through a rocker or a load button, and they're built for the capacities and the weather a truck scale lives in. Water and lightning kill most of them. A failed canister usually shows up as one section of the deck reading high or low.",
    askFor: [
      'Scale make and model',
      'Cell capacity',
      'Section that reads wrong',
      'Cable length needed',
    ],
    keywords: ['canister load cell', 'truck scale load cell', 'tank weighing'],
  },
  {
    slug: 'double-ended-beam-load-cell',
    name: 'Double-Ended Beam Load Cell',
    category: 'load-cells',
    summary: 'Beam cells supported at both ends, common under weighbridges and rail scales.',
    description:
      'A double-ended beam carries the load at its center with support at either end, spreading it in a way that suits heavy vehicle and rail work. In most cases one goes back in with the original mounting hardware and check rods.',
    askFor: ['Scale make and model', 'Cell capacity', 'Mounting kit needed', 'Cable length needed'],
    keywords: ['double ended beam', 'double-ended beam', 'weighbridge load cell', 'rail scale'],
  },
  {
    slug: 'digital-weight-indicator',
    name: 'Digital Weight Indicator',
    category: 'indicators',
    summary:
      'The scale head. It reads the cells, shows the weight, and feeds printers and host systems.',
    description:
      "The indicator handles the conversion, the filtering, and the communication. Replace one when the display fails, a strike takes the board out, or the head you have can't talk to the software you need it to feed.",
    askFor: [
      'Current indicator make and model',
      'Number of load cells it drives',
      'Outputs needed (printer, serial, Ethernet, USB)',
      'Indoor, washdown, or outdoor mounting',
    ],
    keywords: ['weight indicator', 'scale head', 'digital readout'],
  },
  {
    slug: 'remote-display',
    name: 'Remote Display',
    category: 'indicators',
    summary:
      'A large second display, so the driver or the operator can read the weight from where they stand.',
    description:
      'A remote display repeats what the indicator shows, out at the truck lane, the dock, or across the plant floor. Sizing comes down to two things: how far away it gets read from, and whether it lives indoors or out.',
    askFor: [
      'Indicator make and model',
      'Viewing distance',
      'Indoor or outdoor',
      'Character height preferred',
    ],
    keywords: ['remote display', 'scoreboard display', 'truck lane display'],
  },
  {
    slug: 'summing-junction-box',
    name: 'Summing Junction Box',
    category: 'junction-boxes-and-cable',
    summary: 'Combines and trims the load cell signals on a multi-cell scale.',
    description:
      'Every cell on a multi-cell scale lands in the junction box, where the signals are summed and the corners are trimmed. A corroded or water-filled box is one of the most common causes of drifting and erratic readings, and it gets blamed on the cells more often than it should.',
    askFor: ['Number of load cells', 'Analog or digital cells', 'Indoor, outdoor, or washdown'],
    keywords: ['junction box', 'summing card', 'corner trim'],
  },
  {
    slug: 'load-cell-cable',
    name: 'Load Cell Cable',
    category: 'junction-boxes-and-cable',
    summary: 'Shielded cable between the cells, the junction box, and the indicator.',
    description:
      'Load cell cable carries a signal measured in millivolts, so the shield and the jacket matter. Rodents, forklifts, and water wicking in through a cut jacket all produce the same symptom: readings that wander.',
    askFor: ['Conductor count', 'Length needed', 'Direct burial or conduit run'],
    keywords: ['load cell cable', 'shielded cable', 'scale wiring'],
  },
  {
    slug: 'surge-protection',
    name: 'Surge Protection',
    category: 'junction-boxes-and-cable',
    summary: 'Protection on the signal and power lines of an outdoor scale.',
    description:
      'An outdoor scale has long cable runs that behave like antennas in a storm. Protection on the cell and indicator lines costs a fraction of the cells and boards a single strike takes out.',
    askFor: [
      'Scale location and cable run length',
      'Indicator make and model',
      'Existing protection, if any',
    ],
    keywords: ['surge protection', 'lightning protection', 'truck scale storm damage'],
  },
  {
    slug: 'ticket-printer',
    name: 'Ticket Printer',
    category: 'printers-and-supplies',
    summary: 'Prints weight tickets from the indicator at the scale house or the lane.',
    description:
      'A ticket printer wires to the indicator and prints the record a customer or a hauler leaves with. Matching the printer to the indicator interface is the part that catches people out.',
    askFor: [
      'Indicator make and model',
      'Ticket or form size',
      'Interface available (serial, USB, Ethernet)',
    ],
    keywords: ['ticket printer', 'weight ticket', 'scale house printer'],
  },
  {
    slug: 'printer-ribbons-and-ticket-stock',
    name: 'Printer Ribbons and Ticket Stock',
    category: 'printers-and-supplies',
    summary: 'The consumables, including custom-printed tickets.',
    description:
      'Ribbons, rolls, and pre-printed stock for the printers in the field. Custom tickets carrying your company name and your own numbering are ordered the same way.',
    askFor: ['Printer make and model', 'Ticket size', 'Quantity', 'Custom printing needed'],
    keywords: ['printer ribbon', 'weight ticket stock', 'custom scale tickets'],
  },
  {
    slug: 'cast-iron-test-weights',
    name: 'Cast Iron Test Weights',
    category: 'test-weights',
    summary: 'Bulk weights for testing floor, truck, and platform scales.',
    description:
      'Cast iron weights from 25 lb up to 1,000 lb are what a large scale gets tested against. Owning a set makes sense if you check your own scales between service visits.',
    askFor: [
      'Weight sizes and quantity',
      'Certification needed',
      'Handling method (forklift, cart, by hand)',
    ],
    keywords: ['test weights', 'calibration weights', 'scale test weight set'],
  },
  {
    slug: 'precision-weight-sets',
    name: 'Precision Weight Sets',
    category: 'test-weights',
    summary: 'Class F and laboratory weights for bench, counting, and lab scales.',
    description:
      "Small precision weights in a case, for checking bench and analytical scales in place. Get the certification class right: it has to be tighter than the scale you're testing, or the test tells you nothing.",
    askFor: ['Scale capacity and readability', 'Class required', 'Certificate needed'],
    keywords: ['precision weights', 'class F weights', 'lab balance weights'],
  },
  {
    slug: 'load-cell-mounting-kits',
    name: 'Load Cell Mounting Kits',
    category: 'mounting-and-hardware',
    summary: 'The hardware that positions a cell so it takes load the way it was designed to.',
    description:
      "A cell only reads correctly when it's mounted correctly. A kit covers the cups, rockers, feet, and plates that go with a given cell, and it usually gets replaced alongside the cell after a long service life.",
    askFor: ['Load cell model', 'Scale make and model', 'Number of positions'],
    keywords: ['load cell mounting kit', 'rocker assembly', 'weigh module'],
  },
  {
    slug: 'check-rod-assemblies',
    name: 'Check Rod Assemblies',
    category: 'mounting-and-hardware',
    summary: 'Keeps a weighbridge square and in position under traffic.',
    description:
      'Check rods stop a weighbridge walking as trucks brake and turn on it. Worn rods and bushings let the deck shift, and that shows up as readings that change with where the driver stops.',
    askFor: ['Scale make and model', 'Number of rods needed', 'Rod length, if known'],
    keywords: ['check rods', 'weighbridge hardware', 'truck scale deck movement'],
  },
  {
    slug: 'leveling-feet-and-platform-hardware',
    name: 'Leveling Feet and Platform Hardware',
    category: 'mounting-and-hardware',
    summary: 'Feet, bumpers, and fasteners for bench and floor scales.',
    description:
      "The small hardware that keeps a platform level and stops it touching the frame. A scale in contact with its own frame reads low, and it's a five-minute fix once somebody looks for it.",
    askFor: ['Scale make and model', 'Part needed', 'Quantity'],
    keywords: ['leveling feet', 'scale platform hardware', 'bumper bolts'],
  },
];

/** Lookup for the part detail route. */
export const partBySlug = Object.fromEntries(parts.map((part) => [part.slug, part]));

/**
 * Free-text match across the fields a customer would actually type: the part
 * name, what it does, and the phrases they search for instead of the ones the
 * industry uses.
 */
export function searchParts(query) {
  const term = query.trim().toLowerCase();
  if (!term) return parts;
  return parts.filter((part) =>
    [part.name, part.summary, part.description, ...part.keywords]
      .join(' ')
      .toLowerCase()
      .includes(term)
  );
}
