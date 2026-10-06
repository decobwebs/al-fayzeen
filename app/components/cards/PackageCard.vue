<script setup lang="ts">
import type { RoomType, UmrahPackage } from '~/data/packages'
import { site } from '~/data/site'

const props = withDefaults(defineProps<{
  pkg: UmrahPackage
  /** show a Compare checkbox (packages list) */
  compare?: boolean
  compared?: boolean
  compareDisabled?: boolean
  headingLevel?: 'h2' | 'h3'
}>(), { headingLevel: 'h3' })
const emit = defineEmits<{ 'toggle-compare': [] }>()

const { t } = useI18n()
const dt = useDataText()
const { open } = useEnquiry()
const search = useSearch()

const room = ref<RoomType>('quad')
const rooms: RoomType[] = ['quad', 'triple', 'double']
const roomSize: Record<RoomType, number> = { quad: 4, triple: 3, double: 2 }
const price = computed(() => props.pkg.priceFrom[room.value])
const nights = computed(() => props.pkg.nights.makkah + props.pkg.nights.madinah)
const included = computed(() => topIncluded(props.pkg.included, 5))
const next = computed(() => props.pkg.departures[0])
const uid = useId()

function enquire() {
  const pax = search.value.packages.pax
  const city = site.departureCities.find(c => c.code === props.pkg.departureCities[0])?.city
  open({
    type: 'package',
    title: `${props.pkg.name} · ${props.pkg.tierLabel} (${nights.value} nights)`,
    details: {
      [t('card.enq.departure')]: next.value ? `${city ?? ''}${city ? ', ' : ''}${formatDate(next.value)}` : undefined,
      [t('card.enq.travellers')]: `${pax.adults} adults${pax.children ? `, ${pax.children} children` : ''}${pax.infants ? `, ${pax.infants} infants` : ''}`,
      [t('card.enq.room')]: t(`card.rooms.${room.value}`),
      [t('card.enq.from')]: `${formatNgn(price.value)} per person (sample)`,
    },
    ref: `AFZ-PKG-${props.pkg.slug.toUpperCase()}`,
  })
}
</script>

<template>
  <article class="package-card group relative flex h-full flex-col rounded-md border border-line bg-ihram p-3 transition-colors duration-200 ease-house hover:border-kiswa" :aria-labelledby="`${uid}-name`">
    <!-- 1. arch image + badges -->
    <NuxtLinkLocale :to="`/packages/${pkg.slug}`" class="relative block" tabindex="-1" aria-hidden="true">
      <AppImage :slot="pkg.image" arch zoom ratio="3:4" sizes="85vw sm:45vw xl:300px" />
      <div class="absolute inset-x-4 top-[36%] flex flex-wrap items-start justify-between gap-2">
        <SampleBadge variant="glass" />
        <span v-if="pkg.featured" class="glass glass--low inline-flex h-6 items-center rounded-pill px-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white rtl:tracking-normal">{{ t('card.mostChosen') }}</span>
      </div>
    </NuxtLinkLocale>

    <div class="flex flex-1 flex-col px-2 pb-2 pt-5">
      <!-- 2. name, meaning, tier -->
      <div class="flex items-baseline justify-between gap-3">
        <component :is="headingLevel" :id="`${uid}-name`" class="font-display text-[1.75rem] font-semibold leading-none">
          <NuxtLinkLocale :to="`/packages/${pkg.slug}`" class="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">{{ dt(pkg.name) }}</NuxtLinkLocale>
        </component>
        <span class="t-label inline-flex shrink-0 items-center gap-1.5 text-stone">
          <!-- gold as a trace: an icon, never small gold text (contrast) -->
          <Icon v-if="pkg.tier === 'ramadan'" name="ph:moon-stars-fill" class="text-[0.875rem] text-gold" aria-hidden="true" />{{ dt(pkg.tierLabel) }}
        </span>
      </div>
      <p class="mt-1 font-display text-[1.125rem] italic text-stone">{{ dt(pkg.meaning) }}</p>

      <!-- 3. nights split -->
      <NightsSplit class="mt-4" :makkah="pkg.nights.makkah" :madinah="pkg.nights.madinah" size="sm" />

      <!-- 4. walking distance -->
      <p class="mt-3 flex items-center gap-2 text-[0.875rem]">
        <Icon name="ph:person-simple-walk-light" class="shrink-0 text-[1.125rem]" aria-hidden="true" />
        {{ t('card.walk', { m: pkg.hotel.makkahDistanceM, min: pkg.hotel.makkahWalkMin }) }}
      </p>

      <!-- 5. included icons with tooltips -->
      <ul class="relative z-[1] mt-4 flex gap-1.5" :aria-label="t('card.included')">
        <li v-for="inc in included" :key="inc.label" class="group/tip relative">
          <span role="img" tabindex="0" class="grid size-9 place-items-center rounded-full bg-marble text-kiswa outline-none focus-visible:ring-2 focus-visible:ring-kiswa" :aria-label="dt(inc.label)">
            <Icon :name="inc.icon" class="text-[1.125rem]" aria-hidden="true" />
          </span>
          <span role="tooltip" class="pointer-events-none absolute bottom-full start-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-kiswa px-2 py-1 text-[0.75rem] text-ihram opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 rtl:translate-x-1/2">
            {{ dt(inc.label) }}
          </span>
        </li>
      </ul>

      <!-- 6. room toggle + price -->
      <fieldset class="relative z-[1] mt-5">
        <legend class="sr-only">{{ t('card.room') }}</legend>
        <div class="grid grid-cols-3 rounded-pill bg-marble p-1">
          <label
            v-for="r in rooms"
            :key="r"
            class="relative grid min-h-9 cursor-pointer place-items-center rounded-pill text-[0.8125rem] font-semibold transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-kiswa"
            :class="room === r ? 'bg-kiswa text-ihram' : 'text-stone hover:text-kiswa'"
            :title="t('card.roomHint', { n: roomSize[r] })"
          >
            <input v-model="room" type="radio" :name="`${uid}-room`" :value="r" class="sr-only">
            {{ t(`card.rooms.${r}`) }}
          </label>
        </div>
      </fieldset>
      <PriceTag class="mt-3" :amount="price" :prefix="t('common.from')" :suffix="t('common.perPerson')" animated />

      <!-- 7. next departure -->
      <p v-if="next" class="mt-1 text-[0.8125rem] text-stone">{{ t('card.nextDeparture', { date: formatDate(next) }) }}</p>

      <!-- 8. actions -->
      <div class="relative z-[1] mt-auto grid grid-cols-[1fr_auto] gap-2 pt-5">
        <AppButton :to="`/packages/${pkg.slug}`">{{ t('card.view') }}</AppButton>
        <AppButton variant="secondary" @click="enquire">{{ t('card.enquire') }}</AppButton>
      </div>

      <label v-if="compare" class="relative z-[1] mt-3 flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.875rem]" :class="compareDisabled && !compared && 'cursor-not-allowed opacity-50'">
        <input type="checkbox" class="size-[18px] accent-kiswa" :checked="compared" :disabled="compareDisabled && !compared" @change="emit('toggle-compare')">
        {{ t('list.compare') }}
      </label>
    </div>
  </article>
</template>
