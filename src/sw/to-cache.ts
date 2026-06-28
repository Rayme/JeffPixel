// Modified by the VeryPixel project in 2026; see MODIFICATIONS.md.
import { simd } from 'wasm-feature-detect';
import checkThreadsSupport from 'worker-shared/supports-wasm-threads';

// Give TypeScript the correct global.
declare var self: ServiceWorkerGlobalScope;

function subtractSets<T extends any>(set1: Set<T>, set2: Set<T>): Set<T> {
  const result = new Set(set1);
  for (const item of set2) result.delete(item);
  return result;
}

// Initial app stuff
import * as initialApp from 'entry-data:client/initial-app';
import swUrl from 'service-worker:sw';
import * as compress from 'entry-data:client/lazy-app/Compress';
import * as swBridge from 'entry-data:client/lazy-app/sw-bridge';

// The processors and codecs
// Simple stuff everyone gets:
import * as featuresWorker from 'entry-data:../features-worker';

// WebP
import * as webpEncSimd from 'entry-data:codecs/webp/enc/webp_enc_simd';
import * as webpEnc from 'entry-data:codecs/webp/enc/webp_enc';

// OxiPNG
import * as oxiMt from 'entry-data:codecs/oxipng/pkg-parallel/squoosh_oxipng';
import * as oxi from 'entry-data:codecs/oxipng/pkg/squoosh_oxipng';

export function shouldCacheDynamically(url: string) {
  return false;
}

let initialJs = new Set([
  compress.main,
  ...compress.deps,
  swBridge.main,
  ...swBridge.deps,
]);
initialJs = subtractSets(
  initialJs,
  new Set([
    initialApp.main,
    ...initialApp.deps.filter(
      (item) =>
        // Exclude JS deps that have been inlined:
        item.endsWith('.js') ||
        // As well as large image deps we want to keep dynamic:
        shouldCacheDynamically(item),
    ),
    // Exclude features Worker itself - it's referenced from the main app,
    // but is meant to be cached lazily.
    featuresWorker.main,
    // Also exclude Service Worker itself (we're inside right now).
    swUrl,
  ]),
);

export const initial = ['/', ...initialJs];

export const theRest = (async () => {
  const [supportsThreads, supportsSimd] = await Promise.all([
    checkThreadsSupport(),
    simd(),
  ]);

  const items: string[] = [];

  function addWithDeps(entry: typeof import('entry-data:*')) {
    items.push(entry.main, ...entry.deps);
  }

  addWithDeps(featuresWorker);

  // OxiPNG
  if (supportsThreads) {
    addWithDeps(oxiMt);
  } else {
    addWithDeps(oxi);
  }

  // WebP
  if (supportsSimd) {
    addWithDeps(webpEncSimd);
  } else {
    addWithDeps(webpEnc);
  }

  return [...new Set(items)];
})();
