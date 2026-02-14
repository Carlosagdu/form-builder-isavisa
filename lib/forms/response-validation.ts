import { z } from "zod"

import type { FormFieldSchema } from "@/lib/forms/types"

type AnswersState = Record<string, unknown>
type FieldErrorsState = Record<string, string>

function parseDateValue(value: string) {
  const parsed = new Date(`${value}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function buildFieldSchema(field: FormFieldSchema) {
  switch (field.type) {
    case "short-text":
    case "long-text": {
      if (field.required) {
        return z.string().trim().min(1, "Este campo es obligatorio.")
      }
      return z.string().optional()
    }
    case "number": {
      const base = z.string().trim()
      if (field.required) {
        return base
          .min(1, "Este campo es obligatorio.")
          .refine((value) => !Number.isNaN(Number(value)), "Ingresa un numero valido.")
      }
      return base.refine((value) => value.length === 0 || !Number.isNaN(Number(value)), "Ingresa un numero valido.")
    }
    case "date": {
      const base = z.string().trim()
      if (field.required) {
        return base
          .min(1, "Este campo es obligatorio.")
          .refine((value) => parseDateValue(value) !== null, "Selecciona una fecha valida.")
      }
      return base.refine((value) => value.length === 0 || parseDateValue(value) !== null, "Selecciona una fecha valida.")
    }
    case "single-select": {
      const base = z.string().trim()
      if (field.required) {
        return base
          .min(1, "Selecciona una opcion.")
          .refine((value) => field.options.includes(value), "Selecciona una opcion valida.")
      }
      return base.refine((value) => value.length === 0 || field.options.includes(value), "Selecciona una opcion valida.")
    }
    case "multi-select": {
      const base = z.array(z.string())
      if (field.required) {
        return base
          .min(1, "Selecciona al menos una opcion.")
          .refine((values) => values.every((option) => field.options.includes(option)), "Una o mas opciones seleccionadas no son validas.")
      }
      return base.refine((values) => values.every((option) => field.options.includes(option)), "Una o mas opciones seleccionadas no son validas.")
    }
    default:
      return z.unknown()
  }
}

function normalizeAnswerValue(field: FormFieldSchema, value: unknown) {
  if (value === undefined || value === null) {
    return field.type === "multi-select" ? [] : ""
  }

  if (field.type === "multi-select") {
    if (!Array.isArray(value)) return []
    return value.filter((item): item is string => typeof item === "string")
  }

  if (typeof value === "string") {
    return value
  }

  return ""
}

export function validateAnswersWithZod(fields: FormFieldSchema[], answers: AnswersState): FieldErrorsState {
  const errors: FieldErrorsState = {}

  for (const field of fields) {
    const schema = buildFieldSchema(field)
    const parsed = schema.safeParse(normalizeAnswerValue(field, answers[field.id]))
    if (!parsed.success) {
      errors[field.id] = parsed.error.issues[0]?.message ?? "Valor invalido."
    }
  }

  return errors
}

