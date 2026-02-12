"use client"

import { useMemo, useState } from "react"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { FileQuestionMark } from "lucide-react"

import { CanvasDropZone } from "@/components/form/new/canvas-drop-zone"
import { DraggablePaletteItem } from "@/components/form/new/draggable-palette-item"
import {
  canvasId,
  defaultLabelByType,
  fieldTypes,
  type FieldTypeId,
  type FormField,
} from "@/components/form/new/types"
import { Separator } from "@/components/ui/separator"

export function NewFormBuilder() {
  const [fields, setFields] = useState<FormField[]>([])
  const [activeFieldTypeId, setActiveFieldTypeId] = useState<FieldTypeId | null>(null)
  const [activeDragSource, setActiveDragSource] = useState<"palette" | "canvas" | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const activeFieldType = useMemo(
    () => fieldTypes.find((fieldType) => fieldType.id === activeFieldTypeId) ?? null,
    [activeFieldTypeId]
  )

  const addField = (fieldTypeId: FieldTypeId) => {
    setFields((current) => [
      ...current,
      {
        id: `${fieldTypeId}-${crypto.randomUUID()}`,
        type: fieldTypeId,
        label: defaultLabelByType(fieldTypeId),
      },
    ])
  }

  const addFieldAtIndex = (fieldTypeId: FieldTypeId, index: number) => {
    setFields((current) => {
      const safeIndex = Math.max(0, Math.min(index, current.length))
      const newField: FormField = {
        id: `${fieldTypeId}-${crypto.randomUUID()}`,
        type: fieldTypeId,
        label: defaultLabelByType(fieldTypeId),
      }

      return [...current.slice(0, safeIndex), newField, ...current.slice(safeIndex)]
    })
  }

  const handleDragStart = (event: DragStartEvent) => {
    const fieldTypeId = event.active.data.current?.fieldTypeId as FieldTypeId | undefined
    const source = event.active.data.current?.source as "palette" | "canvas" | undefined

    if (source) {
      setActiveDragSource(source)
    }
    if (fieldTypeId) {
      setActiveFieldTypeId(fieldTypeId)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id ? String(event.over.id) : null)
  }

  const resetDragState = () => {
    setActiveFieldTypeId(null)
    setActiveDragSource(null)
    setOverId(null)
  }

  const handleDragCancel = () => {
    resetDragState()
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const currentOverId = event.over?.id
    const source = event.active.data.current?.source
    const fieldTypeId = event.active.data.current?.fieldTypeId as FieldTypeId | undefined

    if (!currentOverId) {
      resetDragState()
      return
    }

    if (source === "palette" && fieldTypeId) {
      if (currentOverId === canvasId) {
        addField(fieldTypeId)
      } else {
        const targetIndex = fields.findIndex((field) => field.id === currentOverId)
        if (targetIndex >= 0) {
          addFieldAtIndex(fieldTypeId, targetIndex)
        }
      }
    }

    if (source === "canvas") {
      const activeFieldId = event.active.data.current?.fieldId as string | undefined
      if (!activeFieldId) {
        resetDragState()
        return
      }

      if (currentOverId === canvasId || activeFieldId === currentOverId) {
        resetDragState()
        return
      }

      const oldIndex = fields.findIndex((field) => field.id === activeFieldId)
      const newIndex = fields.findIndex((field) => field.id === currentOverId)

      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        setFields((current) => arrayMove(current, oldIndex, newIndex))
      }
    }

    resetDragState()
  }

  return (
    <DndContext
      id="new-form-dnd-context"
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        <aside className="min-h-0 overflow-y-auto rounded-2xl border bg-zinc-50 p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-zinc-900">Tipos de campos</h2>
            <p className="text-sm text-zinc-500">Arrastra o haz click para agregar</p>
            <Separator className="mt-3 mb-6" />
          </div>

          <div className="flex flex-col space-y-2">
            {fieldTypes.map((fieldType) => (
              <DraggablePaletteItem key={fieldType.id} fieldType={fieldType} onClick={addField} />
            ))}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-zinc-50 p-4">
          <div className="rounded-xl border border-b-3 border-b-primary bg-white px-4 py-10 text-center">
            <h1 className="text-2xl font-semibold text-zinc-900">Formulario sin titulo</h1>
            <p className="mt-2 text-sm text-zinc-500">Click para editar la descripcion del formulario</p>
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            <CanvasDropZone
              fields={fields}
              insertBeforeFieldId={overId}
              showInsertAtEnd={Boolean(activeDragSource) && overId === canvasId}
            />
          </div>
        </section>

        <aside className="flex min-h-0 flex-col overflow-y-auto rounded-2xl border bg-zinc-50 p-4">
          <h2 className="text-center text-base font-semibold text-zinc-900">Propiedades del campo</h2>
          <p className="mt-1 text-center text-sm text-zinc-500">Configura un campo seleccionado</p>
          <Separator className="my-3" />
          <div className="flex flex-1 flex-col items-center justify-center">
            <FileQuestionMark size={50} />
            <p className="text-base font-semibold text-zinc-900">Ningun campo seleccionado</p>
            <p className="text-center text-sm text-zinc-700">
              Selecciona un campo del canvas y configura sus propiedades
            </p>
          </div>
        </aside>
      </div>

      <DragOverlay>
        {activeFieldType ? (
          <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm">
            <activeFieldType.icon className="size-4" />
            {activeFieldType.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
