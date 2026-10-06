<script setup lang="ts">
/** Marks sample prices, dates, hotels and flights (prototype data). */
withDefaults(defineProps<{ variant?: 'light' | 'glass' | 'dark' }>(), { variant: 'light' })
const { t } = useI18n()
</script>

<template>
  <span
    class="inline-flex h-6 items-center gap-1.5 rounded-pill px-2.5 text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.12em] rtl:tracking-normal"
    :class="{
      'border border-line bg-ihram text-stone': variant === 'light',
      'glass glass--low border-white/30 text-white': variant === 'glass',
      'border border-line-dark bg-kiswa-soft text-on-dark-muted': variant === 'dark',
    }"
    :title="t('common.sampleHint')"
  >
    <span class="size-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
    {{ t('common.sample') }}
  </span>
</template>
