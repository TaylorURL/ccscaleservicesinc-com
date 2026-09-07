import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ClickSpark from './components/app/ClickSpark';
import Layout from './components/layout/Layout';
import RouteFallback from './components/app/RouteFallback';
import ScrollToTop from './components/app/ScrollToTop';
import { QuoteProvider } from './components/app/QuoteProvider';
import Home from './pages/Home';
import { withBuildRefresh } from './lib/chunk-recovery';

/**
 * Every route but the home page is its own chunk. Imported statically, the
 * catalog, both request forms, and the legal text all land in the entry bundle,
 * so a visitor reading the home page waits for code for pages they will never
 * open. Split, each page costs one request at the moment somebody asks for it,
 * and the placeholder below holds the space while it arrives.
 *
 * The home page is the exception because it is the page most visitors land on,
 * and a boundary that falls back on the first render paints a placeholder the
 * height of a skeleton and then a page ten times taller, which shoves the
 * footer down the screen and counts against the layout shift score. Resolved
 * synchronously, React's first commit is the finished page.
 *
 * Each loader goes through withBuildRefresh, so a tab still holding the
 * previous build asks for a chunk filename the host has replaced, reloads onto
 * the current document, and lands on the page rather than on an error screen.
 */
const Services = lazy(withBuildRefresh(() => import('./pages/Services')));
const Parts = lazy(withBuildRefresh(() => import('./pages/Parts')));
const PartDetail = lazy(withBuildRefresh(() => import('./pages/PartDetail')));
const QuoteRequest = lazy(withBuildRefresh(() => import('./pages/QuoteRequest')));
const About = lazy(withBuildRefresh(() => import('./pages/About')));
const Contact = lazy(withBuildRefresh(() => import('./pages/Contact')));
const Privacy = lazy(withBuildRefresh(() => import('./pages/Privacy')));
const Terms = lazy(withBuildRefresh(() => import('./pages/Terms')));
const NotFound = lazy(withBuildRefresh(() => import('./pages/NotFound')));

/**
 * Whether the app has committed once. The entrance below is for a page that is
 * arriving, and on the first commit nothing is: the shell in index.html has
 * already drawn the first screen, so the route React resolves synchronously is
 * a page the reader is looking at rather than one appearing.
 */
let committed = false;

/**
 * The route's entrance. It carries the fade for a page that replaces something
 * else on screen - the next route on a navigation, and the placeholder on a
 * chunk that has just landed - and no fade for the one route that is already
 * drawn when React reaches it, where the animation would blink the page out and
 * then hold it, and the photo behind it, at zero opacity until the bundle had
 * run.
 *
 * The choice is taken at mount and kept. Adding the class to a live element
 * replays the animation, so a re-render for any other reason would fade a page
 * the reader is part way through reading.
 */
function RouteEntrance({ children }) {
  const [entering] = useState(() => committed);
  return <div className={entering ? 'fade-in' : undefined}>{children}</div>;
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    committed = true;
  }, []);

  return (
    <QuoteProvider>
      <ScrollToTop />
      <ClickSpark />
      <Layout>
        {/* The boundary is keyed on the path so each route mounts its own. A
            navigation is a transition, and React holds a boundary already on
            screen at its old content rather than swapping in a fallback, so one
            boundary shared across routes shows the page being left for as long
            as the next chunk takes and the placeholder never renders. */}
        <Suspense key={pathname} fallback={<RouteFallback />}>
          {/* Inside the boundary and keyed on the path, so the page that
              replaces the placeholder fades in rather than appearing between two
              frames, and the placeholder itself keeps its own entrance. */}
          <RouteEntrance key={pathname}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/parts" element={<Parts />} />
              <Route path="/parts/:slug" element={<PartDetail />} />
              <Route path="/quote" element={<QuoteRequest />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RouteEntrance>
        </Suspense>
      </Layout>
    </QuoteProvider>
  );
}
