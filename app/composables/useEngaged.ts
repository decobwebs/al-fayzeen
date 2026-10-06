let engaged: Promise<void> | null = null

/**
 * Resolves on the visitor's first interaction (scroll, pointer, touch, key) or 5 s after load.
 * Motion libraries and the hero video wait for this, so they never compete with first paint
 * and hydration on mid-range phones. Content is already in its final, readable state before.
 */
export function whenEngaged(): Promise<void> {
  if (import.meta.server) return new Promise(() => {})
  engaged ??= new Promise<void>((resolve) => {
    const events = ['pointerdown', 'pointermove', 'touchstart', 'wheel', 'scroll', 'keydown'] as const
    let timer: ReturnType<typeof setTimeout> | undefined
    const done = () => {
      clearTimeout(timer)
      events.forEach(e => window.removeEventListener(e, done))
      resolve()
    }
    events.forEach(e => window.addEventListener(e, done, { once: true, passive: true }))
    const arm = () => { timer = setTimeout(done, 5000) }
    if (document.readyState === 'complete') arm()
    else window.addEventListener('load', arm, { once: true })
  })
  return engaged
}
