// SPDX-License-Identifier: AGPL-3.0-only
// Copyright 2026 JeffPixel contributors
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const filename = path.resolve(
  __dirname,
  '../src/client/lazy-app/Compress/filenames.ts',
);
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = module.paths;
loaded._compile(compiled, filename);
const { defaultNamingSettings, buildOutputNames, namingError } = loaded.exports;
const settings = (overrides = {}) => ({
  ...defaultNamingSettings,
  ...overrides,
});
const names = (input, overrides = {}, extension = 'jpg') =>
  buildOutputNames(
    input.map((name) => ({ name, extension })),
    settings(overrides),
  );

test('default retains the original stem with the encoder extension', () => {
  assert.deepEqual(names(['IMG_1234.jpeg', 'photo.v2.png', 'no-extension']), [
    'IMG_1234.jpg',
    'photo.v2.jpg',
    'no-extension.jpg',
  ]);
});
test('does not add a product suffix', () => {
  assert.deepEqual(names(['photo.jpg']), ['photo.jpg']);
});
test('preserves Unicode, spaces and dotfiles', () => {
  assert.deepEqual(names(['杭州 旅行.png', '.photo']), [
    '杭州 旅行.jpg',
    '.photo.jpg',
  ]);
});
test('adds custom prefix and suffix', () => {
  assert.deepEqual(
    names(['IMG_1.jpg'], { mode: 'affix', prefix: '杭州_', suffix: '_精选' }),
    ['杭州_IMG_1_精选.jpg'],
  );
});
test('sequence uses queue order, selected start and padding', () => {
  assert.deepEqual(
    names(['z.png', 'a.png'], {
      mode: 'sequence',
      sequenceName: '旅行',
      startAt: '8',
      padding: 3,
    }),
    ['旅行_008.jpg', '旅行_009.jpg'],
  );
});
test('sequence supports zero and numbers wider than the padding', () => {
  assert.deepEqual(
    names(['a'], {
      mode: 'sequence',
      sequenceName: '图',
      startAt: '0',
      padding: 2,
    }),
    ['图_00.jpg'],
  );
  assert.deepEqual(
    names(['a'], {
      mode: 'sequence',
      sequenceName: '图',
      startAt: '100',
      padding: 2,
    }),
    ['图_100.jpg'],
  );
});
test('empty sequence name has a usable fallback', () => {
  assert.deepEqual(names(['a'], { mode: 'sequence', sequenceName: '' }), [
    'image_001.jpg',
  ]);
});
test('replacement is literal, case-sensitive and applies to all matches', () => {
  assert.deepEqual(
    names(['a.a.A.png'], { mode: 'replace', find: '.', replacement: '$&' }),
    ['a$&a$&A.jpg'],
  );
  assert.deepEqual(
    names(['IMG_IMG_img.png'], {
      mode: 'replace',
      find: 'IMG',
      replacement: '图',
    }),
    ['图_图_img.jpg'],
  );
});
test('replacement supports deletion and an empty search leaves the name alone', () => {
  assert.deepEqual(
    names(['IMG_a.png'], { mode: 'replace', find: 'IMG_', replacement: '' }),
    ['a.jpg'],
  );
  assert.deepEqual(
    names(['a.png'], { mode: 'replace', find: '', replacement: 'x' }),
    ['a.jpg'],
  );
});
test('replacement affects the stem only', () => {
  assert.deepEqual(
    names(['jpg.jpg'], { mode: 'replace', find: 'jpg', replacement: 'png' }),
    ['png.jpg'],
  );
});
test('resolves duplicate names before both single-file and ZIP downloads', () => {
  assert.deepEqual(names(['a.png', 'a.jpg', 'a (2).png', 'a.jpeg']), [
    'a.jpg',
    'a (2).jpg',
    'a (2) (2).jpg',
    'a (3).jpg',
  ]);
});
test('collision keys are case-insensitive and Unicode-normalized', () => {
  assert.deepEqual(names(['Photo.jpg', 'photo.png']), [
    'Photo.jpg',
    'photo (2).jpg',
  ]);
  assert.deepEqual(names(['é.jpg', 'e\u0301.png']), [
    'é.jpg',
    'e\u0301 (2).jpg',
  ]);
});
test('different output extensions do not conflict', () => {
  assert.deepEqual(
    buildOutputNames(
      [
        { name: 'a', extension: 'jpg' },
        { name: 'a', extension: 'webp' },
      ],
      settings(),
    ),
    ['a.jpg', 'a.webp'],
  );
});
test('sanitizes filesystem separators, control characters and reserved names', () => {
  assert.deepEqual(
    names(['a/b\\c:d?.jpg', 'CON.png', 'com1.test.png', 'x\u0000y.png']),
    ['a_b_c_d_.jpg', '_CON.jpg', '_com1.test.jpg', 'x_y.jpg'],
  );
});
test('empty and dot-only stems get safe fallbacks', () => {
  assert.deepEqual(names(['...', ' .png', 'NUL.jpg']), [
    'image.jpg',
    'image (2).jpg',
    '_NUL.jpg',
  ]);
});
test('removes trailing periods and whitespace', () => {
  assert.deepEqual(names(['a. .png']), ['a.jpg']);
});
test('prevents Unicode direction controls from disguising extensions', () => {
  assert.deepEqual(names(['abc\u202Egnp.jpg']), ['abc_gnp.jpg']);
});
test('limits total UTF-8 filename length, including collision suffixes', () => {
  const result = names([
    '旅行'.repeat(100) + '.jpg',
    '旅行'.repeat(100) + '.png',
  ]);
  assert.notEqual(result[0], result[1]);
  for (const name of result) {
    assert.ok(Buffer.byteLength(name) <= 200);
    assert.ok(!name.includes('\uFFFD'));
    assert.ok(name.endsWith('.jpg'));
  }
});
test('validates sequence input and permits editing other modes independently', () => {
  for (const startAt of ['', '-1', '1.5', '1e2', '1000000000'])
    assert.ok(namingError(settings({ mode: 'sequence', startAt })));
  for (const startAt of ['0', '1', '999999999'])
    assert.equal(namingError(settings({ mode: 'sequence', startAt })), '');
  assert.equal(namingError(settings({ mode: 'original', startAt: '' })), '');
});
test('rejects unsafe output extensions', () => {
  assert.throws(() => names(['a'], {}, '../jpg'), /extension/i);
});
test('is deterministic and does not mutate input or settings', () => {
  const input = Object.freeze([
    Object.freeze({ name: 'a.png', extension: 'jpg' }),
  ]);
  const options = Object.freeze(settings());
  assert.deepEqual(
    buildOutputNames(input, options),
    buildOutputNames(input, options),
  );
});
