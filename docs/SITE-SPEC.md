# Al Fayzeen — Site Specification (Prototype)

Copy here is final for the prototype. Text in `[square brackets]` is a **gap the client must fill**. Render it as a visible gap, never invented. Prices, dates, hotels and flights come from `app/data/*.ts` (sample data, badged "Sample").

**Voice:** calm, clear, respectful. Short sentences. Speak to the pilgrim as "you". No hype words ("best", "No. 1", "unbeatable"). British spelling (Nigerian audience): "travellers", "programme", "centre".

---

## Sitemap

| Route | Page |
|---|---|
| `/` | Home |
| `/packages` | Umrah packages (list, filter, compare) |
| `/packages/[slug]` | Package detail |
| `/flights` | Flight search results |
| `/hotels` | Hotel search results (Makkah / Madinah) |
| `/transport` | Transport options and vehicles |
| `/visa` | Umrah e-Visa |
| `/guide` | Umrah guide hub |
| `/guide/umrah-step-by-step` | One sample article |
| `/about` | About Al Fayzeen |
| `/contact` | Contact |
| `/ar/...` | Arabic versions (RTL) |

---

## Global

### Navigation (`SiteNav`)
- **Left:** wordmark "Al Fayzeen" (Cormorant 600) with الفائزين (Reem Kufi) beneath it, small.
- **Centre links:** Packages · Flights · Hotels · Transport · e-Visa · Umrah guide
- **Right:** `LanguageSwitch` (EN | العربية), a text link "Contact", and the primary button **"Plan my Umrah"** (opens EnquirySheet with a general enquiry).
- **Behaviour:**
  - Over the hero, it's a transparent glass bar with white text.
  - After 80 px of scroll, it becomes solid Ihram White with Kiswa text and a 1px `--c-line` bottom border (200 ms transition).
  - It hides on scroll down and shows on scroll up (after 400 px).
- **Mobile:** wordmark plus a menu button (`ph:list-light`). The menu opens full-screen on Ihram White, links set large in Cormorant 34px, staggered 40 ms. The language switch and both contact buttons sit at the bottom.

### WhatsApp float (`WhatsAppFloat`)
- Bottom-end corner, 56 px circle, `ph:whatsapp-logo` icon.
- Glass while over the hero; solid Kiswa Black with a white icon elsewhere.
- Tooltip on desktop: "Chat with us on WhatsApp".
- It opens the EnquirySheet with WhatsApp pre-selected, not a raw link, so the message is structured.

### Footer (`SiteFooter`)
Kiswa Black background, Ihram White text, Stone for secondary text. Four columns that stack on mobile:
1. **Al Fayzeen:** wordmark, then "A licensed Umrah company based in Makkah, serving pilgrims from Nigeria." Licence: `[Ministry of Hajj and Umrah licence no.]`.
2. **Services:** Umrah packages, Flights, Hotels, Transport, Umrah e-Visa.
3. **Help:** Umrah guide, Questions, About us, Contact.
4. **Contact:**
   - Makkah office: `[address]`
   - Nigeria contact: `[address or remove]`
   - WhatsApp: `[number]`
   - Email: `[email]`

   Show these as selectable text with copy buttons.

Bottom row:
- "© 2026 Al Fayzeen. All rights reserved."
- Today's Hijri date (`Intl.DateTimeFormat` with `islamic-umalqura`)
- Payment methods as text chips: Paystack · Flutterwave · Bank transfer
- Social icons (Instagram, Facebook, TikTok, YouTube), with links `[to confirm]`

### EnquirySheet
See CLAUDE.md §8. Headline: "How would you like to talk to us?". Sub: "A coordinator in Makkah will reply with prices and available dates."
- **WhatsApp card:** title "WhatsApp", line "Fastest. Usually within [x] minutes."
- **Email card:** title "Email", line "Send details and we'll reply by email."
- **Success state (email):** "Thank you, [first name]. Your reference is AFZ-24817. We'll reply to [email] soon. You can also message us on WhatsApp with this reference."

