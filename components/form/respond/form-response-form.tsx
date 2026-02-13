"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"

import { submitFormResponseAction } from "@/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import type { FormFieldSchema } from "@/lib/forms/types"
import { cn } from "@/lib/utils"
import { CircleCheckBig } from "lucide-react"

type AnswersState = Record<string, unknown>

function requiredMarker(required: boolean) {
  return required ? " *" : ""
}

function parseDateValue(value: unknown) {
  if (typeof value !== "string" || value.length === 0) {
    return undefined
  }

  const parsed = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed
}

export function FormResponseForm({
  formId,
  title,
  description,
  fields,
}: {
  formId: string
  title: string
  description: string
  fields: FormFieldSchema[]
}) {
  const [answers, setAnswers] = useState<AnswersState>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const hasFields = fields.length > 0

  const canSubmit = useMemo(() => hasFields && !isSubmitting, [hasFields, isSubmitting])

  const setAnswer = (fieldId: string, value: unknown) => {
    setAnswers((current) => ({ ...current, [fieldId]: value }))
  }

  const toggleMultiSelectOption = (fieldId: string, option: string, checked: boolean) => {
    const currentValues = Array.isArray(answers[fieldId]) ? (answers[fieldId] as string[]) : []
    const nextValues = checked ? [...currentValues, option] : currentValues.filter((value) => value !== option)
    setAnswer(fieldId, nextValues)
  }

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    setIsSubmitting(true)
    const result = await submitFormResponseAction({
      formId,
      answers,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    })

    if (!result.ok) {
      toast.error(result.error, { position: "top-center" })
      setIsSubmitting(false)
      return
    }

    toast.success("Respuesta enviada correctamente", { position: "top-center" })
    setAnswers({})
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <section className="rounded-2xl border bg-white p-6">
        <h1 className="text-2xl font-semibold text-zinc-900">{title.trim() || "Formulario sin titulo"}</h1>
        <p className="mt-2 text-sm text-zinc-600">{description.trim() || "Sin descripcion"}</p>
      </section>

      {isSubmitted ? (
        <Alert className="rounded-2xl border bg-white p-4">
          <CircleCheckBig className="text-emerald-600" />
          <AlertTitle>Gracias por responder</AlertTitle>
          <AlertDescription>
            Tu respuesta fue enviada correctamente.
          </AlertDescription>
        </Alert>
      ) : (
      <form className="space-y-6 rounded-2xl border bg-white p-6" onSubmit={handleSubmit}>
        {hasFields ? (
          fields.map((field) => {
            switch (field.type) {
              case "short-text":
                return (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{`${field.label}${requiredMarker(field.required)}`}</Label>
                    <Input
                      id={field.id}
                      value={typeof answers[field.id] === "string" ? String(answers[field.id]) : ""}
                      onChange={(event) => setAnswer(field.id, event.target.value)}
                      placeholder={field.placeholder || "Escribe aqui"}
                    />
                  </div>
                )
              case "long-text":
                return (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{`${field.label}${requiredMarker(field.required)}`}</Label>
                    <Textarea
                      id={field.id}
                      value={typeof answers[field.id] === "string" ? String(answers[field.id]) : ""}
                      onChange={(event) => setAnswer(field.id, event.target.value)}
                      placeholder={field.placeholder || "Escribe aqui"}
                      className="min-h-24"
                    />
                  </div>
                )
              case "single-select":
                return (
                  <div key={field.id} className="space-y-2">
                    <Label>{`${field.label}${requiredMarker(field.required)}`}</Label>
                    <Select
                      value={typeof answers[field.id] === "string" ? String(answers[field.id]) : ""}
                      onValueChange={(value) => setAnswer(field.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={`${field.id}-${option}`} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              case "multi-select":
                return (
                  <div key={field.id} className="space-y-2">
                    <Label>{`${field.label}${requiredMarker(field.required)}`}</Label>
                    {field.options.map((option) => {
                      const values = Array.isArray(answers[field.id]) ? (answers[field.id] as string[]) : []
                      const checked = values.includes(option)
                      return (
                        <div key={`${field.id}-${option}`} className="flex items-center gap-2">
                          <Checkbox
                            id={`${field.id}-${option}`}
                            checked={checked}
                            onCheckedChange={(value) => toggleMultiSelectOption(field.id, option, Boolean(value))}
                          />
                          <Label htmlFor={`${field.id}-${option}`} className="font-normal">
                            {option}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                )
              case "number":
                return (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{`${field.label}${requiredMarker(field.required)}`}</Label>
                    <Input
                      id={field.id}
                      type="number"
                      value={typeof answers[field.id] === "string" ? String(answers[field.id]) : ""}
                      onChange={(event) => setAnswer(field.id, event.target.value)}
                      placeholder={field.placeholder || "Ej. 10"}
                    />
                  </div>
                )
              case "date":
                {
                  const selectedDate = parseDateValue(answers[field.id])
                  const displayLabel = selectedDate ? format(selectedDate, "PPP") : "Selecciona una fecha"

                  return (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>{`${field.label}${requiredMarker(field.required)}`}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id={field.id}
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-between text-left font-normal bg-white",
                              !selectedDate && "text-muted-foreground bg-white"
                            )}
                          >
                            {displayLabel}
                            <CalendarIcon className="size-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            // defaultMonth={date}
                            captionLayout="dropdown"
                            selected={selectedDate}
                            onSelect={(date) => setAnswer(field.id, date ? format(date, "yyyy-MM-dd") : "")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )
                }
              default:
                return null
            }
          })
        ) : (
          <p className="text-sm text-zinc-600">Este formulario no tiene campos para responder.</p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting && <Spinner data-icon="inline-start" />}
            Enviar respuesta
          </Button>
        </div>
      </form>
      )}
    </div>
  )
}
