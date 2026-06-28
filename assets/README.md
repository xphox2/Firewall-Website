# Assets index

Generated image and video files live here. Naming convention is strict so the website build can pull them deterministically.

---

## `hero/`

| File pattern          | Purpose                              | Source prompt            |
|-----------------------|--------------------------------------|--------------------------|
| `hero-v1.png`         | Hero image, 1920×1080                | `prompts/hero.md`        |
| `hero-final.png`      | Post-production hero (with type)     | Edit after generation    |

## `features/`

| File pattern                       | Purpose                              | Source prompt            |
|------------------------------------|--------------------------------------|--------------------------|
| `f1-multivendor-snmp.png`          | Card 1 — multi-vendor SNMP           | `prompts/features.md` §1 |
| `f1-multivendor-snmp-final.png`    | Post-production card 1 (with type)   | Edit after generation    |
| `f2-config-drift.png`              | Card 2 — config diff                 | `prompts/features.md` §2 |
| `f2-config-drift-final.png`        | Post-production card 2               | Edit after generation    |
| `f3-sflow-ingest.png`              | Card 3 — sFlow                       | `prompts/features.md` §3 |
| `f3-sflow-ingest-final.png`        | Post-production card 3               | Edit after generation    |
| `f4-probe-relay.png`               | Card 4 — probe relay                 | `prompts/features.md` §4 |
| `f4-probe-relay-final.png`         | Post-production card 4               | Edit after generation    |
| `f5-single-container.png`          | Card 5 — single container            | `prompts/features.md` §5 |
| `f5-single-container-final.png`    | Post-production card 5               | Edit after generation    |
| `f6-audit-posture.png`             | Card 6 — audit posture               | `prompts/features.md` §6 |
| `f6-audit-posture-final.png`       | Post-production card 6               | Edit after generation    |

## `social/`

| File pattern                       | Platform     | Resolution   |
|------------------------------------|--------------|--------------|
| `x-vendor-profiles.png`            | Twitter / X  | 1600×900     |
| `x-vendor-profiles-final.png`      | Twitter / X  | 1600×900     |
| `x-config-drift.png`               | Twitter / X  | 1600×900     |
| `x-config-drift-final.png`         | Twitter / X  | 1600×900     |
| `x-audit.png`                      | Twitter / X  | 1600×900     |
| `x-audit-final.png`                | Twitter / X  | 1600×900     |
| `linkedin-vendor-profiles.png`     | LinkedIn     | 1200×627     |
| `linkedin-vendor-profiles-final.png` | LinkedIn   | 1200×627     |
| `linkedin-probe-relay.png`         | LinkedIn     | 1200×627     |
| `linkedin-probe-relay-final.png`   | LinkedIn     | 1200×627     |
| `discord-banner.png`               | Discord      | 960×540      |
| `discord-banner-final.png`         | Discord      | 960×540      |

## `video/`

| File pattern                          | Orientation | Resolution   | Duration |
|---------------------------------------|-------------|--------------|----------|
| `promo-horizontal-raw.mp4`            | Horizontal  | 1920×1080    | ~6–8s    |
| `promo-horizontal-final.mp4`          | Horizontal  | 1920×1080    | 6s       |
| `promo-vertical-raw.mp4`              | Vertical    | 1080×1920    | ~6–8s    |
| `promo-vertical-final.mp4`            | Vertical    | 1080×1920    | 6s       |
| `promo-loop-1.5s.mp4` (optional)      | Horizontal  | 1920×1080    | 1.5s     |

---

## Final-asset checklist (for the website build to consume)

Before the website build pulls from this folder, confirm:

- [ ] `hero/hero-final.png` exists, 1920×1080, < 250 KB (mozjpeg or webp recompress if larger)
- [ ] All six `features/f<n>-final.png` exist, 1600×1600, < 180 KB each
- [ ] Six social tiles finalised, each < 150 KB
- [ ] Both videos finalised, < 5 MB each, H.264, sRGB
- [ ] All `*-final.png` files have had typography overlaid per each prompt's post-production checklist
- [ ] All assets cross-checked against `brand/style-guide.md` §8 "would this fit on tailscale.com" test
- [ ] No asset contains readable text other than the post-production overlays (overlays are added in the website build, not in the source images)