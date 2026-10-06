/**
 * Translates English strings that come from app/data/*.ts (package names, inclusions, itinerary…).
 * Arabic lives in ar.json under "data", keyed by the exact English text. Missing keys fall back to English.
 * Messages are resolved with rt() so server and client render the same string (no hydration mismatch).
 */
export function useDataText() {
  const { locale, tm, rt } = useI18n()
  const dict = computed(() => {
    if (locale.value === 'en') return null
    const d = tm('data')
    return d && typeof d === 'object' ? (d as Record<string, unknown>) : null
  })
  return (s: string) => {
    const m = dict.value?.[s]
    return m === undefined ? s : rt(m as Parameters<typeof rt>[0])
  }
}
