// Modified by the VeryPixel project in 2026; see MODIFICATIONS.md.
// Modified by JeffPixel on 2026-10-30: own branding and removal of upstream analytics.
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
import { h, FunctionalComponent } from 'preact';

import baseCss from 'css:./base.css';
import initialCss from 'initial-css:';
import { allSrc } from 'client-bundle:client/initial-app';
import favicon from 'url:static-build/assets/jeffpixel-logo.png';
import ogImage from 'url:static-build/assets/jeffpixel-logo.png';
import { escapeStyleScriptContent, siteOrigin } from 'static-build/utils';
import Intro from 'shared/prerendered-app/Intro';
import snackbarCss from 'css:../../../shared/custom-els/snack-bar/styles.css';
import * as snackbarStyle from '../../../shared/custom-els/snack-bar/styles.css';

interface Props {}

const Index: FunctionalComponent<Props> = () => (
  <html lang="zh-CN">
    <head>
      <meta charSet="utf-8" />
      <title>JeffPixel — 本地图片压缩与批量命名</title>
      <meta
        name="description"
        content="浏览器本地批量图片压缩、格式转换与自定义命名，支持 JPEG、PNG、WebP。"
      />
      <meta name="twitter:card" content="summary" />
      <meta property="og:title" content="JeffPixel" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${siteOrigin}${ogImage}`} />
      <meta
        property="og:image:secure_url"
        content={`${siteOrigin}${ogImage}`}
      />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta
        property="og:image:alt"
        content="JeffPixel 图片压缩与批量命名工具"
      />
      <meta
        name="og:description"
        content="浏览器本地批量图片压缩、格式转换与自定义命名。"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <link rel="icon" type="image/png" href={favicon} />
      <link rel="apple-touch-icon" href={ogImage} />
      <meta name="theme-color" content="#98c1d9" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="canonical" href={siteOrigin} />

      <style
        dangerouslySetInnerHTML={{ __html: escapeStyleScriptContent(baseCss) }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: escapeStyleScriptContent(initialCss),
        }}
      />
    </head>
    <body>
      <div id="app">
        <Intro />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: escapeStyleScriptContent(snackbarCss),
            }}
          />
          <snack-bar>
            <div
              class={snackbarStyle.snackbar}
              aria-live="assertive"
              aria-atomic="true"
              aria-hidden="false"
            >
              <div class={snackbarStyle.text}>
                Initialization error: This site requires JavaScript, which is
                disabled in your browser.
              </div>
              <a class={snackbarStyle.button} href="/">
                reload
              </a>
            </div>
          </snack-bar>
        </noscript>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: escapeStyleScriptContent(allSrc),
        }}
      />
    </body>
  </html>
);

export default Index;
