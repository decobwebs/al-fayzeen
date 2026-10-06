<script setup lang="ts">
import { hotels } from '~/data/hotels'

const { t } = useI18n()
useHead({ title: () => t('hotelsPage.h1') })
const route = useRoute()
const router = useRouter()
const s = useSearch()

const q = route.query
const str = (k: string) => (typeof q[k] === 'string' ? String(q[k]) : '')
const city = ref<'makkah' | 'madinah'>(str('city') === 'madinah' ? 'madinah' : s.value.hotels.city)
const checkin = str('checkin') || s.value.hotels.checkin || ''
const checkout = str('checkout') || s.value.hotels.checkout || ''
const rooms = Number(str('rooms')) || s.value.hotels.rooms
const guests = (Number(str('adults')) || s.value.hotels.pax.adults) + (Number(str('children')) || 0)
const walk = ['5', '10', '15'].includes(str('walk')) ? Number(str('walk')) : 0
const sort = ref<'walk' | 'price'>('walk')

const nights = checkin && checkout ? Math.max(1, Math.round((Date.parse(checkout) - Date.parse(checkin)) / 86400000)) : 0
watch(city, (c) => { router.replace({ query: { ...route.query, city: c } }) })

const cheapest = (h: (typeof hotels)[number]) => Math.min(...h.rooms.map(r => r.perNightNgn))
const list = computed(() => hotels
  .filter(h => h.city === city.value && (!walk || h.walkMin <= walk))
  .sort((a, b) => sort.value === 'walk' ? a.walkMin - b.walkMin : cheapest(a) - cheapest(b)))
</script>

<template>
  <div>
    <header class="wrap pb-6 pt-10 md:pt-16">
      <ArabicEyebrow :ar="t('hotelsPage.eyebrowAr')" :label="t('hotelsPage.eyebrow')" />
      <h1 class="t-h2 mt-4 md:text-[3.5rem]!">{{ t('hotelsPage.h1') }}</h1>
      <div class="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <fieldset>
          <legend class="sr-only">{{ t('hotels.cityLabel') }}</legend>
          <div class="inline-flex rounded-pill border border-line p-1">
            <label
              v-for="c in (['makkah', 'madinah'] as const)"
              :key="c"
              class="grid min-h-10 cursor-pointer place-items-center rounded-pill px-5 text-[0.875rem] font-semibold transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kiswa"
              :class="city === c ? (c === 'madinah' ? 'bg-nabawi text-white' : 'bg-kiswa text-ihram') : 'text-stone hover:text-kiswa'"
            >
              <input v-model="city" type="radio" name="hotels-city" :value="c" class="sr-only">
              {{ t(`search.cities.${c}`) }}
            </label>
          </div>
        </fieldset>
        <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem]">
          <span v-if="checkin" class="inline-flex items-center gap-2"><Icon name="ph:calendar-blank-light" class="text-[1.125rem]" aria-hidden="true" /><span class="ltr-iso">{{ formatDate(checkin, { day: 'numeric', month: 'short' }) }} – {{ formatDate(checkout, { day: 'numeric', month: 'short' }) }}</span></span>
          <span v-if="nights" class="text-stone">· {{ t('hotelsPage.nights', { n: nights }, nights) }}</span>
          <span class="text-stone">· {{ t('hotelsPage.rooms', { n: rooms }, rooms) }}, {{ t('hotelsPage.guests', { n: guests }, guests) }}</span>
          <span v-if="walk" class="text-stone">· {{ t('hotelsPage.walkFilter', { label: t(`search.walks.${walk}`) }) }}</span>
        </p>
      </div>
    </header>

    <div class="wrap">
      <NoticeBanner :text="t('notice.hotels')" />
      <div class="mt-8 flex items-center justify-between gap-3">
        <p class="font-semibold" aria-live="polite">{{ t('hotelsPage.results', { n: list.length }, list.length) }}</p>
        <label for="ht-sort" class="sr-only">{{ t('hotelsPage.sort') }}</label>
        <div class="relative">
          <select id="ht-sort" v-model="sort" class="h-11 appearance-none rounded-pill border border-line bg-ihram pe-10 ps-4 text-[0.875rem] font-semibold hover:border-kiswa">
            <option value="walk">{{ t('hotelsPage.sorts.walk') }}</option>
            <option value="price">{{ t('hotelsPage.sorts.price') }}</option>
          </select>
          <Icon name="ph:caret-down-light" class="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
        </div>
      </div>
      <ul v-if="list.length" class="mt-5 grid gap-4 pb-24" aria-live="polite">
        <li v-for="h in list" :key="h.id"><HotelCard :hotel="h" layout="list" :nights="nights || undefined" /></li>
      </ul>
      <p v-else class="mt-5 rounded-md border border-dashed border-stone/40 p-8 pb-24 font-display text-[1.5rem]">{{ t('hotelsPage.none') }}</p>
    </div>
  </div>
</template>
