<script setup lang="ts">
const { t } = useI18n()
const { open } = useEnquiry()

/* Motion #3 at full strength: the calligraphy (gold-light) draws itself when it scrolls into view.
   It rests fully drawn; GSAP hides it only just before drawing. */
const root = ref<HTMLElement | null>(null)
const text = ref<SVGTextElement | null>(null)
useGsap(root, ({ gsap }) => {
  const el = text.value
  if (!el) return
  const r = el.getBoundingClientRect()
  if (r.top < innerHeight) return // already visible: keep the final state
  gsap.set(el, { strokeDasharray: 2400, strokeDashoffset: 2400, fillOpacity: 0 })
  const tl = gsap.timeline({ paused: true })
    .to(el, { strokeDashoffset: 0, duration: 2.8, ease: 'power2.inOut' })
    .to(el, { fillOpacity: 1, duration: 1 }, '-=1')
  const io = new IntersectionObserver((e) => {
    if (e.some(x => x.isIntersecting)) {
      tl.play()
      io.disconnect()
    }
  }, { threshold: 0.4 })
  io.observe(el)
  return () => io.disconnect()
})
</script>

<template>
  <section ref="root" class="on-dark relative isolate overflow-hidden bg-kiswa text-on-dark" aria-labelledby="cta-h">
    <ArcadeEdge from="ihram" to="kiswa" />
    <KiswaBand />
    <div class="relative">
      <MashrabiyaPattern :opacity="0.06" color="#fff" :size="64" />
      <div class="wrap relative grid gap-10 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <svg class="w-full" viewBox="0 0 1000 300" aria-hidden="true" focusable="false">
          <text
            ref="text"
            x="500"
            y="215"
            text-anchor="middle"
            direction="rtl"
            font-family="'Aref Ruqaa', serif"
            font-size="170"
            fill="var(--c-gold-light)"
            stroke="var(--c-gold-light)"
            stroke-width="1.2"
          >{{ t('hero.calligraphy') }}</text>
        </svg>
        <div>
          <h2 id="cta-h" class="t-h2 text-on-dark">{{ t('cta.h2') }}</h2>
          <p class="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed text-on-dark-muted">{{ t('cta.sub') }}</p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <AppButton variant="on-dark" size="lg" icon-start="ph:whatsapp-logo" :directional="false" @click="open({ type: 'general', title: '', details: {} }, { channel: 'whatsapp' })">{{ t('cta.whatsapp') }}</AppButton>
            <AppButton variant="on-dark-outline" size="lg" icon-start="ph:envelope-simple-light" :directional="false" @click="open({ type: 'general', title: '', details: {} }, { channel: 'email' })">{{ t('cta.email') }}</AppButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
