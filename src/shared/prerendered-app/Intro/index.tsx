// Derived from Squoosh and substantially modified by VeryPixel in 2026.
// See LICENSE, NOTICE, and MODIFICATIONS.md.
// Modified by JeffPixel on 2026-10-30: own branding, naming description and source link.
import { h, Component } from 'preact';
import type SnackBarElement from 'shared/custom-els/snack-bar';
import logo from 'url:static-build/assets/jeffpixel-logo.png';
import { brandName, sourceRepositoryUrl } from 'shared/brand';
import * as style from './style.css';
import 'add-css:./style.css';

interface Props {
  onFile?: (files: File[]) => void;
  showSnack?: SnackBarElement['showSnackbar'];
}

export default class Intro extends Component<Props> {
  private input?: HTMLInputElement;

  private pickFiles = () => this.input?.click();

  private onFiles = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const files = Array.from(input.files || []).filter((file) =>
      file.type.startsWith('image/'),
    );
    if (files.length) this.props.onFile?.(files);
  };

  render() {
    return (
      <main class={style.intro}>
        <nav class={style.nav}>
          <a class={style.brand} href="/" aria-label="JeffPixel 首页">
            <img class={style.brandMark} src={logo} alt="" />
            <span>{brandName}</span>
          </a>
          <span class={style.localBadge}>
            <i /> Local processing
          </span>
        </nav>

        <section class={style.hero}>
          <h1>
            让图片轻一点，
            <br />
            <em>名字随你定。</em>
          </h1>
          <p>
            一次导入整组图片，统一压缩、转换格式，自定义批量命名。
            <br />
            图片全程留在浏览器本地，源码公开透明、可以独立审计。
          </p>
          <ul class={style.trustPoints} aria-label="JeffPixel 产品特点">
            <li>自由命名</li>
            <li>本地安全</li>
            <li>开源透明</li>
          </ul>

          <button class={style.pickButton} onClick={this.pickFiles}>
            <span>选择图片</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M14 7l5 5-5 5" />
            </svg>
          </button>
          <input
            ref={(el) => (this.input = el || undefined)}
            class={style.fileInput}
            type="file"
            accept="image/*"
            multiple
            onChange={this.onFiles}
          />
          <div class={style.dropHint}>或将图片拖到任意位置</div>
        </section>

        <aside class={style.art} aria-hidden="true">
          <div class={style.orbit} />
          <div class={style.imageCard}>
            <div class={style.imageWash} />
            <span class={style.cardLabel}>RAW</span>
            <strong>24.8</strong>
            <small>MEGABYTES</small>
          </div>
          <div class={style.resultCard}>
            <span>OPTIMIZED</span>
            <strong>−78%</strong>
          </div>
          <div class={`${style.pixel} ${style.p1}`} />
          <div class={`${style.pixel} ${style.p2}`} />
          <div class={`${style.pixel} ${style.p3}`} />
        </aside>

        <footer class={style.footer}>
          <span>JPEG · PNG · WEBP</span>
          <nav class={style.legalLinks}>
            <a href="/privacy/">隐私政策</a>
            <a href="/terms/">使用条款</a>
            <a href="/open-source/">源码许可</a>
            <a href={sourceRepositoryUrl}>本版源码</a>
          </nav>
        </footer>
      </main>
    );
  }
}
