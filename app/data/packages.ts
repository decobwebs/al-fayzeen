/**
 * SAMPLE packages for the prototype. Every figure is illustrative (sample: true) and must show the "Sample" badge.
 * Sakinah and Rahmah quad prices come from the client's earlier prototype; all other figures are placeholders.
 * Package names (Sakinah, Rahmah, Diyafah) are a proposal awaiting client approval.
 */
export type RoomType = 'quad' | 'triple' | 'double'
export type Tier = 'essential' | 'comfort' | 'premium' | 'ramadan'

export interface ItineraryDay { day: string; city: 'makkah' | 'madinah' | 'travel'; title: string; text: string }

export interface UmrahPackage {
  slug: string
  name: string
  meaning: string
  tier: Tier
  tierLabel: string
  featured?: boolean
  sample: true
  image: string                 // asset slot id
  nights: { makkah: number; madinah: number }
  hotel: { makkahWalkMin: number; makkahDistanceM: number; madinahWalkMin: number; stars: number }
  transport: string
  priceFrom: Record<RoomType, number>   // NGN per person
  departures: string[]                  // ISO dates
  departureCities: string[]             // IATA codes
  flightsIncluded: boolean
  included: string[]
  notIncluded: string[]
  itinerary: ItineraryDay[]
  note?: string
}

const baseIncluded = ['Umrah visa', 'Hotel in Makkah', 'Hotel in Madinah', 'Airport transfers', 'Guided Umrah', 'Coordinator 24/7']

