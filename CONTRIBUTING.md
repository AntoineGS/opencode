# Contributing

PRs are welcome. Open an issue first for large changes, behavior changes, or new features.

ocv tracks upstream OpenCode. Keep fork-specific changes focused on Vim mode/copy mode.

## Pull requests

- Target the `ocv` branch.
- If your PR targets a feature listed in [#5](https://github.com/leohenon/opencode-vim/issues/5), comment there first.

## Development

Use [Bun](https://bun.sh) matching `package.json`.

```bash
bun install
cd packages/opencode
bun typecheck
bun test test/cli/tui/vim-*.test.ts
```

## Running locally

```bash
bun dev .
```
