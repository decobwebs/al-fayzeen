<script setup lang="ts">
import type { Hotel } from '~/data/hotels'
import { packages } from '~/data/packages'

const props = withDefaults(defineProps<{ hotel: Hotel, layout?: 'grid' | 'list', nights?: number }>(), { layout: 'grid' })
const { t } = useI18n()
const dt = useDataText()
const { open } = useEnquiry()
const uid = useId()

const madinah = computed(() => props.hotel.city === 'madinah')
const included = computed(() => props.hotel.inPackages.map(s => packages.find(p => p.slug === s)?.name).filter(Boolean).map(n => dt(n!)).join(', '))
const cheapest = computed(() => Math.min(...props.hotel.rooms.map(r => r.perNightNgn)))
const mapUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(madinah.value ? 'Masjid an-Nabawi, Madinah' : 'Masjid al-Haram, Makkah')}`)

function enquire() {
  open({
    type: 'hotel',
    title: `${props.hotel.name} (${props.hotel.stars}-star, sample)`,
    details: {
      City: madinah.value ? 'Madinah' : 'Makkah',
      Walk: `${props.hotel.walkMin} min to the Haram`,
      ...(props.nights ? { Nights: props.nights } : {}),
      'Price from': `${formatNgn(cheapest.value)} per room per night (sample)`,
    },
    ref: `AFZ-HTL-${props.hotel.id.toUpperCase()}`,
  })
}
</script>

<template>
  <article
    class="group relative flex rounded-md border border-line bg-ihram p-3 transition-colors duration-200 ease-house hover:border-kiswa"
    :class="layout === 'list' ? 'flex-col gap-5 md:flex-row md:p-4' : 'h-full flex-col'"
    :aria-labelledby="`${uid}-n`"
  >
    <div class="relative overflow-hidden rounded-sm" :class="layout === 'list' ? 'md:w-[38%] md:shrink-0' : ''">
      <AppImage :slot="hotel.image" ratio="4:3" rounded="sm" zoom sizes="100vw md:420px" />
      <div class="absolute start-3 top-3 flex gap-2">
        <SampleBadge />
        <span v-if="madinah" class="inline-flex h-6 items-center rounded-pill bg-nabawi-tint px-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-nabawi rtl:tracking-normal">{{ t('search.cities.madinah') }}</span>
      </div>
    </div>

    <div class="flex flex-1 flex-col" :class="layout === 'grid' ? 'px-2 pb-2 pt-5' : 'md:py-2 md:pe-2'">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <h3 :id="`${uid}-n`" class="font-display text-[1.5rem] font-semibold leading-tight">
            <GapText :text="`[${dt(hotel.name)}]`" />
          </h3>
          <p class="mt-1 text-[0.8125rem] text-stone">{{ t('hotels.card.stars', { n: hotel.stars }) }} · {{ hotel.features.map(f => dt(f)).join(' · ') }}</p>
        </div>
        <WalkingRing :minutes="hotel.walkMin" :madinah="madinah" :size="layout === 'list' ? 84 : 72" />
      </div>

      <p class="mt-4 flex items-center gap-2 text-[0.875rem]">
        <Icon name="ph:person-simple-walk-light" class="text-[1.125rem]" aria-hidden="true" />
        {{ t('hotels.card.distance', { m: hotel.distanceM }) }}
      </p>
      <p v-if="layout === 'list'" class="mt-1 text-[0.8125rem] text-stone">
        <i18n-t keypath="hotels.card.measuredTo" scope="global">
          <template #gate>
            <GapText :text="t('hotels.card.gateGap')" />
          </template>
        </i18n-t>
      </p>
      <p class="mt-1 text-[0.875rem] text-stone">{{ t('hotels.card.includedIn', { list: included }) }}</p>

      <ul v-if="layout === 'list'" class="mt-4 grid gap-1.5 border-t border-line pt-4 text-[0.875rem]">
        <li v-for="r in hotel.rooms" :key="r.type" class="flex items-baseline justify-between gap-4">
          <span>{{ t(`card.rooms.${r.type.toLowerCase()}`) }}</span>
          <span><span class="ltr-iso font-semibold tabular-nums">{{ formatNgn(r.perNightNgn) }}</span> <span class="text-[0.75rem] text-stone">{{ t('hotels.card.perNight') }}</span></span>
        </li>
      </ul>
      <PriceTag v-else class="mt-3" :amount="cheapest" :prefix="t('common.from')" :suffix="t('hotels.card.perNight')" size="sm" />

      <div class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
        <AppButton variant="secondary" @click="enquire">{{ t('hotels.card.enquire') }}</AppButton>
        <a v-if="layout === 'list'" :href="mapUrl" target="_blank" rel="noopener" class="inline-flex min-h-11 items-center gap-1.5 text-[0.875rem] font-semibold underline-offset-4 hover:underline">
          <Icon name="ph:map-pin-light" class="text-[1.125rem]" aria-hidden="true" />{{ t('hotels.card.map') }}<span class="sr-only"> {{ t('common.newTab') }}</span>
          <Icon name="ph:arrow-up-right-light" class="flip-rtl text-[0.875rem]" aria-hidden="true" />
        </a>
      </div>
    </div>
  </article>
</template>
