import Link from "next/link"
import { ArrowLeft, Calendar, CheckSquare, CircleDot, Hash, Type, Send, Eye, CircleCheck, FileQuestionMark } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const fieldTypes = [
    { id: "short-text", label: "Texto corto", icon: Type },
    { id: "long-text", label: "Texto largo", icon: Type },
    { id: "single-select", label: "Seleccion unica", icon: CircleDot },
    { id: "multi-select", label: "Seleccion multiple", icon: CheckSquare },
    { id: "number", label: "Numero", icon: Hash },
    { id: "date", label: "Fecha", icon: Calendar },
]

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
                        {/* TODO: add logic for auto-saving form */}
                        <Badge variant={"ghost"} className="text-primary"><CircleCheck data-icon={"inline-start"} />Auto guardado</Badge>
                        <Button type="button" variant="ghost" size={"sm"}>
                            <Eye data-icon="inline-start" />Vista previa
                        </Button>
                        <Button type="button" size="sm">
                            <Send data-icon="inline-start" />Publicar
                        </Button>
                    </div>
                </header>

                <div className="grid min-h-0 flex-1 gap-3 pt-3 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
                    <aside className="min-h-0 overflow-y-auto rounded-2xl border bg-zinc-50 p-4">
                        <div className="mb-4">
                            <h2 className="text-base font-semibold text-zinc-900">Tipos de campos</h2>
                            <p className="text-sm text-zinc-500">Arrastra o haz click para agregar</p>
                            <Separator className="mt-3 mb-6" />

                        </div>

                        <div className="space-y-2 flex flex-col">
                            {fieldTypes.map(({ id, label, icon: Icon }) => (
                                <Button
                                    key={id}
                                    variant={"outline"}
                                    className="border-l-primary border-l-3"
                                >
                                    <Icon className="size-4" />
                                    <span>{label}</span>
                                </Button>
                            ))}
                        </div>
                    </aside>

                    <section className="min-h-0 overflow-hidden rounded-2xl border bg-zinc-50 p-4 flex flex-col">
                        <div className="rounded-xl border border-b-primary border-b-3 bg-white px-4 py-10 text-center">
                            <h1 className="text-2xl font-semibold text-zinc-900">Formulario sin titulo</h1>
                            <p className="mt-2 text-sm text-zinc-500">
                                Click para editar la descripcion del formulario
                            </p>
                        </div>

                        <div className="mt-4 min-h-0 flex-1 overflow-y-auto">{children}</div>
                    </section>

                    <aside className="min-h-0 overflow-y-auto rounded-2xl border bg-zinc-50 p-4 flex flex-col">
                        <h2 className="text-base font-semibold text-zinc-900 text-center">Propiedades del campo</h2>
                        <p className="mt-1 text-sm text-zinc-500 text-center">Configura un campo seleccionado</p>
                        <Separator className="my-3" />
                        <div className="flex flex-1 flex-col items-center justify-center">
                            <FileQuestionMark size={50} />
                            <p className="text-base text-zinc-900 font-semibold">Ningun campo seleccionado</p>
                            <p className="text-sm text-zinc-700 text-center">Selecciona un campo del canvas y configura sus propiedades</p>
                        </div>
                        {/* Field properties */}
                        {/* <div className="mt-5 space-y-4 rounded-xl border bg-white p-4">
                        <div className="space-y-2">
                            <Label htmlFor="field-label">Etiqueta (label)</Label>
                            <Input id="field-label" placeholder="Ej. Nombre completo" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="field-placeholder">Placeholder (opcional)</Label>
                            <Input id="field-placeholder" placeholder="Ej. Escribe aqui..." />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox id="field-required" />
                            <Label htmlFor="field-required">Campo obligatorio</Label>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label htmlFor="option-1">Opciones (seleccion)</Label>
                            <Input id="option-1" placeholder="Opcion 1" />
                            <Input id="option-2" placeholder="Opcion 2" />
                            <Button type="button" variant="outline" size="sm" className="w-full">
                                + Agregar opcion
                            </Button>
                        </div>
                    </div> */}
                    </aside>
                </div>
            </div>
        </div>
    )
}
