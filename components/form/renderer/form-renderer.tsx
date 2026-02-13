import { FieldPreview } from "@/components/form/new/field-preview"
import type { FormField } from "@/components/form/new/types"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { FileText } from "lucide-react"

export function FormRenderer({
  title,
  description,
  fields,
}: {
  title: string
  description: string
  fields: FormField[]
}) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <section className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-semibold text-zinc-900">{title.trim() || "Formulario sin titulo"}</h1>
        <p className="mt-2 text-sm text-zinc-600">{description.trim() || "Sin descripcion"}</p>
      </section>

      {fields.length === 0 ? (
        <Empty className="rounded-2xl border bg-white">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText className="size-4" />
            </EmptyMedia>
            <EmptyTitle>Este formulario no tiene campos</EmptyTitle>
            <EmptyDescription>
              Agrega campos en el editor para que los usuarios puedan responder este formulario.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <form className="space-y-6 rounded-2xl border bg-white p-6">
          {fields.map((field) => (
            <FieldPreview key={field.id} field={field} />
          ))}
        </form>
      )}
    </div>
  )
}

