"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Hand, Trash2 } from "lucide-react"

import { FieldPreview } from "@/components/form/new/field-preview"
import { canvasId, type FormField } from "@/components/form/new/types"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Button } from "@/components/ui/button"

function InsertIndicator() {
  return (
    <div className="relative my-1 h-0.5 rounded bg-primary/70">
      <span className="absolute -left-0.5 -top-1 size-2 rounded-full bg-primary" />
    </div>
  )
}

function SortableCanvasItem({
  field,
  index,
  showInsertBefore,
  isSelected,
  onSelect,
  onDelete,
}: {
  field: FormField
  index: number
  showInsertBefore: boolean
  isSelected: boolean
  onSelect: (fieldId: string) => void
  onDelete: (fieldId: string) => void
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({
    id: field.id,
    data: {
      source: "canvas",
      fieldId: field.id,
    },
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div>
      {showInsertBefore ? <InsertIndicator /> : null}
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
              size={"icon-xs"}
              variant={"ghost"}
              type="button"
              className="text-rose-600 hover:text-rose-700 bg-white"
              aria-label="Eliminar campo"
              onClick={(event) => {
                event.stopPropagation()
                onDelete(field.id)
              }}
            >
              <Trash2 className="size-4" />
            </Button>
            <Button
              size={"icon-xs"}
              variant={"ghost"}
              ref={setActivatorNodeRef}
              type="button"
              className="inline-flex cursor-grab items-center rounded-md border bg-white p-1 text-zinc-500 hover:bg-zinc-100 active:cursor-grabbing"
              aria-label="Arrastrar campo"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="size-4" />
            </Button>
          </div>
        </div>
        <FieldPreview field={field} />
      </article>
    </div>
  )
}

export function CanvasDropZone({
  fields,
  insertBeforeFieldId,
  showInsertAtEnd,
  selectedFieldId,
  onSelectField,
  onDeleteField,
}: {
  fields: FormField[]
  insertBeforeFieldId: string | null
  showInsertAtEnd: boolean
  selectedFieldId: string | null
  onSelectField: (fieldId: string) => void
  onDeleteField: (fieldId: string) => void
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: canvasId,
  })
  // TODO: Add empty component from shadcn
  if (fields.length === 0) {
    return (
      <section
        ref={setNodeRef}
        className={`rounded-xl flex flex-col items-center h-full bg-white p-6 md:p-10 ${
          isOver ? "border-primary bg-primary/5" : ""
        }`}
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
            showInsertBefore={insertBeforeFieldId === field.id}
            isSelected={selectedFieldId === field.id}
            onSelect={onSelectField}
            onDelete={onDeleteField}
          />
        ))}
      </SortableContext>
      {showInsertAtEnd ? <InsertIndicator /> : null}
    </section>
  )
}
