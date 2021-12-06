import { z } from "zod"

export const CreateTicketFormValidation = z.object({
  name: z.string(),
  role: z.string(),
  image: z.any(),
  ticketNum: z.string(),
})
