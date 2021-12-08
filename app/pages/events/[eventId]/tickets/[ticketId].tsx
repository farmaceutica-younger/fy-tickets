import { linkedin } from "app/api/linkedin"
import { Ticket as TicketCmp } from "app/tickets/components/ticket"
import { Head } from "blitz"
import db from "db"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import Tilt from "react-parallax-tilt"

const linkedInApi = {
  clientId: linkedin.clientID,
  redirectUrl: linkedin.callbackURL,
  oauthUrl: "https://www.linkedin.com/oauth/v2/authorization?response_type=code",
  scope: "r_liteprofile%20r_emailaddress",
}

export const ShowTicketPage = ({
  ticket,
  event,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const oauthUrl = `${linkedInApi.oauthUrl}&client_id=${linkedInApi.clientId}&scope=${linkedInApi.scope}&state=${event.id}&redirect_uri=${linkedInApi.redirectUrl}`
  return (
    <>
      <Head>
        <title>Ticket {ticket.name}</title>
        <meta property="og:title" content={`Ticket di ${ticket.name}`} />
        <meta
          property="og:image"
          content={`https://res.cloudinary.com/dbdvy5b2z/image/upload/w_1200,c_lpad/events/${event.id}/tickets/${ticket.id}.png`}
        />
        <meta
          property="og:description"
          content={`${ticket.name} parteciperà all'evento ${event.name} di Farmaceutica Younger`}
        />
      </Head>

      <div className="h-screen bg-gray-800 grid md:grid-rows-2 lg:grid-rows-1 lg:grid-cols-2">
        <div className="text-center grid content-center p-10">
          <h1 className="text-gray-100 text-2xl">Ticket di</h1>
          <h2 className="text-gray-100 text-3xl mt-3 font-bold"> {ticket.name}</h2>
          <a
            href={oauthUrl}
            className="max-w-md m-auto mt-10 py-4 px-6 text-white text-2xl  border-red-200 border-solid border-2 rounded-lg hover:bg-gray-200 hover:text-gray-800"
          >
            Crea il tuo con linkedin
          </a>
        </div>
        <div className="overflow-hidden grid place-content-center">
          <div className="">
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
              <TicketCmp event={event} ticket={ticket} />
            </Tilt>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShowTicketPage

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<{ ticketId: string; eventId: string }>
) => {
  const { ticketId, eventId } = ctx.params!
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      Ticket: {
        where: {
          id: ticketId,
        },
      },
    },
  })
  if (!event) {
    throw new Error()
  }
  const [ticket] = event.Ticket
  if (!ticket) {
    throw new Error()
  }
  return {
    props: { ticket, event },
  }
}
