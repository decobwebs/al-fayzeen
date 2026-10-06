<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import type { Pax } from '~/composables/useSearch'

/** Travellers popover with steppers. Optional rooms and cabin rows. */
const props = withDefaults(defineProps<{
  id: string
  label: string
  infants?: boolean
  withRooms?: boolean
  withCabin?: boolean
}>(), { infants: true })

const pax = defineModel<Pax>('pax', { required: true })
const roomsModel = defineModel<number>('rooms', { default: 1 })
const cabinModel = defineModel<'Economy' | 'Business'>('cabin', { default: 'Economy' })

const { t } = useI18n()
const open = ref(false)

const rows = computed(() => [
  { key: 'adults' as const, label: t('search.adults'), hint: t('search.adultsHint'), min: 1, max: 9 },
  { key: 'children' as const, label: t('search.children'), hint: t('search.childrenHint'), min: 0, max: 8 },
  ...(props.infants ? [{ key: 'infants' as const, label: t('search.infants'), hint: t('search.infantsHint'), min: 0, max: pax.value.adults }] : []),
])

const total = computed(() => pax.value.adults + pax.value.children + (props.infants ? pax.value.infants : 0))
const summary = computed(() => {
  if (props.withRooms) return t('search.roomsSummary', { rooms: roomsModel.value, guests: total.value }, roomsModel.value)
  const s = t('search.travellersSummary', { n: total.value }, total.value)
  return props.withCabin ? `${s} · ${t(`search.cabins.${cabinModel.value}`)}` : s
})

function step(key: keyof Pax, d: number, min: number, max: number) {
  const v = Math.min(max, Math.max(min, pax.value[key] + d))
  pax.value = { ...pax.value, [key]: v }
  if (key === 'adults' && pax.value.infants > v) pax.value = { ...pax.value, infants: v }
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <SearchField :label="label">
      <PopoverTrigger
        :id="id"
        class="peer absolute inset-0 h-full w-full cursor-pointer rounded-sm outline-none lg:rounded-none"
        :aria-label="`${label}: ${summary}`"
      />
      <span class="pointer-events-none block truncate pe-6 text-[1rem] font-medium text-white tabular-nums">{{ summary }}</span>
      <Icon name="ph:caret-down-light" class="pointer-events-none absolute bottom-[14px] end-4 text-[1rem] text-white/70 lg:end-5" aria-hidden="true" />
      <span class="pointer-events-none absolute inset-0 rounded-sm ring-white/80 peer-focus-visible:ring-2 lg:rounded-none" aria-hidden="true" />
    </SearchField>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        align="start"
        :side-offset="8"
        :collision-padding="12"
        class="popover-pane z-[60] w-[min(340px,calc(100vw-24px))] rounded-md border border-line bg-ihram p-2 text-kiswa shadow-[0_24px_60px_-20px_rgba(11,11,12,.45)]"
      >
        <div v-for="r in rows" :key="r.key" class="flex items-center justify-between gap-4 px-3 py-3 [&+&]:border-t [&+&]:border-line">
          <div>
            <p class="text-[0.9375rem] font-semibold">{{ r.label }}</p>
            <p class="text-[0.8125rem] text-stone">{{ r.hint }}</p>
          </div>
          <div class="flex items-center gap-1" dir="ltr">
            <button type="button" class="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-kiswa disabled:opacity-35 disabled:hover:border-line" :disabled="pax[r.key] <= r.min" :aria-label="t('search.decrease', { what: r.label })" @click="step(r.key, -1, r.min, r.max)">
              <Icon name="ph:minus-light" aria-hidden="true" />
            </button>
            <output class="w-8 text-center text-[1.0625rem] font-semibold tabular-nums" aria-live="polite">{{ pax[r.key] }}</output>
            <button type="button" class="grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-kiswa disabled:opacity-35 disabled:hover:border-line" :disabled="pax[r.key] >= r.max" :aria-label="t('search.increase', { what: r.label })" @click="step(r.key, 1, r.min, r.max)">
              <Icon name="ph:plus-light" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div v-if="withRooms" class="flex items-center justify-between gap-4 border-t border-line px-3 py-3">
          <p class="text-[0.9375rem] font-semibold">{{ t('search.rooms') }}</p>
          <div class="flex items-center gap-1" dir="ltr">
            <button type="button" class="grid size-11 place-items-center rounded-full border border-line hover:border-kiswa disabled:opacity-35" :disabled="roomsModel <= 1" :aria-label="t('search.decrease', { what: t('search.rooms') })" @click="roomsModel--">
              <Icon name="ph:minus-light" aria-hidden="true" />
            </button>
            <output class="w-8 text-center text-[1.0625rem] font-semibold tabular-nums">{{ roomsModel }}</output>
            <button type="button" class="grid size-11 place-items-center rounded-full border border-line hover:border-kiswa disabled:opacity-35" :disabled="roomsModel >= 6" :aria-label="t('search.increase', { what: t('search.rooms') })" @click="roomsModel++">
              <Icon name="ph:plus-light" aria-hidden="true" />
            </button>
          </div>
        </div>

        <fieldset v-if="withCabin" class="border-t border-line px-3 py-3">
          <legend class="float-start mb-2 text-[0.9375rem] font-semibold">{{ t('search.cabin') }}</legend>
          <div class="clear-both flex gap-2">
            <label v-for="c in (['Economy', 'Business'] as const)" :key="c" class="grid min-h-11 flex-1 cursor-pointer place-items-center rounded-pill border text-[0.875rem] font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kiswa" :class="cabinModel === c ? 'border-kiswa bg-kiswa text-ihram' : 'border-line'">
              <input v-model="cabinModel" type="radio" :value="c" :name="`${id}-cabin`" class="sr-only">
              {{ t(`search.cabins.${c}`) }}
            </label>
          </div>
        </fieldset>

        <div class="flex justify-end px-1 pb-1 pt-2">
          <AppButton size="md" @click="open = false">{{ t('search.done') }}</AppButton>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
