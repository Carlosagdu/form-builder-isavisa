import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { FormField } from "@/components/form/new/types"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "./date-picker"

export function FieldPreview({ field }: { field: FormField }) {
  switch (field.type) {
    case "short-text":
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <Input placeholder="Escribe aqui" />
        </div>
      )
    case "long-text":
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <Textarea
            className="min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
            placeholder="Escribe aqui"
          />
        </div>
      )
    case "single-select":
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opcion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={`${field.id}-option-1`}>Opcion 1</SelectItem>
              <SelectItem value={`${field.id}-option-2`}>Opcion 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    case "multi-select":
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <div className="flex items-center gap-2">
            <Checkbox id={`${field.id}-1`} />
            <Label htmlFor={`${field.id}-1`} className="font-normal">
              Opcion 1
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id={`${field.id}-2`} />
            <Label htmlFor={`${field.id}-2`} className="font-normal">
              Opcion 2
            </Label>
          </div>
        </div>
      )
    case "number":
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
          <Input type="number" placeholder="Ej. 10" />
        </div>
      )
    case "date":
      return (
        <DatePicker/>
      )
    default:
      return null
  }
}
