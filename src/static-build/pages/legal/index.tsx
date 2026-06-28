import { h, FunctionalComponent } from 'preact';
import logo from 'url:static-build/assets/verypixel-logo.webp';
import css from 'css:./style.css';
import * as style from './style.css';
import {
  escapeStyleScriptContent,
  legalOperator,
  privacyEmail,
  sourceRepositoryUrl,
} from 'static-build/utils';

export type LegalKind = 'privacy' | 'terms' | 'open-source';

const titles: Record<LegalKind, string> = {
  privacy: '隐私政策',
  terms: '使用条款',
  'open-source': '源码与许可声明',
};

const Footer = () => (
  <footer class={style.footer}>
    <span>© 2026 VeryPixel</span>
    <a href="/privacy/">隐私政策</a>
    <a href="/terms/">使用条款</a>
    <a href="/open-source/">源码许可</a>
    <a href="https://github.com/very-jack/VeryPixel">GitHub</a>
    <a href="https://veryjack.com">VeryJack 博客</a>
  </footer>
);

const Privacy = () => (
  <div>
    <p class={style.notice}>
      VeryPixel
      的图片压缩在用户浏览器内完成。应用本身不会将用户选择的图片上传到运营者服务器。
    </p>
    <section class={style.section}>
      <h2>1. 运营者与联系信息</h2>
      <p class={style.meta}>
        个人运营者：{legalOperator}
        <br />
        隐私联系邮箱：<a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>
      </p>
      <p>
        如需行使隐私权利、反馈个人信息处理问题或提出相关咨询，请通过上述邮箱联系我们。
      </p>
    </section>
    <section class={style.section}>
      <h2>2. 我们处理的信息</h2>
      <ul>
        <li>
          <strong>图片文件：</strong>
          仅在用户设备的浏览器内解码、缩放和压缩，不由应用上传或保存。
        </li>
        <li>
          <strong>基础访问日志与网站统计：</strong>托管服务商、服务器及自托管的
          Umami 统计服务可能为安全、故障排查和访问统计处理 IP
          地址、浏览器类型、访问时间、来源页面、请求路径及响应状态。
        </li>
        <li>
          <strong>本地缓存：</strong>浏览器可能使用缓存、Service Worker
          或本地存储保存应用资源和偏好；用户可通过浏览器设置清除。
        </li>
      </ul>
    </section>
    <section class={style.section}>
      <h2>3. 处理目的与保存期限</h2>
      <p>
        访问日志仅用于提供服务、保障安全、防止滥用和排查故障，并应按最短必要期限保存。运营者应根据实际服务器配置在上线前明确具体期限。
      </p>
    </section>
    <section class={style.section}>
      <h2>4. 广告、Cookie 与第三方服务</h2>
      <p>
        本站使用部署于 umami.veryjack.com 的 Umami
        进行基础访问统计，以了解页面访问量和改进服务。该统计服务不接收或处理用户选择的图片文件。当前版本未接入广告
        SDK
        或个性化推荐。未来接入广告前，运营者必须在本政策中列明广告服务商、收集字段、用途、保存期限、跨境情况和退出方式；在适用法律要求时，应在加载非必要
        Cookie 或个性化广告前取得有效同意。
      </p>
      <p>
        广告服务商可能独立处理 IP
        地址、设备标识符、Cookie、广告互动和大致位置。广告服务商不会因使用
        VeryPixel 而自动获得图片文件；运营者也不得主动向其传输用户图片。
      </p>
    </section>
    <section class={style.section}>
      <h2>5. 共享、委托处理与跨境传输</h2>
      <p>
        除托管、安全和未来明确披露的广告服务商外，我们不会出售用户图片或个人信息。新增服务商前，应完成供应商审查、签署数据处理条款，并按适用法律处理跨境传输。
      </p>
    </section>
    <section class={style.section}>
      <h2>6. 用户权利</h2>
      <p>
        用户可通过上述邮箱请求查询、更正、删除、撤回同意或注销相关信息。由于图片不上传，运营者通常无法访问或恢复用户图片。用户也可在浏览器中清除本站缓存与
        Cookie。
      </p>
    </section>
    <section class={style.section}>
      <h2>7. 未成年人</h2>
      <p>
        本服务不以未满 14
        周岁的儿童为主要对象。若运营者知悉在缺少监护人同意的情况下处理了儿童个人信息，应及时删除。
      </p>
    </section>
    <section class={style.section}>
      <h2>8. 安全与政策更新</h2>
      <p>
        我们采取合理措施保护服务，但互联网环境不存在绝对安全。重大处理方式变化时，我们将更新本政策；需要重新同意的，将在变更生效前征求同意。
      </p>
    </section>
  </div>
);

