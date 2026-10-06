<script setup lang="ts">
import { site } from '~/data/site'

const { t } = useI18n()
useHead({ title: () => t('contactPage.h1') })
const wa = useWhatsAppLink()
const { open } = useEnquiry()
const { copy, copied } = useClipboard({ copiedDuring: 1600 })
const sent = ref<{ reference: string, name: string, email: string } | null>(null)
const payload = computed(() => ({ type: 'general' as const, title: t('contactPage.general'), details: {} }))

const mapsUrl = (address: string | null) => (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : null)
const offices = computed(() => [
  { key: 'makkah', label: t('contactPage.makkah'), address: site.offices.makkah, gap: t('footer.gapAddress') },
  { key: 'nigeria', label: t('contactPage.nigeria'), address: site.offices.nigeria, gap: t('footer.gapNigeria') },
])
</script>

<template>
  <div>
    <header class="wrap pb-10 pt-10 md:pt-16">
      <ArabicEyebrow :ar="t('contactPage.eyebrowAr')" :label="t('contactPage.eyebrow')" />
      <h1 class="t-h2 mt-4 md:text-[3.5rem]!">{{ t('contactPage.h1') }}</h1>
      <p class="mt-4 max-w-[40rem] text-[1.0625rem] text-stone">{{ t('contactPage.sub') }}</p>
    </header>

    <div class="wrap grid gap-5 lg:grid-cols-2">
      <section class="flex flex-col rounded-md border border-line p-6 md:p-8" aria-labelledby="c-wa">
        <Icon name="ph:whatsapp-logo-duotone" class="text-[2.25rem]" aria-hidden="true" />
        <h2 id="c-wa" class="t-h2 mt-6 text-[2.25rem]!">{{ t('contactPage.wa.title') }}</h2>
        <p class="mt-2 text-stone">{{ t('contactPage.wa.text') }}</p>
        <div class="mt-6 flex items-center justify-between gap-3 rounded-sm bg-marble px-4 py-3">
          <div>
            <p class="t-label text-stone">{{ t('contactPage.wa.number') }}</p>
            <p class="mt-1 text-[1.125rem] font-semibold">
              <span v-if="site.contact.whatsapp" class="ltr-iso select-all">+{{ site.contact.whatsapp }}</span>
              <GapText v-else :text="t('contactPage.wa.gap')" class="font-normal" />
            </p>
          </div>
          <button
            type="button"
            class="grid size-11 shrink-0 place-items-center rounded-pill hover:bg-ihram disabled:opacity-40 disabled:hover:bg-transparent"
            :disabled="!site.contact.whatsapp"
            :title="site.contact.whatsapp ? t('common.copy') : t('footer.copyWhen')"
            :aria-label="`${t('common.copy')} ${t('contactPage.wa.number')}`"
            @click="copy(`+${site.contact.whatsapp}`)"
          >
            <Icon :name="copied ? 'ph:check-light' : 'ph:copy-light'" class="text-[1.25rem]" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-auto pt-6">
          <AppButton size="lg" icon-start="ph:whatsapp-logo" :directional="false" @click="open(payload, { channel: 'whatsapp' })">{{ t('contactPage.wa.open') }}</AppButton>
          <p v-if="!wa.available.value" class="mt-2 text-[0.8125rem]"><GapText :text="t('enquiry.wa.disabledHint')" /></p>
        </div>
      </section>

      <section class="rounded-md border border-line p-6 md:p-8" aria-labelledby="c-em">
        <Icon name="ph:envelope-simple-duotone" class="text-[2.25rem]" aria-hidden="true" />
        <h2 id="c-em" class="t-h2 mt-6 text-[2.25rem]!">{{ t('contactPage.em.title') }}</h2>
        <p class="mt-2 text-stone">{{ t('contactPage.em.text') }}</p>
        <div class="mt-6">
          <div v-if="sent" role="status" class="grid gap-3 rounded-md bg-marble p-5">
            <p class="font-display text-[1.75rem] font-semibold">{{ t('enquiry.success.title', { name: sent.name }) }}</p>
            <p>{{ t('enquiry.success.body', { ref: sent.reference, email: sent.email }) }}</p>
          </div>
          <EnquiryEmailForm v-else :payload="payload" @sent="sent = $event" />
        </div>
      </section>
    </div>

    <section class="wrap grid gap-10 py-16 md:grid-cols-2 md:py-20" aria-labelledby="c-off">
      <div>
        <h2 id="c-off" class="t-h3 text-[1.875rem]!">{{ t('contactPage.offices') }}</h2>
        <dl class="mt-6 grid gap-5">
          <div v-for="o in offices" :key="o.key" class="border-b border-line pb-5">
            <dt class="t-label text-stone">{{ o.label }}</dt>
            <dd class="mt-2">
              <span v-if="o.address">{{ o.address }}</span>
              <GapText v-else :text="o.gap" />
              <a v-if="mapsUrl(o.address)" :href="mapsUrl(o.address)!" target="_blank" rel="noopener" class="mt-2 flex min-h-11 items-center gap-1.5 font-semibold underline-offset-4 hover:underline">
                <Icon name="ph:map-pin-light" aria-hidden="true" />{{ t('contactPage.maps') }}<span class="sr-only"> {{ t('common.newTab') }}</span>
              </a>
              <span v-else class="mt-2 flex min-h-11 items-center gap-1.5 text-[0.875rem] text-stone" :title="t('contactPage.mapsWhen')">
                <Icon name="ph:map-pin-light" aria-hidden="true" />{{ t('contactPage.maps') }} · <GapText :text="t('footer.socialGap')" />
              </span>
            </dd>
          </div>
        </dl>
      </div>
      <div>
        <h2 class="t-h3 text-[1.875rem]!">{{ t('contactPage.hours') }}</h2>
        <p class="mt-6"><span v-if="site.contact.hours">{{ site.contact.hours }}</span><GapText v-else :text="t('contactPage.hoursGap')" /></p>
      </div>
    </section>
  </div>
</template>
