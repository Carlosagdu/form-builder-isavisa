"use client";

import { useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ViewMode = "mosaic" | "list";

export function FiltersBar({ className }: { className?: string }) {
  const [viewMode, setViewMode] = useState<ViewMode>("mosaic");

  return (
    <section className={cn("space-y-6 rounded-md border bg-white p-2 md:p-4", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="search"
              placeholder="Buscar formularios..."
              className="bg-white pl-9"
            />
          </div>

          <div className="w-full md:w-56">
            <Select defaultValue="all_status">
              <SelectTrigger
                aria-label="Filtrar por estado"
                className="w-full bg-white"
              >
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="all_status">All status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          <span className="text-sm text-zinc-600">Ver como</span>
          <div className="flex items-center gap-1 rounded-md border bg-white p-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setViewMode("mosaic")}
              className={cn(
                "h-8 border-transparent px-3 shadow-none",
                viewMode === "mosaic" &&
                  "border-primary bg-primary text-white hover:bg-primary/90 hover:text-white"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              Mosaico
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setViewMode("list")}
              className={cn(
                "h-8 border-transparent px-3 shadow-none",
                viewMode === "list" &&
                  "border-primary bg-primary text-white hover:bg-primary/90 hover:text-white"
              )}
            >
              <List className="h-4 w-4" />
              Lista
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
