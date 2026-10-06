<script setup lang="ts">
import { contactTimes, dialCodes, enquirySchema } from '#shared/enquiry'
import type { EnquiryPayload } from '~/composables/useEnquiry'

const props = defineProps<{ payload: EnquiryPayload }>()
const emit = defineEmits<{ sent: [{ reference: string, name: string, email: string }], sending: [boolean] }>()
const { t } = useI18n()

const form = reactive({
  name: '',
  dialCode: '+234' as (typeof dialCodes)[number],
  phone: '',
  email: '',
  contactTime: 'any' as (typeof contactTimes)[number],
  notes: '',
})
const errors = ref<Record<string, string>>({})
const serverError = ref(false)
const sending = ref(false)
const summaryEl = ref<HTMLElement | null>(null)

const fieldIds = { name: 'enq-name', phone: 'enq-phone', email: 'enq-email', notes: 'enq-notes' } as const

function body() {
  return {
    ...form,
    enquiry: {
      type: props.payload.type,
      title: props.payload.title || t('enquiry.general'),
      details: Object.fromEntries(Object.entries(props.payload.details).map(([k, v]) => [k, v === undefined ? undefined : String(v)])),
      ref: props.payload.ref,
    },
  }
}

function validate() {
  const r = enquirySchema.safeParse(body())
  errors.value = {}
  if (!r.success) {
    for (const issue of r.error.issues) {
      const key = String(issue.path[0])
      if (!errors.value[key]) errors.value[key] = t(`enquiry.errors.${issue.message}`)
    }
  }
  return r.success
}

async function submit() {
  if (sending.value) return
  serverError.value = false
  if (!validate()) {
    await nextTick()
    summaryEl.value?.focus()
    return
  }
  sending.value = true
  emit('sending', true)
  try {
    const [res] = await Promise.all([
      $fetch<{ ok: true, reference: string }>('/api/enquiry', { method: 'POST', body: body() }),
      new Promise(r => setTimeout(r, 900)), // let the Tawaf indicator be seen
    ])
    emit('sent', { reference: res.reference, name: form.name.trim().split(/\s+/)[0] ?? form.name, email: form.email.trim() })
  }
  catch {
    serverError.value = true
  }
  finally {
    sending.value = false
    emit('sending', false)
  }
}

// re-validate a field once it has an error, so messages clear as the pilgrim types
watch(form, () => { if (Object.keys(errors.value).length) validate() })

const inputClass = (key: string) => [
  'block w-full rounded-sm border bg-marble px-3.5 text-[1rem] text-kiswa placeholder:text-stone/70',
  'transition-[border-color,background-color] duration-200 focus:bg-ihram focus:outline-2 focus:outline-offset-0 focus:outline-kiswa',
  errors.value[key] ? 'border-[#9B2C2C]' : 'border-transparent hover:border-line',
]
</script>

