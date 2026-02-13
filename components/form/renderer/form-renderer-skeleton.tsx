import { Skeleton } from "@/components/ui/skeleton"

export function FormRendererSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <section className="rounded-2xl border bg-white p-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </section>

      <section className="space-y-6 rounded-2xl border bg-white p-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </section>
    </div>
  )
}

