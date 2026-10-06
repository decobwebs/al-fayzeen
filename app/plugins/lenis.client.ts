/** Smooth scroll, loaded after first paint. Off when reduced motion is preferred. */
export default defineNuxtPlugin((nuxtApp) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  nuxtApp.hook('app:suspense:resolve', () => { whenEngaged().then(start) })

  async function start() {
    const { default: Lenis } = await import('lenis')
    // anchors: smooth in-page links (offset clears the fixed nav + sticky section chips)
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, syncTouch: false, anchors: { offset: -140 } })
    ;(window as Window & { __lenis?: unknown }).__lenis = lenis
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    // stop smooth scroll while a sheet/dialog locks the body
    const obs = new MutationObserver(() => {
      const locked = document.body.style.overflow === 'hidden' || document.body.hasAttribute('data-scroll-locked')
      if (locked) lenis.stop()
      else lenis.start()
    })
    obs.observe(document.body, { attributes: true, attributeFilter: ['style', 'data-scroll-locked'] })
  }
})
