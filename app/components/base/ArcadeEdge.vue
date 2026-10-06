<script setup lang="ts">
/**
 * A section edge cut as a row of pointed (ogive) arches, like the riwaq of Masjid al-Haram.
 * `to` fills the arches (the section below); `from` is the colour above. `from="transparent"` overlays imagery.
 * Each arch = two quadratic curves meeting at a point; control points sit at 0.62 of the arch height.
 */
type Tone = 'ihram' | 'marble' | 'kiswa' | 'kiswa-soft' | 'transparent'

const props = withDefaults(defineProps<{
  count?: number
  mobileCount?: number
  height?: number
  mobileHeight?: number
  from?: Tone
  to?: Tone
}>(), { count: 7, mobileCount: 3, height: 88, mobileHeight: 48, from: 'kiswa', to: 'ihram' })

const color = (t: Tone) => (t === 'transparent' ? 'transparent' : `var(--c-${t})`)

const W = 100 // width of one arch in viewBox units
const H = 100
const springAt = 0.62

function path(n: number) {
  const ctrlY = H * springAt // control points 0.62 down from the apex → sharp ogive point
  let d = `M0 ${H}`
  for (let i = 0; i < n; i++) {
    const x0 = i * W
    const apex = x0 + W / 2
    d += ` L${x0} ${H} Q${x0} ${ctrlY} ${apex} 0 Q${x0 + W} ${ctrlY} ${x0 + W} ${H}`
  }
  d += ` L${n * W} ${H + 1} L0 ${H + 1} Z`
  return d
}

const desktop = computed(() => path(props.count))
const mobile = computed(() => path(props.mobileCount))
</script>

<template>
  <div class="arcade-edge relative w-full" :style="{ background: color(from), marginBottom: '-1px' }" aria-hidden="true">
    <svg
      class="block w-full md:hidden"
      :viewBox="`0 0 ${mobileCount * W} ${H + 1}`"
      preserveAspectRatio="none"
      :style="{ height: `${mobileHeight}px` }"
      focusable="false"
    >
      <path :d="mobile" :fill="color(to)" />
    </svg>
    <svg
      class="hidden w-full md:block"
      :viewBox="`0 0 ${count * W} ${H + 1}`"
      preserveAspectRatio="none"
      :style="{ height: `${height}px` }"
      focusable="false"
    >
      <path :d="desktop" :fill="color(to)" />
    </svg>
  </div>
</template>
