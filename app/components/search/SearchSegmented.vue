<script setup lang="ts">
/** Segmented radio group (trip type, city). `madinah` value uses the Nabawi accent. */
defineProps<{ label: string, options: { value: string, label: string }[], name: string }>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <fieldset class="min-w-0">
    <legend class="sr-only">{{ label }}</legend>
    <div class="inline-flex rounded-pill bg-white/10 p-1 ring-1 ring-white/15">
      <label
        v-for="o in options"
        :key="o.value"
        class="relative grid min-h-9 cursor-pointer place-items-center rounded-pill px-3.5 text-[0.8125rem] font-semibold transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white sm:px-4"
        :class="model === o.value
          ? (o.value === 'madinah' ? 'bg-nabawi text-white' : 'bg-ihram text-kiswa')
          : 'text-white/85 hover:text-white'"
      >
        <input v-model="model" type="radio" :name="name" :value="o.value" class="sr-only">
        {{ o.label }}
      </label>
    </div>
  </fieldset>
</template>
