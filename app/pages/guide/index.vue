<script setup lang="ts">
const { t } = useI18n()
useHead({ title: () => t('guidePage.h1') })
</script>

<template>
  <div class="wrap pb-24 pt-10 md:pt-16">
    <ArabicEyebrow :ar="t('guidePage.eyebrowAr')" :label="t('guidePage.eyebrow')" />
    <h1 class="t-h2 mt-4 md:text-[3.5rem]!">{{ t('guidePage.h1') }}</h1>
    <p class="mt-4 max-w-[40rem] text-[1.0625rem] text-stone">{{ t('guidePage.sub') }}</p>
    <ul class="mt-10 grid gap-5 md:grid-cols-3">
      <li><GuideCard slot="guide-ihram" :title="t('guide.cards.stepByStep')" to="/guide/umrah-step-by-step" /></li>
      <li><GuideCard slot="guide-tasbih" :title="t('guide.cards.pack')" soon /></li>
      <li><GuideCard slot="guide-quran" :title="t('guide.cards.rawdah')" soon /></li>
    </ul>
  </div>
</template>
