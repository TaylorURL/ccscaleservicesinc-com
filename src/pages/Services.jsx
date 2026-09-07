import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import CallToAction from '../components/sections/CallToAction';
import PageHeader from '../components/sections/PageHeader';
import { services } from '../content/services';
import { useSeo } from '../lib/seo';
import { serviceSchema } from '../lib/structured-data';
import { iconSize } from '../lib/icon-size';

export const metadata = {
  title: 'Scale Services: Calibration, Repair, and Maintenance',
  description:
    'Scale services from Compound Industrial: calibration with certificates, repair and troubleshooting, preventive maintenance agreements, and installation.',
  canonical: '/services',
  openGraph: { type: 'website' },
};

export default function Services() {
  useSeo(metadata, services.map(serviceSchema));

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Calibration, repair, and maintenance for weighing equipment"
        intro="We work on the equipment you already have, whoever installed it. Every visit ends with a written record of what was found and what was done."
      />

      {/* Sticks under the header so the jump list is still reachable from the
          bottom of a page five sections long, which is the only place a reader
          is likely to want it. It sits a layer below the header and clears the
          header's own height, so the two stack rather than overlap. The page's
          scroll-padding already allows for both, so an anchor still lands its
          heading in view. */}
      <nav
        className="sticky top-header z-sticky border-b border-line bg-surface-veil backdrop-blur"
        aria-label="Services"
      >
        <div className="container-page">
          {/* The rail keeps the five names on one line at every width; on a phone
              it scrolls instead of stacking into a five-line block that would
              push the first service off the screen. */}
          <div className="chip-rail py-3">
            {services.map((service) => (
              <a
                key={service.slug}
                href={`#${service.slug}`}
                className="shrink-0 whitespace-nowrap rounded px-3 py-2 font-display text-sm font-bold text-ink-muted transition-colors duration-fast hover:bg-surface-sunken hover:text-ink"
              >
                {service.name}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="container-page flex max-w-prose flex-col gap-4 pt-14 lg:pt-20">
        <p className="text-lg leading-relaxed text-ink-body">
          The services are calibration, repair and troubleshooting, preventive maintenance,
          installation, and parts supply, for weighing equipment of any make.
        </p>
        <p className="prose-body">
          Every request starts with the make, the model, and what the scale is doing, so most
          problems are fixed in a single visit.
        </p>
        <p className="prose-body">
          Scheduling works around production hours, and every visit ends with a written record of
          what was found, what was adjusted, and what was replaced.
        </p>
        <p className="prose-body">
          Calibration certificates are filed per scale, so an auditor or an inspector gets the
          record without a search.
        </p>
      </div>

      <div className="container-page flex flex-col gap-3 divide-y divide-line">
        {services.map((service) => (
          <section key={service.slug} id={service.slug} className="py-14 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div className="flex flex-col items-start gap-8">
                <div className="flex flex-col gap-4">
                  <h2 className="text-2xl sm:text-3xl">{service.name}</h2>
                  <p className="text-lg leading-relaxed text-ink-muted">{service.summary}</p>
                  <p className="prose-body">{service.description}</p>
                </div>
                <Link to={service.cta.to} className="btn btn-md btn-primary">
                  {service.cta.label}
                </Link>
              </div>
              {/* The panel is filled, so stretching it to the height of the prose
                  beside it leaves a block of colour under the last point.
                  self-start sizes it to its own contents instead. */}
              <ul className="flex flex-col gap-3 self-start rounded-lg bg-surface-sunken p-6">
                {service.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink-body">
                    <span className="icon-lead text-accent-text">
                      <Check size={iconSize.text} aria-hidden="true" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <CallToAction />
    </>
  );
}
