<script setup lang="ts">
import type { FlightQuery, FlightResultItem } from '~/utils/flightResults'
import { site } from '~/data/site'

const props = defineProps<{ item: FlightResultItem, query: FlightQuery }>()
const { t, locale } = useI18n()
const dt = useDataText()
const textDir = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'))
const { open } = useEnquiry()
const uid = useId()

const allCities = [...site.departureCities, ...site.arrivalCities]
const city = (code: string) => dt(allCities.find(c => c.code === code)?.city ?? code)
const dur = (min: number) => t('flights.duration', { h: Math.floor(min / 60), m: String(min % 60).padStart(2, '0') })
const legLabel = (i: number) => props.query.trip === 'round' ? (i === 0 ? t('flights.outbound') : t('flights.return')) : props.query.trip === 'multi' ? t('flights.leg', { n: i + 1 }) : t('flights.oneWay')

function enquire() {
  const q = props.query
  const pax = [`${q.adults} adults`, q.children ? `${q.children} children` : '', q.infants ? `${q.infants} infants` : ''].filter(Boolean).join(', ')
  const details: Record<string, string> = {}
  props.item.legs.forEach((l, i) => {
    details[legLabel(i)] = `${city(l.from)} ${l.from} → ${city(l.to)} ${l.to}, ${formatDate(l.date)} ${l.depart}`
  })
  open({
    type: 'flight',
    title: `${props.item.template.airline} (sample) · ${q.trip === 'round' ? 'Round-trip' : q.trip === 'multi' ? 'Multi-city' : 'One-way'} · ${q.cabin}`,
    details: { ...details, Travellers: pax, 'Price per adult': `${formatNgn(props.item.pricePerAdult)} (sample)` },
    ref: `AFZ-FLT-${props.item.template.id.toUpperCase()}`,
  })
}
</script>

<template>
  <article class="flight-result rounded-md border border-line bg-ihram p-4 transition-colors duration-200 ease-house hover:border-kiswa md:p-5" :aria-labelledby="`${uid}-a`">
    <div class="flex flex-col gap-5 md:flex-row md:items-stretch">
      <div class="flex-1">
        <div class="mb-4 flex items-center gap-3">
          <!-- airline monogram tile (no real logos) -->
          <span class="grid size-10 place-items-center rounded-sm bg-kiswa font-display text-[1.375rem] font-semibold text-ihram" aria-hidden="true">{{ item.template.monogram }}</span>
          <div>
            <p :id="`${uid}-a`" class="font-semibold">{{ item.template.airline }}</p>
            <p class="text-[0.75rem] text-stone">{{ t(`search.cabins.${item.template.cabin}`) }}</p>
          </div>
          <SampleBadge class="ms-auto md:hidden" />
        </div>

        <ol class="grid gap-4">
          <li v-for="(leg, i) in item.legs" :key="i" class="grid gap-1" :class="i > 0 && 'border-t border-line pt-4'">
            <p class="t-label text-stone">{{ legLabel(i) }} · <span class="ltr-iso">{{ formatDate(leg.date, { weekday: 'short', day: 'numeric', month: 'short' }) }}</span></p>
            <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-5" dir="ltr">
              <div>
                <p class="text-[1.375rem] font-semibold tabular-nums leading-none">{{ leg.depart }}</p>
                <p class="mt-1 text-[0.8125rem] text-stone"><abbr :title="city(leg.from)" class="no-underline">{{ leg.from }}</abbr></p>
              </div>
              <div class="min-w-0 text-center">
                <p class="text-[0.75rem] text-stone tabular-nums" :dir="textDir">{{ dur(leg.durationMin) }}</p>
                <div class="relative my-1.5 h-px bg-stone/40" aria-hidden="true">
                  <span class="absolute -top-[3px] start-0 size-[7px] rounded-full border border-stone bg-ihram" />
                  <span v-for="(s, si) in leg.stops" :key="s.code" class="absolute -top-[3px] size-[7px] rounded-full bg-kiswa" :style="{ left: `${((si + 1) / (leg.stops.length + 1)) * 100}%` }" />
                  <span class="absolute -top-[3px] end-0 size-[7px] rounded-full bg-kiswa" />
                </div>
                <p class="truncate text-[0.75rem]" :dir="textDir" :class="leg.stops.length ? 'text-kiswa' : 'text-stone'">
                  <template v-if="!leg.stops.length">{{ t('flights.direct') }}</template>
                  <template v-else>{{ t('flights.stop', { n: leg.stops.length }, leg.stops.length) }} · {{ t('flights.via', { codes: leg.stops.map(s => s.code).join(', ') }) }}</template>
                </p>
              </div>
              <div class="text-end">
                <p class="text-[1.375rem] font-semibold tabular-nums leading-none">{{ leg.arrive }}<sup v-if="leg.plusDays" class="ms-0.5 text-[0.625rem] font-semibold text-stone">+1</sup></p>
                <p class="mt-1 text-[0.8125rem] text-stone"><abbr :title="city(leg.to)" class="no-underline">{{ leg.to }}</abbr></p>
              </div>
            </div>
            <p class="sr-only">{{ city(leg.from) }} → {{ city(leg.to) }}<template v-if="leg.plusDays">, {{ t('flights.nextDay') }}</template></p>
          </li>
        </ol>
        <p class="mt-4 flex items-center gap-2 text-[0.8125rem] text-stone">
          <Icon name="ph:suitcase-rolling-light" class="text-[1.125rem]" aria-hidden="true" />{{ t('flights.baggage', { kg: item.template.baggageKg }) }}
        </p>
      </div>

      <div class="flex items-end justify-between gap-4 border-t border-line pt-4 md:w-[200px] md:flex-col md:items-end md:justify-between md:border-s md:border-t-0 md:ps-5 md:pt-0">
        <SampleBadge class="hidden md:inline-flex" />
        <div class="md:text-end">
          <PriceTag :amount="item.pricePerAdult" size="md" class="md:justify-end" />
          <p class="text-[0.75rem] text-stone">{{ t('flights.perAdult') }}</p>
        </div>
        <AppButton variant="secondary" class="md:w-full" @click="enquire">{{ t('flights.enquire') }}</AppButton>
      </div>
    </div>
  </article>
</template>
