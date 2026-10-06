const ngn = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })

export const formatNgn = (n: number) => ngn.format(Math.round(n))

/** Date locale follows the UI language (set by plugins/date-locale). Digits stay Latin in Arabic. */
export const dateLocale = ref('en-GB')

/** "14 Jan 2027" in English; Arabic month names with Latin digits in Arabic. */
export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`)
  return new Intl.DateTimeFormat(dateLocale.value, { ...opts, timeZone: 'UTC' }).format(d)
}
