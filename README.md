<!-- Modified by JeffPixel on 2026-10-30. Original attribution is retained below and in NOTICE. -->
<p align="center"><img src="./src/static-build/assets/jeffpixel-logo.png" width="96" alt="JeffPixel 自制图标"></p>
<h1 align="center">JeffPixel</h1>
<p align="center">浏览器本地图片压缩、格式转换与自定义批量命名。</p>

在线工具：https://pixel.jefftay.com · 源码：https://github.com/Rayme/JeffPixel

JeffPixel 是 [very-jack/VeryPixel](https://github.com/very-jack/VeryPixel) 的独立衍生版本，沿用其基于 [GoogleChromeLabs/Squoosh](https://github.com/GoogleChromeLabs/squoosh) 的本地压缩链路。上游 VeryPixel 由阿杰维护，相关版权、许可证和贡献记录完整保留。

## 功能

- 批量导入，统一应用 JPEG、PNG 或 WebP 格式、质量与等比缩放参数。
- 使用 Squoosh 的 MozJPEG、OxiPNG、WebP 编码器，支持原图与结果对比。
- 默认保持原文件名；输出扩展名跟随编码格式。
- 可选前后缀、统一名称与序号、区分大小写的文字查找替换。
- 导出名实时预览，单张下载与 ZIP 使用同一套名称，自动处理重名和非法字符。
- 修改命名复用已编码的图片字节，无需重新压缩。
- 全程浏览器本地处理，资源完整缓存后支持离线使用。
- 沿用上游的元信息移除行为；请保留原始照片。

本版本移除了上游 Umami 接入，没有添加统计或广告脚本。

## 开发与测试

使用 Node.js 22（具体基线见 `.nvmrc`）：

```bash
git clone https://github.com/Rayme/JeffPixel.git
cd JeffPixel
npm ci --ignore-scripts
npm test
npm run dev
```

开发地址为 `http://localhost:5000`。依赖已有编解码 WASM，无需本地重编译 C++/Rust 编码器。

## 生产构建与 Cloudflare 部署

```bash
npm run build:prod
npm run check:compliance
npm run deploy:check
npm run preview
```

产物位于 `build/`。`wrangler.jsonc` 配置静态资源与 `pixel.jefftay.com` 自定义域名，`_headers` 提供 COOP/COEP 等响应头。部署到其他账户时，先更换 `account_id`、域名、仓库与维护者资料。

正式发布先提交并公开推送源码，再用该提交重新构建。`build:prod` 将 Git 提交号写入公开源码链接和 `version.json`。发布前执行：

```bash
npm run check:publish
npm run deploy
```

`check:publish` 校验工作区干净、GitHub 仓库公开且为上游 Fork、线上对应提交可访问、构建与当前提交一致。凭据使用 Wrangler OAuth 或本地受保护环境变量，勿提交到仓库。

静态托管只分发应用资源；图片编码、命名及 ZIP 都在访问者设备内完成。

## 来源与许可证

- Squoosh 派生部分继续遵循 Apache License 2.0。
- 阿杰及 VeryPixel 贡献者拥有版权的新增代码与可版权修改继续遵循 AGPL-3.0-only。
- JeffPixel 新增代码、修改、测试、文档及自制图标采用 AGPL-3.0-only，见 `FORK_LICENSE`。
- 第三方编解码器与库继续遵循各自许可证。

保留原始 `LICENSE`、`NOTICE`、`LICENSES/` 和各组件许可。`FORK_NOTICE` 补充 JeffPixel 的归属，`MODIFICATIONS.md` 保留上游历史并记录本次逐项改动。线上 `/open-source/` 和 `/licenses/` 提供完整文本与对应源码入口。

VeryPixel 名称、Logo 和品牌资产由其权利人保留。JeffPixel 使用自制名称和图标；上游名称用于来源归属。VeryPixel 的原图标已从当前文件树和线上产物移除，继承的 Git 历史保留原始记录。

This software is based in part on the work of the Independent JPEG Group.

## 目录

```text
src/                  界面、Worker、Service Worker 和静态页面
codecs/               上游编解码组件与各自许可证
lib/                  上游构建辅助脚本
test/                 命名回归、构建合规及发布校验
test-fixtures/        上游合成测试图片
LICENSE / LICENSES/   原始混合许可与完整文本
NOTICE                原始来源声明（原文保留）
FORK_LICENSE          JeffPixel 新增内容许可
FORK_NOTICE           JeffPixel 来源声明
MODIFICATIONS.md      上游及本版本修改记录
wrangler.jsonc        Cloudflare 静态托管配置
```
