# VeryPixel 上线与广告合规清单

> 本清单用于降低常见风险，不构成针对特定运营主体或司法辖区的法律意见。正式上线、投放广告或处理用户账户前，应由当地律师结合主体注册地、服务器所在地和目标用户复核。

## 1. 源码与软件许可

- Squoosh 上游代码采用 Apache License 2.0，允许修改、商业使用、广告变现和分发。
- VeryPixel 新增代码与可版权修改采用 AGPL-3.0-only。修改后通过网络向用户提供服务时，必须按 AGPL 向这些用户提供对应源码。
- 必须保留根目录 `LICENSE`、`LICENSES/`、`NOTICE`、原代码中的版权/许可声明，并对修改文件作出修改说明。
- `VeryPixel` 名称、Logo 与品牌资产不包含在软件许可中；Fork 和衍生服务必须更换品牌，不得暗示官方背书。
- 不得使用 Google、Chrome、Squoosh 或第三方项目名称暗示官方背书。
- 部署产物必须包含 `/open-source/` 及 `/licenses/` 下的许可文本。
- VeryPixel 已从源码仓库和生产构建移除未使用的 GPL `imagequant.wasm`、Browser GIF、浏览器 JPEG/PNG 导出选项、额外编解码器和 HQX，以缩小仓库体积与第三方许可范围。

## 2. 上线前必须填写

构建时设置真实信息：

```bash
LEGAL_ENTITY="运营主体完整法定名称" \
PRIVACY_EMAIL="privacy@example.com" \
SITE_ORIGIN="https://example.com" \
SOURCE_REPOSITORY_URL="https://github.com/very-jack/VeryPixel" \
npm run build
```

不得带着占位信息上线；`SOURCE_REPOSITORY_URL` 必须指向与线上运行版本对应、用户无需付费即可获取的源码。

## 3. 中国大陆运营

- 使用中国大陆服务器提供网站服务时，通常需要完成 ICP 备案；是否还需经营性 ICP 许可，应结合运营模式、收费方式和当地通信管理部门口径确认。
- 根据实际情况评估公安联网备案、网络安全等级保护及日志留存要求。
- 遵守《个人信息保护法》《网络安全法》《数据安全法》及配套规定，坚持最小必要、明确告知、权限控制和安全保障。
- 广告应显著标识为“广告”，不得虚假或误导；医疗、药品、保健食品、金融、教育等高风险行业广告需额外审查资质和内容。
- 弹窗广告应提供显著、可操作的关闭方式；不得欺骗或诱导点击。
- 面向未成年人时应进行额外评估，不得利用未成年人个人信息进行不当商业营销。

## 4. 广告接入前的硬门槛

- 当前代码接入自托管 Umami 基础访问统计，但未接入广告。接入广告前必须更新隐私政策，写明广告平台名称、数据字段、目的、保存期限、共享和跨境情况。
- 对非必要 Cookie、设备标识符、个性化广告或跨站追踪，在适用地区应先展示同意管理界面，并允许拒绝和撤回。
- 与广告平台、托管商、CDN 和安全服务商签署或接受合适的数据处理条款。
- 若使用 Google AdSense 面向欧洲经济区、英国或瑞士用户，应按 Google 当时政策使用其认可的同意管理平台，并启用符合要求的同意信号。
- 不得把用户上传的图片、图片内容特征或文件名发送给广告平台。

## 5. 全球用户

- 面向欧盟/英国用户时，评估 GDPR、ePrivacy 规则、合法处理基础、Cookie 同意、数据主体权利和跨境传输机制。
- 面向美国各州用户时，评估 CCPA/CPRA 等州隐私法及“出售/共享”退出机制。
- 如不准备承担多地区合规成本，可在上线初期限制目标市场和广告投放地区，但仍应核实这种限制是否有效。

## 6. 技术与运营

- 保持图片纯本地处理；不要在服务器、错误监控、分析或广告事件中发送图片二进制、文件名或可推断图片内容的数据。
- 明确服务器访问日志的字段与保存期限，并限制访问权限。
- 启用 HTTPS、COOP/COEP、安全响应头、依赖更新、漏洞修复和备份。
- 建立隐私请求、侵权投诉、广告投诉和安全事件响应渠道。
- 发布前检查域名和 “VeryPixel” 商标是否与目标市场现有权利冲突。

## 7. 主要核对来源

- Squoosh 源码与许可证：https://github.com/GoogleChromeLabs/squoosh
- Apache License 2.0：https://www.apache.org/licenses/LICENSE-2.0
- GNU AGPL 3.0：https://www.gnu.org/licenses/agpl-3.0.html
- 中国国家法律法规数据库：https://flk.npc.gov.cn/
- 国家市场监督管理总局：https://www.samr.gov.cn/
- 工业和信息化部 ICP/IP 地址/域名备案系统：https://beian.miit.gov.cn/
- 欧盟 GDPR 正文：https://eur-lex.europa.eu/eli/reg/2016/679/oj
- California CCPA：https://oag.ca.gov/privacy/ccpa
