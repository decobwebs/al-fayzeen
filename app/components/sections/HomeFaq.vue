<script setup lang="ts">
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from 'reka-ui'
import { faqs as allFaqs } from '~/data/faqs'
import type { faqs as FaqList } from '~/data/faqs'

const props = withDefaults(defineProps<{
  faqs?: typeof FaqList
  /** render the eyebrow + H2 (home) or just the list (other pages) */
  heading?: boolean
  id?: string
}>(), { heading: true, id: 'questions' })

const { t } = useI18n()
const dt = useDataText()
const { open } = useEnquiry()
const list = computed(() => props.faqs ?? allFaqs)
// two columns on desktop: split in reading order
const columns = computed(() => {
  const half = Math.ceil(list.value.length / 2)
  return [list.value.slice(0, half), list.value.slice(half)]
})
</script>

<template>
  <section :id="id" class="section-y scroll-mt-20 bg-ihram" :class="!heading && 'py-0!'" :aria-labelledby="heading ? `${id}-h` : undefined">
    <div :class="heading && 'wrap'">
      <SectionHeading v-if="heading" :id="`${id}-h`" :ar="t('faq.eyebrowAr')" :eyebrow="t('faq.eyebrow')" :title="t('faq.h2')" />

      <div class="grid gap-x-8 lg:grid-cols-2" :class="heading && 'mt-10 md:mt-14'">
        <AccordionRoot v-for="(col, ci) in columns" :key="ci" type="multiple" class="border-t border-line" :class="ci === 1 && 'max-lg:border-t-0'">
          <AccordionItem v-for="(f, i) in col" :key="f.q" :value="`${ci}-${i}`" class="border-b border-line">
            <AccordionHeader as="h3">
              <AccordionTrigger class="group flex min-h-16 w-full items-center justify-between gap-6 py-4 text-start font-body! text-[1.0625rem] font-semibold leading-snug!">
                {{ dt(f.q) }}
                <span class="grid size-8 shrink-0 place-items-center rounded-full border border-line transition-[transform,background-color] duration-200 ease-house group-hover:border-kiswa group-data-[state=open]:rotate-45 group-data-[state=open]:bg-kiswa group-data-[state=open]:text-ihram" aria-hidden="true">
                  <Icon name="ph:plus-light" class="text-[1rem]" />
                </span>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent class="faq-content overflow-hidden">
              <p class="max-w-[60ch] pb-5 pe-12 text-[0.9375rem] leading-relaxed text-stone">
                <template v-if="f.a">{{ dt(f.a) }}</template>
                <GapText v-else :text="t('faq.gap')" />
              </p>
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
      </div>

      <div v-if="heading" class="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p class="font-display text-[1.375rem] font-semibold">{{ t('faq.still') }}</p>
        <AppButton variant="secondary" icon-start="ph:whatsapp-logo" :directional="false" @click="open({ type: 'general', title: '', details: {} }, { channel: 'whatsapp' })">{{ t('faq.ask') }}</AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-content[data-state="open"] { animation: faq-open 300ms var(--ease); }
.faq-content[data-state="closed"] { animation: faq-close 200ms var(--ease); }
@keyframes faq-open { from { height: 0; } to { height: var(--reka-accordion-content-height); } }
@keyframes faq-close { from { height: var(--reka-accordion-content-height); } to { height: 0; } }
</style>
