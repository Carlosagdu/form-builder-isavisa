import { Suspense } from "react"
import Link from "next/link"

import { FiltersBar } from "@/components/home/filters-bar"
import { FormGridSkeleton } from "@/components/home/form-grid-skeleton"
import { FormsGrid } from "@/components/home/forms-grid"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <Button asChild className="md:hidden">
        <Link href="/form/new">+ Nuevo formulario</Link>
      </Button>

      <FiltersBar className="hidden md:block" />

      <Suspense fallback={<FormGridSkeleton />}>
        <FormsGrid />
      </Suspense>
    </div>
  )
}
