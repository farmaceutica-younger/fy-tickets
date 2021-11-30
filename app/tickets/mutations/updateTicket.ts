import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateTicket = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  image: z.string(),
  ticketNum: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateTicket),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const ticket = await db.ticket.update({ where: { id }, data })

    return ticket
  }
)
