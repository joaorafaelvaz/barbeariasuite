"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UnitOption = {
  id: string
  name: string
  networkName: string
}

type UnitSelectorProps = {
  units: UnitOption[]
  selectedUnitId: string
  showAllOption: boolean
}

export function UnitSelector({
  units,
  selectedUnitId,
  showAllOption,
}: UnitSelectorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const selectedUnit = units.find((u) => u.id === selectedUnitId)
  const displayName =
    selectedUnitId === "all"
      ? "Todas as unidades"
      : selectedUnit?.name || "Selecionar unidade"

  if (units.length <= 1 && !showAllOption) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span>{units[0]?.name || "Sem unidade"}</span>
      </div>
    )
  }

  async function selectUnit(unitId: string) {
    setLoading(true)
    await fetch("/api/unit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unitId }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
        disabled={loading}
      >
        <Building2 className="h-4 w-4" />
        <span className="max-w-[200px] truncate">{displayName}</span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {showAllOption && (
          <>
            <DropdownMenuItem
              onClick={() => selectUnit("all")}
              className={selectedUnitId === "all" ? "bg-accent" : ""}
            >
              Todas as unidades
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {units.map((unit) => (
          <DropdownMenuItem
            key={unit.id}
            onClick={() => selectUnit(unit.id)}
            className={selectedUnitId === unit.id ? "bg-accent" : ""}
          >
            <div>
              <div className="font-medium">{unit.name}</div>
              <div className="text-xs text-muted-foreground">
                {unit.networkName}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
