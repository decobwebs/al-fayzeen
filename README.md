# Al Fayzeen build pack

Unzip into an empty project folder, open it in VS Code, start Claude Code, and paste the phases in `docs/BUILD-PROMPTS.md` one at a time.

| File | What it is |
|---|---|
| `CLAUDE.md` | Rules Claude Code follows on every task: stack, design, motion, truth rules, definition of done |
| `docs/SITE-SPEC.md` | Every page and section, with final copy, layout and motion |
| `docs/BUILD-PROMPTS.md` | The 11 build phases to paste, each with review checks |
| `app/assets/css/tokens.css` | Colours, fonts, spacing, motion, glass, photo grade |
| `app/data/assets.ts` | 11 ready media slots + 23 pending skeleton slots with search keywords |
| `app/data/site.ts` | Company facts (all unconfirmed facts are `null` and show as gaps) |
| `app/data/packages.ts, hotels.ts, flights.ts, transport.ts, visa.ts, faqs.ts` | Sample data for the prototype |

Adding a real photo later: put it in `public/images/` with the slot's file name and change its `status` to `'ready'` in `assets.ts`.
