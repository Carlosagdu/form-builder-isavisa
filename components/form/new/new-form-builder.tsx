"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

import { CanvasDropZone } from "@/components/form/new/canvas-drop-zone"
import { DraggablePaletteItem } from "@/components/form/new/draggable-palette-item"
import { FieldPropertiesPanel } from "@/components/form/new/field-properties-panel"
import {
  canvasId,
  defaultLabelByType,
  fieldTypes,
  type FieldTypeId,
  type FormField,
} from "@/components/form/new/types"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function NewFormBuilder({
  formTitle,
  formDescription,
  onFormTitleChange,
  onFormDescriptionChange,
  onFieldsChange,
  initialFields = [],
}: {
  formTitle: string
  formDescription: string
  onFormTitleChange: (value: string) => void
  onFormDescriptionChange: (value: string) => void
  onFieldsChange?: (fields: FormField[]) => void
  initialFields?: FormField[]
}) {
  const [editingFormField, setEditingFormField] = useState<"title" | "description" | null>(null)
  const [fields, setFields] = useState<FormField[]>(initialFields)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [activeFieldTypeId, setActiveFieldTypeId] = useState<FieldTypeId | null>(null)
  const [activeDragSource, setActiveDragSource] = useState<"palette" | "canvas" | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const suppressNextPaletteClickRef = useRef(false)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const activeFieldType = useMemo(
    () => fieldTypes.find((fieldType) => fieldType.id === activeFieldTypeId) ?? null,
    [activeFieldTypeId]
  )

  const selectedField = useMemo(
    () => fields.find((field) => field.id === selectedFieldId) ?? null,
    [fields, selectedFieldId]
  )

  const createField = (fieldTypeId: FieldTypeId): FormField => ({
    id: `${fieldTypeId}-${crypto.randomUUID()}`,
    type: fieldTypeId,
    label: defaultLabelByType(fieldTypeId),
    placeholder: "",
    required: false,
    options: fieldTypeId === "single-select" || fieldTypeId === "multi-select" ? ["Opcion 1", "Opcion 2"] : [],
  })

  const addField = (fieldTypeId: FieldTypeId) => {
    const newField = createField(fieldTypeId)
    setFields((current) => [...current, newField])
    setSelectedFieldId(newField.id)
  }

  const addFieldAtIndex = (fieldTypeId: FieldTypeId, index: number) => {
    const newField = createField(fieldTypeId)
    setFields((current) => {
      const safeIndex = Math.max(0, Math.min(index, current.length))
      return [...current.slice(0, safeIndex), newField, ...current.slice(safeIndex)]
    })
    setSelectedFieldId(newField.id)
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields((current) => current.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)))
  }

  const deleteField = (fieldId: string) => {
    setFields((current) => current.filter((field) => field.id !== fieldId))
    setSelectedFieldId((current) => (current === fieldId ? null : current))
  }

  const finishEditingFormField = () => {
    setEditingFormField(null)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const fieldTypeId = event.active.data.current?.fieldTypeId as FieldTypeId | undefined
    const source = event.active.data.current?.source as "palette" | "canvas" | undefined

    if (source) {
      setActiveDragSource(source)
      if (source === "palette") {
        suppressNextPaletteClickRef.current = true
      }
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
    setTimeout(() => {
      suppressNextPaletteClickRef.current = false
    }, 0)
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
    setTimeout(() => {
      suppressNextPaletteClickRef.current = false
    }, 0)
  }

  useEffect(() => {
    onFieldsChange?.(fields)
  }, [fields, onFieldsChange])

  return (
    <DndContext
      id="new-form-dnd-context"
      sensors={sensors}
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
            <h2 className="text-sm font-semibold text-zinc-900 mb-1 md:mb-3">Campos Basicos</h2>
            {fieldTypes.map((fieldType) => (
              <DraggablePaletteItem key={fieldType.id} fieldType={fieldType} onClick={addField} />
            ))}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-zinc-50 p-4">
          <div className="rounded-xl border border-b-3 border-b-primary bg-white px-4 py-10 text-center">
            {editingFormField === "title" ? (
              <Input
                autoFocus
                value={formTitle}
                onChange={(event) => onFormTitleChange(event.target.value)}
                onBlur={finishEditingFormField}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    finishEditingFormField()
                  }
                }}
                className="mx-auto h-11 max-w-xl text-center text-2xl font-semibold"
              />
            ) : (
              <Button
                variant={"ghost"}
                size={"lg"}
                className="mx-auto block text-2xl font-semibold text-zinc-900 hover:text-primary"
                onClick={() => setEditingFormField("title")}
              >
                {formTitle}
              </Button>
            )}

            {editingFormField === "description" ? (
              <Input
                autoFocus
                placeholder="Click para editar la descripcion del formulario"
                value={formDescription}
                onChange={(event) => onFormDescriptionChange(event.target.value)}
                onBlur={finishEditingFormField}
                className="mx-auto max-w-xl text-center text-sm text-zinc-600"
              />
            ) : (
              <Button
                type="button"
                variant={"ghost"}
                className="mx-auto mt-2 block text-sm text-zinc-500 hover:text-primary"
                onClick={() => setEditingFormField("description")}
              >
                {formDescription}
              </Button>
            )}
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            <CanvasDropZone
              fields={fields}
              insertBeforeFieldId={overId}
              showInsertAtEnd={Boolean(activeDragSource) && overId === canvasId}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
              onDeleteField={deleteField}
            />
          </div>
        </section>

        <FieldPropertiesPanel selectedField={selectedField} onUpdateField={updateField} />
      </div>

      <DragOverlay>
        {activeFieldType ? (
          <div className="flex items-center gap-2 rounded-md border-l-primary border-l-3 bg-background px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm">
            <activeFieldType.icon className="size-4" />
            {activeFieldType.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
