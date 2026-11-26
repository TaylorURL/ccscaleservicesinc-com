// The reporter that files browser errors lives inline in index.html, so it is
// not importable. These tests read the function out of the document and run it,
// which is what keeps the filter honest: the page is the only place it exists.
//
// What it has to get right is the difference between the site failing and the
// visitor's browser failing inside the page. DuckDuckGo's content-scope runtime
// is injected under WebKit's 'user-script' scheme, logs its own start-up
// timeout through console.error, and puts its frames in the message because a
// console override is handed no stack. Reported as a site fault it is noise;
// dropped too eagerly it would hide a real error, so both directions are pinned.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function loadBrowserOnly() {
  const start = html.indexOf('function browserOnly(');
  if (start === -1) throw new Error('browserOnly is no longer in index.html');
  let depth = 0;
  let end = -1;
  for (let i = html.indexOf('{', start); i < html.length; i += 1) {
    if (html[i] === '{') depth += 1;
    else if (html[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) throw new Error('browserOnly is not a closed function in index.html');
  return new Function(`${html.slice(start, end)}; return browserOnly`)();
}

const browserOnly = loadBrowserOnly();

// The console override is handed no stack, so a filter read over the stack
// alone sees undefined for every console report and files all of them. Reading
// the message as well is half the fix and the half a unit test of the function
// cannot see, so the call site is pinned here too.
test('the reporter reads both the stack and the message', () => {
  assert.ok(
    html.includes('if (browserOnly(stack) || browserOnly(message)) return;'),
    'report() must run the filter over the message as well as the stack'
  );
});

test("holds back this report's verbatim message", () => {
  assert.equal(browserOnly('Failed to get initial setup @user-script:105:2281:23'), true);
});

test('holds back the earlier forms of the same failure', () => {
  assert.equal(browserOnly('Failed to get initial setup request@user-script:18:2247:23'), true);
  assert.equal(browserOnly('Failed to get initial setup request@user-script:29:2250:23'), true);
  assert.equal(browserOnly('Failed to get initial setup request@user-script:34:2242:23'), true);
  assert.equal(
    browserOnly(
      [
        'Failed to get initial setup request@user-script:37:2329:23',
        'async init@user-script:37:7827:51',
        'async callInit@user-script:37:4908:24',
        '@user-script:37:14076:42',
        'async init@user-script:37:14069:29',
      ].join('\n')
    ),
    true
  );
});

test('holds back extension frames, which carry an authority after the scheme', () => {
  assert.equal(
    browserOnly(
      'at a (chrome-extension://abc/content.js:1:1)\nat b (chrome-extension://abc/c.js:2:2)'
    ),
    true
  );
  assert.equal(browserOnly('handler@safari-web-extension://1234/x.js:5:6'), true);
  assert.equal(browserOnly('at moz-extension://9/inject.js:3:4'), true);
});

test('reports anything carrying a frame of the site', () => {
  assert.equal(
    browserOnly(
      'TypeError: x is not a function\n    at https://ccscaleservices.com/assets/i.js:10:20'
    ),
    false
  );
  assert.equal(
    browserOnly(
      'at chrome-extension://a/c.js:1:1\n at https://ccscaleservices.com/assets/i.js:2:2'
    ),
    false
  );
  assert.equal(
    browserOnly('at user-script:105:2281:23\n at https://ccscaleservices.com/assets/i.js:2:2'),
    false
  );
  assert.equal(browserOnly('at blob:https://ccscaleservices.com/uuid:1:1'), false);
});

test('reports a plain message, which names no frame at all', () => {
  assert.equal(browserOnly('Error: the quote could not be built'), false);
  assert.equal(browserOnly('Failed to load parts catalog'), false);
  assert.equal(browserOnly('Minified React error #418; visit react.dev/errors/418'), false);
  assert.equal(
    browserOnly('Failed to load resource: the server responded with a status of 404 ()'),
    false
  );
  assert.equal(
    browserOnly('HTTP 404 from https://ccscaleservices.com/assets/index-abc123.js'),
    false
  );
  assert.equal(browserOnly(''), false);
  assert.equal(browserOnly(undefined), false);
});

// A dotted filename in a stack carries a line number after a colon exactly the
// way an authority-less scheme does, so a looser scan would read 'content.js'
// as browser-owned and the site's own errors would stop being filed.
test('does not read a dotted filename as a scheme', () => {
  assert.equal(browserOnly('at handler (content.js:12:3)'), false);
  assert.equal(browserOnly('index-D2GEGQKq.js:1:4216'), false);
});
