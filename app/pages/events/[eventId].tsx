import db from "db"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"

export default function EventPage({ event }) {
  return (
    <div>
      <h3>{event.name}</h3>
    </div>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = String((ctx.params as any).eventId)
  const event = await db.event.findUnique({ where: { id } })
  if (!event) {
    throw new Error()
  }
  return {
    props: { event },
  }
}
