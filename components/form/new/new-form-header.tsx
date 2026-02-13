"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeft, CircleCheck, Eye, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { createDraftFormAction } from "@/actions"
import { NewFormBuilder } from "@/components/form/new/new-form-builder"
import { type FormField } from "@/components/form/new/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

export function NewFormHeader() {
  const router = useRouter()
  const [formTitle, setFormTitle] = useState("Formulario Nuevo")
  const [formDescription, setFormDescription] = useState("Click para editar la descripcion del formulario")
  const [fields, setFields] = useState<FormField[]>([])
  const [isPublishing, setIsPublishing] = useState(false)

  const headerTitle = useMemo(
    () => formTitle.trim() || "Formulario nuevo",
    [formTitle]
  )

  const handlePublish = async () => {
    if (isPublishing) return
    setIsPublishing(true)

    const result = await createDraftFormAction({
      title: formTitle,
      description: formDescription,
      status: "draft",
      schema: {
        version: 1,
        fields,
      },
    })

    if (!result.ok) {
      toast.error(result.error, { position: "top-center" })
      setIsPublishing(false)
      return
    }

    toast.success("Formulario guardado correctamente", { position: "top-center" })
    router.push("/")
    setIsPublishing(false)
  }

  return (
    <div className="flex h-full min-h-0 flex-col border bg-white p-3 md:p-4">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-3">
          <Button asChild size="sm">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Volver a formularios
            </Link>
          </Button>
          <Separator orientation="vertical" className="hidden sm:block" />
          <p className="text-lg font-semibold text-zinc-900">{headerTitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="ghost" className="text-primary">
            <CircleCheck data-icon="inline-start" />
            Auto guardado
          </Badge>
          <Button type="button" variant="ghost" size="sm">
            <Eye data-icon="inline-start" />
            Vista previa
          </Button>
          <Button type="button" size="sm" onClick={handlePublish} disabled={isPublishing}>
            {isPublishing && <Spinner data-icon="inline-start" />}
            {!isPublishing && <Send data-icon="inline-start" />}
            Publicar
          </Button>
        </div>
      </header>

      <main className="min-h-0 flex-1 pt-3">
        <NewFormBuilder
          formTitle={formTitle}
          formDescription={formDescription}
          onFormTitleChange={setFormTitle}
          onFormDescriptionChange={setFormDescription}
          onFieldsChange={setFields}
        />
      </main>
    </div>
  )
}
