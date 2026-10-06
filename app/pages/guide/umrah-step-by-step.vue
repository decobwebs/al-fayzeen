<script setup lang="ts">
const { t, tm, rt } = useI18n()
useHead({ title: () => t('guidePage.article.title') })
const { open } = useEnquiry()

const r = (v: unknown) => rt(v as Parameters<typeof rt>[0])
const steps = computed(() => (tm('guidePage.article.steps') as Record<string, unknown>[]).map(s => ({ ar: r(s.ar), en: r(s.en), body: r(s.body) })))
const terms = computed(() => (tm('guidePage.article.terms') as Record<string, unknown>[]).map(s => ({ ar: r(s.ar), en: r(s.en), def: r(s.def) })))

/* reading progress: a thin line under the nav, and the Tawaf ring (7 rounds = the whole article) */
const article = ref<HTMLElement | null>(null)
const progress = ref(0)
function measure() {
  const el = article.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const total = rect.height - innerHeight * 0.6
  progress.value = Math.min(1, Math.max(0, (-rect.top + innerHeight * 0.2) / Math.max(1, total)))
}
useEventListener('scroll', measure, { passive: true })
onMounted(measure)
const { hidden } = useSiteChrome()
</script>

<template>
  <div>
    <div class="fixed inset-x-0 z-40 h-[2px] bg-line transition-[top] duration-200 ease-house" :class="hidden ? 'top-0' : 'top-[72px]'" role="progressbar" :aria-label="t('guidePage.article.progress')" :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100">
      <div class="h-full origin-left bg-kiswa rtl:origin-right" :style="{ transform: `scaleX(${progress})` }" />
    </div>

    <div class="wrap grid gap-12 pb-24 pt-10 md:pt-16 lg:grid-cols-[1fr_300px] lg:gap-20">
      <article ref="article" class="min-w-0 max-w-[44rem]">
        <ArabicEyebrow :ar="t('guidePage.eyebrowAr')" :label="t('guidePage.article.eyebrow')" />
        <h1 class="t-h2 mt-4 md:text-[3.5rem]!">{{ t('guidePage.article.title') }}</h1>
        <p class="mt-5 text-[1.1875rem] leading-relaxed">{{ t('guidePage.article.lead') }}</p>
        <p class="mt-4 flex flex-wrap items-center gap-2 rounded-sm bg-marble px-3 py-2 text-[0.875rem]">
          <Icon name="ph:seal-check-light" class="text-[1.125rem]" aria-hidden="true" />
          {{ t('guidePage.article.review') }} <GapText :text="t('guidePage.article.reviewGap')" />
        </p>

        <ol class="mt-12 grid gap-12">
          <li v-for="(s, i) in steps" :key="s.en" class="grid gap-4 border-t border-line pt-8 sm:grid-cols-[120px_1fr]">
            <div>
              <p class="t-label text-stone">{{ t('guide.stepN', { n: i + 1 }) }}</p>
              <p class="mt-2 font-ar-display text-[2rem] leading-none" lang="ar" dir="rtl">{{ s.ar }}</p>
            </div>
            <div>
              <h2 class="t-h3 text-[1.875rem]!">{{ s.en }}</h2>
              <p class="mt-3 text-[1.0625rem] leading-relaxed">{{ s.body }}</p>
              <TawafProgress v-if="i === 1" size="lg" class="mt-6" :label="s.en" />
            </div>
          </li>
        </ol>

        <section class="mt-16 border-t border-line pt-10" aria-labelledby="gloss-h">
          <h2 id="gloss-h" class="t-h3 text-[1.875rem]!">{{ t('guidePage.article.glossary') }}</h2>
          <dl class="mt-6 grid gap-0">
            <div v-for="g in terms" :key="g.en" class="grid grid-cols-[110px_1fr] gap-4 border-b border-line py-4 sm:grid-cols-[150px_1fr]">
              <dt>
                <span class="block font-semibold">{{ g.en }}</span>
                <span class="font-ar-display text-[1.125rem] text-stone" lang="ar" dir="rtl">{{ g.ar }}</span>
              </dt>
              <dd class="text-stone">{{ g.def }}</dd>
            </div>
          </dl>
        </section>
      </article>

      <aside class="hidden lg:block">
        <div class="sticky top-[120px] grid justify-items-start gap-6">
          <TawafProgress size="lg" mode="progress" :value="Math.round(progress * 7)" :total="7" :label="t('guidePage.article.progress')" />
          <div class="rounded-md bg-marble p-5">
            <p class="font-display text-[1.375rem] font-semibold leading-tight">{{ t('guidePage.article.next') }}</p>
            <AppButton class="mt-4" icon-start="ph:whatsapp-logo" :directional="false" @click="open({ type: 'guide', title: t('guidePage.article.title'), details: {} }, { channel: 'whatsapp' })">{{ t('guidePage.article.nextCta') }}</AppButton>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
