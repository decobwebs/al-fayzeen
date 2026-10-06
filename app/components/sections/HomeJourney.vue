<script setup lang="ts">
const { t, tm, rt, locale } = useI18n()

const slots = ['journey-arrive', 'journey-umrah', 'journey-makkah', 'journey-train', 'journey-madinah', 'journey-ziyarat']
const panels = computed(() => (tm('journey.panels') as { title: unknown, text: unknown }[]).map((p, i) => ({
  title: rt(p.title as Parameters<typeof rt>[0]),
  text: rt(p.text as Parameters<typeof rt>[0]),
  slot: slots[i]!,
  madinah: i === 4,
})))

const points = computed(() => [
  { code: 'LOS', label: t('journey.route.LOS') },
  { code: 'JED', label: t('journey.route.JED') },
  { code: 'MAK', label: t('journey.route.MAK'), tone: 'makkah' as const },
  { code: 'MED', label: t('journey.route.MED'), tone: 'madinah' as const },
])

/* Desktop: pinned horizontal scroll. Mobile and reduced motion: the vertical list (SSR default). */
const section = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const horizontal = ref(false)

useGsap(section, ({ gsap, ScrollTrigger }) => {
  const mm = gsap.matchMedia()
  mm.add('(min-width: 1024px)', () => {
    horizontal.value = true
    let tween: gsap.core.Tween | null = null
    nextTick(() => {
      const el = track.value!
      const distance = () => el.scrollWidth - el.clientWidth
      const sign = locale.value === 'ar' ? 1 : -1
      tween = gsap.to(el.firstElementChild, {
        x: () => sign * distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.value,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      ScrollTrigger.refresh()
    })
    return () => {
      tween?.scrollTrigger?.kill()
      tween?.kill()
      horizontal.value = false
    }
  })
  return () => mm.revert()
})
</script>

<template>
  <section ref="section" class="journey section-y overflow-hidden bg-ihram lg:flex lg:min-h-svh lg:flex-col lg:justify-center" aria-labelledby="journey-h">
    <div class="wrap">
      <SectionHeading id="journey-h" :ar="t('journey.eyebrowAr')" :eyebrow="t('journey.eyebrow')" :title="t('journey.h2')" />
      <RouteLine class="mt-8 max-w-3xl md:mt-10" :points="points" :label="t('journey.routeLabel')" />
    </div>

    <div ref="track" class="mt-10 md:mt-14" :class="horizontal ? 'overflow-hidden' : 'wrap'">
      <ol
        class="journey-list"
        :class="horizontal
          ? 'flex w-max gap-6 ps-[max(var(--gutter),calc((100vw-var(--max-w))/2))] pe-[var(--gutter)] will-change-transform'
          : 'grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'"
      >
        <li
          v-for="(p, i) in panels"
          :key="p.slot"
          class="grid grid-cols-[38%_1fr] items-start gap-5 sm:grid-cols-1 sm:gap-0"
          :class="horizontal && 'w-[min(340px,26vw)] shrink-0'"
        >
          <AppImage :slot="p.slot" arch sizes="40vw sm:45vw lg:340px" />
          <div class="sm:mt-5">
            <p class="t-label" :class="p.madinah ? 'text-nabawi' : 'text-stone'">{{ t('journey.stage', { n: i + 1 }) }}</p>
            <h3 class="t-h3 mt-2">{{ p.title }}</h3>
            <p class="mt-2 text-[0.9375rem] leading-relaxed text-stone">{{ p.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
