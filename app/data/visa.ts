/** Umrah e-Visa content. `confirmed: false` items render as visible gaps. Requirements change; the client must confirm every line. */
export const visa = {
  processingDays: null as number | null,
  visaOnlyOffered: null as boolean | null,
  requirements: [
    { label: 'Passport valid for at least 6 months from your travel date', confirmed: true },
    { label: 'Recent passport photo on a white background', confirmed: true },
    { label: '[Vaccination requirements]', confirmed: false },
    { label: '[Other documents for Nigerian passport holders]', confirmed: false },
  ],
  steps: [
    { title: 'Send your documents', text: 'Upload them or send them on WhatsApp.' },
    { title: 'We review', text: 'We check everything before submission.' },
    { title: 'We submit', text: 'Through our licensed company account.' },
    { title: 'You receive your e-visa', text: 'Sent to you by WhatsApp and email.' },
  ],
}
