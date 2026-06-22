// Derived from Squoosh and substantially modified by VeryPixel in 2026.
// See LICENSE, NOTICE, and MODIFICATIONS.md.
import { h, Component } from 'preact';
import type SnackBarElement from 'shared/custom-els/snack-bar';
import { zipSync } from 'fflate';
import logo from 'url:static-build/assets/verypixel-logo.webp';
import { builtinDecode } from '../util';
import { encoderMap, EncoderState, EncoderType } from '../feature-meta';
import WorkerBridge from '../worker-bridge';
import prettyBytes from './Results/pretty-bytes';
import * as style from './style.css';
import 'add-css:./style.css';

const allowedEncoders = [
  'mozJPEG',
  'webP',
  'browserJPEG',
  'browserPNG',
] as const;
type AllowedEncoder = typeof allowedEncoders[number];

// Mirrors the compact lossless presets used by the original Squoosh WebP UI.
// Each entry is [method, quality], while the user-facing effort is its index.
const webPLosslessPresets: [number, number][] = [
  [0, 0],
  [1, 20],
  [2, 25],
  [3, 30],
  [3, 50],
  [4, 50],
  [4, 75],
  [4, 90],
  [5, 90],
  [6, 100],
];
const defaultWebPLosslessEffort = 6;

// Kept as public types for the reusable Squoosh processor components.
export type OutputType = EncoderType | 'identity';
export interface SourceImage {
  file: File;
  decoded: ImageData;
  preprocessed: ImageData;
  vectorImage?: HTMLImageElement;
}

interface Props {
  files: File[];
  showSnack: SnackBarElement['showSnackbar'];
  onBack: () => void;
  onClear: () => void;
}

interface BatchItem {
  file: File;
  originalUrl: string;
  output?: File;
  outputUrl?: string;
  width?: number;
  height?: number;
  outputWidth?: number;
  outputHeight?: number;
  status: 'waiting' | 'processing' | 'done' | 'error';
  error?: string;
}

interface State {
  items: BatchItem[];
  selected: number;
  encoderState: EncoderState;
  resizeEnabled: boolean;
  maxWidth: number;
  maxHeight: number;
  maxWidthInput: string;
  maxHeightInput: string;
  compare: number;
  processing: boolean;
  packing: boolean;
  encoderSupport: Partial<Record<AllowedEncoder, boolean>>;
}

function createItem(file: File): BatchItem {
  return { file, originalUrl: URL.createObjectURL(file), status: 'waiting' };
}

function outputName(name: string, extension: string): string {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  return `${base}_VeryPixel.${extension}`;
}

