<script setup lang="ts">
import { hotels } from '~/data/hotels'

const { t } = useI18n()
const city = ref<'makkah' | 'madinah'>('makkah')
const shown = computed(() => hotels.filter(h => h.city === city.value).slice(0, 3))
</script>

<template>
  <section class="section-y bg-marble pt-10! md:pt-14!" aria-labelledby="hotels-h">
    <div class="wrap">
      <SectionHeading id="hotels-h" :ar="t('hotels.eyebrowAr')" :eyebrow="t('hotels.eyebrow')" :title="t('hotels.h2')">
        <AppButton variant="link" to="/hotels" icon-end="ph:arrow-right-light" class="hidden md:inline-flex">{{ t('hotels.seeAll') }}</AppButton>
      </SectionHeading>

      <fieldset class="mt-8">
        <legend class="sr-only">{{ t('hotels.cityLabel') }}</legend>
        <div class="inline-flex rounded-pill border border-line bg-ihram p-1">
          <label
            v-for="c in (['makkah', 'madinah'] as const)"
            :key="c"
            class="grid min-h-10 cursor-pointer place-items-center rounded-pill px-5 text-[0.875rem] font-semibold transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kiswa"
            :class="city === c ? (c === 'madinah' ? 'bg-nabawi text-white' : 'bg-kiswa text-ihram') : 'text-stone hover:text-kiswa'"
          >
            <input v-model="city" type="radio" name="home-hotel-city" :value="c" class="sr-only">
            {{ t(`search.cities.${c}`) }}
          </label>
        </div>
      </fieldset>

      <ul class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5" aria-live="polite">
        <li v-for="h in shown" :key="h.id">
          <HotelCard :hotel="h" />
        </li>
      </ul>
      <AppButton variant="link" to="/hotels" icon-end="ph:arrow-right-light" class="mt-6 md:hidden">{{ t('hotels.seeAll') }}</AppButton>
    </div>
  </section>
</template>
