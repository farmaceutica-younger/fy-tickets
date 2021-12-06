import { Ticket } from "app/tickets/components/ticket"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { linkedin as linkedinConf } from "app/api/linkedin"
import db from "db"

export default function Login({ ticket }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h3>logged</h3>
      <pre>{JSON.stringify(ticket, null, 2)}</pre>
      <Ticket
        ticketNum={ticket.id}
        user={{
          name: ticket.name,
          src: ticket.avatar,
          role: ticket.role,
        }}
      />
    </div>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const code = ctx.query.code as string
  const accessToken = await getAccessToken(code)
  const profile = await getUserProfile(accessToken)
  const email = await getUserEmail(accessToken)
  const ticket = await db.ticket.upsert({
    create: {
      avatar: profile.profileImageURL,
      email: email,
      name: `${profile.firstName} ${profile.lastName}`,
      role: "",
      ticketNum: "000000000",
    },
    update: {
      avatar: profile.profileImageURL,
      name: `${profile.firstName} ${profile.lastName}`,
    },
    where: {
      email: email,
    },
  })
  return {
    redirect: {
      destination: "./" + ticket.id,
      permanent: false,
    },
  }
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
  return res.access_token
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
  console.log(res)
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
