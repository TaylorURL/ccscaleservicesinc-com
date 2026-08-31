import SplitRail from '@taylorurl/split-rail';
import ActionRail from './ActionRail';
import Footer from './Footer';
import Header from './Header';

export default function Layout({ children }) {
  return (
    // The bottom padding is the space the action rail sits over. Reserved on
    // the column rather than on the footer, so the last thing on any page ends
    // above the rail instead of behind it, and it collapses to zero at the
    // width that drops the rail.
    <div className="flex min-h-dvh flex-col pb-[var(--rail-height)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-toast focus:rounded focus:bg-action focus:px-4 focus:py-2 focus:text-action-ink"
      >
        Skip to Content
      </a>
      <Header />
      {/* tabIndex -1 lets a route change move focus here without putting
          the whole page region into the tab order. */}
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <Footer>
        <SplitRail />
      </Footer>
      <ActionRail />
    </div>
  );
}
