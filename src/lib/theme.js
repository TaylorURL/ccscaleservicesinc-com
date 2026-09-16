import { useCallback, useEffect, useState } from 'react';

/**
 * Three themes, one attribute. `data-theme` on the document element selects the
 * token block in index.css; with nothing set, the stylesheet follows the
 * visitor's system preference. So "no stored choice" is a real state rather than
 * a silent default to light, and a visitor who has never touched the control
 * still gets the theme their machine is already in.
 *
 * Storage is wrapped because it throws outright in a browser with site data
 * blocked, and a visitor losing their theme choice is a better outcome than the
 * site refusing to render.
 */

const THEME_KEY = 'ciss.theme.v1';

export const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'gray', label: 'Gray' },
];

const NAMES = THEMES.map((theme) => theme.value);

function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    return NAMES.includes(stored) ? stored : null;
  } catch {
    return null;
  }
}

/**
 * Keeps the browser's own chrome in step with the page. The value is read back
 * off the stylesheet rather than restated here, so the themes stay defined in
 * exactly one place.
 */
function syncBrowserChrome() {
  const surface = getComputedStyle(document.documentElement).getPropertyValue('--surface').trim();
  if (!surface) return;
  let meta = document.head.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', surface);
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme) {
    root.setAttribute('data-theme', theme);
  } else {
    root.removeAttribute('data-theme');
  }
  syncBrowserChrome();
}

export function useTheme() {
  const [theme, setTheme] = useState(readStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    try {
      if (theme) {
        window.localStorage.setItem(THEME_KEY, theme);
      } else {
        window.localStorage.removeItem(THEME_KEY);
      }
    } catch {
      // A visitor with storage blocked keeps their choice for the session only.
    }
  }, [theme]);

  // With no explicit choice the page is following the system, so the chrome has
  // to follow it too when the visitor changes it mid-visit.
  useEffect(() => {
    if (theme) return undefined;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => syncBrowserChrome();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [theme]);

  const choose = useCallback((next) => setTheme(next), []);

  return { theme, choose };
}
