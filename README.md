# TAQA Distribution — Business Overview replica

Static, self-contained replica of
`https://taqadistribution.com/addc/en-us/business/overview`
captured on 2026-07-15. Desktop rendering is 99.96% pixel-identical to the
live page (verified by automated screenshot diff); the only difference is the
removed third-party floating accessibility widget.

## Run it

```
python -m http.server 8123 --directory taqa-replica
```

then open http://localhost:8123/ — or use the `taqa-replica` entry in
`.claude/launch.json`. Serving from this folder as web root is required
because asset paths are absolute (`/_next/...`, `/assets/...`).

## What's inside

| Path | Purpose |
|---|---|
| `index.html` | Hydrated DOM snapshot of the live page (scripts stripped) |
| `_next/`, `assets/`, `favicon.ico` | All CSS/images/fonts mirrored from the site |
| `carousel.js` | Small vanilla script re-implementing the announcements + features carousels and mobile overflow fixes (the originals were React-driven) |
| `capture.js` | Tool: dumps JS-rendered DOM + full-page PNG of any URL via headless Edge (CDP, no npm deps). `node capture.js <url> <outPrefix> [width]` |
| `localize.js` | Tool: downloads all same-origin assets referenced by `original.html` and mirrors them locally |
| `qa/` | Reference screenshots + diff mask used to verify fidelity |

## Intentionally removed vs the live site

- Next.js runtime (page is a static snapshot; nav links point at the live-site paths)
- OneTrust cookie banner, Google Tag Manager / Analytics, accessibility widget
- Google Fonts still loads from `fonts.googleapis.com` (only external dependency)

## Known limitations

- Header dropdowns (Help & Support / Locations), search and login are static —
  the menus' content was never in the captured DOM (React rendered them on click).
- Mobile (<768px) is usable and scroll-clean, but the footer stacks slightly
  differently than the live site, which swaps in a different mobile footer
  component at runtime.