export const packages: UmrahPackage[] = [
  {
    slug: 'sakinah', name: 'Sakinah', meaning: 'Tranquility', tier: 'essential', tierLabel: 'Essential', sample: true,
    image: 'pkg-sakinah',
    nights: { makkah: 4, madinah: 3 },
    hotel: { makkahWalkMin: 12, makkahDistanceM: 900, madinahWalkMin: 8, stars: 3 },
    transport: 'Shared air-conditioned coach',
    priceFrom: { quad: 1350000, triple: 1520000, double: 1780000 },
    departures: ['2027-01-14', '2027-02-04', '2027-04-15'],
    departureCities: ['LOS', 'ABV', 'KAN'],
    flightsIncluded: true,
    included: [...baseIncluded, 'Return flights', 'Ziyarat in Makkah and Madinah'],
    notIncluded: ['Meals (breakfast only)', 'Personal expenses', 'Haramain train'],
    itinerary: [
      { day: 'Day 1', city: 'travel', title: 'Fly to Jeddah', text: 'Depart Nigeria. Your coordinator meets you at Jeddah and takes you to your hotel in Makkah.' },
      { day: 'Day 2', city: 'makkah', title: 'Perform your Umrah', text: 'Tawaf and Sa\'i with your group leader at a calm hour.' },
      { day: 'Days 3–4', city: 'makkah', title: 'Days in Makkah', text: 'Prayers at the Haram. Ziyarat to Jabal al-Nour, Arafat and Mina.' },
      { day: 'Day 5', city: 'travel', title: 'To Madinah', text: 'Coach to Madinah, check in near Masjid an-Nabawi.' },
      { day: 'Days 6–7', city: 'madinah', title: 'Madinah', text: 'Prayers at Masjid an-Nabawi, Quba Mosque and Mount Uhud.' },
      { day: 'Day 8', city: 'travel', title: 'Fly home', text: 'Transfer to Madinah airport for your flight to Nigeria.' },
    ],
  },
  {
    slug: 'rahmah', name: 'Rahmah', meaning: 'Mercy', tier: 'comfort', tierLabel: 'Comfort', featured: true, sample: true,
    image: 'pkg-rahmah',
    nights: { makkah: 5, madinah: 5 },
    hotel: { makkahWalkMin: 5, makkahDistanceM: 350, madinahWalkMin: 4, stars: 4 },
    transport: 'Private transport + Haramain train',
    priceFrom: { quad: 2400000, triple: 2650000, double: 3050000 },
    departures: ['2027-01-14', '2027-03-18', '2027-05-06'],
    departureCities: ['LOS', 'ABV', 'KAN'],
    flightsIncluded: true,
    included: [...baseIncluded, 'Return flights', 'Haramain train', 'Ziyarat in Makkah and Madinah', 'Breakfast daily'],
    notIncluded: ['Lunch and dinner', 'Personal expenses'],
    itinerary: [
      { day: 'Day 1', city: 'travel', title: 'Fly to Jeddah', text: 'Your coordinator meets you at Jeddah. Private transfer to your hotel in Makkah.' },
      { day: 'Day 2', city: 'makkah', title: 'Perform your Umrah', text: 'Tawaf and Sa\'i with your group leader.' },
      { day: 'Days 3–5', city: 'makkah', title: 'Days in Makkah', text: 'Prayers at the Haram, Ziyarat and free time.' },
      { day: 'Day 6', city: 'travel', title: 'Haramain train to Madinah', text: 'High-speed train to Madinah with private transfers at both stations.' },
      { day: 'Days 7–10', city: 'madinah', title: 'Madinah', text: 'Prayers at Masjid an-Nabawi, your Rawdah visit, Quba Mosque and Mount Uhud.' },
      { day: 'Day 11', city: 'travel', title: 'Fly home', text: 'Private transfer to the airport.' },
    ],
  },
  {
    slug: 'diyafah', name: 'Diyafah', meaning: 'Hospitality', tier: 'premium', tierLabel: 'Premium', sample: true,
    image: 'pkg-diyafah',
    nights: { makkah: 7, madinah: 5 },
    hotel: { makkahWalkMin: 2, makkahDistanceM: 120, madinahWalkMin: 2, stars: 5 },
    transport: 'Private car with driver throughout',
    priceFrom: { quad: 4200000, triple: 4650000, double: 5300000 },
    departures: ['2027-02-04', '2027-04-15'],
    departureCities: ['LOS', 'ABV'],
    flightsIncluded: true,
    included: [...baseIncluded, 'Return flights', 'Haramain train (business)', 'Haram-view room', 'Personal coordinator', 'Breakfast and dinner'],
    notIncluded: ['Personal expenses'],
    itinerary: [
      { day: 'Day 1', city: 'travel', title: 'Fly to Jeddah', text: 'Welcomed by your personal coordinator. Private car to Makkah.' },
      { day: 'Day 2', city: 'makkah', title: 'Perform your Umrah', text: 'A private guided Umrah at the time you choose.' },
      { day: 'Days 3–7', city: 'makkah', title: 'Days in Makkah', text: 'Prayers at the Haram from a Haram-view hotel. Private Ziyarat.' },
      { day: 'Day 8', city: 'travel', title: 'To Madinah', text: 'Haramain train in business class.' },
      { day: 'Days 9–12', city: 'madinah', title: 'Madinah', text: 'Hotel steps from Masjid an-Nabawi. Private Ziyarat.' },
      { day: 'Day 13', city: 'travel', title: 'Fly home', text: 'Private car to the airport.' },
    ],
  },
  {
    slug: 'ramadan-last-ten', name: 'Last Ten Nights', meaning: 'Ramadan 1448', tier: 'ramadan', tierLabel: 'Ramadan', sample: true,
    image: 'hero-still',
    nights: { makkah: 7, madinah: 4 },
    hotel: { makkahWalkMin: 6, makkahDistanceM: 450, madinahWalkMin: 5, stars: 4 },
    transport: 'Private transport + Haramain train',
    priceFrom: { quad: 5500000, triple: 6000000, double: 6900000 },
    departures: ['2027-02-26'],
    departureCities: ['LOS', 'ABV', 'KAN'],
    flightsIncluded: true,
    included: [...baseIncluded, 'Return flights', 'Haramain train', 'Suhoor and Iftar'],
    notIncluded: ['Personal expenses'],
    itinerary: [
      { day: 'Day 1', city: 'travel', title: 'Fly to Madinah', text: 'Begin in Madinah. Transfer to your hotel near Masjid an-Nabawi.' },
      { day: 'Days 2–4', city: 'madinah', title: 'Madinah', text: 'Taraweeh at Masjid an-Nabawi and Ziyarat.' },
      { day: 'Day 5', city: 'travel', title: 'To Makkah', text: 'Haramain train to Makkah, then perform your Umrah.' },
      { day: 'Days 6–11', city: 'makkah', title: 'The last ten nights in Makkah', text: 'Qiyam and the last ten nights at the Haram.' },
      { day: 'Day 12', city: 'travel', title: 'Fly home', text: 'Transfer to Jeddah airport.' },
    ],
    note: 'Ramadan dates depend on the moon sighting. Final dates are confirmed closer to the time.',
  },
]
