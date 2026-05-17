# Privacy Policy

**Picture-in-Picture Controller (PiP Controller)**  
Last updated: May 16, 2026

This policy describes how this Chrome extension handles information. The extension is published as open source on GitHub:  
https://github.com/jotenbai/picture-in-picture-controller

---

## Single purpose

The extension’s only purpose is to let users control **picture-in-picture** (open/close) and **video playback** (play/pause, seek forward/back) on **YouTube** and **bilibili** using keyboard shortcuts configured in `chrome://extensions/shortcuts` (set to **Global**), without bringing the browser window to the foreground when another app is active.

---

## What data do we collect?

**The extension does not upload, sell, or share your personal data with servers operated by the developer.**

It only uses Chrome storage APIs inside your browser:

| Data | Storage | Purpose |
|------|---------|---------|
| UI language (Chinese / Japanese / English) | `chrome.storage.sync` | Remember your popup language choice |
| Seek forward/back step (seconds) | `chrome.storage.sync` | Remember your seek interval setting |
| Last used media tab ID | `chrome.storage.session` | Route shortcut commands to the correct YouTube/bilibili tab (cleared when the browser session ends) |

`chrome.storage.sync` may sync across devices via your signed-in Google account, using **Google’s** infrastructure. The extension does not access your Google account password or unrelated account data.

The extension does **not** collect: name, email, precise location, a browsing-history database, payment information, or advertising profiles.

---

## Remote code

This extension does **not** use remotely hosted code. All JavaScript is bundled in the package. On user action (e.g. pressing a shortcut), it injects only local files `content/bridge.js` and `content/pip-toggle.js` into YouTube/bilibili pages.

---

## Permissions

| Permission | Why it is needed |
|------------|------------------|
| Host access (`*.youtube.com`, `*.bilibili.com`) | Run content scripts only on those sites to control in-page video and PiP |
| `scripting` | Inject the extension’s own scripts when needed |
| `tabs` | Find the tab playing video and send commands (not used for unrelated purposes) |
| `storage` | Save the settings and session state listed above |

---

## Third-party websites

When you use this extension, you still visit **YouTube** and **bilibili**, which have their own privacy policies and terms. The extension does not modify pages outside those sites.

---

## Retention and deletion

- After you uninstall the extension, data written by the extension is no longer updated. Items in `sync` may remain in your Google account until you clear extension or sync data in Chrome.
- You can change language and seek settings anytime in the extension popup.

---

## Children

This extension is not directed at children under 13 and does not knowingly collect children’s personal information.

---

## Changes

We may update this policy; material changes will be reflected in this file on GitHub. Continued use of the extension after updates means you accept the revised policy.

---

## Contact

Questions or privacy inquiries:  
https://github.com/jotenbai/picture-in-picture-controller/issues
