// Modified by the VeryPixel project in 2026; see MODIFICATIONS.md.
/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { h } from 'preact';

import { renderPage, writeFiles } from './utils';
import IndexPage from './pages/index';
import LegalPage from './pages/legal';
import * as iconLarge from 'img-url:static-build/assets/verypixel-logo.webp';
import dedent from 'dedent';
import { lookup as lookupMime } from 'mime-types';
import { readFileSync } from 'fs';

interface Dimensions {
  width: number;
  height: number;
}

const manifestSize = ({ width, height }: Dimensions) => `${width}x${height}`;
interface Output {
  [outputPath: string]: string;
}

const toOutput: Output = {
  'index.html': renderPage(<IndexPage />),
  'privacy/index.html': renderPage(<LegalPage kind="privacy" />),
  'terms/index.html': renderPage(<LegalPage kind="terms" />),
  'open-source/index.html': renderPage(<LegalPage kind="open-source" />),
  'licenses/VeryPixel-License.txt': readFileSync('LICENSE', 'utf8'),
  'licenses/Apache-2.0.txt': readFileSync('LICENSES/Apache-2.0.txt', 'utf8'),
  'licenses/AGPL-3.0.txt': readFileSync('LICENSES/AGPL-3.0.txt', 'utf8'),
  'licenses/VeryPixel-NOTICE.txt': readFileSync('NOTICE', 'utf8'),
  'licenses/MODIFICATIONS.txt': readFileSync('MODIFICATIONS.md', 'utf8'),
  'licenses/mozjpeg.txt': readFileSync(
    'codecs/mozjpeg/LICENSE.codec.md',
    'utf8',
  ),
  'licenses/webp.txt': readFileSync('codecs/webp/LICENSE.codec.md', 'utf8'),
  'licenses/resize.txt': readFileSync('codecs/resize/LICENSE.codec.md', 'utf8'),
  'licenses/preact.txt': readFileSync('node_modules/preact/LICENSE', 'utf8'),
  'licenses/linkstate.txt': readFileSync(
    'node_modules/linkstate/LICENSE.md',
    'utf8',
  ),
  'licenses/fflate.txt': readFileSync('node_modules/fflate/LICENSE', 'utf8'),
  'manifest.json': JSON.stringify({
    name: 'VeryPixel',
    short_name: 'VeryPixel',
    start_url: '/?utm_medium=PWA&utm_source=launcher',
    display: 'standalone',
    orientation: 'any',
    background_color: '#fff',
    theme_color: '#98c1d9',
    icons: [
      {
        src: iconLarge.default,
        type: lookupMime(iconLarge.default),
        sizes: manifestSize(iconLarge),
      },
      {
        src: iconLarge.default,
        type: lookupMime(iconLarge.default),
        sizes: manifestSize(iconLarge),
        purpose: 'maskable',
      },
    ],
    description: 'Batch-compress and convert images privately in your browser.',
    lang: 'zh-CN',
    categories: ['photo', 'productivity', 'utilities'],
    share_target: {
      action: '/?utm_medium=PWA&utm_source=share-target&share-target',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        files: [
          {
            name: 'file',
            accept: ['image/*'],
          },
        ],
      },
    },
  }),
  _headers: dedent`
    /*
      Cache-Control: no-cache

    # I don't think Rollup is cache-busting files correctly.
    #/c/*
    #  Cache-Control: max-age=31536000

    # COOP+COEP for WebAssembly threads.
    /*
      Cross-Origin-Embedder-Policy: require-corp
      Cross-Origin-Opener-Policy: same-origin
  `,
};

writeFiles(toOutput);
