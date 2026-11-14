# Build tooling

## TypeScript 7 is the linter

`npm run lint` is `tsc --noEmit`. Do not add ESLint or `typescript-eslint`. TypeScript 7 has no compiler API, so those packages cannot parse it. Depend on the `typescript` package at version 7 directly.

## Deleting old files

Delete unused files one path at a time. A single recursive force-delete across several directories is blocked.
