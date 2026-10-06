<script setup lang="ts">
import type { EnquiryPayload } from '~/composables/useEnquiry'

const props = defineProps<{ payload: EnquiryPayload }>()
const { t } = useI18n()
const wa = useWhatsAppLink()
const message = computed(() => wa.message(props.payload))
const href = computed(() => wa.href(props.payload))
</script>

<template>
  <div class="grid gap-5">
    <div>
      <p class="t-label text-stone">{{ t('enquiry.wa.preview') }}</p>
      <div class="relative mt-3 rounded-md border border-line bg-marble p-4">
        <p class="whitespace-pre-line text-[0.9375rem] leading-relaxed" dir="ltr" lang="en">{{ message }}</p>
      </div>
    </div>
    <div class="grid gap-2">
      <AppButton
        size="lg"
        block
        icon-start="ph:whatsapp-logo"
        :directional="false"
        :href="href ?? undefined"
        :disabled="!wa.available.value"
        :aria-describedby="!wa.available.value ? 'wa-hint' : undefined"
      >
        {{ t('enquiry.wa.open') }}
      </AppButton>
      <p v-if="!wa.available.value" id="wa-hint" class="flex items-center justify-center gap-1.5 text-[0.8125rem]">
        <Icon name="ph:info-light" class="text-[1rem] text-stone" aria-hidden="true" />
        <GapText :text="t('enquiry.wa.disabledHint')" />
      </p>
    </div>
  </div>
</template>
