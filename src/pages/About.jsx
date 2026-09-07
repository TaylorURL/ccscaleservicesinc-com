/**
 * The founding year, the credentials, and the service area come from `company`,
 * and each block is skipped while its source is empty, so the page never prints
 * a heading with nothing under it. The prose beside them holds only what is true
 * of the work regardless of those values.
 */
import CallToAction from '../components/sections/CallToAction';
import PageHeader from '../components/sections/PageHeader';
import { company } from '../content/company';
import { useSeo } from '../lib/seo';
import { localBusinessSchema } from '../lib/structured-data';

export const metadata = {
  title: 'About Compound Industrial Scale Services',
  description:
    'Compound Industrial Scale Services is a family-owned Huffman, Texas company that calibrates, repairs, and supplies parts for weighing equipment.',
  canonical: '/about',
  openGraph: { type: 'website' },
};

export default function About() {
  useSeo(metadata, localBusinessSchema());

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="The instrument everyone stops looking at"
        intro="Once a scale is bolted down it gets treated as part of the building. Your invoices, your batch weights, and your shipping documents all depend on what it reads, and it drifts."
      />

      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr] lg:py-20">
        <div className="flex flex-col gap-6">
          <p className="text-lg leading-relaxed text-ink-body">
            {company.legalName} is a family-owned company in Huffman, Texas.
            {company.foundedYear
              ? ` The company has done this work since ${company.foundedYear}.`
              : ''}
          </p>
          <p className="prose-body">
            It calibrates, repairs, and maintains weighing equipment, and supplies the load cells,
            indicators, and hardware that go into it.
          </p>
          <p className="prose-body">
            The job is the same whether it&apos;s a bench unit in a shipping department or a
            weighbridge under loaded trucks.
          </p>
          <p className="prose-body">
            Measure what the scale reads against a known reference, correct the difference, and
            write both down.
          </p>
          <p className="prose-body">
            What changes is the size of the weights and how far somebody drives.
          </p>
          <p className="prose-body">
            Parts work the same way. A load cell is specified by capacity, output, and mounting.
          </p>
          <p className="prose-body">Two cells that look identical can match on none of them.</p>
          <p className="prose-body">
            Quoting against the make and model of the scale is how the wrong part stays out of the
            box.
          </p>
          <figure className="flex flex-col gap-3">
            {/* The frame holds the photo's box and its fill from first paint, so
                the column below it does not jump when the file decodes. */}
            <div className="media-frame aspect-[4/3] rounded-lg border border-line shadow-card">
              <img
                src="/photos/test-cart-720.webp"
                srcSet="/photos/test-cart-480.webp 480w, /photos/test-cart-720.webp 720w, /photos/test-cart-1200.webp 1200w"
                // The figure sits in the wide column of a two-column grid past
                // the large breakpoint, and takes the full measure below it.
                sizes="(min-width: 1024px) 40rem, 100vw"
                alt="A powered test-weight cart beside a truck scale on a job site"
                width="1200"
                height="900"
                className="h-full w-full rounded-lg object-cover"
                loading="lazy"
              />
            </div>
            <figcaption className="text-sm text-ink-faint">
              A test cart heading onto a customer's truck scale.
            </figcaption>
          </figure>
        </div>

        {/* The prose column runs well past the end of this one, so the addresses
            stay in view rather than scrolling off at the top of a long read. */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <div className="brand-plate mx-auto w-full max-w-[15rem]">
              <img
                src="/brand/logo-160.webp"
                srcSet="/brand/logo-160.webp 160w, /brand/logo-297.webp 297w"
                // The plate holds the lockup at a fixed 10rem, so the choice is
                // between the 1x cut and the 2x one.
                sizes="160px"
                alt={`Balance scale on a blue and teal shield above the words ${company.legalName}`}
                width="297"
                height="242"
                className="w-40"
                loading="lazy"
              />
            </div>
          </div>

          {company.credentials.length > 0 && (
            <div className="card flex flex-col gap-6 p-6">
              <h2 className="text-lg">Credentials</h2>
              <ul className="flex flex-col gap-3 text-sm text-ink-body">
                {company.credentials.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
            </div>
          )}

          {company.serviceArea.length > 0 && (
            <div className="card flex flex-col gap-6 p-6">
              <h2 className="text-lg">Where We Work</h2>
              <ul className="flex flex-wrap gap-3">
                {company.serviceArea.map((area) => (
                  <li
                    key={area}
                    className="rounded border border-line bg-surface-sunken px-3 py-2 text-sm text-ink-body"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card flex flex-col gap-6 p-6">
            <h2 className="text-lg">Who to Email</h2>
            <ul className="flex flex-col gap-6 text-sm">
              <li className="flex flex-col gap-2">
                <a
                  href={`mailto:${company.email.sales}`}
                  className="font-display font-bold text-ink transition-colors duration-fast hover:text-accent-text"
                >
                  {company.email.sales}
                </a>
                <p className="text-ink-muted">Service, parts, and quotes</p>
              </li>
              <li className="flex flex-col gap-2">
                <a
                  href={`mailto:${company.email.office}`}
                  className="font-display font-bold text-ink transition-colors duration-fast hover:text-accent-text"
                >
                  {company.email.office}
                </a>
                <p className="text-ink-muted">Billing and accounts</p>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <CallToAction />
    </>
  );
}
