# 隐私政策 / Privacy Policy

**画中画控制器 (PiP Controller)**  
最后更新：2026-05-16

本政策说明本 Chrome 扩展如何处理信息。扩展由个人开发者通过 GitHub 开源发布：  
https://github.com/jotenbai/picture-in-picture-controller

---

## 单一用途

本扩展的唯一用途是：在 **YouTube** 与 **bilibili** 的视频页上，通过用户配置的键盘快捷键（需在 `chrome://extensions/shortcuts` 中设为「全局」）控制**画中画**（打开/关闭）与**视频播放**（暂停/播放、快进/快退），使用户在切换到其他应用后仍可在后台操作视频，无需将浏览器窗口切到前台。

---

## 我们收集哪些数据？

**扩展不向开发者运营的服务器上传、出售或共享您的个人数据。**

仅在您的浏览器内使用 Chrome 存储 API 保存以下信息：

| 数据 | 存储方式 | 用途 |
|------|----------|------|
| 界面语言（中/日/英） | `chrome.storage.sync` | 恢复弹窗语言选择 |
| 快进/快退秒数 | `chrome.storage.sync` | 恢复您的快捷键步长设置 |
| 最近使用的媒体标签页 ID | `chrome.storage.session` | 在您使用快捷键时，将命令发送到正确的 YouTube/bilibili 标签（关闭浏览器后清除） |

`chrome.storage.sync` 可能按 Chrome 的机制同步到您登录的 Google 账号，由 **Google** 提供基础设施；扩展本身不访问 Google 账号密码或其他账号信息。

扩展**不**收集：姓名、邮箱、精确位置、浏览历史数据库、支付信息或用于广告的用户画像。

---

## 远程代码

本扩展**不使用**远程托管代码。所有 JavaScript 均打包在安装包内；仅在用户操作（如按下快捷键）时向 YouTube/bilibili 页面注入本地文件 `content/bridge.js`、`content/pip-toggle.js`。

---

## 权限说明

| 权限 | 原因 |
|------|------|
| `host_permissions`（`*.youtube.com`、`*.bilibili.com`） | 仅在上述网站运行内容脚本，控制页面内视频与画中画 |
| `scripting` | 在需要时注入扩展自带脚本 |
| `tabs` | 识别正在播放视频的标签页并向其发送控制命令（不用于与视频控制无关的用途） |
| `storage` | 保存上表中的用户设置与会话状态 |

---

## 与第三方网站的关系

使用本扩展时，您仍会访问 **YouTube**、**bilibili**，这些网站适用其各自的隐私政策与服务条款。本扩展不修改上述网站以外的页面。

---

## 数据保留与删除

- 卸载扩展后，由扩展写入的 `storage` 数据将随扩展移除而不再更新；`sync` 中已同步的数据可能仍保留在您的 Google 账号中，直至您在 Chrome 中清除扩展数据或相关同步数据。
- 您可随时在扩展弹窗中修改语言与秒数设置。

---

## 儿童

本扩展不面向 13 岁以下儿童，也不会故意收集儿童个人信息。

---

## 政策变更

我们可能更新本政策；重大变更会在 GitHub 仓库中更新本文件。继续在 Chrome 网上应用店使用本扩展即表示您接受更新后的政策。

---

## 联系我们

问题或隐私相关咨询，请通过 GitHub Issues 联系：  
https://github.com/jotenbai/picture-in-picture-controller/issues

---

## English (summary)

**PiP Controller** does not send your personal data to the developer’s servers. It only stores UI language and seek-step preferences in `chrome.storage.sync`, and the last media tab id in `chrome.storage.session`, to provide keyboard control of Picture-in-Picture and playback on **YouTube** and **bilibili**. No remotely hosted code is used. For questions, use the GitHub Issues link above.
