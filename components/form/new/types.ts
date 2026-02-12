import { Calendar, CheckSquare, CircleDot, Hash, Type } from "lucide-react"

export const fieldTypes = [
  { id: "short-text", label: "Texto corto", icon: Type },
  { id: "long-text", label: "Texto largo", icon: Type },
  { id: "single-select", label: "Seleccion unica", icon: CircleDot },
  { id: "multi-select", label: "Seleccion multiple", icon: CheckSquare },
  { id: "number", label: "Numero", icon: Hash },
  { id: "date", label: "Fecha", icon: Calendar },
] as const

export type FieldType = (typeof fieldTypes)[number]
export type FieldTypeId = FieldType["id"]

export type FormField = {
  id: string
  type: FieldTypeId
  label: string
  placeholder: string
  required: boolean
  options: string[]
}

export const canvasId = "form-canvas"

export function defaultLabelByType(type: FieldTypeId) {
  switch (type) {
    case "short-text":
      return "Texto corto"
    case "long-text":
      return "Texto largo"
    case "single-select":
      return "Seleccion unica"
    case "multi-select":
      return "Seleccion multiple"
    case "number":
      return "Numero"
    case "date":
      return "Fecha"
    default:
      return "Campo"
  }
}

export function supportsOptions(type: FieldTypeId) {
  return type === "single-select" || type === "multi-select"
}

export function supportsPlaceholder(type: FieldTypeId) {
  return type === "short-text" || type === "long-text" || type === "number"
}
