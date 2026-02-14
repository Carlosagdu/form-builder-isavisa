import { Suspense } from "react"

import { NewFormHeader } from "@/components/form/new/new-form-header"

export default function NewFormPage() {
  return (
    <Suspense fallback={<div className="h-full w-full bg-white" />}>
      <NewFormHeader />
    </Suspense>
  )
}
