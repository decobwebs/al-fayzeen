import type { WatchSource } from 'vue'

/**
 * Positions an absolutely placed indicator under the active item of a row (tabs, chips) and lets CSS
 * transitions slide it. Lighter than motion-v layout projection, which kept the home page over its JS budget.
 */
export function useSlidingIndicator(container: Ref<HTMLElement | null>, activeSelector: string, watchSource: WatchSource) {
  const style = ref<Record<string, string>>({ opacity: '0' })
  const ready = ref(false)

  function measure() {
    const c = container.value
    const el = c?.querySelector<HTMLElement>(activeSelector)
    if (!c || !el) return
    style.value = {
      width: `${el.offsetWidth}px`,
      height: `${el.offsetHeight}px`,
      transform: `translate(${el.offsetLeft}px, ${el.offsetTop}px)`,
      opacity: '1',
    }
  }

  onMounted(() => {
    measure()
    requestAnimationFrame(() => { ready.value = true })
    useResizeObserver(container, measure)
    document.fonts?.ready.then(measure)
  })
  watch(watchSource, () => nextTick(measure))

  return { style, ready }
}
