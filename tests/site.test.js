const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('entry point uses resolvable cacheable assets instead of a runtime bundle', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const localAssets = [
    ...html.matchAll(/(?:src|href)="(assets\/[^"#?]+)["#?]/g),
  ].map((match) => match[1]);

  assert.match(html, /<link rel="stylesheet" href="assets\/css\/styles\.css">/);
  assert.match(html, /<link rel="icon" href="assets\/images\/favicon\.svg" type="image\/svg\+xml">/);
  assert.match(html, /<script defer src="assets\/js\/app\.js"><\/script>/);
  assert.doesNotMatch(html, /__bundler\/(?:manifest|template)|Unpacking/);
  assert.ok(localAssets.length > 3, 'expected multiple independently cacheable assets');

  for (const asset of localAssets) {
    assert.ok(fs.statSync(path.join(root, asset)).isFile(), `${asset} must exist`);
  }
});
