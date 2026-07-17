# Changelog

All notable changes to the Firewall-Mon marketing website are documented here.
This file follows [Keep a Changelog](https://keepachangelog.com/) conventions; versions are newest-first.

## [0.2.2] - 2026-07-17

### Fixed
- **FortiGate NetFlow guide — denied-traffic section corrected.** Live verification (FortiOS 7.4,
  controlled denied traffic, collector sequence accounting) proved FortiOS does not export blocked
  sessions via NetFlow, even with `ses-denied-traffic` enabled. Section 3 rewritten: denied-traffic
  visibility on FortiGate comes from syslog (`action="deny"` forward logs + implicit-deny logging);
  `ses-denied-traffic` documented as a CPU optimization only. Generic NetFlow / IPFIX section now
  attributes `firewall_event = denied` records to Cisco ASA NSEL and Palo Alto exporters only.

## [0.2.1] - 2026-07-16

### Added
- **FortiGate NetFlow Setup guide** (docs page, Vendor Setups) — mirrors the sFlow guide: collector
  config for FortiOS 7.0/7.2 (flat fields) and 7.4+ (collector table), per-interface
  `netflow-sampler`, denied-session export (`ses-denied-traffic` per-VDOM +
  `block-session-timer` global, with correct config-tree placement), on-box verification, and
  the sFlow+NetFlow dual-export/dedup note. The generic NetFlow / IPFIX section now points
  FortiGate operators at it.

## [0.2.0] - 2026-07-05

Major content refresh bringing the site up to date with the Firewall-Mon **v0.11** program
(server v0.11.31 / collector v1.3.5). Prior versions advertised server v0.10.498.

### Added
- **Access Control & Identity** section — RBAC (admin/operator/viewer), TOTP two-factor
  authentication with recovery codes, and scoped API tokens.
- **Enterprise Alerting & On-Call** section — incident grouping, escalation step chains,
  smart thresholds (hysteresis + z-score baselining), flap suppression, and an integrations
  panel (Email, Slack, Discord, Webhook, IRC, PagerDuty, Opsgenie, Microsoft Teams) with
  MTTA/MTTR reporting. Two new nav entries (Access, Alerting).
- **Cisco ASA** device added to the live dashboard simulator (7 online), with realistic
  Cisco enterprise-MIB metrics and an NSEL denied-flow log line.
- Two new feature-grid tiles: "Roles & 2FA" and "Enterprise Alerting" (gradient tiles).
- docs.html: NetFlow / IPFIX setup guide, a v0.11 changelog entry, and the full 8-vendor
  profile map.

### Changed
- **Flow section** reworked from "sFlow v5 Flow Analyzer" to **Multi-Protocol Flow
  Analytics** — sFlow + NetFlow v5/v9 + IPFIX, a flow-source column, and a denied-flow row.
- **Vendors 6 → 8** everywhere (hero, why, features, README, simulator): added Cisco ASA
  and a generic SNMP profile.
- **Security** section reframed from a frozen "170 findings" to continuous-auditing language.
- Quick start now uses the **published Docker Hub image** (`xphox/firewall-mon`) instead of a
  local build, and documents the NetFlow (2055/udp) and IPFIX (4739/udp) ports.
- Removed the build-version display entirely (hero "Latest Release" badge, nav version pill, footer version line) and the dead GitHub release poller — a marketing site doesn't need to track the product version. Hero subtitle broadened.
- Simulator VPN/HA status logic made robust (parses "up / total" instead of matching
  hardcoded strings; healthy Active-Standby pairs now read green).
- All new/changed copy translated across the 10 locales (key parity preserved).
- CSS cache-bust bumped to `?v=0.2.0`.

## [0.1.4] - 2026-06-28

### Changed
- Reworked how the header nav handles long-text languages. Instead of collapsing
  French/German/etc. to the hamburger drawer on desktop, the inline bar now
  **auto-shrinks to fit**: `fitNav()` (`js/main.js`) sets a `--nav-scale` custom
  property that scales the nav's font-size/gaps/padding down (1.0 → 0.74) just
  enough to keep everything on one tidy line, preserving a comfortable gap between
  the logo and the menu. It only falls back to the hamburger drawer when even the
  minimum scale can't fit (genuinely narrow screens, or the longest language —
  Russian — below ~1400px).
- Driven by a `--nav-scale` variable on `.main-nav` / `.nav-links` /
  `.github-stars-btn` / header `.btn-sm` (`css/style.css`); scaled properties have
  their CSS transition disabled so `fitNav()` can measure each step synchronously.

### Verified (Playwright)
- All 10 languages render as a single-row bar with a ≥40px logo gap, no horizontal
  scrollbar, at 1366px+; at 1280px only Russian uses the drawer. Sticky header and
  drawer open/close confirmed across widths 1366/1280/1024.

## [0.1.3] - 2026-06-28

### Fixed
- Eliminated a horizontal scrollbar / page overflow. The off-canvas nav drawer
  (`position: fixed`, parked off-screen right via `translateX(100%)`) extended the
  document's scrollable width; since it's `fixed`, `body { overflow-x }` couldn't
  clip it. Added `overflow-x: clip` to `html` (root) to clip it.
- Switched `body`'s `overflow-x: hidden` → `overflow-x: clip`. `hidden` was
  silently breaking the `position: sticky` header (it turns body into a scroll
  container); `clip` prevents overflow without that side effect, so the sticky
  header now actually sticks on scroll. Verified with Playwright: no horizontal
  scrollbar, sticky header pinned at top:0 on scroll, drawer opens in-viewport.

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
