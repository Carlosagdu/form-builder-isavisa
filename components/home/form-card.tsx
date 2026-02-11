import { CalendarDays, Eye, PencilLine, Trash2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { FormCardData } from "@/lib/mocks/forms"
import { cn } from "@/lib/utils"

interface FormCardProps {
  form: FormCardData
}

const STATUS_STYLES: Record<FormCardData["status"], string> = {
  published: "bg-emerald-50 text-emerald-700",
  draft: "bg-amber-50 text-amber-700",
}

const STATUS_LABEL: Record<FormCardData["status"], string> = {
  published: "Published",
  draft: "Draft",
}

export function FormCard({ form }: FormCardProps) {
  return (
    <Card className="h-100 md:h-75 gap-0 overflow-hidden rounded-2xl py-0">
      <CardHeader className="grid-cols-[1fr_auto] px-6 pt-6 pb-4">
        <CardTitle className="pr-3 text-xl font-bold tracking-tight text-zinc-900">
          {form.title}
        </CardTitle>
        <span
          className={cn(
            "inline-flex h-fit items-center rounded-full px-3 py-1 text-xs font-semibold",
            STATUS_STYLES[form.status]
          )}
        >
          {STATUS_LABEL[form.status]}
        </span>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-6 pb-4">
        <p className="flex-1 overflow-hidden text-base leading-6 text-zinc-600">
          {form.description}
        </p>

        <div className="mt-3 space-y-2 text-base text-zinc-700">
          <p className="flex text-sm items-center gap-2">
            <CalendarDays className="h-4 w-4 text-red-400" />
            <span>Created on {form.createdAtLabel}</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="justify-between border-t px-6 py-4">
        <p className="flex items-center gap-2 text-base font-semibold text-zinc-900">
          <Users className="h-5 w-5 text-orange-500" />
          {form.submissionsCount} Responses
        </p>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={`Delete ${form.title}`}
            className="text-rose-500 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={`Preview ${form.title}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={`Edit ${form.title}`}
          >
            <PencilLine className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
