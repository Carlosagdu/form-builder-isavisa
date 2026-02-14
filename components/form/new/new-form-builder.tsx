"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formThemeOptions, type FormThemeId } from "@/lib/forms/themes"
import { cn } from "@/lib/utils"

export function NewFormBuilder({
  formTitle,
  formDescription,
  onFormTitleChange,
  onFormDescriptionChange,
  formTheme,
  onFormThemeChange,
  onFieldsChange,
  initialFields = [],
}: {
  formTitle: string
  formDescription: string
  onFormTitleChange: (value: string) => void
  onFormDescriptionChange: (value: string) => void
  formTheme: FormThemeId
  onFormThemeChange: (theme: FormThemeId) => void
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

  const palettePanel = (
    <aside className="min-h-0 overflow-y-auto rounded-2xl border bg-zinc-50 p-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-zinc-900">Tipos de campos</h2>
        <p className="text-sm text-zinc-500">Arrastra o haz click para agregar</p>
        <Separator className="mt-3 mb-6" />
      </div>

      <div className="flex flex-col space-y-2">
        <h2 className="mb-1 text-sm font-semibold text-zinc-900 md:mb-3">Campos Basicos</h2>
        {fieldTypes.map((fieldType) => (
          <DraggablePaletteItem key={fieldType.id} fieldType={fieldType} onClick={addField} />
        ))}
      </div>
      <Separator className="mt-4 mb-4" />
      <div className="flex flex-col space-y-2">
        <h2 className="text-base font-semibold text-zinc-900">Temas predefinidos</h2>
        <p className="text-sm text-zinc-500">Como se vera el formulario para tus usuarios</p>
        <div className="mt-3 space-y-2">
          {formThemeOptions.map((theme) => (
            <Button
              key={theme.id}
              type="button"
              variant="outline"
              className={cn(
                "h-auto w-full justify-start bg-white px-3 py-2 text-left",
                formTheme === theme.id ? "border-primary ring-1 ring-primary/30" : "border-zinc-200"
              )}
              onClick={() => onFormThemeChange(theme.id)}
            >
              <span className="block">
                <span className="block text-sm font-semibold text-zinc-900">{theme.label}</span>
                <span className="block text-xs text-zinc-500">{theme.description}</span>
              </span>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )

  const canvasPanel = (
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
            placeholder="Por favor ingresa una corta descripcion del formulario"
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
            {formDescription.length == 0 ? "Por favor ingresa una corta descripcion del formulario" : formDescription}
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
  )

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
      <div className="hidden h-full min-h-0 gap-3 lg:grid lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        {palettePanel}
        {canvasPanel}
        <FieldPropertiesPanel selectedField={selectedField} onUpdateField={updateField} />
      </div>

      <div className="flex h-full min-h-0 flex-col gap-3 lg:hidden">
        <Tabs defaultValue="canvas" className="min-h-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fields">Campos</TabsTrigger>
              <TabsTrigger value="canvas">Canvas</TabsTrigger>
            </TabsList>
            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" size="sm" disabled={!selectedField}>
                  <SlidersHorizontal className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] p-0">
                <SheetHeader className="border-b">
                  <SheetTitle>Propiedades</SheetTitle>
                  <SheetDescription>Edita el campo seleccionado</SheetDescription>
                </SheetHeader>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <FieldPropertiesPanel selectedField={selectedField} onUpdateField={updateField} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <TabsContent value="fields" className="mt-2 min-h-0 flex-1">
            {palettePanel}
          </TabsContent>

          <TabsContent value="canvas" className="mt-2 min-h-0 flex-1">
            {canvasPanel}
          </TabsContent>
        </Tabs>
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
