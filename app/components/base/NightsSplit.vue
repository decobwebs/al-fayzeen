<script setup lang="ts">
/** Nights split: Kiswa Black for Makkah, Nabawi Green for Madinah (green is Madinah-only). */
const props = withDefaults(defineProps<{
  makkah: number
  madinah: number
  label?: boolean
  size?: 'sm' | 'md'
}>(), { label: true, size: 'md' })

const { t } = useI18n()
const text = computed(() => `${t('common.nightsMakkah', { n: props.makkah }, props.makkah)} · ${t('common.nightsMadinah', { n: props.madinah }, props.madinah)}`)
</script>

<template>
  <div class="w-full">
    <div
      class="flex w-full gap-[3px] overflow-hidden rounded-pill"
      :class="size === 'sm' ? 'h-1.5' : 'h-2'"
      role="img"
      :aria-label="text"
    >
      <span class="h-full rounded-pill bg-kiswa" :style="{ flexGrow: makkah, flexBasis: 0 }" />
      <span class="h-full rounded-pill bg-nabawi" :style="{ flexGrow: madinah, flexBasis: 0 }" />
    </div>
    <p v-if="label" class="mt-2 flex flex-wrap items-center gap-x-1.5 text-[0.8125rem] text-stone" aria-hidden="true">
      <span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-kiswa" />{{ t('common.nightsMakkah', { n: makkah }, makkah) }}</span>
      <span>·</span>
      <span class="inline-flex items-center gap-1.5"><span class="size-2 rounded-full bg-nabawi" />{{ t('common.nightsMadinah', { n: madinah }, madinah) }}</span>
    </p>
  </div>
</template>
