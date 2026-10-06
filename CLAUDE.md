# Al Fayzeen — Website Prototype

Al Fayzeen is a licensed Umrah company based in Makkah, Saudi Arabia. This site serves **Nigerian pilgrims** (individuals, families, groups) and brings five services into one place: **Umrah Packages, Flights, Hotels, Transport, Umrah e-Visa**. Every option ends in an enquiry by **WhatsApp or email**.

This is a **client-approval prototype**. It must look and feel like the finished product, but all prices, hotels, flights and dates are **sample data**, and no business facts are invented.

Read these before any work:
- `docs/SITE-SPEC.md`: every page and section, with copy, layout and motion
- `docs/BUILD-PROMPTS.md`: the build order (the user pastes one phase at a time)
- `app/assets/css/tokens.css`: design tokens (the only source of colours, fonts, spacing)
- `app/data/assets.ts`: every image slot, ready or pending

---

## 1. Stack

| Job | Choice |
|---|---|
| Framework | Nuxt 4 (Vue 3, TypeScript, `app/` directory structure) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`, tokens from `tokens.css` mapped with `@theme` |
| UI primitives | shadcn-vue (`shadcn-nuxt` module): Dialog, Sheet, Tabs, Popover, Calendar, Select, Accordion. Restyle every component to our tokens; nothing may look like default shadcn |
| Images | `@nuxt/image` (WebP/AVIF, responsive `sizes`) |
| Fonts | `@nuxt/fonts` (self-hosts Google fonts, no layout shift) |
| Icons | `@nuxt/icon` + `@iconify-json/ph` (Phosphor). Use `ph:` icons, Light weight in UI (`ph:airplane-tilt-light`), Duotone for feature grids |
| i18n | `@nuxtjs/i18n`: `en` (default) and `ar` (RTL, `dir="rtl"`), prefix strategy `prefix_except_default` |
| Motion | `motion-v` for UI motion; `gsap` (ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin; all free) for text and scroll; `lenis` for smooth scroll |
| Utilities | `@vueuse/nuxt` |
| Data (prototype) | Typed TS files in `app/data/`. No database yet |
| Enquiry (prototype) | Nitro route `server/api/enquiry.post.ts` that validates (zod) and logs. Email sending comes later |

Before using any library API, check its **current** docs (use the Context7 MCP if available). Don't rely on memory for Nuxt 4, Tailwind v4, shadcn-vue or motion-v APIs.

Commands: `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm lint`, `pnpm typecheck`.

## 2. Folder structure

```
app/
  assets/css/tokens.css, main.css
  components/
    ui/            shadcn-vue components (restyled)
    base/          AppButton, GlassPanel, AppImage, ArabicEyebrow, ArcadeEdge, KiswaBand,
                   MashrabiyaPattern, SampleBadge, PriceTag, TawafProgress, NightsSplit
    layout/        SiteNav, SiteFooter, WhatsAppFloat, LanguageSwitch
    search/        SearchPanel + one form per tab
    enquiry/       EnquirySheet, EnquiryWhatsApp, EnquiryEmailForm
    sections/      one component per home section (HomeHero, HomeServices, ...)
    cards/         PackageCard, HotelCard, FlightResult, VehicleCard, GuideCard
  composables/     useEnquiry, useWhatsAppLink, useReducedMotion, useLowPowerDevice, useGsap
  data/            site.ts, assets.ts, packages.ts, hotels.ts, flights.ts, transport.ts, visa.ts, faqs.ts
  pages/           see SITE-SPEC
  layouts/default.vue
