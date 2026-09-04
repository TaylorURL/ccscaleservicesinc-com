import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PackageSearch, Search } from 'lucide-react';
import CallToAction from '../components/CallToAction';
import PageHeader from '../components/PageHeader';
import PartCard from '../components/PartCard';
import { company } from '../content/company';
import { categoryBySlug, partCategories } from '../content/part-categories';
import { searchParts } from '../content/parts';
import { fitDescription, useSeo } from '../lib/seo';
import { iconSize } from '../lib/icon-size';

/**
 * The catalog filters by query string, so the head follows the category in
 * view while the canonical stays on the one indexable address, `/parts`.
 */
export const metadata = (category) => ({
  title: category
    ? `${category.name} for Industrial Scales`
    : 'Scale Parts, Load Cells, and Indicators',
  description: category
    ? fitDescription(
        category.blurb,
        `Quoted to your scale make and model by ${company.legalName}.`,
        'Quoted to your scale make, model, and capacity.'
      )
    : 'Load cells, weight indicators, junction boxes, cable, printers, test weights, and mounting hardware for industrial and commercial scales.',
  canonical: '/parts',
  openGraph: { type: 'website' },
});

export default function Parts() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const activeCategory = params.get('category');
  const category = activeCategory ? categoryBySlug[activeCategory] : null;

  useSeo(metadata(category));

  const results = useMemo(() => {
    const matches = searchParts(query);
    return activeCategory ? matches.filter((part) => part.category === activeCategory) : matches;
  }, [query, activeCategory]);

  function selectCategory(slug) {
    if (slug) {
      setParams({ category: slug });
    } else {
      setParams({});
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Parts"
        title={category ? category.name : 'Parts for the scales you already run'}
        intro={
          category
            ? category.blurb
            : 'Add what you need to a quote list and send it as one message. Capacity, output, and mounting all move the price, so every part is quoted against your equipment.'
        }
      />

      <div className="container-page flex flex-col gap-6 py-10">
        {/* Search leads, because a visitor who knows the part name is the one with
            the shortest path to a quote. The count sits beside it so a filter that
            narrows to nothing says so before the reader scrolls to find out. */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={iconSize.text}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
              aria-hidden="true"
            />
            <label htmlFor="part-search" className="sr-only">
              Search Parts
            </label>
            <input
              id="part-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Parts"
              className="field pl-10"
            />
          </div>
          <p className="text-sm text-ink-muted" aria-live="polite">
            {results.length} {results.length === 1 ? 'part' : 'parts'}
            {category ? ` in ${category.name}` : ''}
          </p>
        </div>

        {/* Seven filters left to wrap stack six rows deep on a phone and push the
            catalog below the fold. The rail holds them to one scrolling row at
            that width and wraps them normally once there is room. */}
        <div className="chip-rail items-center">
          <button
            type="button"
            aria-pressed={!activeCategory}
            onClick={() => selectCategory(null)}
            className={`btn btn-md shrink-0 whitespace-nowrap ${activeCategory ? 'btn-outline' : 'btn-steel'}`}
          >
            All Parts
          </button>
          {partCategories.map((item) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={activeCategory === item.slug}
              onClick={() => selectCategory(item.slug)}
              className={`btn btn-md shrink-0 whitespace-nowrap ${
                activeCategory === item.slug ? 'btn-steel' : 'btn-outline'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {results.length > 0 ? (
          <>
            {/* The cards carry h3, and the page title is the h1, so the level
                between them has to exist for the list to be reachable by
                heading. Nothing above the grid names it on screen - the search
                row leads - so the heading is there for the reader who navigates
                by structure. */}
            <h2 className="sr-only">Parts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((part) => (
                <PartCard key={part.slug} part={part} />
              ))}
            </div>
          </>
        ) : (
          // The same dashed panel the empty quote list uses, so the two dead ends
          // on the parts path read as one state and not as a page that broke.
          <div className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-line-strong bg-surface-sunken p-10 text-center">
            <div className="flex flex-col items-center gap-3">
              <PackageSearch
                size={iconSize.feature}
                className="text-ink-faint"
                aria-hidden="true"
              />
              <h2 className="text-xl">No parts match that search</h2>
              <p className="max-w-md text-ink-muted">
                Send the make and model of the scale to{' '}
                <a
                  href={`mailto:${company.email.sales}`}
                  className="text-ink transition-colors duration-fast hover:text-accent-text"
                >
                  {company.email.sales}
                </a>{' '}
                and we'll work out which part you need.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                selectCategory(null);
              }}
              className="btn btn-lg btn-primary"
            >
              Show All Parts
            </button>
          </div>
        )}
      </div>

      <CallToAction
        title="Can't find the part?"
        body="A photo of the part and of the scale's model tag is usually enough to identify it, even when the tag on the part itself has worn away."
      />
    </>
  );
}
