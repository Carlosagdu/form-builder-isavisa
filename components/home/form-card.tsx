"use client"

import { CalendarDays, Copy, Eye, PencilLine, Users } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

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
  archived: "bg-sky-50 text-sky-700"
}

const STATUS_LABEL: Record<FormCardData["status"], string> = {
  published: "Published",
  draft: "Draft",
  archived: "Archived"
}

export function FormCard({ form }: FormCardProps) {
  const handleCopyLink = async () => {
    if (form.status !== "published") {
      toast.error("Solo puedes copiar enlaces de formularios publicados.", {
        position: "top-center",
      })
      return
    }

    try {
      await navigator.clipboard.writeText(`${window.location.origin}/form/${form.id}`)
      toast.success("Enlace copiado al portapapeles.", { position: "top-center" })
    } catch {
      toast.error("No se pudo copiar el enlace.", { position: "top-center" })
    }
  }

  return (
    <Card className="h-100 md:h-70 gap-0 overflow-hidden rounded-2xl py-0 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="grid-cols-[1fr_auto] px-6 pt-6 pb-4">
        <CardTitle className="pr-3 text-lg font-bold tracking-tight text-zinc-900">
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
        <p className="flex-1 overflow-hidden text-sm leading-6 text-zinc-600">
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
        <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
          <Users className="h-5 w-5 text-orange-500" />
          {form.submissionsCount} Responses
        </p>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={`Copiar enlace de ${form.title}`}
            className="text-rose-500 hover:text-rose-600"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            asChild
            aria-label={`Preview ${form.title}`}
          >
            <Link href={`/form/${form.id}/preview`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            asChild
            aria-label={`Edit ${form.title}`}
          >
            <Link href={`/form/new?draftId=${form.id}`}>
              <PencilLine className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
