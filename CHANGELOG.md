# Changelog

All notable changes to the Firewall-Mon marketing website are documented here.
This file follows [Keep a Changelog](https://keepachangelog.com/) conventions; versions are newest-first.

## [0.2.15] - 2026-07-18

### Fixed
- Feature cards did nothing on click: `js/main.js` (which holds the card
  click-to-expand modal handler added in 0.2.12) and `js/i18n.js` were loaded
  without a cache-buster, so browsers kept serving the pre-modal cached copy.
  Added `?v=0.2.15` to both script tags in index.html and docs.html.

## [0.2.14] - 2026-07-18

### Changed
- Hero loop trimmed to the 8–14s segment of the source clip (6s, `hero-loop.mp4`).
  The original opened with ~6 flat seconds as the image-to-video model eased out
  of the still anchor frame; the loop now starts in the animated portion. Video
  source gains a `?v=0.2.14` cache-buster so returning visitors get the new clip.

## [0.2.13] - 2026-07-18

### Changed
- Re-translated the strings reworded in v0.2.12 into all 9 non-English locales
  (de, es, fr, it, ja, ko, pt, ru, zh) — hero subtitle/stats, security intro,
  feature intro/descriptions, the 8 feature-detail modal texts, and the "Details"
  affordance. Technical terms and product names stay in English by convention;
  the sflow intro's `<strong>` markup is preserved. Replaces the English
  placeholders noted in v0.2.12.

## [0.2.12] - 2026-07-18

### Changed
- **Hero stat row simplified**: "0 Open / Continuously Audited" and "8 / Vendors
  Supported" replaced with cleaner "Multi-Vendor Support · Self-Hosted · MIT".
- **Reduced vendor-name exposure in marketing copy**: removed the FortiGate/Palo
  Alto/Cisco ASA/… vendor list from the hero subtitle and feature card 1, and the
  "eight firewall families/vendors" counts, in favour of "every major firewall
  platform" / "multi-vendor". The Live Demo simulator and config-drift widget keep
  their realistic device names (product demo, not advertising).
- **Security section reworded**: dropped the "170-finding review / hundreds of
  findings fixed" claim for a cleaner "independently audited, open findings stay at
  zero" message; trimmed the duplicated "zero open" phrasing that appeared 5×.
- **Capability cards**: removed the 01–08 number pills and made each card
  click-to-expand into an accessible modal (Esc / backdrop / keyboard close) with a
  fuller description of what the feature does. New `features.cardN_detail` strings.
- **Feature grid alignment**: 8 cards now lay out as an even 4×2 (was 3-col leaving
  an orphan cell); added a 2-col tablet breakpoint and even mobile section rhythm.
- Refreshed the on-site product changelog (docs.html) to v0.11.118 — added the
  report-redesign and Event Rule Profiles highlights.

### Removed
- Duplicate footer credit line (the "TechnicalLabs project created by Xphox" text
  appeared twice; the copyright line retains it).
- Assorted redundant copy: repeated "vendor-agnostic", the duplicated config-drift
  explanation, the second "30 seconds to first poll", and the "10× faster than ORM"
  micro-brag.

### Note
- Several reworded strings are English across all 10 locales pending re-translation
  (i18n key parity is maintained; runtime falls back to English regardless).

## [0.2.11] - 2026-07-18

### Fixed
- **Social share card "No Text" artifact removed.** The generated og-card had the
  literal words "No Text" (and gibberish labels) rendered in a dashboard panel.
  Cleaned via an AI image edit that replaced all dashboard text with abstract
  chart shapes while preserving the composition, then re-cropped to 1200×630.
  og:image / twitter:image cache-buster bumped to `?v=0.2.11`.

## [0.2.10] - 2026-07-18

### Changed
- Swapped three feature-card images for newer takes: card 1 Multi-Vendor SNMP
  (`f1-multivendor.png`), card 4 Probe-Relay Architecture (`f4-probe-relay.png`),
  and card 8 Enterprise Alerting (`f8-alerting.png`). Cache-busters bumped to
  `?v=0.2.10`.

## [0.2.9] - 2026-07-18

### Added
- **Open Graph & Twitter Card meta tags** in index.html so shared links unfurl
  with a rich preview (previously there were none). Points at
  `https://firewall-mon.technicallabs.org/assets/social/og-card.png` (1200×630),
  with `og:type/site_name/title/description/url/image` and
  `twitter:card=summary_large_image`.

## [0.2.8] - 2026-07-18

### Changed
- **Feature-card art refresh complete (batch 2 of 2).** New on-palette images for
  cards 4–6: `f4-probe-relay.png`, `f5-single-container.png`,
  `f6-audit-posture.png` (also the favicon). Recompressed to ~160–430 KB.

### Added
- **Cards 7 & 8 now have real art** instead of CSS gradients: `f7-roles-2fa.png`
  (Roles & 2FA) and `f8-alerting.png` (Enterprise Alerting). Dropped the
  `feature-card--noimg / --access / --alerting` classes; both cards now use the
  same image-backed treatment as cards 1–6, completing the 8-card grid.
- Social share image generated and cropped to the 1200×630 Open Graph standard:
  `assets/social/og-card.png` (meta tags wired in a follow-up).
- Cache-busters (`?v=0.2.8`) on cards 4–8 and the favicon so the new art loads.

## [0.2.7] - 2026-07-18

### Fixed
- Cache-bust the refreshed feature images (`f1-multivendor.png`,
  `f2-config-drift.png`, `f3-sflow.png` → `?v=0.2.6`). Because the new art reused
  the original filenames, returning visitors' browsers would keep serving the old
  cached images; the version query forces a fresh fetch.

## [0.2.6] - 2026-07-18

### Changed
- **Refreshed feature-card art (batch 1 of 2).** New AI-generated images for the
  first three feature cards, matched to the GitHub-dark / blue (#58a6ff) palette:
  `f1-multivendor.png` (Multi-Vendor SNMP), `f2-config-drift.png` (Risk-Classified
  Config Diffs), `f3-sflow.png` (Multi-Protocol Flow). Each recompressed to
  ~220–275 KB (JPEG q72, 1024×1024) to keep page weight in line with the originals.
  Cards 4–8 and the social share card to follow.

## [0.2.5] - 2026-07-18

### Changed
- **Hero loop clip updated** to the newer g014 take (15 seconds, 960×960 square,
  ~5.1 MB), replacing g013. Same `assets/hero/hero-loop.mp4` slot; the existing
  `video.hero-image { aspect-ratio: 16/9; object-fit: cover; }` crops the square
  source to the card frame, so no markup or CSS change was needed.

## [0.2.4] - 2026-07-18

### Fixed
- **Correct hero loop clip.** v0.2.3 shipped the wrong video (a same-named clip
  from a different Scene-Forge scene). `assets/hero/hero-loop.mp4` is now the
  intended 6-second firewall clip (1424×1424, byte-identical to the user's
  selected file), CSS-cropped to the card's 16:9 frame via
  `video.hero-image { aspect-ratio: 16/9; object-fit: cover; }` — no re-encode,
  no layout shift.
- Bumped the stylesheet cache-buster (`style.css?v=0.2.4`) in index.html and
  docs.html — without it, returning visitors would never receive the new CSS.

## [0.2.3] - 2026-07-18

### Added
- **Ambient hero video.** The static hero illustration is replaced by a 10-second
  AI-generated looping clip (`assets/hero/hero-loop.mp4`, 960×540 H.264, ~5.5 MB)
  playing inline: `autoplay muted loop playsinline preload="metadata"` with the
  existing `hero.png` as poster and `<img>` fallback, so first paint is instant and
  browsers without autoplay still show the still. The video element reuses the
  `.hero-image` class, preserving the lighten blend and card layout with no
  layout shift.
- `.playwright-mcp/` added to `.gitignore` (local browser-test artifacts).

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