const Terms = () => (
  <div>
    <p class={style.notice}>
      使用 VeryPixel 即表示你同意本条款。若不同意，请停止使用本服务。
    </p>
    <section class={style.section}>
      <h2>1. 服务说明</h2>
      <p>
        VeryPixel
        提供浏览器内图片压缩、格式转换和尺寸调整工具。处理通常在本地完成，但浏览器、设备和格式兼容性可能影响结果。
      </p>
    </section>
    <section class={style.section}>
      <h2>2. 用户内容与责任</h2>
      <p>
        用户保留其图片的权利，并保证有权处理相关图片。不得利用本服务处理或传播侵权、违法、有害、恶意或侵犯他人隐私的内容。
      </p>
    </section>
    <section class={style.section}>
      <h2>3. 知识产权</h2>
      <p>
        VeryPixel 的原创界面、品牌和新增代码受适用法律保护；源自 Squoosh
        和第三方组件的部分依各自软件许可证提供，详见
        <a href="/open-source/">源码与许可声明</a>。本项目与 Google 或 Squoosh
        原项目维护者不存在赞助、背书或隶属关系。
      </p>
    </section>
    <section class={style.section}>
      <h2>4. 广告与第三方链接</h2>
      <p>
        服务未来可能展示明确标识的广告。广告内容和第三方网站由相应提供者负责；运营者仍将依法履行广告审核和显著标识义务。
      </p>
    </section>
    <section class={style.section}>
      <h2>5. 免责声明</h2>
      <p>
        服务按“现状”提供，不保证永久可用、完全无错误或适合特定目的。请在删除原文件前自行核对输出质量并保留备份。在法律允许范围内，运营者不对间接损失、数据丢失或第三方行为承担超出法定范围的责任。
      </p>
    </section>
    <section class={style.section}>
      <h2>6. 变更与终止</h2>
      <p>
        我们可为安全、合规或产品改进调整服务和条款。重大变更将以合理方式通知。用户违反条款或法律时，我们可限制其访问。
      </p>
    </section>
    <section class={style.section}>
      <h2>7. 联系与争议处理</h2>
      <p>
        如对本条款或服务有任何疑问，请先通过以下方式联系我们。双方应尽力通过友好协商解决争议；协商不成的，依适用法律处理。
      </p>
      <p class={style.meta}>
        个人运营者：{legalOperator}
        <br />
        联系邮箱：<a href={`mailto:${privacyEmail}`}>{privacyEmail}</a>
      </p>
    </section>
  </div>
);

