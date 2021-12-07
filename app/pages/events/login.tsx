import { linkedin as linkedinConf } from "app/api/linkedin"
import { renderTicketImage } from "app/tickets/helpers/render"
import db, { Event, Ticket } from "db"
import { GetServerSidePropsContext } from "next"
import { NotFoundError } from "next/stdlib"

export default function Login() {
  return (
    <div>
      <h3>logged</h3>
    </div>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const code = ctx.query.code as string
  const eventId = ctx.query.state as string
  const event = await db.event.findUnique({ where: { id: eventId } })
  if (!event) {
    throw new NotFoundError("Event not found")
  }
  const ticket = await getOrCreateTicket(code, event)
  return {
    redirect: {
      destination: `/events/${eventId}/tickets/${ticket.id}`,
      permanent: false,
    },
  }
}

async function getOrCreateTicket(code: string, event: Event) {
  const accessToken = await getAccessToken(code)
  const profile = await getUserProfile(accessToken)
  const email = await getUserEmail(accessToken)
  const total = await db.ticket.count({ where: { eventId: event.id } })
  const ticket = await db.ticket.upsert({
    create: {
      avatar: profile.profileImageURL,
      email: email,
      name: `${profile.firstName} ${profile.lastName}`,
      role: "",
      ticketNum: total + 1,
      eventId: event.id,
    },
    update: {
      avatar: profile.profileImageURL,
      name: `${profile.firstName} ${profile.lastName}`,
    },
    where: {
      email: email,
    },
  })
  if (!ticket.ticketImage) {
    await createImage(ticket, event)
  }
  return ticket
}

async function createImage(ticket: Ticket, event: Event) {
  const res = await renderTicketImage(ticket, event)
  await db.ticket.update({
    where: { id: ticket.id },
    data: {
      ticketImage: res,
    },
  })
}

async function getAccessToken(code: string) {
  const query = qs({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: linkedinConf.callbackURL,
    client_id: linkedinConf.clientID,
    client_secret: linkedinConf.clientSecret,
  })

  const urlToGetLinkedInAccessToken = "https://www.linkedin.com/oauth/v2/accessToken"
  const res = await fetch(urlToGetLinkedInAccessToken + `?${query}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then((r) => r.json())
  return res.access_token as string
}

async function getUserProfile(accessToken: string) {
  const urlToGetUserProfile =
    "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedSummary,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))"

  const res = await fetch(urlToGetUserProfile, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((r) => r.json())
  const id = res.id as string
  const firstName = res.localizedFirstName as string
  const lastName = res.localizedLastName as string
  const profileImageURL = res["profilePicture"]["displayImage~"]?.elements[0].identifiers[0]
    .identifier as string

  return { firstName, lastName, profileImageURL, id }
}

async function getUserEmail(accessToken: string) {
  const urlToGetUserEmail =
    "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))"

  const res = await fetch(urlToGetUserEmail, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((r) => r.json())

  return res.elements[0]["handle~"].emailAddress as string
}

const qs = (params: { [k: string]: string }) => {
  let res = ""
  for (let k in params) {
    res = res + `&${k}=${params[k]}`
  }
  return res
}
