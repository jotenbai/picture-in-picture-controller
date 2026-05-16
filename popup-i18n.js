/** Popup UI strings: zh / ja / en */
const POPUP_I18N = {
  zh: {
    langName: "中文",
    title: "画中画控制器",
    howToUse: "使用方法",
    step1: "打开 Chrome 的扩展快捷键设置页。",
    step2:
      "将本扩展程序的四个快捷键的生效范围改为全局（才能后台控制）；按键也可按需修改。",
    step3:
      "在 YouTube 或 bilibili 打开一个视频页面，并让浏览器停留在该标签页。",
    step4: "切换到游戏或其他应用后，即可用快捷键在后台控制画中画。",
    defaultShortcuts: "默认快捷键",
    shortcutPip: "切换画中画",
    shortcutSeekBack: "快退 {n} 秒",
    shortcutPlay: "暂停 / 播放",
    shortcutSeekForward: "快进 {n} 秒",
    altDNote:
      "Chrome 默认用 Alt+D 聚焦地址栏，扩展无法自动占用「快进」，因此首次打开会显示「未设置」，请点击铅笔手动绑定。",
    seekLabel: "快进 / 快退秒数",
    seekUnit: "秒",
    shortcutsLink: "快捷键设置页",
  },
  ja: {
    langName: "日本語",
    title: "PiP コントローラー",
    howToUse: "使用方法",
    step1: "Chrome の拡張機能ショートカット設定ページを開く。",
    step2:
      "本拡張機能の4つのショートカットの適用範囲をグローバルに変更する（バックグラウンド制御に必要）。キーは必要に応じて変更できる。",
    step3:
      "YouTube または bilibili で動画ページを開き、ブラウザはそのタブのままにする。",
    step4:
      "ゲームなど他のアプリに切り替えた後、ショートカットでバックグラウンドから PiP を操作できる。",
    defaultShortcuts: "デフォルトのショートカット",
    shortcutPip: "PiP の切り替え",
    shortcutSeekBack: "{n} 秒戻る",
    shortcutPlay: "一時停止 / 再生",
    shortcutSeekForward: "{n} 秒進む",
    altDNote:
      "Chrome は Alt+D をアドレスバー用に予約しているため、拡張機能は「早送り」を自動割り当てできません。そのため初回は「未設定」と表示されます。鉛筆アイコンをクリックして手動で割り当ててください。",
    seekLabel: "早送り / 巻き戻しの秒数",
    seekUnit: "秒",
    shortcutsLink: "ショートカット設定ページ",
  },
  en: {
    langName: "English",
    title: "Picture-in-Picture Controller",
    howToUse: "How to use",
    step1: "Open Chrome’s extension shortcuts settings page.",
    step2:
      "Set all four shortcuts for this extension to Global (required for background control). You can change the keys if needed.",
    step3:
      "Open a video on YouTube or bilibili and keep the browser on that tab.",
    step4:
      "Switch to a game or another app, then control picture-in-picture in the background with shortcuts.",
    defaultShortcuts: "Default shortcuts",
    shortcutPip: "Toggle picture-in-picture",
    shortcutSeekBack: "Seek back {n} s",
    shortcutPlay: "Pause / play",
    shortcutSeekForward: "Seek forward {n} s",
    altDNote:
      'Chrome uses Alt+D for the address bar, so this extension cannot auto-assign "Seek forward." It will show "Not set" the first time—click the pencil to bind it manually.',
    seekLabel: "Seek forward / back (seconds)",
    seekUnit: "s",
    shortcutsLink: "Shortcuts settings",
  },
};

const POPUP_LOCALES = ["zh", "ja", "en"];
const DEFAULT_SEEK_SECONDS = 5;
const SEEK_MIN = 1;
const SEEK_MAX = 120;

function detectDefaultLocale() {
  const ui = (chrome.i18n?.getUILanguage?.() || navigator.language || "en")
    .toLowerCase()
    .split("-")[0];
  if (ui === "zh" || ui === "ja") return ui;
  return "en";
}

function formatSeekLabel(template, seconds) {
  return template.replace(/\{n\}/g, String(seconds));
}
