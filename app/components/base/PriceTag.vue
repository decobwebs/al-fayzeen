<script setup lang="ts">
/** ₦ price, en-NG format, tabular figures. With `animated`, changes count up/down (motion #6). */
const props = withDefaults(defineProps<{
  amount: number
  prefix?: string
  suffix?: string
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
  tone?: 'light' | 'dark'
}>(), { size: 'md', tone: 'light' })

const reduced = useReducedMotion()
const shown = ref(props.amount)
let controls: { stop: () => void } | null = null

watch(() => props.amount, async (to, from) => {
  controls?.stop()
  if (!props.animated || reduced.value || import.meta.server) {
    shown.value = to
    return
  }
  const { animate } = await import('motion-v') // loaded on first change, not on page load
  controls = animate(from ?? to, to, {
    duration: 0.6,
    ease: [0.2, 0.7, 0.2, 1],
    onUpdate: (v: number) => { shown.value = v },
  })
})

onBeforeUnmount(() => controls?.stop())

const text = computed(() => formatNgn(shown.value))
const final = computed(() => formatNgn(props.amount))
</script>

<template>
  <p class="price flex flex-wrap items-baseline gap-x-1.5" :class="tone === 'dark' ? 'text-on-dark' : 'text-kiswa'">
    <span v-if="prefix" class="text-[0.8125rem]" :class="tone === 'dark' ? 'text-on-dark-muted' : 'text-stone'">{{ prefix }}</span>
    <span
      class="ltr-iso font-semibold tabular-nums tracking-tight"
      :class="{ 'text-base': size === 'sm', 'text-[1.375rem]': size === 'md', 'text-[1.875rem]': size === 'lg' }"
      aria-hidden="true"
    >{{ text }}</span>
    <span class="sr-only">{{ final }}</span>
    <span v-if="suffix" class="text-[0.8125rem]" :class="tone === 'dark' ? 'text-on-dark-muted' : 'text-stone'">{{ suffix }}</span>
  </p>
</template>
