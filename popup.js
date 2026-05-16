const STORAGE_LOCALE = "uiLocale";
const STORAGE_SEEK = "seekSeconds";

const $ = (id) => document.getElementById(id);

let currentLocale = "zh";
let seekSeconds = DEFAULT_SEEK_SECONDS;

function clampSeek(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return DEFAULT_SEEK_SECONDS;
  return Math.min(SEEK_MAX, Math.max(SEEK_MIN, n));
}

function applyLocale(locale) {
  const strings = POPUP_I18N[locale] || POPUP_I18N.zh;
  currentLocale = locale;
  document.documentElement.lang =
    locale === "zh" ? "zh-CN" : locale === "ja" ? "ja" : "en";

  $("title").textContent = strings.title;
  $("how-to-use").textContent = strings.howToUse;

  const stepsEl = $("steps");
  stepsEl.innerHTML = "";
  for (let i = 1; i <= 4; i++) {
    const li = document.createElement("li");
    li.innerHTML = strings[`step${i}`];
    stepsEl.appendChild(li);
  }

  $("default-shortcuts").textContent = strings.defaultShortcuts;
  $("shortcut-pip").textContent = strings.shortcutPip;
  $("shortcut-seek-back").textContent = formatSeekLabel(
    strings.shortcutSeekBack,
    seekSeconds
  );
  $("shortcut-play").textContent = strings.shortcutPlay;
  $("shortcut-seek-forward").textContent = formatSeekLabel(
    strings.shortcutSeekForward,
    seekSeconds
  );

  $("seek-label").textContent = strings.seekLabel;
  $("seek-unit").textContent = strings.seekUnit;
  $("alt-d-note").innerHTML = strings.altDNote;
  $("shortcuts-link").textContent = strings.shortcutsLink;

  document.querySelectorAll("#lang-bar button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === locale);
  });
}

function refreshShortcutSeekLabels() {
  const strings = POPUP_I18N[currentLocale] || POPUP_I18N.zh;
  $("shortcut-seek-back").textContent = formatSeekLabel(
    strings.shortcutSeekBack,
    seekSeconds
  );
  $("shortcut-seek-forward").textContent = formatSeekLabel(
    strings.shortcutSeekForward,
    seekSeconds
  );
}

async function saveLocale(locale) {
  await chrome.storage.sync.set({ [STORAGE_LOCALE]: locale });
  applyLocale(locale);
}

async function saveSeekSeconds(value) {
  seekSeconds = clampSeek(value);
  const input = $("seek-seconds");
  input.value = String(seekSeconds);
  await chrome.storage.sync.set({ [STORAGE_SEEK]: seekSeconds });
  refreshShortcutSeekLabels();
}

async function loadSettings() {
  const defaults = {
    [STORAGE_LOCALE]: detectDefaultLocale(),
    [STORAGE_SEEK]: DEFAULT_SEEK_SECONDS,
  };
  const data = await chrome.storage.sync.get(defaults);
  const locale = POPUP_LOCALES.includes(data[STORAGE_LOCALE])
    ? data[STORAGE_LOCALE]
    : detectDefaultLocale();
  seekSeconds = clampSeek(data[STORAGE_SEEK]);
  $("seek-seconds").value = String(seekSeconds);
  applyLocale(locale);
}

document.querySelectorAll("#lang-bar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    void saveLocale(btn.dataset.lang);
  });
});

$("seek-seconds")?.addEventListener("change", (e) => {
  void saveSeekSeconds(e.target.value);
});

$("seek-seconds")?.addEventListener("blur", (e) => {
  void saveSeekSeconds(e.target.value);
});

$("shortcuts-link")?.addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});

void loadSettings();
