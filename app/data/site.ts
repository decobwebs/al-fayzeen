/**
 * Company facts. `null` means NOT CONFIRMED: render as a visible gap "[To be confirmed]".
 * Never replace a null with an invented value. Only the client can fill these.
 */
export const site = {
  name: 'Al Fayzeen',
  nameAr: 'الفائزين',
  tagline: 'Your Ibadah, our responsibility.',
  audience: 'Pilgrims from Nigeria',
  licence: {
    authority: 'Ministry of Hajj and Umrah, Kingdom of Saudi Arabia',
    number: null as string | null,
  },
  offices: {
    makkah: null as string | null,      // full address
    nigeria: null as string | null,     // remove the line in the UI if the client has no Nigerian office
  },
  contact: {
    whatsapp: null as string | null,    // international format without +, e.g. '9665XXXXXXXX'
    phone: null as string | null,
    email: null as string | null,
    hours: null as string | null,
    replyTimeMinutes: null as number | null,
  },
  languages: ['English', 'Arabic', 'Hausa'],  // Hausa support to be confirmed
  payments: ['Paystack', 'Flutterwave', 'Bank transfer'],
  policies: {
    depositPercent: null as number | null,
    balanceDueDaysBefore: null as number | null,
    cancellation: null as string | null,
    visaRefusal: null as string | null,
  },
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
    youtube: null as string | null,
  },
  departureCities: [
    { code: 'LOS', city: 'Lagos' },
    { code: 'ABV', city: 'Abuja' },
    { code: 'KAN', city: 'Kano' },
  ],
  arrivalCities: [
    { code: 'JED', city: 'Jeddah' },
    { code: 'MED', city: 'Madinah' },
  ],
} as const
