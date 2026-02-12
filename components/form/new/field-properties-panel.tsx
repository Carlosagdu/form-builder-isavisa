"use client"

import { FileQuestionMark, Plus, Trash2 } from "lucide-react"

import type { FormField } from "@/components/form/new/types"
import { supportsOptions, supportsPlaceholder } from "@/components/form/new/types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function FieldPropertiesPanel({
  selectedField,
  onUpdateField,
}: {
  selectedField: FormField | null
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void
}) {
  if (!selectedField) {
    return (
      <div className="flex min-h-0 flex-col overflow-y-auto rounded-2xl border bg-zinc-50 p-4">
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
      </div>
    )
  }

  const handleOptionChange = (index: number, value: string) => {
    const next = [...selectedField.options]
    next[index] = value
    onUpdateField(selectedField.id, { options: next })
  }

  const addOption = () => {
    const optionNumber = selectedField.options.length + 1
    onUpdateField(selectedField.id, {
      options: [...selectedField.options, `Opcion ${optionNumber}`],
    })
  }

  const removeOption = (index: number) => {
    onUpdateField(selectedField.id, {
      options: selectedField.options.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="flex min-h-0 flex-col overflow-y-auto rounded-2xl border bg-zinc-50 p-4">
      <h2 className="text-center text-base font-semibold text-zinc-900">Propiedades del campo</h2>
      <p className="mt-1 text-center text-sm text-zinc-500">Edita el campo seleccionado</p>
      <Separator className="my-3" />

      <div className="space-y-4 rounded-lg border bg-white p-3">
        <div className="space-y-2">
          <Label htmlFor="field-label">Etiqueta</Label>
          <Input
            id="field-label"
            value={selectedField.label}
            onChange={(event) =>
              onUpdateField(selectedField.id, {
                label: event.target.value,
              })
            }
          />
        </div>

        {supportsPlaceholder(selectedField.type) ? (
          <div className="space-y-2">
            <Label htmlFor="field-placeholder">Placeholder</Label>
            <Input
              id="field-placeholder"
              value={selectedField.placeholder}
              onChange={(event) =>
                onUpdateField(selectedField.id, {
                  placeholder: event.target.value,
                })
              }
            />
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          <Checkbox
            id="field-required"
            checked={selectedField.required}
            onCheckedChange={(checked) =>
              onUpdateField(selectedField.id, {
                required: Boolean(checked),
              })
            }
          />
          <Label htmlFor="field-required">Campo requerido</Label>
        </div>

        {supportsOptions(selectedField.type) ? (
          <div className="space-y-2">
            <Separator />
            <Label>Opciones</Label>
            {selectedField.options.map((option, index) => (
              <div key={`${selectedField.id}-option-${index}`} className="flex items-center gap-2">
                <Input value={option} onChange={(event) => handleOptionChange(index, event.target.value)} />
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label={`Eliminar opcion ${index + 1}`}
                  onClick={() => removeOption(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" className="w-full" onClick={addOption}>
              <Plus className="size-4" />
              Agregar opcion
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
