# Contributing

PRs welcome. Open an issue first for large changes, or new features.

ocv tracks OpenCode. Keep fork-specific changes focused on Vim mode/copy mode.

## Development

Use [Bun](https://bun.sh) matching `package.json`.

```bash
bun install
cd packages/opencode
bun typecheck
cd ../tui
bun test ./test/cli/tui/vim-*.test.ts
```

## Running locally

```bash
bun dev .
```
