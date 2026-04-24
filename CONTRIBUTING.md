# Contributing

## Issues

Any bugs or suggestions, open an issue.

## Pull Requests

PRs welcome.

Please target branch `ocv` and keep your PR focused.

PR titles should start with `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`, or `ci:`. Optional scopes like `feat(copy-mode): ...`.

Make sure you have read [#5](https://github.com/leohenon/opencode-vim/issues/5) and comment there first if your PR targets one of these features.

For large changes, behavior changes, or new features, consider opening an issue first to describe what you want to change and why.

## Development

Use [Bun](https://bun.sh) matching `package.json` (`packageManager`).

```bash
bun install
bun test test/cli/tui/vim-motions.test.ts  # from packages/opencode
```

Pre-push runs:

```bash
cd packages/opencode
bun typecheck
bun test test/cli/tui/vim-*.test.ts
```

If pre-push fails on Bun version, update Bun.

Running Locally

```bash
bun dev .
```
