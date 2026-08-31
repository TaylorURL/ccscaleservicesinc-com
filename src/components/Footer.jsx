/**
 * One band: the mark and what the company does on the left, the ways to reach
 * it on the right, a rule, and the legal line beneath.
 *
 * The eleven services and part categories are not repeated here. They live in
 * the panels the bar opens on every page, on the two catalog pages themselves,
 * in the shell a fetcher without scripts is served, and in the sitemap - so a
 * copy at the foot of every page navigates nothing that is not already one
 * press away, and costs the address and the number the room to be read. What a
 * visitor comes to the bottom of a scale company's page for is the phone
 * number, so that is what is down here.
 */
import { Link } from 'react-router-dom';
import { Facebook, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { addressLine, company, hasAddress, phoneHref } from '../content/company';
import Wordmark from './Wordmark';
import { iconSize } from '../lib/icon-size';

const socialLinks = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
];

export default function Footer({ children }) {
  const year = new Date().getFullYear();
  const profiles = socialLinks.filter((link) => company.social[link.key]);

  return (
    <footer className="flex flex-col bg-surface-inverse pt-14 text-ink-inverse-muted">
      {/* The mast takes the width it needs for the name, which is the longest
          string down here; the reach column holds short lines and takes what
          is left. Below the large breakpoint they stack rather than splitting
          a phone screen in half. */}
      <div className="container-page grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <Wordmark tone="light" />
          <p className="max-w-md text-base leading-relaxed text-ink-inverse-muted">
            Calibration, repair, and parts for industrial and commercial weighing equipment, out of
            Huffman, Texas.
          </p>
          {profiles.length > 0 && (
            <div className="flex gap-3">
              {profiles.map((profile) => (
                <a
                  key={profile.key}
                  href={company.social[profile.key]}
                  className="icon-btn border border-line-inverse text-ink-inverse-muted hover:border-line-inverse-strong hover:text-ink-inverse"
                  aria-label={profile.label}
                >
                  <profile.Icon size={iconSize.text} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="font-display text-xs font-bold uppercase tracking-eyebrow text-ink-inverse">
            Reach Us
          </h2>
          <address className="not-italic">
            <ul className="flex flex-col gap-3 text-sm">
              {company.phone && (
                <li className="flex items-start gap-3">
                  <span className="icon-lead text-accent-inverse">
                    <Phone size={iconSize.text} aria-hidden="true" />
                  </span>
                  <a
                    href={phoneHref}
                    className="text-ink-inverse-muted transition-colors duration-fast hover:text-ink-inverse"
                  >
                    {company.phone}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-3">
                <span className="icon-lead text-accent-inverse">
                  <Mail size={iconSize.text} aria-hidden="true" />
                </span>
                <a
                  href={`mailto:${company.email.sales}`}
                  className="text-ink-inverse-muted transition-colors duration-fast hover:text-ink-inverse"
                >
                  {company.email.sales}
                </a>
              </li>
              {hasAddress && (
                <li className="flex items-start gap-3">
                  <span className="icon-lead text-accent-inverse">
                    <MapPin size={iconSize.text} aria-hidden="true" />
                  </span>
                  <span className="text-ink-inverse-muted">{addressLine}</span>
                </li>
              )}
            </ul>
          </address>
          {company.hours.length > 0 && (
            <dl className="flex flex-col gap-3 text-sm text-ink-inverse-muted">
              {company.hours.map((entry) => (
                <div key={entry.days} className="flex justify-between gap-4">
                  <dt>{entry.days}</dt>
                  <dd>{entry.hours}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      <div className="mt-14 border-t border-line-inverse">
        <div className="container-page flex flex-col gap-4 py-5 text-xs text-ink-inverse-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="tabular-nums">
            &copy; {year} {company.legalName}
          </p>
          {/* The theme control lives with the other site-wide settings rather
              than in the header, where it would compete with the quote list for
              the one slot a visitor actually came for. */}
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/contact" className="transition-colors duration-fast hover:text-ink-inverse">
              Contact
            </Link>
            <Link to="/privacy" className="transition-colors duration-fast hover:text-ink-inverse">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors duration-fast hover:text-ink-inverse">
              Terms
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* The attribution rail the shell passes down. It paints no ground and
          names no ink, so it takes both from this band; below the footer it
          would read in the body's colours instead. */}
      {children}
    </footer>
  );
}
