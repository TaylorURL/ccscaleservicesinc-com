import { useCallback, useEffect, useMemo, useState } from 'react';
import { QuoteContext } from '../../lib/quote-context';

/**
 * Holds the quote list and mirrors it to localStorage, so a visitor who collects
 * three parts, closes the tab, and comes back tomorrow still has them. Storage
 * is wrapped because it throws outright in a browser with cookies and site data
 * blocked, and a private-window visitor losing their list is a better outcome
 * than the site refusing to render.
 */

const STORAGE_KEY = 'ciss.quote.v1';

function readStoredItems() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function QuoteProvider({ children }) {
  const [items, setItems] = useState(readStoredItems);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // A visitor with storage blocked keeps their list for the session only.
    }
  }, [items]);

  /** Adding a part already on the list bumps its quantity rather than duplicating the row. */
  const addItem = useCallback((part, quantity = 1, details = '') => {
    setItems((current) => {
      const existing = current.find((item) => item.slug === part.slug);
      if (existing) {
        return current.map((item) =>
          item.slug === part.slug
            ? { ...item, quantity: item.quantity + quantity, details: details || item.details }
            : item
        );
      }
      return [...current, { slug: part.slug, name: part.name, quantity, details }];
    });
  }, []);

  const updateItem = useCallback((slug, changes) => {
    setItems((current) =>
      current.map((item) => (item.slug === slug ? { ...item, ...changes } : item))
    );
  }, []);

  const removeItem = useCallback((slug) => {
    setItems((current) => current.filter((item) => item.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  /** Puts a cleared list back, so clearing it is a mistake a visitor can undo. */
  const restore = useCallback((previous) => setItems(previous), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      addItem,
      updateItem,
      removeItem,
      clear,
      restore,
      has: (slug) => items.some((item) => item.slug === slug),
    }),
    [items, addItem, updateItem, removeItem, clear, restore]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}
