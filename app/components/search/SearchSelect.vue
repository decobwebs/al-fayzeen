<script setup lang="ts">
/** Native select (best on phones). The invisible select covers the whole cell; the visible text mirrors it. */
const props = defineProps<{ id: string, label: string, options: { value: string, label: string }[] }>()
const model = defineModel<string>({ required: true })
const shown = computed(() => props.options.find(o => o.value === model.value)?.label ?? '')
</script>

<template>
  <SearchField :label="label" :for="id">
    <span class="block truncate pe-6 text-[1rem] font-medium text-white">{{ shown }}</span>
    <Icon name="ph:caret-down-light" class="pointer-events-none absolute bottom-[14px] end-4 text-[1rem] text-white/70 lg:end-5" aria-hidden="true" />
    <select
      :id="id"
      v-model="model"
      class="peer absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
    >
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <span class="pointer-events-none absolute inset-0 rounded-sm ring-white/80 peer-focus-visible:ring-2 lg:rounded-none" aria-hidden="true" />
  </SearchField>
</template>
