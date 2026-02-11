import { Calendar, CircleDot, Hash, Type } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewFormPage() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-white p-4">
        <p className="text-sm font-semibold text-zinc-900">Campos del formulario</p>
        <p className="mt-1 text-xs text-zinc-500">
          Contenido inicial estatico para maqueta (sin logica dinamica).
        </p>
      </div>

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
