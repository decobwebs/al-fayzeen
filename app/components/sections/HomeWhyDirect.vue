<script setup lang="ts">
const { t, tm, rt } = useI18n()

const slots = ['why-welcome', 'why-hotel-view', 'why-guide', 'why-walk']
const icons = ['ph:hand-waving-duotone', 'ph:person-simple-walk-duotone', 'ph:tag-duotone', 'ph:whatsapp-logo-duotone']
const pillars = computed(() => (tm('why.pillars') as { title: unknown, text: unknown }[]).map((p, i) => ({
  title: rt(p.title as Parameters<typeof rt>[0]),
  text: rt(p.text as Parameters<typeof rt>[0]),
  slot: slots[i]!,
  icon: icons[i]!,
})))

/* Motion #4: words light up as the statement scrolls through (scrubbed).
   Words start in Stone (readable, AA), never invisible; SSR shows the final state. */
const statement = ref<HTMLElement | null>(null)
useGsap(statement, ({ gsap, SplitText, ScrollTrigger }) => {
  const el = statement.value!
  const split = SplitText.create(el.querySelectorAll('.why-line'), { type: 'words', aria: 'none' })
  gsap.set(split.words, { color: '#6E6C66' }) // Stone: 5:1 on white, readable before it lights
  gsap.to(split.words, {
    color: '#0B0B0C',
    stagger: 0.12,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
  })
  ScrollTrigger.refresh()
  return () => split.revert()
})
</script>

<template>
  <section class="section-y bg-ihram" aria-labelledby="why-h">
    <div class="wrap">
      <ArabicEyebrow :ar="t('why.eyebrowAr')" :label="t('why.eyebrow')" />
      <h2 id="why-h" class="sr-only">{{ t('why.statement') }} {{ t('why.statementStrong') }}</h2>
      <p ref="statement" class="t-statement mt-6 max-w-[22ch] text-kiswa" aria-hidden="true">
        <span class="why-line">{{ t('why.statement') }}</span>
        {{ ' ' }}
        <strong class="why-line font-semibold italic">{{ t('why.statementStrong') }}</strong>
      </p>

      <ul class="no-scrollbar -mx-[var(--gutter)] mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-2 md:mt-20 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0">
        <li v-for="p in pillars" :key="p.slot" class="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
          <AppImage :slot="p.slot" arch sizes="80vw sm:46vw lg:300px" />
          <Icon :name="p.icon" class="mt-6 text-[1.75rem]" aria-hidden="true" />
          <h3 class="t-h3 mt-3">{{ p.title }}</h3>
          <p class="mt-2 text-[0.9375rem] leading-relaxed text-stone">{{ p.text }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
