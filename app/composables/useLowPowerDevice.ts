interface NetworkInformationLike { saveData?: boolean }

/**
 * Low-power heuristics from CLAUDE.md §6: hardwareConcurrency <= 4, or Save-Data on.
 * Values settle after mount; the server always assumes a capable device.
 */
export function useLowPowerDevice() {
  const lowPower = useState('low-power', () => false)
  const saveData = useState('save-data', () => false)

  onMounted(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection
    saveData.value = !!conn?.saveData
    const cores = navigator.hardwareConcurrency ?? 8
    lowPower.value = saveData.value || cores <= 4
  })

  return { lowPower, saveData }
}
