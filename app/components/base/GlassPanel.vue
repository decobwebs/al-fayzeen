<script setup lang="ts">
/**
 * Liquid glass, CLAUDE.md §6. Use ONLY over imagery or video.
 * Low-power devices get 10px blur and no pointer tracking; no backdrop-filter support → dark fallback (CSS).
 */
const props = withDefaults(defineProps<{
  as?: string
  radius?: 'sm' | 'md' | 'lg' | 'pill'
  /** pointer-following specular highlight (desktop, fine pointer only) */
  specular?: boolean
}>(), { as: 'div', radius: 'md', specular: true })

const el = ref<HTMLElement | null>(null)
const { lowPower } = useLowPowerDevice()
const reduced = useReducedMotion()
const tracking = ref(false)

onMounted(() => {
  tracking.value = props.specular && !lowPower.value && !reduced.value && matchMedia('(hover: hover) and (pointer: fine)').matches
})

let frame = 0
function onMove(e: PointerEvent) {
  if (!tracking.value || !el.value) return
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const r = el.value!.getBoundingClientRect()
    el.value!.style.setProperty('--gx', `${e.clientX - r.left}px`)
    el.value!.style.setProperty('--gy', `${e.clientY - r.top}px`)
  })
}

const radiusClass = computed(() => ({
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-[22px]',
  pill: 'rounded-pill',
})[props.radius])
</script>

<template>
  <component
    :is="as"
    ref="el"
    class="glass on-dark text-on-dark"
    :class="[radiusClass, { 'glass--low': lowPower, 'glass--track': tracking }]"
    @pointermove="onMove"
  >
    <slot />
  </component>
</template>

<style scoped>
.glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: -1;
  /* static soft specular from the top start corner */
  background: radial-gradient(120% 80% at 0% 0%, rgba(255, 255, 255, .14), transparent 55%);
}
[dir="rtl"] .glass::before {
  background: radial-gradient(120% 80% at 100% 0%, rgba(255, 255, 255, .14), transparent 55%);
}
.glass--track::before {
  background: radial-gradient(420px circle at var(--gx, 20%) var(--gy, 0%), rgba(255, 255, 255, .16), transparent 60%);
  transition: opacity 200ms var(--ease);
  opacity: .9;
}
</style>
