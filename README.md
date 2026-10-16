# Protocord

A TypeScript action runtime and Discord trigger framework for discord.js.
Applications own their actions; Protocord owns parsing, availability,
authorization, execution, and presentation.

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
