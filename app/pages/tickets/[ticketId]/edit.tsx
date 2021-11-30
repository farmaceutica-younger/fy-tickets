import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTicket from "app/tickets/queries/getTicket"
import updateTicket from "app/tickets/mutations/updateTicket"
import { TicketForm, FORM_ERROR } from "app/tickets/components/TicketForm"

export const EditTicket = () => {
  const router = useRouter()
  const ticketId = useParam("ticketId", "number")
  const [ticket, { setQueryData }] = useQuery(
    getTicket,
    { id: ticketId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateTicketMutation] = useMutation(updateTicket)

  return (
    <>
      <Head>
        <title>Edit Ticket {ticket.id}</title>
      </Head>

      <div>
        <h1>Edit Ticket {ticket.id}</h1>
        <pre>{JSON.stringify(ticket, null, 2)}</pre>

        <TicketForm
          submitText="Update Ticket"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateTicket}
          initialValues={ticket}
          onSubmit={async (values) => {
            try {
              const updated = await updateTicketMutation({
                id: ticket.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowTicketPage({ ticketId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditTicketPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditTicket />
      </Suspense>

      <p>
        <Link href={Routes.TicketsPage()}>
          <a>Tickets</a>
        </Link>
      </p>
    </div>
  )
}

EditTicketPage.authenticate = true
EditTicketPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditTicketPage
