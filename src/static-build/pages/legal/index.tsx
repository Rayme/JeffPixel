// Derived from VeryPixel; original copyright and license scope are retained in LICENSE and NOTICE.
// Modified by JeffPixel on 2026-10-30: fork attribution, current privacy practices and source access.
import { h, FunctionalComponent } from 'preact';
import logo from 'url:static-build/assets/jeffpixel-logo.png';
import css from 'css:./style.css';
import * as style from './style.css';
import { brandName, contactUrl, sourceRepositoryUrl } from 'shared/brand';
import {
  escapeStyleScriptContent,
  legalOperator,
  sourceVersionUrl,
} from 'static-build/utils';

export type LegalKind = 'privacy' | 'terms' | 'open-source';
const titles: Record<LegalKind, string> = {
  privacy: '隐私政策',
  terms: '使用条款',
  'open-source': '源码与许可声明',
};

const Footer = () => (
  <footer class={style.footer}>
    <span>JeffPixel · 2026</span>
    <a href="/privacy/">隐私政策</a>
    <a href="/terms/">使用条款</a>
    <a href="/open-source/">源码许可</a>
    <a href={sourceRepositoryUrl}>本版源码</a>
  </footer>
);

const Privacy = () => (
  <div>
    <p class={style.notice}>
      JeffPixel
      在你的浏览器内完成图片压缩、格式转换和批量命名。选取的图片及文件名始终用于本地处理。
    </p>
    <section class={style.section}>
      <h2>1. 维护者与联系</h2>
      <p>
        维护者：{legalOperator}。隐私问题和服务反馈请通过
        <a href={contactUrl}>项目反馈页面</a>
        联系。公开反馈时请避免提交私人照片、定位或其他敏感信息。
      </p>
    </section>
    <section class={style.section}>
      <h2>2. 图片和文件名</h2>
      <p>
        图片在设备内解码、缩放、编码并打包下载。应用的处理流程没有上传接口。压缩导出会移除照片元信息，请保留原始文件。
      </p>
      <p>
        文件名只用于本地预览和下载；命名设置在当前页面会话中使用。关闭页面后，浏览器会释放处理数据。
      </p>
    </section>
    <section class={style.section}>
      <h2>3. 静态资源与托管日志</h2>
      <p>
        Cloudflare 提供网页、脚本、WebAssembly 和图标的托管与 HTTPS
        服务。访问这些资源时，托管商可能为提供服务、安全防护和故障排查处理 IP
        地址、访问时间、请求路径及响应状态，保存方式遵循其服务政策。
      </p>
      <p>
        本应用没有接入访问统计脚本、广告
        SDK、用户账户或图片云端存储。图片处理无需第三方网络接口。
      </p>
    </section>
    <section class={style.section}>
      <h2>4. 浏览器缓存与离线使用</h2>
      <p>
        Service Worker
        和浏览器缓存用于保存应用资源。资源完整缓存后可离线处理图片。你可通过浏览器的站点设置清理缓存及站点数据。
      </p>
    </section>
    <section class={style.section}>
      <h2>5. 更新与反馈</h2>
      <p>
        服务或数据处理方式变化时，本页会同步更新。你可以通过项目反馈页面提出隐私请求，并查看公开源码核验处理流程。
      </p>
    </section>
  </div>
);

const Terms = () => (
  <div>
    <p class={style.notice}>
      JeffPixel
      是个人维护的浏览器本地图片工具，提供批量压缩、格式转换、尺寸调整与下载命名。
    </p>
    <section class={style.section}>
      <h2>1. 图片与输出</h2>
      <p>
        你保留对自己图片的权利，并应确保有权处理相关内容。请保留原文件，下载后核对画质、方向、尺寸与命名；压缩结果中的照片元信息会被移除。
      </p>
    </section>
    <section class={style.section}>
      <h2>2. 开源软件与品牌</h2>
      <p>
        本工具派生自 VeryPixel 和
        GoogleChromeLabs/Squoosh。原始代码、修改及第三方组件按各自许可证提供，完整文本和对应源码见
        <a href="/open-source/">源码与许可声明</a>。JeffPixel
        使用独立名称与自制图标，上游名称用于说明来源。
      </p>
    </section>
    <section class={style.section}>
      <h2>3. 可用性与责任</h2>
      <p>
        服务按“现状”提供；浏览器、设备资源和格式兼容性会影响处理能力。维护者依适用法律承担责任，软件许可中的免责条款保持适用。
      </p>
    </section>
    <section class={style.section}>
      <h2>4. 联系与变更</h2>
      <p>
        维护者可因安全、合规及功能改进调整服务。问题与建议请提交到
        <a href={contactUrl}>项目反馈页面</a>。
      </p>
    </section>
  </div>
);

