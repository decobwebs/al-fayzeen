<script setup lang="ts">
import type { FlightFilterState } from '~/utils/flightResults'

defineProps<{ idPrefix: string, airlines: string[], priceMin: number, priceMax: number }>()
const state = defineModel<FlightFilterState>('state', { required: true })
const emit = defineEmits<{ reset: [] }>()
const { t } = useI18n()
const times = ['morning', 'afternoon', 'evening', 'night'] as const

function toggle<T extends string>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter(x => x !== v) : [...list, v]
}
const chip = (on: boolean) => [
  'grid min-h-10 cursor-pointer place-items-center rounded-pill border px-3.5 text-[0.8125rem] font-semibold transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kiswa',
  on ? 'border-kiswa bg-kiswa text-ihram' : 'border-line hover:border-kiswa',
]
</script>

<template>
  <div class="grid gap-7">
    <fieldset>
      <legend class="t-label mb-3 text-stone">{{ t('flights.stops') }}</legend>
      <div class="flex flex-wrap gap-2">
        <label v-for="s in (['any', '0', '1'] as const)" :key="s" :class="chip(state.stops === s)">
          <input v-model="state.stops" type="radio" :name="`${idPrefix}-stops`" :value="s" class="sr-only">
          {{ t(`flights.stopsOpts.${s}`) }}
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend class="t-label mb-3 text-stone">{{ t('flights.time') }}</legend>
      <div class="grid gap-1">
        <label v-for="tm in times" :key="tm" class="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem]">
          <input type="checkbox" class="size-[18px] accent-kiswa" :checked="state.times.includes(tm)" @change="state.times = toggle(state.times, tm)">
          {{ t(`flights.times.${tm}`) }}
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend class="t-label mb-3 text-stone">{{ t('flights.airline') }}</legend>
      <div class="grid gap-1">
        <label v-for="a in airlines" :key="a" class="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem]">
          <input type="checkbox" class="size-[18px] accent-kiswa" :checked="state.airlines.includes(a)" @change="state.airlines = toggle(state.airlines, a)">
          {{ a }}
        </label>
      </div>
    </fieldset>

    <div>
      <label :for="`${idPrefix}-price`" class="t-label text-stone">{{ t('flights.price') }}</label>
      <input :id="`${idPrefix}-price`" v-model.number="state.maxPrice" type="range" :min="priceMin" :max="priceMax" :step="10000" class="mt-3 w-full accent-kiswa" :aria-valuetext="formatNgn(state.maxPrice)">
      <p class="ltr-iso mt-1 text-[0.875rem] font-semibold tabular-nums">{{ formatNgn(state.maxPrice) }}</p>
    </div>

    <AppButton variant="link" icon-start="ph:arrow-counter-clockwise-light" :directional="false" class="justify-self-start" @click="emit('reset')">{{ t('flights.reset') }}</AppButton>
  </div>
</template>
