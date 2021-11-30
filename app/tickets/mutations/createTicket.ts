import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateTicket = z.object({
  name: z.string(),
  role: z.string(),
  image: z.string(),
  ticketNum: z.string(),
})

export default resolver.pipe(resolver.zod(CreateTicket), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const ticket = await db.ticket.create({ data: input })

  return ticket
})
