import { packages } from '~/data/packages'
import type { Tier, UmrahPackage } from '~/data/packages'

export const BUDGET = { min: 1_000_000, max: 7_000_000, step: 100_000 }
export const NIGHTS = { min: 7, max: 14 }

export interface PackageFilterState {
  month: string
  styles: Tier[]
  budget: [number, number]
  nights: [number, number]
  walk: 'any' | '5' | '10' | '15'
  flights: 'any' | 'yes' | 'no'
  city: string
  sort: 'departure' | 'price' | 'walk'
}

const tiers: Tier[] = ['essential', 'comfort', 'premium', 'ramadan']
const defaults = (): PackageFilterState => ({
  month: '', styles: [], budget: [BUDGET.min, BUDGET.max], nights: [NIGHTS.min, NIGHTS.max], walk: 'any', flights: 'any', city: '', sort: 'departure',
})

const nightsOf = (p: UmrahPackage) => p.nights.makkah + p.nights.madinah
const next = (p: UmrahPackage) => p.departures[0] ?? '9999'

function matchesMonth(p: UmrahPackage, month: string) {
  if (!month) return true
  if (month === 'ramadan-1448') return p.tier === 'ramadan'
  return p.departures.some(d => d.startsWith(month))
}

/** Filter state for /packages, initialised from (and mirrored to) the URL so hero searches land filtered. */
export function usePackageFilters() {
  const route = useRoute()
  const router = useRouter()
  const q = route.query

  const state = reactive<PackageFilterState>(defaults())
  if (typeof q.month === 'string') state.month = q.month
  if (typeof q.style === 'string') state.styles = q.style.split(',').filter((s): s is Tier => tiers.includes(s as Tier))
  if (typeof q.walk === 'string' && ['5', '10', '15'].includes(q.walk)) state.walk = q.walk as PackageFilterState['walk']
  if (typeof q.flights === 'string' && ['yes', 'no'].includes(q.flights)) state.flights = q.flights as PackageFilterState['flights']
  if (typeof q.city === 'string') state.city = q.city
  if (typeof q.sort === 'string' && ['price', 'walk'].includes(q.sort)) state.sort = q.sort as PackageFilterState['sort']
  if (typeof q.budget === 'string') {
    const [a, b] = q.budget.split('-').map(Number)
    if (a && b) state.budget = [a, b]
  }
  if (typeof q.nights === 'string') {
    const [a, b] = q.nights.split('-').map(Number)
    if (a && b) state.nights = [a, b]
  }
  const pax = computed(() => Number(route.query.pax) || 0)

  const results = computed(() => {
    const list = packages.filter(p =>
      matchesMonth(p, state.month)
      && (!state.styles.length || state.styles.includes(p.tier))
      && p.priceFrom.quad >= state.budget[0] && p.priceFrom.quad <= state.budget[1]
      && nightsOf(p) >= state.nights[0] && nightsOf(p) <= state.nights[1]
      && (state.walk === 'any' || p.hotel.makkahWalkMin <= Number(state.walk))
      && (state.flights === 'any' || p.flightsIncluded === (state.flights === 'yes'))
      && (!state.city || p.departureCities.includes(state.city)))
    const sorters: Record<PackageFilterState['sort'], (a: UmrahPackage, b: UmrahPackage) => number> = {
      departure: (a, b) => next(a).localeCompare(next(b)),
      price: (a, b) => a.priceFrom.quad - b.priceFrom.quad,
      walk: (a, b) => a.hotel.makkahWalkMin - b.hotel.makkahWalkMin,
    }
    return [...list].sort(sorters[state.sort])
  })

  const activeCount = computed(() => {
    const d = defaults()
    return [
      state.month !== d.month, state.styles.length > 0,
      state.budget[0] !== d.budget[0] || state.budget[1] !== d.budget[1],
      state.nights[0] !== d.nights[0] || state.nights[1] !== d.nights[1],
      state.walk !== d.walk, state.flights !== d.flights, state.city !== d.city,
    ].filter(Boolean).length
  })

  function reset() {
    const { sort } = state
    Object.assign(state, defaults(), { sort })
  }

  // mirror to the URL (replace, so the back button still leaves the page)
  watchDebounced(state, () => {
    const d = defaults()
    const query: Record<string, string> = {}
    if (state.month) query.month = state.month
    if (state.styles.length) query.style = state.styles.join(',')
    if (state.budget[0] !== d.budget[0] || state.budget[1] !== d.budget[1]) query.budget = state.budget.join('-')
    if (state.nights[0] !== d.nights[0] || state.nights[1] !== d.nights[1]) query.nights = state.nights.join('-')
    if (state.walk !== 'any') query.walk = state.walk
    if (state.flights !== 'any') query.flights = state.flights
    if (state.city) query.city = state.city
    if (state.sort !== 'departure') query.sort = state.sort
    if (route.query.pax) query.pax = String(route.query.pax)
    router.replace({ query })
  }, { debounce: 250, deep: true })

  return { state, results, activeCount, reset, pax }
}
