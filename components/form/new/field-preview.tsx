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
  const requiredMarker = field.required ? " *" : ""

  switch (field.type) {
    case "short-text":
      return (
        <div className="space-y-2">
          <Label>{`${field.label}${requiredMarker}`}</Label>
          <Input placeholder={field.placeholder || "Escribe aqui"} />
        </div>
      )
    case "long-text":
      return (
        <div className="space-y-2">
          <Label>{`${field.label}${requiredMarker}`}</Label>
          <Textarea
            className="min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
            placeholder={field.placeholder || "Escribe aqui"}
          />
        </div>
      )
    case "single-select":
      return (
        <div className="space-y-2">
          <Label>{`${field.label}${requiredMarker}`}</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opcion" />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option, index) => (
                <SelectItem key={`${field.id}-option-${index}`} value={`${field.id}-option-${index}`}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    case "multi-select":
      return (
        <div className="space-y-2">
          <Label>{`${field.label}${requiredMarker}`}</Label>
          {field.options.map((option, index) => (
            <div key={`${field.id}-option-${index}`} className="flex items-center gap-2">
              <Checkbox id={`${field.id}-${index}`} />
              <Label htmlFor={`${field.id}-${index}`} className="font-normal">
                {option}
              </Label>
            </div>
          ))}
        </div>
      )
    case "number":
      return (
        <div className="space-y-2">
          <Label>{`${field.label}${requiredMarker}`}</Label>
          <Input type="number" placeholder={field.placeholder || "Ej. 10"} />
        </div>
      )
    case "date":
      return (
        <div className="space-y-2">
          <Label>{`${field.label}${requiredMarker}`}</Label>
          <DatePicker />
        </div>
      )
    default:
      return null
  }
}
