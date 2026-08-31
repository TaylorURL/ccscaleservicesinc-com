import { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import ClickSpark from './components/ClickSpark';
import Layout from './components/Layout';
import RouteFallback from './components/RouteFallback';
import ScrollToTop from './components/ScrollToTop';
import { QuoteProvider } from './components/QuoteProvider';
import { withBuildRefresh } from './lib/chunk-recovery';

/**
 * Every route is its own chunk. Imported statically, the catalog, both request
 * forms, and the legal text all land in the entry bundle, so a visitor reading
 * the home page waits for code for pages they will never open. Split, each page
 * costs one request at the moment somebody asks for it, and the placeholder
 * below holds the space while it arrives.
 *
 * Each loader goes through withBuildRefresh, so a tab still holding the
 * previous build asks for a chunk filename the host has replaced, reloads onto
 * the current document, and lands on the page rather than on an error screen.
 */
const Home = lazy(withBuildRefresh(() => import('./pages/Home')));
const Services = lazy(withBuildRefresh(() => import('./pages/Services')));
const Parts = lazy(withBuildRefresh(() => import('./pages/Parts')));
const PartDetail = lazy(withBuildRefresh(() => import('./pages/PartDetail')));
const QuoteRequest = lazy(withBuildRefresh(() => import('./pages/QuoteRequest')));
const About = lazy(withBuildRefresh(() => import('./pages/About')));
const Contact = lazy(withBuildRefresh(() => import('./pages/Contact')));
const Privacy = lazy(withBuildRefresh(() => import('./pages/Privacy')));
const Terms = lazy(withBuildRefresh(() => import('./pages/Terms')));
const NotFound = lazy(withBuildRefresh(() => import('./pages/NotFound')));

export default function App() {
  const { pathname } = useLocation();

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
          <div key={pathname} className="fade-in">
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
          </div>
        </Suspense>
      </Layout>
    </QuoteProvider>
  );
}
