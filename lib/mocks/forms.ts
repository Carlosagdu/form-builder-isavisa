export type FormCardStatus = "published" | "draft"

export interface FormCardData {
  id: string
  title: string
  description: string
  status: FormCardStatus
  createdAtLabel: string
  submissionsCount: number
}

export const mockFormCards: FormCardData[] = [
  {
    id: "employee-onboarding-form",
    title: "Employee Onboarding Form",
    description:
      "Collect required information from new hires including personal details, role data, and compliance documents.",
    status: "published",
    createdAtLabel: "November 12, 2025",
    submissionsCount: 67,
  },
  {
    id: "customer-satisfaction-survey",
    title: "Customer Satisfaction Survey",
    description:
      "Measure post-sale customer experience and identify opportunities to improve service quality.",
    status: "draft",
    createdAtLabel: "January 22, 2026",
    submissionsCount: 14,
  },
  {
    id: "it-support-request-form",
    title: "IT Support Request Form",
    description:
      "Allow employees to report technical issues, request access, and track internal support needs.",
    status: "published",
    createdAtLabel: "February 3, 2026",
    submissionsCount: 98,
  },
]
