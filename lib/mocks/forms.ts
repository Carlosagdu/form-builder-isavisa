export type FormCardStatus = "published" | "draft" | "archived"

export interface FormCardData {
  id: string
  title: string
  description: string
  status: FormCardStatus
  createdAtLabel: string
  submissionsCount: number
}