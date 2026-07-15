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
| `documents/checklists/*.docx` | Controlled Quality Team inspection checklists (supplied Word files) |
| `documents/awareness/*.pdf` | Awareness Corner PDFs |
| `gen_pdfs.js`, `gen_handover.py` | Generators for the awareness PDFs and the IT handover document |

## Document register

| Ref. | Title | Type | Revision |
|---|---|---|---|
| PP.PPS.PTS.QT.04 | Pre-execution & Trench Excavation Checklist | Word | Rev 1 · Mar 2025 |
| PP.PPS.PTS.QT.05 | Cable Laying Checklist | Word | Rev 1 · Mar 2025 |
| PP.PPS.PTS.QT.06 | Cable Joint Checklist | Word | Rev 1 · Mar 2025 |
| PP.PPS.PTS.QT.06A | Cable Joint Guide — Uploading Pictures (Maximo) | Word | Rev 1 · Mar 2025 |
| PP.PPS.PTS.QT.07 | Equipment Installation Checklist | Word | Rev 1 · Mar 2025 |
| PP.PPS.PTS.QT.08 | Cable Termination Checklist | Word | Rev 1 · Mar 2025 |
| QT-PTS-QA-001 | Common Jointing Defects & How to Avoid Them (awareness) | PDF | 05 Jul 2026 |
| QT-PTS-QA-002 | Workmanship Standards for Cable Accessories (awareness) | PDF | 28 Jun 2026 |
| QT-PTS-QA-003 | Jointing in Weather Conditions — Field Guide (awareness) | PDF | 12 Jul 2026 |

*Checklists (QT.04–QT.08) are the controlled Quality Team documents. The three QA awareness PDFs are supporting good-practice material produced for the portal.*

## Notes

- Contact emails and names are **placeholders** (`*@taqa.example`) — replace with the team's real details.
- Document content is general Quality Team good-practice; it does not replace manufacturer instructions or the project specification.
- Editing: change files here, then `git commit` and `git push` — GitHub Pages rebuilds automatically.
- The checklists are the Quality Team's controlled Word files (references `PP.PPS.PTS.QT.04`–`08`). To regenerate the awareness PDFs: `node gen_pdfs.js`.
