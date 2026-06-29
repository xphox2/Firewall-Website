# Changelog

All notable changes to the Firewall-Mon marketing website are documented here.
This file follows [Keep a Changelog](https://keepachangelog.com/) conventions; versions are newest-first.

## [0.1.0] - 2026-06-28

First tracked release. Captures the localization work merged from PR #1
("Localization and menu updates", marklapointe) plus follow-up polish fixes.

### Added
- Internationalization (i18n) across the site: 10 languages
  (en, de, es, fr, it, ja, ko, pt, ru, zh) driven by `js/i18n.js` and
  `locales/*.json`, with a navbar language picker and `localStorage` persistence.
- Mobile navigation drawer with hamburger toggle (`setupMobileNav` in `js/main.js`).
- Docker/Make tooling: `Makefile`, expanded `docker-compose.yml` (prod + dev
  profiles, healthchecks), and `scripts/check-i18n.js` locale key-parity checker.

### Fixed
- Hero "Read the docs" link now points to the `master` branch (the repo's only
  branch); previously `main` (404). *(included in PR #1)*
- Footer "MIT License" links in `index.html` and `docs.html` corrected
  `blob/main/LICENSE` → `blob/master/LICENSE`.
- `fr.json` `sflow.intro`: restored the `<code class="mono-code">pgx COPY</code>`
  styling wrapper that was dropped in translation.
- `de.json` `vpn_trend_alert`: "Tunnel-Degradierung Alert" →
  "Tunnel-Degradierung Warnung" (was left partially in English).
- `ja.json` `footer.copyright` and `footer.labs_created`: restored the
  `Xphox Networks` hyperlink to `xphox.net` to match the English source.

### Verified
- All 10 locale files parse and have exactly 170 keys matching `en.json`
  (zero missing/extra).
- Every `data-i18n` key in the HTML and every `window.t()` key in `js/main.js`
  resolves, including the dynamic `devices.*` lookups.
