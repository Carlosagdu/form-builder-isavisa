import { notFound } from "next/navigation"

import { FormRenderer } from "@/components/form/renderer/form-renderer"
import { Button } from "@/components/ui/button"
import { getPublishedFormById } from "@/lib/forms/repository"

export default async function RespondFormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const form = await getPublishedFormById(id)

  if (!form) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-6">
      <div className="mx-auto w-full max-w-3xl">
        <FormRenderer
          title={form.title}
          description={form.description}
          fields={form.schema.fields}
        />

        <div className="mt-4 flex justify-end">
          <Button type="button">Enviar respuesta</Button>
        </div>
      </div>
    </div>
  )
}

