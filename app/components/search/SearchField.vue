<script setup lang="ts">
/** One labelled cell of the search panel. Stacked boxes on mobile, hairline-separated row cells on desktop. */
withDefaults(defineProps<{ label: string, for?: string, as?: string, grow?: number, half?: boolean }>(), { as: 'div', grow: 1 })
</script>

<template>
  <component
    :is="as"
    :class="half ? 'col-span-1' : 'col-span-2'"
    class="search-field group/field relative flex min-h-[64px] min-w-0 flex-col justify-center rounded-sm bg-white/[.07] px-4 py-2 transition-colors duration-200 focus-within:bg-white/[.12] hover:bg-white/[.1] lg:rounded-none lg:bg-transparent lg:px-5 lg:hover:bg-white/[.06]"
    :style="{ flexGrow: grow, flexBasis: 0 }"
  >
    <label v-if="$props.for" :for="$props.for" class="pointer-events-none text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/70 rtl:tracking-normal">{{ label }}</label>
    <span v-else class="pointer-events-none text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/70 rtl:tracking-normal" aria-hidden="true">{{ label }}</span>
    <slot />
  </component>
</template>

<style scoped>
@media (min-width: 1024px) {
  .search-field + .search-field::before {
    content: "";
    position: absolute;
    inset-block: 14px;
    inset-inline-start: 0;
    width: 1px;
    background: rgba(255, 255, 255, .2);
  }
}
</style>