<template>
  <form class="grid gap-5" novalidate @submit.prevent="submit">
    <div
      v-if="Object.keys(errors).length || serverError"
      ref="summaryEl"
      tabindex="-1"
      role="alert"
      class="flex items-start gap-2.5 rounded-sm border border-[#9B2C2C]/30 bg-[#FBF1F1] p-3.5 text-[0.875rem] text-[#7A1F1F] outline-none"
    >
      <Icon name="ph:warning-circle-light" class="mt-0.5 shrink-0 text-[1.125rem]" aria-hidden="true" />
      <span>{{ serverError ? t('enquiry.form.serverError') : t('enquiry.form.errorSummary') }}</span>
    </div>

    <div class="grid gap-1.5">
      <label :for="fieldIds.name" class="text-[0.875rem] font-semibold">{{ t('enquiry.form.name') }}</label>
      <input :id="fieldIds.name" v-model="form.name" type="text" autocomplete="name" class="h-12" :class="inputClass('name')" :aria-invalid="!!errors.name" :aria-describedby="errors.name ? `${fieldIds.name}-err` : undefined">
      <p v-if="errors.name" :id="`${fieldIds.name}-err`" class="text-[0.8125rem] text-[#9B2C2C]">{{ errors.name }}</p>
    </div>

    <div class="grid gap-1.5">
      <label :for="fieldIds.phone" class="text-[0.875rem] font-semibold">{{ t('enquiry.form.phone') }}</label>
      <div class="flex gap-2" dir="ltr">
        <label class="sr-only" for="enq-dial">{{ t('enquiry.form.dialCode') }}</label>
        <div class="relative shrink-0">
          <select id="enq-dial" v-model="form.dialCode" class="h-12 appearance-none rounded-sm border border-transparent bg-marble pe-8 ps-3.5 text-[1rem] tabular-nums hover:border-line focus:bg-ihram focus:outline-2 focus:outline-offset-0 focus:outline-kiswa">
            <option v-for="c in dialCodes" :key="c" :value="c">{{ c }}</option>
          </select>
          <Icon name="ph:caret-down-light" class="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-stone" aria-hidden="true" />
        </div>
        <input :id="fieldIds.phone" v-model="form.phone" type="tel" inputmode="tel" autocomplete="tel-national" class="h-12 min-w-0 flex-1 tabular-nums" :class="inputClass('phone')" :aria-invalid="!!errors.phone" :aria-describedby="errors.phone ? `${fieldIds.phone}-err` : undefined">
      </div>
      <p v-if="errors.phone" :id="`${fieldIds.phone}-err`" class="text-[0.8125rem] text-[#9B2C2C]">{{ errors.phone }}</p>
    </div>

    <div class="grid gap-1.5">
      <label :for="fieldIds.email" class="text-[0.875rem] font-semibold">{{ t('enquiry.form.email') }}</label>
      <input :id="fieldIds.email" v-model="form.email" type="email" autocomplete="email" dir="ltr" class="h-12" :class="inputClass('email')" :aria-invalid="!!errors.email" :aria-describedby="errors.email ? `${fieldIds.email}-err` : undefined">
      <p v-if="errors.email" :id="`${fieldIds.email}-err`" class="text-[0.8125rem] text-[#9B2C2C]">{{ errors.email }}</p>
    </div>

    <div class="grid gap-1.5">
      <label for="enq-time" class="text-[0.875rem] font-semibold">{{ t('enquiry.form.contactTime') }}</label>
      <div class="relative">
        <select id="enq-time" v-model="form.contactTime" class="h-12 w-full appearance-none rounded-sm border border-transparent bg-marble pe-10 ps-3.5 text-[1rem] hover:border-line focus:bg-ihram focus:outline-2 focus:outline-offset-0 focus:outline-kiswa">
          <option v-for="c in contactTimes" :key="c" :value="c">{{ t(`enquiry.form.times.${c}`) }}</option>
        </select>
        <Icon name="ph:caret-down-light" class="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-stone" aria-hidden="true" />
      </div>
    </div>

    <div class="grid gap-1.5">
      <label :for="fieldIds.notes" class="text-[0.875rem] font-semibold">{{ t('enquiry.form.notes') }}</label>
      <textarea :id="fieldIds.notes" v-model="form.notes" rows="3" class="min-h-24 resize-y py-3" :class="inputClass('notes')" :aria-describedby="`${fieldIds.notes}-hint`" />
      <p :id="`${fieldIds.notes}-hint`" class="text-[0.8125rem] text-stone">{{ errors.notes || t('enquiry.form.notesHint') }}</p>
    </div>

    <div class="grid gap-3 pt-1">
      <AppButton type="submit" size="lg" block :aria-busy="sending">
        <template v-if="sending" #start>
          <TawafProgress tone="dark" :label="t('enquiry.form.sending')" />
        </template>
        {{ sending ? t('enquiry.form.sending') : t('enquiry.form.submit') }}
      </AppButton>
      <p class="text-center text-[0.8125rem] text-stone">{{ t('enquiry.form.privacy') }}</p>
    </div>
  </form>
</template>
