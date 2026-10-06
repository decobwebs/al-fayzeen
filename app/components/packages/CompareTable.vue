<script setup lang="ts">
import type { RoomType, UmrahPackage } from '~/data/packages'
import { site } from '~/data/site'

const props = defineProps<{ items: UmrahPackage[] }>()
const { t } = useI18n()
const dt = useDataText()
const rooms: RoomType[] = ['quad', 'triple', 'double']

// every inclusion across the compared packages, so absences are visible
const allIncluded = computed(() => [...new Set(props.items.flatMap(p => p.included))])
const cityName = (code: string) => dt(site.departureCities.find(c => c.code === code)?.city ?? code)
</script>

<template>
  <div class="-mx-5 overflow-x-auto px-5 md:-mx-8 md:px-8">
    <table class="w-full min-w-[560px] border-collapse text-[0.875rem]">
      <caption class="sr-only">{{ t('list.compareTitle') }}</caption>
      <thead>
        <tr>
          <td class="w-[30%]" />
          <th v-for="p in items" :key="p.slug" scope="col" class="px-3 pb-4 text-start align-bottom">
            <div class="w-24"><AppImage :slot="p.image" arch ratio="3:4" sizes="96px" /></div>
            <p class="mt-3 font-display text-[1.375rem] font-semibold leading-none">{{ dt(p.name) }}</p>
            <p class="mt-1 text-[0.75rem] font-normal text-stone">{{ dt(p.tierLabel) }} · <SampleBadge class="ms-1 align-middle" /></p>
          </th>
        </tr>
      </thead>
      <tbody class="[&>tr]:border-t [&>tr]:border-line">
        <tr v-for="r in rooms" :key="r">
          <th scope="row" class="py-3 pe-3 text-start font-medium text-stone">{{ t(`list.rows.${r}`) }}</th>
          <td v-for="p in items" :key="p.slug" class="px-3 py-3"><span class="ltr-iso font-semibold tabular-nums">{{ formatNgn(p.priceFrom[r]) }}</span></td>
        </tr>
        <tr>
          <th scope="row" class="py-3 pe-3 text-start font-medium text-stone">{{ t('list.rows.nights') }}</th>
          <td v-for="p in items" :key="p.slug" class="px-3 py-3"><NightsSplit :makkah="p.nights.makkah" :madinah="p.nights.madinah" size="sm" /></td>
        </tr>
        <tr>
          <th scope="row" class="py-3 pe-3 text-start font-medium text-stone">{{ t('list.rows.walk') }}</th>
          <td v-for="p in items" :key="p.slug" class="px-3 py-3">{{ t('detail.overview.walk', { min: p.hotel.makkahWalkMin, m: p.hotel.makkahDistanceM }) }}</td>
        </tr>
        <tr>
          <th scope="row" class="py-3 pe-3 text-start font-medium text-stone">{{ t('list.rows.stars') }}</th>
          <td v-for="p in items" :key="p.slug" class="px-3 py-3">{{ t('detail.overview.stars', { n: p.hotel.stars }) }}</td>
        </tr>
        <tr>
          <th scope="row" class="py-3 pe-3 text-start font-medium text-stone">{{ t('list.rows.transport') }}</th>
          <td v-for="p in items" :key="p.slug" class="px-3 py-3">{{ dt(p.transport) }}</td>
        </tr>
        <tr>
          <th scope="row" class="py-3 pe-3 text-start align-top font-medium text-stone">{{ t('list.rows.included') }}</th>
          <td v-for="p in items" :key="p.slug" class="px-3 py-3 align-top">
            <ul class="grid gap-1.5">
              <li v-for="inc in allIncluded" :key="inc" class="flex items-start gap-2" :class="!p.included.includes(inc) && 'text-stone/70'">
                <Icon :name="p.included.includes(inc) ? 'ph:check-light' : 'ph:minus-light'" class="mt-0.5 shrink-0" :aria-label="p.included.includes(inc) ? t('detail.included.yes') : t('detail.included.no')" />
                {{ dt(inc) }}
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th scope="row" class="py-3 pe-3 text-start font-medium text-stone">{{ t('list.rows.departure') }}</th>
          <td v-for="p in items" :key="p.slug" class="px-3 py-3">{{ p.departures[0] ? formatDate(p.departures[0]) : '' }}<br><span class="text-[0.75rem] text-stone">{{ p.departureCities.map(cityName).join(', ') }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
