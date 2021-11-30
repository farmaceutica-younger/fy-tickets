import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function TicketForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" />
      <LabeledTextField name="role" label="Role" placeholder="Role" />
      <LabeledTextField name="image" label="Image" placeholder="https://image.com" />
      <LabeledTextField name="ticketNum" label="ticketNum" placeholder="000000001" />
    </Form>
  )
}
