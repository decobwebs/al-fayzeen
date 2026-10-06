/**
 * true when the visitor prefers reduced motion. Stays false until the component has mounted, so the
 * first client render matches the server HTML (no hydration mismatch). The CSS media query in
 * tokens.css already stops animations from the very first frame.
 */
export function useReducedMotion() {
  const pref = usePreferredReducedMotion()
  const mounted = shallowRef(false)
  if (getCurrentInstance()) onMounted(() => { mounted.value = true })
  return computed(() => mounted.value && pref.value === 'reduce')
}
