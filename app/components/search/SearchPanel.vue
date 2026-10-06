<script setup lang="ts">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { site } from '~/data/site'
import { services } from '~/data/transport'
import type { SearchTab } from '~/composables/useSearch'

const { t, locale } = useI18n()
const s = useSearch()
const months = useMonthOptions()
const localePath = useLocalePath()
const tabList = ref<HTMLElement | null>(null)
const { style: indicator, ready: indicatorReady } = useSlidingIndicator(tabList, '[data-state="active"]', () => s.value.tab)

const tabs = computed(() => [
  { id: 'packages' as const, icon: 'ph:moon-stars-light', label: t('search.tabs.packages') },
  { id: 'flights' as const, icon: 'ph:airplane-tilt-light', label: t('search.tabs.flights') },
  { id: 'hotels' as const, icon: 'ph:buildings-light', label: t('search.tabs.hotels') },
  { id: 'transport' as const, icon: 'ph:van-light', label: t('search.tabs.transport') },
  { id: 'visa' as const, icon: 'ph:identification-card-light', label: t('search.tabs.visa') },
])

const monthOpts = computed(() => [{ value: '', label: t('search.monthAny') }, ...months.value])
const styleOpts = computed(() => (['any', 'essential', 'comfort', 'premium', 'ramadan'] as const).map(v => ({ value: v, label: t(`search.styles.${v}`) })))
const dt = useDataText()
const fromOpts = computed(() => site.departureCities.map(c => ({ value: c.code, label: `${dt(c.city)} ${c.code}` })))
const toOpts = computed(() => site.arrivalCities.map(c => ({ value: c.code, label: `${dt(c.city)} ${c.code}` })))
const allAirports = computed(() => [...fromOpts.value, ...toOpts.value])
const tripOpts = computed(() => (['round', 'oneway', 'multi'] as const).map(v => ({ value: v, label: t(`search.trips.${v}`) })))
const cityOpts = computed(() => (['makkah', 'madinah'] as const).map(v => ({ value: v, label: t(`search.cities.${v}`) })))
const walkOpts = computed(() => (['any', '5', '10', '15'] as const).map(v => ({ value: v, label: t(`search.walks.${v}`) })))
const serviceOpts = computed(() => services.map(sv => ({ value: sv.id, label: t(`search.services.${sv.id}`) })))
const placeOpts = (ids: readonly string[]) => ids.map(id => ({ value: id, label: t(`search.places.${id}`) }))
const pickupOpts = computed(() => placeOpts(servicePlaces[s.value.transport.service].pickup))
const dropoffOpts = computed(() => placeOpts(servicePlaces[s.value.transport.service].dropoff))
const paxOpts = (max: number) => Array.from({ length: max }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))
const timeOpts = Array.from({ length: 24 * 2 }, (_, i) => {
  const v = `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`
  return { value: v, label: v }
})

// keep pick-up/drop-off valid when the service changes
watch(() => s.value.transport.service, (sv) => {
  const p = servicePlaces[sv]
  if (!p.pickup.includes(s.value.transport.pickup)) s.value.transport.pickup = p.pickup[0]!
  if (p.dropoff.length && !p.dropoff.includes(s.value.transport.dropoff)) s.value.transport.dropoff = p.dropoff[0]!
})

// string bridges for numeric native selects
const transportPax = computed({ get: () => String(s.value.transport.passengers), set: (v: string) => { s.value.transport.passengers = Number(v) } })
const visaApplicants = computed({ get: () => String(s.value.visa.applicants), set: (v: string) => { s.value.visa.applicants = Number(v) } })

function go(tab: SearchTab) {
  navigateTo(localePath(searchRoute(s.value, tab)))
}

const buttonLabel = computed(() => ({
  packages: t('search.showPackages'),
  flights: t('search.searchFlights'),
  hotels: t('search.searchHotels'),
  transport: t('search.seeVehicles'),
  visa: t('search.checkRequirements'),
})[s.value.tab])

const dir = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))
</script>

