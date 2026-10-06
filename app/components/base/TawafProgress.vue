<script setup lang="ts">
/**
 * Motion #8: a dot circling a square counter-clockwise, 7 rounds.
 * mode "loading": the dot circles; large size counts the rounds 1–7.
 * mode "progress": `value` of `total` rounds/steps filled counter-clockwise from the top.
 */
const props = withDefaults(defineProps<{
  size?: 'sm' | 'lg'
  mode?: 'loading' | 'progress'
  value?: number
  total?: number
  tone?: 'light' | 'dark'
  label?: string
}>(), { size: 'sm', mode: 'loading', value: 0, total: 7, tone: 'light' })

const { t } = useI18n()
const reduced = useReducedMotion()
const LAP_MS = 1600
const round = ref(1)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (props.mode === 'loading' && props.size === 'lg' && !reduced.value) {
    timer = setInterval(() => { round.value = (round.value % 7) + 1 }, LAP_MS)
  }
})
onBeforeUnmount(() => clearInterval(timer))

// rounded so server and client render identical attributes
const round3 = (n: number) => Math.round(n * 1000) / 1000
const frac = computed(() => Math.max(0, Math.min(1, props.value / props.total)))
// circle path starting at the top, drawn counter-clockwise (sweep-flag 0)
const track = 'M50 10 A40 40 0 1 0 50 90 A40 40 0 1 0 50 10'
// dot position for progress mode: angle measured counter-clockwise from the top
const dot = computed(() => {
  const a = -Math.PI / 2 - frac.value * Math.PI * 2
  return { x: round3(50 + 40 * Math.cos(a)), y: round3(50 + 40 * Math.sin(a)) }
})
const ticks = computed(() => Array.from({ length: props.total }, (_, i) => {
  const a = -Math.PI / 2 - (i / props.total) * Math.PI * 2
  return { x: round3(50 + 40 * Math.cos(a)), y: round3(50 + 40 * Math.sin(a)), done: i < props.value }
}))

const a11y = computed(() => props.label ?? (props.mode === 'loading' ? t('common.loading') : t('common.progress', { value: props.value, total: props.total })))
</script>

<template>
  <span
    class="tawaf relative inline-grid place-items-center"
    :class="[size === 'sm' ? 'size-7' : 'size-28', tone === 'dark' ? 'text-on-dark' : 'text-kiswa']"
    :role="mode === 'loading' ? 'status' : 'progressbar'"
    :aria-label="a11y"
    :aria-valuenow="mode === 'progress' ? value : undefined"
    :aria-valuemin="mode === 'progress' ? 0 : undefined"
    :aria-valuemax="mode === 'progress' ? total : undefined"
  >
    <svg viewBox="0 0 100 100" class="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
      <!-- track -->
      <path :d="track" fill="none" stroke="currentColor" stroke-opacity=".18" :stroke-width="size === 'sm' ? 6 : 1.5" />
      <!-- the square (Kaaba) -->
      <rect x="36" y="36" width="28" height="28" fill="currentColor" :rx="size === 'sm' ? 1 : 0.5" />
      <rect v-if="size === 'lg'" x="36" y="43" width="28" height="2.4" fill="var(--c-gold)" />

      <template v-if="mode === 'progress'">
        <path :d="track" fill="none" stroke="currentColor" :stroke-width="size === 'sm' ? 6 : 1.5" pathLength="1" :stroke-dasharray="`${frac} 1`" class="transition-[stroke-dasharray] duration-[450ms] ease-house" />
        <template v-if="size === 'lg'">
          <circle v-for="(tk, i) in ticks" :key="i" :cx="tk.x" :cy="tk.y" r="1.6" :fill="tk.done ? 'currentColor' : 'var(--c-line)'" />
        </template>
        <circle :cx="dot.x" :cy="dot.y" :r="size === 'sm' ? 9 : 4" fill="currentColor" class="transition-all duration-[450ms] ease-house" />
      </template>

      <g v-else class="tawaf-orbit" :class="{ 'tawaf-orbit--run': !reduced }" :style="{ animationDuration: `${LAP_MS}ms` }">
        <circle cx="50" cy="10" :r="size === 'sm' ? 9 : 4" fill="currentColor" />
      </g>
    </svg>
    <span v-if="size === 'lg' && mode === 'loading'" class="absolute -bottom-7 text-[0.75rem] tabular-nums text-stone" aria-hidden="true">
      {{ round }} / 7
    </span>
  </span>
</template>

<style scoped>
.tawaf-orbit { transform-origin: 50px 50px; transform-box: view-box; }
.tawaf-orbit--run { animation: tawaf linear infinite; }
/* negative rotation = counter-clockwise on screen */
@keyframes tawaf { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
</style>
