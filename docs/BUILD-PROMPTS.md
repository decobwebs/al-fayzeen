# Build prompts for Claude Code (VS Code)

Paste **one phase at a time**. Don't start the next phase until the current one passes its checks. After each phase, take the screenshots it lists and share them for review.

Replace `<MEDIA_PATH>` with the folder holding your 11 media files.

---

## Before you start (one time)

1. Unzip this build pack into an empty project folder, e.g. `al-fayzeen/`. You should see `CLAUDE.md`, `docs/` and `app/` at the top level.
2. Open the folder in VS Code and start Claude Code there.
3. Optional but recommended (run in a terminal):
   - Playwright MCP, for screenshots: `claude mcp add playwright -- npx @playwright/mcp@latest`
   - Context7 MCP, for up-to-date library docs: `claude mcp add --transport http context7 https://mcp.context7.com/mcp`
   - If your Claude Code has the **frontend-design** skill or plugin, keep it enabled.
4. Make sure `pnpm` and `ffmpeg` are installed (`ffmpeg` compresses the hero video).

---

## Phase 0: Scaffold

```
Read CLAUDE.md, docs/SITE-SPEC.md and every file in app/data and app/assets/css before doing anything.

Set up the Nuxt 4 project in THIS folder without deleting or overwriting CLAUDE.md, docs/, app/data/ or app/assets/css/tokens.css (scaffold in a temp folder and merge if needed). Use pnpm and TypeScript.

Install and configure: @nuxt/image, @nuxt/fonts, @nuxt/icon with @iconify-json/ph, @nuxtjs/i18n (en default, ar RTL, prefix_except_default), @vueuse/nuxt, Tailwind CSS v4 via @tailwindcss/vite, shadcn-nuxt (shadcn-vue), motion-v, gsap, lenis, zod. Check current docs for each before configuring.

Create app/assets/css/main.css that imports tailwindcss and then tokens.css. Configure @nuxt/fonts for Cormorant (400,500,600 + italic), Manrope (400,500,600,700), Reem Kufi (400,600), IBM Plex Sans Arabic (400,500), Aref Ruqaa (400,700).

Copy the media from <MEDIA_PATH> into public/images/. Then use ffmpeg to make hero.mp4 under 4 MB and hero-mobile.mp4 under 2.5 MB (H.264, no audio track, about 1600px and 720px wide respectively, 12–20 s), plus .webm versions. Keep the originals in a git-ignored folder media-originals/. Confirm that every asset with status 'ready' in app/data/assets.ts exists in public/images.

Set up eslint, a typecheck script, and git with a sensible .gitignore. Run pnpm dev and confirm it starts with no errors.

Report: installed versions, any file in assets.ts marked ready that is missing, and anything you were unsure about.
```

**Check:** `pnpm dev` runs; all 11 ready files are in `public/images/`; the video sizes are within budget.

---

## Phase 1: Foundations

```
Read CLAUDE.md sections 3–7 again.

Build the base system in app/components/base/:
- AppButton: variants primary (Kiswa black, white text, glint sweep on hover, press 0.98), secondary (1px Kiswa outline), on-dark primary (white with Kiswa text), on-dark outline, and link. Sizes md and lg, pill radius, min height 44px, icon slots, and NuxtLink support.
- GlassPanel: exactly the CLAUDE.md §6 recipe, with the low-power and no-support fallbacks and the pointer-following highlight on desktop only.
- AppImage: takes slot="id", reads app/data/assets.ts, renders NuxtImg with the house grade for ready images, or the designed skeleton for pending ones (marble or Kiswa tone, MashrabiyaPattern at 6%, centred thin icon, labels only when NUXT_PUBLIC_SHOW_ASSET_LABELS=true). Props: arch (boolean), sizes, priority.
- ArabicEyebrow (Arabic word + English caps label), ArcadeEdge (pointed-arch SVG edge, count / height / from / to props, responsive count), KiswaBand (geometric pattern, no letters), MashrabiyaPattern (SVG pattern, opacity prop).
- SampleBadge, PriceTag (₦ formatted en-NG, tabular, optional animated count with motion-v), NightsSplit (Makkah Kiswa / Madinah Nabawi bar with label), TawafProgress (counter-clockwise, 7 rounds, small and large sizes).
- Composables: useReducedMotion, useLowPowerDevice, useGsap (lazy-loads gsap + plugins on the client after mount), useWhatsAppLink.

Make a temporary page /_kit that shows every component in every state, on white and on Kiswa backgrounds, in English and Arabic (dir=rtl).

Take Playwright screenshots of /_kit at 390 and 1440 wide and review them yourself against CLAUDE.md before reporting.
```

**Share for review:** the `/_kit` screenshots.

---

## Phase 2: Layout and enquiry

```
Build SiteNav, SiteFooter, WhatsAppFloat, LanguageSwitch and the default layout exactly as described in docs/SITE-SPEC.md "Global".

Build the enquiry system: EnquirySheet (bottom sheet under 768px, side sheet above), with the WhatsApp choice (structured message from useWhatsAppLink; disabled with the hint "WhatsApp number to be confirmed" while site.contact.whatsapp is null) and the email form (zod validation, +234 phone default, success state with an AFZ- reference). Create server/api/enquiry.post.ts that validates with zod, logs the enquiry, and returns { ok, reference }. Add a global useEnquiry() composable so any card can open the sheet pre-filled with { type, title, details, ref }.

Render every null fact from app/data/site.ts as the "[To be confirmed]" gap style. Never invent values.

Screenshots: nav over a dark placeholder hero and after scrolling; mobile menu open; footer; enquiry sheet (WhatsApp disabled state, email form, error state, success state), at 390 and 1440.
```

