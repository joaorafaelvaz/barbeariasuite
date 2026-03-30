"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, ChevronDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type UnitOption = { id: string; name: string; networkName: string }

type UnitSelectorProps = {
  units: UnitOption[]
  selectedUnitId: string
  showAllOption: boolean
}

export function UnitSelector({ units, selectedUnitId, showAllOption }: UnitSelectorProps) {
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
        <Building2 className="h-3.5 w-3.5" />
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
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground outline-none transition-colors hover:bg-accent hover:border-[oklch(0.76_0.14_78/0.4)] disabled:opacity-50"
      >
        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="max-w-[180px] truncate">{displayName}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-60">
        {showAllOption && (
          <>
            <DropdownMenuItem onClick={() => selectUnit("all")} className="gap-2">
              <Check
                className={cn(
                  "h-3.5 w-3.5 shrink-0",
                  selectedUnitId === "all"
                    ? "opacity-100 text-[oklch(0.76_0.14_78)]"
                    : "opacity-0"
                )}
              />
              <span>Todas as unidades</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {units.map((unit) => (
          <DropdownMenuItem
            key={unit.id}
            onClick={() => selectUnit(unit.id)}
            className="gap-2"
          >
            <Check
              className={cn(
                "h-3.5 w-3.5 shrink-0",
                selectedUnitId === unit.id
                  ? "opacity-100 text-[oklch(0.76_0.14_78)]"
                  : "opacity-0"
              )}
            />
            <div>
              <div className="text-sm font-medium">{unit.name}</div>
              <div className="text-xs text-muted-foreground">{unit.networkName}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
