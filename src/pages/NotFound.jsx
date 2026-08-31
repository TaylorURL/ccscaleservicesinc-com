import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

/**
 * The host serves this route with a 200, because a single-page app answers
 * every path with the same shell. The noindex directive is what keeps those
 * soft-404 URLs out of the index, and no canonical is declared because the
 * route answers at every address that has no page.
 */
export const metadata = {
  title: 'Page Not Found: The Link May Be Old',
  description:
    'The page you asked for is not here. The link may be old, or the part may have been retired from the catalog. Browse parts or start from the home page.',
  canonical: null,
  robots: 'noindex',
  openGraph: { type: 'website' },
};

export default function NotFound() {
  useSeo(metadata);

  return (
    <div className="container-page flex min-h-[60dvh] flex-col items-center justify-center gap-8 py-20 text-center">
      <div className="flex flex-col items-center gap-3">
        <p className="eyebrow">404</p>
        <h1 className="text-3xl sm:text-4xl">That page isn't here</h1>
        <p className="max-w-md text-ink-muted">
          The link may be old, or the part may have been retired from the catalog.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
        <Link to="/parts" className="btn btn-lg btn-primary">
          Browse Parts
        </Link>
        <Link to="/" className="btn btn-lg btn-outline">
          Back to the Home Page
        </Link>
      </div>
    </div>
  );
}
