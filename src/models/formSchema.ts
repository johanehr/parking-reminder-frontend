import { z } from 'zod'

export const formSchema = z.object({
  phone: z.string().min(12).max(12),
  carNickname: z.string().min(1, { message: "Car Nickname is required" }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Please accept the terms to continue with setting a notification",
  }),
  notificationDate: z.string().refine((date) => {
    return !isNaN(Date.parse(date))
  }, {
    message: "Invalid date format",
  }),
})
