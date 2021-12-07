import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetTicket = z.object({
  id: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetTicket), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const ticket = await db.ticket.findFirst({ where: { id } })

  if (!ticket) throw new NotFoundError()

  return ticket
})
