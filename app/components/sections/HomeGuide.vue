<script setup lang="ts">
const { t, tm, rt } = useI18n()
const { open } = useEnquiry()

const steps = computed(() => (tm('guide.steps') as Record<string, unknown>[]).map(s => ({
  ar: rt(s.ar as Parameters<typeof rt>[0]),
  en: rt(s.en as Parameters<typeof rt>[0]),
  text: rt(s.text as Parameters<typeof rt>[0]),
})))

function sendGuide() {
  open({ type: 'guide', title: t('guide.lead'), details: {}, message: t('guide.leadMessage') }, { channel: 'whatsapp' })
}
</script>

<template>
  <section class="section-y bg-ihram pt-0!" aria-labelledby="guide-h">
    <div class="wrap">
      <SectionHeading id="guide-h" :ar="t('guide.eyebrowAr')" :eyebrow="t('guide.eyebrow')" :title="t('guide.h2')" />

      <ol class="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
        <li v-for="(s, i) in steps" :key="s.en" class="group relative flex min-h-[220px] flex-col bg-ihram p-6">
          <div class="flex items-start justify-between gap-4">
            <p class="t-label text-stone">{{ t('guide.stepN', { n: i + 1 }) }}</p>
            <TawafProgress v-if="i === 1" size="sm" :label="s.en" class="absolute end-6 top-5" />
          </div>
          <h3 class="t-h3 mt-6 text-[1.75rem]!">
            <ArabicMorph :ar="s.ar" :en="s.en" :delay="i * 220" />
          </h3>
          <p class="mt-3 text-[0.9375rem] leading-relaxed text-stone">{{ s.text }}</p>
        </li>
      </ol>

      <div class="mt-6 grid gap-4 md:grid-cols-3 md:gap-5">
        <GuideCard slot="guide-ihram" :title="t('guide.cards.stepByStep')" to="/guide/umrah-step-by-step" />
        <GuideCard slot="guide-tasbih" :title="t('guide.cards.pack')" soon />
        <GuideCard slot="guide-quran" :title="t('guide.cards.rawdah')" soon />
      </div>

      <div class="mt-6 flex flex-col items-start justify-between gap-5 rounded-md bg-marble p-6 md:flex-row md:items-center md:p-8">
        <div class="flex items-center gap-4">
          <Icon name="ph:file-pdf-duotone" class="shrink-0 text-[2.25rem]" aria-hidden="true" />
          <p class="font-display text-[1.5rem] font-semibold leading-tight md:text-[1.75rem]">{{ t('guide.lead') }}</p>
        </div>
        <AppButton icon-start="ph:whatsapp-logo" :directional="false" @click="sendGuide">{{ t('guide.leadButton') }}</AppButton>
      </div>
    </div>
  </section>
</template>
