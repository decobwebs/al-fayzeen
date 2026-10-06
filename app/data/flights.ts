/**
 * SAMPLE flight results. Airlines are deliberately generic ("Airline A/B/C"), with no real logos or brands.
 * Times, durations and prices are illustrative only. The /flights page must show the sample-prices notice.
 * The UI generates results for any searched date by applying these templates to that date.
 */
export interface FlightLeg {
  from: string; to: string
  depart: string   // HH:mm local
  arrive: string   // HH:mm local, may be +1 day
  plusDays: 0 | 1
  durationMin: number
  stops: { code: string; layoverMin: number }[]
}

export interface FlightTemplate {
  id: string
  sample: true
  airline: 'Airline A' | 'Airline B' | 'Airline C'
  monogram: string
  cabin: 'Economy' | 'Business'
  baggageKg: number
  outbound: FlightLeg
  inbound: FlightLeg   // used for round-trip (reverse route)
  priceRoundTripNgn: number
  priceOneWayNgn: number
}

export const flightTemplates: FlightTemplate[] = [
  { id: 'fa-1', sample: true, airline: 'Airline A', monogram: 'A', cabin: 'Economy', baggageKg: 46,
    outbound: { from: 'LOS', to: 'JED', depart: '23:40', arrive: '07:05', plusDays: 1, durationMin: 445, stops: [] },
    inbound: { from: 'JED', to: 'LOS', depart: '09:30', arrive: '14:20', plusDays: 0, durationMin: 410, stops: [] },
    priceRoundTripNgn: 1150000, priceOneWayNgn: 690000 },
  { id: 'fb-1', sample: true, airline: 'Airline B', monogram: 'B', cabin: 'Economy', baggageKg: 30,
    outbound: { from: 'LOS', to: 'JED', depart: '14:10', arrive: '03:55', plusDays: 1, durationMin: 765, stops: [{ code: 'ADD', layoverMin: 150 }] },
    inbound: { from: 'JED', to: 'LOS', depart: '05:40', arrive: '15:10', plusDays: 0, durationMin: 690, stops: [{ code: 'ADD', layoverMin: 120 }] },
    priceRoundTripNgn: 920000, priceOneWayNgn: 560000 },
  { id: 'fc-1', sample: true, airline: 'Airline C', monogram: 'C', cabin: 'Economy', baggageKg: 30,
    outbound: { from: 'LOS', to: 'JED', depart: '10:25', arrive: '22:50', plusDays: 0, durationMin: 625, stops: [{ code: 'CAI', layoverMin: 110 }] },
    inbound: { from: 'JED', to: 'LOS', depart: '01:15', arrive: '11:05', plusDays: 0, durationMin: 650, stops: [{ code: 'CAI', layoverMin: 95 }] },
    priceRoundTripNgn: 980000, priceOneWayNgn: 590000 },
  { id: 'fa-2', sample: true, airline: 'Airline A', monogram: 'A', cabin: 'Business', baggageKg: 64,
    outbound: { from: 'LOS', to: 'JED', depart: '23:40', arrive: '07:05', plusDays: 1, durationMin: 445, stops: [] },
    inbound: { from: 'JED', to: 'LOS', depart: '09:30', arrive: '14:20', plusDays: 0, durationMin: 410, stops: [] },
    priceRoundTripNgn: 3400000, priceOneWayNgn: 1950000 },
]
// When the searched origin or destination differs (ABV, KAN, MED), substitute the codes and add 40–90 min to durations.
// Keep the "Sample" badge on every result.
