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

## Updating Playwright MCP

```bash
npm i -D @playwright/mcp@<version>
```

Restart Claude Code afterwards to pick up the new version.
