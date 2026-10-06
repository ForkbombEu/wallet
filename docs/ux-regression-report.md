# UX regression verification

Implemented the five priorities from the Impeccable review in the wallet and its
local `didroom-components` checkout, preserving the existing DIDroom identity.

## Verified locally

- Node 22.23.2; frozen installation and Stencil production build passed.
- Wallet web production build passed.
- Localization lint passed; translations cover English, Italian, German,
  Spanish and French.
- Wallet: **19 unit tests** in 6 files passed.
- Components: **51 unit tests** in 40 suites passed.
- UX: **45 Playwright checks** passed across 390×844 light, 360×640 dark and
  1440×1000 desktop.
- Nine axe runs (login, empty wallet and sharing at all three viewports) found
  **no serious or critical violations**.
- Captures cover onboarding, login, passphrase recovery, security questions,
  empty/populated wallet, Profile and sharing.
- Existing production-build integration discovery remains **81 tests**;
  that backend-dependent suite was not executed for this UX change.
- Diff whitespace checks passed.

The verification includes real keyboard activation and label focus, working
pre-selection Decline without a presentation, reversible credential selection,
unchanged signed payloads on explicit Share, answer progress, issuance discovery,
and scrollable welcome/account actions. Browser fixtures intercept all external
HTTP requests; no real account or verifier is used.

## Important limits

Native VoiceOver/TalkBack, biometric auth, scanner and actual software keyboards
still require Android/iOS device checks. Viewport emulation and axe are not
substitutes for these checks. Cryptographic/backend interoperability is not
validated by the synthetic UX suite.

`pnpm check` still reports the inherited schema-type error in
`src/lib/forms/form.svelte:33` (`ZodTypeAny` versus `ZodObjectType`). The three
other previously recorded errors were removed while fixing modal/toggle UI.

The existing Tailwind Prettier plugin crashes with the installed formatter's
visitor API. Touched Svelte files were formatted with the Svelte plugin alone;
formatter dependencies were deliberately not changed during this UX task.

## Repository handoff

Wallet branch: `fix/impeccable-wallet-ux`.
Components branch: `fix/wallet-accessibility-and-ux`.

The work is being submitted as two draft PRs, not as a finished UI. Visual polish
remains pending following the user's local review; no additional UI changes were
made during the draft handoff.

Components: [draft PR #226](https://github.com/ForkbombEu/didroom-components/pull/226),
published from `phoebus-84/custom-didroom-components`. The wallet pins that published
component commit. Fetching the exact SHA from the official component repository
was verified. See [local components](local-components.md) for the two-repository
workflow.
