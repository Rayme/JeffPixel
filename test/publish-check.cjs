// SPDX-License-Identifier: AGPL-3.0-only
// Copyright 2026 JeffPixel contributors
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const assert = require('node:assert/strict');
function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}
function github(endpoint) {
  const raw = execFileSync(
    'curl',
    [
      '--fail',
      '--silent',
      '--show-error',
      '--max-time',
      '40',
      '-H',
      'Accept: application/vnd.github+json',
      '-H',
      'User-Agent: JeffPixel-publish-check',
      `https://api.github.com/repos/Rayme/JeffPixel${endpoint}`,
    ],
    { encoding: 'utf8' },
  );
  return JSON.parse(raw);
}
assert.equal(
  git('status', '--porcelain'),
  '',
  'Commit all source changes before publishing',
);
const head = git('rev-parse', 'HEAD');
const version = JSON.parse(fs.readFileSync('build/version.json', 'utf8'));
assert.equal(
  version.commit,
  head,
  'Rebuild from the committed source before publishing',
);
execFileSync(process.execPath, ['test/compliance.cjs'], { stdio: 'inherit' });
const repo = github('');
assert.equal(repo.private, false, 'Corresponding source must be public');
assert.equal(
  repo.fork,
  true,
  'Create the requested GitHub Fork before publishing',
);
assert.equal(
  repo.parent.full_name,
  'very-jack/VeryPixel',
  'Unexpected fork origin',
);
assert.equal(
  github(`/commits/${head}`).sha,
  head,
  'Push the corresponding source commit before publishing',
);
console.log(
  JSON.stringify({
    ok: true,
    publicFork: repo.full_name,
    commit: head,
    source: version.source,
  }),
);
