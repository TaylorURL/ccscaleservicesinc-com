import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

/**
 * React clears the container it is given, and the container is the shell in
 * index.html: the finished first screen, drawn by the document itself. Mounting
 * in the same task the parser hands over takes that screen out again in the gap
 * between the browser deciding to draw a frame and the screen actually showing
 * it, so the photo behind the hero is never credited with the paint it made and
 * the largest element on the page is timed from the moment the bundle finished
 * instead of from the moment the document did.
 *
 * Waiting two frames is what separates the two. The browser draws the shell,
 * reports what it drew, and React takes over on the frame after with the same
 * markup, so nothing on screen changes and the paint is counted where it
 * happened. Until then the page is the set of ordinary links the shell is
 * written to be.
 *
 * A tab loaded in the background is never asked to draw a frame, and the timer
 * is what mounts the app there rather than leaving it waiting for one.
 */
let started = false;

function start() {
  if (started) return;
  started = true;
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}

requestAnimationFrame(() => requestAnimationFrame(start));
setTimeout(start, 1000);
