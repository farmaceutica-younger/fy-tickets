import { v2 as cloudinary } from "cloudinary"
import { Event as EventModel, Ticket as TicketModel } from "db"
import nodeHtmlToImage from "node-html-to-image"
import { renderToString } from "react-dom/server"
import { Ticket } from "../components/ticket"

export const renderTicketImage = async (ticket: TicketModel, event: EventModel) => {
  const renderedString = renderToString(<Ticket event={event} ticket={ticket} />)

  const image = (await nodeHtmlToImage({
    html: `
	  <html>
	  <head>
	   <link href="http://localhost:3000/tw.css" rel="stylesheet">
	    <style>
	      body {
		width: 1000px;
		height: 500px;
		display: grid;
		place-content: center;
	      }
	      .main {
		transform: scale(2)
	      }
	    </style>
	    <body>
	    <div class="main">${renderedString}</div></body>
	  </head>
	  `,
    encoding: "base64",
    transparent: true,
    puppeteerArgs: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--headless",
        "--disable-gpu",
        "--disable-dev-shm-usage",
      ],
    },
  })) as string
  const dataUri = `data:image/png;base64,${image}`
  const res = await cloudinary.uploader.upload(dataUri, {
    public_id: `events/${event.id}/tickets/${ticket.id}`,
  })
  return res.url
}
