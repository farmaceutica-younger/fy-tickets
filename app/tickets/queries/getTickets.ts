import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetTicketsInput
  extends Pick<Prisma.TicketFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetTicketsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: tickets,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.ticket.count({ where }),
      query: (paginateArgs) => db.ticket.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      tickets,
      nextPage,
      hasMore,
      count,
    }
  }
)