<template>
  <GlassPanel as="section" radius="lg" class="search-panel p-2 sm:p-2.5" :aria-label="t('search.label')">
    <TabsRoot v-model="s.tab" :dir="dir" activation-mode="manual">
      <!-- tabs scroll sideways on mobile -->
      <div ref="tabList">
      <TabsList class="no-scrollbar relative -mx-2 flex snap-x gap-1 overflow-x-auto px-2 pb-2 sm:mx-0 sm:px-0" :aria-label="t('search.label')">
        <span
          class="pointer-events-none absolute start-0 top-0 rounded-pill bg-ihram rtl:start-auto rtl:left-0"
          :class="indicatorReady && 'transition-[transform,width] duration-[450ms] ease-house'"
          :style="indicator"
          aria-hidden="true"
        />
        <TabsTrigger
          v-for="tb in tabs"
          :key="tb.id"
          :value="tb.id"
          class="relative flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-pill px-4 text-[0.875rem] font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white"
          :class="s.tab === tb.id ? 'text-kiswa' : 'text-white/85 hover:text-white'"
        >
          <Icon :name="tb.icon" class="relative text-[1.125rem]" aria-hidden="true" />
          <span class="relative whitespace-nowrap">{{ tb.label }}</span>
        </TabsTrigger>
      </TabsList>
      </div>

      <!-- shared submit row layout -->
      <TabsContent v-for="tb in tabs" :key="tb.id" :value="tb.id" class="outline-none">
        <form class="grid gap-2" @submit.prevent="go(tb.id)">
          <!-- per-tab toggles above the row -->
          <div v-if="tb.id === 'flights'" class="px-1 pt-1">
            <SearchSegmented v-model="s.flights.trip" :label="t('search.tripType')" :options="tripOpts" name="trip" />
          </div>
          <div v-if="tb.id === 'hotels'" class="px-1 pt-1">
            <SearchSegmented v-model="s.hotels.city" :label="t('search.city')" :options="cityOpts" name="city" />
          </div>

          <div class="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
            <div class="search-row grid flex-1 grid-cols-2 gap-2 lg:flex lg:gap-0 lg:rounded-md lg:bg-white/[.07] lg:ring-1 lg:ring-white/12">
              <!-- PACKAGES -->
              <template v-if="tb.id === 'packages'">
                <SearchSelect id="pk-month" v-model="s.packages.month" :label="t('search.month')" :options="monthOpts" />
                <SearchPax id="pk-pax" v-model:pax="s.packages.pax" :label="t('search.travellers')" />
                <SearchSelect id="pk-style" v-model="s.packages.style" :label="t('search.style')" :options="styleOpts" />
              </template>

              <!-- FLIGHTS -->
              <template v-else-if="tb.id === 'flights'">
                <SearchSelect id="fl-from" v-model="s.flights.from" :label="t('search.from')" :options="fromOpts" />
                <SearchSelect id="fl-to" v-model="s.flights.to" :label="t('search.to')" :options="toOpts" />
                <SearchDates
                  id="fl-dates"
                  v-model:start="s.flights.depart"
                  v-model:end="s.flights.ret"
                  :mode="s.flights.trip === 'round' ? 'range' : 'single'"
                  :start-label="t('search.depart')"
                  :end-label="t('search.return')"
                />
                <SearchPax id="fl-pax" v-model:pax="s.flights.pax" v-model:cabin="s.flights.cabin" with-cabin :label="t('search.travellersCabin')" :grow="1.3" />
              </template>

              <!-- HOTELS -->
              <template v-else-if="tb.id === 'hotels'">
                <SearchDates id="ht-dates" v-model:start="s.hotels.checkin" v-model:end="s.hotels.checkout" mode="range" :start-label="t('search.checkin')" :end-label="t('search.checkout')" />
                <SearchPax id="ht-pax" v-model:pax="s.hotels.pax" v-model:rooms="s.hotels.rooms" with-rooms :infants="false" :label="t('search.roomsGuests')" />
                <SearchSelect id="ht-walk" v-model="s.hotels.walk" :label="t('search.walk')" :options="walkOpts" />
              </template>

              <!-- TRANSPORT -->
              <template v-else-if="tb.id === 'transport'">
                <SearchSelect id="tr-service" v-model="s.transport.service" :label="t('search.service')" :options="serviceOpts" :grow="1.3" />
                <SearchSelect id="tr-pickup" v-model="s.transport.pickup" :label="t('search.pickup')" :options="pickupOpts" />
                <SearchSelect v-if="s.transport.service !== 'daily'" id="tr-dropoff" v-model="s.transport.dropoff" :label="t('search.dropoff')" :options="dropoffOpts" />
                <SearchDates id="tr-date" v-model:start="s.transport.date" :start-label="t('search.dateTime')" />
                <SearchSelect id="tr-time" v-model="s.transport.time" :label="t('search.time')" :options="timeOpts" :grow="0.6" />
                <SearchSelect id="tr-pax" v-model="transportPax" :label="t('search.passengers')" :options="paxOpts(49)" :grow="0.6" />
              </template>

              <!-- E-VISA -->
              <template v-else>
                <SearchField :label="t('search.nationality')" for="vs-nat" :grow="1.3">
                  <input
                    id="vs-nat"
                    v-model="s.visa.nationality"
                    list="vs-nat-list"
                    autocomplete="country-name"
                    :placeholder="t('search.nationalityPlaceholder')"
                    class="w-full bg-transparent text-[1rem] font-medium text-white outline-none placeholder:text-white/50"
                  >
                  <datalist id="vs-nat-list">
                    <option v-for="n in nationalities" :key="n" :value="n" />
                  </datalist>
                  <Icon name="ph:magnifying-glass-light" class="pointer-events-none absolute bottom-[14px] end-4 text-[1rem] text-white/70 lg:end-5" aria-hidden="true" />
                </SearchField>
                <SearchSelect id="vs-month" v-model="s.visa.month" :label="t('search.month')" :options="monthOpts" />
                <SearchSelect id="vs-applicants" v-model="visaApplicants" :label="t('search.applicants')" :options="paxOpts(20)" />
              </template>
            </div>

            <AppButton type="submit" variant="on-dark" size="lg" class="w-full lg:ms-2 lg:h-auto lg:w-auto lg:min-w-[190px] lg:self-stretch lg:rounded-md">
              <template #start><Icon name="ph:magnifying-glass" class="relative z-[1] text-[1.125rem]" aria-hidden="true" /></template>
              {{ buttonLabel }}
            </AppButton>
          </div>

          <!-- multi-city second leg -->
          <div v-if="tb.id === 'flights' && s.flights.trip === 'multi'" class="grid grid-cols-2 gap-2 lg:flex lg:gap-0 lg:rounded-md lg:bg-white/[.07] lg:ring-1 lg:ring-white/12 lg:me-[198px]">
            <SearchSelect id="fl-from2" v-model="s.flights.leg2From" :label="`${t('search.then')} · ${t('search.leg2From')}`" :options="allAirports" />
            <SearchSelect id="fl-to2" v-model="s.flights.leg2To" :label="t('search.leg2To')" :options="allAirports" />
            <SearchDates id="fl-date2" v-model:start="s.flights.leg2Date" :start-label="t('search.leg2Date')" />
          </div>
        </form>
      </TabsContent>
    </TabsRoot>
  </GlassPanel>
</template>
