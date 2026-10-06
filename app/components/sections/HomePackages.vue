<script setup lang="ts">
import { packages } from '~/data/packages'
import type { Tier } from '~/data/packages'

const { t } = useI18n()
const chipRow = ref<HTMLElement | null>(null)
const filter = ref<'all' | Tier>('all')
const chips = ['all', 'essential', 'comfort', 'premium', 'ramadan'] as const
const { style: chipStyle, ready: chipReady } = useSlidingIndicator(chipRow, '[aria-checked="true"]', filter)
const shown = computed(() => (filter.value === 'all' ? packages : packages.filter(p => p.tier === filter.value)))
</script>

<template>
  <section class="section-y bg-ihram" aria-labelledby="packages-h">
    <div class="wrap">
      <SectionHeading id="packages-h" :ar="t('packages.eyebrowAr')" :eyebrow="t('packages.eyebrow')" :title="t('packages.h2')">
        <AppButton variant="link" to="/packages" icon-end="ph:arrow-right-light" class="hidden md:inline-flex">{{ t('packages.compareAll') }}</AppButton>
      </SectionHeading>

      <div class="no-scrollbar -mx-[var(--gutter)] mt-8 overflow-x-auto px-[var(--gutter)]">
        <div ref="chipRow" class="relative inline-flex gap-1 rounded-pill border border-line p-1" role="radiogroup" :aria-label="t('packages.filterLabel')">
          <span
            class="pointer-events-none absolute start-0 top-0 rounded-pill bg-kiswa rtl:start-auto rtl:left-0"
            :class="chipReady && 'transition-[transform,width] duration-[450ms] ease-house'"
            :style="chipStyle"
            aria-hidden="true"
          />
          <button
            v-for="c in chips"
            :key="c"
            type="button"
            role="radio"
            :aria-checked="filter === c"
            class="relative min-h-10 rounded-pill px-4 text-[0.875rem] font-semibold transition-colors duration-200"
            :class="filter === c ? 'text-ihram' : 'text-stone hover:text-kiswa'"
            @click="filter = c"
          >
            <span class="relative">{{ t(`packages.filters.${c}`) }}</span>
          </button>
        </div>
      </div>

      <ul
        class="no-scrollbar -mx-[var(--gutter)] mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 xl:grid-cols-4"
        aria-live="polite"
      >
        <li v-for="p in shown" :key="p.slug" class="w-[84%] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none">
          <PackageCard :pkg="p" />
        </li>
        <li v-if="!shown.length" class="text-stone">{{ t('packages.empty') }}</li>
      </ul>

      <AppButton variant="link" to="/packages" icon-end="ph:arrow-right-light" class="mt-6 md:hidden">{{ t('packages.compareAll') }}</AppButton>
    </div>
  </section>
</template>
