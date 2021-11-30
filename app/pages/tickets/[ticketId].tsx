import { Suspense, useEffect, useState } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTicket from "app/tickets/queries/getTicket"
import renderTicket from "app/tickets/mutations/renderImage"
import deleteTicket from "app/tickets/mutations/deleteTicket"
import { Ticket as TicketCmp } from "app/tickets/components/ticket"

export const Ticket = () => {
  const router = useRouter()
  const ticketId = useParam("ticketId", "number")
  const [deleteTicketMutation] = useMutation(deleteTicket)
  const [renderedTicket] = useMutation(renderTicket)
  const [ticket] = useQuery(getTicket, { id: ticketId })

  const [image, setImage] = useState("")
  useEffect(() => {
    renderedTicket({ id: ticketId! }).then((res) => setImage(res))
  }, [renderedTicket, ticketId])

  return (
    <>
      <Head>
        <title>Ticket {ticket.name}</title>
      </Head>

      <div>
        <h1>Ticket {ticket.name}</h1>
        <TicketCmp
          ticketNum={ticket.ticketNum}
          user={{
            name: ticket.name,
            role: ticket.role,
            src: ticket.image,
          }}
        />
        <pre>{JSON.stringify(ticket, null, 2)}</pre>
        <img src={`data:image/png;base64,${image}`} alt="" />

        <Link href={Routes.EditTicketPage({ ticketId: ticket.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteTicketMutation({ id: ticket.id })
              router.push(Routes.TicketsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowTicketPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.TicketsPage()}>
          <a>Tickets</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Ticket />
      </Suspense>
    </div>
  )
}

ShowTicketPage.authenticate = true
ShowTicketPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowTicketPage
