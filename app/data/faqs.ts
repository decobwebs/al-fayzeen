/** FAQs. answer: null → render "[Answer from Al Fayzeen]". Policy and legal answers must come from the client. */
export const faqs: { q: string; a: string | null; topic: 'booking' | 'visa' | 'travel' }[] = [
  { topic: 'visa', q: 'How long does the Umrah visa take?', a: null },
  { topic: 'booking', q: 'Can I pay in instalments?', a: null },
  { topic: 'travel', q: 'Can women travel without a mahram?', a: null },
  { topic: 'travel', q: 'Can I bring children?', a: null },
  { topic: 'visa', q: 'What happens if my visa is refused?', a: null },
  { topic: 'booking', q: 'Are flights included?', a: 'Most packages include return flights from Lagos, Abuja or Kano. Each package shows whether flights are included.' },
  { topic: 'travel', q: 'Which Nigerian airports do you fly from?', a: 'Lagos, Abuja and Kano, depending on the package and date.' },
  { topic: 'travel', q: 'What should I bring?', a: 'See our packing list in the Umrah guide. Your coordinator also sends a checklist before you travel.' },
]
