<script setup lang="ts">
import { site } from '~/data/site'
import type { FlightFilterState, FlightQuery, Trip } from '~/utils/flightResults'

const { t, locale } = useI18n()
const dt = useDataText()
useHead({ title: () => t('flights.h1') })
const route = useRoute()
const s = useSearch()

/* the query from the hero search (falls back to the shared search state) */
// defaults snapshot (not reactive), so writing the search state below can't re-trigger this
const f = JSON.parse(JSON.stringify(s.value.flights)) as typeof s.value.flights
const query = computed<FlightQuery>(() => {
  const q = route.query
  const str = (k: string, d: string) => (typeof q[k] === 'string' && q[k] ? String(q[k]) : d)
  const trip = str('trip', f.trip) as Trip
  return {
    trip,
    from: str('from', f.from),
    to: str('to', f.to),
    depart: str('depart', f.depart ?? ''),
    ret: trip === 'round' ? str('return', f.ret ?? '') : undefined,
    from2: str('from2', f.leg2From),
    to2: str('to2', f.leg2To),
    date2: str('date2', f.leg2Date ?? ''),
    adults: Number(str('adults', String(f.pax.adults))),
    children: Number(str('children', '0')),
    infants: Number(str('infants', '0')),
    cabin: str('cabin', f.cabin) === 'Business' ? 'Business' : 'Economy',
  }
})

// keep the Edit panel in step with what's shown
watch(query, (q) => {
  Object.assign(s.value.flights, { trip: q.trip, from: q.from, to: q.to, depart: q.depart, ret: q.ret ?? s.value.flights.ret, cabin: q.cabin, pax: { adults: q.adults, children: q.children, infants: q.infants } })
  s.value.tab = 'flights'
}, { immediate: true })

const allCities = [...site.departureCities, ...site.arrivalCities]
const city = (code: string) => dt(allCities.find(c => c.code === code)?.city ?? code)
const arrow = computed(() => (locale.value === 'ar' ? '←' : '→'))
const short = (iso?: string) => (iso ? formatDate(iso, { day: 'numeric', month: 'short' }) : '')
const summary = computed(() => {
  const q = query.value
  const route = q.trip === 'multi' ? `${city(q.from)} ${arrow.value} ${city(q.to)} · ${city(q.from2!)} ${arrow.value} ${city(q.to2!)}` : `${city(q.from)} ${arrow.value} ${city(q.to)}`
  const dates = q.trip === 'round' ? `${short(q.depart)} – ${short(q.ret)}` : q.trip === 'multi' ? `${short(q.depart)}, ${short(q.date2)}` : short(q.depart)
  const pax = [t('flights.adults', { n: q.adults }, q.adults), q.children ? t('flights.children', { n: q.children }, q.children) : '', q.infants ? t('flights.infants', { n: q.infants }, q.infants) : ''].filter(Boolean).join(', ')
  return [route, dates, pax, t(`search.cabins.${q.cabin}`)]
})
const routePoints = computed(() => {
  const q = query.value
  const codes = q.trip === 'multi' ? [q.from, q.to, q.to2!] : [q.from, q.to]
  return codes.map(c => ({ code: c, label: city(c), tone: (c === 'MED' ? 'madinah' : 'plain') as 'madinah' | 'makkah' | 'plain' }))
})

const editing = ref(false)
watch(() => route.fullPath, () => { editing.value = false })

/* results + filters */
const all = computed(() => buildFlightResults(query.value))
const prices = computed(() => all.value.map(r => r.pricePerAdult))
const priceMin = computed(() => Math.min(...prices.value, 0))
const priceMax = computed(() => Math.max(...prices.value, 1))
const defaults = (): FlightFilterState => ({ stops: 'any', times: [], airlines: [], maxPrice: priceMax.value })
const filters = reactive<FlightFilterState>(defaults())
watch(priceMax, (v) => { filters.maxPrice = v })
const sort = ref<'price' | 'duration' | 'departure'>('price')
const airlines = computed(() => [...new Set(all.value.map(r => r.template.airline))])

const results = computed(() => all.value
  .filter(r => filters.stops === 'any' || r.legs.every(l => l.stops.length === Number(filters.stops)))
  .filter(r => !filters.times.length || filters.times.includes(departBand(r.legs[0]!.depart)))
  .filter(r => !filters.airlines.length || filters.airlines.includes(r.template.airline))
  .filter(r => r.pricePerAdult <= filters.maxPrice)
  .sort((a, b) => sort.value === 'price' ? a.pricePerAdult - b.pricePerAdult : sort.value === 'duration' ? a.totalMinutes - b.totalMinutes : a.legs[0]!.depart.localeCompare(b.legs[0]!.depart)))

