"use client"

import { useDroppable } from "@dnd-kit/core"
import { Hand } from "lucide-react"

import { FieldPreview } from "@/components/form/new/field-preview"
import { canvasId, type FormField } from "@/components/form/new/types"

export function CanvasDropZone({ fields }: { fields: FormField[] }) {
  const { isOver, setNodeRef } = useDroppable({
    id: canvasId,
  })

  if (fields.length === 0) {
    return (
      <section
        ref={setNodeRef}
        className={`rounded-xl flex flex-col items-center justify-center border border-dashed h-full bg-white p-6 md:p-10 ${
          isOver ? "border-primary bg-primary/5" : ""
        }`}
      >
        <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-dashed bg-background px-6 py-12 text-center">
          <div className="mb-4 rounded-full border bg-white p-3 text-zinc-700">
            <Hand className="size-6" />
          </div>
          <p className="text-base font-semibold text-zinc-900">Arrastra y suelta campos aqui</p>
          <p className="mt-2 text-sm text-zinc-600">
            Elige un tipo de campo en la columna izquierda y sueltalo en el canvas para empezar.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={setNodeRef}
      className={`space-y-3 rounded-xl border border-dashed bg-white p-3 ${
        isOver ? "border-primary bg-primary/5" : "border-zinc-200"
      }`}
    >
      {fields.map((field, index) => (
        <article key={field.id} className="rounded-lg border bg-zinc-50 p-4">
          <p className="mb-2 text-xs font-semibold text-zinc-500">Campo {index + 1}</p>
          <FieldPreview field={field} />
        </article>
      ))}
    </section>
  )
}
