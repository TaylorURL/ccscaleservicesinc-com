import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import CallToAction from '../components/CallToAction';
import { company } from '../content/company';
import { faqs } from '../content/faq';
import { partCategories } from '../content/parts';
import { services } from '../content/services';
import { useSeo } from '../lib/seo';
import { faqSchema, localBusinessSchema } from '../lib/structured-data';
import { iconSize } from '../lib/icon-size';

export const metadata = {
  title: 'Scale Calibration, Repair, and Parts in Huffman, Texas',
  description:
    'Compound Industrial Scale Services is a Huffman, Texas scale company: calibration with certificates, repair, preventive maintenance, load cells, and parts.',
  canonical: '/',
  openGraph: { type: 'website' },
};

/**
 * Five services in a three-column grid leave a trailing row of two with a hole
 * where the third would be. Laying the grid out in sixths lets a trailing pair
 * divide the full width between them, so the last row reads as composed rather
 * than as a row that ran out of cards. A trailing single is left as a third,
 * because one card stretched across the full width is the worse of the two.
 */
const serviceSpan = (index) =>
  services.length % 3 === 2 && index >= services.length - 2 ? 'lg:col-span-3' : 'lg:col-span-2';

export default function Home() {
  useSeo(metadata, [localBusinessSchema(), faqSchema(faqs)]);

  return (
    <>
      {/* The scrim over the photo runs darkest where the text sits and lifts
          toward the right, so the headline clears contrast without the whole
          image going murky behind it. */}
      <section className="relative overflow-hidden bg-surface-inverse">
        {/* The largest thing on the first screen, so it is fetched at high
            priority rather than left to queue behind the stylesheet. */}
        <img
          src="/photos/weighbridge-service-1280.webp"
          srcSet="/photos/weighbridge-service-640.webp 640w, /photos/weighbridge-service-960.webp 960w, /photos/weighbridge-service-1280.webp 1280w, /photos/weighbridge-service-1440.webp 1440w, /photos/weighbridge-service-1600.webp 1600w"
          // The band runs the full width of the viewport at every breakpoint,
          // so a phone takes the 640 cut and a desktop the one that covers it.
          sizes="100vw"
          alt="A technician in a safety vest steering a test-weight cart across a truck scale at an aggregate yard"
          width="1600"
          height="1200"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[70%_40%]"
        />
        <div className="absolute inset-0 bg-surface-scrim" aria-hidden="true" />
        {/* Three steps of space, each on a container: label to title is the
            tightest, title to lede is one step wider, and the actions sit a step
            wider again. Spacing carried on the children instead would leave the
            structure to be inferred from the words. */}
        <div className="container-page relative flex flex-col items-start gap-10 pb-24 pt-16 lg:pb-32 lg:pt-24">
          <div className="flex flex-col items-start gap-6">
            <div className="flex flex-col items-start gap-3">
              {/* The shared eyebrow accent is tuned for the light pages; on the
                  photo it needs the lighter step to stay readable. */}
              <p className="eyebrow text-accent-inverse">Industrial and commercial weighing</p>
              <h1 className="max-w-4xl text-4xl leading-tight text-ink-inverse sm:text-5xl lg:text-6xl">
                Scales that read right, and parts that fit.
              </h1>
            </div>
            <p className="max-w-prose text-lg leading-relaxed text-ink-inverse-muted">
              Calibration with certificates, repairs on what you already run, and a parts counter,
              out of Huffman, Texas.
            </p>
          </div>
          {/* Stacked full width on a phone, where two buttons sized to their own
              labels sit at ragged widths and neither reads as the primary one. */}
          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <Link to="/contact" className="btn btn-lg btn-primary">
              Request Service
            </Link>
            <Link to="/parts" className="btn btn-lg btn-ghost-light">
              Browse Parts
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page flex flex-col gap-10 py-16 lg:py-24">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">What we do</p>
            <h2 className="text-3xl sm:text-4xl">The whole scale, not just the head</h2>
          </div>
          <p className="prose-body">
            The technician who calibrates the scale is the one who inspects the mechanics and
            replaces whatever put it out of tolerance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          {services.map((service, index) => (
            // The stretched link makes the whole card the click target; the card
            // lifting on hover is then an honest affordance instead of a
            // decoration on a card whose real target is one small text link.
            // The prose group takes the leftover height rather than the gap
            // above the link, so every card's rhythm is the same however long
            // its summary runs.
            <article
              key={service.slug}
              className={`group card card-lift relative flex flex-col gap-6 p-6 ${serviceSpan(index)}`}
            >
              <div className="flex flex-1 flex-col gap-3">
                <h3 className="text-lg">{service.name}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{service.summary}</p>
              </div>
              <Link
                to={`/services#${service.slug}`}
                className="inline-flex items-center gap-2 font-display text-sm font-bold text-ink-body transition-colors duration-fast after:absolute after:inset-0 group-hover:text-accent-text"
              >
                {/* All five cards share the visible label, so the service name is
                    carried for screen readers to keep the links distinguishable. */}
                What This Covers<span className="sr-only"> in {service.name}</span>
                <ArrowRight
                  size={iconSize.chrome}
                  aria-hidden="true"
                  className="transition-transform duration-fast group-hover:translate-x-0.5"
                />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-defer [--section-intrinsic:42rem] border-y border-line bg-surface-sunken">
        <div className="container-page flex flex-col gap-10 py-16 lg:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="eyebrow">Parts counter</p>
                <h2 className="text-3xl sm:text-4xl">Load cells, indicators, cable, hardware</h2>
              </div>
              <p className="prose-body">
                Every part is quoted against the make, model, and capacity of the scale it&apos;s
                going into, so what arrives is what fits.
              </p>
            </div>
            <Link to="/parts" className="btn btn-lg btn-steel shrink-0">
              Browse the Catalog
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/parts?category=${category.slug}`}
                className="card card-lift flex flex-col gap-3 p-5 active:scale-[0.99]"
              >
                <h3 className="text-base">{category.name}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{category.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-defer [--section-intrinsic:39rem] container-page py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">Common questions</p>
              <h2 className="text-3xl sm:text-4xl">Before you call</h2>
            </div>
            <p className="prose-body">
              Anything not covered here goes to{' '}
              <a
                href={`mailto:${company.email.sales}`}
                className="text-ink transition-colors duration-fast hover:text-accent-text"
              >
                {company.email.sales}
              </a>
              .
            </p>
          </div>
          {/* Separated rows rather than a ruled list: at this length the questions
              are a set of things to open, and a card apiece says that where a
              hairline between them does not. */}
          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group card px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-bold text-ink group-open:text-accent-text [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    size={iconSize.chrome}
                    aria-hidden="true"
                    className="shrink-0 text-ink-faint transition-transform duration-base ease-quart-out group-open:rotate-180"
                  />
                </summary>
                <p className="rise-in mt-3 leading-relaxed text-ink-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
