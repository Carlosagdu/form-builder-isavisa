import type { FormFieldSchema, FormResponseRecord } from "@/lib/forms/types"

export type SelectionDistributionItem = {
  option: string
  count: number
}

export type SelectionFieldDistribution = {
  fieldId: string
  fieldLabel: string
  fieldType: "single-select" | "multi-select"
  totalResponses: number
  distribution: SelectionDistributionItem[]
}

function sortDistribution(items: SelectionDistributionItem[]) {
  return [...items].sort((a, b) => b.count - a.count || a.option.localeCompare(b.option))
}

export function buildSelectionDistributions(
  fields: FormFieldSchema[],
  responses: FormResponseRecord[]
): SelectionFieldDistribution[] {
  const selectionFields = fields.filter(
    (field): field is FormFieldSchema & { type: "single-select" | "multi-select" } =>
      field.type === "single-select" || field.type === "multi-select"
  )

  return selectionFields.map((field) => {
    const counts = new Map<string, number>(field.options.map((option) => [option, 0]))
    let totalResponses = 0

    for (const response of responses) {
      const rawValue = response.answers[field.id]

      if (field.type === "single-select") {
        if (typeof rawValue !== "string") continue
        const selectedOption = rawValue.trim()
        if (!selectedOption) continue

        totalResponses += 1
        counts.set(selectedOption, (counts.get(selectedOption) ?? 0) + 1)
        continue
      }

      if (field.type === "multi-select") {
        if (!Array.isArray(rawValue)) continue
        const selectedOptions = rawValue.filter((item): item is string => typeof item === "string")
        if (selectedOptions.length === 0) continue

        totalResponses += 1
        for (const option of selectedOptions) {
          counts.set(option, (counts.get(option) ?? 0) + 1)
        }
      }
    }

    return {
      fieldId: field.id,
      fieldLabel: field.label,
      fieldType: field.type,
      totalResponses,
      distribution: sortDistribution(
        Array.from(counts.entries()).map(([option, count]) => ({ option, count }))
      ),
    }
  })
}

