import Link from "next/link"
import { ArrowLeft, CircleCheck, Eye, Send } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function NewFormLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen overflow-hidden">
      <div className="flex h-full min-h-0 flex-col border bg-white p-3 md:p-4">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          <div className="flex items-center gap-3">
            <Button asChild size="sm">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Volver a formularios
              </Link>
            </Button>
            <Separator orientation="vertical" className="hidden sm:block" />
            <p className="text-lg font-semibold text-zinc-900">Nuevo Formulario</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="ghost" className="text-primary">
              <CircleCheck data-icon="inline-start" />
              Auto guardado
            </Badge>
            <Button type="button" variant="ghost" size="sm">
              <Eye data-icon="inline-start" />
              Vista previa
            </Button>
            <Button type="button" size="sm">
              <Send data-icon="inline-start" />
              Publicar
            </Button>
          </div>
        </header>

        <main className="min-h-0 flex-1 pt-3">{children}</main>
      </div>
    </div>
  )
}
