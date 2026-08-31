import { Link } from 'react-router-dom';
import { company, phoneHref } from '../content/company';

/** Closing band, repeated at the foot of the content pages. */
export default function CallToAction({
  title = 'Tell us what the scale is doing',
  body = 'Send the make, the model, and the symptom, and you get back either a price or a date on the calendar.',
}) {
  return (
    <section className="section-defer [--section-intrinsic:16rem] border-t border-line bg-surface-sunken">
      <div className="container-page flex flex-col items-start gap-8 py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-20">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl sm:text-3xl">{title}</h2>
          <p className="max-w-prose text-ink-muted">{body}</p>
        </div>
        {/* shrink-0 keeps the pair on one line: without it the heading beside them
            takes the width first and the second button drops below the first, which
            reads as two separate calls to action instead of one with a fallback.
            On a phone they go full width so the two do not sit at ragged widths. */}
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center lg:shrink-0">
          <Link to="/contact" className="btn btn-lg btn-primary">
            Request Service
          </Link>
          {company.phone ? (
            <a href={phoneHref} className="btn btn-lg btn-outline">
              {company.phone}
            </a>
          ) : (
            <Link to="/parts" className="btn btn-lg btn-outline">
              Browse Parts
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
