<script setup lang="ts">
import { getAsset } from '~/data/assets'

const { t, tm, rt } = useI18n()
const { open: openEnquiry } = useEnquiry()
const reduced = useReducedMotion()
const { saveData } = useLowPowerDevice()

const words = computed(() => (tm('hero.words') as unknown[]).map(w => rt(w as Parameters<typeof rt>[0])))

/* ---------- Video: mounted after first paint, never on Save-Data or reduced motion ---------- */
const video = ref<HTMLVideoElement | null>(null)
const videoOn = ref(false)
const videoReady = ref(false)
const isMobile = ref(false)
const heroAlt = getAsset('hero').alt
const img = useImage()
const poster = computed(() => img('/images/hero-still.jpg', { width: isMobile.value ? 768 : 1600 }))

onMounted(() => {
  if (saveData.value || reduced.value) return
  isMobile.value = matchMedia('(max-width: 767px)').matches
  // The still is the LCP; the video starts on first interaction or 5 s after load.
  whenEngaged().then(() => { videoOn.value = true })
})
function onPlaying() { videoReady.value = true }

/* ---------- Motion #1 glint, #2 rotating word, #3 calligraphy ---------- */
const root = ref<HTMLElement | null>(null)
const wordEl = ref<HTMLElement | null>(null)
const glint = ref(false)
const rotating = ref(false)

onMounted(() => {
  if (!reduced.value) glint.value = true // CSS glint sweep once on load
})

useGsap(root, ({ gsap, SplitText }) => {
  // rotating word: letters blur in
  const el = wordEl.value
  if (!el || words.value.length < 2) return
  let i = 0
  let split: InstanceType<typeof SplitText> | null = null
  const cycle = () => {
    rotating.value = true // plain white while letters animate (background-clip:text can't show filtered children)
    split = SplitText.create(el, { type: 'chars', aria: 'none' })
    gsap.to(split.chars, {
      opacity: 0, filter: 'blur(6px)', y: -6, duration: 0.35, stagger: 0.02, ease: 'power2.in',
      onComplete: () => {
        split?.revert()
        i = (i + 1) % words.value.length
        el.textContent = words.value[i]!
        split = SplitText.create(el, { type: 'chars', aria: 'none' })
        gsap.from(split.chars, {
          opacity: 0, filter: 'blur(10px)', y: 8, duration: 0.7, stagger: 0.045, ease: 'power3.out',
          onComplete: () => { split?.revert(); split = null; rotating.value = false },
        })
      },
    })
  }
  const timer = setInterval(cycle, 3400)
  return () => { clearInterval(timer); split?.revert() }
})

function replayGlint() {
  if (reduced.value || rotating.value) return
  glint.value = false
  requestAnimationFrame(() => { glint.value = true })
}

const calligraphy = computed(() => t('hero.calligraphy'))
</script>

