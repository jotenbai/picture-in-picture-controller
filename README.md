# 画中画控制器 (PiP Controller)

边跟教程边在自己用的软件里操作时，视频常常要暂停——却得先切到浏览器按暂停，再切回来，连贯性就被打断。**全局快捷键**可在后台控制画中画与播放（暂停、快进等），无需离开当前窗口。支持 YouTube、bilibili。

[English](#english)

---

## 功能

- 用**全局快捷键**在后台控制画中画：弹出 / 关闭、暂停 / 播放、快进 / 快退
- 支持 **YouTube**、**bilibili**（`youtube.com`、`bilibili.com`）
- 切换窗口后仍可控制后台标签页里的视频（需将快捷键设为「全局」）
- 扩展弹窗：中 / 日 / 英界面，可自定义快进、快退秒数（1–120 秒，默认 5 秒）

## 默认快捷键

| 按键 | 功能 |
|------|------|
| `Alt+W` | 切换画中画 |
| `Alt+A` | 快退 |
| `Alt+S` | 暂停 / 播放 |
| `Alt+D` | 快进 |

> **说明：** Chrome 默认占用 `Alt+D`（聚焦地址栏），「快进」在快捷键页可能显示为「未设置」，需点铅笔图标手动绑定。  
> 扩展**不能**在代码里把快捷键默认设为「全局」，请在 [`chrome://extensions/shortcuts`](chrome://extensions/shortcuts) 中将四条命令的生效范围改为 **全局**。

## 安装

### 从源码安装（推荐）

1. 克隆或下载本仓库  
   `git clone https://github.com/jotenbai/picture-in-picture-controller.git`
2. 打开 Chrome（或 Edge 等 Chromium 浏览器）→ `chrome://extensions`
3. 开启右上角 **开发者模式**
4. 点击 **加载已解压的扩展程序**，选择本项目文件夹（含 `manifest.json` 的目录）
5. 按下方 [首次设置](#首次设置) 配置快捷键

### Chrome 网上应用店

尚未上架。上架后会在本 README 补充商店链接。

### 关于 `.crx` 打包

可在 `chrome://extensions` 的开发者模式下「打包扩展程序」生成 `.crx`，但 Chrome 已限制普通用户从外部安装 CRX。日常使用请用 **加载已解压的扩展程序**；公开发布请通过 Chrome Web Store。

## 首次设置

1. 打开 [`chrome://extensions/shortcuts`](chrome://extensions/shortcuts)
2. 找到 **画中画控制器**，将四个命令的生效范围改为 **全局**
3. 若「快进」为未设置，手动绑定 `Alt+D`（或自选组合键）
4. 在 YouTube 或 bilibili 打开视频页，保持该标签存在
5. 切换到游戏或其他应用，即可用快捷键后台控制

点击扩展图标可打开弹窗，查看说明、切换语言、修改快进 / 快退秒数。

## 项目结构

```
├── manifest.json          # 扩展配置
├── background.js          # 快捷键与标签页调度
├── popup.html / popup.js  # 弹窗界面
├── popup-i18n.js          # 弹窗文案（中 / 日 / 英）
└── content/
    ├── bridge.js          # 快进 / 快退 / 播放（后台标签）
    └── pip-toggle.js      # 画中画切换（按需注入）
```

## 权限说明

- `scripting`、`tabs`、`storage`：向视频页注入脚本、记住媒体标签、保存用户设置
- 主机权限：仅 `*.youtube.com`、`*.bilibili.com`

## 参与与反馈

欢迎通过 [Issues](https://github.com/jotenbai/picture-in-picture-controller/issues) 反馈问题或建议。

## 许可证

[MIT](LICENSE)

---

## English

Following a tutorial while you work in another app? You often need to pause—but that means switching to the browser, pressing pause, switching back. **PiP Controller** uses global hotkeys to control Picture-in-Picture and playback on **YouTube** and **Bilibili** from whatever window you're in, so you don't break your flow.

### Default shortcuts

| Key | Action |
|-----|--------|
| `Alt+W` | Toggle PiP |
| `Alt+A` | Seek backward |
| `Alt+S` | Pause / play |
| `Alt+D` | Seek forward |

Set all four commands to **Global** at [`chrome://extensions/shortcuts`](chrome://extensions/shortcuts). Chrome reserves `Alt+D` for the address bar—you may need to bind “Seek forward” manually.

### Install from source

1. Clone this repo  
2. Open `chrome://extensions` → enable **Developer mode**  
3. **Load unpacked** → select the project folder  
4. Configure shortcuts as above  

Chrome Web Store listing: **coming later**.

### Popup

Popup UI in Chinese, Japanese, and English; configurable seek step (1–120 seconds, default 5).
