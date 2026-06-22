// Derived from Squoosh and substantially modified by VeryPixel in 2026.
// See LICENSE, NOTICE, and MODIFICATIONS.md.
import { h, Component } from 'preact';
import type SnackBarElement from 'shared/custom-els/snack-bar';
import logo from 'url:static-build/assets/verypixel-logo.webp';
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
          <a class={style.brand} href="/" aria-label="VeryPixel home">
            <img class={style.brandMark} src={logo} alt="" />
            <span>VeryPixel</span>
          </a>
          <span class={style.localBadge}>
            <i /> Local processing
          </span>
        </nav>

        <section class={style.hero}>
          <h1>
            Make every pixel
            <br />
            <em>feel lighter.</em>
          </h1>
          <p>
            无需复杂设置，一次导入整组图片，统一完成压缩与格式转换。
            <br />
            图片全程留在浏览器本地，源码公开透明、可以独立审计。
          </p>
          <ul class={style.trustPoints} aria-label="VeryPixel 产品特点">
            <li>简单易用</li>
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
          <span>MOZJPEG · WEBP · JPEG · PNG</span>
          <nav class={style.legalLinks}>
            <a href="/privacy/">隐私政策</a>
            <a href="/terms/">使用条款</a>
            <a href="/open-source/">源码许可</a>
            <a href="https://github.com/very-jack/VeryPixel">GitHub</a>
            <a href="https://veryjack.com">VeryJack 博客</a>
          </nav>
        </footer>
      </main>
    );
  }
}
