// SPDX-License-Identifier: AGPL-3.0-only
// Copyright 2026 JeffPixel contributors
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
// SHA-256 of the verbatim upstream texts at 90ed901fd4378dbc230264495d7eecee62a04883.
// Hashes keep this check usable in shallow clones and source archives.
const upstreamDigests = {
  LICENSE: 'eba5796fb052b5ad0a2e8c1a07b9939be95a1c79cc4b5d464b6a7ec9ebb007ae',
  NOTICE: '72b23682390a6a1614bd06f95b45318dead2466b26a4bb053cc62af4c218a49e',
  'LICENSES/Apache-2.0.txt':
    '5f3a3c817e78f5b8a4ad2d2c458a3e4b2cce470d6c12642c4eeb12cb8a9bf51d',
  'LICENSES/AGPL-3.0.txt':
    '0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0',
};
for (const [file, expected] of Object.entries(upstreamDigests)) {
  assert.equal(
    createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
    expected,
    `${file}: upstream text changed`,
  );
}
for (const file of ['FORK_LICENSE', 'FORK_NOTICE', 'MODIFICATIONS.md'])
  assert.ok(fs.statSync(file).size > 100);
assert.ok(
  !fs.existsSync('src/static-build/assets/verypixel-logo.webp'),
  'upstream logo must be absent from current source tree',
);
const build = 'build';
const pages = [
  'index.html',
  'privacy/index.html',
  'terms/index.html',
  'open-source/index.html',
];
for (const page of pages) {
  const html = fs.readFileSync(path.join(build, page), 'utf8');
  assert.ok(html.includes('JeffPixel'), `${page}: own brand missing`);
  assert.ok(
    !/umami\.veryjack\.com|verypixel-logo|jack@veryjack\.com|1f8a1944-ed9d-4ba9-9533-974bada58a47/i.test(
      html,
    ),
    `${page}: upstream deployment identity remains`,
  );
  for (const match of html.matchAll(/(?:href|src)="(\/licenses\/[^"#?]+)"/g))
    assert.ok(
      fs.existsSync(path.join(build, match[1])),
      `Missing public license: ${match[1]}`,
    );
  for (const match of html.matchAll(/<script[^>]+src="([^"]+)"/g))
    assert.ok(!/^https?:\/\//.test(match[1]), `External script: ${match[1]}`);
}
const originalFiles = {
  'VeryPixel-License.txt': 'LICENSE',
  'VeryPixel-NOTICE.txt': 'NOTICE',
  'Apache-2.0.txt': 'LICENSES/Apache-2.0.txt',
  'AGPL-3.0.txt': 'LICENSES/AGPL-3.0.txt',
  'MODIFICATIONS.txt': 'MODIFICATIONS.md',
  'JeffPixel-License.txt': 'FORK_LICENSE',
  'JeffPixel-NOTICE.txt': 'FORK_NOTICE',
};
for (const [output, source] of Object.entries(originalFiles))
  assert.ok(
    fs
      .readFileSync(path.join(build, 'licenses', output))
      .equals(fs.readFileSync(source)),
    `License output differs: ${output}`,
  );
const thirdParty = [
  'mozjpeg',
  'oxipng',
  'webp',
  'resize',
  'preact',
  'linkstate',
  'fflate',
  'comlink',
  'file-drop-element',
  'idb-keyval',
  'pointer-tracker',
  'wasm-feature-detect',
];
for (const name of thirdParty)
  assert.ok(
    fs.statSync(path.join(build, 'licenses', name + '.txt')).size > 100,
    `Third-party license missing: ${name}`,
  );
const manifest = JSON.parse(
  fs.readFileSync(path.join(build, 'manifest.json'), 'utf8'),
);
assert.equal(manifest.name, 'JeffPixel');
assert.ok(manifest.icons.every((icon) => !icon.src.includes('verypixel')));
const headers = fs.readFileSync(path.join(build, '_headers'), 'utf8');
assert.ok(headers.includes('Cross-Origin-Embedder-Policy: require-corp'));
assert.ok(headers.includes('Cross-Origin-Opener-Policy: same-origin'));
const version = JSON.parse(
  fs.readFileSync(path.join(build, 'version.json'), 'utf8'),
);
assert.match(version.commit, /^[a-f0-9]{40}$/);
assert.equal(
  version.source,
  `https://github.com/Rayme/JeffPixel/tree/${version.commit}`,
);
assert.ok(
  fs
    .readFileSync(path.join(build, 'open-source/index.html'), 'utf8')
    .includes(version.source),
);
for (const file of fs.readdirSync(path.join(build, 'c'))) {
  assert.ok(
    !file.includes('verypixel-logo'),
    'upstream logo in deployed assets',
  );
  if (file.endsWith('.js'))
    assert.ok(
      !/umami\.veryjack\.com|1f8a1944-ed9d-4ba9-9533-974bada58a47/.test(
        fs.readFileSync(path.join(build, 'c', file), 'utf8'),
      ),
      'upstream analytics in JS',
    );
}
console.log(
  JSON.stringify({
    ok: true,
    upstreamNoticesUnchanged: true,
    publicLicenseFiles: Object.keys(originalFiles).length + thirdParty.length,
    pagesChecked: pages.length,
    commit: version.commit,
  }),
);
