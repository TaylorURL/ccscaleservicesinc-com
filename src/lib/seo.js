import { useEffect } from 'react';
import { company } from '../content/company';

/**
 * The site renders on the client, so every tag a crawler or a link preview reads
 * has to be written into the document as each route mounts. `useSeo` owns that
 * for all six of them: title, description, canonical, robots, Open Graph, and
 * structured data. A page that sets three of the six is the failure that is
 * hard to notice.
 *
 * Each route declares its head in a module-level `export const metadata` and
 * hands that object here, so the same declaration is readable by tooling that
 * scans the source without executing the component. A route whose head depends
 * on data, such as a part page, exports a function of that data instead and
 * calls it at render time.
 *
 * Meta and link tags are reused rather than replaced: each mount overwrites the
 * one already in the head, so a value a route declares always wins over the
 * previous route's. A value it leaves unset keeps whatever was there, which is
 * why `robots` is written unconditionally. JSON-LD cannot work that way, because
 * a page carries any number of blocks, so each mount appends its own and the
 * cleanup removes every script carrying `data-seo` on the way out.
 *
 * A route's title is used exactly as it is declared, with no brand appended. A
 * result line is cut at around sixty characters, and a thirty-eight character
 * company name added to every page spends most of that on the one word the
 * reader already knows from the domain.
 */

const SEO_MARK = 'data-seo';

/** Finds the tag identified by `key="value"`, creating it if the document has none. */
function upsertTag(tagName, key, value) {
  let element = document.head.querySelector(`${tagName}[${key}="${value}"]`);
  if (!element) {
    element = document.createElement(tagName);
    element.setAttribute(key, value);
    element.setAttribute(SEO_MARK, '');
    document.head.appendChild(element);
  }
  return element;
}

function setMeta(key, value, content) {
  if (!content) return;
  upsertTag('meta', key, value).setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  upsertTag('link', 'rel', rel).setAttribute('href', href);
}

function setJsonLd(data) {
  if (!data) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute(SEO_MARK, '');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Fits a description to the width of a result snippet.
 *
 * A snippet is cut at about 160 characters and reads as unfinished under 120,
 * and the catalog lines these are built from vary by forty characters between
 * the shortest and the longest. So the ending is chosen rather than fixed: the
 * longest one that still lands inside the cut wins, and the lead stands alone
 * when none of them do.
 *
 * @param {string} lead The sentence that has to be there.
 * @param {...string} tails Candidate endings, any of which may be dropped.
 */
export function fitDescription(lead, ...tails) {
  const base = lead.trim().replace(/\s+/g, ' ');
  const fitted = tails
    .map((tail) => `${base} ${tail.trim()}`)
    .filter((text) => text.length <= 160)
    .sort((a, b) => b.length - a.length);
  return fitted[0] || base;
}

/**
 * @param {object} metadata The route's `metadata` export.
 * @param {string} metadata.title Page title, complete, 30 to 60 characters.
 * @param {string} metadata.description Meta and Open Graph description, one or two sentences.
 * @param {string} [metadata.canonical] Route path for the canonical URL. `null` leaves the
 *   canonical tag alone, for routes like the 404 page that answer at no one address.
 * @param {string} [metadata.robots] Robots directive; unset, the route is indexable.
 * @param {object} [metadata.openGraph] Open Graph fields; `type` defaults to website.
 * @param {object|object[]} [jsonLd] Structured data for the page.
 */
export function useSeo(metadata, jsonLd) {
  const { title, description, canonical, robots, openGraph } = metadata;
  const ogType = (openGraph && openGraph.type) || 'website';

  useEffect(() => {
    const fullTitle = title || company.legalName;
    const canonicalUrl = canonical == null ? null : `${company.url}${canonical}`;

    document.title = fullTitle;
    setMeta('name', 'description', description);
    // Written on every route, so one that follows the noindex 404 gets its
    // indexable state back instead of inheriting the block.
    setMeta('name', 'robots', robots || 'index, follow');
    setLink('canonical', canonicalUrl);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', company.legalName);
    setMeta('property', 'og:image', `${company.url}/brand/og.png`);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);

    const blocks = [jsonLd].flat().filter(Boolean);
    blocks.forEach(setJsonLd);

    return () => {
      document.head.querySelectorAll(`script[${SEO_MARK}]`).forEach((node) => node.remove());
    };
  }, [title, description, canonical, robots, ogType, jsonLd]);
}
