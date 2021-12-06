import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTickets from "app/tickets/queries/getTickets"

const ITEMS_PER_PAGE = 100

export const TicketsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ tickets, hasMore }] = usePaginatedQuery(getTickets, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <Link href={Routes.ShowTicketPage({ ticketId: ticket.id })}>
              <a>{ticket.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const TicketsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Tickets</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <TicketsList />
        </Suspense>
      </div>
    </>
  )
}

TicketsPage.authenticate = false
TicketsPage.getLayout = (page) => <Layout>{page}</Layout>

export default TicketsPage
