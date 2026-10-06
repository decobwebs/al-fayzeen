<script setup lang="ts">
const props = defineProps<{ slot: string, title: string, to?: string, soon?: boolean }>()
const { t } = useI18n()
const uid = useId()
</script>

<template>
  <article class="group relative flex h-full flex-col rounded-md border border-line bg-ihram p-3 transition-colors duration-200 ease-house" :class="!props.soon && 'hover:border-kiswa'" :aria-labelledby="`${uid}-t`">
    <AppImage :slot="props.slot" ratio="1:1" rounded="sm" :zoom="!props.soon" sizes="100vw md:33vw lg:400px" />
    <div class="flex flex-1 items-end justify-between gap-4 px-2 pb-2 pt-5">
      <h3 :id="`${uid}-t`" class="t-h3">
        <NuxtLinkLocale v-if="props.to && !props.soon" :to="props.to" class="after:absolute after:inset-0 after:content-['']">{{ props.title }}</NuxtLinkLocale>
        <template v-else>{{ props.title }}</template>
      </h3>
      <span v-if="props.soon" class="t-label shrink-0 text-stone">{{ t('guide.soon') }}</span>
      <Icon v-else name="ph:arrow-right-light" class="flip-rtl shrink-0 text-[1.375rem] transition-transform duration-200 ease-house group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
    </div>
  </article>
</template>
