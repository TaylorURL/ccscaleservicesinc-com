import { createContext, useContext } from 'react';

/**
 * The quote list is the site's cart: parts a visitor has collected, held until
 * they send them to sales as one request. It is deliberately its own module so
 * the provider component and the pages that read it can both import the context
 * without importing each other.
 */

export const QuoteContext = createContext(null);

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote must be used inside a QuoteProvider');
  }
  return context;
}
