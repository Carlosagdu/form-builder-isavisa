"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

import type { FieldType, FieldTypeId } from "@/components/form/new/types"
import { Button } from "@/components/ui/button"

export function DraggablePaletteItem({
  fieldType,
  onClick,
}: {
  fieldType: FieldType
  onClick: (fieldTypeId: FieldTypeId) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${fieldType.id}`,
    data: {
      source: "palette",
      fieldTypeId: fieldType.id,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const Icon = fieldType.icon

  return (
    <Button
      ref={setNodeRef}
      type="button"
      variant={"outline"}
      className={`border-l-primary border-l-3 ${isDragging ? "opacity-0" : ""}`}
      style={style}
      onClick={() => onClick(fieldType.id)}
      {...listeners}
      {...attributes}
    >
      <Icon className="size-4" />
      <span>{fieldType.label}</span>
      {isDragging ? <span className="ml-auto text-xs text-zinc-500">Moviendo...</span> : null}
    </Button>
  )
}
