import type { ServiceId } from '~/data/transport'

export type SearchTab = 'packages' | 'flights' | 'hotels' | 'transport' | 'visa'
export type TripType = 'round' | 'oneway' | 'multi'
export type PlaceId = 'JED' | 'MED' | 'makkah-hotel' | 'madinah-hotel' | 'makkah-station' | 'madinah-station'

export interface Pax { adults: number, children: number, infants: number }

export const nationalities = [
  'Nigeria', 'Benin', 'Burkina Faso', 'Cameroon', 'Chad', 'Côte d\'Ivoire', 'Gambia', 'Ghana', 'Guinea', 'Liberia',
  'Mali', 'Niger', 'Senegal', 'Sierra Leone', 'Togo', 'Egypt', 'Kenya', 'South Africa', 'Sudan',
  'United Kingdom', 'Ireland', 'United States', 'Canada', 'United Arab Emirates', 'Saudi Arabia', 'Qatar',
]

/** Pick-up / drop-off options per transport service */
export const servicePlaces: Record<ServiceId, { pickup: PlaceId[], dropoff: PlaceId[] }> = {
  airport: { pickup: ['JED', 'MED', 'makkah-hotel', 'madinah-hotel'], dropoff: ['makkah-hotel', 'madinah-hotel', 'JED', 'MED'] },
  intercity: { pickup: ['makkah-hotel', 'madinah-hotel', 'makkah-station', 'madinah-station'], dropoff: ['madinah-hotel', 'makkah-hotel', 'madinah-station', 'makkah-station'] },
  ziyarat: { pickup: ['makkah-hotel', 'madinah-hotel'], dropoff: ['makkah-hotel', 'madinah-hotel'] },
  daily: { pickup: ['makkah-hotel', 'madinah-hotel', 'JED', 'MED'], dropoff: [] },
}

const iso = (d: Date) => d.toISOString().slice(0, 10)
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86400000)

/** Next 12 months as { value: 'YYYY-MM', label: 'January 2027' } plus Ramadan 1448 */
export function useMonthOptions() {
  const { t } = useI18n()
  return computed(() => {
    const now = new Date()
    const out: { value: string, label: string }[] = []
    for (let i = 0; i < 12; i++) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1, 12))
      out.push({
        value: d.toISOString().slice(0, 7),
        label: new Intl.DateTimeFormat(dateLocale.value, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d),
      })
    }
    out.push({ value: 'ramadan-1448', label: t('search.ramadan') })
    return out
  })
}

/** All search-panel state lives here so other pages (filters, "Edit search") can read and re-open it. */
export function useSearch() {
  const base = addDays(new Date(), 45)
  return useState('search', () => ({
    tab: 'packages' as SearchTab,
    packages: { month: '', style: 'any', pax: { adults: 2, children: 0, infants: 0 } as Pax },
    flights: {
      trip: 'round' as TripType,
      from: 'LOS', to: 'JED',
      depart: iso(base) as string | null, ret: iso(addDays(base, 10)) as string | null,
      leg2From: 'MED', leg2To: 'LOS', leg2Date: iso(addDays(base, 10)) as string | null,
      pax: { adults: 2, children: 0, infants: 0 } as Pax,
      cabin: 'Economy' as 'Economy' | 'Business',
    },
    hotels: {
      city: 'makkah' as 'makkah' | 'madinah',
      checkin: iso(base) as string | null, checkout: iso(addDays(base, 5)) as string | null,
      rooms: 1, pax: { adults: 2, children: 0, infants: 0 } as Pax,
      walk: 'any' as 'any' | '5' | '10' | '15',
    },
    transport: {
      service: 'airport' as ServiceId,
      pickup: 'JED' as PlaceId, dropoff: 'makkah-hotel' as PlaceId,
      date: iso(base) as string | null, time: '10:00',
      passengers: 2,
    },
    visa: { nationality: 'Nigeria', month: '', applicants: 1 },
  }))
}

export const paxTotal = (p: Pax) => p.adults + p.children + p.infants

/** Builds the route + query for each tab's button */
export function searchRoute(s: ReturnType<typeof useSearch>['value'], tab: SearchTab) {
  const clean = (q: Record<string, string | number | null | undefined>) =>
    Object.fromEntries(Object.entries(q).filter(([, v]) => v !== '' && v !== null && v !== undefined).map(([k, v]) => [k, String(v)]))

  switch (tab) {
    case 'packages': {
      const p = s.packages
      return { path: '/packages', query: clean({ month: p.month, style: p.style === 'any' ? '' : p.style, pax: paxTotal(p.pax) }) }
    }
    case 'flights': {
      const f = s.flights
      return {
        path: '/flights',
        query: clean({
          trip: f.trip, from: f.from, to: f.to, depart: f.depart,
          return: f.trip === 'round' ? f.ret : '',
          from2: f.trip === 'multi' ? f.leg2From : '', to2: f.trip === 'multi' ? f.leg2To : '', date2: f.trip === 'multi' ? f.leg2Date : '',
          adults: f.pax.adults, children: f.pax.children || '', infants: f.pax.infants || '', cabin: f.cabin,
        }),
      }
    }
    case 'hotels': {
      const h = s.hotels
      return { path: '/hotels', query: clean({ city: h.city, checkin: h.checkin, checkout: h.checkout, rooms: h.rooms, adults: h.pax.adults, children: h.pax.children || '', walk: h.walk === 'any' ? '' : h.walk }) }
    }
    case 'transport': {
      const tr = s.transport
      return { path: '/transport', query: clean({ service: tr.service, pickup: tr.pickup, dropoff: tr.service === 'daily' ? '' : tr.dropoff, date: tr.date, time: tr.time, pax: tr.passengers }) }
    }
    case 'visa': {
      const v = s.visa
      return { path: '/visa', query: clean({ nationality: v.nationality, month: v.month, applicants: v.applicants }) }
    }
  }
}
