/** SAMPLE transport services and vehicle classes. Model names are indicative examples ("like a ..."), not guarantees. */
export type ServiceId = 'airport' | 'intercity' | 'ziyarat' | 'daily'

export const services: { id: ServiceId; label: string; description: string; icon: string }[] = [
  { id: 'airport', label: 'Airport transfer', description: 'Jeddah or Madinah airport to your hotel, or back.', icon: 'ph:airplane-landing-light' },
  { id: 'intercity', label: 'Makkah ↔ Madinah', description: 'A private car or van between the two holy cities.', icon: 'ph:path-light' },
  { id: 'ziyarat', label: 'Ziyarat tour', description: 'A half-day visit to the historic sites with a driver who knows them.', icon: 'ph:map-pin-line-light' },
  { id: 'daily', label: 'Car with driver', description: 'A car and driver at your disposal for the day.', icon: 'ph:steering-wheel-light' },
]

export interface Vehicle {
  id: string
  sample: true
  className: string
  like: string
  seats: number
  bags: number
  image: string
  priceNgn: Record<ServiceId, number>
}

export const vehicles: Vehicle[] = [
  { id: 'sedan', sample: true, className: 'Sedan', like: 'Like a Toyota Camry', seats: 3, bags: 2, image: 'transport-sedan',
    priceNgn: { airport: 95000, intercity: 260000, ziyarat: 110000, daily: 230000 } },
  { id: 'suv', sample: true, className: 'SUV', like: 'Like a GMC Yukon', seats: 6, bags: 5, image: 'transport-suv',
    priceNgn: { airport: 160000, intercity: 420000, ziyarat: 180000, daily: 380000 } },
  { id: 'van', sample: true, className: 'Family van', like: 'Like a Hyundai H1', seats: 8, bags: 7, image: 'transport-van',
    priceNgn: { airport: 180000, intercity: 470000, ziyarat: 200000, daily: 420000 } },
  { id: 'coach', sample: true, className: 'Coach', like: 'Group coach', seats: 49, bags: 49, image: 'transport-bus',
    priceNgn: { airport: 650000, intercity: 1600000, ziyarat: 700000, daily: 1400000 } },
]
