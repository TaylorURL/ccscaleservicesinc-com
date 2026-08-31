// The extension is spelled out so this module loads in plain Node, where the
// crawl-file generator imports it, as well as through the bundler.
import { company, hasAddress } from '../content/company.js';

/**
 * Structured data is how a service business shows up as a business instead of
 * as a page: the panel carrying the phone number, the hours, and the service
 * area. Google drops a block that references a field it cannot verify, so an
 * optional field whose source in `company` is blank is omitted here rather than
 * emitted empty.
 */

/** Identity block for the organization, referenced by the other blocks. */
export function localBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${company.url}/#business`,
    name: company.legalName,
    url: company.url,
    description: `${company.tagline} for industrial and commercial weighing equipment.`,
    email: company.email.sales,
  };

  if (company.phone) schema.telephone = company.phone;
  if (company.foundedYear) schema.foundingDate = String(company.foundedYear);

  if (hasAddress) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      addressRegion: company.address.state,
      postalCode: company.address.zip,
      addressCountry: 'US',
    };
  }

  if (company.address.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: company.address.geo.latitude,
      longitude: company.address.geo.longitude,
    };
  }

  if (company.serviceArea.length) {
    schema.areaServed = company.serviceArea.map((area) => ({ '@type': 'Place', name: area }));
  }

  if (company.hours.length) {
    schema.openingHours = company.hours.map((entry) => `${entry.days} ${entry.hours}`);
  }

  const profiles = Object.values(company.social).filter(Boolean);
  if (profiles.length) schema.sameAs = profiles;

  return schema;
}

/** One service, tied back to the business identity. */
export function serviceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.summary,
    serviceType: service.name,
    provider: { '@id': `${company.url}/#business` },
    url: `${company.url}/services#${service.slug}`,
  };
}

/**
 * A catalog part. Parts are quoted, not priced, so the offer carries
 * availability and a quote URL with no price attached. Claiming a price the
 * site does not publish is what gets a product listing rejected.
 */
export function partSchema(part) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: part.name,
    description: part.summary,
    category: part.category,
    url: `${company.url}/parts/${part.slug}`,
    brand: { '@type': 'Brand', name: company.legalName },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      availableAtOrFrom: { '@id': `${company.url}/#business` },
      url: `${company.url}/parts/${part.slug}`,
      priceSpecification: {
        '@type': 'PriceSpecification',
        valueAddedTaxIncluded: false,
      },
    },
  };
}

/** Trail for a nested page, so search results show the path rather than a bare URL. */
export function breadcrumbSchema(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${company.url}${crumb.path}`,
    })),
  };
}

/** Question and answer pairs, eligible for the expandable results block. */
export function faqSchema(entries) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}
