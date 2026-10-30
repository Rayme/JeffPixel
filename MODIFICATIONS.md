# Modifications from Squoosh

VeryPixel is derived from GoogleChromeLabs/Squoosh under Apache License 2.0.
VeryPixel original code and copyrightable modifications are licensed under
AGPL-3.0-only; see the repository root LICENSE for the precise scope.
The project was materially modified in 2026, including:

- replacement of Squoosh branding, landing content, icons, metadata, and UI;
- addition of multi-file queues and shared batch compression settings;
- proportional bounding-box resize without cropping, stretching, or upscaling;
- output filename suffix `_VeryPixel`;
- browser-local ZIP packaging for multi-image downloads;
- restriction of output formats to user-facing JPEG, PNG, and WebP, backed by Squoosh MozJPEG, OxiPNG, and WebP;
- removal of the original analytics integration, demos, Browser GIF, browser JPEG/PNG export options, unused encoders/decoders, GPL imagequant, and HQX from the source repository and production build;
- addition of self-hosted Umami for basic page-visit analytics; uploaded images remain browser-local;
- addition of privacy, terms, open-source, and deployment-compliance materials;
- build compatibility fixes for workspace paths and current local tooling.

VeryPixel is an independent project. Google and Squoosh maintainers do not
sponsor, endorse, or provide warranties for these modifications.

## JeffPixel modifications — 2026-10-30

Fork base: very-jack/VeryPixel commit 90ed901fd4378dbc230264495d7eecee62a04883.
Maintainer: Rayme. Corresponding source: https://github.com/Rayme/JeffPixel.
JeffPixel additions and copyrightable modifications are AGPL-3.0-only;
upstream and third-party license scope remains unchanged. See FORK_LICENSE.

- Replaced the product name, logo, favicon, social image and PWA identity with
  independent JeffPixel branding; removed upstream brand image from the current tree.
- Replaced the fixed output suffix with original-name, prefix/suffix, numbered
  batch and literal find/replace modes, with live export-name previews.
- Separated export naming from image encoding so name edits reuse encoded bytes.
- Shared a deterministic filename plan between previews, direct downloads and
  ZIP entries; added Unicode/case collision handling, safe-character replacement,
  reserved-name handling and UTF-8 filename-length limits.
- Removed the upstream Umami scripts and website identifiers. Updated the privacy,
  terms and license pages to describe this deployment and provide corresponding source.
- Preserved LICENSE, LICENSES/, NOTICE, codec licenses and original attribution.
  Added FORK_LICENSE, FORK_NOTICE and online license texts for bundled JS dependencies.
- Added filename regression tests, a build/compliance check, reproducible deployment
  configuration and Node.js 22 development baseline with a pinned Wrangler version.
- Retained the upstream image codecs and metadata-removal behavior.
- Pinned the upstream fflate 0.8.2 dependency for compatibility with the
  upstream TypeScript 4.4 toolchain. The app uses ZIP output only (zipSync).
  Extended CI to run filename tests and license/distribution checks.

Modified files carry a JeffPixel modification notice or are explicitly identified
here: package.json, package-lock.json, .nvmrc, .gitignore, README.md, MODIFICATIONS.md;
.github/workflows/node.js.yml;
src/client/lazy-app/Compress/index.tsx and style.css;
src/shared/prerendered-app/Intro/index.tsx;
src/static-build/index.tsx, utils.tsx, pages/index/index.tsx and pages/legal/index.tsx.
New code, tests, deployment files and independently created icon are identified by
their JeffPixel attribution or covered by FORK_LICENSE/FORK_NOTICE.
