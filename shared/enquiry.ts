import { z } from 'zod'

export const contactTimes = ['morning', 'afternoon', 'evening', 'any'] as const
export const dialCodes = ['+234', '+966', '+44', '+1'] as const

export const enquirySchema = z.object({
  name: z.string().trim().min(2, 'name_min').max(80, 'name_max'),
  dialCode: z.enum(dialCodes),
  phone: z.string().trim().regex(/^[0-9 ()-]{7,15}$/, 'phone_invalid'),
  email: z.string().trim().email('email_invalid'),
  contactTime: z.enum(contactTimes),
  notes: z.string().trim().max(1000, 'notes_max').optional().default(''),
  enquiry: z.object({
    type: z.string().max(20),
    title: z.string().max(200),
    details: z.record(z.string(), z.union([z.string(), z.number()]).optional()),
    ref: z.string().max(60).optional(),
  }),
})

export type EnquiryInput = z.input<typeof enquirySchema>
