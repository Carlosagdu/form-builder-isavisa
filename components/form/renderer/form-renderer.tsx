import { FieldPreview } from "@/components/form/new/field-preview"
import type { FormField } from "@/components/form/new/types"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { getFormThemeStyles, type FormThemeId } from "@/lib/forms/themes"
import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"

export function FormRenderer({
  title,
  description,
  fields,
  theme = "classic",
}: {
  title: string
  description: string
  fields: FormField[]
  theme?: FormThemeId
}) {
  const styles = getFormThemeStyles(theme)

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <section className={cn("rounded-2xl p-6", styles.card)}>
        <h1 className={cn("text-2xl font-semibold", styles.title)}>{title.trim() || "Formulario sin titulo"}</h1>
        <p className={cn("mt-2 text-sm", styles.description)}>{description.trim() || "Sin descripcion"}</p>
      </section>

      {fields.length === 0 ? (
        <Empty className={cn("rounded-2xl", styles.card)}>
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
        <form className={cn("space-y-6 rounded-2xl p-6", styles.card)}>
          {fields.map((field) => (
            <FieldPreview key={field.id} field={field} />
          ))}
        </form>
      )}
    </div>
  )
}
