<p align="center">
  <img src="./src/static-build/assets/verypixel-logo.webp" width="112" alt="VeryPixel logo">
</p>

<h1 align="center">VeryPixel</h1>

<p align="center">
  一款在浏览器本地运行的批量图片压缩与格式转换工具。
</p>

<p align="center">
  <a href="https://pixel.veryjack.com">在线使用</a>
  ·
  <a href="https://pixel.veryjack.com/privacy/">隐私政策</a>
  ·
  <a href="https://github.com/very-jack/VeryPixel">GitHub</a>
  ·
  <a href="https://veryjack.com">VeryJack 博客</a>
</p>

## 关于 VeryPixel

VeryPixel 基于 [GoogleChromeLabs/Squoosh](https://github.com/GoogleChromeLabs/squoosh) 二次开发，面向需要一次处理多张图片的使用场景。它使用浏览器提供的能力、Web Worker 与 WebAssembly 在本地完成解码、缩放和压缩。

用户选择的图片不会上传到 VeryPixel 服务器。项目接入的自托管 Umami 仅用于基础页面访问统计，不接收用户图片。

## 主要功能

- 批量导入图片，并统一应用输出格式、质量和尺寸参数；
- 支持 MozJPEG、WebP、Browser JPEG 和 Browser PNG；
- WebP 支持质量、Effort 与 Lossless 设置；
- 按原始比例缩小至指定宽高边界，不裁切、不拉伸、不放大；
- 原图与压缩结果实时对比；
- 单张图片直接下载，多张图片打包为 ZIP；
- 输出文件名自动添加 `_VeryPixel` 后缀；
- 完整缓存后可离线进行图片处理与下载。

## 本地开发

推荐使用 Node.js 20，具体版本见 [`.nvmrc`](./.nvmrc)。

```bash
git clone https://github.com/very-jack/VeryPixel.git
cd VeryPixel
npm ci
npm run dev
```

默认开发地址为 `http://localhost:5000`。

## 生产构建

```bash
npm ci
SITE_ORIGIN="https://pixel.veryjack.com" \
SOURCE_REPOSITORY_URL="https://github.com/very-jack/VeryPixel" \
npm run build
```

构建产物位于 `build/`。它是纯静态网站，可以部署到 Nginx、Caddy、Cloudflare Pages、GitHub Pages 或其他静态托管服务。

公开部署 AGPL 版本时，`SOURCE_REPOSITORY_URL` 应指向与线上版本对应的公开源码仓库，网站的源码许可页面会显示该链接。

`build/`、`node_modules/` 和 `.tmp/` 均为生成内容，不需要提交到 Git 仓库。部署时请上传 `build/` 内的文件，而不是整个源码仓库。

## 项目结构

```text
src/                  应用界面、Worker、Service Worker 与静态页面
codecs/               MozJPEG、WebP、Resize 等编解码组件
lib/                  构建辅助脚本
test-fixtures/        本地测试图片
NOTICE                上游项目与第三方归属声明
LICENSE / LICENSES/   混合许可证适用范围与完整文本
MODIFICATIONS.md      相对于 Squoosh 的主要修改
DEPLOYMENT_COMPLIANCE.md  部署与合规检查清单
```

## 隐私与安全

VeryPixel 的图片处理链路在用户浏览器内执行。为了方便独立核验，你可以打开浏览器开发者工具的 Network 面板，上传图片并观察网络请求；图片文件本身不会被发送到服务器。

公开部署前请阅读 [DEPLOYMENT_COMPLIANCE.md](./DEPLOYMENT_COMPLIANCE.md)，并保留网站中的隐私政策、使用条款及源码许可声明页面。

## 开源来源与许可证

VeryPixel 采用混合许可证，以尊重上游许可并要求公开部署版本回馈源码：

- 来自 [Squoosh](https://github.com/GoogleChromeLabs/squoosh) 的代码继续遵循 [Apache License 2.0](./LICENSES/Apache-2.0.txt)；
- 阿杰及 VeryPixel 贡献者拥有版权的新增代码与修改采用 [GNU AGPL 3.0](./LICENSES/AGPL-3.0.txt)；
- 第三方库与编解码器继续遵循各自许可证。

AGPL 允许包括商业用途在内的使用，但修改 VeryPixel 后通过网络向用户提供服务时，必须按照许可证向这些用户提供对应源码。完整适用范围见根目录的 [LICENSE](./LICENSE)、[NOTICE](./NOTICE) 和 [MODIFICATIONS.md](./MODIFICATIONS.md)。

`VeryPixel` 名称、Logo 与品牌资产不包含在软件开源授权中。Fork 或衍生服务必须使用自己的名称和品牌，不得暗示获得 VeryPixel 或阿杰的官方认可。

## 贡献

欢迎通过 Issue 报告问题或提出建议。提交代码前请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)，并确保 `npm run build` 能够通过。

## 作者

VeryPixel 由阿杰维护。更多关于独立开发、效率工具和技术实践的内容，欢迎访问 [VeryJack 博客](https://veryjack.com)。

VeryPixel 是独立项目，与 Google、Google Chrome 或 Squoosh 原项目维护者不存在赞助、背书或隶属关系。
