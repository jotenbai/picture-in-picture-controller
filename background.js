const MEDIA_HOSTS = [
  "youtube.com",
  "bilibili.com",
];

/** manifest 键名带数字前缀，供 chrome://extensions/shortcuts 按序显示 */
const CMD = {
  PIP: "1-toggle-pip",
  SEEK_BACK: "2-seek-back",
  PLAY: "3-toggle-play",
  SEEK_FWD: "4-seek-forward",
};

const CMD_TO_BRIDGE = {
  [CMD.SEEK_BACK]: "seek-back",
  [CMD.PLAY]: "toggle-play",
  [CMD.SEEK_FWD]: "seek-forward",
};

const PIP_TOGGLE_SCRIPT = "content/pip-toggle.js";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 80;
const DEFAULT_SEEK_SECONDS = 5;
const SEEK_MIN = 1;
const SEEK_MAX = 120;

async function getSeekSeconds() {
  const { seekSeconds } = await chrome.storage.sync.get({
    seekSeconds: DEFAULT_SEEK_SECONDS,
  });
  const n = Math.round(Number(seekSeconds));
  if (!Number.isFinite(n)) return DEFAULT_SEEK_SECONDS;
  return Math.min(SEEK_MAX, Math.max(SEEK_MIN, n));
}

/** 内存缓存，避免 onCommand 里 await 查标签导致用户激活丢失 */
let cachedMediaTabId = null;

chrome.runtime.onInstalled.addListener((details) => {
  chrome.storage.session.set({ lastMediaTabId: null });
  if (
    details.reason === chrome.runtime.OnInstalledReason.INSTALL ||
    details.reason === chrome.runtime.OnInstalledReason.UPDATE
  ) {
    warnIfShortcutsMissing();
  }
  void refreshCachedMediaTab();
});

chrome.runtime.onStartup.addListener(() => {
  void refreshCachedMediaTab();
});

function warnIfShortcutsMissing() {
  chrome.commands.getAll((commands) => {
    const missing = commands.filter(
      (c) => c.name === CMD.SEEK_FWD && !c.shortcut
    );
    if (missing.length > 0) {
      console.warn(
        "[PiP Controller] 「快进 5 秒」未绑定：Chrome 保留 Alt+D 给地址栏。" +
          "请到 chrome://extensions/shortcuts 手动设置为 Alt+D。"
      );
    }
  });
}

function isMediaUrl(url) {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return MEDIA_HOSTS.some((h) => host === h || host.endsWith("." + h));
  } catch {
    return false;
  }
}

function isWatchPage(url) {
  if (!url) return false;
  try {
    const { pathname } = new URL(url);
    return (
      pathname.includes("/watch") ||
      pathname.startsWith("/shorts/") ||
      pathname.includes("/video/")
    );
  } catch {
    return false;
  }
}

function scoreMediaTab(tab) {
  let score = 0;
  if (tab.audible) score += 100;
  if (isWatchPage(tab.url)) score += 50;
  score += (tab.lastAccessed || 0) / 1e12;
  return score;
}

async function pickMediaTab() {
  const { lastMediaTabId } = await chrome.storage.session.get("lastMediaTabId");
  const tabs = await chrome.tabs.query({});
  const mediaTabs = tabs.filter((t) => t.id && isMediaUrl(t.url));
  if (mediaTabs.length === 0) return null;

  if (lastMediaTabId) {
    const remembered = mediaTabs.find((t) => t.id === lastMediaTabId);
    if (remembered && (remembered.audible || isWatchPage(remembered.url))) {
      return remembered;
    }
  }

  mediaTabs.sort((a, b) => scoreMediaTab(b) - scoreMediaTab(a));
  return mediaTabs[0];
}

async function refreshCachedMediaTab() {
  const tab = await pickMediaTab();
  if (tab?.id) {
    cachedMediaTabId = tab.id;
    await chrome.storage.session.set({ lastMediaTabId: tab.id });
  }
}

function rememberMediaTab(tabId) {
  if (tabId) cachedMediaTabId = tabId;
}

async function injectBridgeScript(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["content/bridge.js"],
  });
}

/**
 * 尽量同步注入：快捷键触发的用户激活只在极短时间内有效。
 * 不能用「模拟手势」API——目前 Chrome 未提供（见 WECG #898）。
 */
function injectPipToggle(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    files: [PIP_TOGGLE_SCRIPT],
    world: "MAIN",
  });
}

async function runPipToggle(tabId) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await injectPipToggle(tabId);
      return { ok: true };
    } catch (err) {
      if (attempt === MAX_RETRIES - 1) {
        return { ok: false, error: String(err?.message || err) };
      }
    }
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
  }
  return { ok: false, error: "pip-inject-failed" };
}

async function sendCommandToTab(tabId, command) {
  const payload = { type: "pip-controller", command };
  if (command === "seek-back" || command === "seek-forward") {
    payload.seekSeconds = await getSeekSeconds();
  }
  return chrome.tabs.sendMessage(tabId, payload);
}

async function runMediaCommand(tabId, command) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await sendCommandToTab(tabId, command);
      if (result?.ok) return result;
    } catch {
      try {
        await injectBridgeScript(tabId);
        const result = await sendCommandToTab(tabId, command);
        if (result?.ok) return result;
      } catch (err) {
        if (attempt === MAX_RETRIES - 1) {
          return { ok: false, error: String(err?.message || err) };
        }
      }
    }
    if (attempt < MAX_RETRIES - 1) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }
  return { ok: false, error: "command-failed" };
}

function resolveTabIdForCommand(commandTab) {
  if (commandTab?.id && isMediaUrl(commandTab.url)) {
    return commandTab.id;
  }
  return cachedMediaTabId;
}

chrome.commands.onCommand.addListener((command, commandTab) => {
  if (command === CMD.PIP) {
    const tabId = resolveTabIdForCommand(commandTab);
    if (tabId) {
      void runPipToggle(tabId).then((result) => {
        if (!result?.ok) {
          console.warn("[PiP Controller]", result?.error || "pip-failed");
        }
      });
      return;
    }
    void refreshCachedMediaTab().then(() => {
      if (!cachedMediaTabId) {
        console.warn("[PiP Controller] 未找到 YouTube / Bilibili 标签页");
        return;
      }
      void runPipToggle(cachedMediaTabId);
    });
    return;
  }

  const bridgeCommand = CMD_TO_BRIDGE[command];
  if (!bridgeCommand) return;

  void (async () => {
    const tabId = resolveTabIdForCommand(commandTab) ?? (await pickMediaTab())?.id;
    if (!tabId) {
      console.warn("[PiP Controller] 未找到 YouTube / Bilibili 标签页");
      return;
    }
    const result = await runMediaCommand(tabId, bridgeCommand);
    if (result?.ok) {
      rememberMediaTab(tabId);
      await chrome.storage.session.set({ lastMediaTabId: tabId });
    } else {
      console.warn("[PiP Controller]", result?.error || "failed");
    }
  })();
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId);
    if (isMediaUrl(tab.url)) {
      rememberMediaTab(tabId);
      await chrome.storage.session.set({ lastMediaTabId: tabId });
    }
  } catch {
    /* ignore */
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!isMediaUrl(tab.url)) return;
  if (changeInfo.audible || changeInfo.status === "complete") {
    rememberMediaTab(tabId);
    await chrome.storage.session.set({ lastMediaTabId: tabId });
  }
});
