import "server-only"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"
import {
  defaultFormSchema,
  parseFormSchema,
  type CreateFormInput,
  type FormRecord,
  type FormSchema,
  type FormStatus,
  type UpdateFormInput,
} from "@/lib/forms/types"

const FORMS_TABLE = "forms"

type FormRow = {
  id: string
  owner_id: string
  title: string
  description: string
  status: FormStatus
  schema: unknown
  created_at: string
  updated_at: string
}

function mapRowToForm(row: FormRow): FormRecord {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description,
    status: row.status,
    schema: parseFormSchema(row.schema),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function getSupabaseServiceEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  }

  return { url, serviceRoleKey }
}

async function requireAuthenticatedUserId() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw new Error(`No se pudo validar la sesion: ${error.message}`)
  }

  if (!user) {
    throw new Error("Usuario no autenticado")
  }

  return { supabase, userId: user.id }
}

export async function listFormsByOwner(limit = 20): Promise<FormRecord[]> {
  const { supabase, userId } = await requireAuthenticatedUserId()

  const { data, error } = await supabase
    .from(FORMS_TABLE)
    .select("id, owner_id, title, description, status, schema, created_at, updated_at")
    .eq("owner_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`No se pudieron listar formularios: ${error.message}`)
  }

  return (data ?? []).map((row) => mapRowToForm(row as FormRow))
}

export async function getFormById(formId: string): Promise<FormRecord | null> {
  const { supabase, userId } = await requireAuthenticatedUserId()

  const { data, error } = await supabase
    .from(FORMS_TABLE)
    .select("id, owner_id, title, description, status, schema, created_at, updated_at")
    .eq("id", formId)
    .eq("owner_id", userId)
    .maybeSingle()

  if (error) {
    throw new Error(`No se pudo obtener el formulario: ${error.message}`)
  }

  if (!data) {
    return null
  }

  return mapRowToForm(data as FormRow)
}

export async function createDraftForm(input?: CreateFormInput): Promise<FormRecord> {
  const { supabase, userId } = await requireAuthenticatedUserId()
  const title = input?.title?.trim() || "Formulario sin titulo"
  const description = input?.description?.trim() || ""
  const status = input?.status ?? "draft"
  const schema: FormSchema = input?.schema ?? defaultFormSchema

  const { data, error } = await supabase
    .from(FORMS_TABLE)
    .insert({
      owner_id: userId,
      title,
      description,
      status,
      schema,
    })
    .select("id, owner_id, title, description, status, schema, created_at, updated_at")
    .single()

  if (error) {
    throw new Error(`No se pudo crear el formulario: ${error.message}`)
  }

  return mapRowToForm(data as FormRow)
}

export async function updateForm(input: UpdateFormInput): Promise<FormRecord> {
  const { supabase, userId } = await requireAuthenticatedUserId()

  const payload: {
    title?: string
    description?: string
    status?: FormStatus
    schema?: FormSchema
  } = {}

  if (input.title !== undefined) {
    payload.title = input.title.trim() || "Formulario sin titulo"
  }

  if (input.description !== undefined) {
    payload.description = input.description.trim()
  }

  if (input.status !== undefined) {
    payload.status = input.status
  }

  if (input.schema !== undefined) {
    payload.schema = input.schema
  }

  const { data, error } = await supabase
    .from(FORMS_TABLE)
    .update(payload)
    .eq("id", input.id)
    .eq("owner_id", userId)
    .select("id, owner_id, title, description, status, schema, created_at, updated_at")
    .single()

  if (error) {
    throw new Error(`No se pudo actualizar el formulario: ${error.message}`)
  }

  return mapRowToForm(data as FormRow)
}

export async function deleteForm(formId: string): Promise<void> {
  const { supabase, userId } = await requireAuthenticatedUserId()

  const { error } = await supabase.from(FORMS_TABLE).delete().eq("id", formId).eq("owner_id", userId)

  if (error) {
    throw new Error(`No se pudo eliminar el formulario: ${error.message}`)
  }
}

export async function getPublishedFormById(formId: string): Promise<FormRecord | null> {
  const { url, serviceRoleKey } = getSupabaseServiceEnv()
  const supabase = createSupabaseClient(url, serviceRoleKey)

  const { data, error } = await supabase
    .from(FORMS_TABLE)
    .select("id, owner_id, title, description, status, schema, created_at, updated_at")
    .eq("id", formId)
    .eq("status", "published")
    .maybeSingle()

  if (error) {
    throw new Error(`No se pudo obtener el formulario publicado: ${error.message}`)
  }

  if (!data) {
    return null
  }

  return mapRowToForm(data as FormRow)
}
