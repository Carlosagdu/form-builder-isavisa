"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import {
  createDraftForm,
  deleteForm,
  getFormById,
  getPublishedFormById,
  listFormsByOwner,
  updateForm,
} from "@/lib/forms/repository"
import { createFormResponse } from "@/lib/forms/response-repository"
import { formAnswersValidator, formSchemaValidator, formStatusValues } from "@/lib/forms/types"

type ActionSuccess<T> = {
  ok: true
  data: T
}

type ActionFailure = {
  ok: false
  error: string
}

export type FormActionResult<T> = ActionSuccess<T> | ActionFailure

const createDraftInputSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(formStatusValues).optional(),
    schema: formSchemaValidator.optional(),
  })
  .optional()

const updateFormInputSchema = z.object({
  id: z.uuid(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(formStatusValues).optional(),
  schema: formSchemaValidator.optional(),
})

const listFormsInputSchema = z.object({
  limit: z.number().int().min(1).max(100).optional(),
})

const submitFormResponseInputSchema = z.object({
  formId: z.uuid(),
  answers: formAnswersValidator,
  ip: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
})

function actionErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }
  return "Ocurrio un error inesperado"
}

export async function listFormsAction(input?: {
  limit?: number
}): Promise<FormActionResult<Awaited<ReturnType<typeof listFormsByOwner>>>> {
  const parsed = listFormsInputSchema.safeParse(input ?? {})
  if (!parsed.success) {
    return { ok: false, error: "Parametros invalidos para listar formularios" }
  }

  try {
    const forms = await listFormsByOwner(parsed.data.limit ?? 20)
    return { ok: true, data: forms }
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) }
  }
}

export async function getFormByIdAction(formId: string): Promise<FormActionResult<Awaited<ReturnType<typeof getFormById>>>> {
  if (!z.uuid().safeParse(formId).success) {
    return { ok: false, error: "El id del formulario es invalido" }
  }

  try {
    const form = await getFormById(formId)
    return { ok: true, data: form }
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) }
  }
}

export async function createDraftFormAction(
  input?: {
    title?: string
    description?: string
    status?: (typeof formStatusValues)[number]
    schema?: z.infer<typeof formSchemaValidator>
  }
): Promise<FormActionResult<Awaited<ReturnType<typeof createDraftForm>>>> {
  const parsed = createDraftInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Datos invalidos para crear formulario" }
  }

  try {
    const form = await createDraftForm(parsed.data)
    revalidatePath("/")
    revalidatePath("/form/new")
    return { ok: true, data: form }
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) }
  }
}

export async function updateFormAction(
  input: z.infer<typeof updateFormInputSchema>
): Promise<FormActionResult<Awaited<ReturnType<typeof updateForm>>>> {
  const parsed = updateFormInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Datos invalidos para actualizar formulario" }
  }

  try {
    const form = await updateForm(parsed.data)
    revalidatePath("/")
    revalidatePath("/form/new")
    return { ok: true, data: form }
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) }
  }
}

export async function deleteFormAction(formId: string): Promise<FormActionResult<{ id: string }>> {
  if (!z.uuid().safeParse(formId).success) {
    return { ok: false, error: "El id del formulario es invalido" }
  }

  try {
    await deleteForm(formId)
    revalidatePath("/")
    return { ok: true, data: { id: formId } }
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) }
  }
}

export async function submitFormResponseAction(
  input: z.infer<typeof submitFormResponseInputSchema>
): Promise<{ ok: true } | ActionFailure> {
  const parsed = submitFormResponseInputSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "Datos invalidos para enviar respuesta" }
  }

  try {
    const form = await getPublishedFormById(parsed.data.formId)
    if (!form) {
      return { ok: false, error: "El formulario no existe o no esta publicado" }
    }

    await createFormResponse({
      formId: parsed.data.formId,
      answers: parsed.data.answers,
      ip: parsed.data.ip,
      userAgent: parsed.data.userAgent,
    })

    revalidatePath(`/form/${parsed.data.formId}`)
    return { ok: true }
  } catch (error) {
    return { ok: false, error: actionErrorMessage(error) }
  }
}
