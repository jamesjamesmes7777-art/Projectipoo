---
name: OmniTradeX dual i18n systems
description: The marketing site and the certificate view use two separate, differently-sized i18n maps
---

OmniTradeX has TWO independent translation systems — do not assume one covers the other:

- `artifacts/omnitradex/src/i18n/translations.ts` — the **marketing site** strings (Header, Hero, Inventory, etc.). `LangCode` here supports only **5 languages**: `en | el | it | de | es`. This file is large (~1000+ lines).
- `artifacts/omnitradex/src/lib/certI18n.ts` — the **certificate / verify page** strings. Supports **7 languages** (adds `fr`, `ar` with RTL).

**How to apply:** For new UI on the marketing site (modals, CTAs), target the 5 `LangCode` values from `LangContext`/`translations.ts`. To avoid editing the huge `translations.ts`, keep feature-local strings self-contained in the component (a `Record<LangCode, ...>` map with an `en` fallback), mirroring how `certI18n.ts` is kept separate. The `AllocationModal` follows this pattern.

**Why:** Editing the 1000-line `translations.ts` to add one section across 5 language objects is error-prone; self-contained string maps are safer and the codebase already establishes this split.

**Locale-sensitive formatting:** Any `toLocaleTimeString`/`toLocaleString`/`Intl.*` call on the marketing site must use `getLocale(lang)` (exported from `translations.ts`), never a hardcoded `'en-US'`. Sub-components that format dates/numbers (e.g. the `CandleChart` inside `StockChart`) should receive the resolved locale as a prop rather than calling `useLang` redundantly. Proper nouns (legal company names like "Space Exploration Technologies Corp.") and unit/quarter shorthand ("Q4 2026", the `s` seconds suffix) are intentionally left literal — they are not English prose to translate.
