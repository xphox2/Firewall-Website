# Lessons

## 2026-07-18 — Use the exact file the user points at
When the user names a specific file ("g013-a in my Downloads folder"), use that
exact file (verify by checksum), never a "better" copy found elsewhere.
Scene-Forge generation IDs (g001, g013…) repeat across scenes — the same
filename exists in multiple scene folders, so a name match is NOT an identity
match. This caused the wrong hero video to ship in v0.2.3.

## 2026-07-18 — style.css is cache-busted
`css/style.css` is loaded as `style.css?v=X.Y.Z` in BOTH index.html and
docs.html. Any CSS change requires bumping that version string in both files or
returning visitors (and local testing) silently keep the old stylesheet.
