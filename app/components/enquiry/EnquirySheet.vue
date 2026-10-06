<script setup lang="ts">
import { site } from '~/data/site'
import type { EnquiryChannel } from '~/composables/useEnquiry'

const { t } = useI18n()
const { state } = useEnquiry()
const wa = useWhatsAppLink()
const { copy, copied } = useClipboard({ copiedDuring: 1600 })

const open = computed({
  get: () => state.value.open,
  set: (v: boolean) => { state.value = { ...state.value, open: v } },
})
const payload = computed(() => state.value.payload)
const channel = computed({
  get: () => state.value.channel,
  set: (c: EnquiryChannel | null) => { state.value = { ...state.value, channel: c } },
})

const sent = ref<{ reference: string, name: string, email: string } | null>(null)
const sending = ref(false)

// reset the success state each time the sheet opens
watch(() => state.value.open, (o) => { if (o) sent.value = null })

const step = computed(() => (sent.value ? 3 : channel.value ? 2 : 1))
const details = computed(() => Object.entries(payload.value.details).filter(([, v]) => v !== undefined && `${v}` !== ''))
const reply = computed(() => site.contact.replyTimeMinutes)

const successWa = computed(() => wa.href({ ...payload.value, message: undefined, ref: sent.value?.reference }))
</script>

<template>
  <UiSheet
    v-model:open="open"
    :title="sent ? t('enquiry.success.title', { name: sent.name }) : t('enquiry.title')"
    :description="sent ? undefined : t('enquiry.sub')"
  >
    <!-- step indicator -->
    <div class="mb-5 mt-3 flex items-center gap-3">
      <TawafProgress mode="progress" :value="step" :total="3" />
      <ol class="flex flex-wrap items-center gap-x-2 text-[0.8125rem]">
        <li v-for="(s, i) in (['choose', 'details', 'sent'] as const)" :key="s" class="flex items-center gap-2" :class="i + 1 <= step ? 'text-kiswa font-semibold' : 'text-stone'" :aria-current="i + 1 === step ? 'step' : undefined">
          <span v-if="i > 0" class="h-px w-4 bg-line" aria-hidden="true" />
          {{ t(`enquiry.steps.${s}`) }}
        </li>
      </ol>
    </div>

    <!-- success -->
    <div v-if="sent" class="grid gap-6 pb-2" role="status">
      <p class="text-[1.0625rem] leading-relaxed">
        {{ t('enquiry.success.body', { ref: sent.reference, email: sent.email }) }}
      </p>
      <div class="flex items-center justify-between gap-3 rounded-md border border-line p-4">
        <div>
          <p class="t-label text-stone">{{ t('enquiry.ref') }}</p>
          <p class="ltr-iso mt-1 whitespace-nowrap font-semibold tabular-nums tracking-wide text-[1.375rem]">{{ sent.reference }}</p>
        </div>
        <AppButton variant="secondary" :icon-start="copied ? 'ph:check-light' : 'ph:copy-light'" :directional="false" @click="copy(sent.reference)">
          {{ copied ? t('common.copied') : t('enquiry.success.copyRef') }}
        </AppButton>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <AppButton size="lg" @click="open = false">{{ t('enquiry.success.done') }}</AppButton>
        <AppButton size="lg" variant="secondary" icon-start="ph:whatsapp-logo" :directional="false" :href="successWa ?? undefined" :disabled="!wa.available.value" :title="!wa.available.value ? t('enquiry.wa.disabledHint') : undefined">
          {{ t('enquiry.wa.title') }}
        </AppButton>
      </div>
      <p v-if="!wa.available.value" class="-mt-3 text-center text-[0.8125rem]"><GapText :text="t('enquiry.wa.disabledHint')" /></p>
    </div>

    <template v-else>
      <!-- summary -->
      <section v-if="payload.title || details.length" class="mb-6 rounded-md border border-line p-4" :aria-label="t('enquiry.about')">
        <p class="t-label text-stone">{{ t('enquiry.about') }}</p>
        <p class="mt-1.5 font-display text-[1.375rem] font-semibold leading-tight">{{ payload.title || t('enquiry.general') }}</p>
        <dl v-if="details.length" class="mt-3 grid gap-1.5 text-[0.875rem]">
          <div v-for="[k, v] in details" :key="k" class="flex justify-between gap-4">
            <dt class="text-stone">{{ k }}</dt>
            <dd class="text-end font-medium">{{ v }}</dd>
          </div>
        </dl>
        <p v-if="payload.ref" class="mt-3 inline-flex items-center gap-2 rounded-pill bg-marble px-2.5 py-1 text-[0.75rem] font-semibold tracking-wide text-stone">
          {{ t('enquiry.ref') }} <span class="ltr-iso text-kiswa">{{ payload.ref }}</span>
        </p>
      </section>

      <!-- two choices of equal weight -->
      <div class="grid grid-cols-2 gap-3" role="radiogroup" :aria-label="t('enquiry.title')">
        <button
          v-for="c in (['whatsapp', 'email'] as const)"
          :key="c"
          type="button"
          role="radio"
          :aria-checked="channel === c"
          class="group flex min-h-[132px] flex-col items-start gap-2 rounded-md border p-4 text-start transition-[border-color,background-color] duration-200 ease-house"
          :class="channel === c ? 'border-kiswa bg-ihram shadow-[inset_0_0_0_1px_var(--c-kiswa)]' : 'border-line bg-ihram hover:border-kiswa'"
          @click="channel = c"
        >
          <span class="flex w-full items-center justify-between">
            <Icon :name="c === 'whatsapp' ? 'ph:whatsapp-logo-duotone' : 'ph:envelope-simple-duotone'" class="text-[1.75rem]" aria-hidden="true" />
            <span class="grid size-5 place-items-center rounded-full border" :class="channel === c ? 'border-kiswa bg-kiswa' : 'border-line'" aria-hidden="true">
              <span class="size-1.5 rounded-full bg-ihram" :class="channel === c ? 'opacity-100' : 'opacity-0'" />
            </span>
          </span>
          <span class="mt-auto font-display text-[1.375rem] font-semibold leading-none">{{ c === 'whatsapp' ? t('enquiry.wa.title') : t('enquiry.em.title') }}</span>
          <span class="text-[0.8125rem] leading-snug text-stone">
            <template v-if="c === 'whatsapp'">
              <i18n-t keypath="enquiry.wa.line" scope="global">
                <template #x>
                  <span v-if="reply" class="ltr-iso">{{ reply }}</span>
                  <GapText v-else :text="t('enquiry.wa.lineGap')" />
                </template>
              </i18n-t>
            </template>
            <template v-else>{{ t('enquiry.em.line') }}</template>
          </span>
        </button>
      </div>

      <div v-if="channel" class="mt-6 border-t border-line pt-6">
        <EnquiryWhatsApp v-if="channel === 'whatsapp'" :payload="payload" />
        <EnquiryEmailForm v-else :payload="payload" @sent="sent = $event" @sending="sending = $event" />
      </div>
    </template>
  </UiSheet>
</template>
