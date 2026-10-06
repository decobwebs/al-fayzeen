<script setup lang="ts">
/** Opens the EnquirySheet with WhatsApp pre-selected, so the message is structured (never a raw link). */
const { t } = useI18n()
const { floatOverHero, menuOpen } = useSiteChrome()
const { open, state } = useEnquiry()
const route = useRoute()
</script>

<template>
  <div
    v-show="!menuOpen && !state.open"
    class="group/wa fixed end-5 z-40 md:end-8"
    :class="route.meta.bottomBar ? 'bottom-[96px] lg:bottom-8' : 'bottom-[max(1.25rem,env(safe-area-inset-bottom))] md:bottom-8'"
  >
    <button
      type="button"
      class="relative grid size-14 place-items-center rounded-full transition-[background-color,transform,box-shadow] duration-200 ease-house active:scale-95"
      :class="floatOverHero
        ? 'glass on-dark text-white'
        : 'bg-kiswa text-white shadow-[0_12px_30px_-10px_rgba(11,11,12,.55)] hover:bg-[#232326]'"
      :aria-label="t('whatsappFloat.label')"
      @click="open({ type: 'general', title: '', details: {} }, { channel: 'whatsapp' })"
    >
      <Icon name="ph:whatsapp-logo" class="text-[1.75rem]" aria-hidden="true" />
    </button>
    <span
      role="tooltip"
      class="pointer-events-none absolute end-full top-1/2 me-3 hidden -translate-y-1/2 whitespace-nowrap rounded-pill bg-kiswa px-3.5 py-2 text-[0.8125rem] font-medium text-ihram opacity-0 transition-opacity duration-200 md:block group-hover/wa:opacity-100 group-focus-within/wa:opacity-100"
    >
      {{ t('whatsappFloat.tooltip') }}
    </span>
  </div>
</template>
