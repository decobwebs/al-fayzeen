/** Icons for package inclusions. Order = display priority on cards. */
export const includedIcons: [match: RegExp, icon: string][] = [
  [/visa/i, 'ph:stamp-light'],
  [/flight/i, 'ph:airplane-tilt-light'],
  [/hotel in makkah/i, 'ph:buildings-light'],
  [/haramain train/i, 'ph:train-light'],
  [/transfer/i, 'ph:van-light'],
  [/hotel in madinah/i, 'ph:mosque-light'],
  [/guided umrah/i, 'ph:compass-light'],
  [/coordinator/i, 'ph:headset-light'],
  [/ziyarat/i, 'ph:map-pin-line-light'],
  [/haram-view/i, 'ph:frame-corners-light'],
  [/breakfast|dinner|suhoor|iftar|meals/i, 'ph:bowl-food-light'],
]

export function iconFor(item: string): string {
  return includedIcons.find(([re]) => re.test(item))?.[1] ?? 'ph:check-light'
}

/** Up to `n` included items, sorted by the priority above */
export function topIncluded(items: string[], n = 5) {
  const rank = (s: string) => {
    const i = includedIcons.findIndex(([re]) => re.test(s))
    return i === -1 ? 99 : i
  }
  return [...items].sort((a, b) => rank(a) - rank(b)).slice(0, n).map(label => ({ label, icon: iconFor(label) }))
}
