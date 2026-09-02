/**
 * Services and Parts are the two destinations a visitor actually came for, and
 * each is a set rather than a page: five services, six part categories. A flat
 * link row would put eleven names in the bar or hide all eleven one page deep,
 * so each is a trigger opening a panel that names its contents, with the page
 * dimmed behind it.
 *
 * Each panel is a split rather than a grid of peers: the destinations run
 * plainly down the left, and the right column is the one thing that panel
 * wants clicked - a technician for the services, a quote for the parts. A
 * second column of links would be a longer menu, and a visitor who came to
 * book work would still have to find the way out of it.
 *
 * The strip above the bar carries the number, the desk to write to, and the
 * town. Those are what a visitor wants before they have chosen a page at all,
 * and holding them in the bar is what pushes a bar past the height it is
 * allowed. The strip scrolls away with the page; the bar is what sticks, which
 * is why the header height token counts the bar alone.
 */
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, ClipboardList, MapPin, Phone, Wrench } from 'lucide-react';
import { addressLine, company, hasAddress, phoneHref } from '../content/company';
import { services } from '../content/services';
import { partCategories } from '../content/parts';
import { useQuote } from '../lib/quote-context';
import Wordmark from './Wordmark';
import { iconSize } from '../lib/icon-size';

const primary = [
  { key: 'services', label: 'Services' },
  { key: 'parts', label: 'Parts' },
];

const flat = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

// Both menus list the same fixed content on every open, so the lists are built
// once here rather than on the render the press has to wait for. Parts has its
// own destination in the bar, so the service entry that points at it is dropped
// from the services menu.
const serviceMenu = services.filter((service) => service.slug !== 'parts');
const serviceLinks = serviceMenu.map((service) => ({
  to: `/services#${service.slug}`,
  label: service.name,
}));
const partLinks = partCategories.map((category) => ({
  to: `/parts#${category.slug}`,
  label: category.name,
}));

const desktopLink = ({ isActive }) =>
  `relative py-1 font-display text-sm font-bold tracking-wide transition-colors duration-fast ` +
  `after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-accent-inverse ` +
  `after:content-[''] after:transition-transform after:duration-base after:ease-quart-out ${
    isActive
      ? 'text-ink-inverse after:scale-x-100'
      : 'text-ink-inverse-muted after:scale-x-0 hover:text-ink-inverse'
  }`;

const triggerClass = (open) =>
  `relative flex items-center gap-1 py-1 font-display text-sm font-bold tracking-wide transition-colors duration-fast ` +
  `after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-accent-inverse ` +
  `after:content-[''] after:transition-transform after:duration-base after:ease-quart-out ${
    open
      ? 'text-ink-inverse after:scale-x-100'
      : 'text-ink-inverse-muted after:scale-x-0 hover:text-ink-inverse'
  }`;

const mobileLink = ({ isActive }) =>
  `drop-in relative flex items-center py-4 pl-3 font-display font-bold transition-colors duration-fast ` +
  `before:absolute before:inset-y-3 before:left-0 before:w-0.5 before:rounded-md before:bg-accent-inverse ` +
  `before:content-[''] before:transition-opacity before:duration-fast ${
    isActive ? 'text-ink-inverse before:opacity-100' : 'text-ink-inverse-muted before:opacity-0'
  }`;