function containSize(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
) {
  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function decode(signal: AbortSignal, file: File): Promise<ImageData> {
  return builtinDecode(signal, file);
}

export default class Compress extends Component<Props, State> {
  state: State;
  private worker = new WorkerBridge();
  private abortController = new AbortController();
  private processTimer?: number;
  private fileInput?: HTMLInputElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      items: props.files.map(createItem),
      selected: 0,
      encoderState: {
        type: 'mozJPEG',
        options: encoderMap.mozJPEG.meta.defaultOptions,
      },
      resizeEnabled: false,
      maxWidth: 1920,
      maxHeight: 1920,
      maxWidthInput: '1920',
      maxHeightInput: '1920',
      compare: 50,
      processing: false,
      packing: false,
      encoderSupport: {},
    };
  }

  componentDidMount() {
    this.processBatch();
    Promise.all(
      allowedEncoders.map(async (type) => {
        const encoder = encoderMap[type] as any;
        return [
          type,
          encoder.featureTest ? await encoder.featureTest() : true,
        ] as const;
      }),
    ).then((results) => {
      const encoderSupport = Object.fromEntries(results) as Record<
        AllowedEncoder,
        boolean
      >;
      this.setState({ encoderSupport });
    });
    import('../sw-bridge').then(({ mainAppLoaded }) => mainAppLoaded());
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.files.length <= this.props.files.length) return;
    const added = nextProps.files
      .slice(this.props.files.length)
      .map(createItem);
    this.setState((state) => ({ items: [...state.items, ...added] }));
    this.queueProcess();
  }

  componentWillUnmount() {
    this.abortController.abort();
    this.worker.reset();
    clearTimeout(this.processTimer);
    this.state.items.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
    });
  }

  private queueProcess = () => {
    clearTimeout(this.processTimer);
    this.processTimer = self.setTimeout(() => this.processBatch(), 240);
  };

  private processBatch = async () => {
    this.abortController.abort();
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    const settings = {
      encoderState: this.state.encoderState,
      resizeEnabled: this.state.resizeEnabled,
      maxWidth: this.state.maxWidth,
      maxHeight: this.state.maxHeight,
    };
    const batchItems = [...this.state.items];
    let failed = 0;

    this.setState((state) => ({
      processing: true,
      items: state.items.map((item) => ({ ...item, status: 'waiting' })),
    }));

    for (let index = 0; index < batchItems.length; index++) {
      if (signal.aborted) return;
      this.setItem(index, { status: 'processing', error: undefined });
      const item = batchItems[index];
      try {
        let image = await decode(signal, item.file);
        const originalWidth = image.width;
        const originalHeight = image.height;
        let target = { width: originalWidth, height: originalHeight };

        if (settings.resizeEnabled) {
          target = containSize(
            originalWidth,
            originalHeight,
            settings.maxWidth,
            settings.maxHeight,
          );
          if (
            target.width !== originalWidth ||
            target.height !== originalHeight
          ) {
            image = await this.worker.resize(signal, image, {
              width: target.width,
              height: target.height,
              method: 'lanczos3',
              fitMethod: 'stretch',
              premultiply: true,
              linearRGB: true,
            });
          }
        }

        const encoder = encoderMap[settings.encoderState.type];
        const bytes = await encoder.encode(
          signal,
          this.worker,
          image,
          settings.encoderState.options as any,
        );
        if (signal.aborted) return;
        const output = new File(
          [bytes],
          outputName(item.file.name, encoder.meta.extension),
          { type: encoder.meta.mimeType },
        );
        const outputUrl = URL.createObjectURL(output);
        if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
        this.setItem(index, {
          output,
          outputUrl,
          width: originalWidth,
          height: originalHeight,
          outputWidth: target.width,
          outputHeight: target.height,
          status: 'done',
        });
      } catch (error) {
        if (signal.aborted) return;
        failed++;
        this.setItem(index, {
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
        });
      } finally {
        // A fresh worker per item prevents large WASM heaps and transferred
        // pixel buffers from accumulating throughout a camera-photo batch.
        this.worker.reset();
      }

      // Let the browser paint status changes and reclaim released resources.
      await new Promise<void>((resolve) => self.setTimeout(resolve, 0));
    }
    if (!signal.aborted) {
      this.setState({ processing: false });
      if (failed) {
        this.props.showSnack(`${failed} 张图片处理失败，其余图片已继续处理`);
      }
    }
  };

  private setItem(index: number, patch: Partial<BatchItem>) {
    this.setState((state) => ({
      items: state.items.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  }

  private onFormatChange = (event: Event) => {
    const type = (event.currentTarget as HTMLSelectElement)
      .value as AllowedEncoder;
    this.setState({
      encoderState: {
        type: type as EncoderType,
        options: encoderMap[type].meta.defaultOptions,
      } as EncoderState,
    });
    this.queueProcess();
  };

  private onQualityChange = (event: Event) => {
    const quality = Number((event.currentTarget as HTMLInputElement).value);
    const normalized =
      this.state.encoderState.type === 'browserJPEG' ? quality / 100 : quality;
    this.setState((state) => ({
      encoderState: {
        ...state.encoderState,
        options: {
          ...(state.encoderState.options as any),
          quality: normalized,
        },
      } as EncoderState,
    }));
    this.queueProcess();
  };

  private onWebPLosslessChange = (event: Event) => {
    const lossless = (event.currentTarget as HTMLInputElement).checked;
    this.setState((state) => ({
      encoderState: {
        ...state.encoderState,
        options: {
          ...(state.encoderState.options as any),
          lossless: lossless ? 1 : 0,
          ...(lossless
            ? {
                method: webPLosslessPresets[defaultWebPLosslessEffort][0],
                quality: webPLosslessPresets[defaultWebPLosslessEffort][1],
              }
            : {}),
        },
      } as EncoderState,
    }));
    this.queueProcess();
  };

  private onWebPEffortChange = (event: Event) => {
    const effort = Number((event.currentTarget as HTMLInputElement).value);
    this.setState((state) => {
      const options = state.encoderState.options as any;
      const nextOptions = options.lossless
        ? {
            ...options,
            method: webPLosslessPresets[effort][0],
            quality: webPLosslessPresets[effort][1],
          }
        : { ...options, method: effort };
      return {
        encoderState: {
          ...state.encoderState,
          options: nextOptions,
        } as EncoderState,
      };
    });
    this.queueProcess();
  };

  private onResizeToggle = (event: Event) => {
    this.setState({
      resizeEnabled: (event.currentTarget as HTMLInputElement).checked,
    });
    this.queueProcess();
  };

  private onDimension = (
    key: 'maxWidth' | 'maxHeight',
    inputKey: 'maxWidthInput' | 'maxHeightInput',
    event: Event,
  ) => {
    const rawValue = (event.currentTarget as HTMLInputElement).value;
    const value = Number(rawValue);
    const isValid = /^\d+$/.test(rawValue) && value >= 1;

    this.setState({
      [inputKey]: rawValue,
      ...(isValid ? { [key]: value } : {}),
    } as Pick<State, typeof inputKey | typeof key>);

    if (isValid) this.queueProcess();
  };

  private onDimensionBlur = (
    key: 'maxWidth' | 'maxHeight',
    inputKey: 'maxWidthInput' | 'maxHeightInput',
  ) => {
    const rawValue = this.state[inputKey];
    const value = Number(rawValue);
    const normalized =
      /^\d+$/.test(rawValue) && value >= 1
        ? String(value)
        : String(this.state[key]);
    this.setState({ [inputKey]: normalized } as Pick<State, typeof inputKey>);
  };

  private onAddFiles = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const files = Array.from(input.files || []).filter((file) =>
      file.type.startsWith('image/'),
    );
    input.value = '';
    if (!files.length) return;
    this.setState((state) => ({
      items: [...state.items, ...files.map(createItem)],
    }));
    this.queueProcess();
  };

  private removeItem = (index: number) => {
    const item = this.state.items[index];
    URL.revokeObjectURL(item.originalUrl);
    if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
    this.setState((state) => ({
      items: state.items.filter((_, i) => i !== index),
      selected: Math.max(0, Math.min(state.selected, state.items.length - 2)),
    }));
  };

  private clearAll = () => {
    this.abortController.abort();
    clearTimeout(this.processTimer);
    this.worker.reset();
    this.state.items.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
    });
    if (this.fileInput) this.fileInput.value = '';
    this.setState({
      items: [],
      selected: 0,
      processing: false,
      packing: false,
    });
    this.props.onClear();
  };

  private download = (item: BatchItem) => {
    if (!item.output || !item.outputUrl) return;
    const link = document.createElement('a');
    link.href = item.outputUrl;
    link.download = item.output.name;
    link.click();
  };

  private downloadAll = async () => {
    const done = this.state.items.filter((item) => item.status === 'done');
    if (done.length === 0) return;
    if (done.length === 1) {
      this.download(done[0]);
      return;
    }

    this.setState({ packing: true });
    try {
      const entries: Record<string, Uint8Array> = {};
      const usedNames = new Set<string>();

      for (const item of done) {
        if (!item.output) continue;
        const dot = item.output.name.lastIndexOf('.');
        const base =
          dot > 0 ? item.output.name.slice(0, dot) : item.output.name;
        const extension = dot > 0 ? item.output.name.slice(dot) : '';
        let entryName = item.output.name;
        let copy = 2;
        while (usedNames.has(entryName)) {
          entryName = `${base} (${copy})${extension}`;
          copy++;
        }
        usedNames.add(entryName);
        entries[entryName] = new Uint8Array(await item.output.arrayBuffer());
      }

      // Encoded images rarely benefit from a second compression pass. Store them
      // directly so archive creation remains fast and entirely browser-local.
      const archive = zipSync(entries, { level: 0 });
      const archiveUrl = URL.createObjectURL(
        new Blob([archive], { type: 'application/zip' }),
      );
      const link = document.createElement('a');
      link.href = archiveUrl;
      link.download = 'VeryPixel_images.zip';
      link.click();
      self.setTimeout(() => URL.revokeObjectURL(archiveUrl), 1000);
    } catch (error) {
      this.props.showSnack('压缩包生成失败，请重试');
    } finally {
      this.setState({ packing: false });
    }
  };

  render() {
    const {
      items,
      selected,
      encoderState,
      resizeEnabled,
      maxWidth,
      maxHeight,
      maxWidthInput,
      maxHeightInput,
      compare,
      processing,
      packing,
      encoderSupport,
    } = this.state;
    const active = items[selected];
    const rawQuality = (encoderState.options as any).quality;
    const quality =
      encoderState.type === 'browserJPEG'
        ? Math.round((rawQuality || 0) * 100)
        : Math.round(rawQuality || 0);
    const hasQuality = typeof rawQuality === 'number';
    const isWebP = encoderState.type === 'webP';
    const webPLossless = isWebP && !!(encoderState.options as any).lossless;
    const webPLosslessEffort = webPLossless
      ? webPLosslessPresets.findIndex(
          ([method, presetQuality]) =>
            method === (encoderState.options as any).method &&
            presetQuality === rawQuality,
        )
      : -1;
    const webPEffort = webPLossless
      ? webPLosslessEffort === -1
        ? defaultWebPLosslessEffort
        : webPLosslessEffort
      : Number((encoderState.options as any).method || 0);
    const completed = items.filter((item) => item.status === 'done').length;
    const sourceSize = items.reduce((sum, item) => sum + item.file.size, 0);
    const outputSize = items.reduce(
      (sum, item) => sum + (item.output?.size || 0),
      0,
    );

    return (
      <main class={style.workspace}>
        <header class={style.header}>
          <button class={style.brand} onClick={this.props.onBack}>
            <img src={logo} alt="" /> VeryPixel
          </button>
          <div class={style.progressText}>
            <i class={processing ? style.pulse : ''} />
            {processing
              ? `正在处理 ${completed}/${items.length}`
              : `${completed} 张已就绪`}
          </div>
          <button
            class={style.downloadAll}
            disabled={processing || packing || completed === 0}
            onClick={this.downloadAll}
          >
            {packing ? '正在打包…' : completed > 1 ? '下载 ZIP' : '下载图片'}{' '}
            {!packing && <span>↘</span>}
          </button>
        </header>

        <section class={style.layout}>
          <aside class={style.queue}>
            <div class={style.sectionHead}>
              <div>
                <small>BATCH</small>
                <strong>图片队列</strong>
              </div>
              <span class={style.queueActions}>
                <button
                  class={style.clearAll}
                  disabled={items.length === 0}
                  onClick={this.clearAll}
                >
                  清空
                </button>
                <button
                  aria-label="添加图片"
                  onClick={() => this.fileInput?.click()}
                >
                  ＋
                </button>
              </span>
            </div>
            <input
              ref={(el) => (this.fileInput = el || undefined)}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={this.onAddFiles}
            />
            <div class={style.queueList}>
              {items.map((item, index) => (
                <button
                  class={`${style.queueItem} ${
                    selected === index ? style.active : ''
                  }`}
                  onClick={() => this.setState({ selected: index })}
                >
                  <img src={item.originalUrl} alt="" />
                  <span class={style.itemCopy}>
                    <strong>{item.file.name}</strong>
                    <small>
                      {item.width
                        ? `${item.width} × ${item.height}`
                        : prettyBytes(item.file.size).value +
                          ' ' +
                          prettyBytes(item.file.size).unit}
                    </small>
                  </span>
                  <span
                    class={`${style.statusDot} ${style[item.status]}`}
                    title={item.error || item.status}
                  />
                  <span
                    class={style.remove}
                    title="移除"
                    onClick={(event) => {
                      event.stopPropagation();
                      this.removeItem(index);
                    }}
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
            <button
              class={style.addMore}
              onClick={() => this.fileInput?.click()}
            >
              <span>＋</span> 添加更多图片
            </button>
          </aside>

          <section class={style.stage}>
            {active ? (
              <div class={style.previewShell}>
                <div class={style.previewMeta}>
                  <span>原图</span>
                  <strong>{active.file.name}</strong>
                  <span>压缩结果</span>
                </div>
                <div class={style.compare}>
                  <img
                    src={active.outputUrl || active.originalUrl}
                    alt={active.outputUrl ? '压缩结果' : '原图'}
                  />
                  {active.outputUrl && (
                    <div
                      class={style.outputClip}
                      style={{ clipPath: `inset(0 ${100 - compare}% 0 0)` }}
                    >
                      <img src={active.originalUrl} alt="原图" />
                    </div>
                  )}
                  <div class={style.divider} style={{ left: `${compare}%` }}>
                    <span>‹ ›</span>
                  </div>
                  <input
                    aria-label="原图与压缩结果对比"
                    type="range"
                    min="0"
                    max="100"
                    value={compare}
                    onInput={(event) =>
                      this.setState({
                        compare: Number(
                          (event.currentTarget as HTMLInputElement).value,
                        ),
                      })
                    }
                  />
                  {active.status === 'processing' && (
                    <div class={style.processingVeil}>处理中…</div>
                  )}
                </div>
                <div class={style.resultBar}>
                  <div>
                    <small>原始大小</small>
                    <strong>
                      {prettyBytes(active.file.size).value}{' '}
                      {prettyBytes(active.file.size).unit}
                    </strong>
                  </div>
                  <div>
                    <small>输出大小</small>
                    <strong>
                      {active.output
                        ? `${prettyBytes(active.output.size).value} ${
                            prettyBytes(active.output.size).unit
                          }`
                        : '—'}
                    </strong>
                  </div>
                  <div>
                    <small>节省空间</small>
                    <strong>
                      {active.output
                        ? `${Math.round(
                            (1 - active.output.size / active.file.size) * 100,
                          )}%`
                        : '—'}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div class={style.empty}>添加图片以开始</div>
            )}
          </section>

          <aside class={style.settings}>
            <div class={style.sectionHead}>
              <div>
                <small>SETTINGS</small>
                <strong>统一参数</strong>
              </div>
            </div>
            <label class={style.field}>
              <span>输出格式</span>
              <select value={encoderState.type} onChange={this.onFormatChange}>
                {allowedEncoders.map((type) => (
                  <option
                    value={type}
                    disabled={encoderSupport[type] === false}
                  >
                    {encoderMap[type].meta.label}
                    {encoderSupport[type] === false ? '（浏览器不支持）' : ''}
                  </option>
                ))}
              </select>
            </label>
            {isWebP && (
              <label class={`${style.toggleRow} ${style.codecToggle}`}>
                <span>
                  <strong>Lossless 无损</strong>
                  <small>使用 WebP 无损编码</small>
                </span>
                <input
                  type="checkbox"
                  checked={webPLossless}
                  onChange={this.onWebPLosslessChange}
                />
                <i />
              </label>
            )}
            {hasQuality && !webPLossless && (
              <div class={style.qualityField}>
                <div>
                  <span>压缩质量</span>
                  <strong>{quality}</strong>
                </div>
                <input
                  aria-label="压缩质量"
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onInput={this.onQualityChange}
                />
                <div class={style.rangeLabels}>
                  <span>更小</span>
                  <span>更清晰</span>
                </div>
              </div>
            )}
            {isWebP && (
              <div class={style.qualityField}>
                <div>
                  <span>编码强度（Effort）</span>
                  <strong>{webPEffort}</strong>
                </div>
                <input
                  aria-label="编码强度 Effort"
                  type="range"
                  min="0"
                  max={webPLossless ? '9' : '6'}
                  value={webPEffort}
                  onInput={this.onWebPEffortChange}
                />
                <div class={style.rangeLabels}>
                  <span>更快</span>
                  <span>压缩更充分</span>
                </div>
              </div>
            )}
            <div class={style.settingDivider} />
            <label class={style.toggleRow}>
              <span>
                <strong>调整尺寸</strong>
                <small>始终保持原始比例</small>
              </span>
              <input
                type="checkbox"
                checked={resizeEnabled}
                onChange={this.onResizeToggle}
              />
              <i />
            </label>
            <div
              class={`${style.dimensions} ${
                resizeEnabled ? '' : style.disabled
              }`}
            >
              <label>
                <span>最大宽度</span>
                <div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={maxWidthInput}
                    onInput={(e) =>
                      this.onDimension('maxWidth', 'maxWidthInput', e)
                    }
                    onBlur={() =>
                      this.onDimensionBlur('maxWidth', 'maxWidthInput')
                    }
                  />
                  <small>PX</small>
                </div>
              </label>
              <b>×</b>
              <label>
                <span>最大高度</span>
                <div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    value={maxHeightInput}
                    onInput={(e) =>
                      this.onDimension('maxHeight', 'maxHeightInput', e)
                    }
                    onBlur={() =>
                      this.onDimensionBlur('maxHeight', 'maxHeightInput')
                    }
                  />
                  <small>PX</small>
                </div>
              </label>
            </div>
            <p class={style.resizeNote}>
              图片会缩小至边界框内，不裁切、不拉伸，也不会放大小图。
            </p>
            <div class={style.settingDivider} />
            <div class={style.batchSummary}>
              <span>
                <small>文件</small>
                <strong>{items.length}</strong>
              </span>
              <span>
                <small>原始</small>
                <strong>
                  {prettyBytes(sourceSize).value} {prettyBytes(sourceSize).unit}
                </strong>
              </span>
              <span>
                <small>输出</small>
                <strong>
                  {outputSize
                    ? `${prettyBytes(outputSize).value} ${
                        prettyBytes(outputSize).unit
                      }`
                    : '—'}
                </strong>
              </span>
            </div>
            <div class={style.privacy}>
              <span>⌁</span>
              <p>
                <strong>本地处理</strong>
                <small>所有图片只停留在此设备</small>
              </p>
            </div>
            <nav class={style.legalLinks}>
              <a href="/privacy/">隐私</a>
              <a href="/terms/">条款</a>
              <a href="/open-source/">源码许可</a>
              <a href="https://github.com/very-jack/VeryPixel">GitHub</a>
              <a href="https://veryjack.com">VeryJack 博客</a>
            </nav>
          </aside>
        </section>
      </main>
    );
  }
}
