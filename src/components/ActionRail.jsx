import { Link } from 'react-router-dom';
import { Phone, Wrench } from 'lucide-react';
import { company, phoneHref } from '../content/company';
import { iconSize } from '../lib/icon-size';

/**
 * The two actions the site exists to produce, pinned to the bottom edge on
 * anything smaller than a desktop.
 *
 * The number appears in the utility strip and in the footer, and on a phone both
 * are a scroll away from wherever the reader has got to. This is the copy that
 * is not, for the visitor standing at a scale that has stopped weighing.
 *
 * Two actions, and nothing else: a rail that also carried a menu and a search
 * would be a second navigation bar, and what makes this one work is that
 * pressing either half is unambiguous.
 *
 * Its height is reserved on the page column through --rail-height rather than
 * the rail covering whatever the page ends with. The token is zero past the
 * large breakpoint, where the rail is hidden, so the reservation goes with it.
 */
export default function ActionRail() {
  if (!company.phone) return null;

  return (
    <div className="action-rail">
      <div className="container-page grid grid-cols-2 gap-3 py-2">
        <a href={phoneHref} className="btn btn-md btn-steel">
          <Phone size={iconSize.text} aria-hidden="true" />
          Call
        </a>
        <Link to="/contact" className="btn btn-md btn-primary">
          <Wrench size={iconSize.text} aria-hidden="true" />
          Request Service
        </Link>
      </div>
    </div>
  );
}
