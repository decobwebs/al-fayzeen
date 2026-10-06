<script setup lang="ts">
/** Arabic word (Reem Kufi) + English caps label, e.g. الباقات · PACKAGES. Sits above section titles. */
withDefaults(defineProps<{
  ar: string
  label: string
  tone?: 'light' | 'dark'
  as?: string
}>(), { tone: 'light', as: 'p' })
</script>

<template>
  <component
    :is="as"
    class="flex flex-wrap items-baseline gap-x-2.5 gap-y-1"
    :class="tone === 'dark' ? 'text-on-dark' : 'text-kiswa'"
  >
    <span lang="ar" dir="rtl" class="font-ar-display text-[1.0625rem] leading-none" :class="tone === 'dark' ? 'text-on-dark' : 'text-kiswa'">{{ ar }}</span>
    <span class="text-[0.7rem] leading-none" :class="tone === 'dark' ? 'text-on-dark-muted' : 'text-stone'" aria-hidden="true">·</span>
    <span class="t-label" :class="tone === 'dark' ? 'text-on-dark-muted' : 'text-stone'">{{ label }}</span>
  </component>
</template>
