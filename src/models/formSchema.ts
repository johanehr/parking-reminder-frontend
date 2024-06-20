import { z } from 'zod';

export const formSchema = z.object({
  email: z.string().email(),
  carNickname: z.string().min(1),
  acceptTerms: z.boolean(),
  notificationDate: z.string().refine((date) => {
    return !isNaN(Date.parse(date));
  }, {
    message: "Invalid date format",
  }),
});