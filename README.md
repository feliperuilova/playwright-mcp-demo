# playwright-mcp-demo

Template project with the [Playwright MCP](https://github.com/microsoft/playwright-mcp) server preconfigured for Claude Code.

## Setup

```bash
npm install
```

Run this before the first Claude Code session. It installs the pinned `@playwright/mcp` and `@playwright/test` versions from `package.json` into `node_modules`.

## How it works

- `.mcp.json` registers the `playwright` MCP server at project scope. Claude Code reads it on startup and asks you to approve the server once.
- The server runs from the local install: `npx playwright-mcp --browser chrome`. `npx` resolves the binary from `node_modules/.bin`, so it doesn't download anything at startup.
- `--browser chrome` drives your installed Google Chrome. Chrome must be installed.

## Codex

Codex doesn't read `.mcp.json`. Register the server with the Codex CLI:

```bash
codex mcp add playwright -- npx -y @playwright/mcp@latest --browser chrome
```

This writes the server to `~/.codex/config.toml`, so it's available in every project, not just this one. Check it with `codex mcp list`, then restart Codex.

`@latest` downloads the newest `@playwright/mcp` from npm, not the version pinned in `package.json`. Claude Code and Codex can end up on different server versions.

## Browsers

Neither `npm install` nor the MCP server downloads a browser. With `--browser chrome`, the server launches the Google Chrome already installed on your machine (on macOS: `/Applications/Google Chrome.app`).

If Chrome isn't installed, install it with Playwright (on macOS it asks for your password):

```bash
npx playwright install chrome
```

### Other browsers

`--browser` also accepts `msedge`, `firefox` and `webkit`. Edge uses the system install, like Chrome. Firefox and WebKit use Playwright's own builds, so install them first:

```bash
npx playwright install firefox   # or webkit
```

These builds go to a shared cache (`~/Library/Caches/ms-playwright` on macOS) and are reused across projects. Remove old ones with `npx playwright uninstall`.

### Example: use a specific installed Chrome

To point the server at an exact browser binary (for example Chrome Beta, or Chrome in a non-standard location), pass `--executable-path` in `.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "playwright-mcp",
        "--browser", "chrome",
        "--executable-path", "/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta"
      ],
      "env": {}
    }
  }
}
```

Paths on other platforms:

- Windows: `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe`
- Linux: `/usr/bin/google-chrome`

Restart Claude Code after changing `.mcp.json`.

## Tests

The project uses [Playwright Test](https://playwright.dev/docs/intro). Tests live in `tests/` and run in the system Google Chrome, the same browser the MCP server uses.

```bash
npm test                                   # run all tests
npx playwright test tests/example.spec.ts  # run one file
npx playwright test --headed               # watch the browser
npx playwright test --ui                   # interactive UI mode
npx playwright show-report                 # open the last HTML report
```

`playwright.config.ts` sets this up:

- `testDir: './tests'`, tests run in parallel.
- One project, `chrome`, with `channel: 'chrome'`.
- On CI (`CI` env var set): 2 retries, 1 worker, and `test.only` fails the run.
- A trace is recorded on the first retry of a failed test. Open it with `npx playwright show-trace <path>`.

Results go to `test-results/` and `playwright-report/`. Both are in `.gitignore`.

`@playwright/test` and the MCP server each bring their own Playwright version (`npm ls playwright` shows both). That's expected, they don't conflict.

## Updating Playwright

```bash
npm i -D -E @playwright/mcp@<version>    # MCP server
npm i -D -E @playwright/test@<version>   # test runner
```

Restart Claude Code after updating the MCP server to pick up the new version.
