import { Suspense } from "react"

import { FiltersBar } from "@/components/home/filters-bar"
import { FormGridSkeleton } from "@/components/home/form-grid-skeleton"
import { FormsGrid } from "@/components/home/forms-grid"

export default function Home() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <FiltersBar />

      <Suspense fallback={<FormGridSkeleton />}>
        <FormsGrid />
      </Suspense>
    </div>
  )
}
