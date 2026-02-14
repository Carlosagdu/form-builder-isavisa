export const formThemeValues = ["classic", "ocean", "sunset"] as const

export type FormThemeId = (typeof formThemeValues)[number]

export type FormThemeOption = {
  id: FormThemeId
  label: string
  description: string
}

type FormThemeStyles = {
  pageBg: string
  card: string
  title: string
  description: string
}

export const formThemeOptions: FormThemeOption[] = [
  {
    id: "classic",
    label: "Clasico",
    description: "Limpio y neutral",
  },
  {
    id: "ocean",
    label: "Ocean",
    description: "Acentos azules suaves",
  },
  {
    id: "sunset",
    label: "Sunset",
    description: "Acentos calidos",
  },
]

const formThemeStylesMap: Record<FormThemeId, FormThemeStyles> = {
  classic: {
    pageBg: "bg-zinc-50",
    card: "border bg-white",
    title: "text-zinc-900",
    description: "text-zinc-600",
  },
  ocean: {
    pageBg: "bg-cyan-50",
    card: "border-cyan-200 bg-white",
    title: "text-cyan-950",
    description: "text-cyan-800",
  },
  sunset: {
    pageBg: "bg-amber-50",
    card: "border-amber-200 bg-white",
    title: "text-amber-950",
    description: "text-amber-800",
  },
}

export function getFormThemeStyles(theme: FormThemeId): FormThemeStyles {
  return formThemeStylesMap[theme] ?? formThemeStylesMap.classic
}
