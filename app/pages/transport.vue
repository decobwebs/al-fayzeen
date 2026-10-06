<script setup lang="ts">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { services, vehicles } from '~/data/transport'
import type { ServiceId } from '~/data/transport'

const { t, locale } = useI18n()
useHead({ title: () => t('transport.h1') })
const route = useRoute()
const router = useRouter()
const dt = useDataText()

const str = (k: string) => (typeof route.query[k] === 'string' ? String(route.query[k]) : '')
const ids = services.map(s => s.id)
const service = ref<ServiceId>(ids.includes(str('service') as ServiceId) ? str('service') as ServiceId : 'airport')
watch(service, (v) => { router.replace({ query: { ...route.query, service: v } }) })

/* the trip details carried from the hero search (if any), used in the summary and every enquiry */
const trip = computed(() => {
  const d: Record<string, string | number | undefined> = {}
  if (str('pickup')) d['Pick-up'] = t(`search.places.${str('pickup')}`)
  if (str('dropoff') && service.value !== 'daily') d['Drop-off'] = t(`search.places.${str('dropoff')}`)
  if (str('date')) d.Date = `${formatDate(str('date'))}${str('time') ? `, ${str('time')}` : ''}`
  if (str('pax')) d.Passengers = str('pax')
  return d
})
const pax = computed(() => Number(str('pax')) || 0)
const list = computed(() => vehicles)

const tabList = ref<HTMLElement | null>(null)
const { style: indicator, ready } = useSlidingIndicator(tabList, '[data-state="active"]', service)
</script>

<template>
  <div>
    <header class="wrap pb-8 pt-10 md:pt-16">
      <ArabicEyebrow :ar="t('transport.eyebrowAr')" :label="t('transport.eyebrow')" />
      <h1 class="t-h2 mt-4 md:text-[3.5rem]!">{{ t('transport.h1') }}</h1>
      <p class="mt-4 max-w-[44rem] text-[1.0625rem] leading-relaxed text-stone">{{ t('transport.sub') }}</p>
    </header>

    <TabsRoot v-model="service" :dir="locale === 'ar' ? 'rtl' : 'ltr'" class="wrap pb-24">
      <div ref="tabList">
        <TabsList class="no-scrollbar relative -mx-[var(--gutter)] flex gap-1 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:inline-flex sm:rounded-pill sm:border sm:border-line sm:p-1" :aria-label="t('transport.serviceLabel')">
          <span class="pointer-events-none absolute start-0 top-0 rounded-pill bg-kiswa rtl:start-auto rtl:left-0" :class="ready && 'transition-[transform,width] duration-[450ms] ease-house'" :style="indicator" aria-hidden="true" />
          <TabsTrigger
            v-for="sv in services"
            :key="sv.id"
            :value="sv.id"
            class="relative flex min-h-11 shrink-0 items-center gap-2 rounded-pill px-4 text-[0.875rem] font-semibold transition-colors duration-200 data-[state=active]:text-ihram data-[state=inactive]:text-stone data-[state=inactive]:hover:text-kiswa"
          >
            <Icon :name="sv.icon" class="text-[1.125rem]" aria-hidden="true" />
            <span class="whitespace-nowrap">{{ t(`search.services.${sv.id}`) }}</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent v-for="sv in services" :key="sv.id" :value="sv.id" class="mt-6 outline-none">
        <p class="text-stone">{{ dt(sv.description) }}</p>
        <div v-if="Object.keys(trip).length" class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md border border-line px-4 py-3 text-[0.875rem]">
          <span class="t-label text-stone">{{ t('transport.yourTrip') }}</span>
          <span v-for="(v, k) in trip" :key="k"><span class="text-stone">{{ k }}:</span> {{ v }}</span>
        </div>
        <NoticeBanner class="mt-5" :text="t('notice.samples')" />
        <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <li v-for="v in list" :key="v.id" :class="{ 'opacity-60': pax > 0 && v.seats < pax }">
            <VehicleCard :vehicle="v" :service="sv.id" :trip="trip" />
          </li>
        </ul>
        <p class="mt-4 text-[0.8125rem] text-stone">{{ t('transport.indicative') }}</p>
      </TabsContent>
    </TabsRoot>
  </div>
</template>
