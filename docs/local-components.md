# Local DIDroom components

The wallet consumes `@didroom/components` from `link:./didroom-components`.
The Stencil repository is a Git submodule, not an untracked copy or a published
npm override. Keep its changes on a separate branch.

## Setup and build

```sh
git submodule update --init --recursive
pnpm install --frozen-lockfile
pnpm dev
```

The wallet's postinstall builds the components using their own frozen lockfile,
then copies the resulting distribution into ignored `static/components/`.
Chromium downloads are disabled for this build. No package is published.

After changing component source, rebuild and refresh the wallet:

```sh
pnpm components:build
```

Stencil regenerates `src/components.d.ts` and component README API tables. Keep
these generated source/API files with the component changes; do not commit
`dist/`, `loader/`, `www/` or `static/components/`.

## Tests

```sh
pnpm test:components
pnpm test:unit --run
pnpm test:ux
```

The UX suite starts a local Vite server on port 4187 and checks mobile, small
dark-mode and desktop layouts. It replaces loaders with synthetic fixtures and
stubs the verifier response. All non-local HTTP requests are intercepted;
no account, issuer or verifier is contacted. Its fixtures deliberately bypass
authentication and do **not** validate cryptography, native biometric auth,
native keyboards or issuance/verification interoperability.

The existing integration suite still uses the production build and is separate.
The `*.pw.ts` UX files are not discovered by its `*.spec.ts`/`*.test.ts` match.

If Chromium is installed outside Playwright's usual cache, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for the UX run.

## Shipping both repositories

1. Commit and publish the component branch first.
2. Commit the updated `didroom-components` gitlink in the wallet to pin that
   **published** component commit.
3. Check a fresh recursive clone with `pnpm install --frozen-lockfile` before
   opening the wallet PR.

Do not ship a wallet gitlink pointing to an unpublished local component commit.
CI checkouts already initialize submodules and use the same postinstall build.

## UX changes

- Visible tab/service/button controls are exposed to assistive technology;
  native keyboard activation, focus rings, translated labels and user zoom work.
- Empty-wallet issuance discovery is primary; QR scanning remains an alternative.
- Sharing names the recipient domain, presents readable claim labels, always
  provides Decline, permits deselection, and rejects incomplete selections.
  Display formatting never modifies signed credentials or protocol claim keys.
- Compact, responsive artwork leaves room for authentication controls. Recovery
  consistently uses passphrases/security questions and shows answer progress.
- Onboarding leads with benefits, explicit Continue/Get started and optional
  standards information. Credential expiry uses the selected locale; Profile
  does not carry an unrelated scan action.
