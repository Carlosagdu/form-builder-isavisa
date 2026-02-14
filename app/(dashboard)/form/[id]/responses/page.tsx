import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { notFound, redirect } from "next/navigation"

import { ResponsesDataTable } from "@/components/form/responses/responses-data-table"
import { SelectionDistributionCharts } from "@/components/form/responses/selection-distribution-charts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildSelectionDistributions } from "@/lib/forms/response-analytics"
import { listFormResponsesByFormId } from "@/lib/forms/response-repository"
import { getFormById } from "@/lib/forms/repository"

export default async function FormResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>
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

  const responses = await listFormResponsesByFormId(form.id, 100)
  const selectionDistributions = buildSelectionDistributions(form.schema.fields, responses)

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Volver
            </Link>
          </Button>
          <h1 className="text-lg font-semibold text-zinc-900">{form.title}</h1>
        </div>
        <Badge variant="outline">{responses.length} respuestas</Badge>
      </div>

      {responses.length > 0 ? (
        <SelectionDistributionCharts distributions={selectionDistributions} />
      ) : null}

      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader>
          <CardTitle>Respuestas del formulario</CardTitle>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-y-auto">
          {responses.length === 0 ? (
            <div className="flex h-full min-h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-zinc-50 text-center">
              <FileText className="size-5 text-zinc-500" />
              <p className="text-sm font-medium text-zinc-900">Aun no hay respuestas</p>
              <p className="text-sm text-zinc-500">Comparte el enlace del formulario para empezar a recibir datos.</p>
            </div>
          ) : (
            <ResponsesDataTable responses={responses} fields={form.schema.fields} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
