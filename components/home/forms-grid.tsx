import Link from "next/link"
import { FileText } from "lucide-react"

import { FormCard } from "@/components/home/form-card"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { countFormResponsesByFormId } from "@/lib/forms/response-repository"
import { listFormsByOwner } from "@/lib/forms/repository"
import type { FormCardData } from "@/lib/mocks/forms"

function formatCreatedAtLabel(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Fecha desconocida"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function mapFormToCard(form: Awaited<ReturnType<typeof listFormsByOwner>>[number], submissionsCount: number): FormCardData {
  return {
    id: form.id,
    title: form.title,
    description: form.description || "Sin descripcion",
    status: form.status === "published" ? "published" : "draft",
    createdAtLabel: formatCreatedAtLabel(form.createdAt),
    submissionsCount,
  }
}

export async function FormsGrid() {
  const forms = await listFormsByOwner()
  if (forms.length === 0) {
    return (
      <section className="min-h-0 flex-1 h-full">
        <Empty className="rounded-2xl border bg-white h-full">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText className="size-12" />
            </EmptyMedia>
            <EmptyTitle>No hay formularios todavia</EmptyTitle>
            <EmptyDescription>
              Crea tu primer formulario para empezar a capturar respuestas.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/form/new">Crear formulario</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </section>
    )
  }

  const cards = await Promise.all(
    forms.map(async (form) =>
      mapFormToCard(form, await countFormResponsesByFormId(form.id))
    )
  )

  return (
    <section className="grid min-h-0 flex-1 auto-rows-max content-start grid-cols-1 gap-x-4 gap-y-4 overflow-y-auto pr-1 lg:grid-cols-3">
      {cards.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </section>
  )
}
