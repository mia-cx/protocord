# Protocord

<a href="https://0rwx.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://0rwx.com/static/AI-W-dark.svg">
    <img alt="AI:W" src="https://0rwx.com/static/AI-W-light.svg" height="48">
  </picture>
</a>

Protocord is a TypeScript toolkit for building discord.js bots with reusable actions, interactive settings, and permission checks.

| Package | Purpose |
| --- | --- |
| `protocord` | Action registry, extensible trigger providers, slash commands, context menus, and text commands |
| `@protocord/settings` | Components v2 settings, navigation, validation, modals, and mutations |
| `@protocord/permissions` | Permission evaluation, Discord adapters, and SQLite persistence |
| `@protocord/ai` | Reserved AI extension; currently a scaffold |

The package history was extracted from
[`mia-cx/prod`](https://github.com/mia-cx/prod) at
`9d14fd14d63b484d792d98008e495cec6a9896b5`. Package source and tests are unchanged.
Prod's application and `@mia-cx/protocord-model-settings` remain in Prod.

## Quickstart

Use Node.js 24 and pnpm 11 (`11.13.1`).

1. Create an app in the [Discord Developer Portal](https://discord.com/developers/applications)
   and get its token from the **Bot** page. Install it in a test server using
   **Guild Install** with the `bot` and `applications.commands` scopes. No
   privileged intents or extra bot permissions are needed. Turn on Developer
   Mode in Discord (**Settings → Advanced**) and copy the server ID.
2. Clone Protocord and build the [example bot](examples/bot/src/index.ts):

   ```sh
   git clone https://github.com/mia-cx/protocord.git
   cd protocord
   pnpm install --frozen-lockfile
   pnpm --filter '@protocord/example-bot...' build
   ```

3. Copy the example environment file, fill in `DISCORD_TOKEN` and
   `DISCORD_GUILD_ID` in `examples/bot/.env`, then start the bot.

   ```sh
   cp examples/bot/.env.example examples/bot/.env
   ```

   ```sh
   pnpm --filter @protocord/example-bot start
   ```

4. After the bot prints `Ready`, run `/ping` for a reply. Use `/settings` to
   increment a counter that resets on restart. The settings are available to
   the server owner and members with **Administrator** or **Manage Server**.

## Development

Use Node.js 24 and pnpm 11.

```sh
pnpm install --frozen-lockfile
pnpm check
```

## Use without publishing

Add this repository as a Git submodule and include its packages in the consumer's
pnpm workspace:

```sh
git submodule add https://github.com/mia-cx/protocord.git vendor/protocord
```

```yaml
packages:
  - "vendor/protocord"
  - "vendor/protocord/packages/*"
```

Allow `better-sqlite3` and `esbuild` build scripts in the consumer workspace when
using the permissions tests or package tooling. Add the packages you use with
`workspace:*`, install from the consumer root, and build Protocord before
typechecking or building the consumer. Imports use compiled `dist` entrypoints;
the `development` export condition is available for source watchers.

Clone consumers with `--recurse-submodules`, or run
`git submodule update --init --recursive` before installing dependencies. Commit
and push Protocord changes first, then commit the updated submodule pointer in
each consumer. Updating a consumer's pin is explicit.
