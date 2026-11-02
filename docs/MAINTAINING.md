# Maintaining MacBook Productivity

## Purpose

This is a **reference site**, not a course. The goal is fast, independent access to dependable instructions. Do not reintroduce quizzes, scores, completion tracking, progress meters or mandatory practice tasks. Optional illustrative examples and alternative step-by-step reading modes are appropriate.

## Editorial standards

- Every entry addresses one specific task, with a clear location/shortcut, three accurate steps and an optional safe example
- Validate Apple, Microsoft and Google instructions against current official documentation, and preferably the actual school-managed versions
- Note software-version, account and school-configuration differences without claiming all features are universally available
- Keep IDs stable so existing bookmarks and direct links do not break
- Never use personal or student data as sample content
- Prefer task-based titles ("Schedule an email") over feature jargon

## Visual material

Selected vendor originals are linked from lesson-media.js; see docs/SCREENSHOT_SOURCES.md. The source must be current enough to illustrate the relevant step and must not contain identifying personal information.

Images are shown in full with object-fit:contain, never edited/cropped/overlaid. Their full-size originals and source documents are linked. Vendor images may be disallowed or unavailable and will fall back to the labelled conceptual diagram.

If creating school-owned captures using test accounts, scrub all protected/private data, verify usage permissions, use consistent framing, provide accurate alt text, and record app version and capture date. Videos require captions and transcripts.

## Accessibility and usability review

- Entire reference works with keyboard alone, at 200% zoom and on a 320px-wide mobile viewport
- Search is visible immediately and accepts everyday task language
- Opening a tip shows all its steps without forcing progression
- Optional one-step view does not impose scoring or completion requirements
- Images are supplemental; every operation remains in readable text
- Voice playback is optional; images have descriptions and source captions
- Dialog opening, Escape/Back handling and focus restoration work
- Favourites operate without an account and can be cleared from the site
- Colour contrast, focus indication and reduced-motion preferences are retained

## Publishing

Run npm run check and npm run test:browser against a local HTTP server and inspect generated desktop/phone screenshots. Merge or fast-forward the tested revision to main. Confirm both quality and deploy GitHub Actions jobs succeeded and check the public URL.

## Release v3 editorial process

Each tip is a static HTML reference page in `tips/<id>.html`. Content lives in `content.js`; regenerate affected tip pages when changing it, or the permanent page and search results can diverge. Do not claim a source is fully verified on AISG-managed Macs unless it has been directly tested. Use `sourceChecked` only for a documented official-link check.

Check typo and intent cases in `tests/search-check.mjs`; for example "mute teams messages", "reopen closed Chrome tab" and "two windows side by side". Correct the search metadata rather than hiding poor results.

Translation drafts cover 15 selected guides, with their draft status visible to faculty; do not claim comprehensive translations. Have English-speaking and native Chinese/Korean faculty review vendor UI terminology before making them official.

Individual pages have accessible, fully readable steps without JavaScript; optional saving, sharing, image zoom and translations enhance this. Each image uses proportional fit and labelled original source. On failed load, show the vendor source and step text.
