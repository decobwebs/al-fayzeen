export type EnquiryType = 'general' | 'package' | 'flight' | 'hotel' | 'transport' | 'visa' | 'guide'
export type EnquiryChannel = 'whatsapp' | 'email'

export interface EnquiryPayload {
  type: EnquiryType
  title: string
  /** Ordered label → value pairs shown in the summary and in the WhatsApp message */
  details: Record<string, string | number | undefined>
  ref?: string
  /** Overrides the generated WhatsApp message entirely */
  message?: string
}

interface EnquiryState {
  open: boolean
  channel: EnquiryChannel | null
  payload: EnquiryPayload
}

const general = (): EnquiryPayload => ({ type: 'general', title: '', details: {} })

/** Global enquiry sheet. Any card can call open({ type, title, details, ref }). */
export function useEnquiry() {
  const state = useState<EnquiryState>('enquiry', () => ({ open: false, channel: null, payload: general() }))

  function open(payload?: Partial<EnquiryPayload>, opts: { channel?: EnquiryChannel } = {}) {
    state.value = {
      open: true,
      channel: opts.channel ?? null,
      payload: { ...general(), ...payload, details: { ...(payload?.details ?? {}) } },
    }
  }

  function close() {
    state.value = { ...state.value, open: false }
  }

  return { state, open, close }
}
