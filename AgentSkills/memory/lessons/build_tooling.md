# Build Tooling & Linting Lessons

### ESLint Flat Config & Peer Dependency Alignment
- In ESLint 9+, legacy `.eslintrc.*` and `.eslintignore` files are obsolete; configure `eslint.config.js` with `typescript-eslint` instead.
- Check peer dependencies when upgrading ESLint and TypeScript: plugins like `eslint-plugin-react` require compatible ESLint ranges, and `typescript-eslint` v8 parser expects TypeScript `<6.1.0`.
- Mutating global document state (e.g. `document.documentElement.lang`) inside React component click handlers triggers the `react-hooks/immutability` rule. Move document property synchronization into a dedicated `useEffect` hook keyed to the reactive state/i18n property.
