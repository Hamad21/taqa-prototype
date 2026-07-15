# Quality Team — Power Technical Support portal

Internal portal for the Quality Team (Power Technical Support), styled with the
TAQA Distribution brand. Static site, hosted on GitHub Pages.

**Live:** https://hamad21.github.io/taqa-prototype/

## Sections

- **Inspection & quality checklists** — downloadable Word (`.docx`) checklists, each with a reference number and last-updated date.
- **Quality Awareness Corner** — downloadable good-practice PDFs.
- **Jointing in Weather Conditions** — a dedicated guidance page (`jointing-weather-conditions.html`) plus a printable field-guide PDF.
- **Quality Team contacts** — team emails and a general Quality Team inbox.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Portal landing page |
| `jointing-weather-conditions.html` | Jointing-in-weather guidance page |
| `assets/styles.css` | Design system (TAQA colours, Roboto type) |
| `assets/logo-dark.svg`, `assets/logo-white.png` | TAQA logo |
| `documents/checklists/*.docx` | Inspection checklists |
| `documents/awareness/*.pdf` | Awareness Corner PDFs |
| `gen_checklists.py`, `gen_pdfs.js` | Generators used to produce the downloadable documents |

## Document register

| Ref. | Title | Type | Last updated |
|---|---|---|---|
| QT-PTS-CHK-001 | LV & MV Cable Jointing Inspection Checklist | Word | 08 Jul 2026 |
| QT-PTS-CHK-002 | Cable Laying & Backfilling Inspection Checklist | Word | 24 Jun 2026 |
| QT-PTS-CHK-003 | Jointing in Adverse Weather — Pre-Work Checklist | Word | 12 Jul 2026 |
| QT-PTS-CHK-004 | Substation Cable Termination Quality Checklist | Word | 02 Jul 2026 |
| QT-PTS-QA-001 | Common Jointing Defects & How to Avoid Them | PDF | 05 Jul 2026 |
| QT-PTS-QA-002 | Workmanship Standards for Cable Accessories | PDF | 28 Jun 2026 |
| QT-PTS-QA-003 | Jointing in Weather Conditions — Field Guide | PDF | 12 Jul 2026 |

## Notes

- Contact emails and names are **placeholders** (`*@taqa.example`) — replace with the team's real details.
- Document content is general Quality Team good-practice; it does not replace manufacturer instructions or the project specification.
- Editing: change files here, then `git commit` and `git push` — GitHub Pages rebuilds automatically.
- To regenerate the documents: `python gen_checklists.py` and `node gen_pdfs.js`.
