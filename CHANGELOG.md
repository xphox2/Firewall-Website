# Changelog

All notable changes to the Firewall-Mon marketing website are documented here.
This file follows [Keep a Changelog](https://keepachangelog.com/) conventions; versions are newest-first.

## [0.1.2] - 2026-06-28

### Fixed
- Header no longer breaks when switching to longer-text languages. Previously the
  long French/German nav squeezed the logo until "Firewall-Mon" wrapped onto two
  lines and the header grew to ~96px. Verified with Playwright across en/fr/de at
  1280px and 1600px.
- Replaced the fixed-width mobile breakpoint with a **language-aware collapse**:
  the inline horizontal nav now switches to the hamburger drawer at ≤1080px for
  English and ≤1500px for long-text languages (de, fr, es, pt, it, ru), so those
  languages get the clean drawer instead of an overflowing/wrapping header. Logic
  lives in `setupMobileNav()` (`js/main.js`), toggling `.site-header.nav-collapsed`
  on load, resize, and `languageChanged`.
- The drawer CSS is now keyed off the `.nav-collapsed` class (was a `@media`
  query) so it can be driven by the language-aware logic above.
- `.logo` is now `flex-shrink: 0` + `nowrap` so the brand never wraps regardless
  of nav width.

## [0.1.1] - 2026-06-28

### Fixed
- Navigation no longer wraps to two lines (with large gaps) when switching to
  languages with longer labels (French, German, etc.). Added `white-space: nowrap`
  to nav links, the GitHub/Install buttons, and the language picker via `.main-nav`,
  and tightened the desktop nav gaps.
- Status badges (e.g. the demo "6 ONLINE" / "6 EN LIGNE") no longer break onto a
  second line in longer languages — `.badge` is now `nowrap` + `flex-shrink: 0`,
  with a gap added to `.sidebar-header` so the title and badge never collide.
- Raised the mobile-nav (hamburger drawer) breakpoint `991px` → `1100px` so longer
  translated menus collapse cleanly to the drawer on smaller laptops instead of
  overflowing the horizontal header.

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
