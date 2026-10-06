import type { gsap as GsapType } from 'gsap'

type Gsap = typeof GsapType

export interface GsapBundle {
  gsap: Gsap
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
  SplitText: typeof import('gsap/SplitText').SplitText
  DrawSVGPlugin: typeof import('gsap/DrawSVGPlugin').DrawSVGPlugin
  MotionPathPlugin: typeof import('gsap/MotionPathPlugin').MotionPathPlugin
}

let bundle: Promise<GsapBundle> | null = null

/** Loads GSAP and its plugins once, on the client, after first paint. */
export function loadGsap(): Promise<GsapBundle> {
  if (import.meta.server) return Promise.reject(new Error('GSAP is client-only'))
  bundle ??= Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/SplitText'),
    import('gsap/DrawSVGPlugin'),
    import('gsap/MotionPathPlugin'),
  ]).then(([g, st, s, d, m]) => {
    const gsap = g.gsap
    gsap.registerPlugin(st.ScrollTrigger, s.SplitText, d.DrawSVGPlugin, m.MotionPathPlugin)
    gsap.defaults({ ease: 'power3.out' })
    connectLenis(st.ScrollTrigger)
    return { gsap, ScrollTrigger: st.ScrollTrigger, SplitText: s.SplitText, DrawSVGPlugin: d.DrawSVGPlugin, MotionPathPlugin: m.MotionPathPlugin }
  })
  return bundle
}

function connectLenis(ScrollTrigger: GsapBundle['ScrollTrigger']) {
  const lenis = (window as Window & { __lenis?: { on: (e: string, cb: () => void) => void } }).__lenis
  lenis?.on('scroll', () => ScrollTrigger.update())
}

/**
 * Runs `setup` inside a gsap.context scoped to `scope` once the component is mounted and GSAP has loaded.
 * Everything created inside is reverted on unmount. Skipped entirely when reduced motion is preferred,
 * so text stays in its final, readable state.
 */
export function useGsap(
  scope: Ref<HTMLElement | null | undefined> | (() => HTMLElement | null | undefined),
  /** may return a cleanup function */
  setup: (b: GsapBundle) => unknown,
  opts: { respectReducedMotion?: boolean } = {},
) {
  const reduced = useReducedMotion()
  let ctx: ReturnType<Gsap['context']> | null = null
  let cleanup: unknown
  let alive = true

  onMounted(async () => {
    if ((opts.respectReducedMotion ?? true) && reduced.value) return
    // wait for engagement (first interaction or 5 s) so GSAP never competes with first paint
    await whenEngaged()
    const b = await loadGsap()
    if (!alive) return
    const el = typeof scope === 'function' ? scope() : scope.value
    if (!el) return
    ctx = b.gsap.context(() => { cleanup = setup(b) }, el)
  })

  onBeforeUnmount(() => {
    alive = false
    if (typeof cleanup === 'function') (cleanup as () => void)()
    ctx?.revert()
  })
}
