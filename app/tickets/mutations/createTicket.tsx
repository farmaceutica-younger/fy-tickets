import { resolver } from "blitz"
import db, { Ticket } from "db"
import nodeHtmlToImage from "node-html-to-image"
import { renderToString } from "react-dom/server"
import { z } from "zod"
import { Ticket as TicketCmp } from "../components/ticket"
import { v2 as cloudinary } from "cloudinary"

const CreateTicket = z.object({
  name: z.string(),
  role: z.string(),
  image: z.string(),
  ticketNum: z.string(),
})

export default resolver.pipe(resolver.zod(CreateTicket), resolver.authorize(), async (input) => {
  const ticketImage = await renderTicketImage(input)
  const ticket = await db.ticket.create({ data: { ...input, ticketImage } })
  return ticket
})

const renderTicketImage = async (ticket: {
  name: string
  role: string
  image: string
  ticketNum: string
}) => {
  const renderedString = renderToString(
    <TicketCmp
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
  const dataUri = `data:image/png;base64,${image}`
  const res = await cloudinary.uploader.upload(dataUri, { folder: "test/tickets" })
  return res.url
}
