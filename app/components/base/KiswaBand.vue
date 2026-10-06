<script setup lang="ts">
/**
 * A black strip with a repeating gold geometric pattern inspired by square Kufic and the Kiswa belt (hizam).
 * Pure geometry: no letters, no words. Used once, as the top edge of the final CTA.
 */
withDefaults(defineProps<{ height?: number }>(), { height: 56 })
const id = `kiswa-${useId()}`
</script>

<template>
  <div class="relative w-full overflow-hidden bg-kiswa" :style="{ height: `${height}px` }" aria-hidden="true">
    <svg class="absolute inset-0 h-full w-full" focusable="false">
      <defs>
        <!-- 48×28 tile: two interlocking stepped spirals, mirrored, joined by a square boss -->
        <pattern :id="id" width="48" height="28" patternUnits="userSpaceOnUse" :y="height / 2 - 14">
          <g fill="none" stroke="var(--c-gold-light)" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">
            <path d="M2 26 V2 H20 V20 H8 V8 H14 V14" />
            <path d="M46 2 V26 H28 V8 H40 V20 H34 V14" />
          </g>
          <rect x="22.5" y="12.5" width="3" height="3" fill="var(--c-gold-light)" />
        </pattern>
      </defs>
      <line x1="0" x2="100%" :y1="height / 2 - 19.5" :y2="height / 2 - 19.5" stroke="var(--c-gold-light)" stroke-opacity=".55" />
      <line x1="0" x2="100%" :y1="height / 2 + 19.5" :y2="height / 2 + 19.5" stroke="var(--c-gold-light)" stroke-opacity=".55" />
      <rect x="0" :y="height / 2 - 14" width="100%" height="28" :fill="`url(#${id})`" opacity=".85" />
    </svg>
  </div>
</template>
