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

### 推荐：Chrome 网上应用店

在 Chrome / Edge 等 Chromium 浏览器中安装：

**[画中画控制器 (PiP Controller) — Chrome 网上应用店](https://chromewebstore.google.com/detail/%E7%94%BB%E4%B8%AD%E7%94%BB%E6%8E%A7%E5%88%B6%E5%99%A8-pip-controller/phnofgcdnmppllkfnejmjkjjdninbkha)**

安装后按下方 [首次设置](#首次设置) 配置快捷键。

### 从源码安装

1. 克隆或下载本仓库  
   `git clone https://github.com/jotenbai/picture-in-picture-controller.git`
2. 打开 `chrome://extensions`
3. 开启右上角 **开发者模式**
4. 点击 **加载已解压的扩展程序**，选择本项目文件夹（含 `manifest.json` 的目录）
5. 按 [首次设置](#首次设置) 配置快捷键

## 首次设置

1. 打开 [`chrome://extensions/shortcuts`](chrome://extensions/shortcuts)
2. 找到 **画中画控制器**，将四个命令的生效范围改为 **全局**
3. 若「快进」为未设置，手动绑定 `Alt+D`（或自选组合键）
4. 在 YouTube 或 bilibili 打开视频页，保持该标签存在
5. 切换到游戏或其他应用，即可用快捷键后台控制

点击扩展图标可打开弹窗，查看说明、切换语言、修改快进 / 快退秒数。

## 已知限制

### 画中画贴底时，再次打开可能上移

用 `Alt+W` 关闭后再打开画中画时，**横坐标与窗口大小**通常会与上次一致；若你把窗口贴在**屏幕底部**，再次打开时 **Y 轴可能整体上移**，与底边/任务栏之间留出一段空隙。贴在**屏幕顶部**时，一般不会出现此现象。

这是 **Chrome / 系统** 在重新创建视频画中画窗口时的摆放策略（底部安全边距、避免遮挡任务栏等），**不是**本扩展改动了位置。扩展**无法**读取或设置画中画窗口的坐标，因此不能实现「恢复上次贴底位置」。若需要贴底，可在再次打开后手动拖到屏幕底边；同一会话内有时会保持，但不保证每次关开都一致。

## 项目结构

```
├── manifest.json          # 扩展配置
├── background.js          # 快捷键与标签页调度
├── popup.html / popup.js  # 弹窗界面
├── popup-i18n.js          # 弹窗文案（中 / 日 / 英）
├── icons/                 # 16 / 32 / 48 / 128 图标
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

[MIT](LICENSE) · [Privacy Policy](PRIVACY.md)

---

## English

Following a tutorial while you work in another app? You often need to pause—but that means switching to the browser, pressing pause, switching back. **PiP Controller** uses global hotkeys to control Picture-in-Picture and playback on **YouTube** and **Bilibili** from whatever window you're in, so you don't break your flow.

### Features

- Control PiP and playback in the background: toggle PiP, play/pause, seek forward/back
- Works on **YouTube** and **bilibili** (`youtube.com`, `bilibili.com`)
- Keeps working after you switch to another app (shortcuts must be set to **Global**)
- Popup UI in Chinese, Japanese, and English; configurable seek step (1–120 seconds, default 5)

### Default shortcuts

| Key | Action |
|-----|--------|
| `Alt+W` | Toggle PiP |
| `Alt+A` | Seek backward |
| `Alt+S` | Pause / play |
| `Alt+D` | Seek forward |

Chrome reserves `Alt+D` for the address bar—“Seek forward” may show as unset until you bind it manually. The extension cannot default shortcuts to **Global** in code; set all four commands to **Global** at [`chrome://extensions/shortcuts`](chrome://extensions/shortcuts).

### Install

#### Recommended: Chrome Web Store

**[Picture-in-Picture Controller (PiP Controller) on the Chrome Web Store](https://chromewebstore.google.com/detail/%E7%94%BB%E4%B8%AD%E7%94%BB%E6%8E%A7%E5%88%B6%E5%99%A8-pip-controller/phnofgcdnmppllkfnejmjkjjdninbkha)**

After installing, complete [First-time setup](#first-time-setup) below.

#### From source

1. Clone this repo: `git clone https://github.com/jotenbai/picture-in-picture-controller.git`
2. Open `chrome://extensions` → enable **Developer mode**
3. **Load unpacked** → select the project folder (contains `manifest.json`)
4. Complete [First-time setup](#first-time-setup)

### First-time setup

1. Open [`chrome://extensions/shortcuts`](chrome://extensions/shortcuts)
2. Find **PiP Controller** and set all four commands to **Global**
3. If “Seek forward” is unset, bind `Alt+D` manually (or choose another shortcut)
4. Open a video on YouTube or bilibili and leave that tab open
5. Switch to another app—hotkeys should still control the video

Click the extension icon for in-popup help, language (ZH / JA / EN), and seek-step settings.

### Known limitations

#### PiP near the bottom may shift up after reopen

When you close PiP with `Alt+W` and open it again, **horizontal position and size** usually match the previous session. If you had docked the window near the **bottom** of the screen, the **vertical position may move up**, leaving a gap above the taskbar. Docking near the **top** typically does not show this behavior.

This comes from **Chrome / OS** placement when recreating the video PiP window (bottom safe area, taskbar avoidance, etc.), not from this extension moving the window. Extensions cannot read or set PiP window coordinates, so “restore last bottom position” is not possible. You can drag the window to the bottom again after reopening; Chrome may remember within the same session, but it is not guaranteed on every toggle.

### Project structure

```
├── manifest.json
├── background.js
├── popup.html / popup.js
├── popup-i18n.js
├── icons/
└── content/
    ├── bridge.js
    └── pip-toggle.js
```

### Permissions

- `scripting`, `tabs`, `storage`: inject scripts, remember the media tab, save user settings
- Host access: `*.youtube.com` and `*.bilibili.com` only

### Feedback

[GitHub Issues](https://github.com/jotenbai/picture-in-picture-controller/issues)

### License

[MIT](LICENSE) · [Privacy Policy](PRIVACY.md)
