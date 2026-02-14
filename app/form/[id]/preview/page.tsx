import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, PencilLine } from "lucide-react"
import { notFound, redirect } from "next/navigation"

import { FormRenderer } from "@/components/form/renderer/form-renderer"
import { FormRendererSkeleton } from "@/components/form/renderer/form-renderer-skeleton"
import { Button } from "@/components/ui/button"
import { getFormById } from "@/lib/forms/repository"

export default async function FormPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ from?: string }>
}) {
  const shouldShowOnlyEdit = (await searchParams).from === "builder"

  return (
    <Suspense
      fallback={
        <div className="h-screen overflow-y-auto bg-zinc-50 p-4 md:p-6">
          <div className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-between">
            <div className="flex items-center gap-2">
              {!shouldShowOnlyEdit && (
                <Button variant="outline" size="sm" disabled>
                  <ArrowLeft className="size-4" />
                  Volver al dashboard
                </Button>
              )}
              <Button size="sm" disabled>
                <PencilLine className="size-4" />
                Volver a editar
              </Button>
            </div>
          </div>
          <FormRendererSkeleton />
        </div>
      }
    >
      <FormPreviewContent params={params} shouldShowOnlyEdit={shouldShowOnlyEdit} />
    </Suspense>
  )
}

async function FormPreviewContent({
  params,
  shouldShowOnlyEdit,
}: {
  params: Promise<{ id: string }>
  shouldShowOnlyEdit: boolean
}) {
  const { id } = await params

  let form = null
  try {
    form = await getFormById(id)
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (message.includes("Usuario no autenticado")) {
      redirect("/auth?reason=unauthorized")
    }
    throw error
  }

  if (!form) {
    notFound()
  }

  return (
    <div className="h-screen overflow-y-auto bg-zinc-50 p-4 md:p-6">
      <div className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-between">
        <div className="flex items-center gap-2">
          {!shouldShowOnlyEdit && (
            <Button asChild variant="outline" size="sm">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Volver al dashboard
              </Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link href={`/form/new?draftId=${id}`}>
              <PencilLine className="size-4" />
              Volver a editar
            </Link>
          </Button>
        </div>
      </div>

      <FormRenderer
        title={form.title}
        description={form.description}
        fields={form.schema.fields}
      />
    </div>
  )
}
