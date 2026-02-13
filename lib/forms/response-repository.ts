import "server-only"

import { createClient } from "@/lib/supabase/server"
import {
  formAnswersValidator,
  type CreateFormResponseInput,
  type FormResponseRecord,
} from "@/lib/forms/types"

const FORM_RESPONSES_TABLE = "form_responses"

type FormResponseRow = {
  id: string
  form_id: string
  answers: unknown
  submitted_at: string
  created_at: string
  ip: string | null
  user_agent: string | null
}

function mapRowToFormResponse(row: FormResponseRow): FormResponseRecord {
  const parsedAnswers = formAnswersValidator.safeParse(row.answers)

  return {
    id: row.id,
    formId: row.form_id,
    answers: parsedAnswers.success ? parsedAnswers.data : {},
    submittedAt: row.submitted_at,
    createdAt: row.created_at,
    ip: row.ip,
    userAgent: row.user_agent,
  }
}

export async function createFormResponse(input: CreateFormResponseInput): Promise<FormResponseRecord> {
  const supabase = await createClient()
  const parsedAnswers = formAnswersValidator.safeParse(input.answers)

  if (!parsedAnswers.success) {
    throw new Error("Respuestas invalidas para guardar")
  }

  const { data, error } = await supabase
    .from(FORM_RESPONSES_TABLE)
    .insert({
      form_id: input.formId,
      answers: parsedAnswers.data,
      ip: input.ip ?? null,
      user_agent: input.userAgent ?? null,
    })
    .select("id, form_id, answers, submitted_at, created_at, ip, user_agent")
    .single()

  if (error) {
    throw new Error(`No se pudo guardar la respuesta: ${error.message}`)
  }

  return mapRowToFormResponse(data as FormResponseRow)
}

export async function listFormResponsesByFormId(formId: string, limit = 50): Promise<FormResponseRecord[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from(FORM_RESPONSES_TABLE)
    .select("id, form_id, answers, submitted_at, created_at, ip, user_agent")
    .eq("form_id", formId)
    .order("submitted_at", { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`No se pudieron listar respuestas: ${error.message}`)
  }

  return (data ?? []).map((row) => mapRowToFormResponse(row as FormResponseRow))
}

