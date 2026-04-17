# Contributing

For large changes, behavior changes, or new features, please open an issue first to describe what you want to change and why.

## Pull Requests

Please target branch `ocv` and keep your PR focused.

Make sure you have read [#5](https://github.com/leohenon/opencode-vim/issues/5) and comment there first if your PR targets one of these features.

## Development

Requires [Bun](https://bun.sh) 1.3+.

```bash
bun install
bun test test/cli/tui/vim-motions.test.ts  # from packages/opencode

```

Running Locally
```bash
bun dev .
```
