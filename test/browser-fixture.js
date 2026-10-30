// SPDX-License-Identifier: AGPL-3.0-only
// Copyright 2026 JeffPixel contributors
// Browser-only synthetic acceptance fixture. Evaluate on the local preview origin.
(async () => {
  const checks = (window.pixelChecks = {
    errors: [],
    requests: [],
    downloads: [],
    workerCount: 0,
  });
  window.addEventListener('error', (event) =>
    checks.errors.push(event.message),
  );
  window.addEventListener('unhandledrejection', (event) =>
    checks.errors.push(String(event.reason)),
  );
  const nativeFetch = window.fetch;
  window.fetch = function (input, options) {
    checks.requests.push({
      url: String(input instanceof Request ? input.url : input),
      method: options?.method || 'GET',
    });
    return nativeFetch.apply(this, arguments);
  };
  const NativeWorker = window.Worker;
  window.Worker = new Proxy(NativeWorker, {
    construct(target, args, newTarget) {
      checks.workerCount++;
      return Reflect.construct(target, args, newTarget);
    },
  });
  const nativeClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) {
      const record = { name: this.download, url: this.href };
      record.bytes = fetch(this.href)
        .then((response) => response.arrayBuffer())
        .then((buffer) => Array.from(new Uint8Array(buffer)));
      checks.downloads.push(record);
      return;
    }
    return nativeClick.apply(this, arguments);
  };
  checks.snapshot = () => ({
    ready: document.body.innerText.includes('3 张已就绪'),
    previews: [...document.querySelectorAll('small[title]')].map(
      (node) => node.title,
    ),
    errors: checks.errors,
    itemErrors: [...document.querySelectorAll('span[title]')]
      .map((node) => node.title)
      .filter(
        (title) => !['移除', 'done', 'waiting', 'processing'].includes(title),
      ),
    workerCount: checks.workerCount,
    outputUrl: document.querySelector('img[alt="压缩效果"]')?.src,
    isolated: crossOriginIsolated,
  });
  const transfer = new DataTransfer();
  for (const [i, name] of [
    'IMG_001.png',
    'img_001.png',
    '杭州 旅行.png',
  ].entries()) {
    const canvas = document.createElement('canvas');
    canvas.width = 320 + i * 20;
    canvas.height = 180 + i * 10;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, ['#235b7b', '#875c68', '#236b53'][i]);
    gradient.addColorStop(1, '#f4d79b');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.font = '32px sans-serif';
    context.fillText('JeffPixel ' + i, 30, 90);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/png'),
    );
    transfer.items.add(new File([blob], name, { type: 'image/png' }));
  }
  const input = document.querySelector('input[type="file"]');
  input.files = transfer.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return { selected: transfer.files.length };
})();
