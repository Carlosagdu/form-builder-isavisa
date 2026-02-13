import { FormRendererSkeleton } from "@/components/form/renderer/form-renderer-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function FormPreviewLoading() {
  return (
    <div className="h-screen overflow-y-auto bg-zinc-50 p-4 md:p-6">
      <div className="mx-auto mb-4 flex w-full max-w-3xl items-center justify-between">
        <Skeleton className="h-9 w-40 rounded-md" />
      </div>
      <FormRendererSkeleton />
    </div>
  )
}

