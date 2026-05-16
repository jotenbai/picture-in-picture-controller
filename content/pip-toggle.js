/**
 * Alt+W 注入脚本（MAIN world）。
 * 关闭：document.exitPictureInPicture()（W3C，无需手势）
 * 打开：点击播放器 PiP 按钮 → video.requestPictureInPicture()
 */
(function runPipToggle() {
  function hostKind() {
    const h = location.hostname.replace(/^www\./, "");
    if (h.includes("youtube.com")) return "youtube";
    if (h.includes("bilibili")) return "bilibili";
    return "generic";
  }

  function queryDeep(selector, root = document) {
    const direct = root.querySelector(selector);
    if (direct) return direct;
    for (const node of root.querySelectorAll?.("*") || []) {
      if (node.shadowRoot) {
        const found = queryDeep(selector, node.shadowRoot);
        if (found) return found;
      }
    }
    return null;
  }

  function revealControls() {
    const kind = hostKind();
    if (kind === "youtube") {
      const root =
        document.getElementById("movie_player") ||
        document.querySelector(".html5-video-player");
      if (!root) return;
      root.classList.remove("ytp-autohide");
      root.querySelector(".ytp-chrome-bottom")?.classList.remove("ytp-autohide");
      root.dispatchEvent(
        new MouseEvent("mousemove", { bubbles: true, cancelable: true })
      );
    }
    if (kind === "bilibili") {
      const root = document.querySelector(".bpx-player-container");
      root?.dispatchEvent(
        new MouseEvent("mousemove", { bubbles: true, cancelable: true })
      );
    }
  }

  function clickPipButton() {
    const selectors =
      hostKind() === "youtube"
        ? [
            "#movie_player button.ytp-pip-button",
            "button.ytp-pip-button",
            'button[aria-label*="Picture-in-Picture"]',
            'button[aria-label*="画中画"]',
          ]
        : [
            ".bpx-player-ctrl-pip",
            ".bcc-player-ctrl-pip",
            ".bilibili-player-video-btn-pip",
            'button[aria-label*="画中画"]',
          ];

    revealControls();
    for (const sel of selectors) {
      const btn = queryDeep(sel);
      if (btn instanceof HTMLElement && !btn.disabled) {
        btn.click();
        return true;
      }
    }
    return false;
  }

  function findLargestVideo() {
    const videos = [...document.querySelectorAll("video")].filter(
      (v) => v.readyState > 0 && !v.ended
    );
    if (!videos.length) return null;
    videos.sort((a, b) => {
      const r1 = a.getBoundingClientRect();
      const r2 = b.getBoundingClientRect();
      return r2.width * r2.height - r1.width * r2.height;
    });
    return videos[0];
  }

  function unlockVideo(video) {
    video.removeAttribute("disablePictureInPicture");
    video.disablePictureInPicture = false;
    try {
      video.controlsList?.remove("nopictureinpicture");
    } catch {
      /* ignore */
    }
  }

  async function tryEnterNativePip() {
    const video = findLargestVideo();
    if (!video || !document.pictureInPictureEnabled) return false;
    unlockVideo(video);
    try {
      await video.requestPictureInPicture();
      return true;
    } catch {
      return false;
    }
  }

  async function togglePip() {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      return;
    }

    if (clickPipButton()) return;

    await tryEnterNativePip();
  }

  void togglePip();
})();
