<script setup lang="ts">
import { site } from '~/data/site'

const { t, locale } = useI18n()
const { copy, copied } = useClipboard({ copiedDuring: 1600 })
const lastCopied = ref('')

function copyValue(key: string, value: string | null) {
  if (!value) return
  lastCopied.value = key
  copy(value)
}

const services = computed(() => [
  { to: '/packages', label: t('footer.links.packages') },
  { to: '/flights', label: t('footer.links.flights') },
  { to: '/hotels', label: t('footer.links.hotels') },
  { to: '/transport', label: t('footer.links.transport') },
  { to: '/visa', label: t('footer.links.visa') },
])
const help = computed(() => [
  { to: '/guide', label: t('footer.links.guide') },
  { to: '/#questions', label: t('footer.links.questions') },
  { to: '/about', label: t('footer.links.about') },
  { to: '/contact', label: t('footer.links.contact') },
])

const contacts = computed(() => [
  { key: 'makkah', label: t('footer.makkahOffice'), value: site.offices.makkah, gap: t('footer.gapAddress') },
  { key: 'nigeria', label: t('footer.nigeriaContact'), value: site.offices.nigeria, gap: t('footer.gapNigeria') },
  { key: 'whatsapp', label: t('footer.whatsapp'), value: site.contact.whatsapp ? `+${site.contact.whatsapp}` : null, gap: t('footer.gapNumber') },
  { key: 'email', label: t('footer.email'), value: site.contact.email, gap: t('footer.gapEmail') },
])

const socials = [
  { key: 'instagram', name: 'Instagram', icon: 'ph:instagram-logo-light', url: site.social.instagram },
  { key: 'facebook', name: 'Facebook', icon: 'ph:facebook-logo-light', url: site.social.facebook },
  { key: 'tiktok', name: 'TikTok', icon: 'ph:tiktok-logo-light', url: site.social.tiktok },
  { key: 'youtube', name: 'YouTube', icon: 'ph:youtube-logo-light', url: site.social.youtube },
]

// Hijri date is rendered on the client (time zone of the visitor)
const hijri = ref('')
function updateHijri() {
  try {
    const loc = locale.value === 'ar' ? 'ar-SA-u-ca-islamic-umalqura-nu-latn' : 'en-GB-u-ca-islamic-umalqura'
    hijri.value = new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
  }
  catch { hijri.value = '' }
}
onMounted(updateHijri)
watch(locale, updateHijri)
</script>

<template>
  <footer class="on-dark bg-kiswa text-on-dark">
    <div class="wrap grid gap-12 pb-10 pt-16 md:grid-cols-2 md:pt-20 lg:grid-cols-[1.4fr_1fr_1fr_1.6fr] lg:gap-10">
      <div class="max-w-sm">
        <Wordmark size="lg" />
        <p class="mt-5 text-[0.9375rem] text-on-dark-muted">{{ t('footer.about') }}</p>
        <p class="mt-4 text-[0.875rem]">
          <span class="text-on-dark-muted">{{ t('footer.licence') }}:</span>
          <span v-if="site.licence.number" class="ltr-iso">{{ site.licence.number }}</span>
          <GapText v-else :text="t('footer.licenceGap')" />
        </p>
      </div>

      <nav :aria-labelledby="'f-services'">
        <h2 id="f-services" class="t-label font-body! text-on-dark-muted">{{ t('footer.services') }}</h2>
        <ul class="mt-4 grid">
          <li v-for="l in services" :key="l.label">
            <NuxtLinkLocale :to="l.to" class="inline-flex min-h-11 items-center text-[0.9375rem] hover:underline hover:underline-offset-4">{{ l.label }}</NuxtLinkLocale>
          </li>
        </ul>
      </nav>

      <nav :aria-labelledby="'f-help'">
        <h2 id="f-help" class="t-label font-body! text-on-dark-muted">{{ t('footer.help') }}</h2>
        <ul class="mt-4 grid">
          <li v-for="l in help" :key="l.label">
            <NuxtLinkLocale :to="l.to" class="inline-flex min-h-11 items-center text-[0.9375rem] hover:underline hover:underline-offset-4">{{ l.label }}</NuxtLinkLocale>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="t-label font-body! text-on-dark-muted">{{ t('footer.contact') }}</h2>
        <ul class="mt-4 grid gap-1">
          <li v-for="c in contacts" :key="c.key" class="flex min-h-11 items-center justify-between gap-3 border-b border-line-dark py-2">
            <div class="min-w-0">
              <p class="text-[0.75rem] text-on-dark-muted">{{ c.label }}</p>
              <p class="select-all text-[0.9375rem]">
                <span v-if="c.value" class="ltr-iso">{{ c.value }}</span>
                <GapText v-else :text="c.gap" />
              </p>
            </div>
            <button
              type="button"
              class="grid size-11 shrink-0 place-items-center rounded-pill transition-colors duration-200 hover:bg-kiswa-soft disabled:opacity-40 disabled:hover:bg-transparent"
              :disabled="!c.value"
              :title="c.value ? t('common.copy') : t('footer.copyWhen')"
              :aria-label="`${t('common.copy')} ${c.label}`"
              @click="copyValue(c.key, c.value)"
            >
              <Icon :name="copied && lastCopied === c.key ? 'ph:check-light' : 'ph:copy-light'" class="text-[1.125rem]" aria-hidden="true" />
            </button>
          </li>
        </ul>
        <p class="sr-only" aria-live="polite">{{ copied ? t('common.copied') : '' }}</p>
      </div>
    </div>

    <div class="wrap">
      <div class="flex flex-col gap-5 border-t border-line-dark py-7 pb-24 text-[0.8125rem] text-on-dark-muted lg:flex-row lg:pb-7 lg:pe-20 lg:items-center lg:justify-between">
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <p>{{ t('footer.rights') }}</p>
          <p v-if="hijri" class="text-on-dark"><span class="sr-only">{{ t('footer.hijri') }}: </span>{{ hijri }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
          <ul class="flex flex-wrap gap-2" :aria-label="t('footer.payments')">
            <li v-for="p in site.payments" :key="p" class="rounded-pill border border-line-dark px-3 py-1.5 text-on-dark">{{ p }}</li>
          </ul>
          <div class="flex items-center gap-1">
            <ul class="flex items-center" :aria-label="t('footer.social')">
              <li v-for="s in socials" :key="s.key">
                <a
                  v-if="s.url"
                  :href="s.url"
                  target="_blank"
                  rel="noopener"
                  class="grid size-11 place-items-center rounded-pill text-on-dark hover:bg-kiswa-soft"
                  :aria-label="`${s.name} ${t('common.newTab')}`"
                >
                  <Icon :name="s.icon" class="text-[1.375rem]" aria-hidden="true" />
                </a>
                <span
                  v-else
                  class="grid size-11 place-items-center text-on-dark-muted/70"
                  role="img"
                  :aria-label="t('footer.socialPending', { name: s.name })"
                  :title="t('footer.socialPending', { name: s.name })"
                >
                  <Icon :name="s.icon" class="text-[1.375rem]" aria-hidden="true" />
                </span>
              </li>
            </ul>
            <GapText :text="t('footer.socialGap')" class="text-[0.75rem]" />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
