# Images for Socials

A Windows desktop app for batch-preparing photos for social media: add a border to reach a target aspect ratio (1:1, 4:5, 3:4…), resize, and export — with a live preview.

> **Status:** early development. Nothing to download yet. See [SPEC.md](SPEC.md) for the planned features and milestones.

## Development

Requirements: Windows 11 and [Node.js](https://nodejs.org/) 24 LTS (24.15 or newer). The exact version is in [.nvmrc](.nvmrc); with nvm run `nvm install 24.22.1` and `nvm use 24.22.1`. npm refuses to run on other Node versions.

```sh
npm install
npm run dev
```

| Script              | What it does                                |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Start the app with hot reload               |
| `npm run build`     | Type-check and build into `out/`            |
| `npm run preview`   | Run the production build                    |
| `npm test`          | Run unit and component tests (Vitest)       |
| `npm run lint`      | Lint with ESLint (`lint:fix` to auto-fix)   |
| `npm run format`    | Format with Prettier (`format:check` in CI) |
| `npm run typecheck` | Type-check main, preload and renderer code  |

A pre-commit hook (husky + lint-staged) lints and formats staged files.

### Project layout

```
src/
  main/       Electron main process
  preload/    Typed bridge exposed to the renderer as window.api
  renderer/   Vue 3 UI
  shared/     Code used by both sides: IPC contract, i18n, locale files
```

### Translations

UI text lives in [src/shared/locales](src/shared/locales) (`en.json` is the source language, `lt.json` Lithuanian). Hard-coded text in Vue templates fails linting, and a test checks that every language has the same keys and placeholders as English.

## License

[MIT](LICENSE)
