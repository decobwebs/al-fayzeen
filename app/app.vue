<script setup lang="ts">
const { t } = useI18n()
const head = useLocaleHead({ dir: true, lang: true, seo: true })
useSeoMeta({ description: () => t('meta.description'), ogDescription: () => t('meta.description'), ogImage: '/images/hero-still.jpg' })
useHead(() => ({
  htmlAttrs: { lang: head.value.htmlAttrs.lang, dir: head.value.htmlAttrs.dir },
  link: [...(head.value.link || [])],
  meta: [...(head.value.meta || [])],
}))
</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </NuxtLayout>
</template>
