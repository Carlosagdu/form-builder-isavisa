"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeft, CircleCheck, Eye, Send } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { createDraftFormAction, getFormByIdAction, updateFormAction } from "@/actions"
import { NewFormBuilder } from "@/components/form/new/new-form-builder"
import { type FormField } from "@/components/form/new/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useEffect } from "react"
import type { FormStatus } from "@/lib/forms/types"

export function NewFormHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [formTitle, setFormTitle] = useState("Formulario Nuevo")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [isOpeningPreview, setIsOpeningPreview] = useState(false)
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(searchParams.get("draftId"))
  const [hydratedDraftId, setHydratedDraftId] = useState<string | null>(null)
  const [builderResetToken, setBuilderResetToken] = useState(0)
  const [isHydratingDraft, setIsHydratingDraft] = useState(Boolean(searchParams.get("draftId")))

  const headerTitle = useMemo(
    () => formTitle.trim() || "Formulario nuevo",
    [formTitle]
  )

  const schemaPayload = {
    version: 1 as const,
    fields,
  }

  useEffect(() => {
    const draftIdFromUrl = searchParams.get("draftId")
    if (!draftIdFromUrl || draftIdFromUrl === hydratedDraftId) {
      return
    }
    const draftId = draftIdFromUrl

    let cancelled = false

    async function hydrateDraftFromUrl() {
      try {
        const result = await getFormByIdAction(draftId)
        if (cancelled) return

        if (!result.ok) {
          toast.error(result.error, { position: "top-center" })
          return
        }

        if (!result.data) {
          toast.error("No encontramos este borrador.", { position: "top-center" })
          return
        }
        console.log(result.data.description)

        setCurrentDraftId(result.data.id)
        setHydratedDraftId(result.data.id)
        setFormTitle(result.data.title)
        setFormDescription(result.data.description)
        setFields(result.data.schema.fields as FormField[])
        setBuilderResetToken((current) => current + 1)
      } finally {
        if (!cancelled) {
          setIsHydratingDraft(false)
        }
      }
    }

    void hydrateDraftFromUrl()

    return () => {
      cancelled = true
    }
  }, [hydratedDraftId, searchParams])

  type EditableFormStatus = Extract<FormStatus, "draft" | "published">

  const saveForm = async (status: EditableFormStatus) => {
    const persistedDraftId = searchParams.get("draftId")
    const targetDraftId = currentDraftId ?? persistedDraftId

    if (targetDraftId) {
      const updateResult = await updateFormAction({
        id: targetDraftId,
        title: formTitle,
        description: formDescription,
        status,
        schema: schemaPayload,
      })

      if (!updateResult.ok) {
        return updateResult
      }

      return updateResult
    }

    const createResult = await createDraftFormAction({
      title: formTitle,
      description: formDescription,
      status,
      schema: schemaPayload,
    })

    if (createResult.ok) {
      setCurrentDraftId(createResult.data.id)
      setHydratedDraftId(createResult.data.id)
      const params = new URLSearchParams(searchParams.toString())
      params.set("draftId", createResult.data.id)
      router.replace(`${pathname}?${params.toString()}`)
    }

    return createResult
  }

  const handlePublish = async () => {
    if (isPublishing) return
    setIsPublishing(true)

    const result = await saveForm("published")

    if (!result.ok) {
      toast.error(result.error, { position: "top-center" })
      setIsPublishing(false)
      return
    }

    toast.success("Formulario publicado correctamente", { position: "top-center" })
    router.push("/")
    setIsPublishing(false)
  }

  const handleOpenPreview = async () => {
    if (isOpeningPreview) return
    setIsOpeningPreview(true)

    const result = await saveForm("draft")

    if (!result.ok) {
      toast.error(result.error, { position: "top-center" })
      setIsOpeningPreview(false)
      return
    }

    router.push(`/form/${result.data.id}/preview?from=builder`)
    setIsOpeningPreview(false)
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
          <p className="text-lg font-semibold text-zinc-900">{isHydratingDraft ? '...cargando' : headerTitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="ghost" className="text-primary">
            <CircleCheck data-icon="inline-start" />
            Auto guardado
          </Badge>
          <Button type="button" variant="ghost" size="sm" onClick={handleOpenPreview} disabled={isOpeningPreview}>
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
        {isHydratingDraft ? (
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
            <div className="space-y-3 rounded-2xl border bg-zinc-50 p-4">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-4 rounded-2xl border bg-zinc-50 p-4">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-[420px] w-full rounded-xl" />
            </div>

            <div className="space-y-3 rounded-2xl border bg-zinc-50 p-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <NewFormBuilder
            key={`builder-${currentDraftId ?? "new"}-${builderResetToken}`}
            formTitle={formTitle}
            formDescription={formDescription}
            onFormTitleChange={setFormTitle}
            onFormDescriptionChange={setFormDescription}
            onFieldsChange={setFields}
            initialFields={fields}
          />
        )}
      </main>
    </div>
  )
}
