<script setup lang="ts">
/** A ring that fills to walking minutes out of 15 when it scrolls into view, with "5 min" in the centre. */
const props = withDefaults(defineProps<{ minutes: number, max?: number, madinah?: boolean, size?: number }>(), { max: 15, size: 76 })
const { t } = useI18n()
const el = ref<HTMLElement | null>(null)
const reduced = useReducedMotion()
const shown = ref(false)
const frac = computed(() => Math.min(1, props.minutes / props.max))
let io: IntersectionObserver | null = null

onMounted(() => {
  if (reduced.value) {
    shown.value = true
    return
  }
  io = new IntersectionObserver((e) => {
    if (e.some(x => x.isIntersecting)) {
      shown.value = true
      io?.disconnect()
    }
  }, { threshold: 0.6 })
  io.observe(el.value!)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <div ref="el" class="relative grid shrink-0 place-items-center" :style="{ width: `${size}px`, height: `${size}px` }" role="img" :aria-label="t('hotels.card.walkLabel', { n: minutes })">
    <svg viewBox="0 0 100 100" class="absolute inset-0 -rotate-90" aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="none" stroke="var(--c-line)" stroke-width="5" />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        :stroke="madinah ? 'var(--c-nabawi)' : 'var(--c-kiswa)'"
        stroke-width="5"
        stroke-linecap="round"
        pathLength="1"
        :stroke-dasharray="`${shown ? frac : 0} 1`"
        class="transition-[stroke-dasharray] duration-[1200ms] ease-house"
      />
    </svg>
    <span class="relative text-center leading-none" aria-hidden="true">
      <span class="block text-[1.25rem] font-semibold tabular-nums">{{ minutes }}</span>
      <span class="text-[0.6875rem] text-stone">min</span>
    </span>
  </div>
</template>
