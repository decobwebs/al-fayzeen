<script setup lang="ts">
import { site } from '~/data/site'

const { t } = useI18n()
useHead({ title: () => t('about.eyebrow') })
</script>

<template>
  <div>
    <header class="wrap pb-12 pt-10 md:pt-16">
      <ArabicEyebrow :ar="t('about.eyebrowAr')" :label="t('about.eyebrow')" />
      <h1 class="t-hero mt-4 text-kiswa">{{ t('about.h1') }}</h1>
      <p class="mt-2 font-ar-display text-[2rem] text-stone"><span lang="ar" dir="rtl">{{ site.nameAr }}</span></p>
    </header>

    <section class="wrap grid gap-10 pb-16 lg:grid-cols-[1fr_1fr] lg:gap-16" aria-labelledby="name-h">
      <div>
        <h2 id="name-h" class="t-h2">{{ t('about.nameTitle') }}</h2>
        <p class="t-statement mt-6 max-w-[24ch] text-[1.75rem]! md:text-[2.25rem]!">{{ t('about.nameText') }}</p>
        <p class="mt-5"><GapText :text="t('about.nameGap')" /></p>
      </div>
      <div class="on-dark relative grid min-h-[280px] place-items-center overflow-hidden rounded-md bg-kiswa text-on-dark">
        <MashrabiyaPattern :opacity="0.07" color="#fff" :size="56" />
        <p class="relative font-ar-display text-[clamp(3.5rem,10vw,6rem)] leading-none" lang="ar" dir="rtl">{{ site.nameAr }}</p>
      </div>
    </section>

    <section class="bg-marble py-16 md:py-20" aria-labelledby="story-h">
      <div class="wrap grid gap-10 lg:grid-cols-2">
        <div>
          <h2 id="story-h" class="t-h2">{{ t('about.storyTitle') }}</h2>
          <p class="mt-6 text-[1.125rem]"><GapText :text="t('about.storyGap')" /></p>
        </div>
        <div>
          <h2 class="t-h2">{{ t('about.licencesTitle') }}</h2>
          <dl class="mt-6 grid gap-4">
            <div class="border-b border-line pb-4">
              <dt class="t-label text-stone">{{ site.licence.authority }}</dt>
              <dd class="mt-1">{{ t('about.licenceNo') }}: <span v-if="site.licence.number" class="ltr-iso">{{ site.licence.number }}</span><GapText v-else /></dd>
            </div>
            <div class="border-b border-line pb-4"><dt class="sr-only">{{ t('about.licencesTitle') }}</dt><dd><GapText :text="t('about.licenceOther')" /></dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="wrap section-y" aria-labelledby="team-h">
      <h2 id="team-h" class="t-h2">{{ t('about.teamTitle') }}</h2>
      <ul class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        <li v-for="n in 4" :key="n">
          <AppImage slot="about-team" arch sizes="50vw md:300px" />
          <p class="mt-4 font-display text-[1.25rem]"><GapText :text="t('about.teamMember', { n })" /></p>
          <p class="text-[0.875rem]"><GapText :text="t('about.teamRole')" /></p>
        </li>
      </ul>
    </section>

    <section class="wrap pb-24" aria-labelledby="office-h">
      <div class="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <div>
          <h2 id="office-h" class="t-h2">{{ t('about.officeTitle') }}</h2>
          <p class="mt-4"><span v-if="site.offices.makkah">{{ site.offices.makkah }}</span><GapText v-else :text="t('about.officeAddress')" /></p>
        </div>
        <AppImage slot="about-office" sizes="100vw lg:700px" />
      </div>
    </section>
  </div>
</template>