---

## Phase 3: Hero and search panel

```
Build HomeHero and SearchPanel per docs/SITE-SPEC.md Home §1, with all five tabs and every field listed, the shared range calendar, a mobile layout with stacked fields and scrollable tabs, and URL query building for each tab's button.

Motion: the calligraphy draw (#3) at 8% behind the headline, the rotating word (#2) with the glint (#1) on first load. GSAP loads after first paint. The headline must be fully readable on the very first frame.

Video: hero.mp4 / hero-mobile.mp4 with poster hero-still.jpg; show the still when saveData is on or when reduced motion is preferred.

Add the ArcadeEdge transition into the white section below.

Run Lighthouse mobile on / and report LCP, CLS and total JS. Fix anything over the CLAUDE.md budget before reporting.
Screenshots: 390 and 1440, every tab active, with the calendar open.
```

---

## Phase 4: Home sections 2–7

```
Build HomeTrust, HomeServices, HomeWhyDirect, HomePackages (with PackageCard), HomeHowItWorks and HomeJourney exactly per SITE-SPEC Home §2–7, using app/data/packages.ts and the asset slots named in the spec.

Motion: words light up (#4), the price count on room toggle (#6), the journey route line (#5), the How-it-works line and icon draw, and the pinned horizontal scroll for Journey on desktop only (vertical on mobile, and plain vertical with reduced motion).

Every package card shows the Sample badge. Each Enquire button opens the EnquirySheet pre-filled.

Screenshots of each section at 390 and 1440. Check that the scroll-triggered text is readable even when JavaScript is slow (test with CPU 4x slowdown).
```

---

## Phase 5: Home sections 8–13

```
Build HomeHotels (Makkah/Madinah toggle, walking ring), HomeIncluded, HomeStories (honest placeholders as specified, no fake quotes), HomeGuide (four-step strip with the Arabic↔English morph #7 and TawafProgress), HomeFaq (from faqs.ts, null answers as gaps), and HomeCta (KiswaBand edge, the calligraphy draw at full strength, two buttons).

Then review the whole home page top to bottom against SITE-SPEC: copy word for word, Arabic eyebrows, ArcadeEdge used exactly 3 times, KiswaBand once, gold used as a trace only, green only for Madinah.

Full-page screenshots at 390 and 1440. List any deviation from the spec and why.
```

---

## Phase 6: Packages

```
Build /packages (filters as a sticky column on desktop and a sheet on mobile, sorting, compare up to 3 with the slide-up bar and comparison table, empty state) and /packages/[slug] (gallery, sticky booking card / mobile bottom bar with live total, in-page section nav, itinerary timeline, included/not included, gaps for payment plan and cancellation, similar packages). Read query params coming from the hero search.

Screenshots: list with filters applied, compare table, detail page top and itinerary, mobile booking bar expanded.
```

---

## Phase 7: Flights, hotels, transport, e-Visa

```
Build /flights (search summary with an Edit control, the mandatory sample-prices notice, filters, FlightResult cards for round-trip / one-way / multi-city generated from flightTemplates for the searched dates and cities), /hotels (city toggle, walking ring, room prices, sort, Google Maps link in a new tab), /transport (service tabs, VehicleCard grid with prices for the selected service), and /visa (requirements with gaps, 4-step process, visa-only vs with-package cards, FAQ). Every result has Enquire with a structured pre-fill.

Screenshots of each page at 390 and 1440, with the enquiry sheet opened from a flight result.
```

---

## Phase 8: Guide, About, Contact

```
Build /guide, /guide/umrah-step-by-step (brief and factual, with the scholarly review gap, glossary, and reading progress), /about (name meaning section with the client-confirmation gap, story gap, team and office skeletons), and /contact (WhatsApp and email cards, addresses, hours gap). Use only content in SITE-SPEC; where content is missing, show the gap style.
```

---

## Phase 9: Arabic (RTL)

```
Translate all UI strings and page copy into ar.json (add "_review": "Machine translated, needs native review" at the top). Check every page in /ar: logical properties, mirrored arrows, LTR numbers and prices inside RTL text, Arabic fonts applied, calendar direction, sheets opening from the correct side, and the pinned journey scrolling in the right direction.

Screenshots of every page in Arabic at 390 and 1440. List anything that couldn't be mirrored cleanly.
```

---

## Phase 10: QA and preview deploy

```
Do a full QA pass:
- Delete /_kit from production routes.
- Lighthouse mobile on /, /packages, /packages/rahmah and /flights (report the scores).
- axe accessibility scan.
- Keyboard-only walk-through of search → results → enquiry.
- Reduced-motion check.
- Data-saver hero check.
- No console errors or hydration warnings.
- A grep for any invented business fact (phone numbers, licence numbers, reviews, ratings, real airline or hotel brand names). Report what you found and fixed.

Then prepare for deployment on Vercel (Nuxt preset), with NUXT_PUBLIC_SHOW_ASSET_LABELS=false.
```

**Share for review:** the preview link, plus the QA report.