const OpenSource = () => (
  <div>
    <p class={style.notice}>
      JeffPixel 是 VeryPixel 的独立衍生版本，保留其 Squoosh
      来源、版权及混合许可证，新增代码采用 AGPL-3.0-only。
    </p>
    <section class={style.section}>
      <h2>当前运行版本的对应源码</h2>
      <p>
        <a href={sourceVersionUrl}>免费获取当前版本对应源码</a> ·{' '}
        <a href={sourceRepositoryUrl}>公开源码仓库</a> ·{' '}
        <a href="/licenses/MODIFICATIONS.txt">完整修改说明</a>
      </p>
      <p>
        源码仓库包含本版本的源代码、构建脚本、部署配置、依赖锁文件及测试。获取源码无需注册或付费。
      </p>
      <p>
        本版改动：默认保留原文件名；新增前后缀、统一名称加序号、文字替换及导出名预览；统一单张与
        ZIP
        命名及重名处理；更换独立品牌与图标；移除上游统计接入。图像编解码器及元信息处理逻辑沿用上游。
      </p>
      <p>
        <a href="/licenses/JeffPixel-License.txt">JeffPixel 新增内容许可</a> ·{' '}
        <a href="/licenses/JeffPixel-NOTICE.txt">JeffPixel 归属声明</a> ·{' '}
        <a href="/licenses/AGPL-3.0.txt">GNU AGPL 3.0 全文</a>
      </p>
    </section>
    <section class={style.section}>
      <h2>VeryPixel 新增代码与修改</h2>
      <p>
        上游仓库：
        <a href="https://github.com/very-jack/VeryPixel">very-jack/VeryPixel</a>
        。Copyright 2026 阿杰 and VeryPixel contributors。
      </p>
      <p>
        阿杰及 VeryPixel 贡献者拥有版权的新增代码和可版权修改采用 GNU Affero
        General Public License
        3.0（AGPL-3.0-only）。修改后通过网络向用户提供服务时，须按许可证提供对应源码。
      </p>
      <p>
        <a href="/licenses/VeryPixel-License.txt">上游混合许可证适用范围</a> ·{' '}
        <a href="/licenses/VeryPixel-NOTICE.txt">原始归属声明</a>
      </p>
    </section>
    <section class={style.section}>
      <h2>Squoosh 上游代码</h2>
      <p>
        上游项目：
        <a href="https://github.com/GoogleChromeLabs/squoosh">
          GoogleChromeLabs/Squoosh
        </a>
        。Copyright 2020 Google Inc.；源自该项目的代码继续遵循 Apache License
        2.0。
      </p>
      <p>
        <a href="/licenses/Apache-2.0.txt">Apache License 2.0 全文</a>
      </p>
    </section>
    <section class={style.section}>
      <h2>随产品分发的第三方组件</h2>
      <ul>
        <li>
          MozJPEG / libjpeg-turbo — IJG、BSD 与 zlib 类许可证；
          <a href="/licenses/mozjpeg.txt">许可文本</a>
        </li>
        <li>
          OxiPNG — MIT；<a href="/licenses/oxipng.txt">许可文本</a>
        </li>
        <li>
          WebP — BSD 3-Clause；<a href="/licenses/webp.txt">许可文本</a>
        </li>
        <li>
          Piston resize — MIT；<a href="/licenses/resize.txt">许可文本</a>
        </li>
        <li>
          Preact — MIT；<a href="/licenses/preact.txt">许可文本</a>
        </li>
        <li>
          linkstate — MIT；<a href="/licenses/linkstate.txt">许可文本</a>
        </li>
        <li>
          fflate — MIT；<a href="/licenses/fflate.txt">许可文本</a>
        </li>
        <li>
          Comlink — Apache-2.0；<a href="/licenses/comlink.txt">许可文本</a>
        </li>
        <li>
          file-drop-element — Apache-2.0；
          <a href="/licenses/file-drop-element.txt">许可文本</a>
        </li>
        <li>
          idb-keyval — Apache-2.0；
          <a href="/licenses/idb-keyval.txt">许可文本</a>
        </li>
        <li>
          pointer-tracker — Apache-2.0；
          <a href="/licenses/pointer-tracker.txt">许可文本</a>
        </li>
        <li>
          wasm-feature-detect — Apache-2.0；
          <a href="/licenses/wasm-feature-detect.txt">许可文本</a>
        </li>
      </ul>
      <p>
        This software is based in part on the work of the Independent JPEG
        Group.
      </p>
      <p>完整源代码中的其他组件许可和版权声明随仓库保留。</p>
    </section>
    <section class={style.section}>
      <h2>独立品牌与来源说明</h2>
      <p>
        JeffPixel 的名称与图标为本衍生版本独立创建。VeryPixel 名称、Logo
        与品牌资产由其权利人保留；本版本以来源归属说明的方式提及其名称，线上资源使用
        JeffPixel 自制图标。
      </p>
      <p>
        VeryPixel、阿杰、Google、Chrome 和 Squoosh
        的名称及标识归各自权利人所有。JeffPixel 由 Rayme 独立维护。
      </p>
    </section>
  </div>
);

const LegalPage: FunctionalComponent<{ kind: LegalKind }> = ({ kind }) => (
  <html lang="zh-CN">
    <head>
      <meta charSet="utf-8" />
      <title>
        {titles[kind]} — {brandName}
      </title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index,follow" />
      <style
        dangerouslySetInnerHTML={{ __html: escapeStyleScriptContent(css) }}
      />
    </head>
    <body>
      <main class={style.page}>
        <nav class={style.nav}>
          <a class={style.brand} href="/">
            <img src={logo} alt="" />
            {brandName}
          </a>
          <a class={style.back} href="/">
            返回工具
          </a>
        </nav>
        <article class={style.article}>
          <div class={style.eyebrow}>LEGAL · JEFFPIXEL</div>
          <h1>{titles[kind]}</h1>
          <p class={style.updated}>最后更新：2026 年 10 月 30 日</p>
          {kind === 'privacy' ? (
            <Privacy />
          ) : kind === 'terms' ? (
            <Terms />
          ) : (
            <OpenSource />
          )}
        </article>
        <Footer />
      </main>
    </body>
  </html>
);
export default LegalPage;
