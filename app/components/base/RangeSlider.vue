<script setup lang="ts">
/** Two-thumb range built from two native range inputs (keyboard and screen-reader support for free). */
const props = defineProps<{ min: number, max: number, step: number, label: string, format?: (n: number) => string }>()
const model = defineModel<number[]>({ required: true })
const { t } = useI18n()
const fmt = (n: number) => (props.format ? props.format(n) : String(n))

const lo = computed({
  get: () => model.value[0]!,
  set: (v: number) => { model.value = [Math.min(Number(v), model.value[1]! - props.step), model.value[1]!] },
})
const hi = computed({
  get: () => model.value[1]!,
  set: (v: number) => { model.value = [model.value[0]!, Math.max(Number(v), model.value[0]! + props.step)] },
})
const pct = (v: number) => ((v - props.min) / (props.max - props.min)) * 100
</script>

<template>
  <div class="range-slider">
    <div class="relative h-11" dir="ltr">
      <div class="absolute inset-x-3 top-1/2 h-[3px] -translate-y-1/2 rounded-pill bg-line" aria-hidden="true">
        <div class="absolute h-full rounded-pill bg-kiswa" :style="{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }" />
      </div>
      <input
        v-model.number="lo"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :aria-label="`${label}: ${t('list.min')}`"
        :aria-valuetext="fmt(lo)"
        class="range-input"
      >
      <input
        v-model.number="hi"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :aria-label="`${label}: ${t('list.max')}`"
        :aria-valuetext="fmt(hi)"
        class="range-input"
      >
    </div>
    <div class="flex justify-between text-[0.8125rem] tabular-nums text-stone" dir="ltr">
      <span>{{ fmt(lo) }}</span>
      <span>{{ fmt(hi) }}</span>
    </div>
  </div>
</template>

<style scoped>
.range-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  background: none;
  pointer-events: none;
  appearance: none;
  -webkit-appearance: none;
}
.range-input:focus { outline: none; }
.range-input::-webkit-slider-runnable-track { background: none; height: 100%; }
.range-input::-moz-range-track { background: none; }
.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  pointer-events: auto;
  width: 24px;
  height: 24px;
  margin-top: 10px;
  border-radius: 999px;
  border: 2px solid var(--c-kiswa);
  background: var(--c-ihram);
  box-shadow: 0 2px 8px rgba(11, 11, 12, .2);
  cursor: grab;
  transition: transform 150ms var(--ease);
}
.range-input::-moz-range-thumb {
  pointer-events: auto;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 2px solid var(--c-kiswa);
  background: var(--c-ihram);
  cursor: grab;
}
.range-input:hover::-webkit-slider-thumb { transform: scale(1.1); }
.range-input:focus-visible::-webkit-slider-thumb { outline: 2px solid var(--c-kiswa); outline-offset: 3px; }
.range-input:focus-visible::-moz-range-thumb { outline: 2px solid var(--c-kiswa); outline-offset: 3px; }
</style>
