import { Skeleton } from "@/components/ui/skeleton"

type FormGridSkeletonProps = {
  count?: number
}

function FormCardSkeleton() {
  return (
    <article className="h-100 rounded-2xl border bg-white p-6 md:h-70">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      <div className="mt-6">
        <Skeleton className="h-4 w-36" />
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-4">
        <Skeleton className="h-5 w-28" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </div>
    </article>
  )
}

export function FormGridSkeleton({ count = 6 }: FormGridSkeletonProps) {
  return (
    <section className="grid min-h-0 flex-1 auto-rows-max content-start grid-cols-1 gap-x-4 gap-y-4 overflow-y-auto pr-1 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <FormCardSkeleton key={index} />
      ))}
    </section>
  )
}

