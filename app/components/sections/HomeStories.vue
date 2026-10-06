<script setup lang="ts">
/** Honest placeholders only: no invented quotes, names or ratings until real, consented stories arrive. */
const { t } = useI18n()
</script>

<template>
  <section class="section-y bg-ihram pt-0!" aria-labelledby="stories-h">
    <div class="wrap">
      <SectionHeading id="stories-h" :ar="t('stories.eyebrowAr')" :eyebrow="t('stories.eyebrow')" :title="t('stories.h2')" />

      <div class="mt-10 grid gap-4 md:mt-14 lg:grid-cols-3 lg:gap-5">
        <div class="lg:col-span-2">
          <AppImage slot="stories-video" ratio="16:9" />
          <p class="sr-only">{{ t('stories.videoLabel') }}</p>
        </div>
        <ul class="grid gap-4 lg:gap-5">
          <li
            v-for="n in 3"
            :key="n"
            class="flex min-h-[120px] flex-col justify-between gap-4 rounded-md border border-dashed border-stone/40 p-5"
          >
            <Icon name="ph:quotes-light" class="text-[1.5rem] text-stone" aria-hidden="true" />
            <div>
              <p class="t-label text-stone">{{ t('stories.slot', { n }) }}</p>
              <p class="mt-1 text-[0.9375rem] text-stone">{{ t('stories.placeholder') }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-4 lg:mt-5 lg:w-2/3 lg:gap-5">
        <AppImage slot="stories-group" sizes="50vw lg:420px" />
        <AppImage slot="stories-family" sizes="50vw lg:420px" />
      </div>
    </div>
  </section>
</template>
