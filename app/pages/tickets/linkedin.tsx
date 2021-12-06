import { linkedin } from "app/api/linkedin"

const linkedInApi = {
  clientId: linkedin.clientID,
  redirectUrl: linkedin.callbackURL,
  oauthUrl: "https://www.linkedin.com/oauth/v2/authorization?response_type=code",
  scope: "r_liteprofile%20r_emailaddress",
  state: "123456",
}

export const LinkedinPage = () => {
  const oauthUrl = `${linkedInApi.oauthUrl}&client_id=${linkedInApi.clientId}&scope=${linkedInApi.scope}&state=${linkedInApi.state}&redirect_uri=${linkedInApi.redirectUrl}`

  return (
    <div>
      <a href={oauthUrl}>Login With Linkedin</a>
    </div>
  )
}

export default LinkedinPage
