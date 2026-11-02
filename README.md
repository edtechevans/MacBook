# MacBook Productivity — AISG faculty reference

**Live website:** https://edtechevans.github.io/MacBook/

This is a lightweight, accessible **productivity tips reference**, not a training course. It contains 51 reviewed PD tips and 4 bonus entries covering macOS, Outlook, Microsoft Teams and Chrome.

## How people use it

- Search from the homepage for what they need, in everyday language
- Browse the four applications or curated topic collections
- Open any tip to see **all instructions immediately**, including exact menu/shortcut paths
- Switch to **one step at a time** when detailed guidance would help
- View genuine publisher-owned screenshots in selected tips, with links to original sources, clear licensing acknowledgements and an illustrated fallback
- Open a short cheat sheet of common keyboard shortcuts
- Save favourite tips in the same browser for future reference
- Copy a direct link to any tip, open official vendor support or print full written instructions

**No quizzes, assessment scores, learning-completion buttons, progress dashboards or practice requirements** appear in the public experience. Any "Practical example" is optional context, not an assessment.

The site does not collect identities, student information, analytics, account data or assessment records. Favourites are saved only in local storage on the visitor's device; no account is required.

## Content

- content.js: 55 instruction records with stable IDs, app, title, location, three instructions, optional note, safe example and official reference
- lesson-media.js: carefully selected publisher-hosted screenshots with their source and alt text
- docs/SCREENSHOT_SOURCES.md: image provenance, restrictions and future image maintenance
- index.html / styles.css / app.js: reference interface and tip viewer
- print.html / print.js: full printable instructions and individual printable tips
- service-worker.js: optional offline caching after the first supported visit
- docs/MAINTAINING.md: editorial and accessibility maintenance

Menus and features change depending on app version, macOS version, account type and school-managed settings. Do not assume that any screenshot represents the exact AISG configuration. Detailed tips are in English; main navigation offers optional Chinese/Korean translation.

## Development

No production framework, backend or build pipeline is needed:

1. Start a local server: python3 -m http.server 8080
2. Open http://127.0.0.1:8080
3. Open /print.html for the full printable reference; /print.html?tip=t22 for a particular tip

## Behind-the-scenes quality checks

Testing is for **developers, not learners**. It is not part of the public site's navigation.

Run npm install, npm run check, npx playwright install chromium, then run the local web server in a separate terminal and execute npm run test:browser. GitHub Actions checks source integrity, search, keyboard behaviour, mobile reflow, external image/fallback integration and automated WCAG 2.2 AA rules before deployment.

GitHub Pages deploys automatically from main after quality checks pass. Automated checks are not a substitute for manual screen reader, zoom, keyboard or faculty usability review.

This independent resource is not affiliated with Apple, Microsoft or Google.