i18n/locales/      en.json, ar.json
public/images/     media files (named exactly as in assets.ts)
server/api/enquiry.post.ts
```

## 3. Non-negotiable rules

### Truth and content
1. **Never invent business facts.** Licence numbers, phone numbers, policies, testimonials, pilgrim counts, ratings, hotel partner names and airline names come from `app/data/site.ts` or render as a visible gap: `[To be confirmed]` in the `--c-stone` colour, italic.
2. Every price, flight, hotel and date in the prototype comes from `app/data/*.ts` with `sample: true`, and the UI shows a small **"Sample"** badge (`SampleBadge`) on those cards and results.
3. **No fake reviews, star ratings or testimonials.** The Stories section uses labelled placeholders until real, consented content arrives.
4. **Religious content:** don't use Qur'anic verses or the name of Allah as decoration, dividers or patterns. Ritual explanations in the Guide stay brief and factual, and carry the note "Reviewed by Al Fayzeen's scholars before publishing" (a gap until confirmed).
5. **Arabic text** produced by the agent is machine translation. Mark `ar.json` with a top-level `"_review": "Machine translated, needs native review"` and never claim otherwise.

### Visual
6. **Colour ratio:** about 65% Ihram White, 10% Marble, 18% Kiswa Black, 4% Stone, 3% Kiswa Gold. Green appears **only** for Madinah (tags, the Madinah portion of the nights bar, map points).
7. **Gold is a trace,** like the gold band on the Kiswa: one word, one icon, or one hairline per screen at most. Never gold buttons, never gold backgrounds.
8. **No diamond or hairline-with-ornament dividers.** Use the Arabic ornament system in section 5.
9. **Liquid glass only over imagery or video:** the hero search panel, the nav while it's over the hero, the WhatsApp float while it's over the hero, and labels on photos. Never on white backgrounds, never on primary buttons.
10. No emoji. No stock-template layouts (no centred-everything hero with three identical feature cards). No `rounded-lg` on everything; the radius tokens are deliberate.
11. **No AI-generated images of the Kaaba, Masjid al-Haram or Masjid an-Nabawi,** ever.

### Quality
12. **Performance budget:** LCP under 2.5 s on throttled "Fast 4G" with a mid-range Android profile; JS under 180 KB gzipped on the home page before GSAP loads; GSAP and Lenis load after first paint (dynamic import in `onMounted`). Hero video under 4 MB (desktop) and 2.5 MB (mobile), with `poster`, `muted playsinline loop autoplay preload="metadata"`. Respect `navigator.connection.saveData`: show the still image instead of video.
13. **Accessibility:** WCAG AA contrast; visible focus ring (2px Kiswa Black, 3px offset; white on dark sections); every control keyboard-reachable; `prefers-reduced-motion` turns off all non-essential motion (text appears in its final state); `alt` text from `assets.ts`.
14. **RTL:** use logical properties only (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`). Flip directional icons (arrows) in RTL. Numbers and prices stay left-to-right inside RTL.
15. **Responsive:** design at 390 px first, then 768, 1280 and 1440. No horizontal scroll at any width. Tap targets at least 44 px.
16. **Text is readable at rest.** Animated text starts from a readable state, or completes within 1.2 s. Nothing important waits at `opacity: 0` for a scroll trigger that might not fire.

## 4. Design tokens (summary; full values in `tokens.css`)

| Token | Hex | Role |
|---|---|---|
| `--c-ihram` | `#FDFDFB` | page background |
| `--c-marble` | `#F4F4F1` | alternate sections, cards, inputs |
| `--c-kiswa` | `#0B0B0C` | text, primary buttons, dark sections |
| `--c-stone` | `#6E6C66` | secondary text, borders (as a 20% tint) |
| `--c-gold` | `#A8844F` | trace accent (on black use `--c-gold-light` `#C9A66B`) |
| `--c-nabawi` | `#1F5C45` | Madinah only |
| `--c-line` | `#E6E5E0` | hairlines, card borders on white |

Type:
- **Cormorant** (display, 500/600, italic for the accent word)
- **Manrope** (body, UI, prices; `tabular-nums` on all figures)
- **Reem Kufi** (Arabic eyebrows, Arabic headings)
- **IBM Plex Sans Arabic** (Arabic body)
- **Aref Ruqaa** (only the لبيك calligraphy moments)

Scale (desktop/mobile): hero 80/46, h2 52/34, h3 26/22, body 17/16, label 12 uppercase with 0.16em letter-spacing.

Radius: `--r-sm 6px` (inputs, chips), `--r-md 14px` (cards), `--r-arch` (arch top for images), `--r-pill 999px` (buttons).

## 5. Ornament system (replaces generic dividers)

1. **`ArabicEyebrow`**: a small Arabic word set in Reem Kufi above each English section title, with the English eyebrow beside it in Manrope caps. Example: `الباقات · PACKAGES`. The words for each section are listed in SITE-SPEC.
2. **`ArcadeEdge`**: the top edge of a section cut as a row of pointed (ogive) arches, like the arcades (riwaq) of Masjid al-Haram. It's an SVG mask. Props: `count` (arches across the width: 7 desktop, 3 mobile), `height`, `from`/`to` colours. Use it **three times** on the home page: hero→services (white arches rising over the black hero), journey→hotels, and the edge into the final CTA. Each arch is built from two quadratic curves meeting at a point at about 0.62 of the arch height.
3. **`KiswaBand`**: a 48–64 px black strip carrying a repeating gold geometric pattern inspired by square Kufic and the Kiswa belt (hizam). It is **pure geometry with no letters or words**. Use it **once**, as the top edge of the final CTA.
4. **`MashrabiyaPattern`**: an SVG lattice (8-point star, khatam grid) at 4–8% opacity, behind the hero overlay and the final CTA. It's generated in code as a `<pattern>`.

## 6. Motion system

Only these motion moments exist. Don't add others.

| # | Moment | Where | Tech |
|---|---|---|---|
| 1 | Glint sweep | the word "Ibadah" in the hero, once on load, then on hover | CSS gradient + `background-clip:text` |
| 2 | Rotating word | hero headline: Ibadah → Umrah → Journey → Family, letters blur in | GSAP SplitText |
| 3 | Calligraphy draws itself | لبيك اللهم لبيك behind the hero (8% opacity) and in the final CTA (full) | SVG stroke draw (DrawSVG); text rendered as SVG text with Aref Ruqaa |
| 4 | Words light up on scroll | the "Why a direct company" statement | ScrollTrigger + SplitText, scrubbed |
| 5 | Journey line | the Lagos → Jeddah → Makkah → Madinah route; the flight results header | MotionPath |
| 6 | Price counts | package cards and the booking sidebar when room type changes | motion-v `animate()` |
| 7 | Arabic ↔ English | guide titles (عمرة → Umrah) | CSS cross-fade with blur |
| 8 | Tawaf progress | loading states, enquiry step indicator: a dot circling a square **counter-clockwise**, 7 rounds | CSS or SVG |

Micro-interactions:
- Primary button: a white glint sweeps across on hover (600 ms); press scales to 0.98.
- Cards: the image zooms 1.04 over 700 ms on hover; the border turns Kiswa Black.
- Tabs: the active indicator slides (motion-v `layoutId`).
- Easing: `cubic-bezier(.2,.7,.2,1)`. Durations: 200 (UI), 450 (enter), 700 (image), 1200 max (text).

Liquid glass recipe (`GlassPanel`):
- `background: rgba(255,255,255,.12)`
- `backdrop-filter: blur(20px) saturate(1.5)`
- `border: 1px solid rgba(255,255,255,.28)`
- an inner top highlight (`inset 0 1px 0 rgba(255,255,255,.35)`)
- a soft specular highlight (a radial gradient pseudo-element) that follows the pointer on desktop

On low-power devices (`hardwareConcurrency <= 4`, or `saveData`), drop the blur to 10px and turn off pointer tracking. If `backdrop-filter` isn't supported, fall back to `rgba(11,11,12,.72)`.

## 7. Images

- All image slots live in `app/data/assets.ts`. **Always render images through `<AppImage slot="pkg-rahmah" />`.** Never hard-code a path.
- `status: 'ready'` → render the file from `public/images/` via `<NuxtImg>` with the slot's ratio, `sizes`, `alt`, and the **house grade** class.
- `status: 'pending'` → render the **skeleton**: a slot-ratio box in `--c-marble` (or `--c-kiswa` when `tone: 'dark'`) with `MashrabiyaPattern` at 6% and a centred thin Phosphor icon from the slot's `icon` field. It must look intentional, not broken. When `NUXT_PUBLIC_SHOW_ASSET_LABELS=true`, also show the slot id and search keyword (for the team, never in client demos).
- House grade (makes mixed stock look like one shoot): `filter: saturate(.85) contrast(1.03) brightness(1.02) sepia(.05)`.
- Arch images use `--r-arch` (`border-radius: 999px 999px var(--r-md) var(--r-md)`).

## 8. Enquiry flow

Every package, flight result, hotel, vehicle and the visa page has **Enquire**. It opens `EnquirySheet` (a bottom sheet on mobile, a right-side sheet on desktop) with:
1. A summary of what's being enquired about (pre-filled from the item and current search).
2. Two choices of equal weight:
   - **WhatsApp**: `useWhatsAppLink()` builds `https://wa.me/<number>?text=<encoded>`. The message is structured, for example: "Assalamu alaikum Al Fayzeen. I'm interested in: Rahmah · Comfort (10 nights). Departure: Lagos, 14 Jan 2027. Travellers: 2 adults. Room: Triple. Ref: AFZ-PKG-RAHMAH". The number comes from `site.ts` (a gap until confirmed: then the button is disabled with the hint "WhatsApp number to be confirmed").
   - **Email**: a form with name, phone (with Nigeria +234 default), email, preferred contact time, and notes. It submits to `/api/enquiry` and shows a success state with a reference code. **Don't use `mailto:` links.**
3. The Tawaf progress indicator shows while sending.

## 9. Definition of done (every screen)

- Matches SITE-SPEC copy word for word (English); Arabic present where the phase requires.
- Screenshots taken with Playwright at 390×844 and 1440×900, in English and Arabic, and reviewed for overflow, clipping, contrast and alignment.
- No console errors or hydration warnings. `pnpm typecheck` and `pnpm lint` pass.
- Reduced-motion mode checked.
- Lighthouse mobile: Performance at least 85 (prototype), Accessibility at least 95.
- Sample data visibly badged; unknown facts visibly gapped.
