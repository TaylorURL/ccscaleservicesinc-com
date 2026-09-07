import PageHeader from '../components/sections/PageHeader';
import { company, phoneHref } from '../content/company';
import { useSeo } from '../lib/seo';

/**
 * The terms describe this website, not the service agreement behind a job. The
 * site takes no payment, opens no account, and ships nothing, so everything
 * below is about the pages and the catalog. A purchase order, a service
 * contract, or a calibration agreement is signed separately and says what it
 * says; nothing here changes it.
 *
 * The one thing a reader is here to check is what pressing send commits them
 * to, so that is a table near the top rather than a paragraph six sections
 * down. The page ends on the three ways to reach a person, because a reader
 * who got to the bottom of the terms has a question the terms did not answer.
 */
export const metadata = {
  title: 'Terms of Use: This Site and Its Content',
  description:
    'The terms for using this website: what a quote is and is not, what the catalog descriptions cover, and how the text and images on these pages may be used.',
  canonical: '/terms',
  openGraph: { type: 'website' },
};

/** What pressing send does, and the thing each request is repeatedly mistaken for. */
const REQUESTS = [
  {
    what: 'A service request',
    starts: 'A conversation about scheduling a technician',
    stops: 'It does not book a visit or hold a date',
  },
  {
    what: 'A quote list',
    starts: 'A priced reply against your make and model',
    stops: 'It does not reserve stock or place an order',
  },
  {
    what: 'A price we quote',
    starts: 'A figure that holds for the period the quote states',
    stops: 'It is not a stock confirmation',
  },
];

/** The three desks, each with what it is for, at the foot of the page. */
const DESKS = [
  { label: 'Call', value: company.phone, href: phoneHref, note: 'Service and parts' },
  {
    label: 'Sales',
    value: company.email.sales,
    href: `mailto:${company.email.sales}`,
    note: 'Quotes and requests',
  },
  {
    label: 'Office',
    value: company.email.office,
    href: `mailto:${company.email.office}`,
    note: 'Billing, accounts, and anything on this page',
  },
];

export default function Terms() {
  useSeo(metadata);

  return (
    <>
      <PageHeader eyebrow="Terms" title="Terms of use" />

      <div className="container-page flex max-w-prose flex-col gap-8 py-14 lg:py-20">
        <p className="text-sm text-ink-faint">
          Last updated <time dateTime="2026-08-27">August 27, 2026</time>
        </p>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl">What this site is</h2>
          <p className="leading-relaxed text-ink-muted">
            This website describes the services {company.legalName} performs and the parts it
            supplies, and gives you a way to ask for either.
          </p>
          <p className="leading-relaxed text-ink-muted">
            Using it means you accept what is on this page. If you do not, the phone number and the
            email addresses work just as well.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl">Requests are not orders</h2>
          {/* Wider than a phone, so it scrolls in its own box rather than
              taking the page sideways with it. */}
          <div className="overflow-x-auto">
            <table className="fact-table">
              <caption className="sr-only">
                What each kind of request starts, and what it does not do
              </caption>
              <thead>
                <tr>
                  <th scope="col">What You Send</th>
                  <th scope="col">What It Starts</th>
                  <th scope="col">What It Does Not Do</th>
                </tr>
              </thead>
              <tbody>
                {REQUESTS.map((request) => (
                  <tr key={request.what}>
                    <th scope="row">{request.what}</th>
                    <td>{request.starts}</td>
                    <td>{request.stops}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed text-ink-muted">
            Work is scheduled and parts are sold once we have replied and you have accepted the
            price and terms in that reply.
          </p>
        </section>

        {/* No price is published and the catalog does not confirm fit. The two
            are the same rule seen from either end, so they are set as a pair
            rather than as two sections a reader meets a screen apart. */}
        <section className="section-defer [--section-intrinsic:12rem] grid gap-6 sm:grid-cols-2">
          <h2 className="text-xl sm:col-span-2">Prices and descriptions</h2>
          <div className="flex flex-col gap-3">
            <h3 className="text-base">No price is published here</h3>
            <p className="leading-relaxed text-ink-muted">
              Capacity, output, and mounting all move what a part costs, so every one is quoted
              against the scale it is going into.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-base">The catalog does not confirm fit</h3>
            <p className="leading-relaxed text-ink-muted">
              It explains what each kind of part does and what we need to specify one. What fits is
              settled in the quote.
            </p>
          </div>
        </section>

        <section className="section-defer [--section-intrinsic:11rem] flex flex-col gap-3">
          <h2 className="text-xl">The text and images on these pages</h2>
          <p className="leading-relaxed text-ink-muted">
            The wording, the photographs, and the company mark belong to {company.legalName}. You
            are welcome to read them, print them, and send them to a colleague.
          </p>
          <p className="leading-relaxed text-ink-muted">
            Republishing them, or using the mark on anything that is not ours, needs our written
            permission first.
          </p>
        </section>

        <section className="section-defer [--section-intrinsic:8rem] flex flex-col gap-3">
          <h2 className="text-xl">Links to other sites</h2>
          <p className="leading-relaxed text-ink-muted">
            Where a page links somewhere else, that site is run by someone else and follows its own
            terms.
          </p>
          <p className="leading-relaxed text-ink-muted">We link to it because it was useful.</p>
        </section>

        <section className="section-defer [--section-intrinsic:6rem] flex flex-col gap-3">
          <h2 className="text-xl">Governing law</h2>
          <p className="leading-relaxed text-ink-muted">
            {company.legalName} operates from Texas, and the laws of the State of Texas govern the
            use of this website.
          </p>
        </section>

        <section className="section-defer [--section-intrinsic:12rem] flex flex-col gap-4">
          <h2 className="text-xl">Reaching a person</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {DESKS.map((desk) => (
              <li key={desk.label} className="card flex flex-col gap-2 p-5">
                <p className="eyebrow">{desk.label}</p>
                <a
                  href={desk.href}
                  className="break-words font-display text-sm font-bold text-ink transition-colors duration-fast hover:text-accent-text"
                >
                  {desk.value}
                </a>
                <p className="text-sm leading-relaxed text-ink-muted">{desk.note}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
