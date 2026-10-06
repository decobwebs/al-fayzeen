import { flightTemplates } from '~/data/flights'
import type { FlightLeg, FlightTemplate } from '~/data/flights'

export type Trip = 'round' | 'oneway' | 'multi'

export interface FlightQuery {
  trip: Trip
  from: string
  to: string
  depart: string
  ret?: string
  from2?: string
  to2?: string
  date2?: string
  adults: number
  children: number
  infants: number
  cabin: 'Economy' | 'Business'
}

export interface ResultLeg extends FlightLeg {
  date: string
}

export interface FlightResultItem {
  id: string
  template: FlightTemplate
  legs: ResultLeg[]
  pricePerAdult: number
  totalMinutes: number
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h! * 60 + m!
}
const fromMin = (min: number) => {
  const m = ((min % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

/**
 * Applies a template leg to a searched route. When the route differs from the template's LOS↔JED,
 * codes are substituted and 40–90 min added (deterministic per template), as the data file instructs.
 */
function adapt(leg: FlightLeg, from: string, to: string, date: string, idx: number): ResultLeg {
  const changed = from !== leg.from || to !== leg.to
  const extra = changed ? 40 + ((idx * 17) % 51) : 0
  const durationMin = leg.durationMin + extra
  const arriveMin = toMin(leg.arrive) + extra
  const plusDays = (leg.plusDays + Math.floor(arriveMin / 1440)) as 0 | 1
  return { ...leg, from, to, durationMin, arrive: fromMin(arriveMin), plusDays: Math.min(1, plusDays) as 0 | 1, date }
}

export function buildFlightResults(q: FlightQuery): FlightResultItem[] {
  return flightTemplates
    .filter(t => t.cabin === q.cabin)
    .map((t, i) => {
      const legs: ResultLeg[] = [adapt(t.outbound, q.from, q.to, q.depart, i)]
      let price = q.trip === 'round' ? t.priceRoundTripNgn : t.priceOneWayNgn
      if (q.trip === 'round' && q.ret) legs.push(adapt(t.inbound, q.to, q.from, q.ret, i + 3))
      if (q.trip === 'multi' && q.from2 && q.to2 && q.date2) {
        legs.push(adapt(t.inbound, q.from2, q.to2, q.date2, i + 5))
        price = t.priceOneWayNgn * 2
      }
      return { id: `${t.id}-${q.trip}`, template: t, legs, pricePerAdult: price, totalMinutes: legs.reduce((s, l) => s + l.durationMin, 0) }
    })
}

export const departBand = (hhmm: string): 'night' | 'morning' | 'afternoon' | 'evening' => {
  const h = Number(hhmm.slice(0, 2))
  return h < 5 ? 'night' : h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
}

export interface FlightFilterState {
  stops: 'any' | '0' | '1'
  times: ('morning' | 'afternoon' | 'evening' | 'night')[]
  airlines: string[]
  maxPrice: number
}
