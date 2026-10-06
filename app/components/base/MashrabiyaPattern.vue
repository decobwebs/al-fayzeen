<script setup lang="ts">
/**
 * Mashrabiya lattice: an 8-point star (khatam, two overlapping squares) on a grid, joined to its neighbours.
 * Generated in code as an SVG <pattern>. Fills its positioned parent.
 */
const props = withDefaults(defineProps<{
  opacity?: number
  /** tile size in px */
  size?: number
  color?: string
  strokeWidth?: number
}>(), { opacity: 0.06, size: 56, color: 'currentColor', strokeWidth: 1 })

const id = `mash-${useId()}`

// Star geometry on a 100×100 tile, centred
const c = 50
const R = 26 // outer radius (half-diagonal of each square)
const r = R * Math.cos(Math.PI / 4) / Math.cos(Math.PI / 8) // inner vertex radius of the khatam outline
const pt = (rad: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return `${(c + rad * Math.cos(a)).toFixed(2)},${(c + rad * Math.sin(a)).toFixed(2)}`
}
const star = Array.from({ length: 16 }, (_, i) => pt(i % 2 === 0 ? R : r, i * 22.5)).join(' ')
// lattice: star tips → tile edges (axes) and corners (diagonals)
const o = (deg: number) => pt(R, deg).split(',').map(Number) as [number, number]
const lines = [
  [o(0), [100, 50]], [o(180), [0, 50]], [o(90), [50, 100]], [o(270), [50, 0]],
  [o(45), [100, 100]], [o(135), [0, 100]], [o(225), [0, 0]], [o(315), [100, 0]],
] as [number, number][][]
const inner = Array.from({ length: 8 }, (_, i) => pt(R * 0.42, i * 45 + 22.5)).join(' ')

const scale = computed(() => props.size / 100)
</script>

<template>
  <svg class="pointer-events-none absolute inset-0 h-full w-full" :style="{ opacity }" aria-hidden="true" focusable="false">
    <defs>
      <pattern :id="id" :width="size" :height="size" patternUnits="userSpaceOnUse">
        <g :transform="`scale(${scale})`" fill="none" :stroke="color" :stroke-width="strokeWidth / scale" stroke-linejoin="miter">
          <polygon :points="star" />
          <polygon :points="inner" />
          <line v-for="(l, i) in lines" :key="i" :x1="l[0]![0]" :y1="l[0]![1]" :x2="l[1]![0]" :y2="l[1]![1]" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" :fill="`url(#${id})`" />
  </svg>
</template>
