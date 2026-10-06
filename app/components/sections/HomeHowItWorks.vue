<script setup lang="ts">
import { site } from '~/data/site'

const { t, tm, rt } = useI18n()
const icons = ['ph:list-checks-duotone', 'ph:wallet-duotone', 'ph:file-arrow-up-duotone', 'ph:stamp-duotone', 'ph:airplane-landing-duotone']
const steps = computed(() => (tm('how.steps') as { title: unknown, text: unknown }[]).map((s, i) => ({
  title: rt(s.title as Parameters<typeof rt>[0]),
  icon: icons[i]!,
  i,
})))

/* The line draws as you scroll; each icon draws in as the line reaches it.
   Icons rest visible (SSR/no-JS/reduced motion); GSAP only dims them first. */
const root = ref<HTMLElement | null>(null)
useGsap(root, ({ gsap }) => {
  const mm = gsap.matchMedia()
  mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023.98px)' }, (ctx) => {
    const desktop = ctx.conditions!.desktop
    const line = root.value!.querySelector<HTMLElement>(desktop ? '.how-line-h' : '.how-line-v')
    const iconsEls = gsap.utils.toArray<HTMLElement>('.how-icon', root.value)
    if (!line) return
    gsap.set(line, desktop ? { scaleX: 0 } : { scaleY: 0 })
    gsap.set(iconsEls, { opacity: 0.2, scale: 0.85, clipPath: 'inset(0 0 100% 0)' })
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root.value, start: 'top 70%', end: desktop ? 'center 45%' : 'bottom 70%', scrub: 0.5 },
    })
    tl.to(line, { [desktop ? 'scaleX' : 'scaleY']: 1, ease: 'none', duration: 1 }, 0)
    iconsEls.forEach((el, i) => {
      tl.to(el, { opacity: 1, scale: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.18, ease: 'power2.out' }, (i / (iconsEls.length - 1)) * 0.92)
    })
  })
  return () => mm.revert()
})
</script>

<template>
  <section id="how-it-works" class="section-y scroll-mt-20 bg-ihram" aria-labelledby="how-h">
    <div ref="root" class="wrap">
      <SectionHeading id="how-h" :ar="t('how.eyebrowAr')" :eyebrow="t('how.eyebrow')" :title="t('how.h2')" />

      <ol class="relative mt-12 grid gap-10 md:mt-16 lg:grid-cols-5 lg:gap-6">
        <!-- connecting lines -->
        <span class="how-line-h absolute inset-x-[10%] top-7 hidden h-px origin-left bg-kiswa lg:block rtl:origin-right" aria-hidden="true" />
        <span class="absolute inset-x-[10%] top-7 hidden h-px bg-line lg:block" aria-hidden="true" />
        <span class="absolute bottom-8 start-7 top-8 w-px bg-line lg:hidden" aria-hidden="true" />
        <span class="how-line-v absolute bottom-8 start-7 top-8 w-px origin-top bg-kiswa lg:hidden" aria-hidden="true" />

        <li v-for="s in steps" :key="s.i" class="relative grid content-start grid-cols-[56px_1fr] gap-5 lg:grid-cols-1 lg:justify-items-center lg:gap-0 lg:text-center">
          <span class="relative z-[1] grid size-14 place-items-center rounded-full border border-line bg-ihram">
            <Icon :name="s.icon" class="how-icon text-[1.75rem]" aria-hidden="true" />
          </span>
          <div class="lg:mt-6">
            <p class="t-label text-stone">{{ t('how.step', { n: s.i + 1 }) }}</p>
            <h3 class="t-h3 mt-2">{{ s.title }}</h3>
            <p class="mt-2 text-[0.9375rem] leading-relaxed text-stone">
              <i18n-t v-if="s.i === 1" keypath="how.steps[1].text" scope="global">
                <template #deposit>
                  <span v-if="site.policies.depositPercent" class="ltr-iso">{{ site.policies.depositPercent }}%</span>
                  <GapText v-else :text="t('how.gapPercent')" />
                </template>
                <template #days>
                  <span v-if="site.policies.balanceDueDaysBefore" class="ltr-iso">{{ site.policies.balanceDueDaysBefore }}</span>
                  <GapText v-else :text="t('how.gapDays')" />
                </template>
              </i18n-t>
              <template v-else>{{ t(`how.steps[${s.i}].text`) }}</template>
            </p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
