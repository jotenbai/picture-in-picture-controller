/**
 * 隔离环境：Alt+A/S/D 在后台标签可用（sendMessage）。
 * Alt+W 由 background 注入 pip-toggle.js（MAIN），不在此处理。
 */
(function initPipBridge() {
  if (globalThis.__pipControllerBridgeLoaded) return;
  globalThis.__pipControllerBridgeLoaded = true;

  const DEFAULT_SEEK_SECONDS = 5;

  function normalizeSeekSeconds(value) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n)) return DEFAULT_SEEK_SECONDS;
    return Math.min(120, Math.max(1, n));
  }

  function findVideo() {
    if (document.pictureInPictureElement instanceof HTMLVideoElement) {
      return document.pictureInPictureElement;
    }

    const videos = [...document.querySelectorAll("video")].filter(
      (v) => v.readyState > 0 && !v.ended
    );
    if (videos.length === 0) return null;

    videos.sort((a, b) => {
      const score = (v) => {
        let s = 0;
        if (!v.paused) s += 10;
        const r = v.getBoundingClientRect();
        return s + (r.width * r.height) / 1e6;
      };
      return score(b) - score(a);
    });
    return videos[0];
  }

  function unlockVideoForPip(video) {
    if (!(video instanceof HTMLVideoElement)) return;
    video.removeAttribute("disablePictureInPicture");
    video.disablePictureInPicture = false;
    try {
      video.controlsList?.remove("nopictureinpicture");
    } catch {
      /* ignore */
    }
  }

  function handleCommand(command, seekSeconds = DEFAULT_SEEK_SECONDS) {
    const video = findVideo();
    if (!video) return { ok: false, error: "no-video" };
    const step = normalizeSeekSeconds(seekSeconds);

    switch (command) {
      case "seek-back":
        video.currentTime = Math.max(0, video.currentTime - step);
        return { ok: true, action: "seek-back" };
      case "seek-forward": {
        const duration = Number.isFinite(video.duration)
          ? video.duration
          : Infinity;
        video.currentTime = Math.min(duration, video.currentTime + step);
        return { ok: true, action: "seek-forward" };
      }
      case "toggle-play":
        if (video.paused) {
          void video.play();
          return { ok: true, action: "play" };
        }
        video.pause();
        return { ok: true, action: "pause" };
      default:
        return { ok: false, error: "unknown-command" };
    }
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "pip-controller") return false;
    sendResponse(
      handleCommand(message.command, message.seekSeconds)
    );
    return false;
  });

  const host = location.hostname;
  if (host.includes("bilibili")) {
    const applyUnlock = () => {
      document.querySelectorAll("video").forEach(unlockVideoForPip);
    };
    applyUnlock();
    new MutationObserver(applyUnlock).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["disablePictureInPicture", "controlsList"],
    });
  }

  if (navigator.mediaSession?.setActionHandler) {
    try {
      navigator.mediaSession.setActionHandler("enterpictureinpicture", () => {
        const video = findVideo();
        if (!video) return;
        unlockVideoForPip(video);
        void video.requestPictureInPicture();
      });
    } catch {
      /* 部分页面无媒体会话 */
    }
  }
})();