const menuLine =
  'h-0.5 w-5 rounded-md bg-current transition-[transform,opacity] duration-base ease-quart-out';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const { count } = useQuote();
  const toggleRef = useRef(null);
  const closeMobile = () => setMobileOpen(false);
  const closePanel = () => setOpenPanel(null);
  useEffect(() => {
    if (!openPanel && !mobileOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      closePanel();
      setMobileOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openPanel, mobileOpen]);

  return (
    <>
      <UtilityBar />

      {/* The height sits on the bar rather than on the row inside it, so the
          hairline is drawn inside --header-height, the number the rest of the
          page offsets against, instead of adding a pixel to it. */}
      <header className="sticky top-0 z-sticky-nav h-header border-b border-line-inverse bg-[color:var(--surface-inverse)] text-ink-inverse">
        <div className="container-page flex h-full items-center justify-between gap-6">
          <Link to="/" className="min-w-0" aria-label={`${company.name} Home`}>
            <Wordmark compact tone="light" />
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            {primary.map((item) => (
              <NavPanel
                key={item.key}
                label={item.label}
                open={openPanel === item.key}
                onOpen={() => setOpenPanel(item.key)}
                onClose={closePanel}
              >
                {item.key === 'services' ? (
                  <ServicesPanel onNavigate={closePanel} />
                ) : (
                  <PartsPanel onNavigate={closePanel} count={count} />
                )}
              </NavPanel>
            ))}
            {flat.map((link) => (
              <NavLink key={link.to} to={link.to} className={desktopLink}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/quote"
              onClick={closeMobile}
              className="btn btn-md btn-primary relative whitespace-nowrap"
            >
              <ClipboardList size={iconSize.text} aria-hidden="true" />
              {/* Below the small breakpoint the bar has room for the icon and
                  nothing else, and the label was being dropped outright. Taken
                  out of the flow rather than out of the document, it occupies
                  the same nothing on a phone while still naming the control,
                  which the icon beside it cannot: it is decorative, so a link
                  with the label removed is a link with no name at all. The
                  nowrap the button carries is restated at the width the label
                  returns, because coming back into the flow restores the
                  inherited wrapping with it. */}
              <span className="sr-only sm:not-sr-only sm:inline sm:whitespace-nowrap">
                Quote List
              </span>
              {count > 0 && (
                <span
                  key={count}
                  className="pop-in absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded bg-accent px-2 text-xs font-bold tabular-nums text-accent-ink"
                  aria-label={`${count} parts on the quote list`}
                >
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              ref={toggleRef}
              onClick={() => setMobileOpen((current) => !current)}
              className="icon-btn text-ink-inverse-muted hover:bg-white/10 hover:text-ink-inverse md:hidden"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
            >
              <span
                className="flex h-5 w-5 flex-col items-center justify-center gap-1"
                aria-hidden="true"
              >
                <span className={`${menuLine} ${mobileOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
                <span className={`${menuLine} ${mobileOpen ? 'scale-x-0 opacity-0' : ''}`} />
                <span
                  className={`${menuLine} ${mobileOpen ? '-translate-y-1.5 -rotate-45' : ''}`}
                />
              </span>
            </button>
          </div>
        </div>

        {openPanel && (
          <button
            type="button"
            tabIndex={-1}
            onClick={closePanel}
            aria-hidden="true"
            className="fade-in fixed inset-0 top-header z-behind hidden bg-overlay active:transform-none md:block"
          />
        )}

        {mobileOpen && (
          <>
            <button
              type="button"
              tabIndex={-1}
              onClick={closeMobile}
              aria-hidden="true"
              className="fade-in fixed inset-0 z-behind bg-overlay active:transform-none md:hidden"
            />
            {/* The menu is measured against the visible viewport and scrolls
                inside itself, so a dozen destinations stay reachable on a short
                screen instead of running off the bottom with nothing to drag.
                Containing the overscroll stops the page behind it moving when
                the list reaches its end, which reads as the menu sliding off
                its own bar. */}
            <nav
              className="drop-in relative max-h-[calc(100dvh-var(--header-height))] overflow-y-auto overscroll-contain shadow-card-hover md:hidden"
              aria-label="Main"
            >
              <div className="container-page flex flex-col py-2">
                <MobileGroup title="Services" items={serviceLinks} onNavigate={closeMobile} />
                <MobileGroup title="Parts" items={partLinks} onNavigate={closeMobile} />
                {flat.map((link) => (
                  <NavLink key={link.to} to={link.to} onClick={closeMobile} className={mobileLink}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          </>
        )}
      </header>
    </>
  );
}

/**
 * The strip above the bar. The phone and the address are each gated on their own
 * value in `company`, so a blank leaves no empty slot behind, and the strip is
 * dropped rather than drawn as an empty band when none of the three is set.
 */
function UtilityBar() {
  if (!company.phone && !company.email.sales && !hasAddress) return null;

  return (
    <div className="utility-bar">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {company.phone && (
            <a href={phoneHref}>
              <Phone size={iconSize.chrome} aria-hidden="true" />
              {company.phone}
            </a>
          )}
          <a href={`mailto:${company.email.sales}`}>{company.email.sales}</a>
        </div>
        {hasAddress && (
          <p className="flex items-center gap-2">
            <MapPin size={iconSize.chrome} aria-hidden="true" />
            {addressLine}
          </p>
        )}
      </div>
    </div>
  );
}

function NavPanel({ label, open, onOpen, onClose, children }) {
  const triggerRef = useRef(null);
  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onClose();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={triggerClass(open)}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => (open ? onClose() : onOpen())}
      >
        {label}
        <ChevronDown
          size={iconSize.chrome}
          aria-hidden="true"
          className={`transition-transform duration-fast ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        // Opaque rather than veiled: the panel covers a page of type with a
        // page of type, and anything showing through puts the two on top of
        // each other at the moment a visitor is reading to choose. The width
        // is capped against the viewport so a centred panel cannot run off
        // the screen at the narrow end of the desktop range.
        <div
          role="menu"
          className="drop-in absolute left-1/2 top-full z-dropdown mt-2 w-[44rem] max-w-[calc(100vw-2.5rem)] -translate-x-1/2 rounded-lg border border-line-inverse bg-[color:var(--surface-inverse)] shadow-card-hover"
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** The plain list every split panel puts down its left column. */
function PanelRows({ items, onNavigate }) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item.to}>
          <Link
            to={item.to}
            onClick={onNavigate}
            className="flex flex-col gap-1 rounded-md px-3 py-2 transition-colors duration-fast hover:bg-white/5"
          >
            <span className="font-display text-sm font-bold text-ink-inverse">{item.label}</span>
            {item.blurb && (
              <span className="text-xs leading-snug text-ink-inverse-muted">{item.blurb}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * The promoted half of a split panel: one heading, one line, one action. It
 * carries a rule down its left edge rather than a fill, so the panel stays one
 * surface and the split reads as a division of it.
 */
function PanelFeature({ eyebrow, title, body, children }) {
  return (
    <aside className="flex flex-col gap-4 border-t border-line-inverse pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
      <div className="flex flex-col gap-2">
        <p className="font-display text-micro font-bold uppercase tracking-eyebrow text-accent-inverse">
          {eyebrow}
        </p>
        <p className="font-display text-base font-bold text-ink-inverse">{title}</p>
        <p className="text-xs leading-relaxed text-ink-inverse-muted">{body}</p>
      </div>
      {children}
    </aside>
  );
}

function ServicesPanel({ onNavigate }) {
  return (
    <div className="grid gap-6 p-5 md:grid-cols-[1.35fr_1fr]">
      <PanelRows
        items={serviceMenu.map((service) => ({
          to: `/services#${service.slug}`,
          label: service.name,
          blurb: service.summary,
        }))}
        onNavigate={onNavigate}
      />
      <PanelFeature
        eyebrow="Book a Visit"
        title="Get a technician out"
        body="Send the make, the model, and the symptom, and the likely parts come out on the truck."
      >
        <div className="flex flex-col gap-2">
          <Link
            to="/contact"
            onClick={onNavigate}
            className="btn btn-md btn-ghost-light w-full"
            role="menuitem"
          >
            <Wrench size={iconSize.text} aria-hidden="true" />
            Request Service
          </Link>
          {company.phone && (
            <a href={phoneHref} className="btn btn-md btn-ghost-light w-full" role="menuitem">
              <Phone size={iconSize.text} aria-hidden="true" />
              {company.phone}
            </a>
          )}
        </div>
      </PanelFeature>
    </div>
  );
}

function PartsPanel({ onNavigate, count }) {
  return (
    <div className="grid gap-6 p-5 md:grid-cols-[1.35fr_1fr]">
      <PanelRows
        items={partCategories.map((category) => ({
          to: `/parts#${category.slug}`,
          label: category.name,
          blurb: category.blurb,
        }))}
        onNavigate={onNavigate}
      />
      <PanelFeature
        eyebrow="Quote List"
        title={count > 0 ? `${count} on your list` : 'Collect, then send once'}
        body="Every part is priced against the make, model, and capacity of the scale it goes into."
      >
        <div className="flex flex-col gap-2">
          <Link
            to={count > 0 ? '/quote' : '/parts'}
            onClick={onNavigate}
            className="btn btn-md btn-ghost-light w-full"
            role="menuitem"
          >
            <ClipboardList size={iconSize.text} aria-hidden="true" />
            {count > 0 ? 'Review Quote List' : 'Browse All Parts'}
          </Link>
        </div>
      </PanelFeature>
    </div>
  );
}

function MobileGroup({ title, items, onNavigate }) {
  return (
    <div className="border-b border-line-inverse py-2">
      <div className="px-3 pb-1 pt-2 text-micro font-bold uppercase tracking-eyebrow text-ink-inverse-faint">
        {title}
      </div>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className="flex items-center py-3 pl-3 font-display text-sm font-bold text-ink-inverse-muted hover:text-ink-inverse"
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
