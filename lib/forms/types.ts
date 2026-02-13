import { z } from "zod"

export const formFieldTypeIds = [
  "short-text",
  "long-text",
  "single-select",
  "multi-select",
  "number",
  "date",
] as const

export const formStatusValues = ["draft", "published", "archived"] as const

export type FormFieldTypeId = (typeof formFieldTypeIds)[number]
export type FormStatus = (typeof formStatusValues)[number]

export type FormFieldSchema = {
  id: string
  type: FormFieldTypeId
  label: string
  placeholder: string
  required: boolean
  options: string[]
}

export type FormSchema = {
  version: number
  fields: FormFieldSchema[]
}

export type FormRecord = {
  id: string
  ownerId: string
  title: string
  description: string
  status: FormStatus
  schema: FormSchema
  createdAt: string
  updatedAt: string
}

export type CreateFormInput = {
  title?: string
  description?: string
  status?: FormStatus
  schema?: FormSchema
}

export type UpdateFormInput = {
  id: string
  title?: string
  description?: string
  status?: FormStatus
  schema?: FormSchema
}

const formFieldTypeIdSchema = z.enum(formFieldTypeIds)

const formFieldSchema = z.object({
  id: z.string().min(1),
  type: formFieldTypeIdSchema,
  label: z.string().min(1),
  placeholder: z.string(),
  required: z.boolean(),
  options: z.array(z.string()),
})

export const formSchemaValidator = z.object({
  version: z.number().int().positive(),
  fields: z.array(formFieldSchema),
})

export const defaultFormSchema: FormSchema = {
  version: 1,
  fields: [],
}

export function parseFormSchema(value: unknown): FormSchema {
  const parsed = formSchemaValidator.safeParse(value)
  if (!parsed.success) {
    return defaultFormSchema
  }

  return parsed.data
}

