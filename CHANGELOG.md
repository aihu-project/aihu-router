# Changelog

## 0.5.1

- Require the live `@aihu/context@0.2.1` SSR implementation so route state uses one shared context instance.

This release corrects the standalone GitHub and npm distribution metadata for
`@aihu/router` and adds a tag-validated release workflow. A release tag must
match the package version, the complete check/test/build/package gate runs
before publishing, and retries safely skip versions already present on npm.

## 0.5.0

This release preserves the router's existing browser, Vite, and server
surfaces while moving the package to its standalone `aihu-router` repository.
The router remains an opt-in integration and consumes published aihu runtime
packages at the application boundary.
