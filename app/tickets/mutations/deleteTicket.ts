import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteTicket = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteTicket), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const ticket = await db.ticket.deleteMany({ where: { id } })

  return ticket
})
