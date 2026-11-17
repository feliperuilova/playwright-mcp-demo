# playwright-mcp-demo

Template project with the [Playwright MCP](https://github.com/microsoft/playwright-mcp) server preconfigured for Claude Code.

## Setup

```bash
npm install
```

Run this before the first Claude Code session. It installs the pinned `@playwright/mcp` version from `package.json` into `node_modules`.

## How it works

- `.mcp.json` registers the `playwright` MCP server at project scope. Claude Code reads it on startup and asks you to approve the server once.
- The server runs from the local install: `npx playwright-mcp --browser chrome`. `npx` resolves the binary from `node_modules/.bin`, so it doesn't download anything at startup.
- `--browser chrome` drives your installed Google Chrome. Chrome must be installed.

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

## Updating Playwright MCP

```bash
npm i -D @playwright/mcp@<version>
```

Restart Claude Code afterwards to pick up the new version.
