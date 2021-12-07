import {
  forwardRef,
  ComponentPropsWithoutRef,
  PropsWithoutRef,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react"
import { useField, UseFieldConfig } from "react-final-form"
import ReactCrop, { Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

export interface LabeledUploadImageFieldProps
  extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  name: string
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<Blob>
}

export const LabeledUploadImageField = forwardRef<HTMLInputElement, LabeledUploadImageFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      input: { onChange, value, ...input },
      meta: { submitting },
    } = useField<Blob>(name, {
      ...fieldProps,
    })

    const [image, setImage] = useState<string | ArrayBuffer | null>(null)
    const [crop, setCrop] = useState<Partial<Crop>>({
      unit: "%",
      width: 100,
      aspect: 1,
    })
    const imgRef = useRef<any>(null)
    const previewCanvasRef = useRef<any>(null)
    const [completedCrop, setCompletedCrop] = useState<Crop>()

    const onLoad = useCallback((img: HTMLImageElement) => {
      imgRef.current = img
    }, [])

    useEffect(() => {
      if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
        return
      }

      const image = imgRef.current
      const canvas = previewCanvasRef.current
      const crop = completedCrop

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      const ctx = canvas.getContext("2d")
      const pixelRatio = window.devicePixelRatio

      canvas.width = 200
      canvas.height = 200

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      ctx.imageSmoothingQuality = "high"

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        200,
        200
      )

      generateBlob(canvas, crop).then((blob) => {
        onChange(blob)
      })
    }, [completedCrop, onChange])

    const handleInput = (files: FileList | null) => {
      if (files && files.length > 0) {
        const reader = new FileReader()
        reader.addEventListener("load", () => setImage(reader.result))
        reader.readAsDataURL(files.item(0)!)
      }
    }

    return (
      <div {...outerProps}>
        {image && (
          <ReactCrop
            src={image as string}
            crop={crop}
            ruleOfThirds
            onImageLoaded={onLoad}
            onChange={setCrop}
            onComplete={setCompletedCrop}
          />
        )}

        <label {...labelProps}>
          {label}
          <input
            {...input}
            onChange={(e) => handleInput(e.target.files)}
            disabled={submitting}
            type="file"
            {...props}
            ref={ref}
          />
        </label>
        <canvas className="hidden" ref={previewCanvasRef} />

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

export default LabeledUploadImageField

function generateBlob(canvas: HTMLCanvasElement, crop: Crop): Promise<Blob | undefined | null> {
  if (!crop || !canvas) {
    return Promise.resolve(undefined)
  }

  return new Promise((resolve) =>
    canvas.toBlob(
      (blob) => {
        resolve(blob)
      },
      "image/png",
      1
    )
  )
}
