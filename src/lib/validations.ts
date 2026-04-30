import { z } from 'zod'

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'validation.name.min' })
    .max(100, { message: 'validation.name.max' })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: 'validation.name.invalid' }),
  email: z
    .string()
    .email({ message: 'validation.email.invalid' }),
  phone: z
    .string()
    .min(7, { message: 'validation.phone.min' })
    .max(20, { message: 'validation.phone.max' })
    .regex(/^[+\d\s()-]+$/, { message: 'validation.phone.invalid' }),
  company: z
    .string()
    .max(150, { message: 'validation.company.max' })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, { message: 'validation.message.min' })
    .max(2000, { message: 'validation.message.max' }),
  consent: z
    .boolean()
    .refine((val) => val === true, { message: 'validation.consent.required' }),
  honeypot: z.string().max(0, { message: 'Bot detected' }).optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
