<script setup lang="ts">
const { t } = useI18n()

const tiles = computed(() => [
  { key: 'flights', to: '/flights', icon: 'ph:airplane-tilt-duotone' },
  { key: 'hotels', to: '/hotels', icon: 'ph:buildings-duotone' },
  { key: 'transport', to: '/transport', icon: 'ph:van-duotone' },
  { key: 'visa', to: '/visa', icon: 'ph:identification-card-duotone' },
])
</script>

<template>
  <section class="section-y bg-ihram pt-12! md:pt-16!" aria-labelledby="services-h">
    <div class="wrap">
      <SectionHeading id="services-h" :ar="t('services.eyebrowAr')" :eyebrow="t('services.eyebrow')" :title="t('services.h2')" />

      <div class="mt-10 grid gap-3 md:mt-14 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:grid-rows-2">
        <!-- Packages: the large 2×2 tile with an arch image on its end side -->
        <NuxtLinkLocale
          to="/packages"
          class="service-tile group relative flex flex-col overflow-hidden rounded-md border border-line bg-ihram p-6 transition-colors duration-200 ease-house hover:border-kiswa hover:bg-marble sm:flex-row sm:items-stretch sm:gap-6 md:col-span-2 md:p-8 lg:row-span-2"
        >
          <div class="flex flex-1 flex-col">
            <Icon name="ph:moon-stars-duotone" class="text-[2.25rem]" aria-hidden="true" />
            <h3 class="t-h3 mt-auto pt-10 text-[1.875rem]! md:text-[2.25rem]!">{{ t('services.tiles.packages.title') }}</h3>
            <p class="mt-3 max-w-[26ch] text-stone">{{ t('services.tiles.packages.text') }}</p>
            <span class="mt-6 inline-flex items-center gap-2 font-semibold">
              {{ t('services.explore') }}
              <Icon name="ph:arrow-right-light" class="flip-rtl transition-transform duration-200 ease-house group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
            </span>
          </div>
          <div class="mt-6 w-full shrink-0 sm:mt-0 sm:w-[44%] lg:w-[46%]">
            <AppImage slot="pkg-rahmah" arch zoom sizes="100vw sm:300px lg:280px" />
          </div>
        </NuxtLinkLocale>

        <NuxtLinkLocale
          v-for="tile in tiles"
          :key="tile.key"
          :to="tile.to"
          class="group flex min-h-[180px] flex-col rounded-md border border-line bg-ihram p-6 transition-colors duration-200 ease-house hover:border-kiswa hover:bg-marble"
        >
          <Icon :name="tile.icon" class="text-[2rem]" aria-hidden="true" />
          <h3 class="t-h3 mt-auto pt-6">{{ t(`services.tiles.${tile.key}.title`) }}</h3>
          <p class="mt-2 text-[0.9375rem] leading-snug text-stone">
            {{ t(`services.tiles.${tile.key}.text`) }}
            <GapText v-if="tile.key === 'visa'" :text="t('services.tiles.visa.gap')" />
          </p>
          <Icon name="ph:arrow-right-light" class="flip-rtl mt-4 text-[1.25rem] transition-transform duration-200 ease-house group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
        </NuxtLinkLocale>
      </div>
    </div>
  </section>
</template>
