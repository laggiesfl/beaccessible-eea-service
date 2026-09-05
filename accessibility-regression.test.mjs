import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');

test('shared accessibility controls are present', () => {
  for (const text of ['A- Decrease','A Reset','A+ Increase','High contrast','Reduce motion','Listen to this page','Pause listening','Stop listening','Reset accessibility']) {
    assert.ok(html.includes(text), `missing ${text}`);
  }
});

test('text sizing persists from 80 to 200 percent', () => {
  assert.ok(html.includes('eea-text-size'));
  assert.match(html, /Math\.max\([^\n]*80\)/);
  assert.match(html, /Math\.min\([^\n]*200\)/);
});

test('contrast and motion preferences persist', () => {
  assert.ok(html.includes('eea-high-contrast'));
  assert.ok(html.includes('eea-reduce-motion'));
  assert.ok(html.includes('@media (prefers-reduced-motion: reduce)'));
});

test('read aloud sanitises interactive and excluded regions', () => {
  assert.ok(html.includes('cloneNode(true)'));
  assert.ok(html.includes('input, textarea, select, button, [data-speech-exclude]'));
  assert.ok(html.includes('speechSynthesis.pause()'));
  assert.ok(html.includes('speechSynthesis.resume()'));
});

test('commercial CTA matches the central catalogue', () => {
  assert.ok(html.includes('R4,500 per engagement'));
  assert.ok(html.includes('https://beaccessible.co.za/products/eea-disability-compliance'));
  assert.ok(html.includes('Pay R4,500 and start the EEA review'));
});

test('accessibility note avoids unverified conformance claims', () => {
  assert.ok(!html.includes('WCAG 2.0/2.1/2.2 Level AAA'));
  assert.ok(!html.includes('Screen reader compatible'));
  assert.ok(html.includes('Targets WCAG 2.2 AA'));
});
