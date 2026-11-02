# MacBook Productivity — AISG Faculty Learning

Live site: https://edtechevans.github.io/MacBook/

A modern, accessible, mobile-friendly, self-paced learning companion for MacBook, Outlook, Teams and Google Chrome. It contains **51 reviewed PD walkthroughs and four clearly labelled bonus tips**.

## Learner experience

Start with the working homepage search, browse by application or follow a six-skill pathway. Walkthroughs include:

- Guided mode: one action at a time, a conceptual visual orientation map or keyboard diagram, progress, and a practice activity.
- Quick answer: the same verified instructions in one compact view.
- Help: account/version caveats and vendor documentation.
- Optional read-aloud: browser speech playback where supported, with full written steps always available.
- Save and share: favourites, deep links, and printable versions of individual tips or all 55.
- Practice lab: shortcut quiz and local progress tracking with personalised suggestions.

Settings and learning progress are stored in the visitor's browser. No accounts, student information, analytics, or cloud sync. A small JSON progress backup can be exported/imported; the site also has offline support after its first successful visit in compatible browsers.

**Language:** Interface navigation offers English, Simplified Chinese and Korean. Detailed step-by-step lesson instructions remain in English until each technical translation is verified.

**Visual accuracy:** Most guided lessons use conceptual maps; selected lessons now also show genuine, unaltered publisher-hosted screenshots. Official vendor documentation accompanies every lesson. See docs/MAINTAINING.md for guidance on creating and validating real annotated screenshots.

## Local development

Start a local server with: python3 -m http.server 8080

Open http://localhost:8080/. The standalone printable guide is at /print.html; print a particular tip via /print.html?tip=t22.

The site has no production dependencies or backend. Source files:
- index.html: structure and accessibility landmarks
- styles.css: responsive high-contrast interface
- content.js: 55 lesson records
- app.js: search, lessons, history, progress, quiz and UI options
- print.html and print.js: full print-to-PDF guide
- service-worker.js, manifest.webmanifest: optional install/offline experience
- tests/: static and real-browser checks

## Updating lessons

Edit content.js; retain a lesson's stable ID so deep links and saved progress survive. Each lesson needs category, title, location, exactly three short instructions, a safe practice activity, any app/version caveat and an official HTTPS support source.

1. Verify instructions against Apple, Microsoft or Google and a representative school-managed device.
2. Make minimal, accurate changes with no student/private data.
3. Run tests and check screenshots.
4. Update review date statements after re-auditing.
5. Publish via main after checks succeed.

Full editorial and visual evidence instructions: docs/MAINTAINING.md.

## Test and deploy

Install dev tools: npm install

Run static checks: npm run check

Install Chromium for testing: npx playwright install chromium

Start local HTTP server in a separate terminal, then run: npm run test:browser

GitHub Actions performs those checks automatically on pushes to the development branch and main. When main passes, Pages deploys to the live site. The repository must have Pages configured to use GitHub Actions.

**Accessibility:** WCAG 2.2 AA is the design target, not a certification. Automation should be supplemented with VoiceOver, keyboard-only, zoom, cognitive accessibility and real faculty testing.

This independent learning resource is not affiliated with Apple, Microsoft or Google.

## Actual platform screenshots

A first set of official product screenshots now appears at the correct steps in selected MacBook, Outlook, Teams and Chrome walkthroughs. These are original vendor-hosted images, scaled proportionally, with source attribution, an image link and an illustrated alternative. See [sources and usage](docs/SCREENSHOT_SOURCES.md). Full in-app screenshots are not yet available for every tip.
