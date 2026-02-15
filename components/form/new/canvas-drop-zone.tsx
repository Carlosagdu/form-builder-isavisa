"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ArrowDown, ArrowUp, Hand, Trash2 } from "lucide-react"

import { FieldPreview } from "@/components/form/new/field-preview"
import { canvasId, type FormField } from "@/components/form/new/types"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

function SortableCanvasItem({
  field,
  index,
  isSelected,
  canMoveUp,
  canMoveDown,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  field: FormField
  index: number
  isSelected: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onSelect: (fieldId: string) => void
  onDelete: (fieldId: string) => void
  onMoveUp: (fieldId: string) => void
  onMoveDown: (fieldId: string) => void
}) {
  const { setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: field.id,
      disabled: true,
      data: {
        source: "canvas",
      },
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border bg-zinc-50 p-4 ${
        isSelected ? "border-primary ring-2 ring-primary/30" : ""
      } ${isDragging ? "opacity-60" : ""}`}
      onClick={() => onSelect(field.id)}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-zinc-500">Campo {index + 1}</p>
          <div className="flex items-center gap-1">
            <Button
              size="icon-xs"
              variant="ghost"
              type="button"
              className="bg-white text-zinc-600 hover:text-zinc-800"
              aria-label="Mover campo hacia arriba"
              disabled={!canMoveUp}
              onClick={(event) => {
                event.stopPropagation()
                onMoveUp(field.id)
              }}
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              type="button"
              className="bg-white text-zinc-600 hover:text-zinc-800"
              aria-label="Mover campo hacia abajo"
              disabled={!canMoveDown}
              onClick={(event) => {
                event.stopPropagation()
                onMoveDown(field.id)
              }}
            >
              <ArrowDown className="size-4" />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
            type="button"
            className="bg-white text-rose-600 hover:text-rose-700"
            aria-label="Eliminar campo"
            onClick={(event) => {
              event.stopPropagation()
              onDelete(field.id)
            }}
          >
            <Trash2 className="size-4" />
          </Button>
          </div>
        </div>
      <FieldPreview field={field} />
    </article>
  )
}

export function CanvasDropZone({
  fields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onMoveFieldUp,
  onMoveFieldDown,
}: {
  fields: FormField[]
  selectedFieldId: string | null
  onSelectField: (fieldId: string) => void
  onDeleteField: (fieldId: string) => void
  onMoveFieldUp: (fieldId: string) => void
  onMoveFieldDown: (fieldId: string) => void
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: canvasId,
  })

  if (fields.length === 0) {
    return (
      <section
        ref={setNodeRef}
        className={`h-full rounded-xl bg-white p-6 md:p-10 ${isOver ? "border-primary bg-primary/5" : ""}`}
      >
        <Empty className="mx-auto max-w-md border">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-white">
              <Hand className="size-12" />
            </EmptyMedia>
            <EmptyTitle>Arrastra y suelta campos aqui</EmptyTitle>
            <EmptyDescription>
              Elige un tipo de campo en la columna izquierda y sueltalo en el canvas para empezar.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
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
      <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
        {fields.map((field, index) => (
          <SortableCanvasItem
            key={field.id}
            field={field}
            index={index}
            isSelected={selectedFieldId === field.id}
            canMoveUp={index > 0}
            canMoveDown={index < fields.length - 1}
            onSelect={onSelectField}
            onDelete={onDeleteField}
            onMoveUp={onMoveFieldUp}
            onMoveDown={onMoveFieldDown}
          />
        ))}
      </SortableContext>
    </section>
  )
}
