/**
 * SAMPLE hotels. Real partner hotel names are NOT known, so names are neutral placeholders.
 * Do not replace them with real hotel brands unless the client confirms the partnership.
 */
export interface Hotel {
  id: string
  sample: true
  city: 'makkah' | 'madinah'
  name: string            // placeholder until confirmed
  stars: 3 | 4 | 5
  walkMin: number
  distanceM: number
  image: string           // asset slot id
  rooms: { type: 'Quad' | 'Triple' | 'Double'; perNightNgn: number }[]
  inPackages: string[]    // package slugs
  features: string[]
}

export const hotels: Hotel[] = [
  { id: 'mk-1', sample: true, city: 'makkah', name: 'Partner hotel A, Makkah', stars: 5, walkMin: 2, distanceM: 120, image: 'hotel-makkah',
    rooms: [{ type: 'Double', perNightNgn: 420000 }, { type: 'Triple', perNightNgn: 510000 }], inPackages: ['diyafah'], features: ['Haram view rooms', 'Breakfast', 'Prayer area'] },
  { id: 'mk-2', sample: true, city: 'makkah', name: 'Partner hotel B, Makkah', stars: 4, walkMin: 5, distanceM: 350, image: 'hotel-room',
    rooms: [{ type: 'Double', perNightNgn: 210000 }, { type: 'Triple', perNightNgn: 260000 }, { type: 'Quad', perNightNgn: 300000 }], inPackages: ['rahmah', 'ramadan-last-ten'], features: ['Breakfast', 'Lift access', 'Family rooms'] },
  { id: 'mk-3', sample: true, city: 'makkah', name: 'Partner hotel C, Makkah', stars: 3, walkMin: 12, distanceM: 900, image: 'hotel-lobby',
    rooms: [{ type: 'Triple', perNightNgn: 120000 }, { type: 'Quad', perNightNgn: 140000 }], inPackages: ['sakinah'], features: ['Shuttle to the Haram', 'Breakfast'] },
  { id: 'md-1', sample: true, city: 'madinah', name: 'Partner hotel D, Madinah', stars: 5, walkMin: 2, distanceM: 100, image: 'hotel-madinah',
    rooms: [{ type: 'Double', perNightNgn: 360000 }, { type: 'Triple', perNightNgn: 430000 }], inPackages: ['diyafah'], features: ['Steps from Masjid an-Nabawi', 'Breakfast and dinner'] },
  { id: 'md-2', sample: true, city: 'madinah', name: 'Partner hotel E, Madinah', stars: 4, walkMin: 4, distanceM: 280, image: 'hotel-room',
    rooms: [{ type: 'Double', perNightNgn: 180000 }, { type: 'Triple', perNightNgn: 220000 }, { type: 'Quad', perNightNgn: 250000 }], inPackages: ['rahmah', 'ramadan-last-ten'], features: ['Breakfast', 'Family rooms'] },
  { id: 'md-3', sample: true, city: 'madinah', name: 'Partner hotel F, Madinah', stars: 3, walkMin: 8, distanceM: 600, image: 'hotel-lobby',
    rooms: [{ type: 'Triple', perNightNgn: 95000 }, { type: 'Quad', perNightNgn: 110000 }], inPackages: ['sakinah'], features: ['Breakfast'] },
]