<template>
  <section ref="root" class="hero on-dark relative isolate overflow-hidden bg-kiswa text-on-dark">
    <!-- media -->
    <div class="absolute inset-0 -z-10" aria-hidden="false">
      <AppImage slot="hero-still" fill rounded="none" priority sizes="100vw" />
      <video
        v-if="videoOn"
        ref="video"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-house"
        :class="videoReady ? 'opacity-100' : 'opacity-0'"
        :poster="poster"
        muted
        playsinline
        loop
        autoplay
        preload="metadata"
        disablepictureinpicture
        :aria-label="heroAlt"
        @playing="onPlaying"
      >
        <template v-if="isMobile">
          <source src="/images/hero-mobile.webm" type="video/webm">
          <source src="/images/hero-mobile.mp4" type="video/mp4">
        </template>
        <template v-else>
          <source src="/images/hero.webm" type="video/webm">
          <source src="/images/hero.mp4" type="video/mp4">
        </template>
      </video>
      <!-- Kiswa overlay: 70% at the bottom and start edge → 25% at the top end -->
      <div class="hero-overlay absolute inset-0" />
      <MashrabiyaPattern :opacity="0.05" color="#fff" :size="64" />
      <!-- calligraphy, 8% white -->
      <svg
        class="pointer-events-none absolute inset-x-0 top-[13%] mx-auto w-[min(1500px,160vw)] -translate-x-[18%] opacity-[0.08] md:top-[9%] md:w-[min(1400px,110vw)] md:translate-x-0"
        viewBox="0 0 1400 360"
        aria-hidden="true"
        focusable="false"
      >
        <text
          x="700"
          y="270"
          text-anchor="middle"
          direction="rtl"
          font-family="'Aref Ruqaa', serif"
          font-size="250"
          fill="#fff"
          stroke="#fff"
          stroke-width="1.6"
          :class="{ 'callig-draw': !reduced }"
        >{{ calligraphy }}</text>
      </svg>
    </div>

    <div class="wrap relative flex min-h-[620px] flex-col pb-[76px] pt-[112px] md:min-h-[min(100svh,860px)] md:pb-[112px] md:pt-[136px]">
      <div class="max-w-[46rem]">
        <ArabicEyebrow :ar="t('hero.eyebrowAr')" :label="t('hero.eyebrow')" tone="dark" />
        <h1 class="t-hero mt-5 text-white">
          <span class="sr-only">{{ t('hero.h1Full') }}</span>
          <span aria-hidden="true" class="block">
            {{ t('hero.h1a') }}
            <span
              class="hero-word inline-block italic"
              :class="rotating ? 'hero-word--plain' : { 'hero-word--glint': glint }"
              @mouseenter="replayGlint"
              @animationend="glint = false"
            ><span ref="wordEl" class="inline-block">{{ words[0] }}</span>{{ t('hero.comma') }}</span>
          </span>
          <span aria-hidden="true" class="block">{{ t('hero.h1b') }}</span>
        </h1>
        <p class="mt-5 max-w-[38rem] text-[1.0625rem] leading-relaxed text-on-dark/90 md:text-[1.1875rem]">{{ t('hero.sub') }}</p>
        <div class="mt-4 flex flex-wrap gap-x-6">
          <AppButton variant="link-dark" to="/packages" icon-end="ph:arrow-right-light">{{ t('hero.seePackages') }}</AppButton>
          <AppButton variant="link-dark" href="#how-it-works" icon-end="ph:arrow-down-light" :directional="false" class="hero-anchor">{{ t('hero.howItWorks') }}</AppButton>
        </div>
      </div>

      <div class="mt-8 md:mt-auto md:pt-10">
        <SearchPanel />
        <p class="mt-3 text-center text-[0.875rem] text-white/85 md:text-start">
          <i18n-t keypath="hero.notSure" scope="global">
            <template #link>
              <button type="button" class="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white" @click="openEnquiry({ type: 'general', title: '', details: {} }, { channel: 'whatsapp' })">
                {{ t('hero.notSureLink') }}
              </button>
            </template>
          </i18n-t>
        </p>
      </div>
    </div>

    <ArcadeEdge from="transparent" to="ihram" class="absolute! inset-x-0 bottom-0" :height="72" :mobile-height="40" />
  </section>
</template>

<style scoped>
.hero-overlay {
  background:
    linear-gradient(to top, rgba(11, 11, 12, .7) 0%, rgba(11, 11, 12, .38) 45%, rgba(11, 11, 12, .25) 100%),
    linear-gradient(to right, rgba(11, 11, 12, .45) 0%, rgba(11, 11, 12, 0) 60%);
}
[dir="rtl"] .hero-overlay {
  background:
    linear-gradient(to top, rgba(11, 11, 12, .7) 0%, rgba(11, 11, 12, .38) 45%, rgba(11, 11, 12, .25) 100%),
    linear-gradient(to left, rgba(11, 11, 12, .45) 0%, rgba(11, 11, 12, 0) 60%);
}

/* Motion #3 (hero): the calligraphy strokes draw, then the faint fill settles in. Pure CSS, so it runs on load. */
.callig-draw { stroke-dasharray: 2400; animation: callig-stroke 3.2s var(--ease) .2s both, callig-fill 1.2s var(--ease) 2.2s both; }
@keyframes callig-stroke { from { stroke-dashoffset: 2400; } to { stroke-dashoffset: 0; } }
@keyframes callig-fill { from { fill-opacity: 0; } to { fill-opacity: 1; } }

/* Motion #1: a gold-light glint sweeps across the word once on load, then on hover */
.hero-word {
  background-image: linear-gradient(105deg, #fff 0%, #fff 40%, var(--c-gold-light) 50%, #fff 60%, #fff 100%);
  background-size: 260% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding-inline-end: .06em;
}
.hero-word--plain { background: none; color: #fff; }
.hero-word--glint { animation: glint 1.2s var(--ease) .35s both; }
@keyframes glint {
  from { background-position: 100% 0; }
  to { background-position: 0% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-word--glint { animation: none; }
}
</style>
