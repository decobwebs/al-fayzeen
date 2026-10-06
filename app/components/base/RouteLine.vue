<script setup lang="ts">
/**
 * Motion #5: a route that draws itself, with a dot travelling along it (DrawSVG + MotionPath).
 * Points: tone 'makkah' → Kiswa, 'madinah' → Nabawi green, otherwise a hollow ring.
 * Static (fully drawn) on SSR, without JS and with reduced motion.
 */
const props = withDefaults(defineProps<{
  points: { code: string, label: string, tone?: 'makkah' | 'madinah' | 'plain' }[]
  label: string
  trigger?: 'scroll' | 'load'
  compact?: boolean
  tone?: 'light' | 'dark'
}>(), { trigger: 'scroll', tone: 'light' })

const { locale } = useI18n()
const rtl = computed(() => locale.value === 'ar')
const W = 1000
const H = props.compact ? 60 : 120
const pad = 40
// in Arabic the route reads right to left: the first point sits on the right
const xs = computed(() => props.points.map((_, i) => {
  const x = pad + (i * (W - pad * 2)) / Math.max(1, props.points.length - 1)
  return rtl.value ? W - x : x
}))
const ys = computed(() => props.points.map((_, i) => (props.compact ? 30 : (i % 2 === 0 ? 76 : 44))))
const d = computed(() => {
  let s = `M${xs.value[0]} ${ys.value[0]}`
  for (let i = 1; i < xs.value.length; i++) {
    const mx = (xs.value[i - 1]! + xs.value[i]!) / 2
    const my = props.compact ? ys.value[i]! - 22 : (i % 2 === 1 ? 8 : 112)
    s += ` Q${mx} ${my} ${xs.value[i]} ${ys.value[i]}`
  }
  return s
})

const root = ref<HTMLElement | null>(null)
useGsap(root, ({ gsap }) => {
  const path = root.value!.querySelector('.route-path')
  const dot = root.value!.querySelector('.route-dot')
  const pts = root.value!.querySelectorAll('.route-point')
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power2.inOut' },
  })
  tl.from(path, { drawSVG: '0%', duration: 1.8 }, 0)
    .from(pts, { scale: 0, transformOrigin: '50% 50%', stagger: 1.8 / pts.length, duration: 0.4, ease: 'back.out(2)' }, 0)
    .fromTo(dot, { opacity: 0 }, { opacity: 1, motionPath: { path: path as SVGPathElement, align: path as SVGPathElement, alignOrigin: [0.5, 0.5] }, duration: 1.8 }, 0)
    .to(dot, { opacity: 0, duration: 0.3 })
  if (props.trigger === 'load') {
    tl.play()
    return
  }
  // plays once when 30% visible (an observer is more robust than ScrollTrigger next to pinned sections)
  const io = new IntersectionObserver((entries) => {
    if (entries.some(e => e.isIntersecting)) {
      tl.play()
      io.disconnect()
    }
  }, { threshold: 0.3 })
  io.observe(root.value!)
  return () => io.disconnect()
})
</script>

<template>
  <figure ref="root" class="route-line relative w-full" :aria-label="label" dir="ltr">
    <svg :viewBox="`0 0 ${W} ${H}`" class="block w-full overflow-visible" aria-hidden="true" focusable="false">
      <path :d="d" fill="none" :stroke="tone === 'dark' ? 'rgba(255,255,255,.25)' : 'var(--c-line)'" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round" vector-effect="non-scaling-stroke" />
      <path class="route-path" :d="d" fill="none" :stroke="tone === 'dark' ? 'var(--c-on-dark)' : 'var(--c-kiswa)'" stroke-width="1.5" vector-effect="non-scaling-stroke" />
      <g v-for="(p, i) in points" :key="p.code" class="route-point">
        <circle
          :cx="xs[i]"
          :cy="ys[i]"
          :r="compact ? 5 : 7"
          :fill="p.tone === 'makkah' ? (tone === 'dark' ? 'var(--c-on-dark)' : 'var(--c-kiswa)') : p.tone === 'madinah' ? 'var(--c-nabawi)' : (tone === 'dark' ? 'var(--c-kiswa)' : 'var(--c-ihram)')"
          :stroke="p.tone === 'madinah' ? 'var(--c-nabawi)' : (tone === 'dark' ? 'var(--c-on-dark)' : 'var(--c-kiswa)')"
          stroke-width="1.5"
          vector-effect="non-scaling-stroke"
        />
      </g>
      <circle class="route-dot" r="5" :fill="tone === 'dark' ? 'var(--c-gold-light)' : 'var(--c-gold)'" opacity="0" />
    </svg>
    <figcaption class="relative mt-2 h-10" :class="compact && 'h-6'">
      <span
        v-for="(p, i) in points"
        :key="p.code"
        class="absolute top-0 flex -translate-x-1/2 flex-col items-center whitespace-nowrap text-center"
        :style="{ left: `${(xs[i]! / W) * 100}%` }"
      >
        <span class="text-[0.8125rem] font-semibold" :class="[p.tone === 'madinah' ? 'text-nabawi' : (tone === 'dark' ? 'text-on-dark' : 'text-kiswa')]">{{ p.label }}</span>
        <span v-if="!compact" class="text-[0.6875rem] tracking-[0.12em] text-stone">{{ p.code }}</span>
      </span>
    </figcaption>
  </figure>
</template>
