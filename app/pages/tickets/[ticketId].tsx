import styled from "@emotion/styled"
import { Ticket as TicketCmp } from "app/tickets/components/ticket"
import { Head } from "blitz"
import db from "db"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import Tilt from "react-parallax-tilt"
import { linkedin } from "app/api/linkedin"

const linkedInApi = {
  clientId: linkedin.clientID,
  redirectUrl: linkedin.callbackURL,
  oauthUrl: "https://www.linkedin.com/oauth/v2/authorization?response_type=code",
  scope: "r_liteprofile%20r_emailaddress",
  state: "123456",
}

const oauthUrl = `${linkedInApi.oauthUrl}&client_id=${linkedInApi.clientId}&scope=${linkedInApi.scope}&state=${linkedInApi.state}&redirect_uri=${linkedInApi.redirectUrl}`

export const ShowTicketPage = ({
  ticket,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Ticket {ticket.name}</title>
      </Head>

      <div className="h-screen bg-gray-800 grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2">
        <div className="text-center grid content-center p-10">
          <h1 className="text-gray-100 text-5xl">Ticket di {ticket.name}</h1>
          <a href={oauthUrl} className="text-white text-2xl underline">
            {" "}
            Crea il tuo con linkedin
          </a>
        </div>
        <div className="overflow-hidden grid content-center">
          <div className="scale-75">
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
              <TicketCmp
                ticketNum={ticket.id}
                user={{
                  name: ticket.name,
                  role: ticket.role,
                  src: ticket.avatar,
                }}
              />
            </Tilt>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShowTicketPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = Number((ctx.params as any).ticketId)
  const ticket = await db.ticket.findUnique({ where: { id } })
  if (!ticket) {
    throw new Error()
  }
  console.log(ticket)
  return {
    props: { ticket },
  }
}
