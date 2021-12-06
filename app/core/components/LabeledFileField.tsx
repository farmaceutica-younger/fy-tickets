import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

export interface LabeledFileFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<FileList>
}

export const LabeledFileField = forwardRef<HTMLInputElement, LabeledFileFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      input: { onChange, value, ...input },
      meta: { submitting },
    } = useField<FileList>(name, {
      ...fieldProps,
    })

    return (
      <div {...outerProps}>
        <label {...labelProps}>
          {label}
          <input
            {...input}
            onChange={(e) => onChange(e.target.files)}
            disabled={submitting}
            type="file"
            {...props}
            ref={ref}
          />
        </label>

        <style jsx>{`
          label {
            display: flex;
            flex-direction: column;
            align-items: start;
            font-size: 1rem;
          }
          input {
            font-size: 1rem;
            padding: 0.25rem 0.5rem;
            border-radius: 3px;
            border: 1px solid purple;
            appearance: none;
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    )
  }
)

export default LabeledFileField