const sheetOpen = ref(false)
const { open: openEnquiry } = useEnquiry()
</script>

<template>
  <div>
    <!-- header: search summary over imagery, with the route line and Edit -->
    <header class="on-dark relative isolate overflow-hidden bg-kiswa text-on-dark">
      <div class="absolute inset-0 -z-10">
        <AppImage slot="hero-still" fill rounded="none" decorative sizes="100vw" img-class="opacity-35" />
        <div class="absolute inset-0 bg-gradient-to-b from-kiswa/60 to-kiswa/85" />
      </div>
      <div class="wrap py-10 md:py-12">
        <ArabicEyebrow :ar="t('flights.eyebrowAr')" :label="t('flights.eyebrow')" tone="dark" />
        <h1 class="sr-only">{{ t('flights.h1') }}</h1>
        <div class="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <p class="font-display text-[1.75rem] leading-tight md:text-[2.25rem]">
            <span class="block">{{ summary[0] }}</span>
            <span class="mt-1 block font-body text-[0.9375rem] text-on-dark-muted">{{ summary.slice(1).join(' · ') }}</span>
          </p>
          <AppButton :variant="editing ? 'on-dark' : 'on-dark-outline'" :icon-start="editing ? 'ph:x-light' : 'ph:pencil-simple-light'" :directional="false" :aria-expanded="editing" aria-controls="flight-edit" @click="editing = !editing">
            {{ editing ? t('flights.close') : t('flights.edit') }}
          </AppButton>
        </div>
        <RouteLine class="mt-6 max-w-xl" :points="routePoints" :label="summary[0]!" trigger="load" compact tone="dark" />
        <div v-if="editing" id="flight-edit" class="mt-6">
          <SearchPanel />
        </div>
      </div>
    </header>

    <div class="wrap pt-6">
      <NoticeBanner :text="t('notice.samples')" />
    </div>

    <div class="wrap grid gap-8 pb-24 pt-8 lg:grid-cols-[250px_1fr] lg:gap-12">
      <aside class="hidden lg:block" :aria-label="t('flights.filters')">
        <div class="sticky top-[96px]">
          <h2 class="t-label font-body! mb-6 text-kiswa">{{ t('flights.filters') }}</h2>
          <FlightFilters v-model:state="filters" id-prefix="ffd" :airlines="airlines" :price-min="priceMin" :price-max="priceMax" @reset="Object.assign(filters, defaults())" />
        </div>
      </aside>

      <section :aria-label="t('flights.results', { n: results.length }, results.length)">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p class="font-semibold" aria-live="polite">{{ t('flights.results', { n: results.length }, results.length) }}</p>
          <div class="flex gap-2">
            <AppButton variant="secondary" icon-start="ph:sliders-horizontal-light" :directional="false" class="lg:hidden" @click="sheetOpen = true">{{ t('flights.filters') }}</AppButton>
            <label for="fl-sort" class="sr-only">{{ t('flights.sort') }}</label>
            <div class="relative">
              <select id="fl-sort" v-model="sort" class="h-11 appearance-none rounded-pill border border-line bg-ihram pe-10 ps-4 text-[0.875rem] font-semibold hover:border-kiswa">
                <option v-for="o in (['price', 'duration', 'departure'] as const)" :key="o" :value="o">{{ t(`flights.sorts.${o}`) }}</option>
              </select>
              <Icon name="ph:caret-down-light" class="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            </div>
          </div>
        </div>
        <ul v-if="results.length" class="grid gap-4">
          <li v-for="r in results" :key="r.id"><FlightResult :item="r" :query="query" /></li>
        </ul>
        <div v-else class="grid justify-items-start gap-4 rounded-md border border-dashed border-stone/40 p-8">
          <p class="font-display text-[1.5rem] leading-snug">{{ t('flights.none') }}</p>
          <AppButton icon-start="ph:whatsapp-logo" :directional="false" @click="openEnquiry({ type: 'flight', title: summary[0]!, details: { Dates: summary[1], Travellers: summary[2], Cabin: summary[3] } }, { channel: 'whatsapp' })">{{ t('faq.ask') }}</AppButton>
        </div>
      </section>
    </div>

    <UiSheet v-model:open="sheetOpen" :title="t('flights.filters')" side="bottom">
      <FlightFilters v-model:state="filters" id-prefix="ffm" :airlines="airlines" :price-min="priceMin" :price-max="priceMax" class="pb-4" @reset="Object.assign(filters, defaults())" />
      <template #footer>
        <div class="border-t border-line px-5 py-4">
          <AppButton block size="lg" @click="sheetOpen = false">{{ t('flights.showFilters', { n: results.length }, results.length) }}</AppButton>
        </div>
      </template>
    </UiSheet>
  </div>
</template>
