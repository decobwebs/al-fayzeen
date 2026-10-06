<script setup lang="ts">
/** Marble notice band (mandatory sample-prices notice on result pages). */
defineProps<{ text: string, icon?: string }>()
</script>

<template>
  <p role="note" class="flex items-start gap-3 rounded-md bg-marble px-4 py-3.5 text-[0.9375rem] md:items-center md:px-5">
    <Icon :name="icon ?? 'ph:info-light'" class="mt-0.5 shrink-0 text-[1.25rem] md:mt-0" aria-hidden="true" />
    <span>{{ text }}</span>
  </p>
</template>
