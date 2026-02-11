import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, CircleDot, Hand, Hash, Type } from "lucide-react"

function EmptyFormPlaceholder() {
  return (
    <section className="rounded-xl flex flex-col justify-center items-center bg-white h-full p-6 md:p-10">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-dashed bg-background px-6 py-12 text-center">
        <div className="mb-4 rounded-full border bg-white p-3 text-zinc-700">
          <Hand className="size-6" />
        </div>
        <p className="text-base font-semibold text-zinc-900">Arrastra y suelta campos aqui</p>
        <p className="mt-2 text-sm text-zinc-600">
          Elige un tipo de campo en la columna izquierda y sueltalo en el canvas para empezar a construir tu formulario.
        </p>
        <p className="mt-4 text-xs text-zinc-500">
          Tambien podras hacer click en un campo para agregarlo automaticamente.
        </p>
      </div>
    </section>
  )
}

export default function NewFormPage() {
  // TODO: Implement data fetching and display accordingly
  const hasFields = false

  if (!hasFields) {
    return <EmptyFormPlaceholder />
  }

  return (
    <div className="space-y-3">

      <article className="rounded-xl border bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-zinc-800">
          <Type className="size-4" />
          <h3 className="text-sm font-semibold">Texto corto</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preview-name">Nombre completo</Label>
          <Input id="preview-name" placeholder="Escribe tu nombre" />
        </div>
      </article>

      <article className="rounded-xl border bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-zinc-800">
          <CircleDot className="size-4" />
          <h3 className="text-sm font-semibold">Seleccion unica</h3>
        </div>
        <p className="mb-2 text-sm font-medium text-zinc-900">Tipo de consulta</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="radio" name="query-type" />
            General
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="radio" name="query-type" />
            Tecnica
          </label>
        </div>
      </article>

      <article className="rounded-xl border bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-zinc-800">
          <Hash className="size-4" />
          <h3 className="text-sm font-semibold">Numero</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preview-age">Edad</Label>
          <Input id="preview-age" type="number" placeholder="Ej. 30" />
        </div>
      </article>

      <article className="rounded-xl border bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-zinc-800">
          <Calendar className="size-4" />
          <h3 className="text-sm font-semibold">Fecha</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preview-date">Fecha de nacimiento</Label>
          <Input id="preview-date" type="date" />
        </div>
      </article>

      <article className="rounded-xl border bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-zinc-900">Seleccion multiple</p>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox id="preview-opt-a" />
            <Label htmlFor="preview-opt-a">Opcion A</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="preview-opt-b" />
            <Label htmlFor="preview-opt-b">Opcion B</Label>
          </div>
        </div>
      </article>
    </div>
  )
}
