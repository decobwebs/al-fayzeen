import { site } from '~/data/site'
import type { EnquiryPayload } from './useEnquiry'

/** Builds the structured WhatsApp message and wa.me link. The number comes only from site.ts. */
export function useWhatsAppLink() {
  const number = site.contact.whatsapp
  const available = computed(() => !!number)

  function message(p?: Partial<EnquiryPayload> | null): string {
    if (p?.message) return p.message
    const lines = ['Assalamu alaikum Al Fayzeen.']
    if (p?.title) lines.push(`I'm interested in: ${p.title}.`)
    else lines.push('I would like help planning my Umrah.')
    for (const [k, v] of Object.entries(p?.details ?? {})) {
      if (v !== undefined && v !== null && `${v}`.trim() !== '') lines.push(`${k}: ${v}.`)
    }
    if (p?.ref) lines.push(`Ref: ${p.ref}`)
    return lines.join('\n')
  }

  function href(p?: Partial<EnquiryPayload> | null): string | null {
    if (!number) return null
    return `https://wa.me/${number}?text=${encodeURIComponent(message(p))}`
  }

  return { number, available, message, href }
}
