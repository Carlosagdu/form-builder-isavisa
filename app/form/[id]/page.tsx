import { notFound } from "next/navigation"

import { FormResponseForm } from "@/components/form/respond/form-response-form"
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
      <FormResponseForm
        formId={form.id}
        title={form.title}
        description={form.description}
        fields={form.schema.fields}
      />
    </div>
  )
}