---

## Home (`/`)

### 1. Hero (`HomeHero`)
- **Eyebrow:** `لبيك · LICENSED UMRAH COMPANY · MAKKAH`
- **Background:** full-bleed `hero.mp4` (`hero-mobile.mp4` under 768px; `hero-still.jpg` as poster and data-saver fallback).
- **Overlay:** Kiswa Black gradient from 70% at the bottom and start edge to 25% at the top end, plus `MashrabiyaPattern` at 5%.
- **Calligraphy:** "لبيك اللهم لبيك" huge behind the headline at 8% white, drawing itself on load (motion #3).
- **Height:** `min(100svh, 860px)` desktop; mobile fits the content (headline + search panel) with at least 620px.

Copy (white text):
- **H1 (two lines):** "Your **Ibadah**," / "our responsibility." The bold word is the rotating slot (Ibadah → Umrah → Journey → Family, motion #2); on first load it gets the glint sweep (motion #1).
- **Sub:** "Umrah packages, flights from Nigeria, hotels near the Haram, transport and your Umrah e-Visa, arranged by one licensed company in Makkah."
- **Text links under the sub:** "See all packages →" and "How it works ↓"

**Search panel (`SearchPanel`)** is a `GlassPanel` sitting over the bottom of the hero. It's the most important UI on the site.

Tabs (icon + label):

| Tab | Icon | Fields | Button → route |
|---|---|---|---|
| **Umrah Packages** (default) | `ph:moon-stars-light` | Travel month (next 12 months + "Ramadan 1448"), Travellers (adults, children, infants), Package style (Any, Essential, Comfort, Premium, Ramadan) | "Show packages" → `/packages?month=&style=&pax=` |
| **Flights** | `ph:airplane-tilt-light` | Trip type segmented (Round-trip / One-way / Multi-city); From (Lagos LOS, Abuja ABV, Kano KAN); To (Jeddah JED, Madinah MED); Depart; Return (hidden for one-way); Travellers & cabin (Economy, Business) | "Search flights" → `/flights?...` |
| **Hotels** | `ph:buildings-light` | City segmented (Makkah / Madinah); Check-in; Check-out; Rooms & guests; Walk to Haram (Any, under 5 min, under 10 min, under 15 min) | "Search hotels" → `/hotels?...` |
| **Transport** | `ph:van-light` | Service (Airport transfer, Makkah ↔ Madinah, Ziyarat tour, Car with driver by the day); Pick-up; Drop-off (hidden for "by the day"); Date & time; Passengers | "See vehicles" → `/transport?...` |
| **e-Visa** | `ph:identification-card-light` | Nationality (Nigeria default, searchable); Travel month; Number of applicants | "Check requirements" → `/visa?...` |

- **Desktop:** tabs on top, fields in one row, button at the end.
- **Mobile:** tabs scroll sideways, fields stack, button full width.
- Date fields use one shared range calendar popover. Under the panel, in small white text: "Not sure yet? Tell us on WhatsApp and we'll plan it with you."

### Transition: `ArcadeEdge` (Kiswa → Ihram White)

### 2. Trust row (`HomeTrust`)
One line on Ihram White. Items are separated by space, not dividers; each has a Light Phosphor icon in Kiswa:
- `ph:seal-check-light` "Licensed by the Ministry of Hajj and Umrah · [licence no.]"
- `ph:buildings-light` "Office in Makkah"
- `ph:stamp-light` "Visa processing included"
- `ph:chats-circle-light` "Support in English, Arabic and Hausa"

On mobile it becomes a slow marquee that pauses on touch.

### 3. Services (`HomeServices`)
- **Eyebrow:** `خدماتنا · OUR SERVICES`
- **H2:** "Everything for your Umrah, in one place"
- **Layout:** a bento grid on Ihram White. Packages is a large tile (2×2); the other four are 1×1. Each tile has a Duotone icon, title, one line, and an arrow link. Hover: the tile background turns Marble and the arrow moves 4px.

| Tile | Copy | Link |
|---|---|---|
| Umrah packages | "Complete trips: visa, hotels, transport and a coordinator on the ground." | `/packages` |
| Flights | "From Lagos, Abuja and Kano to Jeddah or Madinah." | `/flights` |
| Hotels | "Makkah and Madinah, sorted by walking time to the Haram." | `/hotels` |
| Transport | "Airport pick-ups, the road to Madinah and a car with driver." | `/transport` |
| Umrah e-Visa | "We prepare your documents and submit your application." `[confirm wording]` | `/visa` |

The Packages tile uses `pkg-rahmah` as an arch image on its end side.

### 4. Why a direct company (`HomeWhyDirect`)
- **Eyebrow:** `لماذا نحن · WHY AL FAYZEEN`
- **Statement** (Cormorant, 44/30px, max 22ch per line, words light up on scroll, motion #4): "Most Umrah agencies sell a package they bought from a company in Saudi Arabia. **Al Fayzeen is that company.**"
- **Four pillars below.** Each has an arch image (3:4), a Duotone icon, a title and a line:

| Image slot | Title | Line |
|---|---|---|
| `why-welcome` | "Someone on the ground" | "Your coordinator lives in Makkah, meets you at the airport and stays reachable until you fly home." |
| `why-hotel-view` | "Hotels we've walked to" | "We list the real walking time from each hotel to the Haram, measured by our team." |
| `why-guide` | "Direct prices" | "No middle layers between you and the hotel. You pay for your Umrah, not for commissions." |
| `why-walk` | "One number, one answer" | "One WhatsApp line for your whole trip, answered in English, Arabic and Hausa." |

Layout: four columns on desktop; on mobile a horizontal snap-scroll with the next card peeking in.

### 5. Featured packages (`HomePackages`)
- **Eyebrow:** `الباقات · UMRAH PACKAGES`
- **H2:** "Choose how you'd like to travel"
- **Filter chips:** All · Essential · Comfort · Premium · Ramadan (the active chip is Kiswa Black; the slide is animated).
- Shows the 4 packages from `packages.ts` as `PackageCard`, plus a link "Compare all packages →".

**`PackageCard` anatomy:**
1. Arch image with a "Sample" badge (top-start) and a "Most chosen" badge (if `featured`) in glass over the image.
2. Name in Cormorant 28, e.g. "Rahmah", then the meaning in italic Stone ("Mercy") and the tier label ("Comfort").
3. **`NightsSplit` bar:** a bar split by nights, Kiswa Black for Makkah and Nabawi Green for Madinah, labelled "5 nights Makkah · 5 nights Madinah".
4. Hotel line: `ph:person-simple-walk-light` "About 350 m · 5 min walk to the Haram".
5. A row of up to 5 included icons, each with a tooltip.
6. Room toggle (Quad / Triple / Double) → `PriceTag` "From ₦2,400,000 per person". The count animates on change (motion #6).
7. "Next departure: 14 Jan 2027" (from data).
8. Buttons: **"View package"** (primary) and **"Enquire"** (secondary, opens EnquirySheet).

### 6. How it works (`HomeHowItWorks`)
- **Eyebrow:** `كيف نعمل · HOW IT WORKS`
- **H2:** "From first message to flight home"
- **Layout:** five steps. Horizontal on desktop with a line connecting them; vertical on mobile. The line draws as you scroll, and each icon draws itself in as the line reaches it.

| # | Icon | Title | Text |
|---|---|---|---|
| 1 | `ph:list-checks-duotone` | Choose your trip | "Compare packages, or build your own from flights, hotels and transport. Ask us anything on WhatsApp." |
| 2 | `ph:wallet-duotone` | Reserve your place | "Pay a deposit of [x]% to hold your place. Pay the rest in instalments up to [x] days before departure." |
| 3 | `ph:file-arrow-up-duotone` | Send your documents | "Your passport (valid for at least 6 months), a passport photo and anything else we list for your trip." |
| 4 | `ph:stamp-duotone` | Visa and tickets confirmed | "We process your Umrah visa and send your e-visa, tickets and hotel vouchers." |
| 5 | `ph:airplane-landing-duotone` | Travel with us | "Your coordinator meets you at the airport and stays with your group until you leave." |

### 7. Your journey, day by day (`HomeJourney`)
- **Eyebrow:** `رحلتك · YOUR JOURNEY`
- **H2:** "What your Umrah looks like"
- **Top:** the route line (motion #5): Lagos → Jeddah → Makkah → Madinah. Makkah points in Kiswa, Madinah points in Nabawi Green.
- **Desktop:** pinned horizontal scroll through six arch panels. **Mobile:** a vertical list of the same panels.

| Slot | Title | Text |
|---|---|---|
| `journey-arrive` | Arrive | "Your coordinator meets you at Jeddah airport. A private bus takes you to your hotel in Makkah to rest." |
| `journey-umrah` | Perform your Umrah | "Tawaf and Sa'i together with your group leader, at a calm hour." |
| `journey-makkah` | Days in Makkah | "Prayers at the Haram, with optional visits to Jabal al-Nour, Arafat and Mina." |
| `journey-train` | To Madinah | "The Haramain high-speed train or a private car, as your package includes." |
| `journey-madinah` | Madinah | "Prayers at Masjid an-Nabawi, your Rawdah visit, Quba Mosque and Mount Uhud." |
| `journey-ziyarat` | Farewell | "A transfer to the airport and your journey home." |

### Transition: `ArcadeEdge` (Ihram White → Marble)

### 8. Hotels near the Haram (`HomeHotels`)
- **Eyebrow:** `الفنادق · HOTELS`
- **H2:** "Close enough to hear the Adhan"
- **Layout:** a Makkah / Madinah segmented control (Madinah uses the Nabawi accent), then three `HotelCard`s from `hotels.ts`, and a link "See all hotels →".
- **`HotelCard`:**
  - image (4:3)
  - name (a gap if not confirmed: `[Partner hotel]`, with the star class)
  - a **walking ring**: a circle that fills to the walking minutes out of 15 when it scrolls into view, with "5 min" in the centre
  - distance line
  - "Included in: Rahmah, Diyafah"
  - an "Enquire" button

### 9. What's included (`HomeIncluded`)
- **Eyebrow:** `ما يشمله · WHAT'S INCLUDED`
- **H2:** "Handled for you"
- **Layout:** a 4×3 grid of Duotone icons with labels. Each icon stroke draws in, staggered.
- **Items:**
  - Umrah visa
  - Return flights (selected packages)
  - Hotel in Makkah
  - Hotel in Madinah
  - Airport and city transfers
  - Haramain train (Comfort and Premium)
  - Guided Umrah
  - Ziyarat tours
  - Zamzam water `[confirm]`
  - Saudi SIM card `[confirm]`
  - Pre-departure seminar in Nigeria `[confirm city]`
  - Coordinator available 24/7

### 10. Pilgrim stories (`HomeStories`)
- **Eyebrow:** `قصص الحجاج · PILGRIM STORIES`
- **H2:** "In their words"
- **Prototype:** one large 16:9 video placeholder (pending skeleton with a play icon) plus three quote-card **placeholders** that say "Real pilgrim stories will appear here, with their permission." Style them with a dashed `--c-line` border, so it's clearly a planned slot.
- Group photo row: `stories-group`, `stories-family` (pending skeletons).

### 11. Umrah guide preview (`HomeGuide`)
- **Eyebrow:** `دليل العمرة · UMRAH GUIDE`
- **H2:** "Your first Umrah, step by step"
- **Four-step strip.** Each title uses the Arabic ↔ English morph (motion #7):
  - Ihram (إحرام): "Enter the sacred state at the Miqat with intention and the Talbiyah."
  - Tawaf (طواف): "Seven circuits around the Kaaba, counter-clockwise." The `TawafProgress` animation sits here.
  - Sa'i (سعي): "Seven walks between Safa and Marwah."
  - Halq or Taqsir (حلق / تقصير): "Shave or shorten the hair to complete your Umrah."
- Then three `GuideCard`s:
  - Umrah step by step
  - What to pack
  - Visiting the Rawdah
- Lead offer (Marble band): "Get our free Umrah guide (PDF) on WhatsApp", with a button "Send me the guide" (opens the EnquirySheet with the WhatsApp message "Please send me the Umrah guide").

### 12. Questions (`HomeFaq`)
- **Eyebrow:** `أسئلة · QUESTIONS`
- **H2:** "Questions pilgrims ask us"
- **Layout:** two-column accordion on desktop, one column on mobile. Answers come from `faqs.ts`; unknown answers render as `[Answer from Al Fayzeen]`.
- **Below:** "Still unsure? Ask a coordinator on WhatsApp." + button.

### Transition: `KiswaBand`

### 13. Final call to action (`HomeCta`)
- Kiswa Black background with `MashrabiyaPattern` at 6%. The لبيك calligraphy is large, in `--c-gold-light`, drawing itself in when visible (motion #3).
- **H2 (white):** "Start your Umrah with a conversation."
- **Sub:** "Tell us your month, your budget and who's travelling. A coordinator in Makkah will reply with options."
- **Buttons:** "Chat on WhatsApp" (white primary on black) and "Send an email" (outline white).

### 14. Footer

---

## `/packages`
- **Header:** eyebrow `الباقات · UMRAH PACKAGES`, H1 "Umrah packages", sub "Every package includes your Umrah visa, hotels, transport in Saudi Arabia and a coordinator on the ground." `[confirm]`
- **Filters:**
  - **Desktop:** a sticky start-side column.
  - **Mobile:** a "Filters" button that opens a sheet.
  - **Fields:**
    - travel month
    - style
    - budget range slider (₦)
    - nights (7–14)
    - max walk to Haram
    - flights included (yes/no)
    - departure city
- **Sort:** next departure, price low to high, closest to the Haram.
- **Grid:** `PackageCard`. Each card has a "Compare" checkbox. With 2–3 ticked, a compare bar slides up; it opens a side-by-side table covering price per room type, nights split, hotel distance, included items and next departure.
- **Empty state:** "No packages match these choices. Tell us your dates on WhatsApp and we'll build one for you." + button.

## `/packages/[slug]`
- **Gallery:** a large arch image with 4 thumbnails (pending skeletons are fine).
- **Title block:** name, meaning, tier, "Sample" badge, `NightsSplit`.
- **Sticky booking card** (desktop end column; on mobile, a bottom bar that expands into a sheet):
  - departure date select
  - room type toggle
  - travellers
  - total with an animated count
  - deposit line "Deposit [x]%"
  - **Enquire** primary
  - "Ask on WhatsApp" secondary
- **Sections** (in-page nav chips that stick under the main nav): Overview · Itinerary · Hotels · What's included · Visa & documents · Payment plan · Cancellation · Questions.
- **Itinerary:** a day-by-day vertical timeline from `package.itinerary`, with the route line at the top.
- **What's included:** two lists, Included (check icons) and Not included (Stone, minus icons).
- **Payment plan / Cancellation:** gaps until confirmed.
- **Similar packages:** 3 cards.

## `/flights`
- **Header:** a compact summary of the search ("Lagos → Jeddah · 14 Jan – 24 Jan · 2 adults · Economy") with an "Edit" link that re-opens the panel. A thin route animation (motion #5) runs across the header.
- **Notice banner (Marble):** "Prices shown are samples. Send an enquiry and we'll confirm live fares and seats." — this banner is mandatory in the prototype.
- **Filters:** stops, departure time ranges, airline (sample names "Airline A/B/C"), price.
- **`FlightResult` card:**
  - airline monogram tile (no real logos)
  - depart time and code
  - duration line with stop dots
  - arrive time and code
  - baggage icon line
  - price per adult
  - "Enquire"
- **Round-trip:** outbound and return legs shown stacked in one card.
- **Multi-city:** each leg on its own line.

## `/hotels`
- **Header:** city segmented control (Makkah / Madinah) + dates + guests summary.
- **Notice banner:** same as flights.
- **List:** `HotelCard`s in list format. Each shows:
  - image
  - name gap or sample name
  - star class
  - walking ring
  - "Distance measured to [King Abdulaziz Gate / Bab al-Salam]" `[confirm]`
  - room types with sample nightly prices
  - "Enquire"
- **Sort:** closest first (default), price.
- A link to a map opens Google Maps in a new tab. Don't embed maps in the prototype.

## `/transport`
- **Eyebrow:** `النقل · TRANSPORT`
- **H1:** "Transport in Saudi Arabia"
- **Sub:** "Airport pick-ups, the road between Makkah and Madinah, Ziyarat tours and a car with driver. Every driver is arranged by our team in Makkah."
- **Service tabs:**
  - Airport transfer
  - Makkah ↔ Madinah
  - Ziyarat tour
  - Car with driver (by the day)
- **`VehicleCard` per vehicle class:**
  - image (pending skeletons)
  - class name
  - "Like a Toyota Camry" (class examples are indicative)
  - seats and bag icons
  - sample price for the selected service
  - "Enquire"
- **Vehicle classes:**

| Class | Indicative model | Seats | Bags |
|---|---|---|---|
| Sedan | Camry class | 3 | 2 |
| SUV | GMC Yukon class | 6 | 5 |
| Family van | H1 class | 8 | 7 |
| Coach | Group bus | up to 49 | 1 per person |

## `/visa`
- **Eyebrow:** `التأشيرة · UMRAH E-VISA`
- **H1:** "Your Umrah visa, prepared with you"
- **Sub:** "We check your documents, submit your application through our licensed company account and send you the e-visa." `[confirm process]`
- **Requirements checklist** (from `visa.ts`; unconfirmed items render as gaps):
  - passport valid for at least 6 months
  - passport photo on a white background
  - `[vaccination requirements]`
  - `[other documents]`
- **Process:** a 4-step strip: Send documents → We review → We submit → You receive your e-visa. Processing time `[x] working days`.
- **Visa only, or with a package?** Two cards: "Visa with an Al Fayzeen package" and "Visa only" `[confirm if offered]`.
- **Enquiry:** "Start my visa enquiry".
- **FAQ:** visa questions.

## `/guide`
- **Eyebrow:** `دليل العمرة · UMRAH GUIDE`
- **H1:** "The Umrah guide"
- A grid of `GuideCard`s. Only "Umrah step by step" is a full sample article; the others show "Coming soon".
- **The sample article includes:**
  - a reading-progress line using `TawafProgress` styling
  - an Arabic term glossary
  - the scholarly review note (a gap)

## `/about`
- **H1:** "Al Fayzeen"
- **Name section:** الفائزين means "those who succeed". It's a word the Qur'an uses for people of faith. `[Al Fayzeen to confirm what the name means to them; quote and reference to be provided by the client]`
- **Story:** `[Founding story]`
- **Licences:** gaps.
- **Team in Makkah:** pending portraits.
- **Office:** pending photo.

## `/contact`
- **Two large cards:**
  - **WhatsApp:** the number with a copy button, plus a button.
  - **Email:** the form.
- Office addresses as text, with an "Open in Google Maps" link.
- Hours: `[hours, Makkah time (UTC+3) and Nigeria time (UTC+1)]`.

---

## Arabic eyebrow words (`ArabicEyebrow`)

| Section | Arabic |
|---|---|
| Hero | لبيك |
| Services | خدماتنا |
| Why us | لماذا نحن |
| Packages | الباقات |
| How it works | كيف نعمل |
| Journey | رحلتك |
| Hotels | الفنادق |
| Included | ما يشمله |
| Stories | قصص الحجاج |
| Guide | دليل العمرة |
| Questions | أسئلة |
| Transport | النقل |
| Visa | التأشيرة |
| Flights | الرحلات الجوية |
