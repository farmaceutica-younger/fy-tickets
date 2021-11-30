import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { renderToString } from "react-dom/server"
import { Ticket } from "../components/ticket"
import nodeHtmlToImage from "node-html-to-image"

const RenderTicket = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(RenderTicket), resolver.authorize(), async ({ id }) => {
  const ticket = await db.ticket.findUnique({ where: { id } })
  if (!ticket) {
    return ""
  }
  const renderedString = renderToString(
    <Ticket
      ticketNum={ticket.ticketNum}
      user={{
        name: ticket.name,
        role: ticket.role,
        src: ticket.image,
      }}
    />
  )

  const image = (await nodeHtmlToImage({
    html: `
    <html>
    <head>
     <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
      <style>
        body {
          width: 1000px;
          height: 500px;
        }
      </style>
      <body>${renderedString}</body>
    </head>
    `,
    encoding: "base64",
    transparent: true,
  })) as string
  return image
})
