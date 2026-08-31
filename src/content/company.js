/**
 * Every business fact the site states lives here, so a detail that changes -- a
 * phone number, a certification, a service county -- is one edit rather than a
 * search across pages.
 *
 * An empty value is the way a fact that is not established yet is held. The
 * header, footer, About page, and contact page each test a field before
 * rendering it, so a blank leaves no empty heading or dead "Call:" label behind,
 * and filling it in is all it takes for the UI to appear. Never put a plausible
 * value in a field to fill it: it will be published as fact.
 */

/**
 * The origin the site is served from. It has to match the domain in the browser
 * bar, because it is what canonical tags, Open Graph URLs, the sitemap, and the
 * structured data all point at. A canonical naming a domain that does not serve
 * the page tells a crawler to index the other domain instead, which is how a
 * live site disappears from search results.
 *
 * Set `VITE_SITE_URL` in the host's environment to move the site to another
 * domain without a code change. The guard keeps this readable from both Vite,
 * which rewrites `import.meta.env` at build time, and plain Node, which runs the
 * sitemap script and has no such object.
 */
const buildEnv = (typeof import.meta === 'object' && import.meta.env) || {};
const siteUrl = buildEnv.VITE_SITE_URL || 'https://ccscaleservices.com';

export const company = {
  legalName: 'Compound Industrial Scale Services Inc',
  name: 'Compound Industrial Scale Services',
  url: siteUrl,
  domain: siteUrl.replace(/^https?:\/\//, ''),
  tagline: 'Scale calibration, repair, and parts',

  /** A blank string hides the phone in the header, the footer, and the contact page. */
  phone: '346-885-5159',
  /** The after-hours or dispatch line, hidden the same way when blank. */
  serviceLine: '',

  email: {
    sales: 'sales@ccscaleservicesinc.com',
    office: 'casey@ccscaleservicesinc.com',
  },

  /**
   * The street address feeds the Google Business Profile and the LocalBusiness
   * structured data, which is most of how a service company ranks locally. It
   * has to match the profile character for character, because a mismatch splits
   * the listing between two addresses. `hasAddress` below gates the address
   * block and the map link, so a blank street or city hides both.
   */
  address: {
    street: '2070 Holder Rambo Rd',
    city: 'Huffman',
    state: 'TX',
    zip: '77336',
    /** Parcel-level coordinates for the street above; rederive them if the address moves. */
    geo: { latitude: 30.0958, longitude: -95.1267 },
  },

  /** Counties and metros the techs drive to, ordered by how much work comes from each. */
  serviceArea: [],

  /** `{ days, hours }` pairs, e.g. `{ days: 'Monday - Friday', hours: '8:00 AM - 5:00 PM' }`. */
  hours: [],

  /**
   * Certifications and licenses a buyer checks before calling. Publishing one
   * the company does not currently hold is a claim with legal weight, so an
   * entry belongs here only while the certificate is live.
   */
  credentials: [],

  /** Founding year, used for the "serving since" line and the structured data. */
  foundedYear: null,

  /** Profile URLs, added as each account is claimed. Absent keys render no icon. */
  social: {
    facebook: '',
    linkedin: '',
    google: '',
  },
};

/** True once there is enough of an address to print or hand to a mapping app. */
export const hasAddress = Boolean(company.address.street && company.address.city);

/** Single-line address for structured data and the map link. */
export const addressLine = hasAddress
  ? `${company.address.street}, ${company.address.city}, ${company.address.state} ${company.address.zip}`.trim()
  : '';

/**
 * The dialable form of the number, derived here because five places link to it
 * and a dialer is unforgiving about the punctuation the printed form carries.
 * Empty when there is no number, which is the same falsy value the components
 * already test before rendering anything that dials.
 */
export const phoneHref = company.phone ? `tel:${company.phone.replace(/[^\d+]/g, '')}` : '';
