<script setup lang="ts">
import { visa } from '~/data/visa'
import { faqs } from '~/data/faqs'

const { t } = useI18n()
const dt = useDataText()
useHead({ title: () => t('visaPage.h1') })
const route = useRoute()
const { open } = useEnquiry()

const nationality = computed(() => (typeof route.query.nationality === 'string' && route.query.nationality) || 'Nigeria')
const applicants = computed(() => Number(route.query.applicants) || 1)
const month = computed(() => (typeof route.query.month === 'string' ? route.query.month : ''))
const visaFaqs = computed(() => faqs.filter(f => f.topic === 'visa'))

function start(withPackage = false) {
  open({
    type: 'visa',
    title: withPackage ? 'Umrah e-Visa with a package' : 'Umrah e-Visa',
    details: { Nationality: nationality.value, Applicants: applicants.value, 'Travel month': month.value || undefined },
    ref: 'AFZ-VISA',
  })
}
</script>

<template>
  <div>
    <header class="wrap grid gap-10 pb-12 pt-10 md:pt-16 lg:grid-cols-[1.2fr_1fr] lg:items-end">
      <div>
        <ArabicEyebrow :ar="t('visaPage.eyebrowAr')" :label="t('visaPage.eyebrow')" />
        <h1 class="t-h2 mt-4 md:text-[3.5rem]!">{{ t('visaPage.h1') }}</h1>
        <p class="mt-4 max-w-[40rem] text-[1.0625rem] leading-relaxed text-stone">{{ t('visaPage.sub') }} <GapText :text="t('visaPage.subGap')" /></p>
        <p class="mt-4 text-[0.9375rem] font-semibold">{{ t('visaPage.forYou', { n: applicants, nat: nationality }, applicants) }}</p>
        <p v-if="nationality !== 'Nigeria'" class="mt-1 text-[0.875rem] text-stone">{{ t('visaPage.otherNat', { nat: nationality }) }}</p>
        <AppButton size="lg" class="mt-6" @click="start()">{{ t('visaPage.start') }}</AppButton>
      </div>
      <AppImage slot="visa" ratio="4:3" sizes="100vw lg:520px" />
    </header>

    <section class="wrap grid gap-10 pb-16 lg:grid-cols-2" aria-labelledby="req-h">
      <div>
        <h2 id="req-h" class="t-h3 text-[1.875rem]!">{{ t('visaPage.requirements') }}</h2>
        <ul class="mt-6 grid gap-4">
          <li v-for="r in visa.requirements" :key="r.label" class="flex items-start gap-3 border-b border-line pb-4">
            <Icon :name="r.confirmed ? 'ph:check-circle-light' : 'ph:question-light'" class="mt-0.5 shrink-0 text-[1.375rem]" :class="!r.confirmed && 'text-stone'" aria-hidden="true" />
            <span v-if="r.confirmed">{{ dt(r.label) }}</span>
            <GapText v-else :text="r.label" />
          </li>
        </ul>
      </div>
      <div>
        <h2 class="t-h3 text-[1.875rem]!">{{ t('visaPage.process') }}</h2>
        <ol class="mt-6 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
          <li v-for="(st, i) in visa.steps" :key="st.title" class="bg-ihram p-5">
            <div class="flex items-center gap-3">
              <TawafProgress mode="progress" :value="i + 1" :total="visa.steps.length" />
              <p class="t-label text-stone">{{ t('guide.stepN', { n: i + 1 }) }}</p>
            </div>
            <h3 class="mt-3 font-display text-[1.375rem] font-semibold leading-tight">{{ dt(st.title) }}</h3>
            <p class="mt-1 text-[0.875rem] text-stone">{{ dt(st.text) }}</p>
          </li>
        </ol>
        <p class="mt-4 text-[0.9375rem]">
          <span class="text-stone">{{ t('visaPage.processing') }}:</span>
          <span v-if="visa.processingDays" class="ltr-iso"> {{ visa.processingDays }}</span>
          <GapText v-else :text="` ${t('visaPage.processingGap')}`" />
        </p>
      </div>
    </section>

    <section class="bg-marble py-16 md:py-20" aria-labelledby="opt-h">
      <div class="wrap">
        <h2 id="opt-h" class="t-h2">{{ t('visaPage.options') }}</h2>
        <div class="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
          <article class="flex flex-col rounded-md border border-line bg-ihram p-6 md:p-8">
            <Icon name="ph:moon-stars-duotone" class="text-[2rem]" aria-hidden="true" />
            <h3 class="t-h3 mt-6">{{ t('visaPage.withPkg.title') }}</h3>
            <p class="mt-2 text-stone">{{ t('visaPage.withPkg.text') }}</p>
            <div class="mt-auto flex flex-wrap gap-3 pt-6">
              <AppButton to="/packages" icon-end="ph:arrow-right-light">{{ t('visaPage.withPkg.cta') }}</AppButton>
              <AppButton variant="secondary" @click="start(true)">{{ t('common.enquire') }}</AppButton>
            </div>
          </article>
          <article class="flex flex-col rounded-md border border-dashed border-stone/40 bg-ihram p-6 md:p-8">
            <Icon name="ph:identification-card-duotone" class="text-[2rem]" aria-hidden="true" />
            <h3 class="t-h3 mt-6">{{ t('visaPage.only.title') }} <GapText :text="t('visaPage.only.gap')" class="font-body text-[0.875rem] font-normal" /></h3>
            <p class="mt-2 text-stone">{{ t('visaPage.only.text') }}</p>
            <div class="mt-auto pt-6">
              <AppButton variant="secondary" @click="start()">{{ t('visaPage.start') }}</AppButton>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="wrap section-y" aria-labelledby="vfaq-h">
      <h2 id="vfaq-h" class="t-h2 mb-8">{{ t('visaPage.faq') }}</h2>
      <HomeFaq id="visa-faq" :faqs="visaFaqs" :heading="false" />
    </section>
  </div>
</template>
