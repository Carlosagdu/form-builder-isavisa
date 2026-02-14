import { Suspense } from "react"
import Link from "next/link"

import { FiltersBar } from "@/components/home/filters-bar"
import { FormGridSkeleton } from "@/components/home/form-grid-skeleton"
import { FormsGrid } from "@/components/home/forms-grid"
import { ResponsesBroadcastListener } from "@/components/home/responses-broadcast-listener"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <Button asChild className="md:hidden">
        <Link href="/form/new">+ Nuevo formulario</Link>
      </Button>

      <FiltersBar className="hidden md:block" />
      {user?.id ? <ResponsesBroadcastListener ownerId={user.id} /> : null}

      <Suspense fallback={<FormGridSkeleton />}>
        <FormsGrid />
      </Suspense>
    </div>
  )
}
