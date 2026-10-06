<script setup lang="ts">
import { site } from '~/data/site'

withDefaults(defineProps<{ size?: 'md' | 'lg' }>(), { size: 'md' })
</script>

<template>
  <span class="inline-flex flex-col items-start leading-none" dir="ltr">
    <span class="font-display font-semibold tracking-[0.01em]" :class="size === 'lg' ? 'text-[2.25rem]' : 'text-[1.625rem]'" lang="en">{{ site.name }}</span>
    <span class="mt-1 font-ar-display opacity-80" :class="size === 'lg' ? 'text-[1.0625rem]' : 'text-[0.8125rem]'" lang="ar">{{ site.nameAr }}</span>
  </span>
</template>
