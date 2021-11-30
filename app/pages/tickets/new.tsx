import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createTicket from "app/tickets/mutations/createTicket"
import { TicketForm, FORM_ERROR } from "app/tickets/components/TicketForm"

const NewTicketPage: BlitzPage = () => {
  const router = useRouter()
  const [createTicketMutation] = useMutation(createTicket)

  return (
    <div>
      <h1>Create New Ticket</h1>

      <TicketForm
        submitText="Create Ticket"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateTicket}
        // initialValues={{}}
        onSubmit={async (values) => {
          console.log(values)
          try {
            const ticket = await createTicketMutation(values)
            router.push(Routes.ShowTicketPage({ ticketId: ticket.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.TicketsPage()}>
          <a>Tickets</a>
        </Link>
      </p>
    </div>
  )
}

NewTicketPage.authenticate = true
NewTicketPage.getLayout = (page) => <Layout title={"Create New Ticket"}>{page}</Layout>

export default NewTicketPage
