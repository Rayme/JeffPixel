// Modified by the VeryPixel project in 2026; see MODIFICATIONS.md.
// Modified by JeffPixel on 2026-10-30: own manifest, icons and additional notices.
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

import { renderPage, writeFiles, sourceVersionUrl } from './utils';
import IndexPage from './pages/index';
import LegalPage from './pages/legal';
import * as iconLarge from 'img-url:static-build/assets/jeffpixel-logo.png';
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
  'version.json': JSON.stringify({
    name: 'JeffPixel',
    commit: process.env.SOURCE_COMMIT || null,
    source: sourceVersionUrl,
  }),
  'privacy/index.html': renderPage(<LegalPage kind="privacy" />),
  'terms/index.html': renderPage(<LegalPage kind="terms" />),
  'open-source/index.html': renderPage(<LegalPage kind="open-source" />),
  'licenses/VeryPixel-License.txt': readFileSync('LICENSE', 'utf8'),
  'licenses/Apache-2.0.txt': readFileSync('LICENSES/Apache-2.0.txt', 'utf8'),
  'licenses/AGPL-3.0.txt': readFileSync('LICENSES/AGPL-3.0.txt', 'utf8'),
  'licenses/VeryPixel-NOTICE.txt': readFileSync('NOTICE', 'utf8'),
  'licenses/MODIFICATIONS.txt': readFileSync('MODIFICATIONS.md', 'utf8'),
  'licenses/JeffPixel-License.txt': readFileSync('FORK_LICENSE', 'utf8'),
  'licenses/JeffPixel-NOTICE.txt': readFileSync('FORK_NOTICE', 'utf8'),
  'licenses/mozjpeg.txt': readFileSync(
    'codecs/mozjpeg/LICENSE.codec.md',
    'utf8',
  ),
  'licenses/oxipng.txt': readFileSync('codecs/oxipng/LICENSE.codec.md', 'utf8'),
  'licenses/webp.txt': readFileSync('codecs/webp/LICENSE.codec.md', 'utf8'),
  'licenses/resize.txt': readFileSync('codecs/resize/LICENSE.codec.md', 'utf8'),
  'licenses/preact.txt': readFileSync('node_modules/preact/LICENSE', 'utf8'),
  'licenses/linkstate.txt': readFileSync(
    'node_modules/linkstate/LICENSE.md',
    'utf8',
  ),
  'licenses/fflate.txt': readFileSync('node_modules/fflate/LICENSE', 'utf8'),
  'licenses/comlink.txt': readFileSync('node_modules/comlink/LICENSE', 'utf8'),
  'licenses/file-drop-element.txt': readFileSync(
    'node_modules/file-drop-element/LICENSE',
    'utf8',
  ),
  'licenses/idb-keyval.txt': readFileSync(
    'node_modules/idb-keyval/LICENCE',
    'utf8',
  ),
  'licenses/pointer-tracker.txt': readFileSync(
    'node_modules/pointer-tracker/LICENSE',
    'utf8',
  ),
  'licenses/wasm-feature-detect.txt': readFileSync(
    'node_modules/wasm-feature-detect/LICENSE',
    'utf8',
  ),
  'manifest.json': JSON.stringify({
    name: 'JeffPixel',
    short_name: 'JeffPixel',
    start_url: '/',
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
        purpose: 'any',
      },
    ],
    description: '浏览器本地图片压缩、格式转换与自定义批量命名。',
    lang: 'zh-CN',
    categories: ['photo', 'productivity', 'utilities'],
    share_target: {
      action: '/',
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
      X-Content-Type-Options: nosniff
      Referrer-Policy: strict-origin-when-cross-origin
      Permissions-Policy: camera=(), microphone=(), geolocation=()
  `,
};

writeFiles(toOutput);
