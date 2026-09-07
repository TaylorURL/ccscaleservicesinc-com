import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * A client-side route change keeps the previous scroll position, which lands a
 * visitor halfway down the page they just opened. Anchor links are left alone so
 * the service links from the footer still jump to their section.
 *
 * Going back is the exception: the browser drops its own scroll restoration once
 * the router takes over the history entry, so the position of each page is kept
 * here and put back on a POP. Without it, backing out of a part lands at the top
 * of the catalog rather than on the row the visitor came from.
 *
 * Focus follows the scroll. A screen reader left on the footer link that started
 * the navigation would otherwise have to walk the whole new page to find out
 * where it is.
 */
export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map());
  const previous = useRef(key);

  useEffect(() => {
    const store = positions.current;
    const leaving = previous.current;
    previous.current = key;
    return () => store.set(leaving, window.scrollY);
  }, [key]);

  useEffect(() => {
    if (hash) return;
    if (navigationType === 'POP') {
      window.scrollTo(0, positions.current.get(key) ?? 0);
      return;
    }
    window.scrollTo(0, 0);
    const main = document.getElementById('main');
    if (main) main.focus({ preventScroll: true });
  }, [pathname, hash, key, navigationType]);

  return null;
}
