# Screenshot and visual accuracy audit — 2 November 2026

The website distinguishes between **genuine platform screenshots**, **original how-to illustrations**, and **product icons**. It never represents a decorative illustration as a live screenshot.

## Publisher-hosted screenshots

| Tip/step | Depicted UI | Publisher reference | Verification |
| --- | --- | --- | --- |
| `t22`, step 2 | macOS Tahoe 26 Screenshot toolbar: recording mode and Options | Apple Support: https://support.apple.com/en-in/102618 | Original screenshot visually checked against Apple Support; shown uncropped |
| `t24`, step 2 | Outlook for Mac Send dropdown → Schedule Send | Microsoft Support: https://support.microsoft.com/en-us/outlook/use-schedule-send-in-outlook-for-mac | Original image and text verified |
| `t24`, step 3 | Outlook for Mac scheduling date/time dialog | Same official Outlook guidance | Microsoft screenshot includes a September 2022 sample date; it is genuine but the interface may have changed. |
| `t38`, step 2 | Teams Calendar Work week dropdown, with Day, Week, Month | Microsoft Support: https://support.microsoft.com/en-us/teams/meetings/customize-your-calendar-in-microsoft-teams | Original image visually checked against Microsoft Support |

Publisher screenshots remain hosted by their owners; they are not redistributed in the repository. They are displayed with proportional sizing (`object-fit:contain`), direct source links and a clear fallback. Exact menus depend on app versions, policies and school accounts. Only images traceable to vendor materials should carry the **Real platform screenshot** label.

## Local instructional illustrations (not screenshots)

| Location | Artwork and provenance |
| --- | --- |
| `t48`, step 1 | `assets/guide-chrome-groups.svg` — original, clearly labelled diagram based on current Google Chrome Help: https://support.google.com/chrome/answer/2391819?hl=en . Replaces a dated 2022 Chrome image. |
| Homepage hero | `assets/hero-device.svg` — original decorative desktop; embedded app marks are actual current vendor vectors but display is illustrative |
| Popular Tips | `assets/thumb-*.svg` — original decorative task illustrations, not actual vendor UI captures |

## Legal, privacy and maintenance

Product marks and images are owned by the respective vendors and do not imply endorsement. Screenshot/brand use is subject to policies: Microsoft screenshots https://www.microsoft.com/en-us/legal/intellectualproperty/copyright/permissions ; Microsoft trademark https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks ; Google https://about.google/brand-resource-center/guidance/ ; Apple https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html . Obtain appropriate internal approval before broad distribution if required.

Never show identifiable students, faculty profiles, or live private accounts in screenshots. The notification screenshot containing a person’s profile was deliberately excluded.

When replacing any image, validate the exact menu, step association, browser/app version, working URL, privacy, licensing and alt text. Keep `lesson-media.js` and the corresponding static tip HTML synchronized. If a screenshot is uncertain or outdated, favour a clearly disclosed illustration plus a current official help link.
