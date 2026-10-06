<script setup lang="ts">
import { packages } from '~/data/packages'

const { t } = useI18n()
const dt = useDataText()
useHead({ title: () => t('list.h1') })
const { open: openEnquiry } = useEnquiry()

const { state, results, activeCount, reset, pax } = usePackageFilters()
const sheetOpen = ref(false)

// compare up to 3
const compared = ref<string[]>([])
const compareOpen = ref(false)
function toggleCompare(slug: string) {
  compared.value = compared.value.includes(slug) ? compared.value.filter(s => s !== slug) : compared.value.length < 3 ? [...compared.value, slug] : compared.value
}
const comparedPkgs = computed(() => compared.value.map(s => packages.find(p => p.slug === s)!).filter(Boolean))

function askForCustom() {
  openEnquiry({
    type: 'package',
    title: 'A package built for my dates',
    details: {
      Month: state.month || undefined,
      Style: state.styles.join(', ') || undefined,
      Travellers: pax.value || undefined,
    },
  }, { channel: 'whatsapp' })
}
</script>

<template>
  <div>
    <header class="wrap pb-8 pt-10 md:pb-12 md:pt-16">
      <ArabicEyebrow :ar="t('list.eyebrowAr')" :label="t('list.eyebrow')" />
      <h1 class="t-h2 mt-4 md:text-[3.5rem]!">{{ t('list.h1') }}</h1>
      <p class="mt-4 max-w-[40rem] text-[1.0625rem] leading-relaxed text-stone">
        {{ t('list.sub') }} <GapText :text="t('list.subGap')" />
      </p>
    </header>

    <div class="wrap grid gap-8 pb-24 lg:grid-cols-[280px_1fr] lg:gap-12">
      <!-- desktop: sticky start-side filter column -->
      <aside class="hidden lg:block" :aria-label="t('list.filters')">
        <div class="sticky top-[96px] max-h-[calc(100svh-120px)] overflow-y-auto pb-6 pe-2">
          <div class="mb-6 flex items-center justify-between">
            <h2 class="t-label font-body! text-kiswa">{{ t('list.filters') }}</h2>
            <span v-if="activeCount" class="grid size-6 place-items-center rounded-full bg-kiswa text-[0.75rem] font-semibold text-ihram">{{ activeCount }}</span>
          </div>
          <PackageFilters v-model:state="state" id-prefix="fd" @reset="reset" />
        </div>
      </aside>

      <section :aria-label="t('list.results', { n: results.length }, results.length)">
        <!-- toolbar -->
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p class="text-[0.9375rem]" aria-live="polite">
            <span class="font-semibold">{{ t('list.results', { n: results.length }, results.length) }}</span>
            <span v-if="pax" class="text-stone"> · {{ t('list.searchFor', { pax }) }}</span>
          </p>
          <div class="flex items-center gap-2">
            <AppButton variant="secondary" icon-start="ph:sliders-horizontal-light" :directional="false" class="lg:hidden" @click="sheetOpen = true">
              {{ t('list.filters') }}<span v-if="activeCount" class="ms-1 tabular-nums">({{ activeCount }})</span>
            </AppButton>
            <label for="pk-sort" class="sr-only">{{ t('list.sort') }}</label>
            <div class="relative">
              <select id="pk-sort" v-model="state.sort" class="h-11 appearance-none rounded-pill border border-line bg-ihram pe-10 ps-4 text-[0.875rem] font-semibold hover:border-kiswa">
                <option v-for="s in (['departure', 'price', 'walk'] as const)" :key="s" :value="s">{{ t(`list.sorts.${s}`) }}</option>
              </select>
              <Icon name="ph:caret-down-light" class="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            </div>
          </div>
        </div>

        <ul v-if="results.length" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <li v-for="p in results" :key="p.slug">
            <PackageCard
              :pkg="p"
              heading-level="h2"
              compare
              :compared="compared.includes(p.slug)"
              :compare-disabled="compared.length >= 3"
              @toggle-compare="toggleCompare(p.slug)"
            />
          </li>
        </ul>

        <!-- empty state -->
        <div v-else class="grid place-items-start gap-5 rounded-md border border-dashed border-stone/40 p-8 md:p-12">
          <Icon name="ph:moon-stars-duotone" class="text-[2.25rem]" aria-hidden="true" />
          <p class="max-w-[36rem] font-display text-[1.625rem] leading-snug">{{ t('list.empty') }}</p>
          <div class="flex flex-wrap gap-3">
            <AppButton icon-start="ph:whatsapp-logo" :directional="false" @click="askForCustom">{{ t('list.emptyButton') }}</AppButton>
            <AppButton variant="secondary" @click="reset">{{ t('list.reset') }}</AppButton>
          </div>
        </div>
      </section>
    </div>

    <!-- mobile filters sheet -->
    <UiSheet v-model:open="sheetOpen" :title="t('list.filters')" side="bottom">
      <PackageFilters v-model:state="state" id-prefix="fm" class="pb-4" @reset="reset" />
      <template #footer>
        <div class="border-t border-line bg-ihram px-5 py-4">
          <AppButton block size="lg" @click="sheetOpen = false">{{ t('list.showResults', { n: results.length }, results.length) }}</AppButton>
        </div>
      </template>
    </UiSheet>

    <!-- compare bar slides up with 2–3 selected -->
    <Transition
      enter-from-class="translate-y-[120%]"
      leave-to-class="translate-y-[120%]"
      enter-active-class="transition-transform duration-[450ms] ease-house"
      leave-active-class="transition-transform duration-200 ease-house"
    >
      <div v-if="compared.length" class="fixed inset-x-3 bottom-3 z-40 md:inset-x-auto md:bottom-6 md:start-1/2 md:w-[min(720px,calc(100vw-48px))] md:-translate-x-1/2 rtl:md:translate-x-1/2">
        <div class="flex flex-wrap items-center gap-3 rounded-md bg-kiswa p-3 text-ihram shadow-[0_20px_50px_-15px_rgba(11,11,12,.6)] md:flex-nowrap md:p-4">
          <ul class="flex gap-2">
            <li v-for="p in comparedPkgs" :key="p.slug" class="flex items-center gap-1 rounded-pill bg-kiswa-soft py-1 pe-1 ps-3 text-[0.8125rem]">
              {{ dt(p.name) }}
              <button type="button" class="grid size-8 place-items-center rounded-full hover:bg-white/10" :aria-label="`${t('common.close')} ${p.name}`" @click="toggleCompare(p.slug)">
                <Icon name="ph:x-light" aria-hidden="true" />
              </button>
            </li>
          </ul>
          <p class="text-[0.8125rem] text-on-dark-muted md:ms-auto">{{ compared.length < 2 ? t('list.compareHint') : t('list.compareBar', { n: compared.length }) }}</p>
          <div class="flex w-full gap-2 md:w-auto">
            <AppButton variant="link-dark" class="px-3!" @click="compared = []">{{ t('list.compareClear') }}</AppButton>
            <AppButton variant="on-dark" class="flex-1 md:flex-none" :disabled="compared.length < 2" @click="compareOpen = true">{{ t('list.compareOpen') }}</AppButton>
          </div>
        </div>
      </div>
    </Transition>

    <UiSheet v-model:open="compareOpen" :title="t('list.compareTitle')" side="bottom" width="100vw">
      <div class="mx-auto max-w-5xl pb-6">
        <CompareTable :items="comparedPkgs" />
      </div>
    </UiSheet>
  </div>
</template>
