<script setup lang="ts">
/** Arabic eyebrow + H2, with an optional aside slot (links, controls) on the end side. */
withDefaults(defineProps<{ ar: string, eyebrow: string, title: string, tone?: 'light' | 'dark', id?: string, as?: 'h1' | 'h2' }>(), { tone: 'light', as: 'h2' })
</script>

<template>
  <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <div class="max-w-[44rem]">
      <ArabicEyebrow :ar="ar" :label="eyebrow" :tone="tone" />
      <component :is="as" :id="id" class="t-h2 mt-4" :class="tone === 'dark' ? 'text-on-dark' : 'text-kiswa'">{{ title }}</component>
    </div>
    <div v-if="$slots.default" class="shrink-0">
      <slot />
    </div>
  </div>
</template>
