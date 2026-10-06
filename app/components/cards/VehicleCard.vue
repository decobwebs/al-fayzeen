<script setup lang="ts">
import type { ServiceId, Vehicle } from '~/data/transport'

const props = defineProps<{ vehicle: Vehicle, service: ServiceId, trip: Record<string, string | number | undefined> }>()
const { t } = useI18n()
const dt = useDataText()
const { open } = useEnquiry()
const uid = useId()
const price = computed(() => props.vehicle.priceNgn[props.service])
const coach = computed(() => props.vehicle.id === 'coach')

function enquire() {
  open({
    type: 'transport',
    title: `${props.vehicle.className} · ${t(`search.services.${props.service}`)} (sample)`,
    details: { ...props.trip, 'Price': `${formatNgn(price.value)} ${props.service === 'daily' ? 'per day' : 'per vehicle'} (sample)` },
    ref: `AFZ-TRN-${props.vehicle.id.toUpperCase()}`,
  })
}
</script>

<template>
  <article class="group flex h-full flex-col rounded-md border border-line bg-ihram p-3 transition-colors duration-200 ease-house hover:border-kiswa" :aria-labelledby="`${uid}-n`">
    <div class="relative">
      <AppImage :slot="vehicle.image" ratio="4:3" rounded="sm" sizes="100vw sm:50vw lg:300px" />
      <SampleBadge class="absolute start-3 top-3" />
    </div>
    <div class="flex flex-1 flex-col px-2 pb-2 pt-5">
      <h3 :id="`${uid}-n`" class="t-h3">{{ dt(vehicle.className) }}</h3>
      <p class="mt-1 text-[0.875rem] text-stone">{{ dt(vehicle.like) }}</p>
      <p class="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.875rem]">
        <span class="inline-flex items-center gap-2"><Icon name="ph:users-light" class="text-[1.125rem]" aria-hidden="true" />{{ coach ? t('transport.seatsUpTo', { n: vehicle.seats }) : t('transport.seats', { n: vehicle.seats }) }}</span>
        <span class="inline-flex items-center gap-2"><Icon name="ph:suitcase-rolling-light" class="text-[1.125rem]" aria-hidden="true" />{{ coach ? t('transport.bagsPer') : t('transport.bags', { n: vehicle.bags }) }}</span>
      </p>
      <PriceTag class="mt-4" :amount="price" :suffix="service === 'daily' ? t('transport.perDay') : t('transport.perTrip')" animated />
      <div class="mt-auto pt-5">
        <AppButton variant="secondary" block @click="enquire">{{ t('transport.enquire') }}</AppButton>
      </div>
    </div>
  </article>
</template>
