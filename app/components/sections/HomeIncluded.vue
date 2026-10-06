<script setup lang="ts">
const { t, tm, rt } = useI18n()
const icons = [
  'ph:stamp-duotone', 'ph:airplane-tilt-duotone', 'ph:buildings-duotone', 'ph:mosque-duotone',
  'ph:van-duotone', 'ph:train-duotone', 'ph:compass-duotone', 'ph:map-pin-line-duotone',
  'ph:drop-duotone', 'ph:sim-card-duotone', 'ph:presentation-chart-duotone', 'ph:headset-duotone',
]
// trailing gaps for items the client must confirm
const gaps: Record<number, string> = { 8: 'included.confirm', 9: 'included.confirm', 10: 'included.confirmCity' }
const items = computed(() => (tm('included.items') as unknown[]).map((x, i) => ({ label: rt(x as Parameters<typeof rt>[0]), icon: icons[i]!, gap: gaps[i] })))

/* Icons draw in (a clip reveal), staggered, when the grid enters the viewport. Visible by default. */
const grid = ref<HTMLElement | null>(null)
const reduced = useReducedMotion()
const armed = ref(false)
const revealed = ref(false)
let io: IntersectionObserver | null = null
onMounted(() => {
  if (reduced.value) return
  const r = grid.value!.getBoundingClientRect()
  if (r.top < innerHeight) return // already on screen: leave it as is
  armed.value = true
  io = new IntersectionObserver((e) => {
    if (e.some(x => x.isIntersecting)) {
      revealed.value = true
      io?.disconnect()
    }
  }, { threshold: 0.25 })
  io.observe(grid.value!)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <section class="section-y bg-ihram" aria-labelledby="included-h">
    <div class="wrap">
      <SectionHeading id="included-h" :ar="t('included.eyebrowAr')" :eyebrow="t('included.eyebrow')" :title="t('included.h2')" />
      <ul ref="grid" class="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line md:mt-14 md:grid-cols-3 lg:grid-cols-4" :class="{ 'inc-armed': armed, 'inc-in': revealed }">
        <li v-for="(it, i) in items" :key="i" class="flex min-h-[132px] flex-col gap-4 bg-ihram p-5 md:min-h-[150px] md:p-6">
          <Icon :name="it.icon" class="inc-icon text-[2rem]" :style="{ transitionDelay: `${i * 60}ms` }" aria-hidden="true" />
          <p class="mt-auto text-[0.9375rem] font-medium leading-snug">
            {{ it.label }}
            <GapText v-if="it.gap" :text="t(it.gap)" class="text-[0.8125rem] font-normal" />
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.inc-icon { transition: clip-path 700ms var(--ease), opacity 700ms var(--ease), transform 700ms var(--ease); }
.inc-armed .inc-icon { clip-path: inset(0 100% 0 0); opacity: .2; transform: translateY(4px); }
[dir="rtl"] .inc-armed .inc-icon { clip-path: inset(0 0 0 100%); }
.inc-armed.inc-in .inc-icon { clip-path: inset(0 0 0 0); opacity: 1; transform: none; }
</style>
