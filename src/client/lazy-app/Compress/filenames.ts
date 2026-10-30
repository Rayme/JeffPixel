// SPDX-License-Identifier: AGPL-3.0-only
// Copyright 2026 JeffPixel contributors
// Added by JeffPixel on 2026-10-30; see MODIFICATIONS.md.

export type NamingMode = 'original' | 'affix' | 'sequence' | 'replace';

export interface NamingSettings {
  mode: NamingMode;
  prefix: string;
  suffix: string;
  sequenceName: string;
  startAt: string;
  padding: number;
  find: string;
  replacement: string;
}

export const defaultNamingSettings: NamingSettings = {
  mode: 'original',
  prefix: '',
  suffix: '',
  sequenceName: 'image',
  startAt: '1',
  padding: 3,
  find: '',
  replacement: '',
};

interface SourceName {
  name: string;
  extension: string;
}

const maxFilenameBytes = 200;
const utf8 = new TextEncoder();

function stem(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(0, dot) : name;
}

function sanitizeBase(value: string): string {
  let safe = value
    .replace(/[<>:"/\\|?*\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '_')
    .trim()
    .replace(/[. ]+$/g, '');
  if (!safe) safe = 'image';
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(safe))
    safe = '_' + safe;
  return safe;
}

function truncateUtf8(value: string, budget: number): string {
  let result = '';
  let length = 0;
  for (const point of value) {
    const size = utf8.encode(point).length;
    if (length + size > budget) break;
    result += point;
    length += size;
  }
  return result.replace(/[. ]+$/g, '') || 'image';
}

export function namingError(settings: NamingSettings): string {
  if (
    settings.mode === 'sequence' &&
    (!/^\d{1,9}$/.test(settings.startAt) ||
      Number(settings.startAt) > 999999999)
  ) {
    return '起始序号请输入 0–999999999 的整数';
  }
  return '';
}

/** The same complete-queue name plan drives previews, direct downloads and ZIPs. */
export function buildOutputNames(
  sources: readonly SourceName[],
  settings: Readonly<NamingSettings>,
): string[] {
  const used = new Set<string>();
  const start = /^\d{1,9}$/.test(settings.startAt)
    ? Number(settings.startAt)
    : 1;
  const padding = Math.max(1, Math.min(6, Math.floor(settings.padding) || 3));
  return sources.map((source, index) => {
    const extension = source.extension.toLowerCase();
    if (!/^[a-z0-9]{1,10}$/.test(extension))
      throw new Error('Invalid output extension');
    let base = stem(source.name);
    switch (settings.mode) {
      case 'affix':
        base = settings.prefix + base + settings.suffix;
        break;
      case 'sequence':
        base = `${settings.sequenceName.trim() || 'image'}_${String(
          start + index,
        ).padStart(padding, '0')}`;
        break;
      case 'replace':
        // Literal replacement avoids regular-expression and "$&" surprises.
        if (settings.find)
          base = base.split(settings.find).join(settings.replacement);
        break;
    }
    base = sanitizeBase(base);
    let copy = 1;
    let candidate: string;
    let key: string;
    do {
      const suffix = copy === 1 ? '' : ` (${copy})`;
      const tail = suffix + '.' + extension;
      candidate =
        truncateUtf8(base, maxFilenameBytes - utf8.encode(tail).length) + tail;
      key = candidate.normalize('NFC').toLowerCase();
      copy++;
    } while (used.has(key));
    used.add(key);
    return candidate;
  });
}
