import { notFound } from "next/navigation"

import { FormResponseForm } from "@/components/form/respond/form-response-form"
import { getFormThemeStyles } from "@/lib/forms/themes"
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

  const styles = getFormThemeStyles(form.schema.theme)

  return (
    <div className={`min-h-screen p-4 md:p-6 ${styles.pageBg}`}>
      <FormResponseForm
        formId={form.id}
        title={form.title}
        description={form.description}
        fields={form.schema.fields}
        theme={form.schema.theme}
      />
    </div>
  )
}
