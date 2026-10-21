# Images for Socials — Spec (draft v4)

Desktop app for batch-preparing images for social media: pad to a target aspect ratio, resize, and export — with a live preview.

Target OS: Windows 11. Expected sources: Samsung phones and Sony cameras (JPEG).

---

## 1. Tech stack

| Concern | Choice |
|---|---|
| Shell | Electron |
| Build tooling | electron-vite (Vite for main / preload / renderer) |
| UI | Vue 3 (Composition API, `<script setup>`) + TypeScript |
| State | Pinia |
| Image processing | sharp (libvips), runs in the main process |
| Persistence | JSON files in `%APPDATA%/images-for-socials/` (settings, profiles, session state) |
| Drag-reorder | vue-draggable-plus (SortableJS) |
| Translations (i18n) | vue-i18n. Message files (`locales/<lang>.json`) are shared with the main process for native dialogs, notifications and the "Send to" entry |
| Code quality | ESLint (flat config, typescript-eslint, eslint-plugin-vue) + Prettier (eslint-config-prettier so they don't conflict). Format on save, checked in CI |
| Tests | Vitest (unit + golden-image tests), Playwright (Electron E2E) |
| Packaging | electron-builder → NSIS installer |
| Updates | electron-updater |

Renderer has no Node access; all filesystem / processing goes through a typed IPC bridge in the preload script.

---

## 2. Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Import area (drop zone + "Add images" button)        [⚙]   │
│  Image grid: thumbnails + file names, hover = full path      │
│  [⚠ Images from N folders — N output folders will be made]   │
│  [⚠ 3 files skipped: HEIC not supported (details)]           │
├───────────────────────────────┬──────────────────────────────┤
│                               │  Profile: [Default ▾] [Save] │
│   Preview of selected image   │  Steps (drag to reorder)     │
│   (after processing)          │   ┌ Add border ───────────┐  │
│   [Before / After] toggle     │   │ ...                   │  │
│   Output: 1080×1080, ~240 KB  │   └───────────────────────┘  │
│                               │   ┌ Resize ───────────────┐  │
│                               │   └───────────────────────┘  │
│                               │  Output format / quality     │
│                               │  [Reset to profile]          │
│                               │  [Export] [Export as…]       │
└───────────────────────────────┴──────────────────────────────┘
```

⚙ opens Settings (section 9).

---

## 3. Import

- Add images via file picker or drag-and-drop onto the import area.
- Dropping a folder adds only the supported images directly inside it. Subfolders are ignored.
- Supported input: JPG/JPEG, PNG, WebP, TIFF.
- File types are detected from the file contents, not only the extension. A file is added only after a quick decode check succeeds.
- **Unsupported files are skipped with a warning.** The warning is a dismissible notice that lists each skipped file and the reason, for example:
  - HEIC/HEIF: "HEIC is not supported". Samsung phones can save HEIC when "High efficiency pictures" is turned on in the camera settings, so the message suggests turning it off.
  - RAW (Sony `.ARW`, `.DNG`, Samsung `.SRW`, …): "RAW files are not supported, export to JPEG first".
  - Corrupt or unreadable files, and any other format.
- Duplicate paths are ignored.
- Grid shows thumbnails with file names. Hovering shows the full path. Each tile has a remove (×) button. "Clear all" button.
- Clicking a tile selects it for preview.
- If the images come from more than one folder and the export location is "next to source", show a warning saying how many `images-for-socials` folders **Export** will create.

---

## 4. Processing pipeline

- The steps form an ordered list that can be rearranged by dragging. They run one after another on each image.
- Every step has these common controls:
  - **Enabled** toggle (default on). A disabled step is skipped completely: no processing, no export, no suffix.
  - **Export after this** toggle (default on). Writes the image as it is after this step.
  - **Add suffix** toggle (default on for Border and Resize). The suffix is added to every export from this step onwards.
- Suffixes build up in step order. Example with both steps enabled and exporting:
  - `photo_BORDERED.jpg`
  - `photo_BORDERED_RESIZED.jpg`
- Suffix text can be edited per step (defaults: `_BORDERED`, `_RESIZED`).
- Each step is a self-contained module (`id`, params schema, default params, `apply(image, params)`, preview support), so new steps can be added later without changing the pipeline.

### 4.1 Normalisation (always runs first, not a step)

- Rotate according to EXIF orientation.
- Convert to the sRGB colour profile. This covers Sony cameras set to Adobe RGB and wide-gamut phone images.
- Fill transparent areas with the border colour when the output format has no alpha channel (JPG).
- Samsung "Motion photo" JPEGs: only the still image is used. The embedded video is dropped.
- Ultra HDR JPEGs (gain map): the standard (SDR) image is used. The HDR gain map is not kept.

### 4.2 Step: Add border

- **Padding %** (default 10%, slider + number input). Padding = `pct × longer side`. This is the *minimum* gap between the image and every canvas edge.
- **Target aspect ratio**: 1:1 (default), 4:5, 3:4, plus custom W:H.
- The canvas is the smallest size with the target ratio where `W ≥ w + 2p` and `H ≥ h + 2p`. The image is centred on it.
  - Example: 3000×2000 at 10% and 1:1 → p = 300 → canvas 3600×3600.
- **Border colour**: colour picker plus HEX, RGB and HSL input fields. Default `#FFFFFF`.

### 4.3 Step: Resize

- **Mode**:
  - *Fit within W×H* (default): keeps the aspect ratio and makes the image as large as possible inside the box. Width and height are linked when the box is square. Default 2000×2000. Presets: 1080×1080, 1080×1350, 1080×1440, 2000×2000.
  - *Scale by %*: keeps the aspect ratio.
- **Stretch to fill** toggle (default off).
  - Off: images smaller than the box are left at their size.
  - On: they are enlarged to fit the box, always keeping the aspect ratio. The image is never distorted.
  - The preview shows a "will upscale" warning on affected images.
- Resampling method: Lanczos3.
- **Sharpen after downscale** toggle (default off, light unsharp mask).

---

## 5. Output format

- **Format**: Keep as input file (default), JPG, PNG, WebP.
  - "Keep as input" writes JPG as JPG, PNG as PNG, WebP as WebP, and TIFF as TIFF.
- **JPG quality**: slider + number input, default **100**. Chroma subsampling is set to 4:4:4 at quality ≥ 90 so colour detail is kept. The control applies to JPG output, including JPG kept from input.
- **WebP quality**: default 100. Shown only when the output is WebP.
- **Metadata**: removed by default (includes GPS location). "Keep metadata" toggle. The sRGB colour profile is always embedded.
- **Name collisions**: add a number (default, `photo_BORDERED (1).jpg`), overwrite, or skip.

---

## 6. Export

- **Export**: writes to the default export location from Settings.
  - Default: `<image-folder>/images-for-socials/<images>`, one subfolder per source folder.
  - The multi-folder warning (section 3) applies.
- **Export as…**: opens a folder picker and writes all outputs to that folder **for this export only**. Settings are not changed. The picker opens in the last folder used for "Export as…".
- Images with the same file name from different source folders, exported into one folder, are handled by the collision rule.

### 6.1 Export run

- Progress bar (image X of N), cancel button.
- Images are processed in parallel (bounded concurrency).
- An error on one file doesn't stop the batch. A summary at the end lists successes, skips and failures with reasons.
- "Open output folder" button. Windows notification when the run finishes.

---

## 7. Preview

- Shows the selected image after running the actual pipeline at preview size (the same code as export). Updates live, debounced, when any setting changes.
- Before/After toggle.
- Shows the final output size and an estimated file size.
- When several steps export, a selector chooses which step's output is previewed (default: the last one).

---

## 8. Profiles

- A **profile** stores the whole processing setup: steps (order, enabled, export-after, add-suffix, suffix text, params), border colour, output format and quality, metadata option, collision rule.
- **Factory** profile: built in, cannot be edited.
- **User profiles**: create (save current as…), update, rename, duplicate, delete.
- One profile is marked as the **startup default** (set in Settings).
- The current working state is saved and restored between launches.
- Any value that differs from the active profile is highlighted, both per control and per step card.
- **Reset to profile** sets every value back to the active profile's values.

---

## 9. Settings (app-level, not stored in profiles)

- **Default export location**:
  - "Subfolder next to each source image" (default). Subfolder name is editable, default `images-for-socials`.
  - "Fixed folder" (folder picker).
- **Startup profile**.
- **Profile management** (rename, duplicate, delete, import/export profile as JSON).
- **Theme**: follow system (default) / light / dark.
- **Language**: follow system (default, falls back to English) / English / Lietuvių. Changes apply immediately, without restarting.
- **Windows integration**: toggle for the Explorer "Send to → Images for Socials" entry (section 10).
- **Updates**: check automatically toggle (default on), "Check now" button, current version, link to release notes.
- **About**: version, license, link to the GitHub repo and issue tracker.
- Remembered automatically: window size and position, last "Export as…" folder.

---

## 10. Windows integration

- Explorer **"Send to → Images for Socials"**: sends the selected images to the app (or adds them to the running app).
- The app runs as a single instance. Files sent from Explorer or the command line are added to the open window.
- Images can be dragged into the app from Explorer at any time (section 3).

---

## 11. Quality and release

- Unit tests for the border geometry, resize maths, suffix/file-name logic and collision handling.
- Golden-image tests for the full pipeline (EXIF rotation, colour profile conversion, transparency fill).
- A few Playwright E2E tests (import → export).
- ESLint + Prettier, strict TypeScript. A pre-commit hook (husky + lint-staged) formats and lints changed files.
- Every user-facing string goes through i18n. A lint rule flags hard-coded text in templates, and a test checks that every language file has the same keys as English.
- Numbers, file sizes and dates are formatted for the selected language.
- v1 languages: **English** (`en`, source language) and **Lithuanian** (`lt`).
  - Lithuanian has three plural forms ("1 nuotrauka", "2 nuotraukos", "10 nuotraukų"), so vue-i18n gets a custom Lithuanian plural rule, with tests.
  - UI layouts must allow for longer text, since Lithuanian strings are often longer than English.
  - Both languages are updated in the same milestone as the feature they belong to.
- Local log file in `%APPDATA%/images-for-socials/logs/` with a "Show logs" button in Settings, to help diagnose failed exports. Logs never contain image contents.
- No telemetry or analytics. The only network request is the update check.

---

## 12. Open source and releases

### 12.1 Repository

- Public GitHub repository. Default branch `main`.
- License: MIT. sharp (Apache-2.0) and libvips (LGPL-3.0, dynamically linked) are compatible with it.
- `README.md`: what the app does, screenshots, download link, build-from-source steps.
- `CONTRIBUTING.md`: dev setup, scripts, code style, how to add a new processing step, how to add a translation.
- `CHANGELOG.md`, kept in "Keep a Changelog" format.
- Issue templates (bug report, feature request) and a pull request template.
- `THIRD_PARTY_NOTICES` generated from dependency licenses and shipped with the installer.

### 12.2 CI (GitHub Actions)

- On every push and pull request: lint, type-check, unit tests, golden-image tests, on `windows-latest`.
- On a version tag (`v1.2.3`): build the NSIS installer and publish a GitHub Release with the installer and `latest.yml`. Release notes are taken from `CHANGELOG.md`.
- Dependabot for npm and GitHub Actions updates.

### 12.3 Releases and updates

- Versioning: Semantic Versioning (`MAJOR.MINOR.PATCH`).
- The NSIS installer is attached to each GitHub Release.
- Auto-update via electron-updater from GitHub Releases. The app checks on startup (if enabled), downloads in the background and asks before restarting to install. Pre-releases are ignored.
- Code signing: unsigned at first, so SmartScreen warns on first install (README explains "More info → Run anyway"). Apply to SignPath Foundation, which offers free code signing for open-source projects, once the project has a first public release.

---

## 13. Out of scope for v1 (possible later)

- HEIC/HEIF and RAW input (the user is warned, see section 3)
- Per-image parameter overrides
- More steps (watermark, crop, filters)
- macOS / Linux builds (nothing Windows-only in the core, so these are mostly packaging work)

---

## 14. Build milestones

1. Project setup: electron-vite + Vue + TS, ESLint + Prettier + pre-commit hook, vue-i18n with English + Lithuanian, test setup, layout outline, LICENSE, README stub, CI for lint + tests
2. Import + image grid + unsupported-file warnings
3. Pipeline framework (step modules, reorder, common toggles, suffix logic)
4. Normalisation + Border step + Resize step, with tests
5. Live preview
6. Export / Export as… (locations, formats, quality, collisions, progress, cancel, error summary)
7. Profiles, saved state, non-default highlighting, reset
8. Settings screen
9. Packaging (NSIS installer in English + Lithuanian) + single instance + Explorer "Send to"
10. Release pipeline (tagged builds → GitHub Releases) + auto-update + logging
11. Open-source polish: README with screenshots, CONTRIBUTING, templates, third-party notices, v1.0.0 release
