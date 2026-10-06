<script setup lang="ts">
/**
 * Motion #7: an Arabic term cross-fades (with blur) into its English title, e.g. عمرة → Umrah.
 * Rests on the English (readable) state. When it scrolls into view the Arabic shows first and morphs;
 * hovering or focusing the parent (.group) shows the Arabic again.
 */
const props = withDefaults(defineProps<{ ar: string, en: string, delay?: number, as?: string }>(), { delay: 0, as: 'span' })
const el = ref<HTMLElement | null>(null)
const reduced = useReducedMotion()
const showAr = ref(false)
let io: IntersectionObserver | null = null
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  if (reduced.value) return
  const r = el.value!.getBoundingClientRect()
  if (r.top < innerHeight && r.bottom > 0) return
  showAr.value = true
  io = new IntersectionObserver((e) => {
    if (e.some(x => x.isIntersecting)) {
      timer = setTimeout(() => { showAr.value = false }, 900 + props.delay)
      io?.disconnect()
    }
  }, { threshold: 0.8 })
  io.observe(el.value!)
})
onBeforeUnmount(() => { io?.disconnect(); clearTimeout(timer) })
</script>

<template>
  <component :is="as" ref="el" class="morph relative inline-grid" :class="{ 'morph--ar': showAr }">
    <span class="morph-en col-start-1 row-start-1">{{ en }}</span>
    <span class="morph-ar col-start-1 row-start-1 font-ar-display" lang="ar" dir="rtl" aria-hidden="true">{{ ar }}</span>
  </component>
</template>

<style scoped>
.morph-en, .morph-ar { transition: opacity 700ms var(--ease), filter 700ms var(--ease); }
.morph-ar { opacity: 0; filter: blur(8px); justify-self: start; }
.morph--ar .morph-ar { opacity: 1; filter: blur(0); }
.morph--ar .morph-en { opacity: 0; filter: blur(8px); }
@media (prefers-reduced-motion: reduce) {
  .morph-en, .morph-ar { transition: none; }
}
</style>

<!-- Unscoped on purpose: Vue's :global(.a) .b compiles to just .a, which hid every hovered .group on the page. -->
<style>
.group:focus-within .morph .morph-ar { opacity: 1; filter: blur(0); }
.group:hover .morph .morph-en, .group:focus-within .morph .morph-en { opacity: 0; filter: blur(8px); }
.group:hover .morph .morph-ar { opacity: 1; filter: blur(0); }
</style>
