"use client"

import { useMemo, useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { FormFieldSchema, FormResponseRecord } from "@/lib/forms/types"

type ResponseRow = {
  id: string
  submittedAt: string
  answers: Record<string, unknown>
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Fecha desconocida"
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function formatAnswerValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ") || "Sin valor"
  }

  if (typeof value === "string") {
    return value.trim() || "Sin valor"
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  if (value === null || value === undefined) {
    return "Sin valor"
  }

  return JSON.stringify(value)
}

export function ResponsesDataTable({
  responses,
  fields,
}: {
  responses: FormResponseRecord[]
  fields: FormFieldSchema[]
}) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "submittedAt", desc: true }])

  const data = useMemo<ResponseRow[]>(
    () =>
      responses.map((response) => ({
        id: response.id,
        submittedAt: response.submittedAt,
        answers: response.answers,
      })),
    [responses]
  )

  const columns = useMemo<ColumnDef<ResponseRow>[]>(
    () => {
      const baseColumns: ColumnDef<ResponseRow>[] = [
        {
          accessorKey: "submittedAt",
          header: "Fecha",
          cell: ({ row }) => <span className="text-zinc-600">{formatDate(row.original.submittedAt)}</span>,
        },
      ]

      const fieldColumns = fields.map<ColumnDef<ResponseRow>>((field) => ({
        id: field.id,
        header: field.label,
        cell: ({ row }) => (
          <span className="line-clamp-1 text-zinc-700">
            {formatAnswerValue(row.original.answers[field.id])}
          </span>
        ),
      }))

      return [...baseColumns, ...fieldColumns]
    },
    [fields]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-zinc-500">
                  Sin respuestas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
