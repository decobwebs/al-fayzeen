<script setup lang="ts">
import { site } from '~/data/site'
import type { Tier } from '~/data/packages'
import { BUDGET, NIGHTS } from '~/composables/usePackageFilters'
import type { PackageFilterState } from '~/composables/usePackageFilters'

defineProps<{ idPrefix: string }>()
const state = defineModel<PackageFilterState>('state', { required: true })
const emit = defineEmits<{ reset: [] }>()
const { t } = useI18n()
const dt = useDataText()
const months = useMonthOptions()
const tiers: Tier[] = ['essential', 'comfort', 'premium', 'ramadan']

function toggleStyle(s: Tier) {
  const set = new Set(state.value.styles)
  if (set.has(s)) set.delete(s)
  else set.add(s)
  state.value.styles = tiers.filter(x => set.has(x))
}
const budget = computed({ get: () => [...state.value.budget], set: (v: number[]) => { state.value.budget = [v[0]!, v[1]!] } })
const nights = computed({ get: () => [...state.value.nights], set: (v: number[]) => { state.value.nights = [v[0]!, v[1]!] } })
const shortNgn = (n: number) => `₦${(n / 1_000_000).toLocaleString('en-NG', { maximumFractionDigits: 1 })}m`

const chip = (on: boolean) => [
  'min-h-10 rounded-pill border px-3.5 text-[0.8125rem] font-semibold transition-colors duration-200',
  on ? 'border-kiswa bg-kiswa text-ihram' : 'border-line text-kiswa hover:border-kiswa',
]
</script>

<template>
  <div class="grid gap-7">
    <div class="grid gap-2">
      <label :for="`${idPrefix}-month`" class="t-label text-stone">{{ t('list.month') }}</label>
      <div class="relative">
        <select :id="`${idPrefix}-month`" v-model="state.month" class="h-12 w-full appearance-none rounded-sm border border-line bg-ihram pe-10 ps-3.5 text-[0.9375rem] hover:border-kiswa">
          <option value="">{{ t('search.monthAny') }}</option>
          <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
        <Icon name="ph:caret-down-light" class="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-stone" aria-hidden="true" />
      </div>
    </div>

    <fieldset class="grid gap-2">
      <legend class="t-label mb-2 text-stone">{{ t('list.style') }}</legend>
      <div class="flex flex-wrap gap-2">
        <button v-for="s in tiers" :key="s" type="button" :aria-pressed="state.styles.includes(s)" :class="chip(state.styles.includes(s))" @click="toggleStyle(s)">
          {{ t(`search.styles.${s}`) }}
        </button>
      </div>
    </fieldset>

    <div class="grid gap-1">
      <p :id="`${idPrefix}-budget`" class="t-label text-stone">{{ t('list.budget') }}</p>
      <RangeSlider v-model="budget" :min="BUDGET.min" :max="BUDGET.max" :step="BUDGET.step" :label="t('list.budget')" :format="shortNgn" />
    </div>

    <div class="grid gap-1">
      <p class="t-label text-stone">{{ t('list.nights') }}</p>
      <RangeSlider v-model="nights" :min="NIGHTS.min" :max="NIGHTS.max" :step="1" :label="t('list.nights')" />
    </div>

    <fieldset>
      <legend class="t-label mb-3 text-stone">{{ t('list.walk') }}</legend>
      <div class="flex flex-wrap gap-2">
        <label v-for="w in (['any', '5', '10', '15'] as const)" :key="w" :class="chip(state.walk === w)" class="grid cursor-pointer place-items-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kiswa">
          <input v-model="state.walk" type="radio" :name="`${idPrefix}-walk`" :value="w" class="sr-only">
          {{ w === 'any' ? t('list.any') : t('list.walkUnder', { n: w }) }}
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend class="t-label mb-3 text-stone">{{ t('list.flights') }}</legend>
      <div class="flex flex-wrap gap-2">
        <label v-for="f in (['any', 'yes', 'no'] as const)" :key="f" :class="chip(state.flights === f)" class="grid cursor-pointer place-items-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kiswa">
          <input v-model="state.flights" type="radio" :name="`${idPrefix}-flights`" :value="f" class="sr-only">
          {{ t(`list.${f}`) }}
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend class="t-label mb-3 text-stone">{{ t('list.city') }}</legend>
      <div class="flex flex-wrap gap-2">
        <label v-for="c in [{ code: '', city: t('list.anyCity') }, ...site.departureCities]" :key="c.code" :class="chip(state.city === c.code)" class="grid cursor-pointer place-items-center has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kiswa">
          <input v-model="state.city" type="radio" :name="`${idPrefix}-city`" :value="c.code" class="sr-only">
          {{ c.code ? dt(c.city) : c.city }}
        </label>
      </div>
    </fieldset>

    <AppButton variant="link" icon-start="ph:arrow-counter-clockwise-light" :directional="false" class="justify-self-start" @click="emit('reset')">{{ t('list.reset') }}</AppButton>
  </div>
</template>
