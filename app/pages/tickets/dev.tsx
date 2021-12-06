import { Ticket } from "app/tickets/components/ticket"
import Tilt from "react-parallax-tilt"

export const Dev = () => {
  return (
    <div className="h-screen bg-gray-800 grid content-center">
      <div></div>
      <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
        <div className="scale-75 grid content-center">
          <Ticket
            user={{
              name: "Ludovico Russo",
              role: "Vicepresident",
              src: "https://media-exp1.licdn.com/dms/image/C4D03AQEnTfcH9D4ShQ/profile-displayphoto-shrink_100_100/0/1588335071407?e=1644451200&v=beta&t=2EAj3oTlNV5aT5DWHTz5YDfJPaATU5VzPeN4_iQczGM",
            }}
            ticketNum={1034}
          ></Ticket>
        </div>
      </Tilt>
    </div>
  )
}

export default Dev
