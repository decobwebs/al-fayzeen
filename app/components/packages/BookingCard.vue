<script setup lang="ts">
import type { RoomType, UmrahPackage } from '~/data/packages'
import { site } from '~/data/site'

const props = defineProps<{ pkg: UmrahPackage, idPrefix: string }>()
const { t } = useI18n()
const dt = useDataText()
const { open } = useEnquiry()

const booking = useState(`booking-${props.pkg.slug}`, () => ({
  departure: props.pkg.departures[0] ?? '',
  room: 'quad' as RoomType,
  travellers: Math.max(1, Number(useRoute().query.pax) || 2),
}))
const rooms: RoomType[] = ['quad', 'triple', 'double']
const perPerson = computed(() => props.pkg.priceFrom[booking.value.room])
const total = computed(() => perPerson.value * booking.value.travellers)
const nights = computed(() => props.pkg.nights.makkah + props.pkg.nights.madinah)

function payload() {
  return {
    type: 'package' as const,
    title: `${props.pkg.name} · ${props.pkg.tierLabel} (${nights.value} nights)`,
    details: {
      Departure: booking.value.departure ? formatDate(booking.value.departure) : undefined,
      Travellers: `${booking.value.travellers}`,
      Room: t(`card.rooms.${booking.value.room}`),
      'Estimated total': `${formatNgn(total.value)} (sample)`,
    },
    ref: `AFZ-PKG-${props.pkg.slug.toUpperCase()}`,
  }
}
</script>

<template>
  <div class="grid gap-5">
    <div class="flex items-center justify-between">
      <p class="font-display text-[1.5rem] font-semibold">{{ t('detail.book.title') }}</p>
      <SampleBadge />
    </div>

    <div class="grid gap-1.5">
      <label :for="`${idPrefix}-dep`" class="t-label text-stone">{{ t('detail.book.departure') }}</label>
      <div class="relative">
        <select :id="`${idPrefix}-dep`" v-model="booking.departure" class="h-12 w-full appearance-none rounded-sm border border-line bg-ihram pe-10 ps-3.5 text-[0.9375rem] hover:border-kiswa">
          <option v-for="d in pkg.departures" :key="d" :value="d">{{ formatDate(d, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) }}</option>
        </select>
        <Icon name="ph:caret-down-light" class="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-stone" aria-hidden="true" />
      </div>
    </div>

    <fieldset>
      <legend class="t-label mb-1.5 text-stone">{{ t('detail.book.room') }}</legend>
      <div class="grid grid-cols-3 rounded-pill bg-marble p-1">
        <label
          v-for="r in rooms"
          :key="r"
          class="grid min-h-10 cursor-pointer place-items-center rounded-pill text-[0.875rem] font-semibold transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-kiswa"
          :class="booking.room === r ? 'bg-kiswa text-ihram' : 'text-stone hover:text-kiswa'"
        >
          <input v-model="booking.room" type="radio" :name="`${idPrefix}-room`" :value="r" class="sr-only">
          {{ t(`card.rooms.${r}`) }}
        </label>
      </div>
    </fieldset>

    <div class="flex items-center justify-between gap-4">
      <p :id="`${idPrefix}-trav`" class="t-label text-stone">{{ t('detail.book.travellers') }}</p>
      <div class="flex items-center gap-1" dir="ltr" role="group" :aria-labelledby="`${idPrefix}-trav`">
        <button type="button" class="grid size-11 place-items-center rounded-full border border-line hover:border-kiswa disabled:opacity-35" :disabled="booking.travellers <= 1" :aria-label="t('search.decrease', { what: t('detail.book.travellers') })" @click="booking.travellers--">
          <Icon name="ph:minus-light" aria-hidden="true" />
        </button>
        <output class="w-8 text-center text-[1.0625rem] font-semibold tabular-nums" aria-live="polite">{{ booking.travellers }}</output>
        <button type="button" class="grid size-11 place-items-center rounded-full border border-line hover:border-kiswa disabled:opacity-35" :disabled="booking.travellers >= 12" :aria-label="t('search.increase', { what: t('detail.book.travellers') })" @click="booking.travellers++">
          <Icon name="ph:plus-light" aria-hidden="true" />
        </button>
      </div>
    </div>

    <div class="border-t border-line pt-5">
      <p class="t-label text-stone">{{ t('detail.book.total') }}</p>
      <PriceTag class="mt-1" :amount="total" size="lg" animated />
      <p class="mt-1 text-[0.8125rem] text-stone">{{ t('detail.book.perPerson', { price: formatNgn(perPerson), n: booking.travellers }) }}</p>
      <p class="mt-3 flex justify-between text-[0.875rem]">
        <span class="text-stone">{{ t('detail.book.deposit') }}</span>
        <span v-if="site.policies.depositPercent" class="ltr-iso font-semibold">{{ site.policies.depositPercent }}%</span>
        <GapText v-else :text="t('detail.book.depositGap')" />
      </p>
    </div>

    <div class="grid gap-2">
      <AppButton size="lg" block @click="open(payload())">{{ t('detail.book.enquire') }}</AppButton>
      <AppButton size="lg" block variant="secondary" icon-start="ph:whatsapp-logo" :directional="false" @click="open(payload(), { channel: 'whatsapp' })">{{ t('detail.book.whatsapp') }}</AppButton>
    </div>
    <p class="text-center text-[0.75rem] text-stone">{{ t('detail.book.note') }} · {{ dt(pkg.name) }}</p>
  </div>
</template>