const OpenSource = () => (
  <div>
    <p class={style.notice}>
      VeryPixel 是基于 GoogleChromeLabs/Squoosh
      修改的独立开源项目。不同部分适用不同许可证；使用、修改、分发或部署前，请阅读本页及完整许可文本。
    </p>
    <section class={style.section}>
      <h2>VeryPixel 新增代码与修改</h2>
      <p>
        阿杰及 VeryPixel 贡献者拥有版权的新增代码和可版权修改采用 GNU Affero
        General Public License
        3.0（AGPL-3.0-only）。该许可证允许商业使用，但修改后通过网络向用户提供服务时，必须按许可证向这些用户提供对应源码。
      </p>
      <p>
        {sourceRepositoryUrl && (
          <span>
            <a href={sourceRepositoryUrl}>查看当前版本对应源码</a> ·{' '}
          </span>
        )}
        <a href="/licenses/VeryPixel-License.txt">查看适用范围</a> ·{' '}
        <a href="/licenses/AGPL-3.0.txt">查看 AGPL 3.0 全文</a>
      </p>
    </section>
    <section class={style.section}>
      <h2>Squoosh 上游代码</h2>
      <p>
        上游项目：
        <a href="https://github.com/GoogleChromeLabs/squoosh">
          GoogleChromeLabs/squoosh
        </a>
        <br />
        许可证：Apache License 2.0
        <br />
        主要修改：品牌与界面重构、批量处理、统一压缩参数、等比边界缩放、输出格式精简及下载命名。
      </p>
      <p>
        <a href="/licenses/Apache-2.0.txt">查看 Apache License 2.0 全文</a> ·{' '}
        <a href="/licenses/VeryPixel-NOTICE.txt">归属声明</a> ·{' '}
        <a href="/licenses/MODIFICATIONS.txt">修改说明</a>
      </p>
    </section>
    <section class={style.section}>
      <h2>随产品分发的第三方组件</h2>
      <ul>
        <li>
          MozJPEG / libjpeg-turbo — IJG、BSD 与 zlib 类许可证；
          <a href="/licenses/mozjpeg.txt">查看许可文本</a>
        </li>
        <li>
          OxiPNG — MIT；<a href="/licenses/oxipng.txt">查看许可文本</a>
        </li>
        <li>
          WebP — BSD 3-Clause；<a href="/licenses/webp.txt">查看许可文本</a>
        </li>
        <li>
          Piston resize — MIT；<a href="/licenses/resize.txt">查看许可文本</a>
        </li>
        <li>
          Preact — MIT；<a href="/licenses/preact.txt">查看许可文本</a>
        </li>
        <li>
          linkstate — MIT；<a href="/licenses/linkstate.txt">查看许可文本</a>
        </li>
        <li>
          fflate — MIT，用于在浏览器内生成批量下载 ZIP；
          <a href="/licenses/fflate.txt">查看许可文本</a>
        </li>
        <li>
          Comlink、file-drop-element、idb-keyval、pointer-tracker 与
          wasm-feature-detect — Apache License 2.0。
        </li>
        <li>完整源代码仓库中的其他许可证文件应随源代码保留。</li>
      </ul>
      <p>
        This software is based in part on the work of the Independent JPEG
        Group.
      </p>
    </section>
    <section class={style.section}>
      <h2>名称与品牌声明</h2>
      <p>
        “Google”“Chrome”“Squoosh”及相关标识属于其各自权利人。VeryPixel
        仅为说明软件来源而提及上游名称，不表示任何官方合作、认可或背书。
      </p>
      <p>
        VeryPixel 名称、Logo 与品牌资产不包含在软件开源授权中。Fork
        或衍生服务必须使用自己的名称与品牌，不得暗示获得 VeryPixel
        或阿杰的官方认可。
      </p>
    </section>
  </div>
);

const LegalPage: FunctionalComponent<{ kind: LegalKind }> = ({ kind }) => (
  <html lang="zh-CN">
    <head>
      <meta charSet="utf-8" />
      <title>{titles[kind]} — VeryPixel</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index,follow" />
      <script
        defer
        src="https://umami.veryjack.com/script.js"
        data-website-id="1f8a1944-ed9d-4ba9-9533-974bada58a47"
      />
      <style
        dangerouslySetInnerHTML={{ __html: escapeStyleScriptContent(css) }}
      />
    </head>
    <body>
      <main class={style.page}>
        <nav class={style.nav}>
          <a class={style.brand} href="/">
            <img src={logo} alt="" />
            VeryPixel
          </a>
          <a class={style.back} href="/">
            返回工具
          </a>
        </nav>
        <article class={style.article}>
          <div class={style.eyebrow}>LEGAL · VERYPIXEL</div>
          <h1>{titles[kind]}</h1>
          <p class={style.updated}>最后更新：2026 年 6 月 21 日</p>
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
