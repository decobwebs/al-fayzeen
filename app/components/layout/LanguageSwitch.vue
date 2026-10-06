<script setup lang="ts">
/** EN | العربية */
withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' })
const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <nav :aria-label="t('lang.label')" class="flex items-center text-[0.875rem] font-semibold">
    <NuxtLink
      :to="switchLocalePath('en')"
      lang="en"
      hreflang="en"
      class="grid min-h-11 min-w-11 place-items-center px-1 transition-opacity duration-200"
      :class="locale === 'en' ? 'opacity-100' : 'opacity-60 hover:opacity-100'"
      :aria-current="locale === 'en' ? 'true' : undefined"
    >
      {{ t('lang.en') }}
    </NuxtLink>
    <span aria-hidden="true" class="h-4 w-px" :class="tone === 'dark' ? 'bg-on-dark/40' : 'bg-line'" />
    <NuxtLink
      :to="switchLocalePath('ar')"
      lang="ar"
      hreflang="ar"
      class="grid min-h-11 min-w-11 place-items-center px-2 font-ar-body transition-opacity duration-200"
      :class="locale === 'ar' ? 'opacity-100' : 'opacity-60 hover:opacity-100'"
      :aria-current="locale === 'ar' ? 'true' : undefined"
    >
      {{ t('lang.ar') }}
    </NuxtLink>
  </nav>
</template>
